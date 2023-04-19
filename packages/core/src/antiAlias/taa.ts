import { TAARenderPass } from 'three/examples/jsm/postprocessing/TAARenderPass'
export const taaPass = (options: any): TAARenderPass => {
  const effectTAA = new TAARenderPass(options.scene!, options.camera!, options.clearColor, options.clearAlpha)
  effectTAA.unbiased = options.unbiased
  effectTAA.sampleLevel = options.sampleLevel
  effectTAA.enabled = true
  return effectTAA
}
