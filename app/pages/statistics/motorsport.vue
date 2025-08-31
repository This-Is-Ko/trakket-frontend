<template>
  <div class="p-4 max-w-5xl mx-auto">
    <h1 class="text-3xl font-bold text-center mb-6">Motorsport Statistics</h1>

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

      <!-- Events Per Competition Card -->
      <div class="flex justify-center">
        <div
            class="bg-surface-0 dark:bg-surface-900 p-6 rounded-xl border border-surface-200 dark:border-surface-700 flex flex-col gap-4 w-full max-w-md"
        >
          <h2 class="text-xl font-semibold mb-4 text-center">Events per Competition</h2>
          <Chart
              type="bar"
              :data="eventsPerCompetitionChart"
              :options="chartOptions"
              class="w-full"
          />
        </div>
      </div>

      <!-- Recent Events Table -->
      <!-- Recent Events Table -->
      <div
          class="bg-surface-0 dark:bg-surface-900 p-6 rounded-xl border border-surface-200 dark:border-surface-700 flex flex-col gap-4 w-full md:col-span-2"
      >
        <h2 class="text-xl font-semibold mb-4">Recent Events</h2>
        <DataTable :value="recentEvents" class="w-full" :responsiveLayout="'scroll'">

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
          <Column header="Date">
            <template #body="slotProps">
              {{ formattedDate(slotProps.data.details.dateTime) }}
            </template>
          </Column>

          <!-- Winner Column -->
          <Column header="Winner">
            <template #body="slotProps">
              {{ slotProps.data.details.winner ?? '-' }}
            </template>
          </Column>

          <!-- Watch Status Column -->
          <Column header="Watch Status" sortField="details.status">
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
import type { RecentEventMotorsport } from '~/services/statistics';

const loading = ref(true);
const fetchError = ref(false);
const watchStatusChart = ref({});
const eventsPerCompetitionChart = ref({});
const recentEvents = ref<RecentEventMotorsport[]>([]);

const chartOptions = { responsive: true, plugins: { legend: { position: "top" } } };

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

    // Events Per Competition Bar Chart
    eventsPerCompetitionChart.value = {
      labels: Object.keys(data.watchedEventsPerCompetition).map(formatEnumToString),
      datasets: [
        {
          label: "Events",
          data: Object.values(data.watchedEventsPerCompetition),
          backgroundColor: "#3b82f6"
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
