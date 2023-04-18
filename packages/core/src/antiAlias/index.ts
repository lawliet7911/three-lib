import { fxaaPass } from './fxaa'
import { smaaPass } from './smaa'

const createAntiAlias = (type: string) => {
  type = type.toLowerCase()
  switch (type) {
    case 'fxaa':
      return fxaaPass()
    case 'smaa':
      return smaaPass()
  }
}

export { createAntiAlias, fxaaPass }
