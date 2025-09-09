<template>
  <div class="px-2 sm:px-4 py-4">
    <h1 class="text-4xl font-bold text-center mb-6">Football</h1>

    <p class="text-center text-gray-500 mb-6" v-if="activeTab === 'competition'">
      Track your watched matches for {{ competitionFilter?.displayName ?? 'All competitions' }}
    </p>
    <p class="text-center text-gray-500 mb-6" v-else>
      Browse and track matches by team
    </p>

    <!-- Tabs: Competitions | Teams -->
    <div class="mb-6 flex justify-center">
      <nav class="inline-flex rounded-lg border border-gray-200 overflow-hidden" aria-label="Football views">
        <button
            @click="goTab('competition')"
            :class="activeTab === 'competition' ? 'bg-emerald-500 text-white' : 'bg-white text-gray-700 hover:bg-gray-50'"
            class="px-4 py-2 text-sm font-medium"
            :aria-current="activeTab === 'competition' ? 'page' : undefined"
        >
          Competitions
        </button>
        <button
            @click="goTab('teams')"
            :class="['px-4 py-2 text-sm font-medium border-l border-gray-200', activeTab === 'teams' ? 'bg-emerald-500 text-white' : 'bg-white text-gray-700 hover:bg-gray-50']"
            :aria-current="activeTab === 'teams' ? 'page' : undefined"
        >
          Teams
        </button>
      </nav>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-8 gap-6">
      <!-- Sidebar: Competitions -->
      <div class="lg:col-span-2 order-1 lg:order-1" v-if="activeTab === 'competition'">
        <Card>
          <template #title>Competitions</template>
          <template #content>
            <div v-if="loadingCompetitions" class="flex justify-center py-6">
              <ProgressSpinner />
            </div>

            <div v-else-if="competitionsError" class="text-center text-gray-500 py-4">
              Unable to load competitions. Please try again later.
            </div>

            <ul v-else class="space-y-2">
              <li
                  v-for="comp in competitions"
                  :key="comp.displayName"
                  @click="competitionFilter = comp"
                  class="cursor-pointer px-3 py-2 rounded-md"
                  :class="{
                    'bg-blue-100 font-semibold': competitionFilter?.displayName === comp.displayName,
                    'hover:bg-gray-100': competitionFilter?.displayName !== comp.displayName
                  }"
              >
                {{ comp.displayName }}
              </li>
            </ul>
          </template>
        </Card>
      </div>

      <!-- Sidebar: Teams (for Teams tab) -->
      <div class="lg:col-span-2 order-1 lg:order-1" v-else>
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

      <!-- Right sidebar: Event Status Filter -->
      <div class="lg:col-span-2 order-2 lg:order-3">
        <Card>
          <template #title>Event Status</template>
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

  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from "vue";
import { useToast } from 'primevue/usetoast';
import EventAccordion from "~/components/football/EventAccordion.vue";
import {
  fetchFootballEventsWithStatus,
  updateFootballEventWatchStatus,
  fetchFootballTeams,
  fetchFootballCompetitions,
  type FootballTeam,
  type FootballCompetition
} from "~/services/footballEvents";
import type { FootballEventWrapper } from "~/types/football/events";
import type { WatchedStatus } from "~/types/events";
import { useUserStore } from "~/stores/useUserStore";
import axios from "axios";

const WEEK_OPTIONS = [
  { label: "All weeks", value: null },
  { label: "Week 1", value: 1 },
  { label: "Week 2", value: 2 },
  { label: "Week 3", value: 3 },
];

const STATUS_OPTIONS = [
  { label: "All statuses", value: null },
  { label: "Completed", value: "COMPLETED" },
  { label: "Scheduled", value: "SCHEDULED" },
];

const events = ref<FootballEventWrapper[]>([]);
const activeTab = ref<'competition' | 'teams'>('competition');
const competitionFilter = ref<FootballCompetition | null>(null);
const eventStatusFilter = ref<"SCHEDULED" | "COMPLETED" | null>("COMPLETED");
const round = ref<number | null>(null);
const teamOptions = ref<{ label: string, value: number | null }[]>([{ label: "All teams", value: null }]);
const teamId = ref<number | null>(null);
const teams = ref<FootballTeam[]>([]);

const competitions = ref<FootballCompetition[]>([]);
const competitionsError = ref(false);
const loadingCompetitions = ref(false);

const fetchedTeams = ref(false);
const fetchedCompetitions = ref(false);
const page = ref(0);
const pageSize = 12;
const toast = useToast();
const loading = ref(false);
const lastPage = ref(true);
const fetchError = ref(false);
const userStore = useUserStore();

async function loadFootballEvents() {
  loading.value = true;
  fetchError.value = false;
  try {
    const params: any = activeTab.value === 'competition'
        ? {
          competition: competitionFilter.value?.displayName ?? null,
          page: page.value,
          pageSize: pageSize,
          ascending: false
        }
        : {
          competition: null,
          teamId: teamId.value,
          page: page.value,
          pageSize: pageSize,
          ascending: false
        };

    if (eventStatusFilter.value !== null) params.status = eventStatusFilter.value;
    if (activeTab.value === 'competition' && round.value !== null) params.round = round.value;

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

// Reset page when filters change
watch([competitionFilter, eventStatusFilter, round, teamId, activeTab], () => {
  page.value = 0;
});

function goTab(tab: 'competition' | 'teams') {
  activeTab.value = tab;
  if (tab === 'teams' && teams.value.length === 0) {
    loadTeams();
  }
}

async function loadTeams() {
  if (fetchedTeams.value) return;
  try {
    const list = await fetchFootballTeams();
    teams.value = list;
    teamOptions.value = [
      { label: 'All teams', value: null },
      ...list.map(t => ({
        label: t.gender ? `${t.name} (${t.gender})` : t.name,
        value: t.id
      }))
    ];
    fetchedTeams.value = true;
  } catch (_) {
    teamOptions.value = [{ label: 'All teams', value: null }];
  }
}

async function loadCompetitions() {
  if (fetchedCompetitions.value) return;
  loadingCompetitions.value = true;
  competitionsError.value = false;

  try {
    const list = await fetchFootballCompetitions();
    competitions.value = list;

    if (list.length > 0) {
      competitionFilter.value = list[0] ?? null;
    } else {
      competitionFilter.value = null;
      competitionsError.value = true;
    }

    fetchedCompetitions.value = true;
  } catch (_) {
    competitions.value = [];
    competitionsError.value = true;
  } finally {
    loadingCompetitions.value = false;
  }
}

onMounted(async () => {
  // load competitions first, then events
  await loadCompetitions();
  await loadFootballEvents();
});

// watch triggers loading when filters or pagination change
watch([competitionFilter, eventStatusFilter, round, teamId, page, activeTab], loadFootballEvents);

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
