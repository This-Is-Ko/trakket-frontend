<template>
  <div class="p-4">
    <h1 class="text-4xl font-bold text-center mb-6">Motorsport</h1>
    <p class="text-center text-gray-500 mb-6">Track your watched races for {{ competitionFilter }}</p>

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
    <div v-else class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 justify-items-center">
      <MotorsportEventCard
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
  <Toast />
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from "vue";
import MotorsportEventCard from "~/components/motorsport/MotorsportEventCard.vue";
import { fetchMotorsportEventsWithStatus, updateMotorsportEventWatchStatus } from "~/services/motorsportEvents";
import { useAuth } from "~/composables/useAuth";
import type { MotorsportEventWrapper } from "~/types/motorsport/events";
import type { WatchedStatus } from "~/types/events";
import { COMPETITIONS } from "~/constants/motorsport/competitions";
import { EVENT_STATUSES } from "~/constants/eventStates";

const events = ref<MotorsportEventWrapper[]>([]);
const competitionFilter = ref("Formula One");
const eventStatusFilter = ref<"SCHEDULED" | "COMPLETED">("COMPLETED");
const page = ref(0);
const pageSize = 12;
const toast = useToast();
const loading = ref(false);
const lastPage = ref(false);

const { isLoggedIn } = useAuth();

async function loadMotorsportEvents() {
  loading.value = true;
  try {
    const params = {
      competition: competitionFilter.value,
      status: eventStatusFilter.value,
      page: page.value,
      pageSize: pageSize,
      ascending: false,
    };
    const res = await fetchMotorsportEventsWithStatus(params);

    events.value = res.events ?? [];
    lastPage.value = res.last ?? false;
  } catch (err) {
    toast.add({
      severity: "error",
      summary: "Error",
      detail: "Unable to load events. Please try again later",
      life: 3000,
    });
  } finally {
    loading.value = false;
  }
}

// Reset page when filters change
watch([competitionFilter, eventStatusFilter], () => {
  page.value = 0;
});

onMounted(loadMotorsportEvents);
watch([competitionFilter, eventStatusFilter, page, isLoggedIn], loadMotorsportEvents);

function updateWatchStatus(eventId: number, newStatus: WatchedStatus) {
  const wrapper = events.value.find((w) => w.details.id === eventId);
  if (wrapper) wrapper.status = newStatus;

  updateMotorsportEventWatchStatus(eventId, newStatus)
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
