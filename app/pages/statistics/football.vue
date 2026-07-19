<template>
  <div class="px-2 sm:px-4 py-4 mx-auto">
    <h1 class="text-3xl font-bold text-center mb-2">Football Statistics</h1>
    <p class="text-sm text-gray-500 dark:text-gray-400 text-center mb-8">
      Your football viewing habits and insights
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
          <i class="pi pi-chart-pie text-blue-400" />
          Overview
        </h2>
        <div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="Matches Watched"
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
            title="Most Watched Team"
            :value="topTeamName"
            icon="pi pi-users"
            :description="topTeamCount"
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
          :favourite-competitions="favouriteCompetitions"
          :favourite-team-ids="favouriteTeamIds"
          :per-competition-data="perCompetition"
          :top-teams="topTeams"
        />
      </section>

      <section v-else>
        <div
          class="bg-surface-0 dark:bg-surface-900 p-6 rounded-xl border border-surface-200 dark:border-surface-700 border-dashed text-center"
        >
          <i class="pi pi-star text-3xl text-gray-400 mb-3 block" />
          <h3 class="text-lg font-semibold mb-1">Unlock Personalised Team Insights</h3>
          <p class="text-sm text-gray-500 dark:text-gray-400 max-w-md mx-auto">
            Favourite your teams and competitions to see how often you watch them,
            which ones dominate your viewing, and more.
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
          <i class="pi pi-chart-bar text-blue-400" />
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
      <!-- Section 4: Competitions & Teams                                   -->
      <!-- ═══════════════════════════════════════════════════════════════════ -->
      <section>
        <h2 class="text-xl font-semibold mb-4 flex items-center gap-2">
          <i class="pi pi-trophy text-blue-400" />
          Competitions &amp; Teams
        </h2>
        <div class="flex flex-col gap-6">
          <!-- Competitions horizontal bar -->
          <div
            class="bg-surface-0 dark:bg-surface-900 p-6 rounded-xl border border-surface-200 dark:border-surface-700 flex flex-col gap-4"
          >
            <h3 class="text-lg font-semibold text-center">Matches per Competition</h3>
            <div class="min-h-[260px]">
              <Chart type="bar" :data="competitionChart" :options="horizontalBarOptions" class="w-full" />
            </div>
          </div>

          <!-- Top teams horizontal bar -->
          <div
            class="bg-surface-0 dark:bg-surface-900 p-6 rounded-xl border border-surface-200 dark:border-surface-700 flex flex-col gap-4"
          >
            <h3 class="text-lg font-semibold text-center">Top Teams</h3>
            <div class="min-h-[260px]">
              <Chart type="bar" :data="topTeamsChart" :options="horizontalBarOptions" class="w-full" />
            </div>
          </div>
        </div>
      </section>

      <!-- ═══════════════════════════════════════════════════════════════════ -->
      <!-- Section 5: Team Season Coverage                                   -->
      <!-- ═══════════════════════════════════════════════════════════════════ -->
      <section>
        <h2 class="text-xl font-semibold mb-4 flex items-center gap-2">
          <i class="pi pi-calendar text-blue-400" />
          Team Season Coverage
        </h2>
        <div
          class="bg-surface-0 dark:bg-surface-900 p-6 rounded-xl border border-surface-200 dark:border-surface-700 flex flex-col gap-4"
        >
          <h3 class="text-lg font-semibold text-center">How Much of Each Team&#39;s Season You Watched (%)</h3>
          <div class="min-h-[260px]">
            <Chart type="bar" :data="teamSeasonCoverageChart" :options="teamCoverageOptions" class="w-full" />
          </div>
        </div>
      </section>

      <!-- ═══════════════════════════════════════════════════════════════════ -->
      <!-- Section 6: Recent Matches                                         -->
      <!-- ═══════════════════════════════════════════════════════════════════ -->
      <section>
        <h2 class="text-xl font-semibold mb-4 flex items-center gap-2">
          <i class="pi pi-clock text-blue-400" />
          Recent Matches
        </h2>
        <div
          class="bg-surface-0 dark:bg-surface-900 p-6 rounded-xl border border-surface-200 dark:border-surface-700"
        >
          <DataTable :value="recentMatches" class="w-full">
            <Column header="Home">
              <template #body="slotProps">
                <div class="flex items-center gap-2">
                  <img
                    v-if="slotProps.data.details.homeTeamLogoUrl"
                    :src="slotProps.data.details.homeTeamLogoUrl"
                    :alt="slotProps.data.details.homeTeamName"
                    class="h-5 w-5 object-contain rounded-full"
                  />
                  <span
                    :class="winnerClass(slotProps.data.details, 'home')"
                    class="text-sm font-medium"
                  >
                    {{ slotProps.data.details.homeTeamName }}
                  </span>
                </div>
              </template>
            </Column>
            <Column header="Score">
              <template #body="slotProps">
                <span class="font-mono text-sm font-bold tabular-nums">
                  {{ slotProps.data.details.homeScore ?? '-' }}
                  &ndash;
                  {{ slotProps.data.details.awayScore ?? '-' }}
                </span>
              </template>
            </Column>
            <Column header="Away">
              <template #body="slotProps">
                <div class="flex items-center gap-2 justify-end">
                  <span
                    :class="winnerClass(slotProps.data.details, 'away')"
                    class="text-sm font-medium"
                  >
                    {{ slotProps.data.details.awayTeamName }}
                  </span>
                  <img
                    v-if="slotProps.data.details.awayTeamLogoUrl"
                    :src="slotProps.data.details.awayTeamLogoUrl"
                    :alt="slotProps.data.details.awayTeamName"
                    class="h-5 w-5 object-contain rounded-full"
                  />
                </div>
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
            v-if="recentMatches.length === 0"
            class="text-center py-6 text-sm text-gray-500 dark:text-gray-400"
          >
            No watched matches yet. Start tracking to see recent activity here!
          </div>
        </div>
      </section>

      <!-- ═══════════════════════════════════════════════════════════════════ -->
      <!-- Section 7: Back to Overall                                        -->
      <!-- ═══════════════════════════════════════════════════════════════════ -->
      <section>
        <NuxtLink
          to="/statistics"
          class="block group bg-surface-0 dark:bg-surface-900 p-5 rounded-xl border border-surface-200 dark:border-surface-700 hover:border-blue-500/50 transition-colors"
        >
          <div class="flex items-center gap-3">
            <i class="pi pi-arrow-left text-lg text-gray-400 group-hover:text-blue-400 transition-colors" />
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
import type {
  AllStatistics,
  FootballTeamStatistics,
} from '~/services/statistics';
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
  return sumValues(stats.value.football.watchStatusDistribution);
});

const uniqueCompetitions = computed(() => {
  if (!stats.value) return 0;
  return Object.keys(stats.value.football.perCompetition).length;
});

const watchStatusDistribution = computed(() => {
  return stats.value?.football.watchStatusDistribution ?? {};
});

const topMethod = computed(() => {
  if (!stats.value) return null;
  return maxKey(stats.value.football.watchStatusDistribution);
});

const topMethodLabel = computed(() => {
  if (!topMethod.value) return '-';
  return formatEnumToString(topMethod.value);
});

const topMethodPercent = computed(() => {
  if (!topMethod.value || totalWatched.value === 0) return '';
  const count = stats.value!.football.watchStatusDistribution[topMethod.value] ?? 0;
  return `${Math.round((count / totalWatched.value) * 100)}% of matches`;
});

const topTeamName = computed(() => {
  if (!stats.value || stats.value.football.topTeams.length === 0) return '-';
  const t = stats.value.football.topTeams[0];
  return t.teamName.length > 14 ? t.teamName.substring(0, 14) + '…' : t.teamName;
});

const topTeamCount = computed(() => {
  if (!stats.value || stats.value.football.topTeams.length === 0) return '';
  const t = stats.value.football.topTeams[0];
  return `${t.watchedCount} match${t.watchedCount !== 1 ? 'es' : ''}`;
});

// ─── Derived: Favourites ──────────────────────────────────────────────────

const hasFavourites = computed(() => {
  return (
    favouriteStore.footballCompetitions.length > 0 ||
    favouriteStore.footballTeams.length > 0
  );
});

const favouriteCompetitions = computed(() => favouriteStore.footballCompetitions);

const favouriteTeamIds = computed(() => favouriteStore.footballTeams);

const topTeams = computed<FootballTeamStatistics[]>(() => {
  return stats.value?.football.topTeams ?? [];
});

const perCompetition = computed<Record<string, number>>(() => {
  return stats.value?.football.perCompetition ?? {};
});

// ─── Derived: Recent Matches ───────────────────────────────────────────────

const recentMatches = computed(() => {
  return stats.value?.football.recentEvents ?? [];
});

// ─── Chart data ────────────────────────────────────────────────────────────

const statusColors = ['#34d399', '#60a5fa', '#facc15', '#a78bfa'];

const watchStatusChart = computed(() => {
  const dist = stats.value?.football.watchStatusDistribution ?? {};
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
  const comps = stats.value?.football.perCompetition ?? {};
  const entries = Object.entries(comps).sort(([, a], [, b]) => b - a);
  const labels = entries.map(([name]) => name);
  const data = entries.map(([, count]) => count);

  // Build set of favourite competition display names for highlighting
  const favDisplayNames = new Set(
    favouriteStore.footballCompetitions.map(competitionEnumToDisplayName),
  );

  return {
    labels,
    datasets: [
      {
        label: 'Matches',
        data,
        backgroundColor: labels.map((l) =>
          favDisplayNames.has(l) ? '#fbbf24' : '#3b82f6',
        ),
        borderRadius: 4,
      },
    ],
  };
});

const topTeamsChart = computed(() => {
  const teams = stats.value?.football.topTeams ?? [];
  if (teams.length === 0) {
    return { labels: [], datasets: [] };
  }

  // Sort descending by watchedCount
  const sorted = [...teams].sort((a, b) => b.watchedCount - a.watchedCount);
  const labels = sorted.map((t) => t.teamName);
  const data = sorted.map((t) => t.watchedCount);
  const favIds = new Set(favouriteStore.footballTeams);

  return {
    labels,
    datasets: [
      {
        label: 'Watched',
        data,
        backgroundColor: sorted.map((t) =>
          favIds.has(t.teamId) ? '#fbbf24' : '#10b981',
        ),
        borderRadius: 4,
      },
    ],
  };
});

const teamSeasonCoverageChart = computed(() => {
  const coverage = stats.value?.football.teamSeasonCoverage ?? {};
  const teams = Object.keys(coverage).sort();

  // Collect all unique seasons across all teams, sorted
  const allSeasons = new Set<string>();
  for (const seasons of Object.values(coverage)) {
    for (const season of Object.keys(seasons)) {
      allSeasons.add(season);
    }
  }
  const labels = [...allSeasons].sort((a, b) => Number(a) - Number(b));

  const teamColors = [
    '#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6',
    '#ec4899', '#14b8a6', '#f97316', '#6366f1', '#84cc16',
  ];

  const datasets = teams.map((team, i) => ({
    label: team,
    data: labels.map((s) => Math.round(coverage[team][s] ?? 0)),
    backgroundColor: teamColors[i % teamColors.length],
    borderRadius: 4,
  }));

  return { labels, datasets };
});

const teamCoverageOptions = {
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

function winnerClass(
  details: { homeScore?: number | null; awayScore?: number | null },
  side: 'home' | 'away',
): string {
  if (details.homeScore == null || details.awayScore == null) return '';
  const homeWon = details.homeScore > details.awayScore;
  const awayWon = details.awayScore > details.homeScore;
  const draw = details.homeScore === details.awayScore;

  if (draw) return 'text-gray-400';
  if (side === 'home' && homeWon) return 'font-bold text-white';
  if (side === 'away' && awayWon) return 'font-bold text-white';
  return 'text-gray-400';
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

definePageMeta({ title: 'Football Statistics' });

useSeoMeta({
  title: 'Football Statistics',
  description: 'View your football viewing statistics — matches watched, leagues followed, and trends over time.',
  ogTitle: 'Football Statistics — Trakket',
  ogDescription: 'View your football viewing statistics — matches watched, leagues followed, and trends over time.',
  ogImage: '/og-image.png',
  ogUrl: 'https://www.trakket.com/statistics/football',
})
</script>
