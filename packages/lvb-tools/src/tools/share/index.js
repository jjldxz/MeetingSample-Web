import ToolBase from '../base'

const ShareType = {
  None: 'none',
  Desktop: 'desktop',
  App: 'application',
  Whiteboard: 'whiteboard'
}

export default class Share extends ToolBase {
  constructor() {
    super()
    this._shareType = ShareType.None
  }

  get shareType() {
    return this._shareType
  }

  /**
   * @function init
   * @description init share tool
   * @param opts {Object}
   * @param opts.rtm {RTMEngine}
   * @param opts.roomId {Number}
   * @public
   */
  init(opts = {}) {
    super.init(opts)
    this._isInit = true
  }

  _onShare(userId, share = ShareType.None) {
    this._shareType = share
    return this._rtm.setUserAttrs(this._roomId, userId, { share })
  }

  /**
   * @function startShareWhiteboard
   * @description start share whiteboard
   * @param userId {Number}
   * @return {*}
   * @public
   */
  startShareWhiteboard(userId) {
    return this._onShare(userId, ShareType.Whiteboard)
  }

  /**
   * @function startShareDesktop
   * @description start share desktop
   * @param userId {Number}
   * @return {*}
   * @public
   */
  startShareDesktop(userId) {
    return this._onShare(userId, ShareType.Desktop)
  }

  /**
   * @function startShareApplication
   * @description start share application
   * @param userId
   * @return {*}
   * @public
   */
  startShareApplication(userId) {
    return this._onShare(userId, ShareType.App)
  }

  /**
   * @function stopShare
   * @param userId
   * @return {*}
   * @public
   */
  stopShare(userId) {
    return this._onShare(userId)
  }
}

/**
 * @type {{App: string, Desktop: string, None: string, Whiteboard: string}}
 */
Share.ShareType = ShareType
