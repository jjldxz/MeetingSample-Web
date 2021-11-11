import EventEmitter from 'wolfy87-eventemitter'
import { ANALYTICAL_INTERVAL } from '../../common'

export default class AnalyticalParser extends EventEmitter {
  constructor() {
    super()
    this._rtm = null
    this._rtc = null
    this._timer = null
    this._info = {}
    this._userInfo = null
    this._roomInfo = null
    this._sysInfo = null
  }
  init(opts = {}) {
    this._userInfo = opts.userInfo
    this._roomInfo = opts.roomInfo
    this._rtc = opts.rtc
    this._rtm = opts.rtm
  }
  getCommonInfo() {
    return {
      userInfo: { ...this._userInfo },
      systemInfo: { ...this._sysInfo },
      ...this._roomInfo
    }
  }
  setSystemInfo(info) {
    this._sysInfo = info
    const ret = this.getCommonInfo()
    this._rtm.sendMonitorData(ret)
    this.start()
  }
  getInfo() {
    let ret = this.getCommonInfo()
    if (this._rtc.networkQuality) {
      ret.networkState = { ...this._rtc.networkQuality }
    }
    if (this._rtc.clientState) {
      ret.clientState = { ...this._rtc.clientState }
    }
    if (this._rtc.appState) {
      ret.appState = { ...this._rtc.appState }
    }
    if (this._rtc.localVideoState) {
      ret.localVideoState = this._rtc.localVideoState
    }
    if (this._rtc.localAudioState) {
      ret.localAudioState = this._rtc.localAudioState
    }
    if (this._rtc.remoteVideoState) {
      ret.remoteVideoState = Object.keys(this._rtc.remoteVideoState).map(
        (k) => this._rtc.remoteVideoState[k]
      )
    }
    if (this._rtc.remoteAudioState) {
      ret.remoteAudioState = Object.keys(this._rtc.remoteAudioState).map(
        (k) => this._rtc.remoteAudioState[k]
      )
    }
    this._rtm.sendMonitorData(ret)
  }
  start() {
    if (!this._timer) {
      this._timer = setInterval(() => {
        this.getInfo()
      }, ANALYTICAL_INTERVAL)
    }
  }
  stop() {
    if (this._timer) {
      clearInterval(this._timer)
      this._timer = null
    }
    this._init = false
  }
  destroy() {
    this.stop()
  }
}
