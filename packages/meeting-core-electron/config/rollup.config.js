import json from '@rollup/plugin-json'
import resolve from 'rollup-plugin-node-resolve'
import commonjs from 'rollup-plugin-commonjs'
import nodeGlobals from 'rollup-plugin-node-globals'
import envFiles from '@jjldxz/rollup-plugin-env-files'
import scss from 'rollup-plugin-scss'
import babel from 'rollup-plugin-babel'

const pkg = require('../package.json')
const libraryName = 'MeetingCore'

export default {
  input: 'src/index.js',
  output: { file: pkg.main, name: libraryName, format: 'umd' },
  watch: {
    exclude: 'node_modules/**'
  },
  external: ['agora-electron-sdk', 'protobufjs/minimal'],
  plugins: [
    json(),
    resolve(),
    commonjs(),
    babel({
      exclude: '**/node_modules/**', // 防止打包node_modules下的文件
      runtimeHelpers: true // 使plugin-transform-runtime生效
    }),
    nodeGlobals(),
    scss({
      output: false
    }),
    envFiles({ preventAssignment: true })
  ],
  globals: {
    jquery: 'jQuery'
  }
}
