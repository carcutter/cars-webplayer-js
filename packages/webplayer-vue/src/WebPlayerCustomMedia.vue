<script lang="ts" setup>
import type { WebPlayerCustomMediaProps } from "@car-cutter/core";
import { webPlayerCustomMediaPropsToAttributes } from "@car-cutter/wc-webplayer";

export type { WebPlayerCustomMediaProps };

const props = defineProps<WebPlayerCustomMediaProps>();
const attributes = webPlayerCustomMediaPropsToAttributes(props);
</script>

<template>
  <cc-webplayer-custom-media v-bind="attributes">
    <slot></slot>
  </cc-webplayer-custom-media>
</template>
