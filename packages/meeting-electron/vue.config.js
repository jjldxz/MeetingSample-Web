const path = require('path')

function resolve(dir) {
  return path.join(__dirname, dir)
}

module.exports = {
  devServer: {
    overlay: {
      warnings: false,
      errors: true
    },
    disableHostCheck: true
  },
  lintOnSave: process.env.NODE_ENV !== 'production',
  css: {
    loaderOptions: {
      sass: {
        implementation: require('sass') // This line must in sass option
      }
    }
  },
  transpileDependencies: ['vuetify'],
  chainWebpack: (config) => {
    config.resolve.alias.set('@', resolve('src')).set('assets', resolve('src/assets'))
  },
  pluginOptions: {
    electronBuilder: {
      // List native deps here if they don't work
      // externals: ['my-native-dep'],

      // If you are using Yarn Workspaces, you may have multiple node_modules folders
      // List them all here so that VCP Electron Builder can find them
      nodeIntegration: true,
      externals: ['agora-electron-sdk'],
      preload: 'src/preload.js',
      chainWebpackRendererProcess: (config) => {
        // Chain webpack config for electron renderer process only (won't be applied to web builds)
        config.set('externals', {
          'agora-electron-sdk': 'commonjs2 agora-electron-sdk'
          // "robotjs": "commonjs2 robotjs"
        })
      },
      nodeModulesPath: ['../../node_modules', './node_modules'],
      builderOptions: {
        productName: 'XzMeeting',
        copyright: 'Copyright©2028JJLDxz',
        appId: 'com.jjldxz.meeting',
        compression: 'store',
        npmRebuild: false,
        artifactName: '${productName}-${os}-${arch}.${ext}',
        files: ['**/*', 'node_modules/**/*', '../../node_modules/**/*'],
        extraResources: [
          {
            from: './public/media',
            to: './media'
          }
        ],
        asar: {
          smartUnpack: true
        },
        dmg: {
          title: 'XzMeeting',
          contents: [
            {
              x: 410,
              y: 150,
              type: 'link',
              path: '/Applications'
            },
            {
              x: 130,
              y: 150,
              type: 'file'
            }
          ]
        },
        mac: {
          target: ['dmg', 'zip'],
          icon: 'public/logo.png',
          entitlements: 'config/entitlements.mac.plist',
          entitlementsInherit: 'config/entitlements.mac.plist',
          category: 'com.jjldxz.meeting',
          hardenedRuntime: false,
          extendInfo: {
            NSMicrophoneUsageDescription:
              'JJLDxz Meeting acquire your microphone permission',
            NSCameraUsageDescription: 'JJLDxz Meeting acquire your camera permission',
            CFBundleURLTypes: [
              {
                CFBundleTypeRole: 'Meeting',
                CFBundleURLName: 'com.jjldxz.meeting',
                CFBundleURLSchemes: ['xzmeeting']
              }
            ]
          }
        },
        win: {
          icon: 'public/logo.png',
          target: [
            {
              target: 'nsis',
              arch: ['x64']
            }
          ]
        },
        linux: {
          // icon: "build/icons",
          icon: 'public/logo.png',
          target: ['deb', 'rpm', 'snap', 'AppImage'],
          category: 'Utility'
        },
        nsis: {
          oneClick: false,
          allowElevation: true,
          perMachine: true,
          allowToChangeInstallationDirectory: true,
          createDesktopShortcut: true,
          createStartMenuShortcut: true,
          shortcutName: 'DxzMeeting',
          artifactName: '${productName}-${os}-${arch}-setup.${ext}',
          include: 'config/installer.nsh'
        },
        electronDownload: {
          mirror: 'https://npm.taobao.org/mirrors/electron/'
        },
        publish: [
          {
            provider: 'generic',
            url: ''
          }
        ]
      }
    }
  }
}
