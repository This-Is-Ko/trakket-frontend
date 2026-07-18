import { ref, onMounted } from 'vue'
import { fetchFootballEventsWithStatus } from '~/services/footballEvents'
import { fetchMotorsportEventsWithStatus } from '~/services/motorsportEvents'
import type { FootballEventWrapper } from '~/types/football/events'
import type { MotorsportEventWrapper } from '~/types/motorsport/events'

export function useLandingPreviewEvents() {
  const footballEvents = ref<FootballEventWrapper[]>([])
  const motorsportEvents = ref<MotorsportEventWrapper[]>([])
  const error = ref<string | null>(null)

  onMounted(async () => {
    try {
      const [fb, ms] = await Promise.all([
        fetchFootballEventsWithStatus({
          competition: '',
          status: 'COMPLETED',
          page: 0,
          pageSize: 4,
          ascending: false,
        }),
        fetchMotorsportEventsWithStatus({
          competition: '',
          status: 'COMPLETED',
          page: 0,
          pageSize: 4,
          ascending: false,
        }),
      ])
      console.log('[LandingPreview] football:', fb.events.length, 'motorsport:', ms.events.length)
      footballEvents.value = fb.events as FootballEventWrapper[]
      motorsportEvents.value = ms.events as MotorsportEventWrapper[]
    } catch (err: any) {
      console.warn('[LandingPreview] fetch failed:', err?.message ?? err)
      error.value = err?.message ?? 'Unknown error'
    }
  })

  return { footballEvents, motorsportEvents, error }
}
