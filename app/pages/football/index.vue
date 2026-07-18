<template>
  <div class="px-2 sm:px-4 py-4">
    <h1 class="text-3xl font-extrabold tracking-tight text-center mb-2 text-white">Football</h1>
    <p class="text-center text-gray-500 mb-6">
      Track your watched matches for {{ competitionFilter?.displayName ?? 'All competitions' }}
    </p>

    <!-- Filter Bar -->
    <div class="flex flex-wrap items-end justify-center gap-3 mb-6">
      <!-- Competition dropdown -->
      <div class="w-full sm:w-auto sm:min-w-[220px]">
        <label class="block text-xs text-gray-500 mb-1">Competition</label>
        <Select
          v-model="competitionFilter"
          :options="competitionOptions"
          option-label="label"
          option-value="value"
          option-disabled="disabled"
          placeholder="All competitions"
          filter
          :filter-fields="['label']"
          class="w-full"
          @change="onFilterChange"
        >
          <template #option="{ option }">
            <div class="flex items-center justify-between w-full">
              <span>{{ option.label }}</span>
            </div>
          </template>
        </Select>
      </div>

      <!-- Team dropdown -->
      <div class="w-full sm:w-auto sm:min-w-[220px]">
        <label class="block text-xs text-gray-500 mb-1">Team</label>
        <Select
          v-model="teamFilter"
          :options="teamOptions"
          option-label="label"
          option-value="value"
          placeholder="All teams"
          filter
          :filter-fields="['label']"
          class="w-full"
          @change="onFilterChange"
        >
          <template #option="{ option }">
            <div class="flex items-center justify-between w-full">
              <span>{{ option.label }}</span>
            </div>
          </template>
        </Select>
      </div>

      <!-- Event status dropdown -->
      <div class="w-full sm:w-auto sm:min-w-[220px]">
        <label class="block text-xs text-gray-500 mb-1">Event Status</label>
        <Select
          v-model="eventStatusFilter"
          :options="STATUS_OPTIONS"
          option-label="label"
          option-value="value"
          placeholder="Select status"
          class="w-full"
          @change="onFilterChange"
        />
      </div>
    </div>

    <!-- Favourite toggle when a filter is selected -->
    <div
      v-if="competitionFilter || teamFilter"
      class="flex justify-center mb-6"
    >
      <Button
        v-if="competitionFilter"
        :icon="favouriteStore.footballCompetitions.includes(competitionFilter.name) ? 'pi pi-star-fill' : 'pi pi-star'"
        :label="favouriteStore.footballCompetitions.includes(competitionFilter.name) ? 'Favourited' : 'Add to favourites'"
        severity="secondary"
        text
        size="small"
        :class="{ '!text-yellow-400': favouriteStore.footballCompetitions.includes(competitionFilter.name) }"
        @click="toggleFavourite('footballCompetitions', competitionFilter.name)"
      />
      <Button
        v-if="teamFilter"
        :icon="favouriteStore.footballTeams.includes(teamFilter.id) ? 'pi pi-star-fill' : 'pi pi-star'"
        :label="favouriteStore.footballTeams.includes(teamFilter.id) ? 'Favourited' : 'Add to favourites'"
        severity="secondary"
        text
        size="small"
        :class="{ '!text-yellow-400': favouriteStore.footballTeams.includes(teamFilter.id) }"
        @click="toggleFavourite('footballTeams', teamFilter.id)"
      />
    </div>

    <!-- Loading state -->
    <div v-if="loading && events.length === 0" class="text-center py-20 text-gray-500">
      <ProgressSpinner />
    </div>

    <!-- Error state -->
    <div v-else-if="fetchError && events.length === 0" class="text-center py-10 text-gray-500">
      <Message severity="error">Unable to load events. Please try again later.</Message>
    </div>

    <!-- Card Grid -->
    <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      <CompactFootballCard
        v-for="ev in events"
        :key="ev.details.id"
        :event="ev.details"
        :watch-status="ev.status"
        @click="openDetail(ev.details, ev.status)"
        @update:watch-status="(val: WatchedStatus) => updateWatchStatus(ev.details.id, val)"
      />

      <!-- Infinite scroll sentinel -->
      <div
        v-if="!lastPage"
        ref="sentinelRef"
        class="col-span-full flex flex-col items-center gap-3 py-6 text-gray-500 text-sm"
      >
        <ProgressSpinner v-if="loading" style="width: 24px; height: 24px;" />
        <Button
          v-else
          label="Load more"
          severity="secondary"
          text
          size="small"
          @click="loadMore"
        />
      </div>

      <!-- Empty state -->
      <div v-if="events.length === 0 && !loading" class="col-span-full text-center py-12 text-gray-500">
        No events to show.
      </div>
    </div>

    <!-- Detail Dialog -->
    <EventDetailDialog
      v-model:visible="dialogVisible"
      sport="football"
      :football-event="selectedEvent"
      :watch-status="selectedEventStatus"
      @update:watch-status="(val: WatchedStatus) => onDialogStatusUpdate(val)"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch, onBeforeUnmount, nextTick } from "vue";
import { useToast } from 'primevue/usetoast';
import CompactFootballCard from "~/components/event/CompactFootballCard.vue";
import EventDetailDialog from "~/components/event/EventDetailDialog.vue";
import {
  fetchFootballEventsWithStatus,
  updateFootballEventWatchStatus,
  fetchFootballTeams,
  fetchFootballCompetitions
} from "~/services/footballEvents";
import type { FootballCompetition, FootballEventWrapper, FootballTeam } from "~/types/football/events";
import type { WatchedStatus } from "~/types/events";
import { useUserStore } from "~/stores/useUserStore";
import { useFavouriteStore } from "~/stores/useFavouriteStore";
import type { FootballEventDetails } from "~/types/football/events";
import axios from "axios";

const STATUS_OPTIONS = [
  { label: "All statuses", value: null },
  { label: "Completed", value: "COMPLETED" },
  { label: "Scheduled", value: "SCHEDULED" },
];

const events = ref<FootballEventWrapper[]>([]);
const competitionFilter = ref<FootballCompetition | null>(null);
const eventStatusFilter = ref<"SCHEDULED" | "COMPLETED" | null>("COMPLETED");
const teamFilter = ref<FootballTeam | null>(null);

const competitions = ref<FootballCompetition[]>([]);
const teams = ref<FootballTeam[]>([]);
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
const favouriteStore = useFavouriteStore();

const sentinelRef = ref<HTMLElement | null>(null);
let observer: IntersectionObserver | null = null;

// Detail dialog state
const dialogVisible = ref(false);
const selectedEvent = ref<FootballEventDetails | null>(null);
const selectedEventStatus = ref<WatchedStatus | null>(null);

// Build sorted competition options: favourites first
const competitionOptions = computed(() => {
  const all = competitions.value.map(c => ({ label: c.displayName, value: c }));
  const starred = all.filter(o => favouriteStore.footballCompetitions.includes(o.value.name));
  const rest = all.filter(o => !favouriteStore.footballCompetitions.includes(o.value.name));
  return [
    { label: 'All competitions', value: null },
    ...(starred.length > 0
      ? [{ label: '— Favourites —', value: null, disabled: true } as any, ...starred]
      : []),
    ...(starred.length > 0
      ? [{ label: '— All —', value: null, disabled: true } as any, ...rest]
      : rest),
  ];
});

// Build sorted team options: favourites first
const teamOptions = computed(() => {
  const all = teams.value.map(t => ({
    label: t.gender ? `${t.name} (${t.gender})` : t.name,
    value: t,
  }));
  const starred = all.filter(o => favouriteStore.footballTeams.includes(o.value.id));
  const rest = all.filter(o => !favouriteStore.footballTeams.includes(o.value.id));
  return [
    { label: 'All teams', value: null },
    ...(starred.length > 0
      ? [{ label: '— Favourites —', value: null, disabled: true } as any, ...starred]
      : []),
    ...(starred.length > 0
      ? [{ label: '— All —', value: null, disabled: true } as any, ...rest]
      : rest),
  ];
});

async function toggleFavourite(key: 'footballCompetitions' | 'footballTeams', value: any) {
  let result
  if (key === 'footballCompetitions') {
    result = await favouriteStore.toggleFootballCompetition(value)
  } else {
    result = await favouriteStore.toggleFootballTeam(value)
  }

  if (result.action === 'added') {
    toast.add({ severity: 'success', summary: 'Added to favourites', life: 2000 })
  } else if (result.action === 'removed') {
    toast.add({ severity: 'success', summary: 'Removed from favourites', life: 2000 })
  } else {
    toast.add({ severity: 'error', summary: 'Failed to update favourites', life: 3000 })
  }
}

function isFavourite(key: 'footballCompetitions' | 'footballTeams', value: any): boolean {
  if (key === 'footballCompetitions') return favouriteStore.footballCompetitions.includes(value)
  return favouriteStore.footballTeams.includes(value)
}

// Selecting a competition clears the team filter, and vice versa
watch(competitionFilter, (val) => { if (val) teamFilter.value = null });
watch(teamFilter, (val) => { if (val) competitionFilter.value = null });

function onFilterChange() {
  page.value = 0;
  events.value = [];
  lastPage.value = true;
  loadFootballEvents();
}

async function loadFootballEvents() {
  loading.value = true;
  fetchError.value = false;
  try {
    const params: any = {
      competition: competitionFilter.value?.displayName ?? null,
      teamId: teamFilter.value?.id ?? null,
      page: page.value,
      pageSize,
      ascending: false,
    };

    if (eventStatusFilter.value !== null) params.status = eventStatusFilter.value;

    const res = await fetchFootballEventsWithStatus(params);

    if (page.value === 0) {
      events.value = res.events ?? [];
    } else {
      events.value.push(...(res.events ?? []));
    }
    lastPage.value = res.last ?? false;
    fetchError.value = false;
  } catch (err) {
    if (page.value === 0) events.value = [];
    fetchError.value = true;
    if (axios.isAxiosError(err) && err.response?.status === 401) {
      userStore.showLoginDialog = true;
    }
  } finally {
    loading.value = false;
  }

  // Re-observe sentinel to force a fresh intersection check after loading
  await nextTick();
  if (sentinelRef.value && observer && !lastPage.value) {
    observer.unobserve(sentinelRef.value);
    observer.observe(sentinelRef.value);
  }
}

function loadMore() {
  if (!loading.value && !lastPage.value) {
    page.value++;
    loadFootballEvents();
  }
}

function setupObserver() {
  if (observer) observer.disconnect();
  observer = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting && !loading.value && !lastPage.value) {
      page.value++;
      loadFootballEvents();
    }
  }, { rootMargin: '200px' });
}

onMounted(async () => {
  setupObserver();

  await Promise.all([
    loadCompetitions(),
    loadTeams(),
  ]);
  await loadFootballEvents();
});

watch(sentinelRef, (el) => {
  if (observer && el) observer.observe(el);
}, { flush: 'post' });

onBeforeUnmount(() => {
  if (observer) observer.disconnect();
});

async function loadTeams() {
  if (fetchedTeams.value) return;
  try {
    const list = await fetchFootballTeams();
    teams.value = list;
    fetchedTeams.value = true;
  } catch (_) {
    teams.value = [];
  }
}

async function loadCompetitions() {
  if (fetchedCompetitions.value) return;
  loadingCompetitions.value = true;
  competitionsError.value = false;
  try {
    const list = await fetchFootballCompetitions();
    competitions.value = list;
    fetchedCompetitions.value = true;
  } catch (_) {
    competitions.value = [];
    competitionsError.value = true;
  } finally {
    loadingCompetitions.value = false;
  }
}

function updateWatchStatus(eventId: number, newStatus: WatchedStatus) {
  const wrapper = events.value.find((w) => w.details.id === eventId);
  if (wrapper) wrapper.status = newStatus;

  updateFootballEventWatchStatus(eventId, newStatus)
    .then(() => {
      toast.add({ severity: "success", summary: "Success", detail: "Watch status updated", life: 3000 });
    })
    .catch(() => {
      toast.add({ severity: "error", summary: "Error", detail: "Watch status update failed", life: 3000 });
    });
}

function openDetail(event: FootballEventDetails, status: WatchedStatus | null) {
  selectedEvent.value = event;
  selectedEventStatus.value = status;
  dialogVisible.value = true;
}

function onDialogStatusUpdate(newStatus: WatchedStatus) {
  if (selectedEvent.value) {
    updateWatchStatus(selectedEvent.value.id, newStatus);
  }
}

definePageMeta({ title: "Football" });
</script>
