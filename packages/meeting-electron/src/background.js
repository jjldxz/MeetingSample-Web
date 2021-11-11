'use strict'

import { app, protocol, BrowserWindow, screen, ipcMain, shell } from 'electron'
// import { createProtocol } from 'vue-cli-plugin-electron-builder/lib'
// import installExtension, { VUEJS_DEVTOOLS } from 'electron-devtools-installer'
import ElectronStore from 'electron-store'
import createMainWin from './windows/main'
import log from 'electron-log'
import electronLocalShortcut from 'electron-localshortcut'
import unhandled from 'electron-unhandled'
import { writeFileSync } from 'fs'
import ics from 'ics'
import { IPCEvents } from './common'
import createSettingWin from './windows/setting'
import createMeetingWin from './windows/meeting'
import createScreenMarker from './windows/screenMarker'
import createWindowShareIndicator from './windows/windowShareInd'

unhandled()
const isDevelopment = process.env.NODE_ENV !== 'production'
// Scheme must be registered before the app is ready
protocol.registerSchemesAsPrivileged([
  { scheme: 'app', privileges: { secure: true, standard: true } }
])
app.allowRendererProcessReuse = false
app.commandLine.appendSwitch('ignore-certificate-errors')
app.commandLine.appendSwitch('max-active-webgl-contexts', '50')
ElectronStore.initRenderer()

// setup log
log.transports.console.level = 'silly'
log.transports.file.level = isDevelopment ? false : 'debug'
// log.transports.console.level = isDevelopment ? 'debug' : false
log.transports.console.level = 'debug'
// log.transports.file.level = false
// log.transports.console.level = false
log.transports.file.fileName = 'jjlDxzMeeting.log'
const formatStr = '[{y}-{m}-{d} {h}:{i}:{s}.{ms}] [{level}]{scope} {text}'
log.transports.console.format = formatStr
log.transports.file.format = formatStr
log.transports.file.maxSize = 1048576
const logger = log.scope('MeetingMain')

logger.warn(log.transports.file.getFile())
logger.warn(app.getPath('userData'))

let mainWin, meetingWin, settingWin, screenMarkWin, winShareIndWin

// single instance check
if (!app.requestSingleInstanceLock()) {
  app.quit()
} else {
  app.on('second-instance', () => {
    if (mainWin) {
      if (mainWin.isMinimized()) {
        mainWin.restore()
      }
      mainWin.show()
    }
  })
}

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', async () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    mainWin = await createMainWin()
  }
  if (mainWin) mainWin.show()
})

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', async () => {
  // if (isDevelopment && !process.env.IS_TEST) {
  //   // Install Vue Devtools
  //   try {
  //     await installExtension(VUEJS_DEVTOOLS)
  //   } catch (e) {
  //     console.error('Vue Devtools failed to install:', e.toString())
  //   }
  // }
  screen.on('display-removed', () => {
    if (mainWin) {
      const [x, y] = mainWin.getPosition()
      mainWin.setPosition(x, y)
    }
  })
  mainWin = await createMainWin()
  electronLocalShortcut.register(mainWin, 'Ctrl+Shift+X', () => {
    mainWin.webContents.openDevTools()
  })
})

app
  .whenReady()
  .then(() => {})
  .catch(logger.error)

// Exit cleanly on request from parent process in development mode.
if (isDevelopment) {
  if (process.platform === 'win32') {
    process.on('message', (data) => {
      if (data === 'graceful-exit') {
        app.quit()
      }
    })
  } else {
    process.on('SIGTERM', () => {
      app.quit()
    })
  }
}

function getDisplay(screenId) {
  let displays = screen.getAllDisplays()
  return displays.find((d) => d.id === screenId)
}

function getDisplayByIdx(idx) {
  let display = null
  let displays = screen.getAllDisplays()
  if (idx >= 0 && idx <= displays.length - 1) {
    display = displays[idx]
  }
  return display
}

// On IPC Events
ipcMain.on(IPCEvents.OPEN_SETTING_WIN, async () => {
  if (!settingWin || settingWin.isDestroyed()) {
    settingWin = await createSettingWin()
  } else {
    settingWin.show()
  }
})
ipcMain.on(IPCEvents.OPEN_MEETING_WIN, async () => {
  if (!meetingWin || meetingWin.isDestroyed()) {
    meetingWin = await createMeetingWin()
  } else {
    meetingWin.show()
  }
})
ipcMain.on(IPCEvents.ICS.CREATE_ICS, (event, meetingInfo) => {
  let alarms = []
  alarms.push({
    action: 'display',
    trigger: { minutes: 10, before: true },
    repeat: 2
  })
  ics.createEvent(
    {
      start: meetingInfo.start,
      title: meetingInfo.name,
      description: meetingInfo.des,
      busyStatus: 'BUSY',
      end: meetingInfo.end,
      alarms: alarms
    },
    (error, value) => {
      if (!error) {
        const temp = app.getPath('temp')
        writeFileSync(`${temp}/${meetingInfo.room_id}.ics`, value)
        shell.openPath(`${temp}/${meetingInfo.room_id}.ics`).then(() => {
          this.win.webContents.send(IPCEvents.ICS.OPEN_ICS_SUCCESS, meetingInfo.room_id)
        })
      } else {
        console.log(error)
      }
    }
  )
})
ipcMain.on(IPCEvents.CHECK_MEETING_ALIVE, (e, arg) => {
  let ret = false
  if (meetingWin && !meetingWin.isDestroyed()) {
    ret = true
  }
  e.returnValue = ret
})
ipcMain.on(IPCEvents.SETTING.MIN, () => {
  settingWin && !settingWin.isDestroyed() && settingWin.minimize()
})
ipcMain.on(IPCEvents.SETTING.CLOSE, () => {
  settingWin && !settingWin.isDestroyed() && settingWin.close()
})
ipcMain.on(IPCEvents.CHECK_LANGUAGE, () => {
  settingWin &&
    !settingWin.isDestroyed() &&
    settingWin.webContents.send(IPCEvents.CHECK_LANGUAGE)
  screenMarkWin &&
    screenMarkWin.win &&
    !screenMarkWin.win.isDestroyed() &&
    this.win.webContents.send(IPCEvents.CHECK_LANGUAGE)
})
ipcMain.on(IPCEvents.MEETING.MIN, () => {
  meetingWin && !meetingWin.isDestroyed() && meetingWin.minimize()
})
ipcMain.on(IPCEvents.MEETING.CLOSE, () => {
  if (!meetingWin || meetingWin.isDestroyed()) return
  if (process.platform === 'darwin') {
    meetingWin.hide()
  } else {
    meetingWin.close()
  }
})
ipcMain.on(IPCEvents.HOME.UPDATE_MEETING_LIST, () => {
  mainWin &&
    !mainWin.isDestroyed() &&
    mainWin.webContents.send(IPCEvents.HOME.UPDATE_MEETING_LIST)
})

ipcMain.on(IPCEvents.MEETING.OPEN_SCREEN_MARKER, (e, reply) => {
  if (screenMarkWin && screenMarkWin.win && !screenMarkWin.win.isDestroyed()) {
    screenMarkWin.win.show()
  } else {
    let workArea = { x: 0, y: 0 }
    if (reply.type === 'screen') {
      let display = getDisplay(reply.id)
      if (display) {
        workArea = display.bounds
      } else {
        display = getDisplayByIdx(reply.id)
        if (display) {
          workArea = display.bounds
        }
      }
      screenMarkWin = createScreenMarker(workArea)
    } else {
      winShareIndWin = createWindowShareIndicator(workArea, reply.type, reply.id)
    }
  }
})
ipcMain.on(IPCEvents.WIN_SHARE_IND.MIN, () => {
  if (winShareIndWin && !winShareIndWin.isDestroyed()) {
    winShareIndWin.minimize()
  }
})
ipcMain.on(IPCEvents.WIN_SHARE_IND.STOP, () => {
  if (winShareIndWin && !winShareIndWin.isDestroyed()) {
    winShareIndWin.close()
    winShareIndWin = null
  }
})
ipcMain.on(IPCEvents.MEETING.STOP_SCREEN_MARKER, () => {
  if (screenMarkWin && screenMarkWin.win && !screenMarkWin.win.isDestroyed()) {
    screenMarkWin.win.close()
    screenMarkWin = null
    meetingWin &&
      !meetingWin.isDestroyed() &&
      meetingWin.webContents.send(IPCEvents.MEETING.STOP_SCREEN_MARKER)
  }
})
ipcMain.on(IPCEvents.MEETING.CLOSE_SCREEN_MARKER, () => {
  if (screenMarkWin && screenMarkWin.win && !screenMarkWin.win.isDestroyed()) {
    screenMarkWin.win.close()
    screenMarkWin = null
  }
})
ipcMain.on(IPCEvents.MARKER.DRAW_LINE, () => {
  if (screenMarkWin && screenMarkWin.win && !screenMarkWin.win.isDestroyed()) {
    screenMarkWin.setIgnoreMouseEvents(false)
    screenMarkWin.win.webContents.send(IPCEvents.MARKER.DRAW_LINE)
  }
})
ipcMain.on(IPCEvents.MARKER.DRAWING_STRAIGHT_LINE, () => {
  if (screenMarkWin && screenMarkWin.win && !screenMarkWin.win.isDestroyed()) {
    screenMarkWin.setIgnoreMouseEvents(false)
    screenMarkWin.win.webContents.send(IPCEvents.MARKER.DRAWING_STRAIGHT_LINE)
  }
})
ipcMain.on(IPCEvents.MARKER.DRAW_CIRCLE, () => {
  if (screenMarkWin && screenMarkWin.win && !screenMarkWin.win.isDestroyed()) {
    screenMarkWin.setIgnoreMouseEvents(false)
    screenMarkWin.win.webContents.send(IPCEvents.MARKER.DRAW_CIRCLE)
  }
})
ipcMain.on(IPCEvents.MARKER.DRAW_RECTANGLE, () => {
  if (screenMarkWin && screenMarkWin.win && !screenMarkWin.win.isDestroyed()) {
    screenMarkWin.setIgnoreMouseEvents(false)
    screenMarkWin.win.webContents.send(IPCEvents.MARKER.DRAW_RECTANGLE)
  }
})
ipcMain.on(IPCEvents.MARKER.DRAW_TEXT, () => {
  if (screenMarkWin && screenMarkWin.win && !screenMarkWin.win.isDestroyed()) {
    screenMarkWin.setIgnoreMouseEvents(false)
    screenMarkWin.win.webContents.send(IPCEvents.MARKER.DRAW_TEXT)
  }
})
ipcMain.on(IPCEvents.MARKER.DRAW_COLOR, () => {
  if (screenMarkWin && screenMarkWin.win && !screenMarkWin.win.isDestroyed()) {
    screenMarkWin.setIgnoreMouseEvents(false)
    screenMarkWin.win.webContents.send(IPCEvents.MARKER.DRAW_COLOR)
  }
})
ipcMain.on(IPCEvents.MARKER.CLEAN, () => {
  if (screenMarkWin && screenMarkWin.win && !screenMarkWin.win.isDestroyed()) {
    screenMarkWin.win.webContents.send(IPCEvents.MARKER.CLEAN)
  }
})
ipcMain.on(IPCEvents.MARKER.UNDO, () => {
  if (screenMarkWin && screenMarkWin.win && !screenMarkWin.win.isDestroyed()) {
    screenMarkWin.win.webContents.send(IPCEvents.MARKER.UNDO)
  }
})
ipcMain.on(IPCEvents.MARKER.REDO, () => {
  if (screenMarkWin && screenMarkWin.win && !screenMarkWin.win.isDestroyed()) {
    screenMarkWin.win.webContents.send(IPCEvents.MARKER.REDO)
  }
})
ipcMain.on(IPCEvents.MARKER.SAVE, () => {
  if (screenMarkWin && screenMarkWin.win && !screenMarkWin.win.isDestroyed()) {
    screenMarkWin.win.webContents.send(IPCEvents.MARKER.SAVE)
  }
})
ipcMain.on(IPCEvents.MARKER.CONTROL, () => {
  if (screenMarkWin && screenMarkWin.win && !screenMarkWin.win.isDestroyed()) {
    screenMarkWin.setIgnoreMouseEvents(true)
    screenMarkWin.win.webContents.send(IPCEvents.MARKER.CONTROL)
  }
})
ipcMain.on(IPCEvents.MARKER.DRAW_TYPE_CHANGED, (e, value) => {
  screenMarkWin &&
    screenMarkWin.sendEventToBarWebContents(IPCEvents.MARKER.DRAW_TYPE_CHANGED, value)
})

ipcMain.on(IPCEvents.MEETING.SWITCH_FULL_SCREEN, () => {
  if (meetingWin && !screenMarkWin.isDestroyed()) {
    meetingWin.setFullScreen(!meetingWin.fullScreen)
  }
})
