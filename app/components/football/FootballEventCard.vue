<template>
  <Card class="w-full max-w-xs relative overflow-hidden">
    <template #title>
      <div class="absolute top-2 right-2">
        <div
            v-if="localWatchStatus !== 'UNWATCHED'"
        >
          <Tag icon="pi pi-check">WATCHED</Tag>
        </div>
      </div>
    </template>

    <template #content>
      <div class="flex justify-between items-center px-4">
        <!-- Home Team -->
        <div class="flex flex-col items-center">
          <div class="w-16 h-16 bg-red-500"></div>
          <span class="mt-2 text-xs text-gray-700 truncate">{{ event.homeTeam }}</span>
        </div>

        <!-- Score -->
        <div class="text-2xl font-bold text-gray-600">
          {{ event.homeScore ?? "-" }} - {{ event.awayScore ?? "-" }}
        </div>

        <!-- Away Team -->
        <div class="flex flex-col items-center">
          <div class="w-16 h-16 bg-red-500"></div>
          <span class="mt-2 text-xs text-gray-700 truncate">{{ event.awayTeam }}</span>
        </div>
      </div>
    </template>

    <template #footer>
      <div class="text-center">
        <div class="text-sm font-medium text-gray-700">{{ event.competition }}</div>
        <div class="text-xs text-gray-500">{{ event.subtitle ?? "-" }}</div>
      </div>
      <div class="text-center text-xs text-gray-400">
        {{ formattedDate }}
      </div>
    </template>
  </Card>
</template>

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

const localWatchStatus = ref<WatchedStatus>(props.watchStatus ?? "UNWATCHED");

const formattedDate = computed(() =>
    new Date(props.event.dateTime).toLocaleString()
);

watch(
    () => props.watchStatus,
    (v) => {
      localWatchStatus.value = v ?? "UNWATCHED";
    }
);
</script>
