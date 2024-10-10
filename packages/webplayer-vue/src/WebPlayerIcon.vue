<script lang="ts" setup>
import type { WebPlayerIconProps } from "@car-cutter/core";
import { webPlayerIconPropsToAttributes } from "@car-cutter/wc-webplayer";

export type { WebPlayerIconProps };

const props = defineProps<WebPlayerIconProps>();
const attributes = webPlayerIconPropsToAttributes(props);
</script>

<template>
  <cc-webplayer-icon v-bind="attributes">
    <slot></slot>
  </cc-webplayer-icon>
</template>
