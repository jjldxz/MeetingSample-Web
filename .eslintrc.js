module.exports = {
  root: true,
  env: {
    browser: true,
    node: true
  },
  // parser: 'babel-eslint',
  // parser: 'vue-eslint-parser',
  extends: ['plugin:vue/recommended', 'plugin:prettier/recommended'],
  plugins: ['vue'],
  parserOptions: {
    parser: 'babel-eslint',
    ecmaVersion: 7,
    sourceType: 'module'
  },
  // add your custom rules here
  rules: {
    'no-console': 0,
    'generator-star-spacing': 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'vue/no-v-html': 'off',
    'vue/singleline-html-element-content-newline': 'off',
    'vue/html-self-closing': [
      'error',
      {
        html: {
          void: 'always',
          normal: 'always',
          component: 'always'
        }
      }
    ],
    'vue/max-attributes-per-line': [
      'error',
      {
        singleline: {
          max: 4,
          allowFirstLine: true
        },
        multiline: {
          max: 1,
          allowFirstLine: false
        }
      }
    ],
    'vue/require-default-prop': 'off',
    'vue/html-closing-bracket-spacing': 'error'
  }
}
