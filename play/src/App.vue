<script setup lang="ts">
import { ThreeJs } from '@three-lib/core'
import { onMounted } from 'vue'
onMounted(() => {
  let dom = document.getElementById('playground')
  const threeInstance = new ThreeJs(dom!, {
    loaders: ['gltf'],
    antiAliasingType: {
      sampleLevel: 1,
      unbiased: false,
    },
  })
})
</script>

<template>
  <div id="playground"></div>
</template>

<style>
body,
html {
  padding: 0;
  margin: 0;
}
#playground {
  width: 100vw;
  height: 100vh;
}
</style>
