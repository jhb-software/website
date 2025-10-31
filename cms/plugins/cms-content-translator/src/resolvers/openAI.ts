import type { TranslateResolver } from './types'

import { chunkArray } from '../utils/chunkArray'

export type OpenAIPrompt = (args: {
  localeFrom: string
  localeTo: string
  texts: string[]
}) => string

export type OpenAIResolverConfig = {
  apiKey: string
  baseUrl?: string
  /**
   * How many texts to include into 1 request
   * @default 100
   */
  chunkLength?: number
  /**
   * @default "gpt-4o-mini"
   */
  model?: string
  prompt?: OpenAIPrompt
}

type OpenAIResponse = {
  choices: {
    message: {
      content: string
    }
  }[]
}

const defaultPrompt: OpenAIPrompt = ({ localeFrom, localeTo, texts }) => {
  return `Translate the following array of strings from ${localeFrom.toUpperCase()} to ${localeTo.toUpperCase()}. Ensure the response includes only the translated array, maintaining the exact structure as the input: ${JSON.stringify(texts)}`
}

export const openAIResolver = ({
  apiKey,
  baseUrl,
  chunkLength = 100,
  model = 'gpt-4o-mini',
  prompt = defaultPrompt,
}: OpenAIResolverConfig): TranslateResolver => {
  return {
    key: 'openai',
    resolve: async ({ localeFrom, localeTo, req, texts }) => {
      const apiUrl = `${baseUrl || 'https://api.openai.com'}/v1/chat/completions`

      try {
        const response: {
          data: OpenAIResponse
          success: boolean
        }[] = await Promise.all(
          chunkArray(texts, chunkLength).map(async texts => {
            return fetch(apiUrl, {
              body: JSON.stringify({
                messages: [
                  {
                    content: prompt({ localeFrom, localeTo, texts }),
                    role: 'user',
                  },
                ],
                model,
              }),
              headers: {
                Authorization: `Bearer ${apiKey}`,
                'Content-Type': 'application/json',
              },
              method: 'post',
            }).then(async res => {
              const data = await res.json()

              if (!res.ok)
                req.payload.logger.info({
                  message: 'An error occurred when trying to translate the data using OpenAI API',
                  openAIresponse: data,
                })

              return {
                data,
                success: res.ok,
              }
            })
          }),
        )

        const translated: string[] = []

        for (const { data, success } of response) {
          if (!success)
            return {
              success: false as const,
            }

          const content = data?.choices?.[0]?.message?.content

          if (!content) {
            req.payload.logger.error(
              'An error occurred when trying to translate the data using OpenAI API - missing content in the response',
            )

            return {
              success: false as const,
            }
          }

          let translatedChunk: string[] = []

          try {
            // TODO: parsing the string fails, if a string in the array contains a double quote ("). This can happen when the string to
            // translate contains some kind of quote and the LLM translates this to a double quote. E.g.:
            // to translate: ["", "Dieser Text soll “übersetzt“ werden"]
            // translated: ["", "This text should be "translated""] <-- Not a valid JSON array

            translatedChunk = JSON.parse(content)
          } catch (e) {
            req.payload.logger.error({
              fullContent: content,
              message: 'An error occurred when trying to parse the content',
            })

            return {
              success: false as const,
            }
          }

          if (!Array.isArray(translatedChunk)) {
            req.payload.logger.error({
              data: translatedChunk,
              fullContent: content,
              message:
                'An error occurred when trying to translate the data using OpenAI API - parsed content is not an array',
            })

            return {
              success: false as const,
            }
          }

          for (const text of translatedChunk) {
            if (text && typeof text !== 'string') {
              req.payload.logger.error({
                chunkData: translatedChunk,
                data: text,
                fullContent: content,
                message:
                  'An error occurred when trying to translate the data using OpenAI API - parsed content is not a string',
              })

              return {
                success: false as const,
              }
            }

            translated.push(text)
          }
        }

        return {
          success: true as const,
          translatedTexts: translated,
        }
      } catch (e) {
        if (e instanceof Error) {
          req.payload.logger.info({
            message: 'An error occurred when trying to translate the data using OpenAI API',
            originalErr: e.message,
          })
        }

        return { success: false as const }
      }
    },
  }
}
