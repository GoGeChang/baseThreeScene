# baseThreeScene
几行代码让你快速搭建一个three的3d场景。
# 使用
## 安装
npm i baseThreeScene
## 引入
```ts
import threeScene from "baseThreeScene";
```
# 使用
```ts
onMounted(() =>{
  const baseScene = new threeScene({
    domElem: threeContainer.value as HTMLElement // 绑定一个dom元素
  });
})
```

