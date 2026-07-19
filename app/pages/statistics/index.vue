<template>
  <div class="px-2 sm:px-4 py-4 mx-auto">
    <h1 class="text-3xl font-bold text-center mb-2">Overall Statistics</h1>
    <p class="text-sm text-gray-500 dark:text-gray-400 text-center mb-8">
      Your complete sports viewing history at a glance
    </p>

    <!-- Loading -->
    <div v-if="loading" class="flex justify-center py-20">
      <ProgressSpinner />
    </div>

    <!-- Error -->
    <div v-else-if="fetchError" class="text-center py-20 text-gray-500">
      <Message severity="error">Unable to load statistics. Please try again later.</Message>
    </div>

    <!-- Content -->
    <div v-else class="space-y-10">

      <!-- ═══════════════════════════════════════════════════════════════════ -->
      <!-- Section 1: Headline Hero                                           -->
      <!-- ═══════════════════════════════════════════════════════════════════ -->
      <section>
        <h2 class="text-xl font-semibold mb-4 flex items-center gap-2">
          <i class="pi pi-chart-pie text-primary-400" />
          Overview
        </h2>
        <div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="Events Watched"
            :value="totalWatched"
            icon="pi pi-eye"
            :description="`Across ${activeSports} sport${activeSports !== 1 ? 's' : ''}`"
          />
          <StatCard
            title="Competitions Followed"
            :value="uniqueCompetitions"
            icon="pi pi-trophy"
            description="Unique competitions watched"
          />
          <StatCard
            title="Top Method"
            :value="topWatchMethodDisplay"
            icon="pi pi-play-circle"
            :description="topWatchMethodPercent"
          />
          <StatCard
            title="Season Streak"
            :value="bestSeasonDisplay"
            icon="pi pi-calendar"
            :description="bestSeasonLabel"
          />
        </div>
      </section>

      <!-- ═══════════════════════════════════════════════════════════════════ -->
      <!-- Section 2: How You Watch                                          -->
      <!-- ═══════════════════════════════════════════════════════════════════ -->
      <section>
        <h2 class="text-xl font-semibold mb-4 flex items-center gap-2">
          <i class="pi pi-chart-bar text-primary-400" />
          How You Watch
        </h2>
        <div class="grid md:grid-cols-2 gap-6">
          <!-- Sports Mix Doughnut -->
          <div
            class="bg-surface-0 dark:bg-surface-900 p-6 rounded-xl border border-surface-200 dark:border-surface-700 flex flex-col gap-4"
          >
            <h3 class="text-lg font-semibold text-center">Sports Mix</h3>
            <div class="flex-1 flex items-center justify-center min-h-[260px]">
              <Chart type="doughnut" :data="sportsMixChart" :options="doughnutOptions" class="w-full max-w-xs" />
            </div>
          </div>

          <!-- Watch Status Overview -->
          <div
            class="bg-surface-0 dark:bg-surface-900 p-6 rounded-xl border border-surface-200 dark:border-surface-700 flex flex-col gap-4"
          >
            <h3 class="text-lg font-semibold text-center">Watch Status Overview</h3>
            <div class="flex-1 flex items-center justify-center min-h-[260px]">
              <Chart type="pie" :data="watchStatusChart" :options="pieChartOptions" class="w-full max-w-xs" />
            </div>
          </div>

          <!-- Grouped bar: Watch Method Per Sport -->
          <div
            class="md:col-span-2 bg-surface-0 dark:bg-surface-900 p-6 rounded-xl border border-surface-200 dark:border-surface-700 flex flex-col gap-4"
          >
            <h3 class="text-lg font-semibold text-center">Watch Method by Sport</h3>
            <div class="min-h-[260px]">
              <Chart type="bar" :data="watchMethodBySportChart" :options="groupedBarOptions" class="w-full" />
            </div>
          </div>
        </div>
      </section>

      <!-- ═══════════════════════════════════════════════════════════════════ -->
      <!-- Section 3: Favourites Spotlight                                    -->
      <!-- ═══════════════════════════════════════════════════════════════════ -->
      <section v-if="hasFavourites">
        <h2 class="text-xl font-semibold mb-4 flex items-center gap-2">
          <i class="pi pi-star-fill text-yellow-500" />
          Your Favourites
        </h2>
        <FavouritesSpotlight
          :favourite-competitions="favouriteCompetitions"
          :favourite-team-ids="favouriteTeamIds"
          :per-competition-data="combinedPerCompetition"
          :top-teams="footballTopTeams"
        />
      </section>

      <!-- No favourites: friendly CTA -->
      <section v-else>
        <div
          class="bg-surface-0 dark:bg-surface-900 p-6 rounded-xl border border-surface-200 dark:border-surface-700 border-dashed text-center"
        >
          <i class="pi pi-star text-3xl text-gray-400 mb-3 block" />
          <h3 class="text-lg font-semibold mb-1">Unlock Personalised Insights</h3>
          <p class="text-sm text-gray-500 dark:text-gray-400 max-w-md mx-auto">
            Favourite your teams and competitions to see tailored stats here —
            including how often you watch your favourite teams and how much of
            each season you&rsquo;ve covered.
          </p>
          <NuxtLink
            to="/favourites"
            class="inline-block mt-4 px-5 py-2 rounded-full text-sm font-medium bg-primary text-white hover:bg-primary-600 transition-colors"
          >
            Go to Favourites
          </NuxtLink>
        </div>
      </section>

      <!-- ═══════════════════════════════════════════════════════════════════ -->
      <!-- Section 4: Recent Activity                                        -->
      <!-- ═══════════════════════════════════════════════════════════════════ -->
      <section>
        <h2 class="text-xl font-semibold mb-4 flex items-center gap-2">
          <i class="pi pi-clock text-primary-400" />
          Recent Activity
        </h2>
        <RecentActivityTimeline :events="combinedRecentEvents" />
      </section>

      <!-- ═══════════════════════════════════════════════════════════════════ -->
      <!-- Section 5: Deep Dive                                              -->
      <!-- ═══════════════════════════════════════════════════════════════════ -->
      <section>
        <h2 class="text-xl font-semibold mb-4 flex items-center gap-2">
          <i class="pi pi-search text-primary-400" />
          Dive Deeper
        </h2>
        <div class="grid md:grid-cols-2 gap-6">
          <!-- Football -->
          <NuxtLink
            to="/statistics/football"
            class="block group bg-surface-0 dark:bg-surface-900 p-6 rounded-xl border border-surface-200 dark:border-surface-700 hover:border-blue-500/50 transition-colors"
          >
            <div class="flex items-start justify-between mb-4">
              <div>
                <div class="flex items-center gap-2 mb-1">
                  <span class="text-2xl">⚽</span>
                  <h3 class="text-xl font-bold">Football Stats</h3>
                </div>
                <p class="text-sm text-gray-500 dark:text-gray-400">
                  {{ footballPreviewText }}
                </p>
              </div>
              <i class="pi pi-arrow-right text-xl text-gray-400 group-hover:text-blue-400 transition-colors mt-1" />
            </div>
            <div class="grid grid-cols-3 gap-3 text-center text-xs">
              <div class="bg-surface-100 dark:bg-surface-800 rounded-lg p-3">
                <div class="font-bold text-lg">{{ footballEventCount }}</div>
                <div class="text-gray-500 dark:text-gray-400">Events</div>
              </div>
              <div class="bg-surface-100 dark:bg-surface-800 rounded-lg p-3">
                <div class="font-bold text-lg">{{ footballCompCount }}</div>
                <div class="text-gray-500 dark:text-gray-400">Comps</div>
              </div>
              <div class="bg-surface-100 dark:bg-surface-800 rounded-lg p-3">
                <div class="font-bold text-lg">{{ footballTopTeamName }}</div>
                <div class="text-gray-500 dark:text-gray-400">Top Team</div>
              </div>
            </div>
          </NuxtLink>

          <!-- Motorsport -->
          <NuxtLink
            to="/statistics/motorsport"
            class="block group bg-surface-0 dark:bg-surface-900 p-6 rounded-xl border border-surface-200 dark:border-surface-700 hover:border-red-500/50 transition-colors"
          >
            <div class="flex items-start justify-between mb-4">
              <div>
                <div class="flex items-center gap-2 mb-1">
                  <span class="text-2xl">🏎️</span>
                  <h3 class="text-xl font-bold">Motorsport Stats</h3>
                </div>
                <p class="text-sm text-gray-500 dark:text-gray-400">
                  {{ motorsportPreviewText }}
                </p>
              </div>
              <i class="pi pi-arrow-right text-xl text-gray-400 group-hover:text-red-400 transition-colors mt-1" />
            </div>
            <div class="grid grid-cols-3 gap-3 text-center text-xs">
              <div class="bg-surface-100 dark:bg-surface-800 rounded-lg p-3">
                <div class="font-bold text-lg">{{ motorsportEventCount }}</div>
                <div class="text-gray-500 dark:text-gray-400">Events</div>
              </div>
              <div class="bg-surface-100 dark:bg-surface-800 rounded-lg p-3">
                <div class="font-bold text-lg">{{ motorsportCompCount }}</div>
                <div class="text-gray-500 dark:text-gray-400">Comps</div>
              </div>
              <div class="bg-surface-100 dark:bg-surface-800 rounded-lg p-3">
                <div class="font-bold text-lg">{{ motorsportTopSeasonLabel }}</div>
                <div class="text-gray-500 dark:text-gray-400">Best Season</div>
              </div>
            </div>
          </NuxtLink>
        </div>
      </section>

    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import {
  fetchStatistics,
  formatEnumToString,
  sumValues,
  maxKey,
  mergeRecentEvents,
} from '~/services/statistics';
import type {
  AllStatistics,
  CombinedRecentEvent,
  FootballTeamStatistics,
} from '~/services/statistics';
import ProgressSpinner from 'primevue/progressspinner';
import Message from 'primevue/message';
import StatCard from '~/components/statistics/StatCard.vue';
import FavouritesSpotlight from '~/components/statistics/FavouritesSpotlight.vue';
import RecentActivityTimeline from '~/components/statistics/RecentActivityTimeline.vue';
import { useFavouriteStore } from '~/stores/useFavouriteStore';

// ─── Stores ───────────────────────────────────────────────────────────────

const favouriteStore = useFavouriteStore();

// ─── State ────────────────────────────────────────────────────────────────

const loading = ref(true);
const fetchError = ref(false);
const stats = ref<AllStatistics | null>(null);

// ─── Derived computed values ──────────────────────────────────────────────

const totalWatched = computed(() => {
  if (!stats.value) return 0;
  return sumValues(stats.value.overall.watchStatusDistribution);
});

const uniqueCompetitions = computed(() => {
  if (!stats.value) return 0;
  const comps = new Set<string>();
  for (const key of Object.keys(stats.value.football.perCompetition)) {
    comps.add(key);
  }
  for (const key of Object.keys(stats.value.motorsport.watchedEventsPerCompetition)) {
    comps.add(key);
  }
  return comps.size;
});

const activeSports = computed(() => {
  if (!stats.value) return 0;
  return Object.values(stats.value.overall.sportsMix).filter((v) => v > 0).length;
});

const topWatchMethod = computed(() => {
  if (!stats.value) return null;
  return maxKey(stats.value.overall.watchStatusDistribution);
});

const topWatchMethodDisplay = computed(() => {
  if (!topWatchMethod.value) return '-';
  return formatEnumToString(topWatchMethod.value);
});

const topWatchMethodPercent = computed(() => {
  if (!topWatchMethod.value || totalWatched.value === 0) return '';
  const count = stats.value!.overall.watchStatusDistribution[topWatchMethod.value] ?? 0;
  const pct = Math.round((count / totalWatched.value) * 100);
  return `${pct}% of all watched events`;
});

const bestSeasonDisplay = computed(() => {
  if (!stats.value) return '-';
  const coverage = stats.value.motorsport.motorsportSeasonCoverage;
  if (!coverage || Object.keys(coverage).length === 0) return '-';
  let best: string | null = null;
  let bestVal = -1;
  for (const [, seasons] of Object.entries(coverage)) {
    for (const [season, pct] of Object.entries(seasons)) {
      if (pct > bestVal) {
        bestVal = pct;
        best = season;
      }
    }
  }
  return best ?? '-';
});

const bestSeasonLabel = computed(() => {
  if (!stats.value) return '';
  const coverage = stats.value.motorsport.motorsportSeasonCoverage;
  if (!bestSeasonDisplay.value || bestSeasonDisplay.value === '-') return 'No motorsport data';
  let bestPct = -1;
  for (const [, seasons] of Object.entries(coverage)) {
    const pct = seasons[bestSeasonDisplay.value] ?? -1;
    if (pct > bestPct) bestPct = pct;
  }
  return `${Math.round(bestPct)}% of ${bestSeasonDisplay.value} season watched`;
});

const combinedRecentEvents = computed<CombinedRecentEvent[]>(() => {
  if (!stats.value) return [];
  return mergeRecentEvents(
    stats.value.football.recentEvents,
    stats.value.motorsport.recentEvents,
  );
});

// ─── Favourites ───────────────────────────────────────────────────────────

const hasFavourites = computed(() => {
  return (
    favouriteStore.footballCompetitions.length > 0 ||
    favouriteStore.footballTeams.length > 0 ||
    favouriteStore.motorsportCompetitions.length > 0
  );
});

const favouriteCompetitions = computed(() => favouriteStore.footballCompetitions);

const favouriteTeamIds = computed(() => favouriteStore.footballTeams);

const footballTopTeams = computed<FootballTeamStatistics[]>(() => {
  return stats.value?.football.topTeams ?? [];
});

const combinedPerCompetition = computed<Record<string, number>>(() => {
  return {
    ...(stats.value?.football.perCompetition ?? {}),
    ...(stats.value?.motorsport.watchedEventsPerCompetition ?? {}),
  };
});

// ─── Deep Dive Computed ───────────────────────────────────────────────────

const footballEventCount = computed(() => {
  if (!stats.value) return 0;
  return sumValues(stats.value.football.watchStatusDistribution);
});

const footballCompCount = computed(() => {
  if (!stats.value) return 0;
  return Object.keys(stats.value.football.perCompetition).length;
});

const footballTopTeamName = computed(() => {
  if (!stats.value || stats.value.football.topTeams.length === 0) return '-';
  const maxTeam = stats.value.football.topTeams[0];
  return maxTeam.teamName.length > 10
    ? maxTeam.teamName.substring(0, 10) + '…'
    : maxTeam.teamName;
});

const footballPreviewText = computed(() => {
  if (!stats.value || footballEventCount.value === 0) return 'No football events watched yet.';
  const topCompetitions = Object.entries(stats.value.football.perCompetition)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 2)
    .map(([name]) => name);
  if (topCompetitions.length === 0) return 'Explore your football statistics.';
  return `Most watched: ${topCompetitions.join(', ')}`;
});

const motorsportEventCount = computed(() => {
  if (!stats.value) return 0;
  return sumValues(stats.value.motorsport.watchStatusDistribution);
});

const motorsportCompCount = computed(() => {
  if (!stats.value) return 0;
  return Object.keys(stats.value.motorsport.watchedEventsPerCompetition).length;
});

const motorsportTopSeasonLabel = computed(() => {
  if (!stats.value) return '-';
  const coverage = stats.value.motorsport.motorsportSeasonCoverage;
  if (!coverage || Object.keys(coverage).length === 0) return '-';
  let bestPct = -1;
  let bestSeason: string | null = null;
  for (const [, seasons] of Object.entries(coverage)) {
    for (const [season, pct] of Object.entries(seasons)) {
      if (pct > bestPct) {
        bestPct = pct;
        bestSeason = season;
      }
    }
  }
  return bestSeason ? `${Math.round(bestPct)}%` : '-';
});

const motorsportPreviewText = computed(() => {
  if (!stats.value || motorsportEventCount.value === 0) return 'No motorsport events watched yet.';
  const topComps = Object.entries(stats.value.motorsport.watchedEventsPerCompetition)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 2)
    .map(([name]) => name);
  if (topComps.length === 0) return 'Explore your motorsport statistics.';
  return `Most watched: ${topComps.join(', ')}`;
});

// ─── Charts ───────────────────────────────────────────────────────────────

const pieChartColors = ['#34d399', '#60a5fa', '#facc15', '#a78bfa'];

const sportsMixChart = computed(() => {
  if (!stats.value) return { labels: [], datasets: [] };
  const mix = stats.value.overall.sportsMix;
  const labels = Object.keys(mix).map(formatEnumToString);
  const data = Object.values(mix);
  return {
    labels,
    datasets: [
      {
        data,
        backgroundColor: ['#3b82f6', '#ef4444'],
        borderWidth: 2,
        borderColor: 'transparent',
      },
    ],
  };
});

const watchStatusChart = computed(() => {
  if (!stats.value) return { labels: [], datasets: [] };
  const dist = stats.value.overall.watchStatusDistribution;
  const labels = Object.keys(dist).map(formatEnumToString);
  const data = Object.values(dist);
  return {
    labels,
    datasets: [
      {
        data,
        backgroundColor: pieChartColors.slice(0, labels.length),
        borderWidth: 2,
        borderColor: 'transparent',
      },
    ],
  };
});

const watchMethodBySportChart = computed(() => {
  if (!stats.value) return { labels: [], datasets: [] };

  // All possible statuses in order
  const statuses = ['IN_PERSON', 'LIVE', 'REPLAY', 'HIGHLIGHTS'];
  const labels = statuses.map(formatEnumToString);

  const footballDist = stats.value.football.watchStatusDistribution;
  const motorsportDist = stats.value.motorsport.watchStatusDistribution;

  const footballData = statuses.map((s) => footballDist[s] ?? 0);
  const motorsportData = statuses.map((s) => motorsportDist[s] ?? 0);

  return {
    labels,
    datasets: [
      {
        label: 'Football',
        data: footballData,
        backgroundColor: '#3b82f6',
        borderRadius: 4,
      },
      {
        label: 'Motorsport',
        data: motorsportData,
        backgroundColor: '#ef4444',
        borderRadius: 4,
      },
    ],
  };
});

// ─── Chart options ────────────────────────────────────────────────────────

const doughnutOptions = {
  responsive: true,
  maintainAspectRatio: true,
  plugins: {
    legend: {
      position: 'bottom' as const,
      labels: { padding: 16, usePointStyle: true, pointStyle: 'circle' },
    },
  },
};

const pieChartOptions = {
  responsive: true,
  maintainAspectRatio: true,
  plugins: {
    legend: {
      position: 'bottom' as const,
      labels: { padding: 16, usePointStyle: true, pointStyle: 'circle' },
    },
  },
};

const groupedBarOptions = {
  responsive: true,
  maintainAspectRatio: true,
  plugins: {
    legend: {
      position: 'top' as const,
      labels: { padding: 16, usePointStyle: true, pointStyle: 'rect' },
    },
  },
  scales: {
    x: {
      grid: { display: false },
    },
    y: {
      beginAtZero: true,
      ticks: { precision: 0 },
    },
  },
};

// ─── Fetch ────────────────────────────────────────────────────────────────

onMounted(async () => {
  loading.value = true;
  fetchError.value = false;
  try {
    const data = await fetchStatistics();
    stats.value = data;
  } catch (err) {
    fetchError.value = true;
  } finally {
    loading.value = false;
  }
});

definePageMeta({ title: 'Statistics' });

useSeoMeta({
  title: 'Statistics',
  description: 'View your sports viewing statistics across football and motorsport. Understand your watching habits and trends.',
  ogTitle: 'Statistics — Trakket',
  ogDescription: 'View your sports viewing statistics across football and motorsport. Understand your watching habits and trends.',
  ogImage: '/og-image.png',
  ogUrl: 'https://www.trakket.com/statistics',
})
</script>
