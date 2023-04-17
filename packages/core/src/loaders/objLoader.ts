import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader'

import { NOOP } from '@three-lib/utils/src'
import { loaderOptions } from '../types'
import { Group } from 'three'
import { LoadMaterials } from './mtlLoader'

export const LoadObjModel = async (path: string | string[], options?: loaderOptions): Promise<Group> => {
  const { manager, onProgress = NOOP as any } = options || {};
  const objLoader = manager ? new OBJLoader(manager) : new OBJLoader();
  
  const loadModel = (path: string) => {
    return new Promise<Group>((resolve, reject) => {
      objLoader.load(
        path,
         group => resolve(group),
         onProgress,
         error => reject(error)
      );
    });
  };
  
  if(typeof path === 'string') {
    return await loadModel(path);
  }
  
  const [materialsPath, modelPath] = path;
  const materials = await LoadMaterials(materialsPath, options);
  materials.preload();
  objLoader.setMaterials(materials);
  return await loadModel(modelPath);
};

