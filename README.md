# baseThreeScene
几行代码让你快速搭建一个three的3d场景。
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
function sceneRead(baseScene: ThreeScene){
	let {scene, renderer, camera} = baseScene;
}
```
# 生命周期

## 动画
1. 动画帧开始渲染前
`onRenderBefor`，无返回值
```js
baseScene.event.addEventListener('onRenderBefor', () => {
  // 下一帧动画开始渲染前，做点什么。
})
```

```js
baseScene.event.addEventListener('onRayFind', findMeshs => {
  console.log(findMeshs)
})
```
2. 动画帧开始渲染后
`onRenderAfter`，无返回值
```js
baseScene.event.addEventListener('onRenderAfter', () => {
  // 动画渲染完毕，做点什么。
})
```

## 鼠标事件
`onRayFind`，返回`mesh[]`
```js
baseScene.event.addEventListener('onRayFind', meshs => {
  // 用查找的meshs做点什么
})
```
meshs是查找到射线投射方向所触碰到的所有Mesh，meshs[0]就是第一个被你鼠标接触到的物体。
