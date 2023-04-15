<script setup lang="ts">
import { ThreeJs } from '@three-lib/core'
import { onMounted } from 'vue'
onMounted(() => {
  let dom = document.getElementById('playground')
  const instance = new ThreeJs(dom!, {
    mode: 'dev',
    clearColor: 0x000000,
    ambientLightOption: {
      show: true,
    },
  })
  instance.render()
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
