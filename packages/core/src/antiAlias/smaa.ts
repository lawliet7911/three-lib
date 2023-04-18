import { SMAAPass } from 'three/examples/jsm/postprocessing/SMAAPass'
export const smaaPass = (): SMAAPass => {
  const effectFXAA = new SMAAPass(
    window.innerWidth * window.devicePixelRatio,
    window.innerHeight * window.devicePixelRatio
  )
  return effectFXAA
}
