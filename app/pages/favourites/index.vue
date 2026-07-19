<template>
  <div class="px-2 sm:px-4 py-4">
    <h1 class="text-3xl font-extrabold tracking-tight text-center mb-2 text-white">Favourites</h1>
    <p class="text-center text-gray-500 mb-6">
      Events from your favourite competitions, teams, and championships
    </p>

    <!-- Filter Bar -->
    <div class="flex flex-wrap items-end justify-center gap-3 mb-6">
      <!-- Sport dropdown -->
      <div class="w-full sm:w-auto sm:min-w-[160px]">
        <label class="block text-xs text-gray-500 mb-1">Sport</label>
        <Select
          v-model="sportFilter"
          :options="sportOptions"
          option-label="label"
          option-value="value"
          placeholder="All sports"
          class="w-full"
          @change="onFilterChange"
        />
      </div>

      <!-- Competition dropdown -->
      <div class="w-full sm:w-auto sm:min-w-[220px]">
        <label class="block text-xs text-gray-500 mb-1">Competition</label>
        <Select
          v-model="competitionFilter"
          :options="competitionOptions"
          option-label="label"
          option-value="value"
          :placeholder="competitionPlaceholder"
          filter
          :filter-fields="['label']"
          class="w-full"
          @change="onCompetitionFilterChange"
        >
          <template #option="{ option }">
            <div class="flex items-center justify-between w-full">
              <div class="flex items-center gap-2">
                <i
                  v-if="option.value?.sport === 'football'"
                  class="pi pi-trophy text-xs text-gray-500"
                ></i>
                <i
                  v-else-if="option.value?.sport === 'motorsport'"
                  class="pi pi-flag text-xs text-gray-500"
                ></i>
                <span>{{ option.label }}</span>
              </div>
            </div>
          </template>
        </Select>
      </div>

      <!-- Team dropdown (football only) -->
      <div
        v-if="sportFilter === 'football' || sportFilter === null"
        class="w-full sm:w-auto sm:min-w-[220px]"
      >
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
          @change="onTeamFilterChange"
        />
      </div>

      <!-- Event status dropdown -->
      <div class="w-full sm:w-auto sm:min-w-[180px]">
        <label class="block text-xs text-gray-500 mb-1">Event Status</label>
        <Select
          v-model="eventStatusFilter"
          :options="EVENT_STATUS_OPTIONS"
          option-label="label"
          option-value="value"
          placeholder="Select status"
          class="w-full"
          @change="onFilterChange"
        />
      </div>

      <!-- Watch status dropdown -->
      <div class="w-full sm:w-auto sm:min-w-[180px]">
        <label class="block text-xs text-gray-500 mb-1">Watch Status</label>
        <Select
          v-model="watchStatusFilter"
          :options="WATCH_STATUS_OPTIONS"
          option-label="label"
          option-value="value"
          placeholder="Select watch status"
          class="w-full"
          @change="onFilterChange"
        />
      </div>
    </div>

    <!-- Loading state -->
    <div v-if="loading && events.length === 0" class="text-center py-20 text-gray-500">
      <ProgressSpinner />
    </div>

    <!-- Error state -->
    <div v-else-if="fetchError && events.length === 0" class="text-center py-10 text-gray-500">
      <Message severity="error">Unable to load events. Please try again later.</Message>
    </div>

    <!-- No favourites state -->
    <div
      v-else-if="!hasAnyFavourites && !loading"
      class="col-span-full text-center py-12"
    >
      <div class="flex flex-col items-center gap-4">
        <i class="pi pi-star text-4xl text-gray-500"></i>
        <p class="text-gray-400 max-w-md">
          You haven't favourited any competitions, teams, or championships yet.
        </p>
        <p class="text-gray-500 text-sm max-w-md">
          Head to the
          <NuxtLink to="/football" class="text-blue-400 hover:underline">Football</NuxtLink>
          or
          <NuxtLink to="/motorsport" class="text-blue-400 hover:underline">Motorsport</NuxtLink>
          pages and star your favourites to see their events here.
        </p>
      </div>
    </div>

    <!-- Card Grid -->
    <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      <template v-for="ev in events" :key="`${ev.sport}-${ev.details.id}`">
        <CompactFootballCard
          v-if="ev.sport === 'football'"
          :event="ev.details as FootballEventDetails"
          :watch-status="ev.status"
          @click="openDetail(ev)"
          @update:watch-status="(val: WatchedStatus) => updateWatchStatus(ev, val)"
        />
        <CompactMotorsportCard
          v-else
          :event="ev.details as MotorsportEventDetails"
          :watch-status="ev.status"
          @click="openDetail(ev)"
          @update:watch-status="(val: WatchedStatus) => updateWatchStatus(ev, val)"
        />
      </template>

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

      <!-- Empty results state -->
      <div
        v-if="events.length === 0 && !loading && hasAnyFavourites"
        class="col-span-full text-center py-12 text-gray-500"
      >
        No events match your current filters.
      </div>
    </div>

    <!-- Detail Dialog -->
    <EventDetailDialog
      v-model:visible="dialogVisible"
      :sport="dialogSport"
      :football-event="dialogFootballEvent"
      :motorsport-event="dialogMotorsportEvent"
      :watch-status="dialogWatchStatus"
      @update:watch-status="(val: WatchedStatus) => onDialogStatusUpdate(val)"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch, onBeforeUnmount, nextTick } from 'vue'
import { useToast } from 'primevue/usetoast'
import CompactFootballCard from '~/components/event/CompactFootballCard.vue'
import CompactMotorsportCard from '~/components/event/CompactMotorsportCard.vue'
import EventDetailDialog from '~/components/event/EventDetailDialog.vue'
import {
  fetchFavouriteEvents,
  updateFavouriteEventWatchStatus,
} from '~/services/favourites'
import { fetchFootballCompetitions, fetchFootballTeams } from '~/services/footballEvents'
import { fetchMotorsportCompetitions } from '~/services/motorsportEvents'
import type { FavouriteEvent } from '~/types/favourites'
import type { WatchedStatus } from '~/types/events'
import type { FootballEventDetails } from '~/types/football/events'
import type { MotorsportEventDetails } from '~/types/motorsport/events'
import type { FootballCompetition } from '~/types/football/events'
import type { MotorsportCompetition } from '~/types/motorsport/events'
import type { FootballTeam } from '~/types/football/events'
import { useUserStore } from '~/stores/useUserStore'
import { useFavouriteStore } from '~/stores/useFavouriteStore'
import axios from 'axios'

// ---- Computed - Script order ---

/** Sport options scoped to the user's favourites. Mirrors `teamOptions`. */
const sportOptions = computed(() => {
  const options: { label: string; value: string | null }[] = [
    { label: 'All sports', value: null },
  ]

  if (
    favouriteStore.footballCompetitions.length > 0 ||
    favouriteStore.footballTeams.length > 0
  ) {
    options.push({ label: 'Football', value: 'football' })
  }

  if (favouriteStore.motorsportCompetitions.length > 0) {
    options.push({ label: 'Motorsport', value: 'motorsport' })
  }

  return options
})

const EVENT_STATUS_OPTIONS = [
  { label: 'All statuses', value: null },
  { label: 'Completed', value: 'COMPLETED' },
  { label: 'Scheduled', value: 'SCHEDULED' },
]

const WATCH_STATUS_OPTIONS = [
  { label: 'All watch statuses', value: null },
  { label: 'Unwatched', value: 'UNWATCHED' },
  { label: 'In Person', value: 'IN_PERSON' },
  { label: 'Live', value: 'LIVE' },
  { label: 'Replay', value: 'REPLAY' },
  { label: 'Highlights', value: 'HIGHLIGHTS' },
]

// ---- State ----

const events = ref<FavouriteEvent[]>([])

// Filters
const sportFilter = ref<string | null>(null)
const competitionFilter = ref<{ name: string; displayName: string; sport: 'football' | 'motorsport' } | null>(null)
const teamFilter = ref<FootballTeam | null>(null)
const eventStatusFilter = ref<'SCHEDULED' | 'COMPLETED' | null>('COMPLETED')
const watchStatusFilter = ref<WatchedStatus | null>(null)

// Reference data
const footballComps = ref<FootballCompetition[]>([])
const motorsportComps = ref<MotorsportCompetition[]>([])
const footballTeams = ref<FootballTeam[]>([])
const loadingRefData = ref(false)
const refDataFetched = ref(false)

// Pagination
const page = ref(0)
const pageSize = 12
const loading = ref(false)
const lastPage = ref(true)
const fetchError = ref(false)

const sentinelRef = ref<HTMLElement | null>(null)
let observer: IntersectionObserver | null = null

// Dialog state
const dialogVisible = ref(false)
const dialogSport = ref<'football' | 'motorsport'>('football')
const dialogFootballEvent = ref<FootballEventDetails | null>(null)
const dialogMotorsportEvent = ref<MotorsportEventDetails | null>(null)
const dialogWatchStatus = ref<WatchedStatus | null>(null)

// Stores
const toast = useToast()
const userStore = useUserStore()
const favouriteStore = useFavouriteStore()

// ---- Computed ----

const hasAnyFavourites = computed(
  () =>
    favouriteStore.footballCompetitions.length > 0 ||
    favouriteStore.footballTeams.length > 0 ||
    favouriteStore.motorsportCompetitions.length > 0,
)

const competitionPlaceholder = computed(() => {
  if (sportFilter.value === 'football') return 'All competitions'
  if (sportFilter.value === 'motorsport') return 'All championships'
  return 'All competitions'
})

/** Competition options scoped to the selected sport and filtered to favourites. */
const competitionOptions = computed(() => {
  const allCompetitions: { label: string; value: { displayName: string; sport: 'football' | 'motorsport' } }[] = []

  // Football competitions (always)
  if (sportFilter.value === null || sportFilter.value === 'football') {
    for (const comp of footballComps.value) {
      if (favouriteStore.footballCompetitions.includes(comp.name)) {
        allCompetitions.push({
          label: comp.displayName,
          value: { name: comp.name, displayName: comp.displayName, sport: 'football' },
        })
      }
    }
  }

  // Motorsport competitions
  if (sportFilter.value === null || sportFilter.value === 'motorsport') {
    for (const comp of motorsportComps.value) {
      if (favouriteStore.motorsportCompetitions.includes(comp.name)) {
        allCompetitions.push({
          label: comp.displayName,
          value: { name: comp.name, displayName: comp.displayName, sport: 'motorsport' },
        })
      }
    }
  }

  return [
    { label: competitionPlaceholder.value, value: null },
    ...allCompetitions,
  ]
})

/** Team options scoped to football and filtered to favourites. */
const teamOptions = computed(() => {
  const all = footballTeams.value
    .filter((t) => favouriteStore.footballTeams.includes(t.id))
    .map((t) => ({
      label: t.gender ? `${t.name} (${t.gender})` : t.name,
      value: t,
    }))

  return [{ label: 'All teams', value: null }, ...all]
})

// ---- Watchers ----

// Selecting a competition clears the team filter, and vice versa
watch(competitionFilter, (val) => {
  if (val) teamFilter.value = null
})
watch(teamFilter, (val) => {
  if (val) competitionFilter.value = null
})

// ---- Methods ----

function onFilterChange() {
  page.value = 0
  events.value = []
  lastPage.value = true
  loadEvents()
}

function onCompetitionFilterChange() {
  // When sport filter is 'motorsport', no team filter is shown
  page.value = 0
  events.value = []
  lastPage.value = true
  loadEvents()
}

function onTeamFilterChange() {
  page.value = 0
  events.value = []
  lastPage.value = true
  loadEvents()
}

async function loadEvents() {
  loading.value = true
  fetchError.value = false

  try {
    // Build sports param — derive from sport filter, or fall back to the
    // selected competition/team filter so the correct sport is always sent.
    let sports: ('football' | 'motorsport')[] | undefined
    if (sportFilter.value) {
      sports = [sportFilter.value as 'football' | 'motorsport']
    } else if (competitionFilter.value) {
      sports = [competitionFilter.value.sport]
    } else if (teamFilter.value) {
      sports = ['football']
    }

    // Build competition filter
    const competitions = competitionFilter.value
      ? [competitionFilter.value.name]
      : undefined

    // Build team filter
    const teamIds = teamFilter.value ? [teamFilter.value.id] : undefined

    const res = await fetchFavouriteEvents({
      sports,
      competitions,
      teamIds,
      eventStatus: eventStatusFilter.value,
      watchStatus: watchStatusFilter.value,
      page: page.value,
      pageSize,
    })

    if (page.value === 0) {
      events.value = res.events ?? []
    } else {
      events.value.push(...(res.events ?? []))
    }
    lastPage.value = res.last ?? false
    // Safety: if backend returns no events, stop paginating to prevent
    // an infinite loading loop when the backend miscounts totalElements.
    if ((res.events ?? []).length === 0) {
      lastPage.value = true
    }
    fetchError.value = false
  } catch (err) {
    if (page.value === 0) events.value = []
    fetchError.value = true
    if (axios.isAxiosError(err) && err.response?.status === 401) {
      userStore.showLoginDialog = true
    }
  } finally {
    loading.value = false
  }

  await nextTick()
  if (sentinelRef.value && observer && !lastPage.value) {
    observer.unobserve(sentinelRef.value)
    observer.observe(sentinelRef.value)
  }
}

function loadMore() {
  if (!loading.value && !lastPage.value) {
    page.value++
    loadEvents()
  }
}

function setupObserver() {
  if (observer) observer.disconnect()
  observer = new IntersectionObserver(
    (entries) => {
      if (entries[0].isIntersecting && !loading.value && !lastPage.value) {
        page.value++
        loadEvents()
      }
    },
    { rootMargin: '200px' },
  )
}

async function loadReferenceData() {
  if (refDataFetched.value) return
  loadingRefData.value = true
  try {
    const [fbComps, msComps, fbTeams] = await Promise.all([
      fetchFootballCompetitions(),
      fetchMotorsportCompetitions(),
      fetchFootballTeams(),
    ])
    footballComps.value = fbComps
    motorsportComps.value = msComps
    footballTeams.value = fbTeams
    refDataFetched.value = true
  } catch (_) {
    // Non-critical: dropdowns just won't have full data
  } finally {
    loadingRefData.value = false
  }
}

function updateWatchStatus(ev: FavouriteEvent, newStatus: WatchedStatus) {
  const wrapper = events.value.find(
    (w) => w.sport === ev.sport && w.details.id === ev.details.id,
  )
  if (wrapper) wrapper.status = newStatus

  updateFavouriteEventWatchStatus(ev.sport, ev.details.id, newStatus)
    .then(() => {
      toast.add({
        severity: 'success',
        summary: 'Success',
        detail: 'Watch status updated',
        life: 3000,
      })
    })
    .catch(() => {
      toast.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Watch status update failed',
        life: 3000,
      })
    })
}

function openDetail(ev: FavouriteEvent) {
  dialogSport.value = ev.sport
  dialogWatchStatus.value = ev.status

  if (ev.sport === 'football') {
    dialogFootballEvent.value = ev.details as FootballEventDetails
    dialogMotorsportEvent.value = null
  } else {
    dialogMotorsportEvent.value = ev.details as MotorsportEventDetails
    dialogFootballEvent.value = null
  }

  dialogVisible.value = true
}

function onDialogStatusUpdate(newStatus: WatchedStatus) {
  const currentSport = dialogSport.value
  const currentId =
    currentSport === 'football'
      ? dialogFootballEvent.value?.id
      : dialogMotorsportEvent.value?.id

  if (currentId != null) {
    const ev = events.value.find(
      (w) => w.sport === currentSport && w.details.id === currentId,
    )
    if (ev) {
      updateWatchStatus(ev, newStatus)
    }
  }
}

// ---- Lifecycle ----

onMounted(async () => {
  setupObserver()
  await loadReferenceData()
  await loadEvents()
})

watch(sentinelRef, (el) => {
  if (observer && el) observer.observe(el)
}, { flush: 'post' })

onBeforeUnmount(() => {
  if (observer) observer.disconnect()
})

// ---- Page Meta ----

definePageMeta({ title: 'Favourites' })

useSeoMeta({
  title: 'Favourites',
  description:
    'View events from your favourite competitions, teams, and championships across all sports.',
  ogTitle: 'Favourites — Trakket',
  ogDescription:
    'View events from your favourite competitions, teams, and championships across all sports.',
  ogImage: '/og-image.png',
  ogUrl: 'https://www.trakket.com/favourites',
})
</script>
