# baseThreeScene

`@gogec/three-scene-vue3` 提供一个即插即用的 Three.js 场景创建方案。通过一个 Vue 3 组件和一个强类型的 `ThreeScene` 类，它会替你完成渲染器、相机、灯光、控制器等基础配置，让你直接专注于搭建 3D 业务场景。

## 特性
- 一行模板代码即可得到 OrbitControls、灯光、相机和渲染循环
- 内置网格、坐标轴、地面与性能监控等常用调试辅助
- 暴露 `ThreeScene` 实例，方便注册事件、添加模型或完全接管渲染
- 支持射线拾取，提供点击/移动命中事件
- 可自定义 renderer、像素比以及任何 `WebGLRendererParameters`

---

## 安装

```bash
npm install @gogec/three-scene-vue3
# 或
pnpm add @gogec/three-scene-vue3
```

---

## 快速开始（推荐方式）

```vue
<template>
  <div class="viewer">
    <ThreeSceneVue @onReady="handleReady" :options="options" />
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { ThreeSceneVue, type ThreeScene } from "@gogec/three-scene-vue3";

const options = ref({
  showGridHelper: true,
  showAxesHelper: true,
  enableRay: true,
});

function handleReady(baseScene: ThreeScene) {
  const { scene, camera, renderer } = baseScene;
  // 在这里添加模型、光源或动画逻辑
  console.log(scene, camera, renderer);
}
</script>

<style scoped>
.viewer {
  width: 100%;
  height: 100vh;
}
</style>
```

`ThreeSceneVue` 会自动把 `domElem` 指向组件内部的容器，根据容器大小自适应渲染尺寸。

### 直接实例化

```ts
import ThreeScene from "@gogec/three-scene-vue3";

const baseScene = new ThreeScene({
  domElem: document.getElementById("canvasWrapper")!,
  showFloor: false,
});
```

---

## ThreeScene 实例能力

`onReady` 回调获得的 `baseScene` 暴露了以下属性和方法：

- `scene`、`camera`、`renderer`、`light`：核心 Three.js 对象
- `control`：已初始化的 `OrbitControls`
- `addEventListener(type, listener)` / `removeEventListener`：监听渲染或鼠标事件
- `onWindowResize()`：手动触发画布自适应
- `dispose()`：释放动画帧、控制器、渲染器和所有 Mesh 的几何体/材质

---

## 配置项（`ThreeSceneOptions`）

| 选项 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `domElem` | `HTMLElement` | 必填（组件已自动传入） | Three.js canvas 挂载位置 |
| `showGridHelper` | `boolean` | `false`（组件中被覆写为 `true`） | 显示网格地面辅助 |
| `showAxesHelper` | `boolean` | `false`（组件中被覆写为 `true`） | 显示 XYZ 坐标轴 |
| `showFloor` | `boolean` | `true` | 渲染一个基础平面 |
| `showStats` | `boolean` | `false` | 显示 FPS/内存占用 |
| `enableRay` | `boolean` | `false` | 开启射线拾取事件 |
| `devicePixelRatio` | `number` | `window.devicePixelRatio` | 控制像素比 |
| `renderParams` | `THREE.WebGLRendererParameters` | `undefined` | 渲染器构造参数 |
| `render` | `THREE.WebGLRenderer \| CSS2DRenderer \| CSS3DRenderer` | `undefined` | 外部 renderer 实例 |

> 如果你完全使用组件，只需根据需要传递 `options` 即可。

---

## 事件

### 渲染生命周期

| 事件名 | 触发时机 |
| --- | --- |
| `onRenderBefor` | 每一帧渲染开始前，适合更新动画状态 |
| `onRenderAfter` | 每一帧渲染结束后，适合做联动或统计 |

```ts
baseScene.addEventListener("onRenderBefor", () => {
  // 更新模型动画或相机
});
```

### 鼠标与射线拾取

| 事件名 | 说明 | 返回 |
| --- | --- | --- |
| `onClick` | 任意点击都会触发 | `meshs`：当前射线命中的对象数组 |
| `onMouseMoveFind` | 需 `enableRay: true`，鼠标移动命中对象时触发 | `meshs`：按距离排序的命中列表 |
| `onClickFind` | 需 `enableRay: true`，点击命中对象时触发 | `meshs`：按距离排序的命中列表 |

```ts
baseScene.addEventListener("onClickFind", ({ meshs }) => {
  if (!meshs?.length) return;
  const first = meshs[0].object;
  console.log("点击到的 Mesh：", first.name || first.id);
});
```

---

## 常见问题

- **容器缩放时画面变形？** 调用 `baseScene.onWindowResize()` 或像组件那样使用 `ResizeObserver`。
- **如何销毁场景？** 组件卸载时会自动执行 `dispose()`；裸实例需要在业务结束时手动调用。
- **多个场景共存？** 可以，确保每个实例拥有独立的 `domElem` 容器即可。

如有问题或改进建议，欢迎在 [issues](https://github.com/GoGeChang/baseThreeScene/issues) 中讨论。
