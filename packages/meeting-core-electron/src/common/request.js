import Http from './http'
import * as http from 'http'

const httpClient = new Http()

export function setAuthToken(token) {
  httpClient.setAuthToken(token)
}

export function setRefreshToken(token) {
  httpClient.setRefreshToken(token)
}

export function setApiBaseURL(url) {
  httpClient.setApiBaseURL(url)
}

// Common
/**
 * @function loginRequest
 * @param username {String}
 * @param password {String}
 * @return {Promise<AxiosResponse<any>>}
 */
export function loginRequest(username, password) {
  return httpClient.post('/common/login/', { username, password }, false)
}

/**
 * @function registerUserRequest
 * @param username {string}
 * @param password {String}
 * @param opts {Object} Optional param
 * @param opts.email {String}
 * @param opts.first_name {String}
 * @param opts.last_name {String}
 * @return {Promise<AxiosResponse<any>>}
 */
export function registerUserRequest(username, password, opts = {}) {
  let registerOpts = { username, password }
  opts.hasOwnProperty('email') && (registerOpts.email = opts.email)
  opts.hasOwnProperty('first_name') && (registerOpts.first_name = opts.first_name)
  opts.hasOwnProperty('last_name') && (registerOpts.last_name = opts.last_name)
  return httpClient.post('/common/register/', registerOpts, false)
}

// User
/**
 * @function changePasswordRequest
 * @param oldPassword {String}
 * @param newPassword {String}
 * @return {Promise<AxiosResponse<any>>}
 */
export function changePasswordRequest(oldPassword, newPassword) {
  return httpClient.post('/user/change_pwd/', { oldPassword, newPassword })
}

/**
 * @function getUserInfoRequest
 * @return {Promise<AxiosResponse<any>>}
 */
export function getUserInfoRequest() {
  return httpClient.get('/user/info/')
}

/**
 * @function updateUserInfoRequest
 * @param opts {Object} Optional param
 * @param opts.email {String}
 * @param opts.first_name {String}
 * @param opts.last_name {String}
 * @return {Promise<AxiosResponse<any>>}
 */
export function updateUserInfoRequest(opts = {}) {
  let data = {}
  opts.hasOwnProperty('email') && (data.email = opts.email)
  opts.hasOwnProperty('first_name') && (data.first_name = opts.first_name)
  opts.hasOwnProperty('last_name') && (data.last_name = opts.last_name)
  return httpClient.post('/user/update_info/', data)
}

// Meeting
/**
 * @function joinMeetingRequest
 * @param meetingId {Number}
 * @param password {String}
 * @return {Promise<AxiosResponse<any>>}
 */
export function joinMeetingRequest(meetingId, password = null) {
  let opts = { number: meetingId }
  password && (opts.password = password)
  return httpClient.post('/meeting/join/', opts)
}

/**
 * @function deleteMeetingRequest
 * @param meetings {Number[]}
 * @return {Promise<AxiosResponse<any>>}
 */
export function deleteMeetingRequest(meetings = []) {
  return httpClient.post('/meeting/del/', { meetings })
}

/**
 * @function getMeetingInfoRequest
 * @param meetingId {Number}
 * @return {Promise<AxiosResponse<any>>}
 */
export function getMeetingInfoRequest(meetingId) {
  return httpClient.get(`/meeting/info/?number=${meetingId}`)
}

/**
 * @function getMeetingListRequest
 * @param opts {Object} Optional param
 * @param opts.begin {Date}
 * @param opts.end {Date}
 * @return {Promise<AxiosResponse<any>>}
 */
export function getMeetingListRequest(opts = {}) {
  let queryURL = '/meeting/list/'
  opts.hasOwnProperty('begin') && (queryURL = `${queryURL}?beginAt=${opts.begin}`)
  opts.hasOwnProperty('end') && (queryURL = `${queryURL}?endAt=${opts.end}`)
  return httpClient.get(queryURL)
}

/**
 * @function createMeetingRequest
 * @param name {String}
 * @param beginAt {Date}
 * @param endAt {Date}
 * @param opts {Object}
 * @param opts.muteType {Number}
 * @param opts.password {String}
 * @return {Promise<AxiosResponse<any>>}
 */
export function createMeetingRequest(name, beginAt, endAt, opts = {}) {
  let createOpts = { name, beginAt, endAt }
  opts.hasOwnProperty('muteType') && (createOpts.muteType = opts.muteType)
  opts.hasOwnProperty('password') && (createOpts.password = opts.password)
  return httpClient.post('/meeting/new/', createOpts)
}

/**
 * @function startShareRequest
 * @param number {Number} Meeting id
 * @return {Promise<AxiosResponse<any>>}
 */
export function startShareRequest(number) {
  return httpClient.post('/meeting/start_share/', { number })
}

/**
 * @function stopShareRequest
 * @param number {Number} Meeting id
 * @return {Promise<AxiosResponse<any>>}
 */
export function stopShareRequest(number) {
  return httpClient.post('/meeting/stop_share/', { number })
}

/**
 * @function stopMeetingRequest
 * @param number {Number} Meeting id
 * @return {Promise<AxiosResponse<any>>}
 */
export function stopMeetingRequest(number) {
  return httpClient.post('/meeting/stop/', { number })
}

/**
 * @param pollId {Number}
 * @return {Promise<AxiosResponse<any>>}
 */
export function getPollAnswerRequest(pollId) {
  return httpClient.get(`/poll/answer/?id=${pollId}`)
}

/**
 * @param pollId
 * @param questions {Object}
 * @param questions.id {Number}
 * @param questions.options {[]}
 * @return {Promise<AxiosResponse<any>>}
 */
export function commitPollRequest(pollId, questions = {}) {
  return httpClient.post('/poll/commit/', { pollId, questions })
}

/**
 * @param pollId {Number}
 * @return {Promise<AxiosResponse<any>>}
 */
export function deletePollRequest(pollId) {
  return httpClient.post('/poll/del/', { id: pollId })
}

/**
 * @param pollId {Number}
 * @return {Promise<AxiosResponse<any>>}
 */
export function getPollDetailRequest(pollId) {
  return httpClient.get(`/poll/detail/?id=${pollId}`)
}

/**
 * @param meetingId {Number}
 * @return {Promise<AxiosResponse<any>>}
 */
export function getPollListRequest(meetingId) {
  return httpClient.get(`/poll/list/?number=${meetingId}`)
}

/**
 * @param meetingId {Number}
 * @param questions {Object}
 * @param questions.options {[]}
 * @param questions.content {String}
 * @param questions.isSingle {Boolean}
 * @param title
 * @param isAnonymous
 * @return {Promise<AxiosResponse<any>>}
 */
export function createNewPollRequest(meetingId, questions, title, isAnonymous = false) {
  return httpClient.post('/poll/new/', {
    number: meetingId,
    questions,
    title,
    isAnonymous
  })
}

/**
 * @param pollId {Number}
 * @return {Promise<AxiosResponse<any>>}
 */
export function getPollResultRequest(pollId) {
  return httpClient.get(`/poll/result/?id=${pollId}`)
}

/**
 * @param pollId {Number}
 * @param share {Boolean}
 * @return {Promise<AxiosResponse<any>>}
 */
export function sharePollRequest(pollId, share) {
  return httpClient.post('/poll/share/', { id: pollId, share })
}

/**
 * @param pollId {Number}
 * @return {Promise<AxiosResponse<any>>}
 */
export function startPollRequest(pollId) {
  return httpClient.post('/poll/start/', { id: pollId })
}

/**
 * @param pollId {Number}
 * @return {Promise<AxiosResponse<any>>}
 */
export function stopPollRequest(pollId) {
  return httpClient.post('/poll/stop/', { id: pollId })
}

/**
 * @param pollId {Number}
 * @param title {String}
 * @param questions {Object}
 * @param questions.options {[]}
 * @param questions.content {String}
 * @param questions.isSingle {Boolean}
 * @param isAnonymous
 * @return {Promise<AxiosResponse<any>>}
 */
export function updatePollRequest(pollId, title, questions, isAnonymous = false) {
  return httpClient.post('/poll/update/', { id: pollId, title, questions, isAnonymous })
}

export function startBreakoutGroupsRequest(meetingId, group) {
  return httpClient.post('/group/start/', { number: meetingId, group })
}

export function stopBreakoutGroupsRequest(meetingId) {
  return httpClient.post('/group/stop/', { number: meetingId })
}

export function moveUserToBreakoutGroupRequest(meetingId, fromGroup, toGroup, members) {
  return httpClient.post('/group/move_member/', {
    number: meetingId,
    fromGroup,
    toGroup,
    members
  })
}

export function getBreakoutGroupsDetailRequest(meetingId) {
  return httpClient.post('/group/detail/', { number: meetingId })
}
