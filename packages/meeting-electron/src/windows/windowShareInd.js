'use strict'
/* global __static */

import { BrowserWindow } from 'electron'
import { WIN_SHARE_IND_HEIGHT, WIN_SHARE_IND_WIDTH, winBaseURL } from '../common'
import path from 'path'
import debug from 'electron-debug'

export default async function createWindowShareIndicator(bounds, type, id) {
  debug()
  let win = new BrowserWindow({
    x: bounds.x,
    y: bounds.y,
    width: WIN_SHARE_IND_WIDTH,
    height: WIN_SHARE_IND_HEIGHT,
    frame: false,
    useContentSize: true,
    resizable: false,
    show: false,
    alwaysOnTop: true,
    // transparent: true,
    skipTaskbar: process.platform === 'darwin',
    // parent: this.parentWin,
    webPreferences: {
      webSecurity: false,
      enableRemoteModule: true,
      nodeIntegrationInWorker: true,
      // Use pluginOptions.nodeIntegration, leave this alone
      // See nklayman.github.io/vue-cli-plugin-electron-builder/guide/security.html#node-integration for more info
      nodeIntegration: true,
      contextIsolation: false,
      preload: path.join(__dirname, './preload.js')
    },
    icon: path.join(__static, 'logo.png')
  })

  win.setMenu(null)
  win.loadURL(`${winBaseURL}#/winShareInd/${type}/${id}/`)

  win.on('close', (e) => {})
  win.on('closed', () => {
    win = null
  })
  win.once('ready-to-show', () => {
    win.show()
  })
  return win
}
