<script setup lang="ts">
import { demoUrl, themeStyle, type Theme } from "@car-cutter/demo";

const { theme: t } = defineProps<{ theme: Theme }>();

defineSlots<{
  /** Content of the stage: the WebPlayer */
  media(): unknown;
  /** Rendered under the stage */
  events(): unknown;
}>();

const indexUrl = demoUrl("index");
</script>

<template>
  <div class="dm dm--fit" :style="themeStyle(t)">
    <header class="dm-header">
      <div class="dm-header__inner">
        <a class="dm-brand" :href="indexUrl" title="All demos">
          <span class="dm-brand__tile">{{ t.mono }}</span>
          <span class="dm-brand__text">
            <span class="dm-brand__title">{{ t.title }}</span>
            <span class="dm-brand__subtitle">
              CarCutter WebPlayer integration
            </span>
          </span>
        </a>
        <span class="dm-pill">{{ t.pkg }}</span>
      </div>
    </header>
    <main class="dm-main">
      <div class="dm-stage"><slot name="media" /></div>
      <div class="dm-below"><slot name="events" /></div>
    </main>
  </div>
</template>
