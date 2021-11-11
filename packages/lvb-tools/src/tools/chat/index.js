import LvbEngine from '@jjldxz/lvb-electron'
import {
  ChatMessage,
  chatMessageType,
  messageType,
  SystemMessage,
  ExternalEvents
} from '../../common'
import ToolBase from '../base'

/**
 * @description Chat features
 */
export default class Chat extends ToolBase {
  constructor() {
    super()
    this._messageCategory = LvbEngine.RTMMessageCategory.Chat
  }

  set enable(flag) {
    if (typeof flag !== 'boolean') {
      console.warn('[DxzChatClient] enable must be bool')
    } else {
      this._enable = flag
      this._eventTrigger.trigger(ExternalEvents.CHAT.ENABLE_CHANGE, [this._enable])
    }
  }

  /**
   * @function init
   * @description Init chat client
   * @param opts {Object}
   * @param opts.rtm {RTMEngine}
   * @param opts.roomId {Number}
   * @param opts.eventTrigger {EventEmitter}
   * @param opts.enable {Boolean}
   * @return void
   * @public
   */
  init(opts = {}) {
    super.init(opts)
    this.bind()
    this._isInit = true
  }

  /**
   * @function destroy
   * @description Destroy chat class
   */
  destroy() {
    super.destroy()
  }

  /**
   * @function sendTextMessage
   * @description Send text messaged
   * @param message {String} Message content
   * @param opts {Object} optional data
   * @param userId {Number|null} User id. if userId is null, send message to room. else send message to user
   * @return void
   */
  sendTextMessage(message, opts, userId = null) {
    if (!this._isInit || !this._enable) {
      return
    }
    const msgObj = ChatMessage(message, opts)
    this.sendMessage(msgObj, userId)
  }

  /**
   * @function sendSystemMessage
   * @description Send system message
   * @param message {String} Message content
   * @param userId {Number|null} User id. if userId is null, send message to room. else send message to user
   * @return void
   */
  sendSystemMessage(message, userId) {
    if (!this._isInit || !this._enable) {
      return
    }
    const msgObj = SystemMessage(message)
    this.sendMessage(msgObj, userId)
  }

  /**
   * @function _onChatMessage
   * @param message {String}
   * @param message.msgType {RTMEngine.MessageType}
   * @param message.type {chatMessageType}
   * @param message.senderId {Number}
   * @param message.receiverId {Number}
   * @param message.content {String}
   * @param message.time {Number}
   * @private
   */
  _onChatMessage(message) {
    let event
    if (message.msgType === LvbEngine.RTMMessageType.Room) {
      event =
        message.type === chatMessageType.CHAT_TEXT_MESSAGE
          ? ExternalEvents.CHAT.USER_NEW_CHAT_MESSAGE
          : ExternalEvents.CHAT.SYSTEM_MESSAGE
    } else if (message.msgType === LvbEngine.RTMMessageType.Peer) {
      event =
        message.type === chatMessageType.CHAT_TEXT_MESSAGE
          ? ExternalEvents.CHAT.PEER_NEW_CHAT_MESSAGE
          : ExternalEvents.CHAT.PEER_SYSTEM_MESSAGE
    }
    if (event) {
      let data = [message.senderId, message.receiverId, message.content]
      message.hasOwnProperty('data') && data.push(message.data)
      data.push(message.time)
      this._eventTrigger.trigger(event, data)
    }
  }

  /**
   * @function onMessage
   * @param message {Object}
   * @param message.kind {messageType}
   */
  onMessage(message) {
    switch (message.kind) {
      case messageType.MESSAGE_CHAT:
        this._onChatMessage(message)
        break
    }
  }
}

/**
 * @type {{ENABLE_CHANGE: string, USER_NEW_CHAT_MESSAGE: string, SYSTEM_MESSAGE: string, PEER_SYSTEM_MESSAGE: string, PEER_NEW_CHAT_MESSAGE: string}}
 */
Chat.ChatEvents = ExternalEvents.CHAT
