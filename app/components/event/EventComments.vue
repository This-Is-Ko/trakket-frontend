<template>
  <Card>
    <template #title>Comments</template>
    <template #content>
      <!-- Add Comment -->
      <div class="mb-4">
        <Textarea v-model="newComment" rows="3" placeholder="Add your comment..." />
        <Button label="Post Comment" class="mt-2" @click="postComment" />
      </div>

      <!-- List Comments -->
      <div v-for="comment in comments" :key="comment.id" class="border-t pt-2 mt-2">
        <p class="font-semibold">{{ comment.user }}</p>
        <p class="text-gray-700">{{ comment.content }}</p>
        <small class="text-gray-500">{{ formatDate(comment.createdAt) }}</small>
      </div>
    </template>
  </Card>
</template>

<script setup lang="ts">
import { ref } from "vue";
import Card from "primevue/card";
import Textarea from "primevue/textarea";
import Button from "primevue/button";

const props = defineProps<{
  eventId: number | string;
}>();

// Mock comments
const comments = ref([
  { id: 1, user: "Alice", content: "Exciting match so far!", createdAt: "2025-08-19T12:00:00" },
  { id: 2, user: "Bob", content: "Messi is on fire!", createdAt: "2025-08-19T12:05:00" },
]);

const newComment = ref("");

function postComment() {
  if (!newComment.value) return;
  comments.value.unshift({
    id: comments.value.length + 1,
    user: "CurrentUser",
    content: newComment.value,
    createdAt: new Date().toISOString(),
  });
  newComment.value = "";
}

function formatDate(dt: string) {
  return new Date(dt).toLocaleString();
}
</script>
