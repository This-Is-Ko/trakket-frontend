<template>
  <div class="px-2 sm:px-4 py-4 overflow-x-hidden">
    <h1 class="text-3xl font-bold text-center mb-6">Motorsport Statistics</h1>

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
              v-for="(count, status) in motorsportWatchStatusDistribution"
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

      <!-- Events Per Competition -->
      <div class="bg-surface-0 dark:bg-surface-900 p-6 rounded-xl border border-surface-200
              dark:border-surface-700 flex flex-col gap-4 w-full h-[420px] overflow-hidden min-w-0">
        <h2 class="text-xl font-semibold text-center">Events per Competition</h2>
        <div class="flex-1 min-h-0">
          <Chart type="bar" :data="eventsPerCompetitionChart" :options="barChartOptions" class="w-full h-full"/>
        </div>
      </div>

      <!-- Season Coverage -->
      <div class="bg-surface-0 dark:bg-surface-900 p-6 rounded-xl border border-surface-200
              dark:border-surface-700 flex flex-col gap-4 w-full h-[420px] overflow-hidden min-w-0">
        <h2 class="text-xl font-semibold text-center">Season Coverage (%)</h2>
        <div class="flex-1 min-h-0">
          <Chart type="bar" :data="seasonCoverageChart" :options="barChartOptions" class="w-full h-full"/>
        </div>
      </div>

      <!-- Recent Events Table -->
      <div class="md:col-span-3 bg-surface-0 dark:bg-surface-900 p-6 rounded-xl border border-surface-200
              dark:border-surface-700 flex flex-col gap-4 w-full min-w-0">
        <h2 class="text-xl font-semibold text-center">Recent Events</h2>
        <div class="w-full overflow-x-auto">
          <DataTable :value="recentEvents" class="w-full" :responsiveLayout="'scroll'">
          <Column>
            <template #body="slotProps">
              <img v-if="slotProps.data.details.flagUrl" :src="slotProps.data.details.flagUrl" alt="flag" class="h-6 w-auto" />
            </template>
          </Column>
          <Column header="Race">
            <template #body="slotProps">
              {{ slotProps.data.details.raceName ?? slotProps.data.details.title }}
            </template>
          </Column>
          <Column header="Circuit">
            <template #body="slotProps">
              {{ slotProps.data.details.circuitName ?? '-' }}
            </template>
          </Column>
          <Column header="Competition">
            <template #body="slotProps">
              {{ slotProps.data.details.competition.displayName }}
            </template>
          </Column>
          <Column header="Date">
            <template #body="slotProps">
              {{ formattedDate(slotProps.data.details.dateTime) }}
            </template>
          </Column>
          <Column header="Winner">
            <template #body="slotProps">
              {{ slotProps.data.details.winner ?? '-' }}
            </template>
          </Column>
          <Column header="Watch Status">
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
import type { RecentEventMotorsport } from '~/services/statistics';

const loading = ref(true);
const fetchError = ref(false);
const watchStatusChart = ref({});
const eventsPerCompetitionChart = ref({});
const seasonCoverageChart = ref({});
const recentEvents = ref<RecentEventMotorsport[]>([]);
const motorsportWatchStatusDistribution = ref<Record<string, number>>({});

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

// Format ISO date strings to readable date/time
function formattedDate(datetime: string) {
  return new Date(datetime).toLocaleString('en-AU', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}

async function loadStats() {
  loading.value = true;
  fetchError.value = false;
  try {
    const res = await fetchStatistics();
    const data = res.motorsport;

    // Watch Status Pie Chart
    watchStatusChart.value = {
      labels: Object.keys(data.watchStatusDistribution).map(formatEnumToString),
      datasets: [
        {
          data: Object.values(data.watchStatusDistribution),
          backgroundColor: ["#f87171","#34d399","#60a5fa","#facc15","#a78bfa"]
        }
      ]
    };
    motorsportWatchStatusDistribution.value = data.watchStatusDistribution;

    // Events Per Competition Bar Chart
    eventsPerCompetitionChart.value = {
      labels: Object.keys(data.watchedEventsPerCompetition),
      datasets: [
        {
          label: "Events",
          data: Object.values(data.watchedEventsPerCompetition),
          backgroundColor: "#3b82f6"
        }
      ]
    };

    // Season Coverage Chart
    seasonCoverageChart.value = {
      labels: Object.keys(data.motorsportSeasonCoverage),
      datasets: [
        {
          label: "Coverage (%)",
          data: Object.values(data.motorsportSeasonCoverage),
          backgroundColor: "#10b981"
        }
      ]
    };

    // Recent Events Table
    recentEvents.value = data.recentEvents;
  } catch (err) {
    fetchError.value = true;
  } finally {
    loading.value = false;
  }
}

onMounted(loadStats);

definePageMeta({
  title: 'Motorsport Statistics'
})
</script>
