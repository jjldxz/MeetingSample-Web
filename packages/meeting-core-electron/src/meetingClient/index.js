import EventEmitter from 'wolfy87-eventemitter'
import {
  changePasswordRequest,
  createMeetingRequest,
  deleteMeetingRequest,
  getMeetingInfoRequest,
  getMeetingListRequest,
  getUserInfoRequest,
  loginRequest,
  registerUserRequest,
  setApiBaseURL,
  setAuthToken,
  setRefreshToken,
  updateUserInfoRequest
} from '../common/request'

export default class MeetingClient extends EventEmitter {
  constructor() {
    super()
    this._authToken = null
    this._refreshToken = null
    this._userId = null
  }
  get userId() {
    return this._userId
  }
  set apiBaseURL(url) {
    setApiBaseURL(url)
  }
  get token() {
    return this._authToken
  }
  set token(token) {
    if (!token || typeof token !== 'string')
      throw Error('MeetingCore:token - invalid token')
    setAuthToken(token)
    this._authToken = token
  }
  get refreshToken() {
    return this._refreshToken
  }
  set refreshToken(token) {
    if (!token || typeof token !== 'string')
      throw Error('MeetingCore:refreshToken - invalid token')
    setRefreshToken(token)
    this._refreshToken = token
  }

  /**
   * @function signUp
   * @description Sign up account
   * @param userName {String}
   * @param password {String}
   * @param opts {Object}
   * @param opts.email {String}
   * @param opts.firstName {String}
   * @param opts.lastName {String}
   * @return {Promise<AxiosResponse<*>>}
   * @public
   */
  signUp(userName, password, opts = {}) {
    return new Promise((resolve, reject) => {
      return registerUserRequest(userName, password, opts)
        .then((resp) => {
          this._userId = resp.user
          this.token = resp.token
          this.refreshToken = resp.refreshToken
          resolve(resp)
        })
        .catch(reject)
    })
  }

  /**
   * @function login
   * @description login
   * @param userName {String}
   * @param password {String}
   * @return {Promise<unknown>}
   * @public
   */
  login(userName, password) {
    return new Promise((resolve, reject) => {
      loginRequest(userName, password)
        .then((resp) => {
          this._userId = resp.user
          this.token = resp.token
          this.refreshToken = resp.refreshToken
          resolve(resp)
        })
        .catch(reject)
    })
  }
  changePassword(oldPwd, newPwd) {
    return changePasswordRequest(oldPwd, newPwd)
  }
  getUserInfo() {
    return getUserInfoRequest()
  }
  updateUserInfo(opts = {}) {
    return updateUserInfoRequest(opts)
  }

  /**
   * @function createMeeting
   * @param name {String}
   * @param begin {Date}
   * @param end {date}
   * @param opts {Object}
   * @param opts.muteType {Number}
   * @param opts.password {String}
   * @return {Promise<AxiosResponse<*>>}
   * @public
   */
  createMeeting(name, begin, end, opts = {}) {
    return createMeetingRequest(name, begin, end, opts)
  }
  deleteMeeting(meetingId) {
    return deleteMeetingRequest([meetingId])
  }
  deleteMeetings(meetings = []) {
    return deleteMeetingRequest(meetings)
  }
  getMeetingInfo(meetingId) {
    return getMeetingInfoRequest(meetingId)
  }
  getMeetingsList(opts = {}) {
    return getMeetingListRequest(opts)
  }
}
