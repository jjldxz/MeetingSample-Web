import EventEmitter from 'wolfy87-eventemitter'
import { drawingMessageType } from '../../common'
import CanvasHandler from './canvasHandler'

export default class Canvas extends EventEmitter {
  constructor() {
    super()
    this._container = {
      selected: {
        id: '',
        key: '',
        extensionWidth: 1,
        lineColor: 'red' //'#00ff00'
      },
      session: {}
    }
    this._revokeContainer = {
      revokeSession: [],
      revokeSize: 20,
      revokeEnable: true,
      updateRevoke: false
    }
    this._canvasHandler = CanvasHandler.getObject()
  }

  set delete(del) {
    if (this._canvasHandler) {
      this._canvasHandler.delete = del
    }
  }

  get delete() {
    if (this._canvasHandler) {
      return this._canvasHandler.delete
    }
  }

  set inDrawing(draw) {
    if (this._canvasHandler) {
      this._canvasHandler.drawing = draw
    }
  }

  get inDrawing() {
    if (this._canvasHandler) {
      return this._canvasHandler.inDrawing
    }
  }

  set newStoke(stoke) {
    if (this._canvasHandler) {
      this._canvasHandler.newStroke = stoke
    }
  }

  get newStoke() {
    if (this._canvasHandler) {
      return this._canvasHandler.newStroke
    }
  }

  get container() {
    return this._container
  }

  set canDraw(draw) {
    if (this._canvasHandler) {
      this._canvasHandler.canDraw = draw
    }
  }

  get canDraw() {
    if (this._canvasHandler) {
      return this._canvasHandler.canDraw
    }
  }

  set cvsW(w) {
    if (this._canvasHandler) {
      this._canvasHandler.cvsW = w
    }
  }

  get cvsW() {
    if (this._canvasHandler) {
      return this._canvasHandler.cvsW
    }
  }

  set cvsH(h) {
    if (this._canvasHandler) {
      this._canvasHandler.cvsH = h
    }
  }

  get cvsH() {
    if (this._canvasHandler) {
      return this._canvasHandler.cvsH
    }
  }

  set lineWidth(w) {
    if (this._canvasHandler) {
      this._canvasHandler.lineWidth = w
    }
  }

  get lineWidth() {
    if (this._canvasHandler) {
      return this._canvasHandler.lineWidth
    }
  }

  set drawColor(color) {
    if (this._canvasHandler) {
      this._canvasHandler.drawColor = color
    }
  }

  get drawColor() {
    if (this._canvasHandler) {
      return this._canvasHandler.drawColor
    }
  }

  set polygon(pol) {
    if (this._canvasHandler) {
      this._canvasHandler.polygon = pol
    }
  }

  get polygon() {
    if (!this._canvasHandler) return
    return this._canvasHandler.polygon
  }

  set className(name) {
    if (!this._canvasHandler) return
    this._canvasHandler.className = name
  }

  get className() {
    if (!this._canvasHandler) return
    return this._canvasHandler.className
  }

  set tempClass(name) {
    if (!this._canvasHandler) return
    this._canvasHandler.tempClass = name
  }

  get tempClass() {
    if (!this._canvasHandler) return
    return this._canvasHandler.tempClass
  }

  set content(con) {
    if (!this._canvasHandler) return
    this._canvasHandler.content = con
  }

  get content() {
    if (!this._canvasHandler) return
    return this._canvasHandler.content
  }

  pushRevokeStack(d) {
    if (!this._revokeContainer.revokeEnable) return
    for (let item of this._revokeContainer.revokeSession) {
      if (item.id === d.id) {
        return
      }
    }

    if (
      d.type === drawingMessageType.DRAWING_CLEARALL &&
      this._revokeContainer.revokeSession.length > 0 &&
      this._revokeContainer.revokeSession[this._revokeContainer.revokeSession.length - 1]
        .type === drawingMessageType.DRAWING_CLEARALL
    ) {
      return
    }
    let item = {
      type: d.type,
      time: d.time,
      id: d.id,
      targetId: d.targetId,
      session: {}
    }
    if (d.type === drawingMessageType.DRAWING_DELETE) {
      item.session[d.targetId] = this._container.session[d.targetId]
    } else if (d.type === drawingMessageType.DRAWING_CLEARALL) {
      item.session = this._container.session
    }
    if (this._revokeContainer.revokeSession.length < this._revokeContainer.revokeSize) {
      this._revokeContainer.revokeSession.push(item)
    } else {
      this._revokeContainer.revokeSession.shift()
      this._revokeContainer.revokeSession.push(item)
    }
  }

  clearRevokeList() {
    this._revokeContainer.revokeSession = []
  }

  updateRevokeList(msg) {
    if (!this._revokeContainer.revokeEnable) return

    if (!this._revokeContainer.updateRevoke) {
      this._revokeContainer.updateRevoke = true
      this.clearRevokeList()
    }
    const i = this._revokeContainer.revokeSession.findIndex((sess) => {
      return msg.id === sess.id && msg.type === sess.type && msg.time === sess.time
    })
    if (i === -1) {
      this._revokeContainer.revokeSession.push(msg)
    } else {
      if (msg.type === drawingMessageType.DRAWING_DELETE) {
        for (let key in msg.session) {
          let line = this._revokeContainer.revokeSession[i].session[key]
          line.points = [...line.points, ...msg.session[key].points]
          line.lineColor = msg.session[key].lineColor
          line.lineWidth = msg.session[key].lineWidth
          line.time = msg.session[key].time
        }
      } else if (msg.type === drawingMessageType.DRAWING_CLEARALL) {
        for (let key in msg.session) {
          let value = msg.session[key]
          if (value.type === drawingMessageType.DRAWING_LINE) {
            if (!this._revokeContainer.revokeSession[i].session[key]) {
              this._revokeContainer.revokeSession[i].session[key] = value
            } else {
              let line = this._revokeContainer.revokeSession[i].session[key]
              line.points = [...line.points, ...value.points]
              line.lineColor = value.lineColor
              line.lineWidth = value.lineWidth
              line.time = value.time
            }
          } else {
            this._revokeContainer.revokeSession[i].session[key] = value
          }
        }
      }
    }
  }

  getRevokeTargetId() {
    if (!this._revokeContainer.revokeEnable) return
    let arrayLength = this._revokeContainer.revokeSession.length
    if (arrayLength === 0) return
    this._revokeContainer.revokeSession = this._revokeContainer.revokeSession.sort(
      (a, b) => {
        return a.time - b.time
      }
    )
    let item = this._revokeContainer.revokeSession[arrayLength - 1]
    return item.id
  }

  updateContainerInfo(msg) {
    if (msg.type === drawingMessageType.DRAWING_REVOKE) {
      let item,
        itemKey = -1
      for (let i = 0; i < this._revokeContainer.revokeSession.length; i++) {
        if (msg.targetId === this._revokeContainer.revokeSession[i].id) {
          item = this._revokeContainer.revokeSession[i]
          itemKey = i
        }
      }
      if (item) {
        if (item.type === drawingMessageType.DRAWING_DELETE) {
          for (let key in item.session) {
            this._container.session[key] = item.session[key]
          }
        } else if (item.type === drawingMessageType.DRAWING_CLEARALL) {
          this._container.session = item.session
        } else {
          delete this._container.session[item.id]
        }
      }
      if (itemKey > -1) {
        this._revokeContainer.revokeSession.splice(itemKey, 1)
      }
    } else if (msg.type === drawingMessageType.DRAWING_DELETE) {
      this.pushRevokeStack(msg)
      delete this._container.session[msg.targetId]
    } else if (msg.type === drawingMessageType.DRAWING_LINE) {
      if (!this._container.session[msg.id]) {
        this._container.session[msg.id] = msg
        this.pushRevokeStack(msg)
      } else {
        let line = this._container.session[msg.id]
        line.points = [...line.points, ...msg.points]
        line.lineColor = msg.lineColor
        line.lineWidth = msg.lineWidth
        line.time = msg.time
      }
    } else {
      this.pushRevokeStack(msg)
      this._container.session[msg.id] = msg
    }
  }

  drawing(msg) {
    if (msg) {
      this.updateContainerInfo(msg)
    }
    this.draw() // Repaint canvas
  }

  clearSession() {
    this._container.session = {}
  }

  clearAll(msg, canDraw = true) {
    // if (!this._canvasHandler.canDraw) {
    //     return;
    // }
    this.pushRevokeStack(msg)
    this.clearSession()
    this._canvasHandler.container = this._container
    if (canDraw) {
      this.draw()
    }
  }

  // ========================== 更新鼠标样式
  updateCursor(clazzName) {
    this._canvasHandler.updateCursor(clazzName)
  }

  getLastOptId() {
    return this._canvasHandler.getLastOptId()
  }

  drawingCourse(url) {
    this._canvasHandler.drawingCourse(url)
  }

  draw() {
    this._canvasHandler.container = this._container
    this._canvasHandler.draw()
  }

  updateCanvasGroupInfo(groupId, pageId) {
    this._canvasHandler.groupId = groupId
    this._canvasHandler.pageId = pageId
  }
}
