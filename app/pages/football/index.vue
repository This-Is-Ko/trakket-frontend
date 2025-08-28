<template>
  <div class="p-4">
    <h1 class="text-4xl font-bold text-center mb-6">Football</h1>
    <p class="text-center text-gray-500 mb-6">Track your watched matches for {{ competitionFilter }}</p>
    <!-- Filters -->
    <div class="flex justify-center gap-4 mb-4">
      <Select
          v-model="competitionFilter"
          :options="COMPETITIONS"
          placeholder="Select Competition"
          class="w-48"
      />
      <Select
          v-model="eventStatusFilter"
          :options="EVENT_STATUSES"
          placeholder="Select Status"
          class="w-48"
      />
    </div>

    <!-- Events -->
    <div v-if="loading" class="text-center py-10 text-gray-500">
      <ProgressSpinner />
    </div>
    <div v-else-if="fetchError" class="text-center py-10 text-gray-500">
      <Message severity="error">Unable to load events. Please try again later.</Message>
    </div>
    <div v-else class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 justify-items-center">
      <FootballEventCard
          v-for="ev in events"
          :key="ev.details.id"
          :event="ev.details"
          :watch-status="ev.status"
          @update:watchStatus="(val) => updateWatchStatus(ev.details.id, val)"
      />
    </div>

    <!-- Pagination -->
    <div class="flex justify-center items-center gap-4 mt-4">
      <Button @click="prevPage" :disabled="page === 0" class="px-3 py-1 border rounded">
        Prev
      </Button>
      <span>Page {{ page + 1 }}</span>
      <Button
          @click="nextPage"
          :disabled="lastPage"
          class="px-3 py-1 border rounded"
      >
        Next
      </Button>
    </div>
  </div>
  <Toast ref="toast" class="max-w-xs sm:max-w-sm" position="top-center" />
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from "vue";
import FootballEventCard from "~/components/football/FootballEventCard.vue";
import {fetchFootballEventsWithStatus, updateFootballEventWatchStatus} from "~/services/footballEvents";
import type { FootballEventWrapper } from "~/types/football/events";
import type { WatchedStatus } from "~/types/events";
import {COMPETITIONS} from "~/constants/football/competitions";
import {EVENT_STATUSES} from "~/constants/eventStates";

const events = ref<FootballEventWrapper[]>([]);
const competitionFilter = ref("English Premier League");
const eventStatusFilter = ref<"SCHEDULED" | "COMPLETED">("COMPLETED");
const page = ref(0);
const pageSize = 12;
const toast = useToast();
const loading = ref(false);
const lastPage = ref(true);
const fetchError = ref(false);

async function loadFootballEvents() {
  loading.value = true;
  try {
      const params = {
      competition: competitionFilter.value,
      status: eventStatusFilter.value,
      page: page.value,
      pageSize: pageSize,
      ascending: false
    };
    const res = await fetchFootballEventsWithStatus(params);

    events.value = res.events ?? [];
    lastPage.value = res.last ?? false;
    fetchError.value = false;
  } catch (err) {
    events.value = [];
    fetchError.value = true;
  } finally {
    loading.value = false;
  }
}

// Reset page when filters change
watch([competitionFilter, eventStatusFilter], () => {
  page.value = 0;
});

onMounted(loadFootballEvents);
watch([competitionFilter, eventStatusFilter, page], loadFootballEvents);

function updateWatchStatus(eventId: number, newStatus: WatchedStatus) {
  const wrapper = events.value.find((w) => w.details.id === eventId);
  if (wrapper) wrapper.status = newStatus;

  // Call backend
  updateFootballEventWatchStatus(eventId, newStatus)
      .then(() => {
        toast.add({
          severity: "success",
          summary: "Success",
          detail: "Watch status updated successfully",
          life: 3000,
        });
      })
      .catch(() => {
        toast.add({
          severity: "error",
          summary: "Error",
          detail: "Watch status update failed. Please try again later",
          life: 3000,
        });
      });
}


function prevPage() {
  if (page.value > 0) page.value--;
}

function nextPage() {
  if (!lastPage.value) page.value++;
}
</script>
