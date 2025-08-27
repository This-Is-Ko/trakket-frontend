<template>
  <Card v-if="event">
    <template #title>Match Details</template>
    <template #content>
      <div class="flex justify-between items-center text-lg font-semibold">
        <span>{{ event.homeTeam }}</span>
        <span>{{ event.homeScore ?? "-" }} - {{ event.awayScore ?? "-" }}</span>
        <span>{{ event.awayTeam }}</span>
      </div>
    </template>
  </Card>
</template>

<script setup lang="ts">
import Card from "primevue/card";

const props = defineProps<{
  event?: {
    homeTeam: string;
    awayTeam: string;
    homeScore?: number;
    awayScore?: number;
  };
}>();
</script>
