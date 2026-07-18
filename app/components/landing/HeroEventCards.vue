<template>
  <div class="hero-cards-container" :class="mode === 'surround' ? 'hidden 2xl:block' : 'hidden lg:block 2xl:hidden'">
    <!-- Surround mode: absolute-positioned cards flanking the hero -->
    <template v-if="mode === 'surround'">
      <div v-if="evt(0)" class="card-slot pos-left-top">
        <CompactFootballCard v-if="evt(0)!.sportType === 'FOOTBALL'" :event="toFootballEvent(evt(0)!)" :watch-status="null" :display-only="true" />
        <CompactMotorsportCard v-else :event="toMotorsportEvent(evt(0)!)" :watch-status="null" :display-only="true" />
      </div>
      <div v-if="evt(1)" class="card-slot pos-left-mid-up">
        <CompactFootballCard v-if="evt(1)!.sportType === 'FOOTBALL'" :event="toFootballEvent(evt(1)!)" :watch-status="null" :display-only="true" />
        <CompactMotorsportCard v-else :event="toMotorsportEvent(evt(1)!)" :watch-status="null" :display-only="true" />
      </div>
      <div v-if="evt(2)" class="card-slot pos-left-mid-down">
        <CompactFootballCard v-if="evt(2)!.sportType === 'FOOTBALL'" :event="toFootballEvent(evt(2)!)" :watch-status="null" :display-only="true" />
        <CompactMotorsportCard v-else :event="toMotorsportEvent(evt(2)!)" :watch-status="null" :display-only="true" />
      </div>
      <div v-if="evt(3)" class="card-slot pos-left-bot">
        <CompactFootballCard v-if="evt(3)!.sportType === 'FOOTBALL'" :event="toFootballEvent(evt(3)!)" :watch-status="null" :display-only="true" />
        <CompactMotorsportCard v-else :event="toMotorsportEvent(evt(3)!)" :watch-status="null" :display-only="true" />
      </div>
      <div v-if="evt(4)" class="card-slot pos-right-top">
        <CompactFootballCard v-if="evt(4)!.sportType === 'FOOTBALL'" :event="toFootballEvent(evt(4)!)" :watch-status="null" :display-only="true" />
        <CompactMotorsportCard v-else :event="toMotorsportEvent(evt(4)!)" :watch-status="null" :display-only="true" />
      </div>
      <div v-if="evt(5)" class="card-slot pos-right-mid-up">
        <CompactFootballCard v-if="evt(5)!.sportType === 'FOOTBALL'" :event="toFootballEvent(evt(5)!)" :watch-status="null" :display-only="true" />
        <CompactMotorsportCard v-else :event="toMotorsportEvent(evt(5)!)" :watch-status="null" :display-only="true" />
      </div>
      <div v-if="evt(6)" class="card-slot pos-right-mid-down">
        <CompactFootballCard v-if="evt(6)!.sportType === 'FOOTBALL'" :event="toFootballEvent(evt(6)!)" :watch-status="null" :display-only="true" />
        <CompactMotorsportCard v-else :event="toMotorsportEvent(evt(6)!)" :watch-status="null" :display-only="true" />
      </div>
      <div v-if="evt(7)" class="card-slot pos-right-bot">
        <CompactFootballCard v-if="evt(7)!.sportType === 'FOOTBALL'" :event="toFootballEvent(evt(7)!)" :watch-status="null" :display-only="true" />
        <CompactMotorsportCard v-else :event="toMotorsportEvent(evt(7)!)" :watch-status="null" :display-only="true" />
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
            <div v-for="event in visibleEvents" :key="event.id" class="card-slot">
              <CompactFootballCard v-if="event.sportType === 'FOOTBALL'" :event="toFootballEvent(event)" :watch-status="null" :display-only="true" />
              <CompactMotorsportCard v-else :event="toMotorsportEvent(event)" :watch-status="null" :display-only="true" />
            </div>
          </div>
          <div class="strip-group" aria-hidden="true">
            <div v-for="event in visibleEvents" :key="`dup-${event.id}`" class="card-slot">
              <CompactFootballCard v-if="event.sportType === 'FOOTBALL'" :event="toFootballEvent(event)" :watch-status="null" :display-only="true" />
              <CompactMotorsportCard v-else :event="toMotorsportEvent(event)" :watch-status="null" :display-only="true" />
            </div>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import CompactFootballCard from '~/components/event/CompactFootballCard.vue'
import CompactMotorsportCard from '~/components/event/CompactMotorsportCard.vue'
import type { LandingEvent } from '~/types/landing'
import type { FootballEventDetails } from '~/types/football/events'
import type { MotorsportEventDetails } from '~/types/motorsport/events'

const props = defineProps<{
  events: LandingEvent[]
  mode: 'surround' | 'strip'
}>()

const paused = ref(false)

const visibleEvents = computed(() => props.events.slice(0, 8))

function evt(index: number): LandingEvent | undefined {
  return props.events[index]
}

function toFootballEvent(e: LandingEvent): FootballEventDetails {
  return {
    id: e.id,
    dateTime: e.dateTime,
    competition: {
      name: e.competition,
      displayName: e.competition,
      gender: null,
      logoUrl: e.competitionLogoUrl,
    },
    round: e.subtitle,
    location: e.location,
    status: e.status as FootballEventDetails['status'],
    title: e.title,
    subtitle: e.subtitle,
    homeTeamId: '',
    homeTeamName: e.homeTeamName ?? '',
    homeTeamLogoUrl: e.homeTeamLogoUrl,
    homeScore: e.homeScore,
    awayTeamId: '',
    awayTeamName: e.awayTeamName ?? '',
    awayTeamLogoUrl: e.awayTeamLogoUrl,
    awayScore: e.awayScore,
  } satisfies FootballEventDetails
}

function toMotorsportEvent(e: LandingEvent): MotorsportEventDetails {
  return {
    id: e.id,
    dateTime: e.dateTime,
    competition: {
      name: e.competition,
      displayName: e.competition,
      logoUrl: e.competitionLogoUrl,
    },
    round: e.subtitle,
    location: e.location,
    status: e.status as MotorsportEventDetails['status'],
    title: e.title,
    subtitle: e.subtitle,
    raceName: e.raceName ?? e.title,
    circuitName: e.circuitName ?? '',
    winner: (e.winner as unknown as number) ?? null,
    flagUrl: e.flagUrl,
  } satisfies MotorsportEventDetails
}
</script>

<style scoped>
/* ====================================================
   Surround mode — absolute-positioned cards
   ==================================================== */
.card-slot {
  width: 300px;
  opacity: 0.75;
}

/* surround mode positions — tuned for 1080p (~1920px) */
.pos-left-top       { position: absolute; left: 24%;  top: 10%;  animation: fadeInVert 0.8s 0.1s ease forwards; }
.pos-left-mid-up    { position: absolute; left: 18%;  top: 31%;  animation: fadeInVert 0.8s 0.2s ease forwards; }
.pos-left-mid-down  { position: absolute; left: 18%;  top: 52%;  animation: fadeInVert 0.8s 0.3s ease forwards; }
.pos-left-bot       { position: absolute; left: 24%;  top: 73%;  animation: fadeInVert 0.8s 0.4s ease forwards; }
.pos-right-top      { position: absolute; right: 24%; top: 10%;  animation: fadeInVert 0.8s 0.5s ease forwards; }
.pos-right-mid-up   { position: absolute; right: 18%; top: 31%;  animation: fadeInVert 0.8s 0.6s ease forwards; }
.pos-right-mid-down { position: absolute; right: 18%; top: 52%;  animation: fadeInVert 0.8s 0.7s ease forwards; }
.pos-right-bot      { position: absolute; right: 24%; top: 73%;  animation: fadeInVert 0.8s 0.8s ease forwards; }

/* 1440p+ (~2100px+) — bring cards closer to hero */
@media (min-width: 2100px) {
  .pos-left-top       { left: 28%; }
  .pos-left-mid-up    { left: 22%; }
  .pos-left-mid-down  { left: 22%; }
  .pos-left-bot       { left: 28%; }
  .pos-right-top      { right: 28%; }
  .pos-right-mid-up   { right: 22%; }
  .pos-right-mid-down { right: 22%; }
  .pos-right-bot      { right: 28%; }
}

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
  align-items: stretch;
}

.strip-group .card-slot {
  width: 300px;
  flex-shrink: 0;
  display: flex;
}

/* Force card children to always fill the slot width */
.card-slot :deep(> *) {
  width: 100%;
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

</style>
