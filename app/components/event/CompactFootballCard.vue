<template>
  <div
    :class="[
      'group relative rounded-2xl overflow-hidden transition-all duration-300 p-4 flex flex-col gap-1.5',
      displayOnly ? 'cursor-default' : 'hover:-translate-y-1 cursor-pointer',
    ]"
    style="background: linear-gradient(180deg, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0.01) 100%); border: 1px solid rgba(255,255,255,0.06);"
    @click="!displayOnly && $emit('click')"
  >
    <!-- Competition name -->
    <span class="text-[11px] font-medium text-gray-500 uppercase tracking-wider truncate">
      {{ event.competition.displayName }}
    </span>

    <!-- Teams & Score (grouped to match motorsport race identity height) -->
    <div class="flex flex-col items-center gap-0.5">
      <!-- Teams: names outward from center, logos inward -->
      <div class="flex items-center justify-center gap-3 w-full">
        <!-- Home: name right-aligned, then logo -->
        <div class="flex-1 flex items-center justify-end gap-2 min-w-0">
          <span class="text-sm font-semibold text-white truncate">{{ event.homeTeamName }}</span>
          <div v-if="!event.homeTeamLogoUrl" class="w-5 h-5 rounded-full bg-gray-700 flex-shrink-0"></div>
          <Image v-else :src="event.homeTeamLogoUrl" alt="Home" width="20" class="flex-shrink-0" />
        </div>

        <!-- Away: logo then name left-aligned -->
        <div class="flex-1 flex items-center gap-2 min-w-0">
          <div v-if="!event.awayTeamLogoUrl" class="w-5 h-5 rounded-full bg-gray-700 flex-shrink-0"></div>
          <Image v-else :src="event.awayTeamLogoUrl" alt="Away" width="20" class="flex-shrink-0" />
          <span class="text-sm font-semibold text-white truncate">{{ event.awayTeamName }}</span>
        </div>
      </div>

      <!-- Score (centered below) -->
      <div class="flex items-center justify-center gap-1.5 pt-0.5">
        <span class="text-sm font-extrabold text-white tabular-nums leading-none">
          {{ event.homeScore ?? '-' }}
        </span>
        <span class="text-sm text-gray-500 leading-none">:</span>
        <span class="text-sm font-extrabold text-white tabular-nums leading-none">
          {{ event.awayScore ?? '-' }}
        </span>
      </div>
    </div>

    <!-- Venue -->
    <div v-if="event.location" class="text-center">
      <span class="text-[11px] text-gray-500 truncate">{{ event.location }}</span>
    </div>

    <!-- Gameweek below -->
    <div class="text-center">
      <span class="text-[11px] text-gray-500">Gameweek {{ event.round ?? '-' }}</span>
    </div>

    <!-- Bottom status bar (interactive only) -->
    <div v-if="!displayOnly" class="flex items-center justify-between pt-2 border-t border-white/5">
      <div @click.stop>
        <button
          class="flex items-center gap-1.5 px-2 py-1 -ml-2 rounded-full transition-colors hover:bg-white/5"
          @click="toggleStatusMenu"
        >
          <i :class="watchIcon" class="text-xs" :style="{ color: watchIconColor }"></i>
          <span class="text-[11px] text-gray-400">{{ statusLabel }}</span>
          <i class="pi pi-chevron-down text-[9px] text-gray-500"></i>
        </button>
        <Menu ref="statusMenuRef" :model="statusMenuItems" popup />
      </div>
      <span class="text-[11px] text-gray-500">{{ shortDate }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import type { FootballEventDetails } from '~/types/football/events'
import type { WatchedStatus } from '~/types/events'
import { useWatchStatusIcon } from '~/composables/useWatchStatusIcon'

const props = defineProps<{
  event: FootballEventDetails
  watchStatus: WatchedStatus | null
  displayOnly?: boolean
}>()

const emit = defineEmits<{
  (e: 'update:watchStatus', value: WatchedStatus): void
  (e: 'click'): void
}>()

const { getWatchStatusIcon } = useWatchStatusIcon()

const localStatus = ref<WatchedStatus>(props.watchStatus ?? 'UNWATCHED')
const statusMenuRef = ref()

watch(() => props.watchStatus, (v) => {
  localStatus.value = v ?? 'UNWATCHED'
})

function toggleStatusMenu(event: Event) {
  statusMenuRef.value?.toggle(event)
}

function setStatus(status: WatchedStatus) {
  localStatus.value = status
  emit('update:watchStatus', status)
}

const statusLabel = computed(() => {
  const labels: Record<WatchedStatus, string> = {
    UNWATCHED: 'Unwatched',
    IN_PERSON: 'In Person',
    LIVE: 'Live',
    REPLAY: 'Replay',
    HIGHLIGHTS: 'Highlights',
  }
  return labels[localStatus.value] ?? 'Unwatched'
})

const watchIcon = computed(() => getWatchStatusIcon(localStatus.value))

const watchIconColor = computed(() => {
  switch (localStatus.value) {
    case 'UNWATCHED': return '#9ca3af'
    case 'IN_PERSON': return '#34d399'
    case 'LIVE': return '#f87171'
    case 'REPLAY': return '#60a5fa'
    case 'HIGHLIGHTS': return '#facc15'
    default: return '#9ca3af'
  }
})

const statusMenuItems = computed(() => [
  {
    label: 'Unwatched',
    icon: 'pi pi-eye-slash',
    command: () => setStatus('UNWATCHED'),
    class: localStatus.value === 'UNWATCHED' ? 'font-bold' : '',
  },
  {
    label: 'In Person',
    icon: 'pi pi-ticket',
    command: () => setStatus('IN_PERSON'),
    class: localStatus.value === 'IN_PERSON' ? 'font-bold' : '',
  },
  {
    label: 'Live',
    icon: 'pi pi-clock',
    command: () => setStatus('LIVE'),
    class: localStatus.value === 'LIVE' ? 'font-bold' : '',
  },
  {
    label: 'Replay',
    icon: 'pi pi-play-circle',
    command: () => setStatus('REPLAY'),
    class: localStatus.value === 'REPLAY' ? 'font-bold' : '',
  },
  {
    label: 'Highlights',
    icon: 'pi pi-video',
    command: () => setStatus('HIGHLIGHTS'),
    class: localStatus.value === 'HIGHLIGHTS' ? 'font-bold' : '',
  },
])

const shortDate = computed(() => {
  if (!props.event.dateTime) return '-'
  return new Date(props.event.dateTime).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  })
})
</script>
