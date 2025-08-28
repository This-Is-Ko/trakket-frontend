<template>
  <div class="p-4 max-w-5xl mx-auto">
    <h1 class="text-3xl font-bold text-center mb-6">Football Stats</h1>

    <div v-if="loading" class="flex justify-center py-10">
      <ProgressSpinner />
    </div>
    <div v-else-if="fetchError" class="text-center py-10 text-gray-500">
      <Message severity="error">Unable to load statistics. Please try again later.</Message>
    </div>
    <div v-else class="grid md:grid-cols-2 gap-8">

      <!-- Watch Status Distribution Card -->
      <div class="flex justify-center">
        <div
            class="bg-surface-0 dark:bg-surface-900 p-6 rounded-xl border border-surface-200 dark:border-surface-700 flex flex-col gap-4 w-full max-w-md"
        >
          <h2 class="text-xl font-semibold mb-4 text-center">Watch Status Distribution</h2>
          <Chart
              type="pie"
              :data="watchStatusChart"
              :options="chartOptions"
              class="w-full"
          />
        </div>
      </div>

      <!-- Matches Per Competition Card -->
      <div class="flex justify-center">
        <div
            class="bg-surface-0 dark:bg-surface-900 p-6 rounded-xl border border-surface-200 dark:border-surface-700 flex flex-col gap-4 w-full max-w-md"
        >
          <h2 class="text-xl font-semibold mb-4 text-center">Matches per Competition</h2>
          <Chart
              type="bar"
              :data="matchesPerCompetitionChart"
              :options="chartOptions"
              class="w-full"
          />
        </div>
      </div>

      <!-- Recent Matches Table -->
      <div
          class="bg-surface-0 dark:bg-surface-900 p-6 rounded-xl border border-surface-200 dark:border-surface-700 flex flex-col gap-4 w-full md:col-span-2"
      >
        <h2 class="text-xl font-semibold mb-4">Recent Matches</h2>
        <DataTable :value="recentMatches" class="w-full" :responsiveLayout="'scroll'">

          <!-- Title Column -->
          <Column header="Title">
            <template #body="slotProps">
              {{ slotProps.data.details.title }}
            </template>
          </Column>

          <!-- Competition Column -->
          <Column header="Competition">
            <template #body="slotProps">
              {{ slotProps.data.details.competition }}
            </template>
          </Column>

          <!-- Date Column -->
          <Column header="Date" :sortable="true">
            <template #body="slotProps">
              {{ formattedDate(slotProps.data.details.dateTime) }}
            </template>
          </Column>

          <!-- Score Column -->
          <Column header="Score">
            <template #body="slotProps">
              {{ `${slotProps.data.details.homeScore ?? '-'} - ${slotProps.data.details.awayScore ?? '-'}` }}
            </template>
          </Column>

          <!-- Watch Status Column -->
          <Column header="Watch Status" :sortable="true" sortField="details.status">
            <template #body="slotProps">
              {{ formatEnumToString(slotProps.data.details.status) }}
            </template>
          </Column>

        </DataTable>
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
const recentMatches = ref<RecentEventFootball[]>([]);

const chartOptions = { responsive: true, plugins: { legend: { position: "top" } } };

// Format ISO date strings to readable date/time
function formattedDate(datetime: string) {
  if (!datetime) return '-';
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
    const data = res.football;

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

    // Matches Per Competition Bar Chart
    matchesPerCompetitionChart.value = {
      labels: Object.keys(data.perCompetition).map(formatEnumToString),
      datasets: [
        {
          label: "Matches",
          data: Object.values(data.perCompetition),
          backgroundColor: "#3b82f6"
        }
      ]
    };

    // Recent Matches Table
    recentMatches.value = data.recentEvents;
  } catch (err) {
    fetchError.value = true;
  } finally {
    loading.value = false;
  }
}

onMounted(loadStats);
</script>
