import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader'
import { NOOP } from '@three-lib/utils/src'
import { loaderOptions } from '../types'
import { Group } from 'three'

export const LoadFbxModel = (path: string, options?: loaderOptions): Promise<Group> => {
  const { manager, onProgress = NOOP as any } = options || {}
  const loader = manager ? new FBXLoader(manager) : new FBXLoader()
  return new Promise((resolve, reject) => {
    loader.load(
      path,
      function onLoad(group: Group) {
        resolve(group)
      },
      onProgress,
      function onError(err) {
        reject(err)
      }
    )
  })
}
