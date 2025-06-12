'use server'
import { Media } from '@/payload-types'
import config from '@payload-config'
import OpenAI from 'openai'
import { zodResponseFormat } from 'openai/helpers/zod'
import { ChatCompletionContentPartText } from 'openai/resources/chat/completions.mjs'
import { CollectionSlug, getPayload } from 'payload'
import { z } from 'zod'
import { getImageThumbnail } from '../utilities/getImageThumbnail'
import { getUserFromHeaders } from '../utilities/getUserFromHeaders'
import { getGenerationCost } from '../utilities/logGenerationCost'

/**
 * Generates alt text for an image using OpenAI's vision model. Returns the result without updating the document.
 *
 * Used by the UI to generate the image alt text of ONE image in ONE locale.
 */
export async function generateAltText({
  collection,
  id,
  locale,
  context,
  model,
}: {
  collection: CollectionSlug
  id: string
  locale: string
  context?: string
  model: 'gpt-4.1-nano' | 'gpt-4.1-mini'
}): Promise<{
  altText: string
  keywords: string[]
}> {
  try {
    const payload = await getPayload({ config: config })
    const user = await getUserFromHeaders({ payload })

    if (!user) {
      throw new Error('Unauthorized')
    }

    const imageDoc = await payload.findByID({
      collection: collection as CollectionSlug,
      id: id,
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
      altText: z.string().describe('A concise, descriptive alt text for the image'),
      keywords: z.array(z.string()).describe('Keywords that describe the content of the image'),
    })

    const response = await openai.chat.completions.parse({
      model,
      messages: [
        {
          role: 'system',
          content: `
            You are an expert at analyzing images and creating descriptive image alt text. 
            
            Please analyze the given image and provide the following:
            - A concise, descriptive alt text (1-2 sentences) as "altText". Focus on the subject, action, and setting. Avoid phrases like 'Image of', 'A picture of', or 'Photo showing'. Be specific and include relevant details like location or context if visible. Make no assumptions.
            - A list of keywords that describe the content (e.g., ["Camel", "Palm trees", "Desert"]) as "keywords"

            If a context is provided, use it to enhance the alt text.

            Format your response as a JSON object. You must respond in the ${locale} language.
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
            ...(context
              ? [
                  {
                    type: 'text',
                    text: context,
                  } satisfies ChatCompletionContentPartText,
                ]
              : []),
          ],
        },
      ],
      // limit the response tokens and costs per request
      max_completion_tokens: 150,
      response_format: zodResponseFormat(schema, 'data'),
    })

    console.log({ imageId: id, ...getGenerationCost(response, model) })

    const result = response.choices[0]?.message?.parsed

    if (!result) {
      throw new Error('No result from OpenAI')
    }

    return result
  } catch (error) {
    console.error('Error generating alt text:', error)
    throw new Error(
      `Error generating alt text: ${error instanceof Error ? error.message : 'Unknown error'}`,
    )
  }
}
