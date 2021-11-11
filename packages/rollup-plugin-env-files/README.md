# @jjldxz/rollup-plugin-env-files
A Rollup plugin which parse env files and replaces env strings in files while bundling.

## Install
```shell
yarn workspace [worksapce name] add @jjldx/rollup-plugin-env-files@1.0.0 -D
```

## Usage
Create a .env file in the root directory of your project. Add environment-specific variables on new lines in the form of NAME=VALUE. For example:
```dotenv
ENV_TEST=envTest
```
Create a rollup.config.js configuration file and import the plugin:
```javascript
import envFiles from '@jjldxz/rollup-plugin-env-files'

export default {
  input: 'src/index.js',
  output: {
    dir: 'output',
    format: 'cjs'
  },
  plugins: [
    envFiles()
  ]
}
```
process.env now has the keys and values you defined in your .env file.


