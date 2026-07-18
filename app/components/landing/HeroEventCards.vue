<template>
  <div class="hero-cards-container" :class="mode === 'surround' ? 'hidden 2xl:block' : 'hidden lg:block 2xl:hidden'">
    <!-- Surround mode: absolute-positioned cards flanking the hero -->
    <template v-if="mode === 'surround'">
      <div v-if="footballEvents[0]" class="card-slot pos-left-top">
        <CompactFootballCard :event="footballEvents[0].details" :watch-status="footballEvents[0].status" :display-only="true" />
      </div>
      <div v-if="motorsportEvents[0]" class="card-slot pos-left-mid-up">
        <CompactMotorsportCard :event="motorsportEvents[0].details" :watch-status="motorsportEvents[0].status" :display-only="true" />
      </div>
      <div v-if="footballEvents[1]" class="card-slot pos-left-mid-down">
        <CompactFootballCard :event="footballEvents[1].details" :watch-status="footballEvents[1].status" :display-only="true" />
      </div>
      <div v-if="motorsportEvents[1]" class="card-slot pos-left-bot">
        <CompactMotorsportCard :event="motorsportEvents[1].details" :watch-status="motorsportEvents[1].status" :display-only="true" />
      </div>
      <div v-if="motorsportEvents[2]" class="card-slot pos-right-top">
        <CompactMotorsportCard :event="motorsportEvents[2].details" :watch-status="motorsportEvents[2].status" :display-only="true" />
      </div>
      <div v-if="footballEvents[2]" class="card-slot pos-right-mid-up">
        <CompactFootballCard :event="footballEvents[2].details" :watch-status="motorsportEvents[2].status" :display-only="true" />
      </div>
      <div v-if="motorsportEvents[3]" class="card-slot pos-right-mid-down">
        <CompactMotorsportCard :event="motorsportEvents[3].details" :watch-status="motorsportEvents[3].status" :display-only="true" />
      </div>
      <div v-if="footballEvents[3]" class="card-slot pos-right-bot">
        <CompactFootballCard :event="footballEvents[3].details" :watch-status="footballEvents[3].status" :display-only="true" />
      </div>
    </template>

    <!-- Strip mode: CSS-powered auto-scrolling marquee -->
    <template v-else>
      <div
        class="strip-track"
        @mouseenter="paused = true"
        @mouseleave="paused = false"
      >
        <div class="strip-marquee" :class="{ 'is-paused': paused }">
          <div class="strip-group">
            <div v-if="footballEvents[0]" class="card-slot">
              <CompactFootballCard :event="footballEvents[0].details" :watch-status="footballEvents[0].status" :display-only="true" />
            </div>
            <div v-if="motorsportEvents[0]" class="card-slot">
              <CompactMotorsportCard :event="motorsportEvents[0].details" :watch-status="motorsportEvents[0].status" :display-only="true" />
            </div>
            <div v-if="footballEvents[1]" class="card-slot">
              <CompactFootballCard :event="footballEvents[1].details" :watch-status="footballEvents[1].status" :display-only="true" />
            </div>
            <div v-if="motorsportEvents[1]" class="card-slot">
              <CompactMotorsportCard :event="motorsportEvents[1].details" :watch-status="motorsportEvents[1].status" :display-only="true" />
            </div>
            <div v-if="motorsportEvents[2]" class="card-slot">
              <CompactMotorsportCard :event="motorsportEvents[2].details" :watch-status="motorsportEvents[2].status" :display-only="true" />
            </div>
            <div v-if="footballEvents[2]" class="card-slot">
              <CompactFootballCard :event="footballEvents[2].details" :watch-status="footballEvents[2].status" :display-only="true" />
            </div>
            <div v-if="motorsportEvents[3]" class="card-slot">
              <CompactMotorsportCard :event="motorsportEvents[3].details" :watch-status="motorsportEvents[3].status" :display-only="true" />
            </div>
            <div v-if="footballEvents[3]" class="card-slot">
              <CompactFootballCard :event="footballEvents[3].details" :watch-status="footballEvents[3].status" :display-only="true" />
            </div>
          </div>
          <div class="strip-group" aria-hidden="true">
            <div v-if="footballEvents[0]" class="card-slot">
              <CompactFootballCard :event="footballEvents[0].details" :watch-status="footballEvents[0].status" :display-only="true" />
            </div>
            <div v-if="motorsportEvents[0]" class="card-slot">
              <CompactMotorsportCard :event="motorsportEvents[0].details" :watch-status="motorsportEvents[0].status" :display-only="true" />
            </div>
            <div v-if="footballEvents[1]" class="card-slot">
              <CompactFootballCard :event="footballEvents[1].details" :watch-status="footballEvents[1].status" :display-only="true" />
            </div>
            <div v-if="motorsportEvents[1]" class="card-slot">
              <CompactMotorsportCard :event="motorsportEvents[1].details" :watch-status="motorsportEvents[1].status" :display-only="true" />
            </div>
            <div v-if="motorsportEvents[2]" class="card-slot">
              <CompactMotorsportCard :event="motorsportEvents[2].details" :watch-status="motorsportEvents[2].status" :display-only="true" />
            </div>
            <div v-if="footballEvents[2]" class="card-slot">
              <CompactFootballCard :event="footballEvents[2].details" :watch-status="motorsportEvents[2].status" :display-only="true" />
            </div>
            <div v-if="motorsportEvents[3]" class="card-slot">
              <CompactMotorsportCard :event="motorsportEvents[3].details" :watch-status="motorsportEvents[3].status" :display-only="true" />
            </div>
            <div v-if="footballEvents[3]" class="card-slot">
              <CompactFootballCard :event="footballEvents[3].details" :watch-status="footballEvents[3].status" :display-only="true" />
            </div>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import CompactFootballCard from '~/components/event/CompactFootballCard.vue'
import CompactMotorsportCard from '~/components/event/CompactMotorsportCard.vue'
import type { FootballEventWrapper } from '~/types/football/events'
import type { MotorsportEventWrapper } from '~/types/motorsport/events'

defineProps<{
  footballEvents: FootballEventWrapper[]
  motorsportEvents: MotorsportEventWrapper[]
  mode: 'surround' | 'strip'
}>()

const paused = ref(false)
</script>

<style scoped>
/* ====================================================
   Surround mode — absolute-positioned cards
   ==================================================== */
.card-slot {
  opacity: 0.75;
}

/* surround mode positions */
.pos-left-top       { position: absolute; left: 28%;  top: 10%;  animation: fadeInVert 0.8s 0.1s ease forwards; }
.pos-left-mid-up    { position: absolute; left: 22%;  top: 31%;  animation: fadeInLeftBulge 0.8s 0.2s ease forwards; }
.pos-left-mid-down  { position: absolute; left: 22%;  top: 52%;  animation: fadeInLeftBulge 0.8s 0.3s ease forwards; }
.pos-left-bot       { position: absolute; left: 28%;  top: 73%;  animation: fadeInVert 0.8s 0.4s ease forwards; }
.pos-right-top      { position: absolute; right: 28%; top: 10%;  animation: fadeInVert 0.8s 0.5s ease forwards; }
.pos-right-mid-up   { position: absolute; right: 22%; top: 31%;  animation: fadeInRightBulge 0.8s 0.6s ease forwards; }
.pos-right-mid-down { position: absolute; right: 22%; top: 52%;  animation: fadeInRightBulge 0.8s 0.7s ease forwards; }
.pos-right-bot      { position: absolute; right: 28%; top: 73%;  animation: fadeInVert 0.8s 0.8s ease forwards; }

/* ====================================================
   Strip mode — CSS-powered auto-scrolling marquee
   ==================================================== */
.strip-track {
  overflow: hidden;
}

.strip-marquee {
  display: flex;
  width: max-content;
  animation: marquee 50s linear infinite;
}

.strip-marquee.is-paused {
  animation-play-state: paused;
}

.strip-group {
  display: flex;
  gap: 14px;
  flex-shrink: 0;
  padding-right: 14px;
}

.strip-group .card-slot {
  width: 300px;
  flex-shrink: 0;
}

@keyframes marquee {
  0%   { transform: translateX(0); }
  100% { transform: translateX(-50%); }
}

/* ====================================================
   Shared keyframes
   ==================================================== */
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
