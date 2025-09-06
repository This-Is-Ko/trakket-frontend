<template>
  <div class="px-2 sm:px-4 py-4">
    <h1 class="text-4xl font-bold text-center mb-6">Motorsport</h1>
    <p class="text-center text-gray-500 mb-6">
      Track your watched races for {{ competitionFilter }}
    </p>

    <div class="grid grid-cols-1 lg:grid-cols-8 gap-6">
      <!-- Sidebar: Championships / Competitions -->
      <div class="lg:col-span-2 order-1 lg:order-1">
        <Card>
          <template #title>Championships</template>
          <template #content>
            <ul class="space-y-2">
              <li
                  v-for="comp in COMPETITIONS"
                  :key="comp"
                  @click="competitionFilter = comp"
                  class="cursor-pointer px-3 py-2 rounded-md"
                  :class="{
                  'bg-blue-100 font-semibold': competitionFilter === comp,
                  'hover:bg-gray-100': competitionFilter !== comp
                }"
              >
                {{ comp }}
              </li>
            </ul>
          </template>
        </Card>
      </div>

      <!-- Right sidebar: Event Status Filter -->
      <div class="lg:col-span-2 order-2 lg:order-3">
        <Card>
          <template #title>Event Status</template>
          <template #content>
            <Select
                v-model="eventStatusFilter"
                :options="EVENT_STATUSES"
                optionLabel="label"
                optionValue="value"
                placeholder="Select Status"
                class="w-full"
            />
          </template>
        </Card>
      </div>

      <!-- Main content: Accordion -->
    <div class="lg:col-span-4 order-3 lg:order-2">
        <!-- Loading / Error -->
        <div v-if="loading" class="text-center py-10 text-gray-500">
          <ProgressSpinner />
        </div>

        <div v-else-if="fetchError" class="text-center text-gray-500">
          <Message severity="error">Unable to load events. Please try again later.</Message>
        </div>

        <div v-else>
          <Accordion>
            <EventAccordion
                v-for="ev in events"
                :key="ev.details.id"
                :event="ev.details"
                :watch-status="ev.status"
                @update:watchStatus="(val) => updateWatchStatus(ev.details.id, val)"
            />
          </Accordion>

          <div v-if="events.length === 0" class="text-center py-8 text-gray-500">
            No events to show.
          </div>
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
    </div>

    <Toast ref="toast" class="max-w-xs sm:max-w-sm" position="top-center" />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from "vue";
import EventAccordion from "~/components/motorsport/EventAccordion.vue";
import { fetchMotorsportEventsWithStatus, updateMotorsportEventWatchStatus } from "~/services/motorsportEvents";
import type { WatchedStatus } from "~/types/events";
import type { MotorsportEventWrapper } from "~/types/motorsport/events";
import { COMPETITIONS } from "~/constants/motorsport/competitions";
import axios from "axios";

const EVENT_STATUSES = [
  { label: "Completed", value: "COMPLETED" },
  { label: "Scheduled", value: "SCHEDULED" }
];

const events = ref<MotorsportEventWrapper[]>([]);
const competitionFilter = ref("Formula One");
const eventStatusFilter = ref<"SCHEDULED" | "COMPLETED">("COMPLETED");
const page = ref(0);
const pageSize = 10;
const toast = useToast();
const loading = ref(false);
const lastPage = ref(true);
const fetchError = ref(false);

async function loadMotorsportEvents() {
  loading.value = true;
  fetchError.value = false;
  try {
    const params = {
      competition: competitionFilter.value,
      status: eventStatusFilter.value,
      page: page.value,
      pageSize: pageSize,
      ascending: false
    };
    const res = await fetchMotorsportEventsWithStatus(params);

    events.value = res.events ?? [];
    lastPage.value = res.last ?? false;
    fetchError.value = false;
  } catch (err) {
    events.value = [];
    fetchError.value = true;
    if (axios.isAxiosError(err)) {
      const status = err.response?.status;
      if (status === 401) {
        userStore.showLoginDialog = true;
      }
    }
  } finally {
    loading.value = false;
  }
}

watch([competitionFilter, eventStatusFilter], () => {
  page.value = 0;
});

onMounted(loadMotorsportEvents);
watch([competitionFilter, eventStatusFilter, page], loadMotorsportEvents);

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

definePageMeta({
  title: "Motorsport"
});
</script>
