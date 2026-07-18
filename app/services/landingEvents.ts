import type { LandingEvent } from '~/types/landing'

export async function fetchLandingEvents(): Promise<LandingEvent[]> {
  const config = useRuntimeConfig()
  const baseUrl = config.public.apiBaseUrl as string

  const data = await $fetch<{ events: LandingEvent[] }>(
    `${baseUrl}/api/landing/events`,
    {
      // Public endpoint — no auth cookies needed
      credentials: 'omit',
    },
  )

  return data.events ?? []
}
