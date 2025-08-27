<template>
  <Card class="w-full max-w-xs overflow-hidden">
    <template #title>
      <div class="flex justify-between items-center">
        <span class="truncate max-w-[200px]" title="{{ event.title }}">
          {{ event.title }}
        </span>
        <!-- Icon button for details -->
        <Button
            icon="pi pi-info-circle"
            text
            class="p-button-rounded p-button-text p-button-sm"
            @click="showDialog = true"
            v-tooltip="'Show details'"
        />
      </div>
    </template>
    <template #subtitle>{{ event.subtitle }}</template>

    <template #content>
      <ul class="space-y-1 text-sm">
        <li><b>Start Time:</b> {{ formattedDate }}</li>
        <li><b>Status:</b> {{ event.status }}</li>
      </ul>
    </template>

    <template #footer>
      <div class="mt-3">
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
    </template>
  </Card>
  <Dialog
      header="Match Details"
      v-model:visible="showDialog"
      modal
      :closable="true"
      :style="{ width: '30rem' }"
  >
    <div class="space-y-3 text-sm">
      <dl class="grid grid-cols-2 gap-x-4 gap-y-2">
        <dt class="font-semibold">Title:</dt>
        <dd class="truncate">{{ event.title }}</dd>

        <dt class="font-semibold">Subtitle:</dt>
        <dd class="truncate">{{ event.subtitle }}</dd>

        <dt class="font-semibold">Start Time:</dt>
        <dd>{{ formattedDate }}</dd>

        <dt class="font-semibold">Status:</dt>
        <dd>{{ event.status }}</dd>

        <dt class="font-semibold">Score:</dt>
        <dd>{{ event.homeScore ?? "-" }} - {{ event.awayScore ?? "-" }}</dd>

        <dt class="font-semibold">Competition:</dt>
        <dd>{{ event.competition }}</dd>

        <dt class="font-semibold">Location:</dt>
        <dd>{{ event.location ?? "-" }}</dd>

        <dt class="font-semibold">External Link:</dt>
        <dd>
          <a v-if="event.externalLink" :href="event.externalLink" target="_blank" class="text-blue-500 underline">View</a>
          <span v-else>-</span>
        </dd>
      </dl>
    </div>
  </Dialog>

</template>

<script setup lang="ts">
import { ref, computed, watch } from "vue";
import type { FootballEventDetails } from "~/types/football/events";
import type { WatchedStatus } from "~/types/events";

const props = defineProps<{
  event: FootballEventDetails;         // <-- only the details object
  watchStatus?: WatchedStatus | null;  // <-- wrapper's status passed separately
}>();

const emit = defineEmits<{
  (e: "update:watchStatus", value: WatchedStatus): void;
}>();

const showDialog = ref(false);
const localWatchStatus = ref<WatchedStatus>(props.watchStatus ?? "UNWATCHED");

const watchStatusOptions = [
  { label: "Unwatched", value: "UNWATCHED" },
  { label: "In Person", value: "IN_PERSON" },
  { label: "Live", value: "LIVE" },
  { label: "Replay", value: "REPLAY" },
  { label: "Highlights", value: "HIGHLIGHTS" },
];

const formattedDate = computed(() => new Date(props.event.dateTime).toLocaleString());

function emitWatchStatus() {
  emit("update:watchStatus", localWatchStatus.value);
}

watch(() => props.watchStatus, (v) => {
  localWatchStatus.value = v ?? "UNWATCHED";
});
</script>
