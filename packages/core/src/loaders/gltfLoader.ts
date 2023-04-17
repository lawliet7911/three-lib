import { GLTF, GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { NOOP } from '@three-lib/utils/src'
import { loaderOptions } from '../types'

export const LoadGlftModel = (path: string, options?: loaderOptions) => {
  const { manager, onProgress = NOOP as any } = options || {}
  const loader = manager ? new GLTFLoader(manager) : new GLTFLoader()
  return new Promise((resolve, reject) => {
    loader.load(
      path,
      function onLoad(gltf: GLTF) {
        resolve(gltf)
      },
      onProgress,
      function onError(err) {
        reject(err)
      }
    )
  })
}