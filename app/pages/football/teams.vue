<template>
  <div class="px-2 sm:px-4 py-4">
    <h1 class="text-4xl font-bold text-center mb-6">Football Teams</h1>

    <div class="grid grid-cols-1 lg:grid-cols-8 gap-6">
      <!-- Sidebar: Teams -->
      <div class="lg:col-span-2 order-1 lg:order-1">
        <Card>
          <template #title>Teams</template>
          <template #content>
            <Select
                v-model="teamId"
                :options="teamOptions"
                optionLabel="label"
                optionValue="value"
                placeholder="Select Team"
                class="w-full"
            />
          </template>
        </Card>
      </div>

      <!-- Right sidebar: Event Status -->
      <div class="lg:col-span-2 order-2 lg:order-3">
        <Card>
          <template #title>Filters</template>
          <template #content>
            <Select
                v-model="eventStatusFilter"
                :options="STATUS_OPTIONS"
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

  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from "vue";
import { useToast } from 'primevue/usetoast';
import EventAccordion from "~/components/football/EventAccordion.vue";
import { fetchFootballEventsWithStatus, updateFootballEventWatchStatus, fetchFootballTeams, type FootballTeam } from "~/services/footballEvents";
import type { FootballEventWrapper } from "~/types/football/events";
import type { WatchedStatus } from "~/types/events";
import {useUserStore} from "~/stores/useUserStore";
import axios from "axios";

const teamOptions = ref<{ label: string, value: number | null }[]>([
  { label: "All teams", value: null }
]);

const STATUS_OPTIONS = [
  { label: "All statuses", value: null },
  { label: "Completed", value: "COMPLETED" },
  { label: "Scheduled", value: "SCHEDULED" },
];

const events = ref<FootballEventWrapper[]>([]);
const eventStatusFilter = ref<"SCHEDULED" | "COMPLETED" | null>("COMPLETED");
const teamId = ref<number | null>(null);
const teams = ref<FootballTeam[]>([]);
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
    const params: any = {
      competition: null,
      teamId: teamId.value,
      page: page.value,
      pageSize: pageSize,
      ascending: false
    };
    if (eventStatusFilter.value !== null) params.status = eventStatusFilter.value;
    const res = await fetchFootballEventsWithStatus(params);

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

async function loadTeams() {
  try {
    const res = await fetchFootballTeams();
    teams.value = res;
    teamOptions.value = [
      { label: "All teams", value: null },
      ...teams.value.map(t => ({ label: t.name, value: t.id }))
    ];
  } catch (_) {
    teamOptions.value = [
      { label: "All teams", value: null }
    ];
  }
}

watch([teamId, eventStatusFilter], () => {
  page.value = 0;
});

onMounted(async () => {
  await loadTeams();
  await loadFootballEvents();
});
watch([teamId, eventStatusFilter, page], loadFootballEvents);

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
  title: "Football Teams"
});
</script>


