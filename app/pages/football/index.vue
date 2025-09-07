<template>
  <div class="px-2 sm:px-4 py-4">
    <h1 class="text-4xl font-bold text-center mb-6">Football</h1>
    <p class="text-center text-gray-500 mb-6">
      Track your watched matches for {{ competitionFilter }}
    </p>

    <div class="grid grid-cols-1 lg:grid-cols-8 gap-6">
      <!-- Sidebar: Leagues / Competitions -->
      <div class="lg:col-span-2 order-1 lg:order-1">
        <Card>
          <template #title>Leagues</template>
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
import { useToast } from 'primevue/usetoast';
import EventAccordion from "~/components/football/EventAccordion.vue";
import { fetchFootballEventsWithStatus, updateFootballEventWatchStatus } from "~/services/footballEvents";
import type { FootballEventWrapper } from "~/types/football/events";
import type { WatchedStatus } from "~/types/events";
const { formatEnumToString } = useFormatters();
import { COMPETITIONS } from "~/constants/football/competitions";
import { EVENT_STATUSES } from "~/constants/eventStates";
import {useUserStore} from "~/stores/useUserStore";
import axios from "axios";
import {useFormatters} from "~/composables/useFormatters";

const events = ref<FootballEventWrapper[]>([]);
const competitionFilter = ref("English Premier League"); // default
const eventStatusFilter = ref<"SCHEDULED" | "COMPLETED">("COMPLETED");
const page = ref(0);
const pageSize = 12;
const toast = useToast();
const loading = ref(false);
const lastPage = ref(true);
const fetchError = ref(false);
const userStore = useUserStore()

async function loadFootballEvents() {
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
    const res = await fetchFootballEventsWithStatus(params);

    events.value = res.events ?? [];
    lastPage.value = res.last ?? false;
    fetchError.value = false;
  } catch (err) {
    // clear results and show placeholder
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

// Reset page when filters change
watch([competitionFilter, eventStatusFilter], () => {
  page.value = 0;
});

onMounted(loadFootballEvents);
watch([competitionFilter, eventStatusFilter, page], loadFootballEvents);

function updateWatchStatus(eventId: number, newStatus: WatchedStatus) {
  const wrapper = events.value.find((w) => w.details.id === eventId);
  if (wrapper) wrapper.status = newStatus;

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

definePageMeta({
  title: "Football"
});
</script>
