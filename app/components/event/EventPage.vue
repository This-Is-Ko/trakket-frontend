<template>
  <div class="p-6 space-y-8">
    <!-- Header -->
    <div>
      <h1 class="text-2xl font-bold">{{ event.competition }}</h1>
      <p class="text-gray-600">
        {{ formatDate(event.dateTime) }} • {{ event.location }}
      </p>
      <Tag :value="event.status" severity="info" />
    </div>

    <!-- Common Event Details -->
    <Card>
      <template #title>Event Details</template>
      <template #content>
        <ul class="space-y-2">
          <li><b>Date & Time:</b> {{ formatDate(event.dateTime) }}</li>
          <li><b>Competition:</b> {{ event.competition }}</li>
          <li><b>Location:</b> {{ event.location }}</li>
          <li><b>Status:</b> {{ event.status }}</li>
          <li v-if="event.externalLink">
            <a :href="event.externalLink" target="_blank" class="text-blue-600 underline">
              External Link
            </a>
          </li>
        </ul>

        <!-- Watch Status -->
        <div class="mt-4">
          <label for="watchStatus" class="block font-semibold mb-2">Watch Status:</label>
          <Select
              id="watchStatus"
              v-model="selectedWatchStatus"
              :options="watchStatusOptions"
              optionLabel="label"
              optionValue="value"
              placeholder="Select status"
              class="w-64"
          />
        </div>
      </template>
    </Card>

    <!-- Event Specific Details -->
    <FootballEventPage v-if="event.type === 'football'" :event="event" />

    <!-- Comments (generic for all event) -->
    <EventComments :eventId="event.id" />
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import Card from "primevue/card";
import Tag from "primevue/tag";
import Select from "primevue/select";
import FootballEventPage from "~/components/event/FootballEventPage.vue";
import EventComments from "~/components/event/EventComments.vue";

// Mock event data
const event = ref({
  id: 123,
  type: "football",
  dateTime: "2025-08-21T19:30:00",
  competition: "UEFA Champions League",
  location: "Camp Nou, Barcelona",
  status: "Ongoing",
  externalLink: "https://www.uefa.com",
  homeTeam: "FC Barcelona",
  awayTeam: "Real Madrid",
  homeScore: 2,
  awayScore: 1,
});

// Watch Status options
const watchStatusOptions = [
  { label: "Unwatched", value: "UNWATCHED" },
  { label: "In Person", value: "IN_PERSON" },
  { label: "Live", value: "LIVE" },
  { label: "Replay", value: "REPLAY" },
  { label: "Highlights", value: "HIGHLIGHTS" },
];

const selectedWatchStatus = ref("UNWATCHED");

function formatDate(dt: string) {
  return new Date(dt).toLocaleString();
}
</script>
