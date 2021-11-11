import EventEmitter from 'wolfy87-eventemitter'

export default class RTCClient extends EventEmitter {
  /**
   * @constructor
   * @param lvbEngine {LvbEngine}
   * @param opts {Object}
   */
  constructor(lvbEngine, opts = {}) {
    super()
    this._rtc = lvbEngine.createRTC(opts)
    this._join = false
    this._video = false
    this._audio = true
  }

  get rtc() {
    return this._rtc
  }

  init(opts = {}) {
    this._video = opts.hasOwnProperty('video') ? opts.video : this._video
    this._audio = opts.hasOwnProperty('audio') ? opts.audio : this._audio
  }

  async join() {
    if (this._join) return
    await this._rtc.join()
    this._join = true
  }

  leave() {
    if (!this._rtc) return
    this._rtc.leave()
    this._rtc = null
  }

  async start() {
    if (this._join) return
    this._rtc && (await this.join())
    this._rtc.publish2(this._video, this._audio)
  }

  publish(video, audio) {
    if (!this._join) return
    this._rtc.publish2(video, audio)
  }

  unpublish() {
    if (!this._join) return
    this._rtc.unpublish()
  }
  subscribe(sid) {
    if (!this._join) return
    this._rtc.subscribe(sid)
  }
  unsubscribe(uid) {
    if (!this._join) return
    this._rtc.unsubscribe(uid)
  }
  unsubscribeAll() {
    if (!this._join) return
    this._rtc.unsubscribeAll()
  }
  getCameraDevices() {
    if (!this._rtc) return
    return this._rtc.getCameraDevices()
  }
  getActiveCameraDevice() {
    if (!this._rtc) return
    return this._rtc.getActiveCameraDevice()
  }
  setCameraDevice(deviceId) {
    if (!this._rtc || !deviceId) return
    this._rtc.setCameraDevice(deviceId)
  }
  getMicrophoneDevices() {
    if (!this._rtc) return
    return this._rtc.getMicrophoneDevices()
  }
  getActiveMicrophoneDevice() {
    if (!this._rtc) return
    return this._rtc.getActiveMicrophoneDevice()
  }
  setActiveMicrophoneDevice(deviceId) {
    if (!this._rtc || !deviceId) return
    return this._rtc.setActiveMicrophoneDevice(deviceId)
  }
  getMicrophoneVolume() {
    if (!this._rtc) return
    return this._rtc.getMicrophoneVolume()
  }
  setMicrophoneVolume(volume) {
    if (!this._rtc || !volume) return
    return this._rtc.setMicrophoneVolume(volume)
  }
  startMicrophoneTest() {
    if (!this._rtc) return
    this._rtc.startMicrophoneTest()
  }
  stopMicrophoneTest() {
    if (!this._rtc) return
    this._rtc.stopMicrophoneTest()
  }
  getSpeakerDevices() {
    if (!this._rtc) return
    return this._rtc.getSpeakerDevices()
  }
  getActiveSpeakerDevice() {
    if (!this._rtc) return
    return this._rtc.getActiveSpeakerDevice()
  }
  setActiveSpeakerDevice(deviceId) {
    if (!this._rtc || !deviceId) return
    return this._rtc.setActiveSpeakerDevice(deviceId)
  }
  setSpeakerVolume(volume) {
    if (!this._rtc || !volume) return
    this._rtc.setSpeakerVolume(volume)
  }
  getSpeakerVolume() {
    if (!this._rtc) return
    return this._rtc.getSpeakerVolume()
  }
  startSpeakerTest() {
    if (!this._rtc) return
    const filePath = 'media/test.wav'
    this._rtc.startSpeakerTest(filePath)
  }
  stopSpeakerTest() {
    if (!this._rtc) return
    this._rtc.stopSpeakerTest()
  }
  startCameraTest(domId) {
    if (!this._rtc) return
    this._rtc.startCameraTest(domId)
  }
  stopCameraTest() {
    if (!this._rtc) return
    this._rtc.stopCameraTest()
  }
  startPreview(domId) {
    if (!this._rtc) return
    this._rtc.startPreview(domId)
  }
  stopPreview() {
    if (!this._rtc) return
    this._rtc.stopPreview()
  }
  play(domId, uid) {
    if (!this._rtc) return
    this._rtc.play(domId, uid)
  }
  stopLocalPlay() {
    if (!this._rtc) return
    this._rtc.stopLocalPlay()
  }
  setAudio(state) {
    if (!this._rtc) return 1
    return this._rtc.setAudio(state)
  }
  setVideo(state) {
    if (!this._rtc) return 1
    return this._rtc.setVideo(state)
  }
  createScreenShare() {
    if (!this._rtc) return
    return this._rtc.createScreenShare()
  }
  getScreenDisplaysInfo() {
    if (!this._rtc) return
    return this._rtc.getScreenDisplaysInfo()
  }
  startShareScreen(screenId) {
    if (!this._rtc) return
    this._rtc.startShareScreen(screenId)
  }
  getScreenWindowsInfo() {
    if (!this._rtc) return
    return this._rtc.getScreenWindowsInfo()
  }
  startShareWindow(windowId) {
    if (!this._rtc) return
    this._rtc.startShareWindow(windowId)
  }
  startScreenSharePreview(domId) {
    if (!this._rtc) return
    this._rtc.startScreenSharePreview(domId)
  }
  stopScreenSharePreview() {
    if (!this._rtc) return
    this._rtc.stopScreenSharePreview()
  }
  stopScreenShare() {
    if (!this._rtc) return
    this._rtc.stopScreenShare()
  }
  destroyScreenShare() {
    if (!this._rtc) return
    this._rtc.destroyScreenShare()
  }
  changeAllRemoteStreamsMuteState(mute, opts = {}) {
    if (!this._rtc) return
    return this._rtc.changeAllRemoteStreamsMuteState(mute, opts)
  }
  changeRemoteVideoStreamMuteState(uid, mute) {
    if (!this._rtc) return
    return this._rtc.changeRemoteVideoStreamMuteState(uid, mute)
  }
  changeRemoteAudioStreamMuteState(uid, mute) {
    if (!this._rtc) return
    return this._rtc.changeRemoteAudioStreamMuteState(uid, mute)
  }
  initRender(domId, uid) {
    if (!this._rtc) return
    this._rtc.initRender(domId, uid)
  }
  resizeRender(uid) {
    if (!this._rtc) return
    this._rtc.resizeRender(uid)
  }
  destroyRender(uid) {
    if (!this._rtc) return
    this._rtc.destroyRender(uid)
  }
  setupLocalVideo(domElement) {
    if (!this._rtc) return
    this._rtc.setupLocalVideo(domElement)
  }
  setVideoRenderDimension(width, height, uid) {
    if (!this._rtc) return
    this._rtc.setVideoRenderDimension(width, height, uid)
  }
  createTestClient(appId) {
    if (!this._rtc) return
    return this._rtc.createTestRTC(appId)
  }
}
