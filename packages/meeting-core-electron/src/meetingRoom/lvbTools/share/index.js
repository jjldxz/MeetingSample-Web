import EventEmitter from 'wolfy87-eventemitter'
import LvbTools from '@jjldxz/lvb-tools'

export default class ShareTool extends EventEmitter {
  constructor() {
    super()
    this._roomId = null
    this._userId = null
    this._rtm = null
    this._share = null
  }

  init(opts = {}) {
    this._roomId = opts.roomId
    this._rtm = opts.rtm
    this._userId = opts.userId
    this._share = LvbTools.createShare()
    this._share.init({
      roomId: this._roomId,
      rtm: this._rtm
    })
  }

  startShareWhiteboard() {
    if (!this._userId || !this._share) return
    return this._share.startShareWhiteboard(this._userId)
  }

  startShareDesktop() {
    if (!this._userId || !this._share) return
    return this._share.startShareDesktop(this._userId)
  }

  startShareApplication() {
    if (!this._userId || !this._share) return
    return this._share.startShareApplication(this._userId)
  }

  stopShare() {
    if (!this._userId || !this._share) return
    return this._share.stopShare(this._userId)
  }
}
