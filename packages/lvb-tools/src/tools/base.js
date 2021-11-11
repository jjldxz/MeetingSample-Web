import EventEmitter from 'wolfy87-eventemitter'
import LvbEngine from '@jjldxz/lvb-electron'

export default class ToolBase extends EventEmitter {
  constructor() {
    super()
    this._eventTrigger = null
    this._isInit = false
    this._roomId = null
    this._extRoomId = null
    this._rtm = null
    this._enable = true
    this._messageCategory = LvbEngine.RTMMessageCategory.Custom
    this._customEvent = null
  }

  get enable() {
    return this._enable
  }

  set enable(enable) {
    this._enable = enable
  }

  init(opts = {}) {
    if (this._isInit) {
      this._rtm = null
      this._isInit = false
    }
    if (opts.hasOwnProperty('roomId')) {
      this._roomId = opts.roomId
    }
    if (opts.hasOwnProperty('rtm')) {
      this._rtm = opts.rtm
    }
    opts.hasOwnProperty('eventTrigger')
      ? opts.eventTrigger instanceof EventEmitter
        ? (this._eventTrigger = opts.eventTrigger)
        : (this._eventTrigger = this)
      : (this._eventTrigger = this)
    opts.hasOwnProperty('enable') && (this.enable = opts.enable)

    // register custom rtm category
    this._customEvent = this._rtm.registerRTMCategory(this._messageCategory)
  }

  /**
   * @function _bind
   * @private
   */
  bind() {
    if (!this._rtm || !this._customEvent) return
    this._rtm.on(this._customEvent, (senderId, roomId, content, msgType) => {
      if (msgType === LvbEngine.RTMMessageType.Room && this._roomId !== roomId) return
      content = JSON.parse(content)
      senderId = typeof senderId === 'string' ? parseInt(senderId) : senderId
      this.onMessage({ ...content, senderId, roomId, msgType })
    })
  }

  onMessage(message) {}

  /**
   * @function destroy
   * @description Destroy chat class
   */
  destroy() {
    this._rtm = null
    this._isInit = false
  }

  sendMessage(message, userId = null) {
    if (!this._rtm) return
    if (userId) {
      return this._rtm.sendMessageToPeer(userId, this._messageCategory, message)
    } else {
      return this._rtm.sendMessageToRoom(this._roomId, this._messageCategory, message)
    }
  }
}
