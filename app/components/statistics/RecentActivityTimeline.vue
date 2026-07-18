<template>
  <div
    class="bg-surface-0 dark:bg-surface-900 p-6 rounded-xl border border-surface-200 dark:border-surface-700"
  >
    <DataTable :value="events" class="w-full">
      <Column header="Sport">
        <template #body="slotProps">
          <span
            class="inline-flex items-center justify-center w-8 h-8 rounded-full text-sm"
            :class="slotProps.data.sport === 'football' ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400' : 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400'"
          >
            {{ slotProps.data.sport === 'football' ? '⚽' : '🏎️' }}
          </span>
        </template>
      </Column>
      <Column header="Event">
        <template #body="slotProps">
          <span class="font-medium">{{ slotProps.data.title }}</span>
        </template>
      </Column>
      <Column header="Competition">
        <template #body="slotProps">
          <span class="text-sm text-gray-500 dark:text-gray-400">
            {{ slotProps.data.competitionName }}
          </span>
        </template>
      </Column>
      <Column header="Date" :sortable="true" sortField="dateTime">
        <template #body="slotProps">
          <span class="text-sm">{{ formattedDate(slotProps.data.dateTime) }}</span>
        </template>
      </Column>
      <Column header="Watched">
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
      v-if="events.length === 0"
      class="text-center py-6 text-sm text-gray-500 dark:text-gray-400"
    >
      No watched events yet. Start tracking your viewing to see activity here!
    </div>
  </div>
</template>

<script setup lang="ts">
import { formatEnumToString } from '~/services/statistics';
import type { CombinedRecentEvent } from '~/services/statistics';

defineProps<{
  events: CombinedRecentEvent[];
}>();

function formattedDate(datetime: string) {
  if (!datetime) return '-';
  const d = new Date(datetime);
  const now = new Date();
  const diffMs = now.getTime() - d.getTime();
  const diffDays = Math.floor(diffMs / 86_400_000);

  if (diffDays === 0) {
    return 'Today';
  } else if (diffDays === 1) {
    return 'Yesterday';
  } else if (diffDays < 7) {
    return `${diffDays} days ago`;
  }

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
</script>
