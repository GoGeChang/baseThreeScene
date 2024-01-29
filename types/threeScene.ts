export type threeSceneOptions =  {
  /**
 * @param {HTMLElement} domElem 需要将three场景canvas插入的dom，如果没有，就默认插入body节点
 * @param {boolean} showGridHelper 是否添加网格平面用于辅助显示
 * @param {boolean} showAxesHelper 是否添加场景x、y、z的笛卡尔坐标轴用于辅助显示
 * @param {boolean} showFloor 是显示地面平面，用于辅助显示
 * @param {boolean} showStats 是否显示帧率和内存占用率
 * @param {boolean} showStats 是否显示帧率和内存占用率
 */

  domElem?: HTMLElement;
  showGridHelper?: boolean;
  showAxesHelper?: boolean;
  showFloor?: boolean;
  showStats?: boolean;
  enableRay?: boolean;
  enableMouseMove?: boolean;
  enableClick?: boolean;
}