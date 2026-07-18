import { ref, onMounted } from 'vue'
import { fetchLandingEvents } from '~/services/landingEvents'
import type { LandingEvent } from '~/types/landing'

export function useLandingPreviewEvents() {
  const events = ref<LandingEvent[]>([])
  const error = ref<string | null>(null)

  onMounted(async () => {
    try {
      events.value = await fetchLandingEvents()
    } catch (err: any) {
      console.warn('[LandingPreview] fetch failed:', err?.message ?? err)
      error.value = err?.message ?? 'Unknown error'
    }
  })

  return { events, error }
}
