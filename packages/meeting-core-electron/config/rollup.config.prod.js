import rollupBaseConf from './rollup.config'
import { terser } from 'rollup-plugin-terser'
import merge from 'lodash.merge'

process.env.NODE_ENV = 'production'
const prodConfig = {
  output: { sourcemap: false },
  plugins: [terser()]
}

const config = merge(rollupBaseConf, prodConfig)
export default config
