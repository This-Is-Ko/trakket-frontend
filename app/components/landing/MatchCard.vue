<template>
  <div
    class="match-card group relative w-full rounded-2xl overflow-hidden cursor-default transition-all duration-500 hover:-translate-y-1 hover:shadow-2xl hover:shadow-indigo-500/10"
    :style="{ background: cardGradient }"
  >
    <!-- Subtle top accent line -->
    <div class="absolute top-0 left-0 right-0 h-px bg-white/10"></div>

    <!-- Card Content -->
    <div class="relative z-10 p-4 flex flex-col items-center gap-3 h-full">
      <!-- Competition -->
      <div class="flex items-center gap-1.5 w-full">
        <div
          class="w-5 h-5 rounded flex items-center justify-center flex-shrink-0"
          :style="{ background: competition.color }"
        >
          <span class="text-[9px] font-bold text-white leading-none">{{ competition.initials }}</span>
        </div>
        <span class="text-[10px] font-medium text-gray-400 uppercase tracking-wider truncate">
          {{ competition.name }}
        </span>
      </div>

      <!-- Teams & Score -->
      <div class="flex items-center justify-between w-full gap-2 flex-1">
        <!-- Home Team -->
        <div class="flex flex-col items-center gap-2 flex-1 min-w-0">
          <div
            class="w-12 h-12 rounded-full flex items-center justify-center shadow-lg transition-transform duration-300 group-hover:scale-110"
            :style="{ background: homeTeam.color }"
          >
            <span class="text-sm font-bold text-white">{{ homeTeam.initials }}</span>
          </div>
          <span class="text-[11px] font-medium text-gray-300 text-center leading-tight truncate w-full">
            {{ homeTeam.name }}
          </span>
        </div>

        <!-- Score -->
        <div class="flex flex-col items-center gap-0.5 flex-shrink-0 px-1">
          <span class="text-2xl font-extrabold text-white tracking-tight tabular-nums leading-none">
            {{ homeScore }}
          </span>
          <span class="text-[10px] text-gray-500 font-medium leading-none">-</span>
          <span class="text-2xl font-extrabold text-white tracking-tight tabular-nums leading-none">
            {{ awayScore }}
          </span>
        </div>

        <!-- Away Team -->
        <div class="flex flex-col items-center gap-2 flex-1 min-w-0">
          <div
            class="w-12 h-12 rounded-full flex items-center justify-center shadow-lg transition-transform duration-300 group-hover:scale-110"
            :style="{ background: awayTeam.color }"
          >
            <span class="text-sm font-bold text-white">{{ awayTeam.initials }}</span>
          </div>
          <span class="text-[11px] font-medium text-gray-300 text-center leading-tight truncate w-full">
            {{ awayTeam.name }}
          </span>
        </div>
      </div>

      <!-- Status & Date -->
      <div class="flex items-center justify-between w-full mt-auto pt-2 border-t border-white/5">
        <div class="flex items-center gap-1.5">
          <span class="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
          <span class="text-[10px] font-medium text-emerald-400 uppercase tracking-wider">Finished</span>
        </div>
        <span class="text-[10px] text-gray-500">{{ date }}</span>
      </div>
    </div>

    <!-- Hover glow -->
    <div
      class="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
      :style="{
        background: `radial-gradient(400px circle at center, ${competition.color}12, transparent 50%)`
      }"
    ></div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface TeamInfo {
  name: string
  initials: string
  color: string
}

interface CompetitionInfo {
  name: string
  initials: string
  color: string
}

const props = defineProps<{
  competition: CompetitionInfo
  homeTeam: TeamInfo
  awayTeam: TeamInfo
  homeScore: number
  awayScore: number
  date: string
}>()

const cardGradient = computed(() => {
  const c = props.competition.color
  return `linear-gradient(180deg, ${c}08 0%, ${c}03 30%, #0d0d1a 100%)`
})
</script>

<style scoped>
.match-card {
  backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.06);
  min-height: 220px;
}
</style>
