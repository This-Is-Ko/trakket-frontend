<template>
  <div class="p-4 max-w-5xl mx-auto">
    <h1 class="text-3xl font-bold text-center mb-6">Football Stats</h1>

    <div v-if="loading" class="flex justify-center py-10">
      <ProgressSpinner />
    </div>

    <div v-else class="grid gap-6">
      <!-- Pie chart: Watched status distribution -->
      <div class="flex justify-center">
        <div class="bg-surface-0 dark:bg-surface-900 p-6 rounded-xl border border-surface-200 dark:border-surface-700 flex flex-col gap-4 w-full max-w-md">
          <h2 class="text-xl font-semibold mb-4 text-center">Watch Status Distribution</h2>
          <Chart type="pie" :data="watchStatusChartData" :options="chartOptions" class="w-full"/>
        </div>
      </div>

      <!-- Bar chart: Matches per competition -->
      <div class="flex justify-center">
        <div class="bg-surface-0 dark:bg-surface-900 p-6 rounded-xl border border-surface-200 dark:border-surface-700 flex flex-col gap-4 w-full max-w-md">
          <h2 class="text-xl font-semibold mb-4 text-center">Matches per Competition</h2>
          <Chart type="bar" :data="matchesPerCompetitionChartData" :options="chartOptions" class="w-full"/>
        </div>
      </div>

      <!-- Table of recent matches -->
        <div
            class="bg-surface-0 dark:bg-surface-900 p-6 rounded-xl border border-surface-200 dark:border-surface-700 flex flex-col gap-4"
        >
          <h2 class="text-xl font-semibold mb-4">Recent Matches</h2>

          <DataTable :value="recentMatches" class="w-full" :responsiveLayout="'scroll'">
            <Column
                field="details.title"
                header="Title"
                :sortable="true"
            />
            <Column
                field="details.competition"
                header="Competition"
                :sortable="true"
            />
            <Column
                field="details.dateTime"
                header="Date"
                :sortable="true"
                :body="(row) => formattedDate(row.dateTime)"
            />
            <Column
                header="Score"
                :body="(row) => `${row.details.homeScore ?? '-'} - ${row.details.awayScore ?? '-'}`"
            />
            <Column
                field="status"
                header="Watch Status"
                :sortable="true"
                :body="(row) => formatWatchStatus(row.status)"
            />
          </DataTable>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {ref, onMounted, computed} from "vue";
import {fetchFootballEventsWithStatus} from "~/services/footballStatistics";

const loading = ref(true);

const watchStatusChartData = ref<any>({});
const matchesPerCompetitionChartData = ref<any>({});
const recentMatches = ref<any[]>([]);

const chartOptions = {
  responsive: true,
  plugins: {
    legend: {
      position: "top"
    }
  }
};

function formatWatchStatus(status: string) {
  return status
      .toLowerCase()
      .split("_")
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
}

function formattedDate(datetime: string) { return new Date(datetime).toLocaleString(); }

async function loadStats() {
  loading.value = true;
  try {
    const res = await fetchFootballEventsWithStatus();

    // Watch status pie chart
    watchStatusChartData.value = {
      labels: Object.keys(res.watchStatusDistribution),
      datasets: [
        {
          data: Object.values(res.watchStatusDistribution),
          backgroundColor: ["#f87171", "#34d399", "#60a5fa", "#facc15", "#a78bfa"],
        },
      ],
    };

    // Matches per competition bar chart
    matchesPerCompetitionChartData.value = {
      labels: Object.keys(res.matchesPerCompetition),
      datasets: [
        {
          label: "Matches",
          data: Object.values(res.matchesPerCompetition),
          backgroundColor: "#3b82f6",
        },
      ],
    };

    // Recent matches
    recentMatches.value = res.recentMatches;
  } catch (err) {
    console.error("Failed to load stats", err);
  } finally {
    loading.value = false;
  }
}

onMounted(loadStats);
</script>
