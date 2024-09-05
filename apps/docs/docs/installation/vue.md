---
sidebar_position: 3
sidebar_label: Vue.js

description: "Use the WebPlayer with Vue.js"
---

# WebPlayer with Vue.js

## Installation

```bash npm2yarn
npm install @car-cutter/vue-webplayer
```

## Usage

1. Import: `import { WebPlayer } from "@car-cutter/vue-webplayer"`
2. Use: `<WebPlayer :compositionUrl={url} />`

### Default Vue implementation example

```vue title="/src/App.vue"
<script setup lang="ts">
import { WebPlayer } from "@car-cutter/vue-webplayer";
</script>

<template>
  <div>
    <h1>Vue App</h1>
    <div class="webplayer-wrapper">
      <WebPlayer
        compositionUrl="https://cdn.car-cutter.com/libs/web-player/v3/demos/composition.json"
        :flatten="true"
        @compositionLoaded="() => console.log('Composition loaded')"
        @extendModeOn="() => console.log('Extend mode on')"
      />
    </div>
  </div>
</template>

<style scoped>
.webplayer-wrapper {
  max-width: 800px;
  margin-inline: auto;
}
</style>
```

## Next steps

For more customisation, take a look at available **props** in the **Customisation** section.
