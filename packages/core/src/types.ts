import { AmbientLight, Camera, Renderer, Scene } from 'three'

export type LoadersArray = Array<'fbx' | 'gltf' | 'obj'>
/**
 * 2的幂次方，最大值为16
 */
type PowerOfTwo = 0 | 1 | 2 | 4 | 8 | 16

type AntiALiasConfig = {
  /**
   * 抗锯齿采样级别,只能为2的幂次方,最大为16 eg.(0,1,2,4,8,16)
   */
  sampleLevel: PowerOfTwo
  /**
   * 采样偏差-设置为`true`进行无偏采样，即每个像素的每个采样点都会进行相同的计算，不会出现偏差。这种设置可以提高抗锯齿的效果，但需要更多的计算资源。
   */
  unbiased: boolean
}

export type AmbientLightOption = {
  /**
   * 是否开启全局光照
   */
  show: boolean
  /**
   * 颜色值- 16进制数字 `0xffffff` 默认
   */
  color: number
  /**
   * 全局光照强度 0 - 1 之间
   */
  intensity: number
}

export type ThreeOptions = {
  /**
   * 当前模式
   * `dev` 显示fps等信息
   * `prod` 无信息显示
   */
  mode?: 'dev' | 'prod'
  /**
   * 背景色 - 16进制数字 `0xffffff` 默认
   */
  clearColor?: number
  /**
   * 全局光照配置
   */
  ambientLightOption?: AmbientLightOption
  /**
   * 需要使用的loader加载器
   */
  loaders: LoadersArray
  loading?: boolean
  antiAliasingType?: AntiALiasConfig
}

export type ThreeInstance = {
  container: HTMLElement
  options: ThreeOptions
  scene: Scene | null
  camera: any // todo 明确类型
  renderer: Renderer | null
  ambientLight: AmbientLight | null
  effectSobel?: any
}