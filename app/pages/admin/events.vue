<template>
  <div class="px-2 sm:px-4 py-4 max-w-6xl mx-auto">
    <div class="flex items-center justify-between mb-6">
      <h1 class="text-3xl font-extrabold tracking-tight text-white">
        Manage Events
      </h1>
      <div class="flex gap-2">
        <Button
          label="Admin Panel"
          icon="pi pi-arrow-left"
          severity="secondary"
          size="small"
          @click="$router.push('/admin')"
        />
      </div>
    </div>

    <!-- Sport Tabs -->
    <div class="flex gap-1 mb-6 bg-gray-900/60 border border-white/10 rounded-xl p-1 w-fit">
      <Button
        label="Football"
        icon="pi pi-trophy"
        :severity="activeTab === 'football' ? 'info' : 'secondary'"
        size="small"
        @click="activeTab = 'football'; loadEvents()"
      />
      <Button
        label="Motorsport"
        icon="pi pi-flag"
        :severity="activeTab === 'motorsport' ? 'info' : 'secondary'"
        size="small"
        @click="activeTab = 'motorsport'; loadEvents()"
      />
    </div>

    <!-- Filters -->
    <div class="bg-gray-900/60 border border-white/10 rounded-xl p-4 mb-4">
      <div class="flex flex-wrap items-end gap-3">
        <div class="w-full sm:w-auto sm:min-w-[200px]">
          <label class="block text-xs text-gray-500 mb-1">Competition</label>
          <Select
            v-model="filters.competition"
            :options="compOptions"
            optionLabel="label"
            optionValue="value"
            placeholder="All competitions"
            class="w-full"
            @change="loadEvents()"
          />
        </div>
        <div class="w-full sm:w-auto sm:min-w-[160px]">
          <label class="block text-xs text-gray-500 mb-1">Status</label>
          <Select
            v-model="filters.status"
            :options="statusOptions"
            optionLabel="label"
            optionValue="value"
            placeholder="All statuses"
            class="w-full"
            @change="loadEvents()"
          />
        </div>
        <Button
          label="Refresh"
          icon="pi pi-refresh"
          severity="secondary"
          size="small"
          :loading="loading"
          @click="loadEvents()"
        />
      </div>
    </div>

    <!-- Error -->
    <div v-if="error" class="mb-4">
      <Message severity="error" :closable="false">{{ error }}</Message>
    </div>

    <!-- Events Table -->
    <div class="bg-gray-900/60 border border-white/10 rounded-xl overflow-hidden">
      <div v-if="loading" class="flex justify-center py-12">
        <ProgressSpinner style="width:40px;height:40px" />
      </div>

      <template v-else-if="events.length === 0">
        <div class="text-center py-12 text-gray-500">No events found</div>
      </template>

      <template v-else>
        <div class="overflow-x-auto">
          <table class="w-full text-sm">
            <thead>
              <tr class="border-b border-white/10 text-gray-400 text-left">
                <th class="px-4 py-3 font-medium">ID</th>
                <th class="px-4 py-3 font-medium">Event</th>
                <th class="px-4 py-3 font-medium">Date &amp; Time</th>
                <th class="px-4 py-3 font-medium">Status</th>
                <th class="px-4 py-3 font-medium">Result</th>
                <th class="px-4 py-3 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="event in events"
                :key="event.id"
                class="border-b border-white/5 hover:bg-white/5 transition-colors"
              >
                <td class="px-4 py-3 text-gray-400">{{ event.id }}</td>
                <td class="px-4 py-3">
                  <div class="text-white font-medium">
                    <template v-if="activeTab === 'football'">
                      {{ (event as any).homeTeamName }} vs {{ (event as any).awayTeamName }}
                    </template>
                    <template v-else>
                      {{ event.title }}
                    </template>
                  </div>
                  <div class="text-xs text-gray-500 mt-0.5">
                    {{ formatCompetition(event.competition) }}
                  </div>
                </td>
                <td class="px-4 py-3 text-gray-300 whitespace-nowrap">
                  {{ formatDate(event.dateTime) }}
                </td>
                <td class="px-4 py-3">
                  <span
                    class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                    :class="statusBadgeClass(event.status)"
                  >
                    {{ formatStatus(event.status) }}
                  </span>
                </td>
                <td class="px-4 py-3 text-gray-300">
                  <template v-if="activeTab === 'football'">
                    {{ (event as any).homeScore ?? '-' }} : {{ (event as any).awayScore ?? '-' }}
                  </template>
                  <template v-else>
                    {{ (event as any).winner ?? '-' }}
                  </template>
                </td>
                <td class="px-4 py-3 text-right">
                  <Button
                    icon="pi pi-pencil"
                    severity="info"
                    size="small"
                    text
                    @click="openEditDialog(event)"
                  />
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Pagination -->
        <div class="flex items-center justify-between px-4 py-3 border-t border-white/10">
          <span class="text-xs text-gray-500">
            Page {{ pagination.pageNumber + 1 }} of {{ totalPages }} ({{ pagination.totalElements }} total)
          </span>
          <div class="flex gap-2">
            <Button
              icon="pi pi-chevron-left"
              severity="secondary"
              size="small"
              text
              :disabled="pagination.pageNumber <= 0"
              @click="changePage(pagination.pageNumber - 1)"
            />
            <Button
              icon="pi pi-chevron-right"
              severity="secondary"
              size="small"
              text
              :disabled="pagination.last"
              @click="changePage(pagination.pageNumber + 1)"
            />
          </div>
        </div>
      </template>
    </div>

    <!-- Edit Dialog -->
    <Dialog
      v-model:visible="editDialogVisible"
      modal
      dismissableMask
      :header="editDialogTitle"
      class="!max-w-lg w-full"
      :pt="{
        root: { class: '!bg-gray-900 !border !border-white/10 !rounded-2xl' },
        header: { class: '!text-white !border-b !border-white/5 !pb-4' },
        content: { class: '!text-gray-300 !pt-6 !pb-4' },
      }"
    >
      <div v-if="editingEvent" class="flex flex-col gap-5">
        <!-- Date & Time -->
        <div>
          <label class="block text-sm text-gray-400 mb-1.5">Date &amp; Time</label>
          <DatePicker
            v-model="editForm.dateTime"
            showTime
            showIcon
            fluid
            :dateFormat="dateFormat"
            hourFormat="24"
          />
        </div>

        <!-- Football scores -->
        <template v-if="activeTab === 'football'">
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm text-gray-400 mb-1.5">
                {{ (editingEvent as any).homeTeamName }} Score
              </label>
              <InputNumber
                v-model="editForm.homeScore"
                :min="0"
                :max="99"
                fluid
                :allowEmpty="false"
              />
            </div>
            <div>
              <label class="block text-sm text-gray-400 mb-1.5">
                {{ (editingEvent as any).awayTeamName }} Score
              </label>
              <InputNumber
                v-model="editForm.awayScore"
                :min="0"
                :max="99"
                fluid
                :allowEmpty="false"
              />
            </div>
          </div>
        </template>

        <!-- Motorsport winner -->
        <template v-else>
          <div>
            <label class="block text-sm text-gray-400 mb-1.5">Winner</label>
            <InputText
              v-model="editForm.winner"
              placeholder="Winner name"
              fluid
            />
          </div>
        </template>

        <!-- Actions -->
        <div class="flex justify-end gap-2 pt-2 border-t border-white/5">
          <Button
            label="Cancel"
            severity="secondary"
            text
            @click="editDialogVisible = false"
          />
          <Button
            label="Save"
            icon="pi pi-check"
            :loading="saving"
            @click="saveEdit()"
          />
        </div>
      </div>
    </Dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted, watch } from "vue";
import { useRouter } from "vue-router";
import { useToast } from "primevue/usetoast";
import { useUserStore } from "~/stores/useUserStore";
import {
  fetchAdminFootballEvents,
  fetchAdminMotorsportEvents,
  updateFootballEvent,
  updateMotorsportEvent,
} from "~/services/admin";
import { fetchFootballCompetitions } from "~/services/footballEvents";
import { fetchMotorsportCompetitions } from "~/services/motorsportEvents";
import { useFormatters } from "~/composables/useFormatters";

import type {
  AdminFootballEvent,
  AdminMotorsportEvent,
  FootballEventUpdateRequest,
  MotorsportEventUpdateRequest,
} from "~/types/admin";

definePageMeta({
  title: "Manage Events",
  description: "Manage events in the admin panel",
  middleware: ["admin"],
});

useSeoMeta({
  robots: "noindex, nofollow",
});

const router = useRouter();
const toast = useToast();
const userStore = useUserStore();
const { formatDate } = useFormatters();

const dateFormat = "dd/mm/yy";

// ─── Guard ─────────────────────────────────────────────────────────────────

onMounted(async () => {
  if (!userStore.isLoggedIn) {
    await router.push("/login");
    return;
  }
  if (!userStore.isAdmin) {
    await router.push("/favourites");
    return;
  }
  loadCompetitionOptions();
  loadEvents();
});

// ─── State ─────────────────────────────────────────────────────────────────

const activeTab = ref<"football" | "motorsport">("football");
const loading = ref(false);
const error = ref<string | null>(null);
const events = ref<any[]>([]);

const pagination = reactive({
  pageNumber: 0,
  pageSize: 20,
  totalElements: 0,
  last: false,
});

const totalPages = computed(() =>
  Math.max(1, Math.ceil(pagination.totalElements / pagination.pageSize))
);

// ─── Filters ───────────────────────────────────────────────────────────────

const filters = reactive<{
  competition: string | null;
  status: string | null;
}>({
  competition: null,
  status: null,
});

const statusOptions = [
  { label: "All", value: null },
  { label: "Scheduled", value: "SCHEDULED" },
  { label: "In Progress", value: "IN_PROGRESS" },
  { label: "Completed", value: "COMPLETED" },
];

const compOptions = ref<{ label: string; value: string }[]>([]);
const footballCompOptions = ref<{ label: string; value: string }[]>([]);
const motorsportCompOptions = ref<{ label: string; value: string }[]>([]);

async function loadCompetitionOptions() {
  try {
    const fb = await fetchFootballCompetitions();
    footballCompOptions.value = [
      { label: "All", value: "" },
      ...fb.map((c) => ({
        label: c.displayName ?? c.name,
        value: c.name,
      })),
    ];
  } catch {
    footballCompOptions.value = [{ label: "All", value: "" }];
  }

  try {
    const ms = await fetchMotorsportCompetitions();
    motorsportCompOptions.value = [
      { label: "All", value: "" },
      ...ms.map((c) => ({
        label: c.displayName ?? c.name,
        value: c.name,
      })),
    ];
  } catch {
    motorsportCompOptions.value = [{ label: "All", value: "" }];
  }

  updateCompOptions();
}

function updateCompOptions() {
  compOptions.value =
    activeTab.value === "football"
      ? footballCompOptions.value
      : motorsportCompOptions.value;
}

watch(activeTab, () => {
  pagination.pageNumber = 0;
  filters.competition = null;
  filters.status = null;
  loadEvents();
});

// ─── Load Events ───────────────────────────────────────────────────────────

async function loadEvents() {
  loading.value = true;
  error.value = null;
  updateCompOptions();

  try {
    const params = {
      page: pagination.pageNumber,
      pageSize: pagination.pageSize,
      competition: filters.competition || undefined,
      status: filters.status || undefined,
      ascending: filters.status === "SCHEDULED" ? true : undefined,
    };

    if (activeTab.value === "football") {
      const res = await fetchAdminFootballEvents(params);
      events.value = res.events;
      pagination.pageNumber = res.pageNumber;
      pagination.totalElements = res.totalElements;
      pagination.last = res.last;
    } else {
      const res = await fetchAdminMotorsportEvents(params);
      events.value = res.events;
      pagination.pageNumber = res.pageNumber;
      pagination.totalElements = res.totalElements;
      pagination.last = res.last;
    }
  } catch (e: any) {
    error.value =
      e.response?.data?.message ?? e.message ?? "Failed to load events";
    events.value = [];
  } finally {
    loading.value = false;
  }
}

function changePage(page: number) {
  pagination.pageNumber = page;
  loadEvents();
}

// ─── Edit Dialog ───────────────────────────────────────────────────────────

const editDialogVisible = ref(false);
const saving = ref(false);
const editingEvent = ref<any>(null);

const editForm = reactive<{
  dateTime: Date | null;
  homeScore: number | null;
  awayScore: number | null;
  winner: string;
}>({
  dateTime: null,
  homeScore: null,
  awayScore: null,
  winner: "",
});

const editDialogTitle = computed(() => {
  if (!editingEvent.value) return "Edit Event";
  if (activeTab.value === "football") {
    const ev = editingEvent.value as any;
    return `${ev.homeTeamName} vs ${ev.awayTeamName}`;
  }
  return editingEvent.value.title ?? "Edit Event";
});

function openEditDialog(event: any) {
  editingEvent.value = event;
  editForm.dateTime = new Date(event.dateTime);
  if (activeTab.value === "football") {
    editForm.homeScore = (event as any).homeScore ?? null;
    editForm.awayScore = (event as any).awayScore ?? null;
  } else {
    editForm.winner = (event as any).winner ?? "";
  }
  editDialogVisible.value = true;
}

async function saveEdit() {
  if (!editingEvent.value || !editForm.dateTime) return;

  saving.value = true;
  try {
    if (activeTab.value === "football") {
      const request: FootballEventUpdateRequest = {
        dateTime: editForm.dateTime.toISOString(),
        homeScore: editForm.homeScore,
        awayScore: editForm.awayScore,
      };
      await updateFootballEvent(editingEvent.value.id, request);
    } else {
      const request: MotorsportEventUpdateRequest = {
        dateTime: editForm.dateTime.toISOString(),
        winner: editForm.winner || null,
      };
      await updateMotorsportEvent(editingEvent.value.id, request);
    }

    toast.add({
      severity: "success",
      summary: "Updated",
      detail: "Event updated successfully",
      life: 3000,
    });

    editDialogVisible.value = false;
    loadEvents();
  } catch (e: any) {
    toast.add({
      severity: "error",
      summary: "Failed",
      detail: e.response?.data?.message ?? e.message ?? "Update failed",
      life: 5000,
    });
  } finally {
    saving.value = false;
  }
}

// ─── Helpers ───────────────────────────────────────────────────────────────

function formatStatus(status: string): string {
  return status
    .toLowerCase()
    .split("_")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

function statusBadgeClass(status: string): string {
  switch (status) {
    case "SCHEDULED":
      return "bg-blue-900/40 text-blue-400 border border-blue-700/50";
    case "IN_PROGRESS":
      return "bg-yellow-900/40 text-yellow-400 border border-yellow-700/50";
    case "COMPLETED":
      return "bg-green-900/40 text-green-400 border border-green-700/50";
    default:
      return "bg-gray-800 text-gray-400 border border-gray-700";
  }
}

function formatCompetition(competition: any): string {
  const name = typeof competition === "string" ? competition : competition?.displayName ?? competition?.name ?? "";
  return name
    .toLowerCase()
    .split("_")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}
</script>
