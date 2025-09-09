<template>
  <AccordionPanel :value="panelValue">
    <AccordionHeader>
      <div class="grid grid-cols-[1fr_auto_1fr] items-center w-full gap-2">
        <!-- Home team -->
        <div class="flex justify-end items-center gap-1 min-w-0">
        <span class="text-sm font-medium truncate whitespace-normal break-words line-clamp-2 text-right">
          {{ event.homeTeamName }}
        </span>
          <div
              v-if="!event.homeTeamLogoUrl"
              class="w-6 h-6 bg-gray-300 rounded-full flex-shrink-0"
          ></div>
          <Image
              v-else
              :src="event.homeTeamLogoUrl"
              alt="Home Team Logo"
              width="22"
          />
        </div>

        <!-- Score + Week + Watch Tag -->
        <div class="flex flex-col items-center justify-center px-2 space-y-1">
          <div class="flex items-center gap-1 font-semibold text-sm">
            <span>{{ event.homeScore ?? "-" }}</span>
            <span>-</span>
            <span>{{ event.awayScore ?? "-" }}</span>
          </div>
          <div class="text-xs text-gray-500">Week {{ event.round }}</div>
          <Tag
              :icon="getWatchStatusIcon(localWatchStatus)"
              :severity="localWatchStatus === 'UNWATCHED' ? 'secondary' : 'success'"
          />
        </div>

        <!-- Away team -->
        <div class="flex justify-start items-center gap-1 min-w-0">
          <div
              v-if="!event.awayTeamLogoUrl"
              class="w-6 h-6 bg-gray-300 rounded-full flex-shrink-0"
          ></div>
          <Image
              v-else
              :src="event.awayTeamLogoUrl"
              alt="Away Team Logo"
              width="22"
          />
          <span class="text-sm font-medium truncate whitespace-normal break-words line-clamp-2 text-left">
          {{ event.awayTeamName }}
        </span>
        </div>
      </div>
    </AccordionHeader>

    <AccordionContent>
      <div class="space-y-3 text-sm">
        <dl class="grid grid-cols-2 gap-x-4 gap-y-2">
          <dt class="font-semibold">Competition:</dt>
          <dd>{{ event.competition }}</dd>

<!--          <dt class="font-semibold">Week:</dt>-->
<!--          <dd>{{ event.round ?? "-" }}</dd>-->

          <dt class="font-semibold">Start Time (Local time):</dt>
          <dd>{{ formatDate(event.dateTime) }}</dd>

          <dt class="font-semibold">Status:</dt>
          <dd>{{ formatEnumToString(event.status) }}</dd>

<!--          <dt class="font-semibold">Location:</dt>-->
<!--          <dd>{{ event.location ?? "-" }}</dd>-->
        </dl>

        <!-- Watch Status selector -->
        <div>
          <label class="block mb-1 text-sm font-medium">Watch Status</label>
          <Select
              v-model="localWatchStatus"
              :options="watchStatusOptions"
              optionLabel="label"
              optionValue="value"
              placeholder="Select status"
              class="w-full"
              @change="emitWatchStatus"
          />
        </div>
      </div>
    </AccordionContent>
  </AccordionPanel>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";
import { useWatchStatusIcon } from "~/composables/useWatchStatusIcon";
import { useWatchStatusOptions } from "~/composables/useWatchStatusOptions";
import { useFormatters } from "~/composables/useFormatters";

import type { FootballEventDetails } from "~/types/football/events";
import type { WatchedStatus } from "~/types/events";

const props = defineProps<{
  event: FootballEventDetails;
  watchStatus?: WatchedStatus | null;
}>();

const emit = defineEmits<{
  (e: "update:watchStatus", value: WatchedStatus): void;
}>();

const panelValue = String(props.event.id);
const localWatchStatus = ref<WatchedStatus>(props.watchStatus ?? "UNWATCHED");

const { getWatchStatusIcon } = useWatchStatusIcon();
const { watchStatusOptions } = useWatchStatusOptions();
const { formatEnumToString, formatDate } = useFormatters();

function emitWatchStatus() {
  emit("update:watchStatus", localWatchStatus.value);
}

watch(
    () => props.watchStatus,
    (v) => {
      localWatchStatus.value = v ?? "UNWATCHED";
    }
);
</script>
