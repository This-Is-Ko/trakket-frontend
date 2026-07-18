<template>
  <div class="grid md:grid-cols-2 gap-6">
    <!-- Favourite competitions -->
    <div
      class="bg-surface-0 dark:bg-surface-900 p-6 rounded-xl border border-surface-200 dark:border-surface-700 flex flex-col gap-4"
    >
      <h3 class="text-lg font-semibold flex items-center gap-2">
        <i class="pi pi-trophy text-yellow-500" />
        Favourite Competitions
      </h3>

      <div v-if="favCompetitionsWithCounts.length === 0" class="text-sm text-gray-500 dark:text-gray-400 py-4 text-center">
        <p>No watched events in your favourited competitions yet.</p>
        <p class="mt-1">Start watching events to see stats here!</p>
      </div>

      <div v-else class="space-y-3 flex-1">
        <div
          v-for="item in favCompetitionsWithCounts"
          :key="item.name"
          class="flex items-center justify-between"
        >
          <span class="text-sm font-medium truncate mr-2">{{ item.displayName }}</span>
          <span class="text-sm font-semibold text-primary-400 whitespace-nowrap">
            {{ item.count }} watched
          </span>
        </div>
      </div>
    </div>

    <!-- Favourite teams -->
    <div
      class="bg-surface-0 dark:bg-surface-900 p-6 rounded-xl border border-surface-200 dark:border-surface-700 flex flex-col gap-4"
    >
      <h3 class="text-lg font-semibold flex items-center gap-2">
        <i class="pi pi-users text-blue-500" />
        Favourite Teams
      </h3>

      <div v-if="favTeams.length === 0" class="text-sm text-gray-500 dark:text-gray-400 py-4 text-center">
        <p>{{ emptyTeamLabel }}</p>
        <p class="mt-1">{{ emptyTeamHint }}</p>
      </div>

      <div v-else class="space-y-3 flex-1">
        <div
          v-for="team in favTeams"
          :key="team.teamId"
          class="flex items-center justify-between"
        >
          <span class="text-sm font-medium truncate mr-2">{{ team.teamName }}</span>
          <span class="text-xs text-gray-500 dark:text-gray-400 whitespace-nowrap">
            {{ team.watchedCount }} matches &middot; {{ Math.round(team.watchedPercent) }}%
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { competitionEnumToDisplayName } from '~/services/statistics';
import type { FootballTeamStatistics } from '~/services/statistics';

interface CompetitionCount {
  name: string;
  displayName: string;
  count: number;
}

const props = withDefaults(defineProps<{
  favouriteCompetitions: string[];
  favouriteTeamIds: number[];
  perCompetitionData: Record<string, number>;
  topTeams: FootballTeamStatistics[];
  sport?: 'football' | 'motorsport';
}>(), {
  sport: 'football',
});

/**
 * Which favourited competitions actually appear in the watched data
 * (matched by converting the enum name to the display name used in perCompetitionData).
 */
const favCompetitionsWithCounts = computed<CompetitionCount[]>(() => {
  return props.favouriteCompetitions
    .map((enumName) => {
      const displayName = competitionEnumToDisplayName(enumName);
      const count = props.perCompetitionData[displayName] ?? 0;
      return { name: enumName, displayName, count };
    })
    .filter((item) => item.count > 0)
    .sort((a, b) => b.count - a.count);
});

/**
 * Which favourited teams appear in the top teams list.
 */
const favTeams = computed<FootballTeamStatistics[]>(() => {
  const ids = new Set(props.favouriteTeamIds);
  return props.topTeams
    .filter((t) => ids.has(t.teamId))
    .sort((a, b) => b.watchedCount - a.watchedCount);
});

const emptyTeamLabel = computed(() => {
  return props.sport === 'motorsport'
    ? 'No favourite constructors added yet.'
    : 'No favourite teams added yet.';
});

const emptyTeamHint = computed(() => {
  return props.sport === 'motorsport'
    ? 'Favourite your constructors to see their stats here!'
    : 'Favourite your teams to see their stats here!';
});
</script>
