const spawn = require('cross-spawn')

let target = process.argv[2]
const alias = {
  envFiles: '@jjldxz/rollup-plugin-env-files',
  lvbWeb: '@jjldxz/lvb-tools',
  meetingCore: '@jjldxz/meeting-core-electron',
  meeting: '@jjldxz/meeting-electron'
}
target = alias[target] || target

if (!target) {
  spawn('yarn', ['lerna', 'run', 'dev', '--stream'], {
    stdio: 'inherit'
  })
} else {
  spawn('yarn', ['lerna', 'run', 'dev', '--scope', target, '--stream'], {
    stdio: 'inherit'
  })
}
