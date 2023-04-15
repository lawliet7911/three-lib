import { merge } from '@three-lib/utils/src'
import { AmbientLightOption, ThreeInstance, ThreeOptions } from './types'
import {
  AmbientLight,
  Camera,
  Color,
  ColorRepresentation,
  PerspectiveCamera,
  Renderer,
  Scene,
  WebGLRenderer,
} from 'three'

const defaultOption: ThreeOptions = {
  mode: 'prod',
  clearColor: 0xffffff,
  ambientLightOption: { show: false, color: 0xffffff, intensity: 0.8 },
  loaders: [],
  loading: false,
  antiAliasingType: {
    sampleLevel: 1,
    unbiased: true,
  },
}

export class ThreeJs {
  private container: HTMLElement
  private options: ThreeOptions
  public scene: Scene | null = null
  public camera: Camera | null = null
  public renderer: Renderer | null = null
  constructor(container: HTMLElement, options: ThreeOptions) {
    this.container = container
    if (!options.loaders.length) throw SyntaxError('loaders 不可为空')

    this.options = merge(defaultOption, options)

    init(this as unknown as ThreeInstance, container)

    initResizeListener(this as unknown as ThreeInstance)
  }

  render() {
    const r = () => {
      this.renderer?.render(this.scene!, this.camera!)
      requestAnimationFrame(r)
    }
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
  instance.camera = initCamera(container)
  instance.renderer = initRenderer(container, instance.options.clearColor!)
  instance.container.appendChild(instance.renderer.domElement)
}

const initScene = (color: number | string): Scene => {
  const scene = new Scene()
  scene.background = new Color(0xffffff)
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
    far: 2000,
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
  const renderer = new WebGLRenderer({ antialias: true })
  renderer.setClearColor(clearColor, 1.0)
  renderer.setSize(container.clientWidth, container.clientHeight)
  return renderer
}

/**
 * 初始化一个窗口resize监听器
 * @param instance three对象实例
 */
function initResizeListener(instance: ThreeInstance) {
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
