import EventEmitter from 'wolfy87-eventemitter'
import LvbTools from '@jjldxz/lvb-tools'

export default class WhiteboardTool extends EventEmitter {
  constructor() {
    super()
    this._whiteboard = null
    this._roomId = null
    this._userId = null
    this._rtm = null
    this._eventTrigger = null
    this._init = false
  }

  async init(opts = {}) {
    const domId = opts.domId
    const color = opts.color ? opts.color : null
    this._roomId = opts.roomId
    this._userId = opts.userId
    this._rtm = opts.rtm
    this._eventTrigger = opts.eventTrigger ? opts.eventTrigger : this
    this._whiteboard = LvbTools.createWhiteboard()
    this._bindEvents()
    await this._whiteboard.init({
      domId,
      color,
      roomId: this._roomId,
      userId: this._userId,
      rtm: this._rtm
    })
    this._init = true
  }

  _bindEvents() {
    if (!this._whiteboard) return
    this._whiteboard.on(LvbTools.WbEvnets.DRAW_START, () => {})
    this._whiteboard.on(LvbTools.WbEvnets.COURSEWARE_UPDATED, () => {})
    this._whiteboard.on(LvbTools.WbEvnets.PREV_ACTIVE_PG_COMPLETE, (pageGroupId) => {})
    this._whiteboard.on(LvbTools.WbEvnets.UPDATE_WHITEBOARD_COMPLETE, (pageGroupId) => {})
    this._whiteboard.on(
      LvbTools.WbEvnets.PAGE_GROUP_CHANGE,
      (pageGroupId, pageNo, pagesCount) => {}
    )
    this._whiteboard.on(
      LvbTools.WbEvnets.PAGE_CHANGE,
      (pageGroupId, pageNo, pagesCount) => {}
    )
    this._whiteboard.on(LvbTools.WbEvnets.USER_WB_STATE_CHANGE, (enable) => {})
  }

  getCurrentPageGroup() {
    if (!this._init) return
    return this._whiteboard.pageGroup
  }

  getPageGroups() {
    if (!this._init) return
    return this._whiteboard.pageGroups
  }

  clearAll() {
    if (!this._init) return
    this._whiteboard.clearAll()
  }

  setColor(color) {
    if (!this._init) return
    this._whiteboard.setColor(color)
  }

  getColor() {
    if (!this._init) return
    return this._whiteboard.getColor()
  }

  setLineWidth(width) {
    if (!this._init) return
    this._whiteboard.setLineWidth(width)
  }

  drawLine() {
    if (!this._init) return
    this._whiteboard.drawLine()
  }

  drawStraightLine() {
    if (!this._init) return
    this._whiteboard.drawStraightLine()
  }

  drawRectangle() {
    if (!this._init) return
    this._whiteboard.drawRectangle()
  }

  drawRound() {
    if (!this._init) return
    this._whiteboard.drawRound()
  }

  drawText(text) {
    if (!this._init) return
    this._whiteboard.drawText(text)
  }

  switchDelete() {
    if (!this._init) return
    this._whiteboard.switchDelete()
  }

  undo() {
    if (!this._init) return
    this._whiteboard.undo()
  }

  addPage() {
    if (!this._init) return
    this._whiteboard.addPage()
  }

  changePageGroup(groupId) {
    if (!this._init) return
    this._whiteboard.changePageGroupById(groupId)
  }

  goToFirstPage() {
    if (!this._init) return
    this._whiteboard.goToFirstPage()
  }

  goToLastPage() {
    if (!this._init) return
    this._whiteboard.goToLastPage()
  }

  goToPrevPage() {
    if (!this._init) return
    this._whiteboard.goToPrevPage()
  }

  goToNextPage() {
    if (!this._init) return
    this._whiteboard.goToNextPage()
  }

  goToAnyPage(pageNo) {
    if (!this._init) return
    this._whiteboard.goToAnyPage(pageNo)
  }

  setWhiteBoardState(enable) {
    if (!this._init) return
    this._whiteboard.setWhiteBoardState(enable)
  }

  updateCourseWare(courseWareList) {
    if (!this._init) return
    this._whiteboard.updateCourseWare(courseWareList)
  }

  resize() {
    if (!this._init) return
    this._whiteboard.resize()
  }
}
