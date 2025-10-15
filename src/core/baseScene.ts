import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import Stats from "three/examples/jsm/libs/stats.module.js";
import { type ThreeSceneOptions } from "../types/threeScene";
import { TypedEventBus, ThreeSceneEvent } from "../types/threeScene";
const defaultOptions: ThreeSceneOptions = {
  showGridHelper: false,
  showAxesHelper: false,
  showFloor: true,
  showStats: false,
  enableRay: false,
  devicePixelRatio: 1,
};
/**
 * 生成基础场景和一些配置
 */
export default class ThreeScene {
  // 强类型事件总线
  private readonly bus = new TypedEventBus<ThreeSceneEvent>();
  addEventListener<K extends ThreeSceneEvent["type"]>(
    type: K,
    listener: (event: Extract<ThreeSceneEvent, { type: K }>) => void
  ) {
    this.bus.addEventListener(type, listener);
  }
  removeEventListener<K extends ThreeSceneEvent["type"]>(
    type: K,
    listener: (event: Extract<ThreeSceneEvent, { type: K }>) => void
  ) {
    this.bus.removeEventListener(type, listener);
  }
  protected emit(event: ThreeSceneEvent) {
    this.bus.dispatchEvent(event);
  }

  renderer: THREE.WebGLRenderer;
  scene = new THREE.Scene();
  light = new THREE.AmbientLight();
  width = 0;
  height = 0;
  camera = new THREE.PerspectiveCamera(
    45,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );
  enabelRay = false;
  // 创建射线
  raycaster = {
    ray: new THREE.Raycaster(),
    mouse: new THREE.Vector2(),
    rayObject3D: this.scene.children,
  };

  // 在鼠标移动中根据鼠标位置查询物体
  control = <OrbitControls | null>null;
  animationId = <undefined | number>undefined;
  domElem = <HTMLElement | undefined>undefined;
  options: ThreeSceneOptions;
  stats: any;
  stopAnimation = false;
  constructor(options: ThreeSceneOptions = defaultOptions) {
    this.options = options;
    this.enabelRay = options.enableRay;

    this.renderer = new THREE.WebGLRenderer(options.renderParams);

    this.light.position.set(30, 30, 30);
    this.camera.position.set(20, 20, 20);
    this.domElem = options.domElem;
    this.control = new OrbitControls(this.camera, this.renderer.domElement);
    let { width, height } = this.getSceneSize();
    this.width = width;
    this.height = height;

    this.scene.add(this.light);

    this.renderer.domElement.width = this.width;
    this.renderer.domElement.height = this.height;

    this.renderer.setSize(this.width, this.height);
    this.renderer.setPixelRatio(
      options.devicePixelRatio || window.devicePixelRatio
    );
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;

    (this.domElem as HTMLElement).appendChild(this.renderer.domElement);

    // 场景自适应大小
    window.addEventListener("resize", this.onWindowResize.bind(this), false);

    this.onWindowResize();

    this.initOptionElem();
    this.domElem.addEventListener(
      "mousemove",
      this.onMouseMove.bind(this),
      false
    );
    this.domElem.addEventListener("click", this.onClick.bind(this), false);
    document.addEventListener("fullscreenchange", () => {
      if (this.renderer && this.domElem) {
        const { clientWidth, clientHeight } = this.domElem;
        this.renderer.setSize(clientWidth, clientHeight);
        if (this.camera) {
          this.camera.aspect = clientWidth / clientHeight;
          this.camera.updateProjectionMatrix();
        }
      }
    });

    // 开始动画
    this.animation();
  }
  private async initOptionElem() {
    // 添加辅助网格底盘
    if (this.options.showGridHelper) {
      let tempGrid = new THREE.GridHelper(50, 25);
      tempGrid.position.y += 0.5;
      this.scene.add(tempGrid);
    }
    // 添加xyz三色辅助线
    if (this.options.showAxesHelper) {
      let tempAxes = new THREE.AxesHelper(100);
      this.scene.add(tempAxes);
    }

    if (this.options.showFloor) {
      const planGeo = new THREE.PlaneGeometry(100, 100, 100);
      const planMat = new THREE.MeshPhysicalMaterial({
        side: THREE.DoubleSide,
        color: "#fff",
      });
      const floorPlan = new THREE.Mesh(planGeo, planMat);

      floorPlan.castShadow = true;
      floorPlan.receiveShadow = true;

      floorPlan.rotateX(Math.PI / 2);

      this.scene.add(floorPlan);

      if (this.options.showStats) {
        // 开启statsUI
        let state = new Stats();
        state.dom.style.cssText =
          "position:absolute;left:12%;bottom:0px;z-index:9999;";
        document.body.appendChild(state.dom);
        this.stats = state;
      }
    }
  }
  private onWindowResize() {
    let { width, height } = this.getSceneSize();
    this.width = width;
    this.height = height;
    this.camera.aspect = width / height;
    this.renderer.setSize(width, height);
    this.camera.updateProjectionMatrix();
    this.renderer.setPixelRatio(
      this.options.devicePixelRatio || window.devicePixelRatio
    );
  }
  private onMouseMove(e: MouseEvent) {
    if (this.stopAnimation) return;
    let { left, top, width, height } =
      this.renderer.domElement.getBoundingClientRect();
    this.raycaster.mouse.x = ((e.clientX - left) / width) * 2 - 1;
    this.raycaster.mouse.y = -((e.clientY - top) / height) * 2 + 1;
    this.raycaster.ray.setFromCamera(this.raycaster.mouse, this.camera);
    if (this.options.enableRay) {
      let meshs = this.raycaster.ray.intersectObjects(
        this.scene.children,
        false
      );
      if (meshs.length) {
        this.emit({
          type: "onMouseMoveFind",
          meshs,
        });
      }
    }
  }
  private onClick(e: MouseEvent) {
    if (this.stopAnimation) return;
    let meshs = this.raycaster.ray.intersectObjects(this.scene.children, false);

    this.emit({ type: "onClick", meshs });
    if (this.options.enableRay) {
      this.raycaster.ray.setFromCamera(this.raycaster.mouse, this.camera);
      let meshs = this.raycaster.ray.intersectObjects(this.scene.children);
      this.emit({ type: "onClickFind", meshs });
    } else {
      console.warn("请配置options中enableRay为true");
    }
  }
  private animation() {
    if (!this.stopAnimation) {
      this.emit({ type: "onRenderBefor" });
      this.renderer.render(this.scene, this.camera);
      this.emit({ type: "onRenderAfter" });
    }
    this.animationId = requestAnimationFrame(this.animation.bind(this));

    if (this.stats) this.stats.update();
  }

  public getSceneSize() {
    return this.domElem?.getBoundingClientRect();
  }

  public dispose() {
    cancelAnimationFrame(this.animationId as number);
    this.scene.children.forEach((childrenObj) => {
      if (childrenObj.type === "Mesh") {
        childrenObj.traverse((obj) => {
          let temoObj = obj as THREE.Mesh;
          let geometry: THREE.BufferGeometry = temoObj.geometry;
          let material = temoObj.material as THREE.Material;

          geometry.dispose();
          material.dispose();
          this.scene.remove(obj);
        });
      }
    });
    this.control.dispose();
    this.renderer.dispose();
  }
}
