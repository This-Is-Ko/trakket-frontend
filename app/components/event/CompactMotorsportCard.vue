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

    <!-- Race identity -->
    <div class="flex flex-col items-center gap-0.5 px-3">
      <div class="flex items-center justify-center gap-2 min-w-0 w-full">
        <Image v-if="event.flagUrl" :src="event.flagUrl" alt="Flag" width="20" class="flex-shrink-0" />
        <span class="text-sm font-semibold text-white text-center truncate">
          {{ event.raceName ?? event.title }}
        </span>
      </div>
      <span class="text-xs leading-none flex items-center justify-center gap-1 min-w-0 w-full" :class="event.winner ? 'text-emerald-400' : 'text-gray-500'">
        <i class="pi pi-trophy text-[10px] flex-shrink-0"></i>
        <span class="truncate">Winner: {{ event.winner ?? '\u2014' }}</span>
      </span>
    </div>

    <!-- Circuit / Round below -->
    <div class="text-center">
      <span class="text-[11px] text-gray-500 truncate">{{ event.circuitName ?? '-' }} &middot; Round {{ event.round ?? '-' }}</span>
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
import type { MotorsportEventDetails } from '~/types/motorsport/events'
import type { WatchedStatus } from '~/types/events'
import { useWatchStatusIcon } from '~/composables/useWatchStatusIcon'

const props = defineProps<{
  event: MotorsportEventDetails
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
  const d = new Date(props.event.dateTime)
  const opts: Intl.DateTimeFormatOptions = { month: 'short', day: 'numeric' }
  if (d.getFullYear() !== new Date().getFullYear()) opts.year = 'numeric'
  return d.toLocaleDateString('en-US', opts)
})
</script>
