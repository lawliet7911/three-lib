<script setup lang="ts">
import { LoadGlftModel, ThreeJs } from '@three-lib/core'
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

  LoadGlftModel('modals/gltf/6fdf02a6-c66f-4749-83bb-4eae20ab8b5b').then(gltf=>{
    instance.scene?.add(gltf.scene)
  })

  LoadGlftModel('modals/gltf/43dc30aa-e48d-47c2-8863-f2f4d34b03c7').then(gltf=>{
    instance.scene?.add(gltf.scene)
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
