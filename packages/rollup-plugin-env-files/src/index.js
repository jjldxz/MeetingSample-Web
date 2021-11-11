import MagicString from 'magic-string'
import { createFilter } from '@rollup/pluginutils'
import path from 'path'
import dotenv from 'dotenv'
import dotenvExpand from 'dotenv-expand'

function escape(str) {
  return str.replace(/[-[\]/{}()*+?.\\^$|]/g, '\\$&')
}

function ensureFunction(functionOrValue) {
  if (typeof functionOrValue === 'function') return functionOrValue
  return () => functionOrValue
}

function longest(a, b) {
  return b.length - a.length
}

function mapToFunctions(object) {
  return Object.keys(object).reduce((fns, key) => {
    const functions = Object.assign({}, fns)
    functions[key] = ensureFunction(object[key])
    return functions
  }, {})
}

function loadEnv(mode) {
  const basePath = path.resolve(`.env${mode ? `.${mode}` : ``}`)
  const localPath = `${basePath}.local`

  const load = (envPath) => {
    try {
      const env = dotenv.config({ path: envPath, debug: process.env.DEBUG })
      dotenvExpand(env)
    } catch (err) {
      // only ignore error if file is not found
      if (err.toString().indexOf('ENOENT') < 0) {
        console.error(err)
      }
    }
  }

  load(localPath)
  load(basePath)

  // by default, NODE_ENV and BABEL_ENV are set to "development" unless mode
  // is production or test. However the value in .env files will take higher
  // priority.
  if (mode) {
    // always set NODE_ENV during tests
    // as that is necessary for tests to not be affected by each other
    const defaultNodeEnv = mode === 'production' || mode === 'test' ? mode : 'development'
    if (process.env.NODE_ENV == null) {
      process.env.NODE_ENV = defaultNodeEnv
    }
    if (process.env.BABEL_ENV == null) {
      process.env.BABEL_ENV = defaultNodeEnv
    }
  }
}

function getReplacementEnvs() {
  let env = {}
  Object.keys(process.env).map((key) => {
    env[`process.env.${key}`] = JSON.stringify(process.env[key])
  })
  return env
}

// load env files
if (process.env.NODE_ENV) {
  loadEnv(process.env.NODE_ENV)
}
loadEnv()

export default function envFiles(options = {}) {
  const filter = createFilter(options.include, options.exclude)
  const { delimiters, preventAssignment } = options
  const functionValues = mapToFunctions(getReplacementEnvs())
  const keys = Object.keys(functionValues).sort(longest).map(escape)
  const lookahead = preventAssignment ? '(?!\\s*=[^=])' : ''
  const pattern = delimiters
    ? new RegExp(
        `${escape(delimiters[0])}(${keys.join('|')})${escape(delimiters[1])}${lookahead}`,
        'g'
      )
    : new RegExp(`\\b(${keys.join('|')})\\b(?!\\.)${lookahead}`, 'g')

  return {
    name: 'env-files',

    buildStart() {
      if (![true, false].includes(preventAssignment)) {
        this.warn({
          message:
            "@jjldxz/rollup-plugin-env-files: 'preventAssignment' currently defaults to false. It is recommended to set this option to `true`, as the next major version will default this option to `true`."
        })
      }
    },

    renderChunk(code, chunk) {
      const id = chunk.fileName
      if (!keys.length) return null
      if (!filter(id)) return null
      return executeReplacement(code, id)
    },

    transform(code, id) {
      if (!keys.length) return null
      if (!filter(id)) return null
      return executeReplacement(code, id)
    }
  }

  function executeReplacement(code, id) {
    const magicString = new MagicString(code)
    if (!codeHasReplacements(code, id, magicString)) {
      return null
    }

    const result = { code: magicString.toString() }
    if (isSourceMapEnabled()) {
      result.map = magicString.generateMap({ hires: true })
    }
    return result
  }

  function codeHasReplacements(code, id, magicString) {
    let result = false
    let match

    // eslint-disable-next-line no-cond-assign
    while ((match = pattern.exec(code))) {
      result = true

      const start = match.index
      const end = start + match[0].length
      const replacement = String(functionValues[match[1]](id))
      magicString.overwrite(start, end, replacement)
    }
    return result
  }

  function isSourceMapEnabled() {
    return options.sourceMap !== false && options.sourcemap !== false
  }
}
