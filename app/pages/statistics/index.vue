<template>
  <div class="max-w-7xl mx-auto px-6 py-10">
    <h1 class="text-3xl font-bold text-center mb-6">Overall Statistics</h1>

    <div v-if="loading" class="flex justify-center py-10">
      <ProgressSpinner />
    </div>
    <div v-else-if="fetchError" class="text-center py-10 text-gray-500">
      <Message severity="error">Unable to load statistics. Please try again later.</Message>
    </div>
    <div v-else class="grid md:grid-cols-2 gap-8">
      <!-- Watch Status Distribution -->
      <div class="flex justify-center">
        <div class="bg-surface-0 dark:bg-surface-900 p-6 rounded-xl border border-surface-200 dark:border-surface-700 flex flex-col gap-4 w-full max-w-md">
          <h2 class="text-xl font-semibold mb-4 text-center">Watch Status Distribution</h2>
          <Chart type="pie" :data="watchStatusChart" :options="chartOptions" class="w-full"/>
        </div>
      </div>

      <!-- Watch Status Table -->
      <div class="flex justify-center">
        <div class="bg-surface-0 dark:bg-surface-900 p-6 rounded-xl border border-surface-200 dark:border-surface-700 flex flex-col gap-4 w-full max-w-md">
          <h2 class="text-xl font-semibold mb-4 text-center">Watch Status</h2>
          <table class="min-w-full text-sm border-collapse">
            <thead>
            <tr class="border-b border-surface-200 dark:border-surface-700">
              <th class="py-2 px-4 text-left">Status</th>
              <th class="py-2 px-4 text-right">Count</th>
            </tr>
            </thead>
            <tbody>
            <tr v-for="(count, status) in overall?.watchStatusDistribution" :key="status" class="border-b border-surface-200 dark:border-surface-700">
              <td class="py-2 px-4">{{ formatEnumToString(status) }}</td>
              <td class="py-2 px-4 text-right">{{ count }}</td>
            </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Sports Mix -->
      <div class="flex justify-center md:col-span-2">
        <div class="bg-surface-0 dark:bg-surface-900 p-6 rounded-xl border border-surface-200 dark:border-surface-700 flex flex-col gap-4 w-full max-w-2xl">
          <h2 class="text-xl font-semibold mb-4 text-center">Sports Mix</h2>
          <Chart type="bar" :data="sportsMixChart" :options="chartOptions" class="w-full"/>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { fetchStatistics, formatEnumToString } from "@/services/statistics";
import { type OverallStatistics } from "@/services/statistics";

const overall = ref<OverallStatistics | null>(null);
const watchStatusChart = ref();
const sportsMixChart = ref();
const loading = ref(true);
const fetchError = ref(false);

const chartOptions = {
  responsive: true,
  plugins: {
    legend: { position: "top" }
  }
};

onMounted(async () => {
  loading.value = true;
  fetchError.value = false;
  try {
    const data = await fetchStatistics();
    overall.value = data.overall;

    if (overall.value) {
      // Watch status pie chart
      watchStatusChart.value = {
        labels: Object.keys(overall.value.watchStatusDistribution).map(formatEnumToString),
        datasets: [
          {
            data: Object.values(overall.value.watchStatusDistribution),
            backgroundColor: ["#42A5F5", "#66BB6A", "#FFA726", "#AB47BC"],
          },
        ],
      };

      // Sports mix bar chart
      sportsMixChart.value = {
        labels: Object.keys(overall.value.sportsMix).map(formatEnumToString),
        datasets: [
          {
            label: "Events Watched",
            data: Object.values(overall.value.sportsMix),
            backgroundColor: "#34d399"
          }
        ]
      };
    }
  } catch (err) {
    fetchError.value = true;
  } finally {
    loading.value = false;
  }
});

definePageMeta({ title: 'Statistics' })
</script>
