# baseThreeScene

几行代码让你快速搭建一个 three 的 3d 场景。

# 使用

## 安装

npm i threescene-vue3

## 引入

```vue
<threeScene @onReady="sceneRead"></threeScene>
```

```ts
import threeScene from "threescene-vue3/components/threeScene.vue";
import ThreeScene from "threescene-vue3/lib/baseScene";
function sceneRead(baseScene: ThreeScene) {
  let { scene, renderer, camera } = baseScene;
}
```

# 生命周期

## 动画

1. 动画帧开始渲染前
   `onRenderBefor`，无返回值

```js
baseScene.addEventListener("onRenderBefor", () => {
  // 下一帧动画开始渲染前，做点什么。
});
```

```js
baseScene.addEventListener("onRayFind", (findMeshs) => {
  console.log(findMeshs);
});
```

2. 动画帧开始渲染后
   `onRenderAfter`，无返回值

```js
baseScene.addEventListener("onRenderAfter", () => {
  // 动画渲染完毕，做点什么。
});
```

# 配置项

```ts
domElem?: HTMLElement; // 需要将three场景canvas插入的dom，如果没有，就默认插入元素父节点
showGridHelper?: boolean; // 是否添加网格平面用于辅助显示
showAxesHelper?: boolean; // 是否添加场景x、y、z的笛卡尔坐标轴用于辅助显示
showFloor?: boolean; // 是显示地面平面，用于辅助显示
showStats?: boolean; // 是否显示帧率和内存占用率
enableRay?: boolean; // 启用射线查询
enableMouseMove?: boolean; // 监听mouseMove射线查询事件的结果
enableClick?: boolean; // 监听click射线查询事件的结果
```

## 鼠标事件

鼠标事件必须设置配置项的`enableRay`为 true，在对要监听的事件依次开启。

### 鼠标移动事件
设置启用监听，`option.enableMouseMove = true`
`onMouseMove`，返回`mesh[]`

```js
baseScene.addEventListener("onMouseMoveFind", (data) => {
  // 用查找的meshs做点什么
  data.meshs
});
```
meshs 是查找到射线投射方向所触碰到的所有 Mesh，meshs[0]就是第一个被你鼠标接触到的物体。

### 鼠标点击事件
设置启用监听，`option.enableClick = true`;
`o`，返回`mesh[]`
```js
baseScene.addEventListener("onClickFind", (data) => {
  // 用查找的meshs做点什么
  data.meshs
});
```

