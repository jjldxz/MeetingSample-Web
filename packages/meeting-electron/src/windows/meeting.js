'use strict'
/* global __static */

import { BrowserWindow } from 'electron'
import { MEETING_WIN_INIT_HEIGHT, MEETING_WIN_INIT_WIDTH, winBaseURL } from '../common'
import path from 'path'
import debug from 'electron-debug'

export default async function createMeetingWin() {
  debug()
  let winOpts = {
    width: MEETING_WIN_INIT_WIDTH,
    height: MEETING_WIN_INIT_HEIGHT,
    minWidth: MEETING_WIN_INIT_WIDTH,
    minHeight: MEETING_WIN_INIT_HEIGHT,
    frame: false,
    useContentSize: true,
    center: true,
    resizable: true,
    show: false,
    webPreferences: {
      webSecurity: false,
      enableRemoteModule: true,
      nodeIntegrationInWorker: true,
      nodeIntegration: true,
      contextIsolation: false,
      preload: path.join(__dirname, './preload.js')
    },
    icon: path.join(__static, 'logo.png')
  }

  let win = new BrowserWindow(winOpts)
  win.center()
  win.setMenu(null)
  win.loadURL(`${winBaseURL}#/meeting`)

  win.on('close', (e) => {})
  win.on('closed', () => {
    win = null
  })
  win.once('ready-to-show', () => {
    win.show()
  })

  return win
}
