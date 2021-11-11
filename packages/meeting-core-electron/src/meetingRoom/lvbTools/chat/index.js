import LvbTools from '@jjldxz/lvb-tools'
import EventEmitter from 'wolfy87-eventemitter'
import { ChatRole, MeetingCoreEvents } from '../../../common'

export default class ChatTool extends EventEmitter {
  constructor() {
    super()
    this._chat = null
    this._rtm = null
    this._roomId = null
    this._eventTrigger = null
  }

  init(opts = {}) {
    this._roomId = opts.roomId
    this._rtm = opts.rtm
    this._eventTrigger = opts.eventTrigger ? opts.eventTrigger : this
    this._chat = LvbTools.createChat()
    this._bindEvents()
    this._chat.init({
      roomId: this._roomId,
      rtm: this._rtm
    })
  }

  _bindEvents() {
    if (!this._chat) return
    this._chat.on(
      LvbTools.ChatEvents.USER_NEW_CHAT_MESSAGE,
      (senderId, receiverId, content, data, time) => {
        this._eventTrigger.trigger(MeetingCoreEvents.Room.CHAT_ROOM_MESSAGE, [
          senderId,
          receiverId,
          content,
          data
        ])
      }
    )
    this._chat.on(
      LvbTools.ChatEvents.PEER_NEW_CHAT_MESSAGE,
      (senderId, receiverId, content, data, time) => {
        this._eventTrigger.trigger(MeetingCoreEvents.Room.CHAT_PEER_MESSAGE, [
          senderId,
          receiverId,
          content,
          data
        ])
      }
    )
    this._chat.on(
      LvbTools.ChatEvents.SYSTEM_MESSAGE,
      (senderId, receiverId, content, time) => {
        this._eventTrigger.trigger(MeetingCoreEvents.Room.CHAT_SYSTEM_ROOM_MESSAGE, [
          senderId,
          receiverId,
          content
        ])
      }
    )
    this._chat.on(
      LvbTools.ChatEvents.PEER_SYSTEM_MESSAGE,
      (senderId, receiverId, content, time) => {
        this._eventTrigger.trigger(MeetingCoreEvents.Room.CHAT_SYSTEM_PEER_MESSAGE, [
          senderId,
          receiverId,
          content
        ])
      }
    )
    this._chat.on(LvbTools.ChatEvents.ENABLE_CHANGE, (enable) => {})
  }

  sendMessage(message, opts, userId = null) {
    if (!this._chat) return
    this._chat.sendTextMessage(message, opts, userId)
  }

  sendSystemMessage(message, userId = null) {
    if (!this._chat) return
    this._chat.sendSystemMessage(message, userId)
  }

  destroy() {
    if (!this._chat) return
    this._chat.destroy()
  }
}
