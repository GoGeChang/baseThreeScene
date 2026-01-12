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
let baseScene: ThreenScene | null = null;

onMounted(async () => {
  baseScene = new ThreenScene({
    domElem: threeContainer.value as HTMLElement,
    showAxesHelper: true,
    showGridHelper: true,
    ...props.options,
  });
  emits("onReady", baseScene);
});

onBeforeUnmount(async () => {
  if (!baseScene) return;

  cancelAnimationFrame(baseScene.animationId as number);
  baseScene.dispose();
});
</script>
<style lang="scss" scoped>
.three-container {
  width: 100%;
  height: 100%;
  overflow: hidden;
}
</style>
