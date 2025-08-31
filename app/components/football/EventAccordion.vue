<template>
  <AccordionPanel :value="panelValue">
    <AccordionHeader>
      <div class="relative w-full flex items-center justify-between">
        <!-- Home team -->
        <div class="flex-1 flex justify-end pr-2">
          <div class="flex items-center gap-1 min-w-0">
            <span class="text-sm font-medium truncate">{{ event.homeTeamName }}</span>
            <div v-if="!event.homeTeamLogoUrl" class="w-6 h-6 bg-gray-300 rounded-full flex-shrink-0"></div>
            <Image v-else :src="event.homeTeamLogoUrl" alt="Home Team Logo" width="22" />
          </div>
        </div>

        <!-- Score -->
        <div class="flex flex-col items-center justify-center px-4">
          <div class="flex items-center gap-1 font-semibold text-sm">
            <span>{{ event.homeScore ?? "-" }}</span>
            <span>-</span>
            <span>{{ event.awayScore ?? "-" }}</span>
          </div>
          <div class="text-xs text-gray-500 mt-1">Week {{ event.round }}</div>
        </div>

        <!-- Away team -->
        <div class="flex-1 flex justify-start pl-2">
          <div class="flex items-center gap-1 min-w-0">
            <div v-if="!event.awayTeamLogoUrl" class="w-6 h-6 bg-gray-300 rounded-full flex-shrink-0"></div>
            <Image v-else :src="event.awayTeamLogoUrl" alt="Away Team Logo" width="22" />
            <span class="text-sm font-medium truncate">{{ event.awayTeamName }}</span>
          </div>
        </div>

        <!-- Watch tag -->
        <div class="absolute right-0 top-1/2 transform -translate-y-1/2 pr-3">
          <Tag v-show="localWatchStatus !== 'UNWATCHED'" icon="pi pi-check"></Tag>
        </div>
      </div>
    </AccordionHeader>



    <AccordionContent>
      <div class="space-y-3 text-sm">
        <dl class="grid grid-cols-2 gap-x-4 gap-y-2">

          <dt class="font-semibold">Competition:</dt>
          <dd>{{ event.competition }}</dd>

          <dt class="font-semibold">Week/Round:</dt>
          <dd>{{ event.round ?? "-" }}</dd>

          <dt class="font-semibold">Start Time:</dt>
          <dd>{{ formattedDate }}</dd>

          <dt class="font-semibold">Status:</dt>
          <dd>{{ formatEnumToString(event.status) }}</dd>

          <dt class="font-semibold">Location:</dt>
          <dd>{{ event.location ?? "-" }}</dd>

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


<div class="w-6 h-6 bg-gray-300 rounded-full flex-shrink-0"></div>
<script setup lang="ts">
import { ref, computed, watch } from "vue";
import type { FootballEventDetails } from "~/types/football/events";
import type { WatchedStatus } from "~/types/events";

const props = defineProps<{
  event: FootballEventDetails;
  watchStatus?: WatchedStatus | null;
}>();

const emit = defineEmits<{
  (e: "update:watchStatus", value: WatchedStatus): void;
}>();

// Unique value used by AccordionPanel
const panelValue = String(props.event.id);

// local watch status model
const localWatchStatus = ref<WatchedStatus>(props.watchStatus ?? "UNWATCHED");

const watchStatusOptions = [
  { label: "Unwatched", value: "UNWATCHED" },
  { label: "In Person", value: "IN_PERSON" },
  { label: "Live", value: "LIVE" },
  { label: "Replay", value: "REPLAY" },
  { label: "Highlights", value: "HIGHLIGHTS" },
];

// Format date/time
const formattedDate = computed(() =>
    new Date(props.event.dateTime).toLocaleString("en-AU", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
);

// Helper to format enums
function formatEnumToString(value?: string) {
  if (!value) return "-";
  return String(value)
      .toLowerCase()
      .split("_")
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(" ");
}

function emitWatchStatus() {
  emit("update:watchStatus", localWatchStatus.value);
}

// Keep local value in sync if parent updates
watch(
    () => props.watchStatus,
    (v) => {
      localWatchStatus.value = v ?? "UNWATCHED";
    }
);
</script>
