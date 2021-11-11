import { AsrMessage, messageType, ExternalEvents } from '../../common'
import ToolBase from '../base'

export default class Asr extends ToolBase {
  constructor() {
    super()
    this._messageCategory = 'asr'
  }

  init(opts = {}) {
    super.init(opts)
    this.bind()
    this._isInit = true
  }

  sendMessage(message, userId = null) {
    if (!this._isInit) {
      return
    }
    const msgObj = AsrMessage(message)
    super.sendMessage(msgObj, userId)
  }

  /**
   * @function onMessage
   * @param message {Object}
   * @param message.kind {messageType}
   */
  onMessage(message) {
    switch (message.kind) {
      case messageType.MESSAGE_ASR:
        {
          let msg = {
            roomId: message.roomId,
            senderId: message.senderId,
            content: message.content
          }
          this.trigger(ExternalEvents.ASR.MESSAGE, [msg])
        }
        break
    }
  }
}
