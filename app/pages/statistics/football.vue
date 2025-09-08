<template>
  <div class="px-2 sm:px-4 py-4 overflow-x-hidden">
    <h1 class="text-3xl font-bold text-center mb-6">Football Stats</h1>

    <div v-if="loading" class="flex justify-center py-10">
      <ProgressSpinner />
    </div>
    <div v-else-if="fetchError" class="text-center py-10 text-gray-500">
      <Message severity="error">Unable to load statistics. Please try again later.</Message>
    </div>
    <div v-else class="grid md:grid-cols-3 gap-8 min-w-0">

      <!-- Watch Status Cards -->
      <div class="md:col-span-3 min-w-0">
        <div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div
              v-for="(count, status) in watchStatusDistribution"
              :key="status"
              class="bg-surface-0 dark:bg-surface-900 p-6 rounded-xl border border-surface-200
               dark:border-surface-700 flex flex-col items-center justify-center shadow-sm"
          >
            <div class="text-3xl font-bold">{{ count }}</div>
            <div class="text-sm text-gray-600 dark:text-gray-300">
              {{ formatEnumToString(status) }}
            </div>
          </div>
        </div>
      </div>

      <!-- Watch Status Distribution -->
      <div class="bg-surface-0 dark:bg-surface-900 p-6 rounded-xl border border-surface-200
              dark:border-surface-700 flex flex-col gap-4 w-full h-[420px] overflow-hidden min-w-0">
        <h2 class="text-xl font-semibold text-center">Watch Status Distribution</h2>
        <div class="flex-1 min-h-0">
          <Chart type="pie" :data="watchStatusChart" :options="pieChartOptions" class="w-full h-full"/>
        </div>
      </div>

      <!-- Matches Per Competition -->
      <div class="bg-surface-0 dark:bg-surface-900 p-6 rounded-xl border border-surface-200
              dark:border-surface-700 flex flex-col gap-4 w-full h-[420px] overflow-hidden min-w-0">
        <h2 class="text-xl font-semibold text-center">Matches per Competition</h2>
        <div class="flex-1 min-h-0">
          <Chart type="bar" :data="matchesPerCompetitionChart" :options="barChartOptions" class="w-full h-full"/>
        </div>
      </div>

      <!-- Top Teams Watched -->
      <div class="bg-surface-0 dark:bg-surface-900 p-6 rounded-xl border border-surface-200
              dark:border-surface-700 flex flex-col gap-4 w-full h-[420px] overflow-hidden min-w-0">
        <h2 class="text-xl font-semibold text-center">Top Teams Watched</h2>
        <div class="flex-1 min-h-0">
          <Chart type="bar" :data="topTeamsChart" :options="barChartOptions" class="w-full h-full"/>
        </div>
      </div>

      <!-- Recent Matches Table -->
      <div class="md:col-span-3 bg-surface-0 dark:bg-surface-900 p-6 rounded-xl border border-surface-200
              dark:border-surface-700 flex flex-col gap-4 w-full min-w-0">
        <h2 class="text-xl font-semibold text-center">Recent Matches</h2>
        <div class="w-full overflow-x-auto">
          <DataTable :value="recentMatches" class="w-full" :responsiveLayout="'scroll'">
          <Column header="Title">
            <template #body="slotProps">
              {{ slotProps.data.details.title }}
            </template>
          </Column>
          <Column header="Competition">
            <template #body="slotProps">
              {{ slotProps.data.details.competition }}
            </template>
          </Column>
          <Column header="Date" :sortable="true">
            <template #body="slotProps">
              {{ formattedDate(slotProps.data.details.dateTime) }}
            </template>
          </Column>
          <Column header="Score">
            <template #body="slotProps">
              {{ `${slotProps.data.details.homeScore ?? '-'} - ${slotProps.data.details.awayScore ?? '-'}` }}
            </template>
          </Column>
          <Column header="Watch Status" :sortable="true" sortField="details.status">
            <template #body="slotProps">
              {{ formatEnumToString(slotProps.data.status) }}
            </template>
          </Column>
          </DataTable>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { fetchStatistics, formatEnumToString } from "~/services/statistics";
import ProgressSpinner from "primevue/progressspinner";
import type { RecentEventFootball } from '~/services/statistics';

const loading = ref(true);
const fetchError = ref(false);
const watchStatusChart = ref({});
const matchesPerCompetitionChart = ref({});
const topTeamsChart = ref({});
const recentMatches = ref<RecentEventFootball[]>([]);
const watchStatusDistribution = ref<Record<string, number>>({});

const pieChartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: { legend: { position: "top" } },
  scales: {
    x: { display: false, grid: { display: false } },
    y: { display: false, grid: { display: false } }
  }
};

const barChartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: { legend: { position: "top" } }
};

function formattedDate(datetime: string) {
  if (!datetime) return '-';
  return new Date(datetime).toLocaleString('en-AU', {
    year: 'numeric', month: 'short', day: 'numeric',
    hour: '2-digit', minute: '2-digit'
  });
}

async function loadStats() {
  loading.value = true;
  fetchError.value = false;
  try {
    const res = await fetchStatistics();
    const data = res.football;

    // Watch Status Pie
    watchStatusChart.value = {
      labels: Object.keys(data.watchStatusDistribution).map(formatEnumToString),
      datasets: [{ data: Object.values(data.watchStatusDistribution), backgroundColor: ["#f87171","#34d399","#60a5fa","#facc15","#a78bfa"] }]
    };

    watchStatusDistribution.value = data.watchStatusDistribution;

    // Matches Per Competition
    matchesPerCompetitionChart.value = {
      labels: Object.keys(data.perCompetition).map(formatEnumToString),
      datasets: [{ label: "Matches", data: Object.values(data.perCompetition), backgroundColor: "#3b82f6" }]
    };

    // Top Teams
    topTeamsChart.value = {
      labels: data.topTeams.map(t => t.teamName),
      datasets: [{ label: "Watched", data: data.topTeams.map(t => t.watchedCount), backgroundColor: "#10b981" }]
    };

    // Recent Matches
    recentMatches.value = data.recentEvents;
  } catch (err) {
    fetchError.value = true;
  } finally {
    loading.value = false;
  }
}

onMounted(loadStats);

definePageMeta({ title: 'Football Statistics' })
</script>
