import * as THREE from "three";
import { CSS2DRenderer } from "three/examples/jsm/renderers/CSS2DRenderer"
import { CSS3DRenderer } from "three/examples/jsm/renderers/CSS3DRenderer"
import { Event } from "three"

export type threeSceneOptions =  {

  domElem?: HTMLElement; // 需要将three场景canvas插入的dom，如果没有，就默认插入元素父节点
  showGridHelper?: boolean; // 是否添加网格平面用于辅助显示
  showAxesHelper?: boolean; // 是否添加场景x、y、z的笛卡尔坐标轴用于辅助显示
  showFloor?: boolean; // 是显示地面平面，用于辅助显示
  showStats?: boolean; // 是否显示帧率和内存占用率
  enableRay?: boolean; // 启用射线查询
  devicePixelRatio?: number;
  renderParams?: THREE.WebGLRendererParameters
  render?: THREE.WebGLRenderer |  CSS2DRenderer | CSS3DRenderer
}

export type AnimationEvent = 'onRenderBefor' | 'onRenderAfter';
export type BaseEventType = 'onClickFind' | 'onMouseMoveFind' | 'onMouseMove' | 'onClick';

export interface dispatchEventType extends Event {
  type: AnimationEvent | BaseEventType,
  mesh?: THREE.Object3D | THREE.Mesh,
  meshs?: THREE.Intersection[]
}

