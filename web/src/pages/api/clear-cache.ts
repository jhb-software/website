import { clearCache } from '@/cms/cache'
import type { APIRoute } from 'astro'

export const prerender = false

export const POST: APIRoute = async () => {
  if (!import.meta.env.DEV) {
    return new Response(
      JSON.stringify({
        success: false,
        message: 'Cache clear is only available in development mode',
      }),
      {
        status: 400,
      },
    )
  }

  try {
    console.log('Clearing cache...')
    clearCache()
    return new Response(
      JSON.stringify({
        success: true,
        message: 'Cache cleared successfully',
      }),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
        },
      },
    )
  } catch (error) {
    return new Response(
      JSON.stringify({
        success: false,
        message: error instanceof Error ? error.message : 'Failed to clear cache',
      }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
        },
      },
    )
  }
}
