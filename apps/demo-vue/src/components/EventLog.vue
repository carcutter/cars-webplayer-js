<script setup lang="ts">
import type { EventLogEntry } from "@car-cutter/demo";

defineProps<{ entries: EventLogEntry[]; total: number; source: string }>();
defineEmits<{ clear: [] }>();
</script>

<template>
  <details class="dm-events" open>
    <summary class="dm-events__summary">
      <span>Player events</span>
      <span class="dm-events__count">{{ total }}</span>
    </summary>
    <div class="dm-events__body">
      <div class="dm-events__toolbar">
        <span>{{ source }}</span>
        <button type="button" class="dm-events__clear" @click="$emit('clear')">
          Clear
        </button>
      </div>
      <p v-if="entries.length === 0" class="dm-events__empty">
        Waiting for events…
      </p>
      <ol class="dm-events__list">
        <li v-for="entry in entries" :key="entry.id" class="dm-events__entry">
          <span class="dm-events__time">{{ entry.time }}</span>
          <span class="dm-events__name">{{ entry.name }}</span>
          <span class="dm-events__detail">{{ entry.detail }}</span>
        </li>
      </ol>
    </div>
  </details>
</template>
