<template>
  <div class="hero-cards-container hidden lg:block">
    <div class="cards-inner">
      <div v-if="footballEvents[0]" class="card-slot pos-left-top">
        <CompactFootballCard
          :event="footballEvents[0].details"
          :watch-status="footballEvents[0].status"
          :display-only="true"
        />
      </div>
      <div v-if="motorsportEvents[0]" class="card-slot pos-left-mid-up">
        <CompactMotorsportCard
          :event="motorsportEvents[0].details"
          :watch-status="motorsportEvents[0].status"
          :display-only="true"
        />
      </div>
      <div v-if="footballEvents[1]" class="card-slot pos-left-mid-down">
        <CompactFootballCard
          :event="footballEvents[1].details"
          :watch-status="footballEvents[1].status"
          :display-only="true"
        />
      </div>
      <div v-if="motorsportEvents[1]" class="card-slot pos-left-bot">
        <CompactMotorsportCard
          :event="motorsportEvents[1].details"
          :watch-status="motorsportEvents[1].status"
          :display-only="true"
        />
      </div>
      <div v-if="motorsportEvents[2]" class="card-slot pos-right-top">
        <CompactMotorsportCard
          :event="motorsportEvents[2].details"
          :watch-status="motorsportEvents[2].status"
          :display-only="true"
        />
      </div>
      <div v-if="footballEvents[2]" class="card-slot pos-right-mid-up">
        <CompactFootballCard
          :event="footballEvents[2].details"
          :watch-status="footballEvents[2].status"
          :display-only="true"
        />
      </div>
      <div v-if="motorsportEvents[3]" class="card-slot pos-right-mid-down">
        <CompactMotorsportCard
          :event="motorsportEvents[3].details"
          :watch-status="motorsportEvents[3].status"
          :display-only="true"
        />
      </div>
      <div v-if="footballEvents[3]" class="card-slot pos-right-bot">
        <CompactFootballCard
          :event="footballEvents[3].details"
          :watch-status="footballEvents[3].status"
          :display-only="true"
        />
      </div>
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
/* ====================================================
   Medium screens (1024px–1439px): horizontal scroll
   strip anchored near the bottom of the hero section
   ==================================================== */
.hero-cards-container {
  position: absolute;
  bottom: 10%;
  left: 0;
  right: 0;
  overflow-x: auto;
  pointer-events: auto;
  z-index: 5;
  scrollbar-width: none;
}
.hero-cards-container::-webkit-scrollbar { display: none; }

.cards-inner {
  display: flex;
  gap: 14px;
  padding: 0 max(24px, calc((100vw - 960px) / 2));
}

.card-slot {
  width: 300px;
  flex-shrink: 0;
  opacity: 0.75;
  animation: fadeInVert 0.6s ease forwards;
}

/* ====================================================
   Wide screens (1440px+): 8-card surround layout
   ==================================================== */
@media (min-width: 1440px) {
  .hero-cards-container {
    position: absolute;
    inset: 0;
    overflow: visible;
    pointer-events: none;
  }

  .cards-inner {
    display: block;
    padding: 0;
  }

  .card-slot {
    position: absolute;
    width: 300px;
    flex-shrink: initial;
    pointer-events: auto;
  }

  .pos-left-top       { left: 28%;  top: 10%;  animation: fadeInVert 0.8s 0.1s ease forwards; }
  .pos-left-mid-up    { left: 22%;  top: 31%;  animation: fadeInLeftBulge 0.8s 0.2s ease forwards; }
  .pos-left-mid-down  { left: 22%;  top: 52%;  animation: fadeInLeftBulge 0.8s 0.3s ease forwards; }
  .pos-left-bot       { left: 28%;  top: 73%;  animation: fadeInVert 0.8s 0.4s ease forwards; }
  .pos-right-top      { right: 28%; top: 10%;  animation: fadeInVert 0.8s 0.5s ease forwards; }
  .pos-right-mid-up   { right: 22%; top: 31%;  animation: fadeInRightBulge 0.8s 0.6s ease forwards; }
  .pos-right-mid-down { right: 22%; top: 52%;  animation: fadeInRightBulge 0.8s 0.7s ease forwards; }
  .pos-right-bot      { right: 28%; top: 73%;  animation: fadeInVert 0.8s 0.8s ease forwards; }
}

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
