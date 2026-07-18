<template>
  <Dialog
    v-model:visible="visible"
    modal
    :header="dialogTitle"
    class="!max-w-md w-full"
    :pt="{
      root: { class: '!bg-gray-900 !border !border-white/10 !rounded-2xl' },
      header: { class: '!text-white !border-b !border-white/5 !pb-4' },
      content: { class: '!text-gray-300 !pt-4' },
    }"
  >
    <!-- Football details -->
    <template v-if="sport === 'football'">
      <div class="flex items-center justify-center gap-6 mb-6">
        <div class="flex flex-col items-center gap-2">
          <Image v-if="footballEvent?.homeTeamLogoUrl" :src="footballEvent.homeTeamLogoUrl" alt="Home" width="36" />
          <span class="text-xs text-gray-300 font-medium">{{ footballEvent?.homeTeamName }}</span>
        </div>
        <div class="text-center flex-shrink-0">
          <span class="text-2xl font-extrabold text-white">
            {{ footballEvent?.homeScore ?? '-' }} : {{ footballEvent?.awayScore ?? '-' }}
          </span>
        </div>
        <div class="flex flex-col items-center gap-2">
          <Image v-if="footballEvent?.awayTeamLogoUrl" :src="footballEvent.awayTeamLogoUrl" alt="Away" width="36" />
          <span class="text-xs text-gray-300 font-medium">{{ footballEvent?.awayTeamName }}</span>
        </div>
      </div>

      <dl class="grid grid-cols-2 gap-x-4 gap-y-3 text-sm">
        <dt class="text-gray-500">Competition</dt>
        <dd class="text-gray-200">{{ footballEvent?.competition.displayName }}</dd>
        <dt class="text-gray-500">Gameweek</dt>
        <dd class="text-gray-200">{{ footballEvent?.round ?? '-' }}</dd>
        <dt class="text-gray-500">Date & Time</dt>
        <dd class="text-gray-200">{{ formatDate(footballEvent?.dateTime) }}</dd>
        <dt class="text-gray-500">Status</dt>
        <dd class="text-gray-200">{{ formatEnumToString(footballEvent?.status) }}</dd>
        <dt class="text-gray-500">Location</dt>
        <dd class="text-gray-200">{{ footballEvent?.location ?? '-' }}</dd>
      </dl>
    </template>

    <!-- Motorsport details -->
    <template v-else>
      <div class="flex flex-col items-center gap-2 mb-6">
        <Image v-if="motorsportEvent?.flagUrl" :src="motorsportEvent.flagUrl" alt="Flag" width="32" />
        <span class="text-lg font-bold text-white">{{ motorsportEvent?.raceName ?? motorsportEvent?.title }}</span>
        <span v-if="motorsportEvent?.winner" class="text-sm text-emerald-400 flex items-center gap-1">
          <i class="pi pi-trophy"></i>
          Winner: {{ motorsportEvent.winner }}
        </span>
      </div>

      <dl class="grid grid-cols-2 gap-x-4 gap-y-3 text-sm">
        <dt class="text-gray-500">Competition</dt>
        <dd class="text-gray-200">{{ motorsportEvent?.competition.displayName }}</dd>
        <dt class="text-gray-500">Circuit</dt>
        <dd class="text-gray-200">{{ motorsportEvent?.circuitName ?? '-' }}</dd>
        <dt class="text-gray-500">Round</dt>
        <dd class="text-gray-200">{{ motorsportEvent?.round ?? '-' }}</dd>
        <dt class="text-gray-500">Date & Time</dt>
        <dd class="text-gray-200">{{ formatDate(motorsportEvent?.dateTime) }}</dd>
        <dt class="text-gray-500">Status</dt>
        <dd class="text-gray-200">{{ formatEnumToString(motorsportEvent?.status) }}</dd>
        <dt class="text-gray-500">Location</dt>
        <dd class="text-gray-200">{{ motorsportEvent?.location ?? '-' }}</dd>
      </dl>
    </template>

    <!-- Watch Status in dialog -->
    <div class="mt-6 pt-4 border-t border-white/5">
      <label class="block mb-2 text-sm text-gray-400">Watch Status</label>
      <Select
        :model-value="dialogStatus"
        :options="statusOptions"
        option-label="label"
        option-value="value"
        class="w-full"
        @change="onDialogStatusChange"
      />
    </div>
  </Dialog>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import type { FootballEventDetails } from '~/types/football/events'
import type { MotorsportEventDetails } from '~/types/motorsport/events'
import type { WatchedStatus } from '~/types/events'
import { useWatchStatusOptions } from '~/composables/useWatchStatusOptions'
import { useFormatters } from '~/composables/useFormatters'

const props = defineProps<{
  sport: 'football' | 'motorsport'
  footballEvent?: FootballEventDetails | null
  motorsportEvent?: MotorsportEventDetails | null
  watchStatus: WatchedStatus | null
}>()

const emit = defineEmits<{
  (e: 'update:watchStatus', value: WatchedStatus): void
}>()

const visible = defineModel<boolean>('visible', { default: false })

const { watchStatusOptions } = useWatchStatusOptions()
const { formatEnumToString, formatDate } = useFormatters()
const statusOptions = watchStatusOptions

const dialogStatus = ref<WatchedStatus>(props.watchStatus ?? 'UNWATCHED')

watch(() => props.watchStatus, (v) => {
  dialogStatus.value = v ?? 'UNWATCHED'
})

function onDialogStatusChange(e: any) {
  dialogStatus.value = e.value
  emit('update:watchStatus', e.value)
}

const dialogTitle = computed(() => {
  if (props.sport === 'football') return `${props.footballEvent?.homeTeamName} vs ${props.footballEvent?.awayTeamName}`
  return props.motorsportEvent?.raceName ?? props.motorsportEvent?.title ?? 'Event Details'
})
</script>
