<template>
  <div class="px-2 sm:px-4 py-4 max-w-6xl mx-auto">
    <h1 class="text-3xl font-extrabold tracking-tight text-center mb-2 text-white">
      Admin Panel
    </h1>
    <p class="text-center text-gray-500 mb-8">Event sync &amp; system statistics</p>

    <!-- ═══ Stats Section ═══ -->
    <section class="mb-10">
      <h2 class="text-xl font-semibold text-white mb-4 flex items-center gap-2">
        <i class="pi pi-chart-bar"></i> Overview
        <Button
          icon="pi pi-refresh"
          text
          size="small"
          :loading="statsLoading"
          @click="loadStats"
          class="!text-gray-400 hover:!text-white"
        />
      </h2>

      <div v-if="statsError" class="mb-4">
        <Message severity="error" :closable="false">{{ statsError }}</Message>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <!-- Users -->
        <div class="bg-gray-900/60 border border-white/10 rounded-xl p-5">
          <div class="text-sm text-gray-400 mb-1">Total Users</div>
          <div class="text-3xl font-bold text-white">
            <template v-if="statsLoading"><ProgressSpinner style="width:24px;height:24px" /></template>
            <template v-else>{{ stats?.totalUsers ?? '—' }}</template>
          </div>
        </div>

        <!-- Football Events -->
        <div class="bg-gray-900/60 border border-white/10 rounded-xl p-5">
          <div class="text-sm text-gray-400 mb-1">Football Events</div>
          <div class="text-3xl font-bold text-blue-400">
            <template v-if="statsLoading"><ProgressSpinner style="width:24px;height:24px" /></template>
            <template v-else>{{ stats?.totalFootballEvents ?? '—' }}</template>
          </div>
          <div class="text-xs text-gray-500 mt-1">
            Watched: {{ stats?.footballWatchedCount ?? '—' }}
          </div>
        </div>

        <!-- Motorsport Events -->
        <div class="bg-gray-900/60 border border-white/10 rounded-xl p-5">
          <div class="text-sm text-gray-400 mb-1">Motorsport Events</div>
          <div class="text-3xl font-bold text-orange-400">
            <template v-if="statsLoading"><ProgressSpinner style="width:24px;height:24px" /></template>
            <template v-else>{{ stats?.totalMotorsportEvents ?? '—' }}</template>
          </div>
          <div class="text-xs text-gray-500 mt-1">
            Watched: {{ stats?.motorsportWatchedCount ?? '—' }}
          </div>
        </div>
      </div>

      <!-- Watch Status Distribution -->
      <div v-if="stats && !statsLoading" class="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-4">
        <div class="bg-gray-900/60 border border-white/10 rounded-xl p-5">
          <div class="text-sm text-gray-400 mb-3">Football Watch Status Distribution</div>
          <div class="flex flex-wrap gap-2">
            <span
              v-for="(count, status) in stats.footballWatchStatusDistribution"
              :key="status"
              class="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium"
              :class="statusBadgeClass(status)"
            >
              {{ formatStatus(status) }}: {{ count }}
            </span>
          </div>
        </div>
        <div class="bg-gray-900/60 border border-white/10 rounded-xl p-5">
          <div class="text-sm text-gray-400 mb-3">Motorsport Watch Status Distribution</div>
          <div class="flex flex-wrap gap-2">
            <span
              v-for="(count, status) in stats.motorsportWatchStatusDistribution"
              :key="status"
              class="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium"
              :class="statusBadgeClass(status)"
            >
              {{ formatStatus(status) }}: {{ count }}
            </span>
          </div>
        </div>
      </div>
    </section>

    <Divider class="!border-white/10" />

    <!-- ═══ Sync Section ═══ -->
    <section>
      <h2 class="text-xl font-semibold text-white mb-4 flex items-center gap-2">
        <i class="pi pi-sync"></i> Event Sync
      </h2>

      <!-- Football Sync -->
      <div class="bg-gray-900/60 border border-white/10 rounded-xl p-5 mb-4">
        <h3 class="text-lg font-medium text-white mb-4 flex items-center gap-2">
          <i class="pi pi-fw pi-trophy text-blue-400"></i> Football
        </h3>

        <div class="flex flex-wrap gap-3">
          <Button
            label="Sync All (Sofascore)"
            icon="pi pi-sync"
            :loading="syncStates.footballAll.loading"
            @click="doSync('footballAll', syncFootballSofascoreAll)"
            severity="info"
            size="small"
          />
          <Button
            label="Sync All (Legacy)"
            icon="pi pi-sync"
            :loading="syncStates.football.loading"
            @click="doSync('football', syncFootball)"
            severity="secondary"
            size="small"
          />
        </div>

        <!-- Competition-specific sync -->
        <div class="mt-4 flex flex-wrap items-end gap-3">
          <div class="w-full sm:w-auto sm:min-w-[220px]">
            <label class="block text-xs text-gray-500 mb-1">Competition</label>
            <Select
              v-model="footballComp"
              :options="footballCompOptions"
              optionLabel="label"
              optionValue="value"
              placeholder="Select competition"
              class="w-full"
            />
          </div>
          <Button
            label="Sync Round"
            icon="pi pi-sync"
            :loading="syncStates.footballRound.loading"
            :disabled="!footballComp"
            @click="doSync('footballRound', () => syncFootballSofascoreCompetition(footballComp!))"
            severity="info"
            size="small"
          />
          <Button
            label="Init Competition"
            icon="pi pi-cloud-download"
            :loading="syncStates.footballInit.loading"
            :disabled="!footballComp"
            @click="doSync('footballInit', () => initFootballCompetition(footballComp!))"
            severity="warn"
            size="small"
          />
        </div>

        <!-- Response -->
        <div v-if="syncStates.footballAll.response !== null" class="mt-3">
          <Message
            :severity="syncStates.footballAll.error ? 'error' : 'success'"
            :closable="false"
          >{{ syncStates.footballAll.response }}</Message>
        </div>
        <div v-if="syncStates.football.response !== null" class="mt-3">
          <Message
            :severity="syncStates.football.error ? 'error' : 'success'"
            :closable="false"
          >{{ syncStates.football.response }}</Message>
        </div>
        <div v-if="syncStates.footballRound.response !== null" class="mt-3">
          <Message
            :severity="syncStates.footballRound.error ? 'error' : 'success'"
            :closable="false"
          >{{ syncStates.footballRound.response }}</Message>
        </div>
        <div v-if="syncStates.footballInit.response !== null" class="mt-3">
          <Message
            :severity="syncStates.footballInit.error ? 'error' : 'success'"
            :closable="false"
          >{{ syncStates.footballInit.response }}</Message>
        </div>
      </div>

      <!-- Motorsport Sync -->
      <div class="bg-gray-900/60 border border-white/10 rounded-xl p-5 mb-4">
        <h3 class="text-lg font-medium text-white mb-4 flex items-center gap-2">
          <i class="pi pi-fw pi-flag text-orange-400"></i> Motorsport
        </h3>

        <div class="flex flex-wrap gap-3">
          <Button
            label="Sync All"
            icon="pi pi-sync"
            :loading="syncStates.motorsportAll.loading"
            @click="doSync('motorsportAll', syncMotorsport)"
            severity="info"
            size="small"
          />
        </div>

        <!-- Competition-specific init -->
        <div class="mt-4 flex flex-wrap items-end gap-3">
          <div class="w-full sm:w-auto sm:min-w-[220px]">
            <label class="block text-xs text-gray-500 mb-1">Competition</label>
            <Select
              v-model="motorsportComp"
              :options="motorsportCompOptions"
              optionLabel="label"
              optionValue="value"
              placeholder="Select competition"
              class="w-full"
            />
          </div>
          <Button
            label="Init Competition"
            icon="pi pi-cloud-download"
            :loading="syncStates.motorsportInit.loading"
            :disabled="!motorsportComp"
            @click="doSync('motorsportInit', () => initMotorsportCompetition(motorsportComp!))"
            severity="warn"
            size="small"
          />
        </div>

        <!-- Init all competitions -->
        <div class="mt-3">
          <Button
            label="Init All Competitions"
            icon="pi pi-cloud-download"
            :loading="syncStates.motorsportInitAll.loading"
            @click="doSync('motorsportInitAll', () => initMotorsportCompetition())"
            severity="secondary"
            size="small"
          />
        </div>

        <!-- Responses -->
        <div v-if="syncStates.motorsportAll.response !== null" class="mt-3">
          <Message
            :severity="syncStates.motorsportAll.error ? 'error' : 'success'"
            :closable="false"
          >{{ syncStates.motorsportAll.response }}</Message>
        </div>
        <div v-if="syncStates.motorsportInit.response !== null" class="mt-3">
          <Message
            :severity="syncStates.motorsportInit.error ? 'error' : 'success'"
            :closable="false"
          >{{ syncStates.motorsportInit.response }}</Message>
        </div>
        <div v-if="syncStates.motorsportInitAll.response !== null" class="mt-3">
          <Message
            :severity="syncStates.motorsportInitAll.error ? 'error' : 'success'"
            :closable="false"
          >{{ syncStates.motorsportInitAll.response }}</Message>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useUserStore } from "~/stores/useUserStore";
import {
  fetchAdminStats,
  syncFootball,
  syncFootballSofascoreAll,
  syncFootballSofascoreCompetition,
  initFootballCompetition,
  syncMotorsport,
  initMotorsportCompetition,
  type AdminStats,
} from "~/services/admin";
import { fetchFootballCompetitions } from "~/services/footballEvents";
import { fetchMotorsportCompetitions } from "~/services/motorsportEvents";

definePageMeta({
  title: "Admin",
  description: "Admin panel for Trakket",
});

useSeoMeta({
  robots: 'noindex, nofollow',
})

const router = useRouter();
const userStore = useUserStore();

// ─── Guard ────────────────────────────────────────────────────────────────

onMounted(async () => {
  if (!userStore.isLoggedIn) {
    await router.push("/login");
    return;
  }
  if (!userStore.isAdmin) {
    await router.push("/favourites");
    return;
  }
  loadStats();
  loadCompetitionOptions();
});

// ─── Stats ─────────────────────────────────────────────────────────────────

const stats = ref<AdminStats | null>(null);
const statsLoading = ref(false);
const statsError = ref<string | null>(null);

async function loadStats() {
  statsLoading.value = true;
  statsError.value = null;
  try {
    stats.value = await fetchAdminStats();
  } catch (e: any) {
    statsError.value = e.response?.data?.message ?? e.message ?? "Failed to load stats";
  } finally {
    statsLoading.value = false;
  }
}

// ─── Sync operations ──────────────────────────────────────────────────────

interface SyncState {
  loading: boolean;
  response: string | null;
  error: boolean;
}

const syncStates = reactive<Record<string, SyncState>>({
  footballAll: { loading: false, response: null, error: false },
  football: { loading: false, response: null, error: false },
  footballRound: { loading: false, response: null, error: false },
  footballInit: { loading: false, response: null, error: false },
  motorsportAll: { loading: false, response: null, error: false },
  motorsportInit: { loading: false, response: null, error: false },
  motorsportInitAll: { loading: false, response: null, error: false },
});

async function doSync(key: string, fn: () => Promise<string>) {
  const state = syncStates[key];
  state.loading = true;
  state.response = null;
  state.error = false;
  try {
    const msg = await fn();
    state.response = msg;
  } catch (e: any) {
    state.error = true;
    state.response = e.response?.data ?? e.message ?? "Sync failed";
  } finally {
    state.loading = false;
  }
}

// ─── Competition dropdowns ────────────────────────────────────────────────

const footballComp = ref<string | null>(null);
const motorsportComp = ref<string | null>(null);

const footballCompOptions = ref<{ label: string; value: string }[]>([]);
const motorsportCompOptions = ref<{ label: string; value: string }[]>([]);

async function loadCompetitionOptions() {
  try {
    const fb = await fetchFootballCompetitions();
    footballCompOptions.value = fb.map(c => ({
      label: c.displayName ?? c.name,
      value: c.name,
    }));
  } catch { /* ignore */ }

  try {
    const ms = await fetchMotorsportCompetitions();
    motorsportCompOptions.value = ms.map(c => ({
      label: c.displayName ?? c.name,
      value: c.name,
    }));
  } catch { /* ignore */ }
}

// ─── Status badge helpers ─────────────────────────────────────────────────

function formatStatus(status: string): string {
  return status
    .toLowerCase()
    .split("_")
    .map(w => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

function statusBadgeClass(status: string): string {
  switch (status) {
    case "UNWATCHED":
      return "bg-gray-800 text-gray-400 border border-gray-700";
    case "IN_PERSON":
      return "bg-green-900/40 text-green-400 border border-green-700/50";
    case "LIVE":
      return "bg-red-900/40 text-red-400 border border-red-700/50";
    case "REPLAY":
      return "bg-blue-900/40 text-blue-400 border border-blue-700/50";
    case "HIGHLIGHTS":
      return "bg-yellow-900/40 text-yellow-400 border border-yellow-700/50";
    default:
      return "bg-gray-800 text-gray-400 border border-gray-700";
  }
}
</script>
