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
}
/**
 * 生成基础场景和一些配置 
 */
class threeScene {
  /**
   * @param {THREE.WebGLRenderer} renderer webgl渲染器对象
   * @param {THREE.Scene | null} scene 场景对象
   * @param {THREE.AmbientLight} light 基础的环境光
   * @param {THREE.PerspectiveCamera} camera 透视相机，越远的物体越小
   * @param {THREE.control} OrbitControls 相机控制器
   * @param {HTMLElement}  domElem 生成的canvas DOM对象
   * @param {threeSceneOptions}  options 配置对象，用于额外的配置基础场景元素
   */
  renderer = new THREE.WebGLRenderer();
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
  control = <OrbitControls | null>null;
  animationId = <undefined | number>undefined;
  event = <EventDispatcher> new EventDispatcher();
  domElem = <HTMLElement | undefined>undefined;
  options: threeSceneOptions;
  stats: any;
  constructor(options: threeSceneOptions = defaultOptions) {
    this.options = options;
    this.light.position.set(30, 30, 30);
    this.camera.position.set(20, 20, 20);
    this.domElem = options.domElem;
    this.control = new OrbitControls(this.camera, this.renderer.domElement);
    this.width = this.getSceneSize()?.width as number;
    this.height = this.getSceneSize()?.height as number;

    this.scene.add(this.light);

    this.renderer.setSize(window.innerWidth, window.innerHeight);
    // 设置像素比
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;

    (this.domElem as HTMLElement).appendChild(this.renderer.domElement)

    // 场景自适应大小
    window.addEventListener("resize", this.onWindowResize.bind(this), false);

    this.initOptionElem();
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
      // 地板贴图
      let planTexutre = await new THREE.TextureLoader().loadAsync(
        "public/assets/texture/floor.jpg"
      );
      let planNormalMap = await new THREE.TextureLoader().loadAsync(
        "public/assets/normMap/floor/blue_floor_tiles_01_disp_4k.png"
      );

      const planGeo = new THREE.PlaneGeometry(100, 100, 100);
      const planMat = new THREE.MeshPhysicalMaterial({
        map: planTexutre,
        side: THREE.DoubleSide,
        normalMap: planNormalMap,
      });
      const floorPlan = new THREE.Mesh(planGeo, planMat);
      floorPlan.rotateX(Math.PI / 2);

      floorPlan.receiveShadow = true;

      this.scene.add(floorPlan);

      if (this.options.showStats) {
        // 开启statsUI
        let state = new Stats();
        state.dom.style.cssText = "position:absolute;left:12%;bottom:0px;z-index:9999;";
        document.body.appendChild(state.dom);
        this.stats = state;
      }
    }
  }
  onWindowResize() {
    this.width = this.getSceneSize()?.width as number;
    this.height = this.getSceneSize()?.height as number;
    this.camera.aspect = this.width /  this.height;
    this.renderer.setSize(this.width, this.height);
    this.camera.updateProjectionMatrix();
    this.renderer.setPixelRatio(window.devicePixelRatio);
  }
  animation() {
    this.event.dispatchEvent({type: 'onRenderBefor'})
    this.renderer.render(this.scene, this.camera);
    this.event.dispatchEvent({type: "onRenderAfter"})

    this.animationId = requestAnimationFrame(this.animation.bind(this));

    if(this.stats) this.stats.update();
  }

  getSceneSize() {
    return this.domElem?.getBoundingClientRect()
  }

  dispose() {
    cancelAnimationFrame(this.animationId as number);
    this.scene.children.forEach(childrenObj => {
      if(childrenObj.type === "Mesh") { 
        childrenObj.traverse(obj =>{
        
          let temoObj = obj as THREE.Mesh;
          let geometry: THREE.BufferGeometry = temoObj.geometry;
          let material = temoObj.material as THREE.Material;
  
          geometry.dispose();
          material.dispose();
          this.scene.remove(obj);
        })
      }
      
    })
    
    this.renderer.dispose();
  }

}

export default threeScene;
