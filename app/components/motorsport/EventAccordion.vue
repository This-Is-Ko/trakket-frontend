<template>
  <AccordionPanel :value="panelValue">
    <AccordionHeader>
      <div class="w-full flex items-center justify-between px-3">
        <!-- Left: Flag + Race Name -->
        <div class="flex items-center gap-2 min-w-0">
          <div v-if="!event.flagUrl" class="w-6 h-4 bg-gray-300 flex-shrink-0"></div>
          <Image v-else :src="event.flagUrl" alt="Flag" width="22" />
          <span class="text-sm font-medium truncate max-w-[400px]">
            {{ event.raceName ?? event.title }}
          </span>
        </div>

        <!-- Right: Tag -->
        <div class="flex-shrink-0 w-[96px] flex justify-end">
          <Tag v-show="localWatchStatus !== 'UNWATCHED'" icon="pi pi-check" />
        </div>
      </div>
    </AccordionHeader>

    <AccordionContent>
      <div class="space-y-3 text-sm">
        <dl class="grid grid-cols-2 gap-x-4 gap-y-2">
          <dt class="font-semibold">Competition:</dt>
          <dd>{{ event.competition ?? "-" }}</dd>

          <dt class="font-semibold">Round:</dt>
          <dd class="truncate">{{ event.round ?? "-" }}</dd>

          <dt class="font-semibold">Circuit:</dt>
          <dd>{{ event.circuitName ?? "-" }}</dd>

          <dt class="font-semibold">Start Time:</dt>
          <dd>{{ formattedDate }}</dd>

          <dt class="font-semibold">Status:</dt>
          <dd>{{ formatEnumToString(event.status) }}</dd>

          <dt class="font-semibold">Winner:</dt>
          <dd>{{ event.winner ?? "-" }}</dd>

          <dt class="font-semibold">Location:</dt>
          <dd>{{ event.location ?? "-" }}</dd>

          <dt class="font-semibold">External Link:</dt>
          <dd>
            <a v-if="event.externalLink" :href="event.externalLink" target="_blank" class="text-blue-500 underline">View</a>
            <span v-else>-</span>
          </dd>
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
import { ref, computed, watch } from "vue";
import type { WatchedStatus } from "~/types/events";
import type { MotorsportEventDetails } from "~/types/motorsport/events";

const props = defineProps<{
  event: MotorsportEventDetails;
  watchStatus?: WatchedStatus | null;
}>();

const emit = defineEmits<{
  (e: "update:watchStatus", value: WatchedStatus): void;
}>();

const panelValue = String(props.event.id);

const localWatchStatus = ref<WatchedStatus>(props.watchStatus ?? "UNWATCHED");

const watchStatusOptions = [
  { label: "Unwatched", value: "UNWATCHED" },
  { label: "In Person", value: "IN_PERSON" },
  { label: "Live", value: "LIVE" },
  { label: "Replay", value: "REPLAY" },
  { label: "Highlights", value: "HIGHLIGHTS" },
];

const formattedDate = computed(() =>
    props.event?.dateTime
        ? new Date(props.event.dateTime).toLocaleString("en-AU", {
          year: "numeric",
          month: "short",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        })
        : "-"
);

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

watch(
    () => props.watchStatus,
    (v) => {
      localWatchStatus.value = v ?? "UNWATCHED";
    }
);
</script>
