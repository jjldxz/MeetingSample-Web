import EventEmitter from 'wolfy87-eventemitter'
import $ from 'jquery'
import { WbEvents } from './commonDef'
import { drawingMessageType } from '../../common'
import { Delete, Line, Rect, Round, StraightLine, Text } from '../../common'
import { textSize, getFontSize } from './utils'

let handler = null

export default class CanvasHandler extends EventEmitter {
  static getObject() {
    if (!handler) {
      handler = new CanvasHandler()
      handler.init()
    }
    return handler
  }

  destroy() {
    handler = null
  }

  static getColor() {
    let colorValue = '0,1,2,3,4,5,6,7,8,9,a,b,c,d,e,f'
    let colorArray = colorValue.split(',')
    let color = '#'
    for (let i = 0; i < 6; i++) {
      color += colorArray[Math.floor(Math.random() * 16)]
    }
    return color
  }

  constructor() {
    super()
    this._$el = null
    this._cxt = null
    this._canDraw = false
    this._delete = false
    this._className = 'canvas-line'
    this._tempClass = 'canvas-line'
    this._newStroke = true
    this._inDrawing = false
    this._cvsH = 0
    this._cvsW = 0
    this._lineWidth = 4
    this._drawColor = CanvasHandler.getColor()
    this._content = ''
    this._polygon = 0
    this._container = {}
    this._pageId = 0
    this._groupId = -1
  }

  set container(con) {
    this._container = con
  }

  set pageId(id) {
    this._pageId = id
  }

  set groupId(id) {
    this._groupId = id
  }

  set lineWidth(w) {
    this._lineWidth = w
  }

  get lineWidth() {
    return this._lineWidth
  }

  set drawColor(color) {
    this._drawColor = color
  }

  get drawColor() {
    return this._drawColor
  }

  set delete(del) {
    this._delete = del
  }

  get delete() {
    return this._delete
  }

  set inDrawing(state) {
    this._drawing = state
  }

  get inDrawing() {
    return this._inDrawing
  }

  set newStoke(stoke) {
    this._newStroke = stoke
  }

  get newStoke() {
    return this._newStroke
  }

  get el() {
    return this._$el
  }

  set cvsW(w) {
    if (this._$el) {
      this._$el.get(0).width = w
      this._$el.css('width', `${w}px`)
    }
    this._cvsW = w
  }

  get cvsW() {
    return this._cvsW
  }

  set cvsH(h) {
    if (this._$el) {
      this._$el.get(0).height = h
      this._$el.css('height', `${h}px`)
    }
    this._cvsH = h
  }

  get cvsH() {
    return this._cvsH
  }

  set content(con) {
    if (typeof con !== 'string') {
      con = con.toString()
    }
    this._content = con
  }

  get content() {
    return this._content
  }

  set polygon(pol) {
    this._polygon = pol
  }

  get polygon() {
    return this._polygon
  }

  set className(name) {
    this._className = name
  }

  get className() {
    return this._className
  }

  set tempClass(name) {
    this._tempClass = name
  }

  get tempClass() {
    return this._tempClass
  }

  set canDraw(draw) {
    if (draw) {
      this.updateCursor()
    } else {
      this.updateCursor('canvas-default')
    }
    this._canDraw = draw
  }

  get canDraw() {
    return this._canDraw
  }

  init() {
    this._$el = $('#dxzWb canvas')
    this._cxt = this._$el.get(0).getContext('2d')
    this.bind()
  }

  isContained(drawInfo, currentPos) {
    const offset = this._$el.offset()
    let clientX = currentPos.clientX
    let clientY = currentPos.clientY
    if (currentPos.handleObj.type === 'touchmove') {
      clientX = currentPos.touches[0].clientX
      clientY = currentPos.touches[0].clientY
    }
    const x = clientX + document.body.scrollLeft - document.body.clientLeft - offset.left
    const y = clientY + document.body.scrollTop - document.body.clientTop - offset.top
    let mHalf = 5
    let ret = false
    switch (drawInfo.type) {
      case drawingMessageType.DRAWING_LINE: {
        // line
        let prevPoint = drawInfo.points[0]
        for (const point of drawInfo.points) {
          let lineLength = Math.sqrt(
            Math.pow(Math.abs(point.x * this._cvsW - prevPoint.x * this._cvsW), 2) +
              Math.pow(Math.abs(point.y * this._cvsH - prevPoint.y * this._cvsH), 2)
          )
          if (lineLength <= mHalf * 2) {
            if (
              x < point.x * this._cvsW + mHalf * 2 &&
              x > point.x * this._cvsW - mHalf * 2 &&
              y < point.y * this._cvsH + mHalf * 2 &&
              y > point.y * this._cvsH - mHalf * 2
            ) {
              ret = true
            }
          } else {
            let mStartLength = Math.sqrt(
              Math.pow(Math.abs(x - point.x * this._cvsW), 2) +
                Math.pow(Math.abs(y - point.y * this._cvsH), 2)
            )
            let mEndLength = Math.sqrt(
              Math.pow(Math.abs(x - prevPoint.x * this._cvsW), 2) +
                Math.pow(Math.abs(y - prevPoint.y * this._cvsH), 2)
            )
            let ratio = 1.01
            if (
              (mStartLength + mEndLength) / lineLength >= 1 &&
              (mStartLength + mEndLength) / lineLength < ratio
            ) {
              ret = true
            }
          }
          prevPoint = point
        }
        break
      }
      case drawingMessageType.DRAWING_STRAIGHT_LINE: {
        // Straight line
        const lineLength = Math.sqrt(
            Math.pow(
              Math.abs(drawInfo.startDot.x * this._cvsW - drawInfo.endDot.x * this._cvsW),
              2
            ) +
              Math.pow(
                Math.abs(
                  drawInfo.startDot.y * this._cvsH - drawInfo.endDot.y * this._cvsH
                ),
                2
              )
          ),
          mStartLength = Math.sqrt(
            Math.pow(Math.abs(x - drawInfo.startDot.x * this._cvsW), 2) +
              Math.pow(Math.abs(y - drawInfo.startDot.y * this._cvsH), 2)
          ),
          mEndLength = Math.sqrt(
            Math.pow(Math.abs(x - drawInfo.endDot.x * this._cvsW), 2) +
              Math.pow(Math.abs(y - drawInfo.endDot.y * this._cvsH), 2)
          )
        let ratio = 1.01
        if (lineLength < 100) {
          ratio = 1.01
        } else if (lineLength < 200) {
          ratio = 1.005
        } else if (lineLength < 400) {
          ratio = 1.001
        } else if (lineLength < 800) {
          ratio = 1.0005
        } else {
          ratio = 1.0001
        }
        if (
          (mStartLength + mEndLength) / lineLength > 1 &&
          (mStartLength + mEndLength) / lineLength < ratio
        ) {
          ret = true
        }
        break
      }
      case drawingMessageType.DRAWING_ROUND: {
        // Round
        const sideLength = {
          x: Math.abs(drawInfo.endDot.x - drawInfo.startDot.x),
          y: Math.abs(drawInfo.endDot.y - drawInfo.startDot.y)
        }
        const r = Math.sqrt(
          Math.pow(sideLength.x * this._cvsW, 2) + Math.pow(sideLength.y * this._cvsH, 2)
        )
        if (
          Math.abs(
            Math.sqrt(
              Math.pow(Math.abs(drawInfo.startDot.x * this._cvsW - x), 2) +
                Math.pow(Math.abs(drawInfo.startDot.y * this._cvsH - y), 2)
            ) - r
          ) < mHalf
        ) {
          ret = true
        }
        break
      }
      case drawingMessageType.DRAWING_RECT: {
        // Rectangle
        const sideLength = {
          x: Math.abs(drawInfo.endDot.x - drawInfo.startDot.x),
          y: Math.abs(drawInfo.endDot.y - drawInfo.startDot.y)
        }
        const oHalfWidth = (sideLength.x * this._cvsW) / 2,
          oHalfHeight = (sideLength.y * this._cvsH) / 2,
          oCenter = {
            x:
              drawInfo.startDot.x < drawInfo.endDot.x
                ? drawInfo.startDot.x * this._cvsW + oHalfWidth
                : drawInfo.startDot.x * this._cvsW - oHalfWidth,
            y:
              drawInfo.startDot.y < drawInfo.endDot.y
                ? drawInfo.startDot.y * this._cvsH + oHalfHeight
                : drawInfo.startDot.y * this._cvsH - oHalfHeight
          },
          distance = {
            x: Math.abs(oCenter.x - x),
            y: Math.abs(oCenter.y - y)
          }

        if (
          (Math.abs(distance.x - oHalfWidth) < mHalf &&
            distance.y < oHalfHeight + mHalf) ||
          (Math.abs(distance.y - oHalfHeight) < mHalf && distance.x < oHalfWidth + mHalf)
        ) {
          ret = true
        }
        break
      }
      case drawingMessageType.DRAWING_TEXT: {
        // Text
        const textWidth = this.getTextRectSize(o)
        if (
          x - drawInfo.startDot.x * this._cvsW < textWidth + mHalf &&
          x - drawInfo.startDot.x * this._cvsW > 0 - mHalf &&
          y - drawInfo.startDot.y * this._cvsH < drawInfo.lineWidth + mHalf &&
          y - drawInfo.startDot.y * this._cvsH > 0 - mHalf * drawInfo.lineWidth
        ) {
          ret = true
        }
        break
      }
      default:
        break
    }

    return ret
  }

  bind() {
    //  in canvas，mouse down event
    // this._$el.mousedown(event =>{
    this._$el.on('touchstart mousedown', (event) => {
      this.emitEvent(WbEvents.DRAW_START)
      // delete
      if (this._delete && this._container.selected.id) {
        const del = Delete(this._container.selected.id, this._groupId, this._pageId)
        this.emitEvent(WbEvents.SEND_MESSAGE, [{ ...del, finish: this._newStroke }])
        return false
      }
      if (!this._canDraw) {
        return
      }
      const offset = this._$el.offset()
      let clientX = event.clientX
      let clientY = event.clientY
      if (event.handleObj.type === 'touchstart') {
        clientX = event.touches[0].clientX
        clientY = event.touches[0].clientY
      }
      let startDot = {
        // x: (event.clientX + document.documentElement.scrollLeft + document.body.scrollLeft - offset.left) / this._cvsW,
        // y: (event.clientY + document.documentElement.scrollTop + document.body.scrollTop - offset.top) / this._cvsH
        x:
          (clientX + document.body.scrollLeft - document.body.clientLeft - offset.left) /
          this._cvsW,
        y:
          (clientY + document.body.scrollTop - document.body.clientTop - offset.top) /
          this._cvsH
      }
      let straightLine, rect, round, line
      if (typeof this._lineWidth === 'string') {
        this._lineWidth = parseInt(this._lineWidth)
      }
      // text
      if (this._content !== '') {
        // this._cxt.font = this._lineWidth * 10 + "px serif";
        // this._cxt.fillStyle = this._drawColor;
        // const contentSize = this._cxt.measureText(this._content);
        // const contentWidth = contentSize.width;
        // const contentHeight = contentSize.actualBoundingBoxAscent + contentSize.actualBoundingBoxDescent;
        const { width, height } = textSize(
          this._lineWidth * 10,
          'Microsoft YaHei',
          this._content
        )
        const text = Text(
          this._drawColor,
          this._lineWidth,
          this._content,
          startDot,
          this._groupId,
          this._pageId
        )
        this.emitEvent(WbEvents.SEND_MESSAGE, [
          {
            ...text,
            textW: width / this._cvsW,
            textH: height / this._cvsH,
            finish: this._newStroke
          }
        ])
        this.updateCursor(this._className)
        this._content = ''
        return false
      }
      // Straight line
      else if (this._polygon === 2) {
        straightLine = StraightLine(
          this._drawColor,
          this._lineWidth,
          startDot,
          startDot,
          this._groupId,
          this._pageId
        )
      }
      // Rectangle
      else if (this._polygon === 4) {
        rect = Rect(
          this._drawColor,
          this._lineWidth,
          startDot,
          startDot,
          { x: 0, y: 0 },
          this._groupId,
          this._pageId
        )
      }
      // Round
      else if (this._polygon === 100) {
        round = Round(
          this._drawColor,
          this._lineWidth,
          startDot,
          startDot,
          { x: 0, y: 0 },
          0,
          this._groupId,
          this._pageId
        )
      }
      // line
      else {
        line = Line(
          this._drawColor,
          this._lineWidth,
          [startDot],
          this._groupId,
          this._pageId
        )
      }

      this._inDrawing = true
      let lastTime = Date.now()
      //  in canvas，press mouse and move event
      // $(window).mousemove(event => {
      $(window).on('touchmove mousemove', (event) => {
        if (this._delete) {
          // Click down, and move, delete will be cancelled
          this._delete = false
          this.updateCursor(this._tempClass)
        }

        if (!this._inDrawing) return false
        if (Date.now() - lastTime < 20) return false
        lastTime = Date.now()

        event = event || window.event

        let clientX = event.clientX
        let clientY = event.clientY
        if (event.handleObj.type === 'touchmove') {
          clientX = event.touches[0].clientX
          clientY = event.touches[0].clientY
        }
        const endDot = {
          // x: (event.clientX + document.documentElement.scrollLeft + document.body.scrollLeft - offset.left) / this._cvsW,
          // y: (event.clientY + document.documentElement.scrollTop + document.body.scrollTop - offset.top) / this._cvsH
          x:
            (clientX +
              document.body.scrollLeft -
              document.body.clientLeft -
              offset.left) /
            this._cvsW,
          y:
            (clientY + document.body.scrollTop - document.body.clientTop - offset.top) /
            this._cvsH
        }

        // Straight line
        if (this._polygon === 2) {
          straightLine.endDot = endDot
          //return emit(straightLine);
          this.emitEvent(WbEvents.SEND_MESSAGE, [
            { ...straightLine, finish: this._newStroke }
          ])
        }
        // Rectangle
        else if (this._polygon === 4) {
          rect.endDot = endDot
          rect.sideLength = {
            x: Math.abs(rect.endDot.x - rect.startDot.x),
            y: Math.abs(rect.endDot.y - rect.startDot.y)
          }
          this.emitEvent(WbEvents.SEND_MESSAGE, [{ ...rect, finish: this._newStroke }])
        } else if (this._polygon === 100) {
          // Round
          round.startDot = endDot
          // round.sideLength = {
          //     x: Math.abs(endDot.x - startDot.x),
          //     y: Math.abs(endDot.y - startDot.y)
          // };
          round.startDot = {
            x: (startDot.x + endDot.x) / 2,
            y: (startDot.y + endDot.y) / 2
          }
          // round.r = Math.sqrt( Math.pow(round.sideLength.x * this._cvsW, 2) + Math.pow(round.sideLength.y * this._cvsH, 2) ) / (this._cvsW / this._cvsH) / 2;
          // round.r = Math.sqrt( Math.pow(round.sideLength.x * this._cvsW, 2) + Math.pow(round.sideLength.y * this._cvsH, 2) ) / (this._cvsW * this._cvsH) / 2;
          this.emitEvent(WbEvents.SEND_MESSAGE, [{ ...round, finish: this._newStroke }])
        } else {
          // line
          this.emitEvent(WbEvents.SEND_MESSAGE, [
            { ...line, points: [endDot], finish: this._newStroke }
          ])
          startDot = endDot
        }
        this._newStroke = false
        return false
      })
      //  in canvas，release mouse event
      // $(window).mouseup(() => {
      $(window).on('touchend mouseup', () => {
        if (this._inDrawing) {
          this._inDrawing = false
          this._newStroke = true
          $(window).off('touchmove mousemove')
          $(window).off('touchend mouseup')
        }
        return false
      })
      return false
    })

    // move out canvas event
    // this._$el.mouseout(() => {
    this._$el.on('touchcancel mouseout', () => {
      if (this._inDrawing) {
        this._inDrawing = false
        this._newStroke = true
        $(window).off('touchmove mousemove')
        $(window).off('touchend mouseup')
      }
      return false
    })

    // Move the mouse to select the elements on the canvas
    // this._$el.mousemove(event => {
    this._$el.on('touchmove mousemove', (event) => {
      if (!this._delete) return
      const offset = this._$el.offset()
      let clientX = event.clientX
      let clientY = event.clientY
      if (event.handleObj.type === 'touchmove') {
        clientX = event.touches[0].clientX
        clientY = event.touches[0].clientY
      }
      // const x = event.clientX + document.documentElement.scrollLeft + document.body.scrollLeft - offset.left;
      // const y = event.clientY + document.documentElement.scrollTop + document.body.scrollTop - offset.top;
      const x =
        clientX + document.body.scrollLeft - document.body.clientLeft - offset.left
      const y = clientY + document.body.scrollTop - document.body.clientTop - offset.top
      let mHalf = 5
      let dot = {
        x0: x - mHalf,
        y0: y - mHalf,
        x1: x + mHalf,
        y1: y + mHalf
      }
      let o,
        has = false
      for (const key in this._container.session) {
        if (has) break

        o = this._container.session[key]
        switch (o.type) {
          case drawingMessageType.DRAWING_LINE: {
            // line
            let prevPoint = o.points[0]
            for (const point of o.points) {
              let lineLength = Math.sqrt(
                Math.pow(Math.abs(point.x * this._cvsW - prevPoint.x * this._cvsW), 2) +
                  Math.pow(Math.abs(point.y * this._cvsH - prevPoint.y * this._cvsH), 2)
              )
              if (lineLength <= mHalf * 2) {
                if (
                  x < point.x * this._cvsW + mHalf * 2 &&
                  x > point.x * this._cvsW - mHalf * 2 &&
                  y < point.y * this._cvsH + mHalf * 2 &&
                  y > point.y * this._cvsH - mHalf * 2
                ) {
                  this._container.selected.id = o.id
                  has = true
                }
              } else {
                let mStartLength = Math.sqrt(
                  Math.pow(Math.abs(x - point.x * this._cvsW), 2) +
                    Math.pow(Math.abs(y - point.y * this._cvsH), 2)
                )
                let mEndLength = Math.sqrt(
                  Math.pow(Math.abs(x - prevPoint.x * this._cvsW), 2) +
                    Math.pow(Math.abs(y - prevPoint.y * this._cvsH), 2)
                )
                let ratio = 1.01
                if (
                  (mStartLength + mEndLength) / lineLength >= 1 &&
                  (mStartLength + mEndLength) / lineLength < ratio
                ) {
                  this._container.selected.id = o.id
                  has = true
                }
              }
              prevPoint = point
            }
            break
          }
          case drawingMessageType.DRAWING_STRAIGHT_LINE: {
            // Straight line
            const lineLength = Math.sqrt(
                Math.pow(
                  Math.abs(o.startDot.x * this._cvsW - o.endDot.x * this._cvsW),
                  2
                ) +
                  Math.pow(
                    Math.abs(o.startDot.y * this._cvsH - o.endDot.y * this._cvsH),
                    2
                  )
              ),
              mStartLength = Math.sqrt(
                Math.pow(Math.abs(x - o.startDot.x * this._cvsW), 2) +
                  Math.pow(Math.abs(y - o.startDot.y * this._cvsH), 2)
              ),
              mEndLength = Math.sqrt(
                Math.pow(Math.abs(x - o.endDot.x * this._cvsW), 2) +
                  Math.pow(Math.abs(y - o.endDot.y * this._cvsH), 2)
              )
            let ratio = 1.01
            if (lineLength < 100) {
              ratio = 1.01
            } else if (lineLength < 200) {
              ratio = 1.005
            } else if (lineLength < 400) {
              ratio = 1.001
            } else if (lineLength < 800) {
              ratio = 1.0005
            } else {
              ratio = 1.0001
            }
            if (
              (mStartLength + mEndLength) / lineLength > 1 &&
              (mStartLength + mEndLength) / lineLength < ratio
            ) {
              this._container.selected.id = o.id
              has = true
            }
            break
          }
          case drawingMessageType.DRAWING_ROUND: {
            // Round
            const sideLength = {
              x: Math.abs(o.endDot.x - o.startDot.x),
              y: Math.abs(o.endDot.y - o.startDot.y)
            }
            const r = Math.sqrt(
              Math.pow(sideLength.x * this._cvsW, 2) +
                Math.pow(sideLength.y * this._cvsH, 2)
            )
            if (
              Math.abs(
                Math.sqrt(
                  Math.pow(Math.abs(o.startDot.x * this._cvsW - x), 2) +
                    Math.pow(Math.abs(o.startDot.y * this._cvsH - y), 2)
                ) - r
              ) < mHalf
            ) {
              this._container.selected.id = o.id
              has = true
            }
            // if( Math.abs(Math.sqrt( Math.pow( Math.abs(o.startDot.x*this._cvsW - x) , 2) + Math.pow( Math.abs(o.startDot.y*this._cvsH - y) , 2) ) - o.r*(this._cvsW/this._cvsH)) < mHalf ) {
            //     this._container.selected.id = o.id;
            //     has = true;
            // }
            break
          }
          case drawingMessageType.DRAWING_RECT: {
            // Rectangle
            const sideLength = {
              x: Math.abs(o.endDot.x - o.startDot.x),
              y: Math.abs(o.endDot.y - o.startDot.y)
            }
            const oHalfWidth = (sideLength.x * this._cvsW) / 2,
              oHalfHeight = (sideLength.y * this._cvsH) / 2,
              oCenter = {
                x:
                  o.startDot.x < o.endDot.x
                    ? o.startDot.x * this._cvsW + oHalfWidth
                    : o.startDot.x * this._cvsW - oHalfWidth,
                y:
                  o.startDot.y < o.endDot.y
                    ? o.startDot.y * this._cvsH + oHalfHeight
                    : o.startDot.y * this._cvsH - oHalfHeight
              },
              distance = {
                x: Math.abs(oCenter.x - x),
                y: Math.abs(oCenter.y - y)
              }

            if (
              (Math.abs(distance.x - oHalfWidth) < mHalf &&
                distance.y < oHalfHeight + mHalf) ||
              (Math.abs(distance.y - oHalfHeight) < mHalf &&
                distance.x < oHalfWidth + mHalf)
            ) {
              this._container.selected.id = o.id
              has = true
            }
            break
          }
          case drawingMessageType.DRAWING_TEXT: {
            // Text
            const textWidth = this.getTextRectSize(o)
            if (
              x - o.startDot.x * this._cvsW < textWidth + mHalf &&
              x - o.startDot.x * this._cvsW > 0 - mHalf &&
              y - o.startDot.y * this._cvsH < o.lineWidth + mHalf &&
              y - o.startDot.y * this._cvsH > 0 - mHalf * o.lineWidth
            ) {
              this._container.selected.id = o.id
              has = true
            }
            break
          }
          default:
            break
        }
      }

      if (has) {
        this.draw()
      } else if (this._container.selected.id !== '') {
        this._container.selected.id = ''
        this.draw()
      }
      return false
    })
  }

  updateCursor(clazzName) {
    if (clazzName) {
      this._$el.attr('class', clazzName + ' canvas')
    } else {
      this._$el.attr('class', this._className + ' canvas')
    }
  }

  getLastOptId() {
    let lastTime = 0,
      id = ''
    for (const key in this._container.session) {
      if (
        this._container.session.hasOwnProperty(key) &&
        lastTime < this._container.session[key].time
      ) {
        lastTime = this._container.session[key].time
        id = this._container.session[key].id
      }
    }
    return id
  }

  drawingCourse(url) {
    if (!url) {
      this._$el.css('background', '#ffffff')
    } else {
      this._$el.css('background', `url(${url}) no-repeat center`)
    }
    this._$el.css('background-size', 'contain')
  }

  getTextRectSize(o) {
    this._cxt.font = o.lineWidth * 10 + 'px serif'
    return this._cxt.measureText(o.content).width
  }

  draw() {
    this._cxt.clearRect(0, 0, this._$el.width(), this._$el.height())
    for (const key in this._container.session) {
      if (!this._container.session.hasOwnProperty(key)) {
        continue
      }

      let o = this._container.session[key]
      let lineColor = o.lineColor
      let lineWidth =
        typeof o.lineWidth === 'string' ? parseInt(o.lineWidth) : o.lineWidth
      if (this._container.selected.id === o.id) {
        lineColor = this._container.selected.lineColor
        lineWidth += this._container.selected.extensionWidth
      }
      switch (o.type) {
        case drawingMessageType.DRAWING_LINE: {
          // Line
          if (o.points.length < 2) break

          this._cxt.beginPath()
          for (let i = 1; i < o.points.length; i++) {
            const prev = o.points[i - 1]
            const current = o.points[i]
            this._cxt.moveTo(current.x * this._cvsW, current.y * this._cvsH)
            this._cxt.lineTo(prev.x * this._cvsW, prev.y * this._cvsH)
          }
          this._cxt.strokeStyle = lineColor
          this._cxt.lineWidth = lineWidth
          this._cxt.lineCap = 'round'
          this._cxt.stroke()
          this._cxt.closePath()
          break
        }
        case drawingMessageType.DRAWING_STRAIGHT_LINE: {
          // straight line
          this._cxt.beginPath()
          this._cxt.moveTo(o.startDot.x * this._cvsW, o.startDot.y * this._cvsH)
          this._cxt.lineTo(o.endDot.x * this._cvsW, o.endDot.y * this._cvsH)
          this._cxt.strokeStyle = lineColor
          this._cxt.lineWidth = lineWidth
          this._cxt.stroke()
          this._cxt.closePath()
          break
        }
        case drawingMessageType.DRAWING_RECT: {
          // Rect
          this._cxt.beginPath()
          this._cxt.rect(
            o.startDot.x * this._cvsW,
            o.startDot.y * this._cvsH,
            o.endDot.x * this._cvsW - o.startDot.x * this._cvsW,
            o.endDot.y * this._cvsH - o.startDot.y * this._cvsH
          )
          this._cxt.strokeStyle = lineColor
          this._cxt.lineWidth = lineWidth
          this._cxt.stroke()
          this._cxt.closePath()
          break
        }
        case drawingMessageType.DRAWING_ROUND: {
          // round
          this._cxt.beginPath()
          // this._cxt.arc(o.startDot.x * this._cvsW, o.startDot.y * this._cvsH, o.r *
          //     (this._cvsW / this._cvsH), 0, 2 * Math.PI);
          // this._cxt.arc(o.startDot.x * this._cvsW, o.startDot.y * this._cvsH, o.r *
          //     (this._cvsW * this._cvsH), 0, 2 * Math.PI);
          const sideLength = {
            x: Math.abs(o.endDot.x - o.startDot.x),
            y: Math.abs(o.endDot.y - o.startDot.y)
          }
          const r = Math.sqrt(
            Math.pow(sideLength.x * this._cvsW, 2) +
              Math.pow(sideLength.y * this._cvsH, 2)
          )
          this._cxt.arc(
            o.startDot.x * this._cvsW,
            o.startDot.y * this._cvsH,
            r,
            0,
            2 * Math.PI
          )
          this._cxt.strokeStyle = lineColor
          this._cxt.lineWidth = lineWidth
          this._cxt.stroke()
          break
        }
        case drawingMessageType.DRAWING_TEXT: {
          // Text
          const textArea = Number(o.textW * this._cvsW * (o.textH * this._cvsH))
          const fontSize = getFontSize(
            o.content,
            textArea,
            'Microsoft YaHei',
            lineWidth * 10
          )
          this._cxt.font = `${fontSize}px Microsoft YaHei`
          // this._cxt.font = lineWidth * 10 + "px Microsoft YaHei";
          this._cxt.fillStyle = lineColor
          this._cxt.fillText(
            o.content,
            o.startDot.x * this._cvsW,
            o.startDot.y * this._cvsH
          )
          break
        }
        // case drawingMessageType.DRAWING_IMAGE:
        //     this._cxt.drawImage(o.url, 0, 0, this._$el.width(), this._$el.height());
        //     break;
        default:
          break
      }
    }
  }
}
