import { SSAARenderPass } from 'three/examples/jsm/postprocessing/SSAARenderPass'
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass'
import { CopyShader } from 'three/examples/jsm/shaders/CopyShader'
import { ThreeInstance } from '../types'
export const ssaaPass = (instance: ThreeInstance) => {
  const effectSSAA = new SSAARenderPass(instance.scene!, instance.camera!)
  effectSSAA.enabled = true
  const copyPass = new ShaderPass(CopyShader)
  copyPass.enabled = true
  return { effectSSAA, copyPass }
}
