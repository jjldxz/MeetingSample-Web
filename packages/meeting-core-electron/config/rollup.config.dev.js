import merge from 'lodash.merge'
import rollupBaseConf from './rollup.config'

process.env.NODE_ENV = 'development'
const devConfig = {
  output: { sourcemap: true }
}

const config = merge(rollupBaseConf, devConfig)
export default config
