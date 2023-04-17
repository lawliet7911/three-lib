import { MTLLoader } from 'three/examples/jsm/loaders/MTLLoader'
import { NOOP } from '@three-lib/utils/src'
import { loaderOptions } from '../types'

export const LoadMaterials = (path: string, options?: loaderOptions): Promise<MTLLoader.MaterialCreator> => {
  const { manager, onProgress = NOOP as any } = options || {}
  const mtlLoader = manager ? new MTLLoader(manager) : new MTLLoader()
  return new Promise((resolve, reject) => {
    mtlLoader.load(
      path,
      function onLoad(materials: MTLLoader.MaterialCreator) {
        resolve(materials)
      },
      onProgress,
      function onError(err) {
        reject(err)
      }
    )
  })
}
