import LvbEngine from '@jjldxz/lvb-electron'
import { ErrorMsg } from './error'
import $ from 'jquery'
import {
  Delete,
  Page,
  PageChange,
  CourseWareLoad,
  PageClean,
  SyncWhiteboard
} from '../../common'
import { ExternalEvents } from '../../common'
import { WbEvents, PAGE_STATUS, PageGroupState } from './commonDef'
import {
  controlMessageType,
  controlUpdateMessageType,
  messageType,
  drawingMessageType
} from '../../common'
import PageGroup from './pageGroup'
import CanvasHandler from './canvasHandler'
import { getHexBackgroundColor } from './utils'
import { getAllCourseWareListRequest } from '../../request'
import './css/whiteBoard.scss'
import ToolBase from '../base'

export default class WhiteBoard extends ToolBase {
  constructor() {
    super()
    this._$el = null
    this._domId = null
    this._rtm = null
    this._newStroke = true
    this._boardCvs = null
    this._$wbDom = null
    this._pageGroup = null
    this._pageGroups = []
    this._isInit = false
    this._usable = true
    this._roomId = null
    this._userId = null
    this._resizeTimer = null
    this._cvs_check_timer = null
    this._messageCategory = LvbEngine.RTMMessageCategory.Whiteboard
  }

  set usable(usable) {
    if (typeof usable !== 'boolean') {
      console.warn('[DxzWhiteBoard] - usable must be bool')
      return
    }
    this._usable = usable
  }

  get usable() {
    return this._usable
  }

  /**
   * 设置白板是否可用
   * @param flag - true|false
   */
  set enable(flag) {
    if (typeof flag !== 'boolean') {
      console.warn('[dxzWBSDK]-setEnable() type of flag must be bool')
      return
    }
    if (this._boardCvs) {
      this._boardCvs.canDraw = flag
      this._eventTrigger.trigger(ExternalEvents.WB.USER_WB_STATE_CHANGE, [
        this._boardCvs.canDraw
      ])
    }
  }

  get enable() {
    if (this._boardCvs) {
      return this._boardCvs.canDraw
    } else {
      return false
    }
  }

  get pageGroup() {
    return this._pageGroup
  }

  get pageGroups() {
    return this._pageGroups.filter((pg) => pg.isDelete !== true)
  }

  get color() {
    if (this._isInit) {
      return this._boardCvs.drawColor
    }
  }

  get lineWidth() {
    if (this._isInit) {
      this._boardCvs.lineWidth
    }
  }

  get $el() {
    if (!this._$el) {
      this._$el = $(`#${this._domId}`)
    }
    return this._$el
  }

  async init(opts = {}) {
    super.init(opts)
    if (opts.hasOwnProperty('domId')) {
      this._domId = opts.domId
      // this._$el = $(`#${this._domId}`);
    } else {
      throw ErrorMsg.WHITE_BOARD_DOM_ID_NONE
    }
    const courseWareList = Array.isArray(opts.courseWareList) ? opts.courseWareList : []
    this._userId = opts.userId

    this._$wbDom = this.$el.find('#dxzWb')
    if (this._$wbDom.length === 0) {
      this._$wbDom = $(
        '<div id="dxzWb" style="background-color: white;width: 100%;height: 100%;display: flex;align-items: center;justify-content: center;">' +
          '<canvas style="width: 100%;height: 100%;">浏览器不支持canvas</canvas></div>'
      )
      this.$el.html(this._$wbDom)
    }

    this._boardCvs = CanvasHandler.getObject()
    opts.hasOwnProperty('color') && opts.color && (this._boardCvs.drawColor = opts.color)
    // call this after white board init.
    this.enable = opts.hasOwnProperty('enable') ? opts.enable : true

    this._pageGroups = []
    this._pageGroup = new PageGroup()
    this._pageGroup.init({
      id: -1,
      name: 'whiteboard',
      state: PageGroupState.Done
    })
    this._pageGroup.add({
      pageId: 1,
      url: '',
      status: PAGE_STATUS.ACTIVE
    })
    this._pageGroups.push(this._pageGroup)
    this.updateCourseWare(courseWareList)
    this._pageGroup.updateCanvasGroupInfo()
    this._pageGroup.drawCurrentPage()
    this.bind()
    // await syncWhiteboardRequest(this._roomId)
    const syncWbMsg = SyncWhiteboard(this._userId)
    await this.sendMessage(syncWbMsg)
    this._isInit = true
  }

  destroy() {
    super.destroy()
    if (this._cvs_check_timer) {
      clearInterval(this._cvs_check_timer)
      this._cvs_check_timer = null
    }
    this.removeBoardCvsEvents()
    this._boardCvs && this._boardCvs.destroy()
    this._$el = null
    this._pageGroups = []
    $(window).off('resize', this.onResize)
  }

  /**
   * 清除当前组当前页上的全部描画
   */
  clearAll() {
    if (!this._isInit) {
      console.warn('[DxzWhiteBoard]-[clearAll] whiteboard must be init first before use')
      return
    }
    if (!this._usable || !this.enable) {
      return
    }
    const message = PageClean(this._pageGroup.id, this._pageGroup.currentPage.id)
    this.send(message)
  }

  /**
   * 设置线条颜色
   * @param color - rgb or hex
   */
  setColor(color) {
    if (!this._isInit) {
      console.warn('[DxzWhiteBoard]-[setColor] whiteboard must be init first before use')
      return
    }
    if (!this._usable || !this.enable) {
      return
    }
    this._boardCvs.drawColor = getHexBackgroundColor(color)
  }

  getColor() {
    return this._boardCvs.drawColor
  }

  /**
   * 设置线条粗细
   * @param width - string or int
   */
  setLineWidth(width) {
    if (!this._isInit) {
      console.warn(
        '[DxzWhiteBoard]-[setLineWidth] whiteboard must be init first before use'
      )
      return
    }
    if (!this._usable || !this.enable) {
      return
    }
    if (!width) {
      return
    }
    width = typeof width === 'string' ? parseInt(width) : width
    this._boardCvs.lineWidth = width
  }

  drawShape(polygon, className) {
    if (!this._isInit) {
      console.warn('[DxzWhiteBoard]-[drawShape] whiteboard must be init first before use')
      return
    }
    if (!this._usable || !this.enable) {
      return
    }
    this._boardCvs.polygon = polygon
    this._boardCvs.delete = false
    this._boardCvs.className = className
    this.updateCursor()
  }

  /**
   * 描画线条
   */
  drawLine() {
    this.drawShape(0, 'canvas-line')
  }

  /**
   * 描画直线
   */
  drawStraightLine() {
    this.drawShape(2, 'canvas-straightLine')
  }

  /**
   * 描画长方形
   */
  drawRectangle() {
    this.drawShape(4, 'canvas-rect')
  }

  /**
   * 描画圆形
   */
  drawRound() {
    this.drawShape(100, 'canvas-round')
  }

  /**
   * 描画文字
   * @param text
   */
  drawText(text) {
    if (!this._isInit) {
      console.warn('[DxzWhiteBoard]-[drawText] whiteboard must be init first before use')
      return
    }
    if (!this._usable || !this.enable) {
      return
    }
    if (!text) {
      this._boardCvs.content = ''
    } else {
      this._boardCvs.content = text
      this.updateCursor('canvas-text')
    }
    this._boardCvs.delete = false
    if (this._boardCvs.className === 'canvas-delete') {
      this._boardCvs.className = 'canvas-line'
      this._boardCvs.polygon = 0
    }
  }

  /**
   * 设置删除功能开始或关闭
   */
  switchDelete() {
    if (!this._isInit) {
      console.warn(
        '[DxzWhiteBoard]-[switchDelete] whiteboard must be init first before use'
      )
      return
    }
    if (!this._usable || !this.enable) {
      return
    }
    this._boardCvs.delete = !this._boardCvs.delete
    if (this._boardCvs.delete) {
      if (this._boardCvs.className && this._boardCvs.className !== 'canvas-delete') {
        this._boardCvs.tempClass = this._boardCvs.className
      }
      this._boardCvs.className = 'canvas-delete'
    } else {
      this._boardCvs.className = this._boardCvs.tempClass
    }
    this.updateCursor()
  }

  /**
   * 撤销本次描画
   */
  undo() {
    if (!this._isInit) {
      console.warn('[DxzWhiteBoard]-[undo] whiteboard must be init first before use')
      return
    }
    if (!this._usable || !this.enable) {
      return
    }
    // let targetId = this._pageGroup.getRevokeTargetId();
    // if (!targetId) return false;
    // const message = Revoke(this._pageGroup.id, this._pageGroup.currentPage.id, targetId);

    const id = this._boardCvs.getLastOptId()
    if (!id) return
    const message = Delete(id, this._pageGroup.id, this._pageGroup.currentPage.id)
    this.send(message)
  }

  /**
   * 为当前组添加新页
   */
  addPage() {
    if (!this._isInit) {
      console.warn('[DxzWhiteBoard]-[addPage] whiteboard must be init first before use')
      return
    }
    if (!this._usable || !this.enable) {
      return
    }
    this._pageGroup.add()
    const message = Page(
      this._pageGroup.name,
      this._pageGroup.id,
      this._pageGroup.totalCnt
    )
    this.send(message)
  }

  /**
   * 为当前组添加新页
   * @param pg - 组对象
   */
  changePageGroup(pg) {
    if (!this._isInit) {
      console.warn(
        '[DxzWhiteBoard]-[changePageGroup] whiteboard must be init first before use'
      )
      return
    }
    if (!this._usable || !this.enable || !pg) {
      return
    }
    this._pageGroup = pg
    // this._pageGroup.pageNo = 1;
    this.resizeCanvas()
    this._pageGroup.updateCanvasGroupInfo()
    this._pageGroup.drawCurrentPage()
    const msg = CourseWareLoad(
      this._pageGroup.id,
      this._pageGroup.currentPage.id,
      this._pageGroup.pageCnt
    )
    this.sendMessage(msg)
    this._eventTrigger.trigger(ExternalEvents.WB.PAGE_GROUP_CHANGE, [
      this._pageGroup.id,
      this._pageGroup.pageNo,
      this._pageGroup.pageCnt
    ])
  }

  /**
   * 为当前组添加新页
   * @param groupId - 组ID
   */
  changePageGroupById(groupId) {
    if (!this._isInit) {
      console.warn(
        '[DxzWhiteBoard]-[changePageGroupById] whiteboard must be init first before use'
      )
      return
    }
    if (!this._usable || !this.enable) {
      return
    }
    const pg = this._pageGroups.find((group) => group.id === groupId)
    if (pg) {
      this.changePageGroup(pg)
    }
  }

  goToPage(pageId) {
    if (!this._isInit) {
      console.warn('[DxzWhiteBoard]-[goToPage] whiteboard must be init first before use')
      return
    }
    if (!this._usable || !this.enable || !pageId) {
      return
    }
    const message = PageChange(this._pageGroup.id, pageId)
    this.send(message)
  }

  /**
   * 切换到当前页组第一页
   */
  goToFirstPage() {
    this.goToPage(this._pageGroup.first())
  }

  /**
   * 切换到当前页组最后一页
   */
  goToLastPage() {
    this.goToPage(this._pageGroup.last())
  }

  /**
   * 切换到当前页组前一页
   */
  goToPrevPage() {
    this.goToPage(this._pageGroup.previous())
  }

  /**
   * 切换到当前页组后一页
   */
  goToNextPage() {
    this.goToPage(this._pageGroup.next())
  }

  /**
   * 切换到组内任意一页
   * @param pageNo - 页码，必须在有效范围内
   */
  goToAnyPage(pageNo) {
    this.goToPage(this._pageGroup.any(pageNo))
  }

  /**
   * 设置白板使用状态
   * @param status - true(可用)｜false(不可用)
   */
  setWhiteBoardState(status) {
    if (!this._isInit) {
      return
    }
    this.enable = status
  }

  /**
   * 切换白板使用状态
   */
  switchWhiteBoardState() {
    if (!this._isInit) {
      return
    }
    this.enable = !this.enable
  }

  /**
   * 更新课件，创建课件组
   * @param courseWareList - 课件列表
   */
  updateCourseWare(courseWareList) {
    for (const course of courseWareList) {
      const idx = this._pageGroups.findIndex((p) => p.id === course.id)
      if (idx === -1) {
        let pg = new PageGroup()
        let initOpts = {
          id: course.id,
          name: course.name,
          state: course.status,
          delete: course.delete
        }
        if (course.status === PageGroupState.Done) {
          initOpts.course = course.pic_list
        }
        pg.init(initOpts)
        this._pageGroups.push(pg)
      } else {
        this._pageGroups[idx].isDelete = course.delete
        if (!course.delete && course.status !== this._pageGroups[idx].state) {
          this._pageGroups[idx].state = course.status
          if (course.status === PageGroupState.Done) {
            this._pageGroups[idx].addPages(course.pic_list)
          }
        }
      }
    }
  }

  /**
   * 手动resize白板区域
   */
  resize() {
    this.onResize()
  }

  bind() {
    $(window).resize(() => {
      this.onResize()
    })

    this.$el.resize(() => {
      this.onResize()
    })

    this._$wbDom.ready(() => {
      this.onResize()
    })

    this.bindBoardCvsEvents()
    this.bindRtmEvents()
  }

  bindBoardCvsEvents() {
    if (this._boardCvs) {
      this._boardCvs.on(WbEvents.DRAW_START, () => {
        this._eventTrigger.emitEvent(ExternalEvents.WB.DRAW_START)
      })
      this._boardCvs.on(WbEvents.SEND_MESSAGE, (txt) => {
        this.send(txt)
      })
    }
  }

  removeBoardCvsEvents() {
    this._boardCvs.removeEvent(WbEvents.DRAW_START)
    this._boardCvs.removeEvent(WbEvents.SEND_MESSAGE)
  }

  bindRtmEvents() {
    if (this._rtm) {
      this._rtm.on(
        LvbEngine.RTMEvents.WHITEBOARD_MESSAGE,
        (senderId, roomId, content, msgType) => {
          if (msgType === LvbEngine.RTMMessageType.Room && this._roomId !== roomId) return
          content = JSON.parse(content)
          const memberId = typeof senderId === 'string' ? parseInt(senderId) : senderId
          this.onMessage({ ...content, memberId })
        }
      )
    }
  }

  onResize() {
    let tryCnt = 5
    this._cvs_check_timer = setInterval(() => {
      let visualW = this.$el.get(0).clientWidth
      let visualH = this.$el.get(0).clientHeight
      if (visualW !== 0 && visualH !== 0) {
        // if (this._pageGroup && this._pageGroup.id !== -1) {
        //     const imgW = this._pageGroup.imgW;
        //     const imgH = this._pageGroup.imgH;
        //     if (imgW > imgH) {
        //         visualH = visualW * imgH / imgW;
        //     } else {
        //         visualW = visualH * imgW / imgH;
        //     }
        // }
        this._boardCvs.cvsW = visualW
        this._boardCvs.cvsH = visualH
        this._pageGroup.draw()
        // this._pageGroup.drawCurrentPage();
        tryCnt = 0
      }
      if (tryCnt <= 0) {
        clearInterval(this._cvs_check_timer)
        this._cvs_check_timer = null
      } else {
        tryCnt--
      }
    }, 100)
  }

  resizeCanvas() {
    let visualW, visualH

    // if (!this._pageGroup || this._pageGroup.id === -1) {
    //     visualW = this._$el.get(0).clientWidth;
    //     visualH = this._$el.get(0).clientHeight;
    // } else {
    //     const imgW = this._pageGroup.imgW;
    //     const imgH = this._pageGroup.imgH;
    //     if (imgW > imgH) {
    //         visualW = this._$el.get(0).clientWidth;
    //         visualH = visualW * imgH / imgW;
    //     } else {
    //         visualH = this._$el.get(0).clientHeight;
    //         visualW = visualH * imgW / imgH;
    //     }
    // }
    visualW = this.$el.get(0).clientWidth
    visualH = this.$el.get(0).clientHeight
    this._boardCvs.cvsW = visualW
    this._boardCvs.cvsH = visualH
    if (this._resizeTimer) {
      clearInterval(this._resizeTimer)
      this._resizeTimer = null
    }
    if (this._pageGroup && this._pageGroup.currentPage) {
      this._pageGroup.draw()
    } else {
      this._resizeTimer = setInterval(() => {
        if (this._pageGroup && this._pageGroup.currentPage) {
          clearInterval(this._resizeTimer)
          this._resizeTimer = null
          this._pageGroup.draw()
        }
      }, 50)
    }
  }

  onMessage(message) {
    switch (message.kind) {
      case messageType.MESSAGE_CONTROL:
        this.handleControlMessage(message)
        break
      case messageType.MESSAGE_DRAWING:
        this.handleDrawingMessage(message)
        break
    }
  }

  onControlUpdateMessage(message) {
    if (
      message.updateType === controlUpdateMessageType.UPDATE_WHITEBOARD &&
      this._roomId.toString() === message.roomId.toString()
    ) {
      const gId = message.groupId
      let idx = this._pageGroups.findIndex((group) => group.id === gId)
      if (idx === -1) {
        let pageGroup = new PageGroup()
        pageGroup.init({
          id: gId,
          name: message.name,
          state: PageGroupState.Done
        })
        this._pageGroups.push(pageGroup)
        idx = this._pageGroups.length - 1
      } else {
        this._pageGroups[idx].state = PageGroupState.Done
      }
      let pageGroup = this._pageGroups[idx]
      if (message.groupState === PAGE_STATUS.ACTIVE && this._pageGroups.id !== gId) {
        this._pageGroup = pageGroup
        this.resizeCanvas()
      }
      let isPageActive = false
      for (let i = 0; i < message.pages.length; i++) {
        let page = message.pages[i]
        page = typeof page === 'string' ? JSON.parse(page) : page
        // if (page.state === PAGE_STATUS.ACTIVE) {
        //     this._pageGroup = pageGroup;
        //     this.resizeCanvas();
        // }
        pageGroup.update({
          pageId: page.pageId,
          url: page.url,
          data: page.data,
          revokes: page.revokes,
          status: page.state
        })
        if (page.state === PAGE_STATUS.ACTIVE) {
          pageGroup.pageNo = i + 1
          isPageActive = true
        }
      }
      if (message.groupState === PAGE_STATUS.PREV_ACTIVE) {
        if (pageGroup.pages.length === message.pageCount) {
          this._eventTrigger.trigger(ExternalEvents.WB.PREV_ACTIVE_PG_COMPLETE, [
            pageGroup.id
          ])
        }
      } else if (message.groupState === PAGE_STATUS.ACTIVE) {
        if (pageGroup.pages.length === message.pageCount) {
          this._pageGroup = pageGroup
          this._eventTrigger.trigger(ExternalEvents.WB.UPDATE_WHITEBOARD_COMPLETE, [
            pageGroup.id
          ])
        }
        if (isPageActive) {
          pageGroup.drawAll()
          this._eventTrigger.trigger(ExternalEvents.WB.PAGE_GROUP_CHANGE, [
            this._pageGroup.id,
            this._pageGroup.pageNo,
            message.pageCount
          ])
        }
      }
    } else if (message.updateType === controlUpdateMessageType.UPDATE_COURSEWARE_STATE) {
      getAllCourseWareListRequest(this._roomId)
        .then(({ data }) => {
          this.updateCourseWare(data)
          this._eventTrigger.emitEvent(ExternalEvents.WB.COURSEWARE_UPDATED)
        })
        .catch()
    }
  }

  handleControlMessage(message) {
    switch (message.type) {
      case controlMessageType.CONTROL_UPDATE:
        this.onControlUpdateMessage(message)
        break
      case controlMessageType.CONTROL_LOAD_COURSEWARE:
        {
          const pageGroup = this._pageGroups.find((pg) => pg.id === message.groupId)
          if (pageGroup) {
            this._pageGroup = pageGroup
            // this._pageGroup.pageNo = 1;
            this._pageGroup.pageNo = this._pageGroup.getPageNoByPageId(message.pageId)
            this.resizeCanvas()
            this._pageGroup.updateCanvasGroupInfo()
            this._pageGroup.drawCurrentPage()
            this._eventTrigger.trigger(ExternalEvents.WB.PAGE_GROUP_CHANGE, [
              this._pageGroup.id,
              this._pageGroup.pageNo,
              this._pageGroup.pageCnt
            ])
          }
        }
        break
    }
  }

  handleDrawingMessage(message) {
    switch (message.type) {
      case drawingMessageType.DRAWING_LINE:
      case drawingMessageType.DRAWING_STRAIGHT_LINE:
      case drawingMessageType.DRAWING_RECT:
      case drawingMessageType.DRAWING_ROUND:
      case drawingMessageType.DRAWING_TEXT:
      case drawingMessageType.DRAWING_DELETE:
      case drawingMessageType.DRAWING_IMAGE:
      case drawingMessageType.DRAWING_REVOKE:
        if (
          message.groupId === this._pageGroup.id &&
          message.pageId === this._pageGroup.currentPage.id
        ) {
          this._pageGroup.draw(message)
        } else {
          this._pageGroup.updatePageByPageId(message)
        }
        break
      case drawingMessageType.DRAWING_REVOKE_ON:
      case drawingMessageType.DRAWING_REVOKE_OFF:
        break
      case drawingMessageType.DRAWING_CLEARALL:
        if (
          message.groupId === this._pageGroup.id &&
          message.pageId === this._pageGroup.currentPage.id
        ) {
          this._pageGroup.clearAll(message)
        } else {
          this._pageGroup.clearAllByPageId(message)
        }
        break
      case drawingMessageType.DRAWING_PAGE:
        {
          const pageGroup = this._pageGroups.find((page) => page.id === message.groupId)
          if (pageGroup) {
            this._pageGroup = pageGroup
            let idx = this._pageGroup.getPageNoByPageId(message.id)
            if (idx === -1) {
              this._pageGroup.add({
                pageId: message.id
              })
              idx = this._pageGroup.getPageNoByPageId(message.id)
            }
            this._pageGroup.goTo(idx)
            this._eventTrigger.trigger(ExternalEvents.WB.PAGE_CHANGE, [
              this._pageGroup.id,
              this._pageGroup.pageNo,
              this._pageGroup.pageCnt
            ])
          }
        }
        break
      case drawingMessageType.DRAWING_PAGE_CHANGE:
        {
          const pageGroup = this._pageGroups.find((pg) => pg.id === message.groupId)
          if (pageGroup) {
            this._pageGroup = pageGroup
            const idx = this._pageGroup.getPageNoByPageId(message.id)
            if (idx !== -1 && this._pageGroup.pageNo !== idx) {
              this.resizeCanvas()
              this._pageGroup.goTo(idx)
              this._eventTrigger.trigger(ExternalEvents.WB.PAGE_CHANGE, [
                this._pageGroup.id,
                this._pageGroup.pageNo,
                this._pageGroup.pageCnt
              ])
            }
          }
        }
        break
      case drawingMessageType.DRAWING_PAGE_DELETE:
        break
    }
  }

  async send(data) {
    this.sendMessage(data)
    if (typeof data === 'string') {
      data = JSON.parse(data)
    }
    return this.onMessage(data)
  }

  updateCursor(clazzName) {
    if (this._boardCvs) {
      this._boardCvs.updateCursor(clazzName)
    }
  }
}

/**
 * @description Event of whiteboard
 * @type {{PAGE_GROUP_CHANGE: string, COURSEWARE_UPDATED: string, UPDATE_WHITEBOARD_COMPLETE: string, PAGE_CHANGE: string, USER_WB_STATE_CHANGE: string, DRAW_START: string, PREV_ACTIVE_PG_COMPLETE: string}}
 */
WhiteBoard.WBEvents = ExternalEvents.WB
