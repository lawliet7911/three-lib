import { merge } from '@three-lib/utils/src'
import { AmbientLightOption, ThreeInstance, ThreeOptions } from './types'
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer'
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass'

import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import {
  AmbientLight,
  AxesHelper,
  Camera,
  Color,
  ColorRepresentation,
  GridHelper,
  Material,
  PerspectiveCamera,
  Renderer,
  Scene,
  WebGLRenderer,
} from 'three'
import Stats from 'stats.js'
import { createAntiAlias } from './antiAlias/index'
const enum MODE {
  DEV = 'dev',
  PROD = 'prod',
}

const defaultOption: ThreeOptions = {
  mode: 'prod',
  clearColor: 0xffffff,
  ambientLightOption: { show: false, color: 0xffffff, intensity: 0.8 },
  loaders: [],
  loading: false,
  antiAlias: {
    type: 'fxaa',
    sampleLevel: 1,
    unbiased: true,
  },
}

export class ThreeJs {
  private container: HTMLElement
  private options: ThreeOptions
  private stats: Stats | null = null
  public scene: Scene | null = null
  public camera: Camera | null = null
  public renderer: Renderer | null = null
  public animates: Function[] = []
  public composer: EffectComposer | null = null
  constructor(container: HTMLElement, options: ThreeOptions) {
    this.container = container

    if (options?.loaders && options.loaders?.length) throw SyntaxError('loaders 不可为空')

    this.options = merge(defaultOption, options)

    init(this as unknown as ThreeInstance, container)

    initResizeListener(this as unknown as ThreeInstance)
  }

  render() {
    const loop = () => {
      this.renderer?.render(this.scene!, this.camera!)
      if (this.options.mode === MODE.DEV) {
        this.stats!.update()
      }
      if (this.composer) {
        this.composer.render()
      }
      // animate queue
      this.animates.forEach((fn) => {
        if (typeof fn !== 'function') return
        fn()
      })
      requestAnimationFrame(loop)
    }
    loop()
  }
}
/**
 * 初始化场景、相机、渲染器，将渲染器的canvas放入container
 * @param instance three实例
 * @param container DOM容器
 */
const init = (instance: ThreeInstance, container: HTMLElement) => {
  instance.scene = initScene(instance.options.clearColor!)

  // 全局光照是否开启
  if (instance.options?.ambientLightOption?.show) {
    instance.ambientLight = initAmbientLight(instance.options.ambientLightOption)
    instance.scene.add(instance.ambientLight)
  }
  // 相机
  instance.camera = initCamera(container)
  // 渲染器
  instance.renderer = initRenderer(container, instance.options.clearColor!)
  // 添加到dom容器
  instance.container.appendChild(instance.renderer.domElement)
  // 控制
  instance.controls = initDefaultControl(instance)
  // 渲染通道
  instance.composer = initEffectComposer(instance)
  // AA （antiAlias 抗锯齿）
  instance.antiAlias = setAntiAlias(instance)

  // dev模式控制
  if (instance.options.mode === MODE.DEV) {
    instance.stats = initStats(container)
    initAxisHelper(instance)
    initGridHelper(instance)
  }
}

const initScene = (color: number): Scene => {
  const scene = new Scene()
  scene.background = new Color(color)
  return scene
}

const initAmbientLight = ({ color, intensity }: AmbientLightOption) => {
  return new AmbientLight(color, intensity)
}

const initCamera = (
  container: HTMLElement,
  cameraParams = {
    fov: 70,
    near: 0.1,
    far: 10000,
    position: { x: 10, y: 40, z: 50 },
  }
): Camera => {
  const { fov, near, far, position } = cameraParams
  const { x, y, z } = position
  const camera = new PerspectiveCamera(fov, container.clientWidth / container.clientHeight, near, far) // fov  比例  near far
  camera.position.z = z
  camera.position.y = y
  camera.position.x = x
  return camera
}
/**
 * 初始化渲染器，设置背景色
 * @param container Dom容器
 * @param clearColor 背景色
 * @returns
 */
const initRenderer = (container: HTMLElement, clearColor: ColorRepresentation): Renderer => {
  // alpha 半透明通道（rgba的a）
  const renderer = new WebGLRenderer({ antialias: true, alpha: true, precision: 'highp'})
  renderer.setClearColor(clearColor, 1)
  renderer.setPixelRatio(window.devicePixelRatio)
  renderer.setSize(container.clientWidth, container.clientHeight)
  return renderer
}

/**
 * 初始化一个窗口resize监听器
 * @param instance three对象实例
 */
const initResizeListener = (instance: ThreeInstance) => {
  window.addEventListener('resize', () => {
    instance.camera.aspect = window.innerWidth / window.innerHeight
    instance.camera.updateProjectionMatrix()
    instance.renderer!.setSize(window.innerWidth, window.innerHeight)
    instance.composer?.setSize(window.innerWidth, window.innerHeight)

    if (instance.effectSobel) {
      instance.effectSobel.uniforms['resolution'].value.x = window.innerWidth * window.devicePixelRatio
      instance.effectSobel.uniforms['resolution'].value.y = window.innerHeight * window.devicePixelRatio
    }
  })
}

const initEffectComposer = (instance: ThreeInstance): EffectComposer => {
  const composer = new EffectComposer(instance.renderer as WebGLRenderer)
  const renderPass = new RenderPass(instance.scene!, instance.camera)
  composer.addPass(renderPass)
  return composer
}

/**
 * 初始化AA抗锯齿
 * @param instance three实例
 */
export const setAntiAlias = (instance: ThreeInstance) => {
  if(!instance.options.antiAlias) return
  const { type } = instance.options.antiAlias
  // todo aa问题 导致mac灰色横线，windows下没有
  instance.antiAlias = createAntiAlias(type)
  instance.composer.addPass(instance.antiAlias)
  if (instance.options.mode === MODE.DEV) {
    console.info(`${type}-设置成功`)
  }
}

const initDefaultControl = (instance: ThreeInstance): OrbitControls =>
  new OrbitControls(instance.camera, instance.renderer!.domElement)

/**
 * 初始化fps面板 坐标轴
 * @param container 容器
 * @returns Stats
 */
const initStats = (container: HTMLElement): Stats => {
  const stats = new Stats()
  // 将性能监控屏区显示在左上角
  stats.dom.style.position = 'absolute'
  stats.dom.style.bottom = '0px'
  stats.dom.style.zIndex = '100'
  container.appendChild(stats.dom)
  return stats
}

/**
 * 创建坐标系
 * @param instance three实例
 */
const initAxisHelper = (instance: ThreeInstance): void => {
  const axesHelper = new AxesHelper(100)
  instance.scene!.add(axesHelper)
}

/**
 * 创建坐标网格
 * @param instance three实例
 */
const initGridHelper = (instance: ThreeInstance): void => {
  const grid = new GridHelper(1000, 10, 0xffffff, 0xffffff)

  const setMaterialProperties = (material: Material): void => {
    material.opacity = 0.5
    material.depthWrite = false
    material.transparent = true
  }

  if (Array.isArray(grid.material)) {
    // 判断是否为数组
    grid.material.forEach(setMaterialProperties)
  } else {
    // 如果不是数组，说明只有一个材质对象
    setMaterialProperties(grid.material)
  }
  instance.scene!.add(grid)
}
