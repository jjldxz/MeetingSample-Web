import ToolBase from '../base'
import { ExternalEvents, handMessageType, HandUpAckRequest } from '../../common'

export default class Hand extends ToolBase {
  constructor() {
    super()
    this._messageCategory = 'hand'
  }

  /**
   * @function init
   * @description init share tool
   * @param opts {Object}
   * @param opts.rtm {RTMEngine}
   * @param opts.roomId {Number}
   * @param opts.eventTrigger {EventEmitter}
   * @public
   */
  init(opts = {}) {
    super.init(opts)
    this.bind()
    this._isInit = true
  }

  handUp(userId = null) {
    return this._rtm.setUserAttrs(this._roomId, userId, { hand: 1 })
  }

  handDown(userId = null) {
    return this._rtm.setUserAttrs(this._roomId, userId, { hand: 0 })
  }

  handAck(userId) {
    const message = HandUpAckRequest(userId)
    this.sendMessage(message)
  }

  /**
   * @function onMessage
   * @param message {Object}
   * @param message.kind {messageType}
   */
  onMessage(message) {
    switch (message.type) {
      case handMessageType.HAND_ACK:
        this._eventTrigger.trigger(ExternalEvents.HAND.USER_HAND_UP_ACK, [message.userId])
        break
    }
  }
}

/**
 * @type {{USER_HAND_DOWN: string, USER_CAN_HAND_UP: string, USER_HAND_UP: string, USER_HAND_UP_ACK: string}}
 */
Hand.HandEvents = ExternalEvents.HAND
