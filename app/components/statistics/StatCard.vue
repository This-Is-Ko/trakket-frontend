<template>
  <div
    class="bg-surface-0 dark:bg-surface-900 p-6 rounded-xl border border-surface-200 dark:border-surface-700 shadow-sm flex flex-col"
  >
    <div class="flex items-start justify-between mb-3">
      <span class="text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
        {{ title }}
      </span>
      <i v-if="icon" :class="[icon, 'text-lg text-gray-400 dark:text-gray-500']" />
    </div>
    <div class="text-4xl font-bold mb-1">{{ formattedValue }}</div>
    <div v-if="subtitle" class="text-xs text-gray-500 dark:text-gray-400">
      {{ subtitle }}
    </div>
    <div v-if="description" class="text-xs text-gray-400 dark:text-gray-500 mt-1">
      {{ description }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

const props = withDefaults(defineProps<{
  title: string;
  value: string | number;
  subtitle?: string;
  description?: string;
  icon?: string;
}>(), {
  subtitle: undefined,
  description: undefined,
  icon: undefined,
});

const formattedValue = computed(() => {
  if (typeof props.value === 'number') {
    return props.value.toLocaleString();
  }
  return props.value;
});
</script>
