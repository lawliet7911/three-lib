import { fxaaPass } from './fxaa'
import { smaaPass } from './smaa'
import { ssaaPass } from './ssaa'
import { taaPass } from './taa'

const createAntiAlias = (type: string, options?: any) => {
  type = type.toLowerCase()
  switch (type) {
    case 'fxaa':
      return fxaaPass()
    case 'smaa':
      return smaaPass()
    case 'ssaa':
      return ssaaPass(options)
    case 'taa':
      return taaPass(options)
  }
}

export { createAntiAlias, fxaaPass }
