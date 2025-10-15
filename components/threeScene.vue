<template>
  <div class="three-container" ref="threeContainer"></div>
</template>

<script lang="ts" setup>
import { ref, onMounted, onBeforeUnmount, nextTick } from "vue";
import ThreenScene from "../index";
import { ThreeSceneOptions } from "../src/types/threeScene";

const props = defineProps<{
  options?: ThreeSceneOptions;
}>();
const emits = defineEmits(["onReady"]);
const threeContainer = ref<HTMLElement | null>(null);

onMounted(async () => {
  await nextTick();
  const baseScene = new ThreenScene({
    domElem: threeContainer.value as HTMLElement,
    showAxesHelper: true,
    showGridHelper: true,
    ...props.options,
  });
  emits("onReady", baseScene);

  const resizeObserver = new ResizeObserver((entries) => {
    for (const entry of entries) {
      const { width, height } = entry.contentRect;
      if (width === 0 || height === 0) {
        requestAnimationFrame(() => baseScene.onWindowResize());
      } else {
        baseScene.onWindowResize();
      }
    }
  });
  resizeObserver.observe(threeContainer.value!);

  onBeforeUnmount(() => {
    resizeObserver.disconnect();
    cancelAnimationFrame(baseScene.animationId as number);

    baseScene.dispose();
    // 移除GUI DOM
    let lilGui = document.querySelectorAll(".lil-gui");
    if (lilGui.length) {
      lilGui.forEach((item) => {
        item.remove();
      });
    }
    // 移除stats DOM
    if (baseScene.stats) {
      baseScene.stats.dom?.remove();
    }
  });
});
</script>
<style lang="scss" scoped>
.three-container {
  width: 100%;
  height: 100%;
  overflow: hidden;
}
</style>
