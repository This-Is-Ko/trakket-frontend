<template>
  <div class="px-2 sm:px-4 py-4 mx-auto">
    <h1 class="text-3xl font-bold text-center mb-2">Motorsport Statistics</h1>
    <p class="text-sm text-gray-500 dark:text-gray-400 text-center mb-8">
      Your motorsport viewing habits and insights
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
      <!-- Section 1: Overview                                               -->
      <!-- ═══════════════════════════════════════════════════════════════════ -->
      <section>
        <h2 class="text-xl font-semibold mb-4 flex items-center gap-2">
          <i class="pi pi-chart-pie text-red-400" />
          Overview
        </h2>
        <div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="Races Watched"
            :value="totalWatched"
            icon="pi pi-eye"
            :description="`Across ${uniqueCompetitions} competitions`"
          />
          <StatCard
            title="Competitions"
            :value="uniqueCompetitions"
            icon="pi pi-trophy"
            description="Unique competitions"
          />
          <StatCard
            title="Top Watch Method"
            :value="topMethodLabel"
            icon="pi pi-play-circle"
            :description="topMethodPercent"
          />
          <StatCard
            title="Best Season"
            :value="bestSeasonDisplay"
            icon="pi pi-calendar"
            :description="bestSeasonLabel"
          />
        </div>
      </section>

      <!-- ═══════════════════════════════════════════════════════════════════ -->
      <!-- Section 2: Favourites Spotlight                                    -->
      <!-- ═══════════════════════════════════════════════════════════════════ -->
      <section v-if="hasFavourites">
        <h2 class="text-xl font-semibold mb-4 flex items-center gap-2">
          <i class="pi pi-star-fill text-yellow-500" />
          Your Favourites
        </h2>
        <FavouritesSpotlight
          sport="motorsport"
          :favourite-competitions="favouriteCompetitions"
          :favourite-team-ids="[]"
          :per-competition-data="watchedEventsPerCompetition"
          :top-teams="[]"
        />
      </section>

      <section v-else>
        <div
          class="bg-surface-0 dark:bg-surface-900 p-6 rounded-xl border border-surface-200 dark:border-surface-700 border-dashed text-center"
        >
          <i class="pi pi-star text-3xl text-gray-400 mb-3 block" />
          <h3 class="text-lg font-semibold mb-1">Unlock Personalised Insights</h3>
          <p class="text-sm text-gray-500 dark:text-gray-400 max-w-md mx-auto">
            Favourite your competitions to see how often you watch them
            and which series dominate your viewing.
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
      <!-- Section 3: How You Watch                                          -->
      <!-- ═══════════════════════════════════════════════════════════════════ -->
      <section>
        <h2 class="text-xl font-semibold mb-4 flex items-center gap-2">
          <i class="pi pi-chart-bar text-red-400" />
          How You Watch
        </h2>
        <div class="grid md:grid-cols-2 gap-6">
          <!-- Doughnut -->
          <div
            class="bg-surface-0 dark:bg-surface-900 p-6 rounded-xl border border-surface-200 dark:border-surface-700 flex flex-col gap-4"
          >
            <h3 class="text-lg font-semibold text-center">Watch Method</h3>
            <div class="flex-1 flex items-center justify-center min-h-[260px]">
              <Chart type="doughnut" :data="watchStatusChart" :options="doughnutOptions" class="w-full max-w-xs" />
            </div>
          </div>

          <!-- Stat cards for each watch method -->
          <div
            class="bg-surface-0 dark:bg-surface-900 p-6 rounded-xl border border-surface-200 dark:border-surface-700 flex flex-col gap-4"
          >
            <h3 class="text-lg font-semibold text-center">Status Breakdown</h3>
            <div class="flex-1 grid grid-cols-2 gap-3 content-center">
              <div
                v-for="(count, status) in watchStatusDistribution"
                :key="status"
                class="flex flex-col items-center justify-center bg-surface-100 dark:bg-surface-800 rounded-xl p-4"
              >
                <i :class="[statusIcon(status), 'text-xl mb-1', statusIconColor(status)]" />
                <div class="text-2xl font-bold">{{ count }}</div>
                <div class="text-xs text-gray-500 dark:text-gray-400">
                  {{ formatEnumToString(status) }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- ═══════════════════════════════════════════════════════════════════ -->
      <!-- Section 4: Competitions & Circuits                                 -->
      <!-- ═══════════════════════════════════════════════════════════════════ -->
      <section>
        <h2 class="text-xl font-semibold mb-4 flex items-center gap-2">
          <i class="pi pi-trophy text-red-400" />
          Competitions &amp; Circuits
        </h2>
        <div class="flex flex-col gap-6">
          <!-- Races per Competition horizontal bar -->
          <div
            class="bg-surface-0 dark:bg-surface-900 p-6 rounded-xl border border-surface-200 dark:border-surface-700 flex flex-col gap-4"
          >
            <h3 class="text-lg font-semibold text-center">Races per Competition</h3>
            <div class="min-h-[260px]">
              <Chart type="bar" :data="competitionChart" :options="horizontalBarOptions" class="w-full" />
            </div>
          </div>
        </div>
      </section>

      <!-- ═══════════════════════════════════════════════════════════════════ -->
      <!-- Section 5: Season Coverage                                        -->
      <!-- ═══════════════════════════════════════════════════════════════════ -->
      <section>
        <h2 class="text-xl font-semibold mb-4 flex items-center gap-2">
          <i class="pi pi-calendar text-red-400" />
          Season Coverage
        </h2>
        <div
          class="bg-surface-0 dark:bg-surface-900 p-6 rounded-xl border border-surface-200 dark:border-surface-700 flex flex-col gap-4"
        >
          <h3 class="text-lg font-semibold text-center">Coverage by Competition (%)</h3>
          <div class="min-h-[260px]">
            <Chart type="bar" :data="seasonCoverageChart" :options="seasonCoverageOptions" class="w-full" />
          </div>
        </div>
      </section>

      <!-- ═══════════════════════════════════════════════════════════════════ -->
      <!-- Section 6: Recent Races                                           -->
      <!-- ═══════════════════════════════════════════════════════════════════ -->
      <section>
        <h2 class="text-xl font-semibold mb-4 flex items-center gap-2">
          <i class="pi pi-clock text-red-400" />
          Recent Races
        </h2>
        <div
          class="bg-surface-0 dark:bg-surface-900 p-6 rounded-xl border border-surface-200 dark:border-surface-700"
        >
          <DataTable :value="recentRaces" class="w-full">
            <Column header="">
              <template #body="slotProps">
                <img
                  v-if="slotProps.data.details.flagUrl"
                  :src="slotProps.data.details.flagUrl"
                  alt="flag"
                  class="h-5 w-auto rounded"
                />
              </template>
            </Column>
            <Column header="Race">
              <template #body="slotProps">
                <span class="text-sm font-medium">
                  {{ slotProps.data.details.raceName ?? slotProps.data.details.title }}
                </span>
              </template>
            </Column>
            <Column header="Circuit">
              <template #body="slotProps">
                <span class="text-xs text-gray-500 dark:text-gray-400">
                  {{ slotProps.data.details.circuitName ?? '-' }}
                </span>
              </template>
            </Column>
            <Column header="Competition">
              <template #body="slotProps">
                <span class="text-xs text-gray-500 dark:text-gray-400">
                  {{ slotProps.data.details.competition.displayName }}
                </span>
              </template>
            </Column>
            <Column header="Date" :sortable="true" sortField="details.dateTime">
              <template #body="slotProps">
                <span class="text-xs whitespace-nowrap">
                  {{ relativeDate(slotProps.data.details.dateTime) }}
                </span>
              </template>
            </Column>
            <Column header="Winner">
              <template #body="slotProps">
                <span class="text-xs text-gray-500 dark:text-gray-400">
                  {{ slotProps.data.details.winner ?? '-' }}
                </span>
              </template>
            </Column>
            <Column header="Status" :sortable="true" sortField="status">
              <template #body="slotProps">
                <Tag
                  :value="formatEnumToString(slotProps.data.status)"
                  :severity="statusSeverity(slotProps.data.status)"
                  class="text-xs"
                />
              </template>
            </Column>
          </DataTable>

          <div
            v-if="recentRaces.length === 0"
            class="text-center py-6 text-sm text-gray-500 dark:text-gray-400"
          >
            No watched races yet. Start tracking to see recent activity here!
          </div>
        </div>
      </section>

      <!-- ═══════════════════════════════════════════════════════════════════ -->
      <!-- Section 7: Back to Overall                                        -->
      <!-- ═══════════════════════════════════════════════════════════════════ -->
      <section>
        <NuxtLink
          to="/statistics"
          class="block group bg-surface-0 dark:bg-surface-900 p-5 rounded-xl border border-surface-200 dark:border-surface-700 hover:border-red-500/50 transition-colors"
        >
          <div class="flex items-center gap-3">
            <i class="pi pi-arrow-left text-lg text-gray-400 group-hover:text-red-400 transition-colors" />
            <div>
              <div class="font-semibold">Back to Overall Statistics</div>
              <div class="text-xs text-gray-500 dark:text-gray-400">
                View all sports combined stats
              </div>
            </div>
          </div>
        </NuxtLink>
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
  competitionEnumToDisplayName,
} from '~/services/statistics';
import type { AllStatistics } from '~/services/statistics';
import ProgressSpinner from 'primevue/progressspinner';
import Message from 'primevue/message';
import StatCard from '~/components/statistics/StatCard.vue';
import FavouritesSpotlight from '~/components/statistics/FavouritesSpotlight.vue';
import { useFavouriteStore } from '~/stores/useFavouriteStore';

// ─── Stores ───────────────────────────────────────────────────────────────

const favouriteStore = useFavouriteStore();

// ─── State ────────────────────────────────────────────────────────────────

const loading = ref(true);
const fetchError = ref(false);
const stats = ref<AllStatistics | null>(null);

// ─── Derived: Overview ────────────────────────────────────────────────────

const totalWatched = computed(() => {
  if (!stats.value) return 0;
  return sumValues(stats.value.motorsport.watchStatusDistribution);
});

const uniqueCompetitions = computed(() => {
  if (!stats.value) return 0;
  return Object.keys(stats.value.motorsport.watchedEventsPerCompetition).length;
});

const watchStatusDistribution = computed(() => {
  return stats.value?.motorsport.watchStatusDistribution ?? {};
});

const topMethod = computed(() => {
  if (!stats.value) return null;
  return maxKey(stats.value.motorsport.watchStatusDistribution);
});

const topMethodLabel = computed(() => {
  if (!topMethod.value) return '-';
  return formatEnumToString(topMethod.value);
});

const topMethodPercent = computed(() => {
  if (!topMethod.value || totalWatched.value === 0) return '';
  const count = stats.value!.motorsport.watchStatusDistribution[topMethod.value] ?? 0;
  return `${Math.round((count / totalWatched.value) * 100)}% of races`;
});

const bestSeasonDisplay = computed(() => {
  if (!stats.value) return '-';
  const coverage = stats.value.motorsport.motorsportSeasonCoverage;
  if (!coverage || Object.keys(coverage).length === 0) return '-';
  let bestSeason: string | null = null;
  let bestPct = -1;
  for (const [, seasons] of Object.entries(coverage)) {
    for (const [season, pct] of Object.entries(seasons)) {
      if (pct > bestPct) {
        bestPct = pct;
        bestSeason = season;
      }
    }
  }
  return bestSeason ?? '-';
});

const bestSeasonLabel = computed(() => {
  if (!stats.value) return '';
  const coverage = stats.value.motorsport.motorsportSeasonCoverage;
  if (!bestSeasonDisplay.value || bestSeasonDisplay.value === '-') return 'No season data';
  let bestPct = -1;
  for (const [, seasons] of Object.entries(coverage)) {
    const pct = seasons[bestSeasonDisplay.value] ?? -1;
    if (pct > bestPct) bestPct = pct;
  }
  return `${Math.round(bestPct)}% of ${bestSeasonDisplay.value} season`;
});

// ─── Derived: Favourites ──────────────────────────────────────────────────

const hasFavourites = computed(() => {
  return favouriteStore.motorsportCompetitions.length > 0;
});

const favouriteCompetitions = computed(() => favouriteStore.motorsportCompetitions);

const watchedEventsPerCompetition = computed<Record<string, number>>(() => {
  return stats.value?.motorsport.watchedEventsPerCompetition ?? {};
});

// ─── Derived: Recent Races ───────────────────────────────────────────────

const recentRaces = computed(() => {
  return stats.value?.motorsport.recentEvents ?? [];
});

// ─── Chart data ────────────────────────────────────────────────────────────

const statusColors = ['#34d399', '#60a5fa', '#facc15', '#a78bfa'];

const watchStatusChart = computed(() => {
  const dist = stats.value?.motorsport.watchStatusDistribution ?? {};
  const labels = Object.keys(dist).map(formatEnumToString);
  return {
    labels,
    datasets: [
      {
        data: Object.values(dist),
        backgroundColor: statusColors.slice(0, labels.length),
        borderWidth: 2,
        borderColor: 'transparent',
      },
    ],
  };
});

const competitionChart = computed(() => {
  const comps = stats.value?.motorsport.watchedEventsPerCompetition ?? {};
  const entries = Object.entries(comps).sort(([, a], [, b]) => b - a);
  const labels = entries.map(([name]) => name);
  const data = entries.map(([, count]) => count);

  // Build set of favourite competition display names for highlighting
  const favDisplayNames = new Set(
    favouriteStore.motorsportCompetitions.map(competitionEnumToDisplayName),
  );

  return {
    labels,
    datasets: [
      {
        label: 'Races',
        data,
        backgroundColor: labels.map((l) =>
          favDisplayNames.has(l) ? '#fbbf24' : '#3b82f6',
        ),
        borderRadius: 4,
      },
    ],
  };
});

const competitionColors = ['#ef4444', '#3b82f6', '#f59e0b', '#8b5cf6'];

const seasonCoverageChart = computed(() => {
  const coverage = stats.value?.motorsport.motorsportSeasonCoverage ?? {};
  const competitions = Object.keys(coverage).sort();

  // Collect all unique seasons across all competitions, sorted
  const allSeasons = new Set<string>();
  for (const seasons of Object.values(coverage)) {
    for (const season of Object.keys(seasons)) {
      allSeasons.add(season);
    }
  }
  const labels = [...allSeasons].sort((a, b) => Number(a) - Number(b));

  const datasets = competitions.map((comp, i) => ({
    label: comp,
    data: labels.map((s) => Math.round(coverage[comp][s] ?? 0)),
    backgroundColor: competitionColors[i % competitionColors.length],
    borderRadius: 4,
  }));

  return { labels, datasets };
});

// ─── Icons and helpers ─────────────────────────────────────────────────────

function statusIcon(status: string): string {
  switch (status) {
    case 'IN_PERSON':
      return 'pi pi-ticket';
    case 'LIVE':
      return 'pi pi-clock';
    case 'REPLAY':
      return 'pi pi-play-circle';
    case 'HIGHLIGHTS':
      return 'pi pi-video';
    default:
      return 'pi pi-eye';
  }
}

function statusIconColor(status: string): string {
  switch (status) {
    case 'IN_PERSON':
      return 'text-green-500';
    case 'LIVE':
      return 'text-blue-500';
    case 'REPLAY':
      return 'text-amber-500';
    case 'HIGHLIGHTS':
      return 'text-purple-500';
    default:
      return 'text-gray-400';
  }
}

function relativeDate(datetime: string): string {
  if (!datetime) return '-';
  const d = new Date(datetime);
  const now = new Date();
  const diffMs = now.getTime() - d.getTime();
  const diffDays = Math.floor(diffMs / 86_400_000);

  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 7) return `${diffDays} days ago`;

  return d.toLocaleString('en-AU', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

function statusSeverity(status: string): 'info' | 'success' | 'warn' | 'contrast' | undefined {
  switch (status) {
    case 'LIVE':
      return 'info';
    case 'IN_PERSON':
      return 'success';
    case 'REPLAY':
      return 'warn';
    case 'HIGHLIGHTS':
      return 'contrast';
    default:
      return undefined;
  }
}

// ─── Chart options ─────────────────────────────────────────────────────────

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

const horizontalBarOptions = {
  indexAxis: 'y' as const,
  responsive: true,
  maintainAspectRatio: true,
  plugins: {
    legend: { display: false },
  },
  scales: {
    x: {
      beginAtZero: true,
      ticks: { precision: 0 },
      grid: { display: true },
    },
    y: {
      grid: { display: false },
    },
  },
};

const seasonCoverageOptions = {
  responsive: true,
  maintainAspectRatio: true,
  plugins: {
    legend: {
      position: 'bottom' as const,
      labels: { padding: 16, usePointStyle: true, pointStyle: 'circle' },
    },
  },
  scales: {
    x: {
      grid: { display: false },
    },
    y: {
      beginAtZero: true,
      max: 100,
      ticks: { callback: (v: number) => `${v}%` },
    },
  },
};

// ─── Fetch ─────────────────────────────────────────────────────────────────

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

definePageMeta({ title: 'Motorsport Statistics' });

useSeoMeta({
  title: 'Motorsport Statistics',
  description: 'View your motorsport viewing statistics — races watched, championships followed, and trends over time.',
  ogTitle: 'Motorsport Statistics — Trakket',
  ogDescription: 'View your motorsport viewing statistics — races watched, championships followed, and trends over time.',
  ogImage: '/og-image.png',
  ogUrl: 'https://www.trakket.com/statistics/motorsport',
})
</script>
