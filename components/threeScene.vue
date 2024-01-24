<template>
  <div class="three-container" ref="threeContainer"></div>
</template>

<script lang="ts" setup>
import { ref, onMounted, onBeforeUnmount } from "vue";
import threeScene from "../index";
import { threeSceneOptions } from "../types/threeScene";

const props = defineProps<{
  options?: threeSceneOptions;
}>();
const emits = defineEmits(["onReady"]);
const threeContainer = ref<HTMLElement | null>(null);

onMounted(() => {
  const baseScene = new threeScene({
    domElem: threeContainer.value as HTMLElement,
    showAxesHelper: true,
    showGridHelper: true,
    ...props.options
  });
  emits("onReady", baseScene);

  onBeforeUnmount(() => {
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
    if(baseScene.stats) {
      baseScene.stats.dom?.remove();
    }
  });
});
</script>
<style lang="scss" scoped></style>
