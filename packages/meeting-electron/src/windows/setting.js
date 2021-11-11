'use strict'
/* global __static */

import { BrowserWindow } from 'electron'
import { SETTINGS_WIN_INIT_HEIGHT, SETTINGS_WIN_INIT_WIDTH, winBaseURL } from '../common'
import debug from 'electron-debug'
import path from 'path'

export default async function createSettingWin() {
  debug()
  let win = new BrowserWindow({
    width: SETTINGS_WIN_INIT_WIDTH,
    height: SETTINGS_WIN_INIT_HEIGHT,
    frame: false,
    useContentSize: true,
    center: true,
    resizable: false,
    show: false,
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

  win.center()
  win.setMenu(null)
  win.loadURL(`${winBaseURL}#/setting`)

  win.on('close', (e) => {})
  win.on('closed', () => {
    win = null
  })
  win.once('ready-to-show', () => {
    win.show()
  })

  return win
}
