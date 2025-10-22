'use server'

import { Media } from '@/payload-types'
import config from '@payload-config'
import OpenAI from 'openai'
import { ChatCompletionContentPartText } from 'openai/resources/chat/completions.mjs'
import pMap from 'p-map'
import { BasePayload, CollectionSlug, getPayload } from 'payload'
import { z } from 'zod'
import { getImageThumbnail } from '../utilities/getImageThumbnail'
import { getUserFromHeaders } from '../utilities/getUserFromHeaders'
import { getGenerationCost } from '../utilities/logGenerationCost'
import { zodResponseFormat } from '../utilities/zodResponesFormat'

/**
 * Generates and updates the alt text for multiple images using OpenAI's vision model in both English and German.
 */
export async function bulkUpdateAltTexts({
  collection,
  ids,
  model,
}: {
  collection: CollectionSlug
  ids: string[]
  model: 'gpt-4.1-nano' | 'gpt-4.1-mini'
}): Promise<{
  updatedDocs: number
  totalDocs: number
  erroredDocs: string[]
}> {
  try {
    const payload = await getPayload({ config: config })
    const user = await getUserFromHeaders({ payload })

    if (!user) {
      throw new Error('Unauthorized')
    }

    let updatedDocs = 0
    const erroredDocs: string[] = []

    await pMap(
      ids,
      async (id) => {
        try {
          await generateAndUpdateAltText({ payload, id, collection, model })
          updatedDocs++
          console.log(
            `${updatedDocs}/${ids.length} updated (${Math.round((updatedDocs / ids.length) * 100)}%)`,
          )
        } catch (error) {
          console.error(`Error generating alt text for image with id ${id}:`, error)
          erroredDocs.push(id)
        }
      },
      { concurrency: 16, stopOnError: true },
    )

    if (erroredDocs.length > 0) {
      console.error(
        `Failed to generate alt text for the following images: ${erroredDocs.join(', ')}`,
      )
    }

    return {
      updatedDocs: updatedDocs,
      totalDocs: ids.length,
      erroredDocs: erroredDocs,
    }
  } catch (error) {
    console.error('Error generating alt text:', error)
    throw new Error(
      `Error generating alt text: ${error instanceof Error ? error.message : 'Unknown error'}`,
    )
  }
}

async function generateAndUpdateAltText({
  payload,
  id,
  collection,
  model,
}: {
  payload: BasePayload
  id: string
  collection: CollectionSlug
  model: 'gpt-4.1-nano' | 'gpt-4.1-mini'
}) {
  const imageDoc = await payload.findByID({
    collection: collection as CollectionSlug,
    id: id as string,
    depth: 0,
  })

  if (!imageDoc) {
    throw new Error('Image not found')
  }

  const thumbnailUrl = getImageThumbnail(imageDoc as Media)

  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  })

  const schema = z.object({
    en: z.object({
      altText: z.string().describe('A concise, descriptive alt text for the image in English'),
      keywords: z
        .array(z.string())
        .describe('Keywords that describe the content of the image in English'),
    }),
    de: z.object({
      altText: z.string().describe('A concise, descriptive alt text for the image in German'),
      keywords: z
        .array(z.string())
        .describe('Keywords that describe the content of the image in German'),
    }),
  })

  const response = await openai.chat.completions.parse({
    model,
    messages: [
      {
        role: 'system',
        content: `
      You are an expert at analyzing images and creating descriptive image alt text. 
      
      Please analyze the given image and provide the following in both English and German:
      - A concise, localized descriptive alt text (1-2 sentences) as "altText". Focus on the subject, action, and setting. Avoid phrases like 'Image of', 'A picture of', or 'Photo showing'. Be specific and include relevant details like location or context if visible. Make no assumptions.
      - A localized list of keywords that describe the content (e.g., ["Camel", "Palm trees", "Desert"]) as "keywords"
    
      If a context is provided, use it to enhance the alt text.
      
      Format your response as a JSON object with "en" and "de" keys, each containing "altText", "keywords" and "slug".
    `,
      },
      {
        role: 'user',
        content: [
          {
            type: 'image_url',
            image_url: { url: thumbnailUrl },
          },
          ...('filename' in imageDoc && imageDoc.filename
            ? [
                {
                  type: 'text',
                  text: imageDoc.filename,
                } satisfies ChatCompletionContentPartText,
              ]
            : []),
          ...('context' in imageDoc && imageDoc.context
            ? [
                {
                  type: 'text',
                  text: imageDoc.context,
                } satisfies ChatCompletionContentPartText,
              ]
            : []),
        ],
      },
    ],
    max_completion_tokens: 300,
    response_format: zodResponseFormat(schema, 'data'),
  })

  console.log({ imageId: id, ...getGenerationCost(response, model) })

  const result = response.choices[0]?.message?.parsed

  if (!result) {
    throw new Error('No result from OpenAI')
  }

  for (const locale of ['en', 'de'] as const) {
    await payload.update({
      collection: collection as CollectionSlug,
      id: id as string,
      locale: locale as 'en' | 'de',
      data: {
        alt: result[locale].altText,
        keywords: result[locale].keywords,
      },
    })
  }
}
