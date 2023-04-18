<script setup lang="ts">
import { LoadGlftModel, LoadObjModel, ThreeJs } from '@three-lib/core'
import { onMounted } from 'vue'
onMounted(async () => {

  let dom = document.getElementById('playground')
  const instance = new ThreeJs(dom!, {
    mode: 'dev',
    clearColor: 0x000000,
    ambientLightOption: {
      show: true,
    },
    antiAliasingType: { type: 'smaa' }
  })

  instance.render()

  // 场地模型
  const modal = await LoadGlftModel('modals/gltf/6fdf02a6-c66f-4749-83bb-4eae20ab8b5b')
  // 静态模型 不自动更新
  // modal.scene.matrixAutoUpdate = false
  // 需要更新调用
  // modal.scene.updateMatrix() 
  instance.scene!.add(modal.scene)

  // 消防栓
  const modalFire = await LoadGlftModel('modals/gltf/43dc30aa-e48d-47c2-8863-f2f4d34b03c7')
  instance.scene!.add(modalFire.scene)

  // 其他地块
  const otherBuilding = await LoadGlftModel('modals/gltf/44122750-a8a4-425e-a570-bba504e26b53')
  instance.scene!.add(otherBuilding.scene)

  // obj模型
  const yxc = await LoadObjModel(['modals/印象城.mtl', 'modals/yxc.obj'])
  yxc.scale.set(.1, .1, .1)
  yxc.position.set(0, 0, 0)
  instance.scene?.add(yxc)
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
