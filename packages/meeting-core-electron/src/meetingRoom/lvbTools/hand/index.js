import LvbTools from '@jjldxz/lvb-tools'
import EventEmitter from 'wolfy87-eventemitter'

export default class HandTool extends EventEmitter {
  constructor() {
    super()
    this._roomId = null
    this._userId = null
    this._rtm = null
    this._eventTrigger = null
    this._hand = null
  }

  init(opts = {}) {
    this._roomId = opts.roomId
    this._userId = opts.userId
    this._rtm = opts.rtm
    this._eventTrigger = opts.eventTrigger ? opts.eventTrigger : this
    this._hand = LvbTools.createHand()
    this._bindEvents()
    this._hand.init({
      roomId: this._roomId,
      rtm: this._rtm
    })
  }

  _bindEvents() {
    if (!this._hand) return
    this._hand.on(LvbTools.HandEvents.USER_HAND_UP_ACK, () => {})
  }

  handUp(userId = null) {
    if (!this._hand) return
    userId = userId ? userId : this._userId
    return this._hand.handUp(userId)
  }

  handDown(userId = null) {
    if (!this._hand) return
    userId = userId ? userId : this._userId
    return this._hand.handDown(userId)
  }

  handAck(userId) {
    if (!this._hand) return
    return this._hand.handDown(userId)
  }
}
