<template>
  <div class="hero-cards-container hidden lg:block">
    <!-- Left column: FB → MS → FB → MS, staggered inward -->
    <div v-if="footballEvents[0]" class="card-slot left-top">
      <CompactFootballCard
        :event="footballEvents[0].details"
        :watch-status="footballEvents[0].status"
        :display-only="true"
      />
    </div>
    <div v-if="motorsportEvents[0]" class="card-slot left-mid-up">
      <CompactMotorsportCard
        :event="motorsportEvents[0].details"
        :watch-status="motorsportEvents[0].status"
        :display-only="true"
      />
    </div>
    <div v-if="footballEvents[1]" class="card-slot left-mid-down">
      <CompactFootballCard
        :event="footballEvents[1].details"
        :watch-status="footballEvents[1].status"
        :display-only="true"
      />
    </div>
    <div v-if="motorsportEvents[1]" class="card-slot left-bot">
      <CompactMotorsportCard
        :event="motorsportEvents[1].details"
        :watch-status="motorsportEvents[1].status"
        :display-only="true"
      />
    </div>

    <!-- Right column: MS → FB → MS → FB, staggered inward -->
    <div v-if="motorsportEvents[2]" class="card-slot right-top">
      <CompactMotorsportCard
        :event="motorsportEvents[2].details"
        :watch-status="motorsportEvents[2].status"
        :display-only="true"
      />
    </div>
    <div v-if="footballEvents[2]" class="card-slot right-mid-up">
      <CompactFootballCard
        :event="footballEvents[2].details"
        :watch-status="footballEvents[2].status"
        :display-only="true"
      />
    </div>
    <div v-if="motorsportEvents[3]" class="card-slot right-mid-down">
      <CompactMotorsportCard
        :event="motorsportEvents[3].details"
        :watch-status="motorsportEvents[3].status"
        :display-only="true"
      />
    </div>
    <div v-if="footballEvents[3]" class="card-slot right-bot">
      <CompactFootballCard
        :event="footballEvents[3].details"
        :watch-status="footballEvents[3].status"
        :display-only="true"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import CompactFootballCard from '~/components/event/CompactFootballCard.vue'
import CompactMotorsportCard from '~/components/event/CompactMotorsportCard.vue'
import type { FootballEventWrapper } from '~/types/football/events'
import type { MotorsportEventWrapper } from '~/types/motorsport/events'

defineProps<{
  footballEvents: FootballEventWrapper[]
  motorsportEvents: MotorsportEventWrapper[]
}>()
</script>

<style scoped>
.hero-cards-container {
  position: absolute;
  inset: 0;
  pointer-events: none;
  z-index: 5;
}

.card-slot {
  position: absolute;
  width: 300px;
  opacity: 0.75;
  pointer-events: auto;
}

/* 8-card layout — 4 rows on each side flanking the hero */
.left-top      { left: 24%;  top: 14%;  animation: fadeInVert 0.8s 0.1s ease forwards; }
.left-mid-up   { left: 18%;  top: 36%;  animation: fadeInLeftBulge 0.8s 0.2s ease forwards; }
.left-mid-down { left: 18%;  top: 56%;  animation: fadeInLeftBulge 0.8s 0.3s ease forwards; }
.left-bot      { left: 24%;  top: 76%;  animation: fadeInVert 0.8s 0.4s ease forwards; }
.right-top     { right: 24%; top: 14%;  animation: fadeInVert 0.8s 0.5s ease forwards; }
.right-mid-up  { right: 18%; top: 36%;  animation: fadeInRightBulge 0.8s 0.6s ease forwards; }
.right-mid-down{ right: 18%; top: 56%;  animation: fadeInRightBulge 0.8s 0.7s ease forwards; }
.right-bot     { right: 24%; top: 76%;  animation: fadeInVert 0.8s 0.8s ease forwards; }

/* Keyframes */
@keyframes fadeInVert {
  from { opacity: 0; transform: translateY(12px) scale(0.96); }
  to   { opacity: 0.75; transform: translateY(0) scale(1); }
}
@keyframes fadeInLeftBulge {
  from { opacity: 0; transform: translate(-16px, 12px) scale(0.96); }
  to   { opacity: 0.75; transform: translate(-16px, 0) scale(1); }
}
@keyframes fadeInRightBulge {
  from { opacity: 0; transform: translate(16px, 12px) scale(0.96); }
  to   { opacity: 0.75; transform: translate(16px, 0) scale(1); }
}
</style>
