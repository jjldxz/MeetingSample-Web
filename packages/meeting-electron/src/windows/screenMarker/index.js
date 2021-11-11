'use strict'
/* global __static */

import { BrowserWindow } from 'electron'
import debug from 'electron-debug'
import { IPCEvents, winBaseURL } from '../../common'
import path from 'path'
import createScreenMarkerTopBar from './topBar'

export default function createScreenMarker(bounds) {
  debug()
  let barWin,
    ignoreMouseEvent = null

  const resetAlwaysOnTop = () => {
    win.setAlwaysOnTop(false)
    win.setAlwaysOnTop(true, 'screen-saver')
  }

  const setIgnoreMouseEvents = (ignore) => {
    if (!win || ignoreMouseEvent === ignore) return
    if (ignore) {
      win.setIgnoreMouseEvents(ignore, { forward: true })
      resetAlwaysOnTop()
    } else {
      win.setIgnoreMouseEvents(ignore)
    }
    ignoreMouseEvent = ignore
  }

  const sendEventToBarWebContents = (event, value) => {
    barWin && !barWin.isDestroyed() && barWin.webContents.send(event, value)
  }

  let winOpts = {
    x: bounds.x,
    y: bounds.y,
    width: bounds.width,
    height: bounds.height,
    fullscreen: process.platform === 'win32' || undefined, //fix issue: window is black or white on windows
    transparent: true,
    frame: false,
    skipTaskbar: true,
    autoHideMenuBar: true,
    movable: false,
    resizable: false,
    enableLargerThanScreen: true, //mac
    hasShadow: false,
    show: false,
    webPreferences: {
      devTools: false,
      webSecurity: false,
      enableRemoteModule: true,
      nodeIntegrationInWorker: true,
      nodeIntegration: true,
      contextIsolation: false,
      preload: path.join(__dirname, './preload.js')
    },
    icon: path.join(__static, 'logo.png')
  }
  if (process.platform === 'win32') winOpts.type = 'toolbar'
  let win = new BrowserWindow(winOpts)
  win.setMenu(null)
  setIgnoreMouseEvents(true)
  win.setAlwaysOnTop(true, 'screen-saver') //mac
  win.setVisibleOnAllWorkspaces(true) // mac
  win.setFullScreenable(false) // mac
  win.loadURL(`${winBaseURL}#/marker`)

  win.on('close', (e) => {})
  win.on('closed', () => {
    if (barWin) {
      barWin.close()
      barWin = null
    }
    win = null
  })
  win.once('ready-to-show', () => {
    win.show()
    if (!barWin) {
      barWin = createScreenMarkerTopBar(bounds, win)
    }
  })
  win.on('blur', () => {
    resetAlwaysOnTop()
  })

  return { win, setIgnoreMouseEvents, sendEventToBarWebContents }
}
