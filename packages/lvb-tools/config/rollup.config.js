import json from '@rollup/plugin-json'
import resolve from 'rollup-plugin-node-resolve'
import { getBabelOutputPlugin } from '@rollup/plugin-babel'
import commonjs from 'rollup-plugin-commonjs'
import copy from 'rollup-plugin-copy'
import nodeGlobals from 'rollup-plugin-node-globals'
import scss from 'rollup-plugin-scss'

const libraryName = 'lvbTools'
export default {
  input: 'index.js',
  output: {
    file: 'dist/index.js',
    name: libraryName,
    format: 'umd',
    globals: { jquery: 'jquery' }
  },
  watch: {
    exclude: 'node_modules/**'
  },
  external: ['jquery', '@jjldxz/rtm', 'wolfy87-eventemitter', 'uuid'],
  plugins: [
    resolve({
      preferBuiltins: true
    }),
    commonjs(),
    json(),
    getBabelOutputPlugin({
      allowAllFormats: true,
      // exclude: 'node_modules/**',
      presets: [
        [
          '@babel/preset-env',
          {
            debug: true,
            modules: false
          }
        ]
      ],
      plugins: [
        [
          '@babel/plugin-transform-runtime',
          {
            corejs: {
              version: 3,
              proposals: true
            },
            helpers: true,
            regenerator: true,
            useESModules: false
          }
        ],
        '@babel/plugin-syntax-dynamic-import'
      ]
    }),
    copy({
      targets: [{ src: 'package.json', dest: 'dist/' }],
      verbose: true,
      copyOnce: true
    }),
    nodeGlobals(),
    scss({
      output: false
    })
  ]
}
