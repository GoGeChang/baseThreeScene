import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import Stats from "three/examples/jsm/libs/stats.module.js";
import { EventDispatcher } from "three";
import { threeSceneOptions } from "types/threeScene";

const defaultOptions: threeSceneOptions = {
  showGridHelper: false,
  showAxesHelper: false,
  showFloor: true,
  showStats: false,
  enableRay: false,
  enableClick: false,
  enableMouseMove: false,
  devicePixelRatio: 1,
};
/**
 * 生成基础场景和一些配置
 */
class threeScene extends EventDispatcher {
  /**
   * @param {THREE.WebGLRenderer} renderer webgl渲染器对象
   * @param {THREE.Scene | null} scene 场景对象
   * @param {THREE.AmbientLight} light 基础的环境光
   * @param {THREE.PerspectiveCamera} camera 透视相机，越远的物体越小
   * @param {THREE.control} OrbitControls 相机控制器
   * @param {HTMLElement}  domElem 生成的canvas DOM对象
   * @param {threeSceneOptions}  options 配置对象，用于额外的配置基础场景元素
   */
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
  event = <EventDispatcher>new EventDispatcher();
  domElem = <HTMLElement | undefined>undefined;
  options: threeSceneOptions;
  stats: any;
  constructor(options: threeSceneOptions = defaultOptions) {
    super();
    let { width, height } = this.getSceneSize();
    this.options = options;
    this.enabelRay = options.enableRay;

    this.renderer = new THREE.WebGLRenderer(options.renderParams);

    this.light.position.set(30, 30, 30);
    this.camera.position.set(20, 20, 20);
    this.domElem = options.domElem;
    this.control = new OrbitControls(this.camera, this.renderer.domElement);
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
    // 开始动画
    this.animation();
  }
  async initOptionElem() {
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
  onWindowResize() {
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
  onMouseMove(e: MouseEvent) {
    let { left, top } = this.getSceneSize();
    this.raycaster.mouse.x = ((e.clientX - left) / this.width) * 2 - 1;
    this.raycaster.mouse.y = -((e.clientY - top) / this.height) * 2 + 1;
    this.raycaster.ray.setFromCamera(this.raycaster.mouse, this.camera);
    if (this.options.enableRay && this.options.enableMouseMove) {
      let meshs = this.raycaster.ray.intersectObjects(
        this.scene.children,
        false
      );

      if (meshs.length) {
        // @ts-ignore
        this.dispatchEvent({ type: "onMouseMoveFind", meshs });
      }
    }
  }
  onClick(e: MouseEvent) {
    if (this.options.enableClick) {
      // @ts-ignore
      this.dispatchEvent({ type: "onClick", meshs });
      if (this.options.enableRay) {
        this.raycaster.ray.setFromCamera(this.raycaster.mouse, this.camera);
        let meshs = this.raycaster.ray.intersectObjects(this.scene.children);
        // @ts-ignore
        this.dispatchEvent({ type: "onClickFind", meshs });
      }
    }
  }
  animation() {
    // @ts-ignore
    this.dispatchEvent({ type: "onRenderBefor" });
    this.renderer.render(this.scene, this.camera);
    // @ts-ignore
    this.dispatchEvent({ type: "onRenderAfter" });

    this.animationId = requestAnimationFrame(this.animation.bind(this));

    if (this.stats) this.stats.update();
  }

  getSceneSize() {
    return this.domElem?.getBoundingClientRect();
  }

  dispose() {
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
export default threeScene;
