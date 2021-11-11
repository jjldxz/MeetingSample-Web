'use strict'
/* global __static */

import { BrowserWindow } from 'electron'
import { createProtocol } from 'vue-cli-plugin-electron-builder/lib'
import { MAIN_WIN_INIT_HEIGHT, MAIN_WIN_INIT_WIDTH, winBaseURL } from '../common'
import path from 'path'
import debug from 'electron-debug'

export default async function createMainWin() {
  debug()
  let win = new BrowserWindow({
    width: MAIN_WIN_INIT_WIDTH,
    height: MAIN_WIN_INIT_HEIGHT,
    frame: false,
    useContentSize: true,
    center: true,
    resizable: false,
    show: false,
    alwaysOnTop: false,
    webPreferences: {
      webSecurity: false,
      enableRemoteModule: true,
      nodeIntegrationInWorker: true,
      contextIsolation: false,
      nodeIntegration: true,
      preload: path.join(__dirname, './preload.js')
    },
    icon: path.join(__static, 'logo.png')
  })
  win.center()
  if (process.env.WEBPACK_DEV_SERVER_URL) {
    win.loadURL(winBaseURL)
  } else {
    createProtocol('app')
    win.loadURL(winBaseURL)
  }
  win.setMenu(null)
  win.on('close', (e) => {})
  win.on('closed', () => {
    win = null
  })
  win.once('ready-to-show', () => {
    win.show()
  })
  win.on('resize', () => {})
  win.on('restore', () => {
    console.log('main restore')
  })
  return win
}
