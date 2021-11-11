import { BrowserWindow, ipcMain } from 'electron'
import debug from 'electron-debug'
import path from 'path'
import {
  IPCEvents,
  SCREEN_MARKER_BAR_HEIGHT,
  SCREEN_MARKER_BAR_WIDTH,
  winBaseURL
} from '../../common'

export default function createScreenMarkerTopBar(bounds, parentWin = null) {
  debug()
  const x = bounds.x + (Number(bounds.width) - 600) / 2
  let winOpts = {
    x,
    y: bounds.y,
    width: SCREEN_MARKER_BAR_WIDTH,
    height: SCREEN_MARKER_BAR_HEIGHT,
    frame: false,
    useContentSize: true,
    show: false,
    transparent: true,
    movable: false,
    resizable: false,
    skipTaskbar: true,
    hasShadow: false,
    webPreferences: {
      webSecurity: false,
      enableRemoteModule: true,
      nodeIntegrationInWorker: true,
      nodeIntegration: true,
      preload: path.join(__dirname, './preload.js')
    }
  }
  parentWin && (winOpts.parent = parentWin)
  if (process.platform === 'win32') winOpts.type = 'toolbar'
  let win = new BrowserWindow(winOpts)
  win.setMenu(null)
  win.setIgnoreMouseEvents(false)
  win.setAlwaysOnTop(true, 'screen-saver') //mac
  win.setVisibleOnAllWorkspaces(true) // mac
  win.setFullScreenable(false) // mac
  win.loadURL(`${winBaseURL}#/markerBar`)

  win.on('close', (e) => {})
  win.on('closed', () => {
    ipcMain.removeAllListeners(IPCEvents.MARKER.DRAW_TYPE_CHANGED)
    win = null
  })
  win.once('ready-to-show', () => {
    win.setAlwaysOnTop(true)
    win.show()
  })

  ipcMain.on(IPCEvents.MARKER.DRAW_TYPE_CHANGED, (e, value) => {
    win &&
      !win.isDestroyed() &&
      win.webContents.send(IPCEvents.MARKER.DRAW_TYPE_CHANGED, value)
  })
  return win
}
