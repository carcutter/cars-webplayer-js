<script setup>
import { ensureCustomElementsDefinition } from "@car-cutter/wc-webplayer";

ensureCustomElementsDefinition();
</script>

<template>
  <cc-webplayer :composition-url="compositionUrl" :flatten="flatten">
  </cc-webplayer>
</template>

<script>
export default {
  name: "WebPlayer",
  props: {
    compositionUrl: {
      type: String,
      required: true,
    },
    flatten: {
      type: Boolean,
    },
  },
};
</script>
