<template>
  <div id="screen-marker" @mouseleave.prevent.stop="onCanvasMouseLeave">
    <div class="marker-container" style="pointer-events: all">
      <canvas
        ref="markerCanvas"
        style="width: 100%; height: 100%"
        :width="canvasW"
        :height="canvasH"
        :class="[`canvas-cursor-${drawType ? drawType : 'default'}`]"
        @mousedown.prevent.stop="onCanvasMouseDown"
        @mouseup.prevent.stop="onCanvasMouseUp"
        @mousemove.prevent.stop="onCanvasMouseMove"
      />
      <div class="angle angle-left-top" />
      <div class="angle angle-left-bottom" />
      <div class="angle angle-right-top" />
      <div class="angle angle-right-bottom" />
    </div>
    <v-menu
      v-model="showColorPicker"
      :close-on-content-click="true"
      :position-x="colorPickerX"
      :position-y="colorPickerY"
      absolute
      offset-x
    >
      <div>
        <v-color-picker
          v-model="drawColor"
          :swatches="swatches"
          hide-inputs
          hide-mode-switch
          show-swatches
          flat
          @input="getDrawColor"
        />
      </div>
    </v-menu>
    <v-dialog v-model="showInputTextDlg" width="400" persistent>
      <v-card>
        <v-card-title>{{ $vuetify.lang.t('$vuetify.meeting.inputText') }}</v-card-title>
        <v-card-text>
          <v-text-field v-model="inputText" autofocus />
        </v-card-text>
        <v-divider />
        <v-card-actions
          class="d-flex align-end pl-0 pr-0 pt-0 pb-0 justify-space-between"
        >
          <v-btn
            depressed
            height="38"
            color="#fff"
            width="199"
            class="ma-0"
            tile
            @click="onCancelInputText"
            >{{ $vuetify.lang.t('$vuetify.meeting.cancel') }}</v-btn
          >
          <v-divider vertical />
          <v-btn
            height="38"
            width="199"
            class="ma-0"
            tile
            @click="showInputTextDlg = !showInputTextDlg"
            ><span class="pt-0 mb-0" style="color: #127bf8">{{
              $vuetify.lang.t('$vuetify.meeting.confirm')
            }}</span></v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import { remote, desktopCapturer } from 'electron'
import fs from 'fs'
import { SCREEN_MARKER_BAR_HEIGHT, SCREEN_MARKER_BAR_WIDTH } from '@/common'
import { IPCEvents } from '../common'

const DRAW_TYPE = {
  None: null,
  Pencil: 'pencil',
  Line: 'line',
  Rectangle: 'rectangle',
  Circle: 'circle',
  Text: 'text'
}
export default {
  name: 'ScreenMarker',
  data() {
    return {
      win: null,
      ignoreMouseEvent: null,
      drawType: DRAW_TYPE.None,
      isDrawing: false,
      canvasCtx: null,
      startPos: null,
      startToDraw: false,
      currentDraw: null,
      drawSteps: [],
      lineWidth: 4,
      showColorPicker: false,
      swatches: [
        ['#FF0000', '#AA0000', '#550000'],
        ['#FFFF00', '#AAAA00', '#555500'],
        ['#00FF00', '#00AA00', '#005500'],
        ['#00FFFF', '#00AAAA', '#005555'],
        ['#0000FF', '#0000AA', '#000055']
      ],
      colorPickerX: 0,
      colorPickerY: 0,
      showInputTextDlg: false,
      inputText: '',
      prevDrawType: DRAW_TYPE.None,
      drawColor: {
        hex: '#FF0000'
      },
      redoSteps: [],
      canvasW: 0,
      canvasH: 0
    }
  },
  watch: {
    drawType(val, oldVal) {
      this.prevDrawType = oldVal === DRAW_TYPE.None ? DRAW_TYPE.Pencil : oldVal
      if (val) {
        window.ipc.send(IPCEvents.MARKER.DRAW_TYPE_CHANGED, val)
      }
    }
  },
  beforeMount() {
    this.win = remote.getCurrentWindow()
    const winBounds = this.win.getBounds()
    this.colorPickerX = (winBounds.width - SCREEN_MARKER_BAR_WIDTH) / 2 + 20
    this.colorPickerY = SCREEN_MARKER_BAR_HEIGHT
    this.canvasW = winBounds.width
    this.canvasH = winBounds.height
  },
  mounted() {
    this.drawType = DRAW_TYPE.None
    this.canvasCtx = this.$refs.markerCanvas.getContext('2d')
    localStorage.removeItem('markerDrawerColor')
    this.bindIpcEvent()
  },
  methods: {
    getDrawColor(e) {
      localStorage.setItem('markerDrawerColor', e.hex)
    },
    onEnd() {
      window.close()
    },
    setDrawType(drawType) {
      this.ignoreMouseEvent = drawType === DRAW_TYPE.None
      this.drawType = drawType
    },
    onClickPencil() {
      this.setDrawType(DRAW_TYPE.Pencil)
    },
    onClickLine() {
      this.setDrawType(DRAW_TYPE.Line)
    },
    onClickRectangle() {
      this.setDrawType(DRAW_TYPE.Rectangle)
    },
    onClickCircle() {
      this.setDrawType(DRAW_TYPE.Circle)
    },
    onClickDrawText() {
      this.setDrawType(DRAW_TYPE.Text)
    },
    onCancelInputText() {
      this.inputText = ''
      this.showInputTextDlg = false
    },
    onClearAll() {
      if (!this.canvasCtx) return
      this.canvasCtx.clearRect(
        0,
        0,
        this.$refs.markerCanvas.width,
        this.$refs.markerCanvas.height
      )
      this.drawSteps = []
      this.redoSteps = []
    },
    onUndo() {
      const step = this.drawSteps.pop()
      if (step) {
        this.redoSteps.push(step)
        this.redrawAll()
      }
    },
    onRedo() {
      const step = this.redoSteps.pop()
      if (step) {
        this.drawSteps.push(step)
        this.redrawAll()
      }
    },
    onScreenControl() {
      this.setDrawType(DRAW_TYPE.None)
    },
    draw(event) {
      const x = event.pageX
      const y = event.pageY
      switch (this.drawType) {
        case DRAW_TYPE.Pencil:
          {
            if (!this.currentDraw.points) {
              this.currentDraw.points = []
            }
            this.currentDraw.points.push({ x, y })
          }
          break
        case DRAW_TYPE.Line:
        case DRAW_TYPE.Rectangle:
        case DRAW_TYPE.Circle:
          {
            if (this.currentDraw.startPoint) {
              this.currentDraw.endPoint = { x, y }
            } else {
              this.currentDraw.startPoint = { x, y }
            }
          }
          break
        case DRAW_TYPE.Text:
          {
            this.currentDraw.content = this.inputText
            this.currentDraw.startPoint = { x, y }
          }
          break
      }
      const idx = this.drawSteps.findIndex((s) => s.id === this.currentDraw.id)
      if (idx === -1) {
        this.drawSteps.push(this.currentDraw)
      } else {
        this.drawSteps.splice(idx, 1, this.currentDraw)
      }

      // clean redo step list
      this.redoSteps = []
      this.redrawAll()
    },
    redrawAll() {
      this.canvasCtx.clearRect(
        0,
        0,
        this.$refs.markerCanvas.width,
        this.$refs.markerCanvas.height
      )
      this.drawSteps.map((step) => {
        switch (step.type) {
          case DRAW_TYPE.Pencil:
            step.points.map((point, i, array) => {
              if (i === 0) return
              const prevPoint = array[i - 1]
              this.canvasCtx.beginPath()
              this.canvasCtx.moveTo(prevPoint.x, prevPoint.y)
              this.canvasCtx.lineTo(point.x, point.y)
              this.canvasCtx.strokeStyle = step.color
              this.canvasCtx.lineWidth = step.lineWidth
              this.canvasCtx.lineCap = 'round'
              this.canvasCtx.stroke()
              this.canvasCtx.closePath()
            })
            break
          case DRAW_TYPE.Line:
            if (!step.endPoint) return
            this.canvasCtx.beginPath()
            this.canvasCtx.moveTo(step.startPoint.x, step.startPoint.y)
            this.canvasCtx.lineTo(step.endPoint.x, step.endPoint.y)
            this.canvasCtx.strokeStyle = step.color
            this.canvasCtx.lineWidth = step.lineWidth
            this.canvasCtx.stroke()
            this.canvasCtx.closePath()
            break
          case DRAW_TYPE.Rectangle:
            if (!step.endPoint) return
            this.canvasCtx.beginPath()
            this.canvasCtx.rect(
              step.startPoint.x,
              step.startPoint.y,
              step.endPoint.x - step.startPoint.x,
              step.endPoint.y - step.startPoint.y
            )
            this.canvasCtx.strokeStyle = step.color
            this.canvasCtx.lineWidth = step.lineWidth
            this.canvasCtx.stroke()
            this.canvasCtx.closePath()
            break
          case DRAW_TYPE.Circle:
            {
              if (!step.endPoint) return
              this.canvasCtx.beginPath()
              const sideLength = {
                x: step.endPoint.x - step.startPoint.x,
                y: step.endPoint.y - step.startPoint.y
              }
              const r = Math.sqrt(Math.pow(sideLength.x, 2) + Math.pow(sideLength.y, 2))
              this.canvasCtx.arc(
                step.startPoint.x + sideLength.x / 2,
                step.startPoint.y + sideLength.y / 2,
                r / 2,
                0,
                2 * Math.PI
              )
              this.canvasCtx.strokeStyle = step.color
              this.canvasCtx.lineWidth = step.lineWidth
              this.canvasCtx.stroke()
              this.canvasCtx.closePath()
            }
            break
          case DRAW_TYPE.Text:
            {
              this.canvasCtx.font = step.lineWidth * 10 + 'px Microsoft YaHei'
              this.canvasCtx.fillStyle = step.color
              this.canvasCtx.fillText(step.content, step.startPoint.x, step.startPoint.y)
            }
            break
        }
      })
    },
    onCanvasMouseMove(event) {
      if (this.ignoreMouseEvent || !this.startToDraw || this.drawType === DRAW_TYPE.Text)
        return
      const canvasMarker = this.$refs.markerCanvas
      canvasMarker.onmouseleave = () => {
        this.onCanvasMouseLeave()
        canvasMarker.onmouseleave = null
      }
      this.draw(event)
    },
    onCanvasMouseLeave() {
      this.currentDraw = null
      this.startToDraw = false
      this.startPos = null
    },
    onCanvasMouseDown() {
      if (this.ignoreMouseEvent) return
      this.currentDraw = {
        id: Date.now(),
        type: this.drawType,
        color: this.drawColor.hex,
        lineWidth: this.lineWidth
      }
      this.startToDraw = true
    },
    onCanvasMouseUp(event) {
      if (this.ignoreMouseEvent || !this.startToDraw) return
      if (this.drawType === DRAW_TYPE.Text) {
        this.draw(event)
        this.setDrawType(this.prevDrawType)
        this.prevDrawType = DRAW_TYPE.None
        this.inputText = ''
      }
      this.currentDraw = null
      this.startToDraw = false
      this.startPos = null
    },
    determineScreenShotSize() {
      const screenSize = remote.screen.getPrimaryDisplay().workAreaSize
      const maxDimension = Math.max(screenSize.width, screenSize.height)
      return {
        width: maxDimension * window.devicePixelRatio,
        height: maxDimension * window.devicePixelRatio
      }
    },
    getScreenShot() {
      return new Promise((resolve, reject) => {
        const options = {
          types: ['screen'],
          thumbnailSize: this.determineScreenShotSize()
        }
        const screenId = `screen:${this.currentSharedScreenId}:0`
        desktopCapturer
          .getSources(options)
          .then((sources) => {
            let pngData
            for (let i = 0; i < sources.length; i++) {
              const source = sources[i]
              if (source.id === screenId) {
                pngData = source.thumbnail.toPNG()
                break
              }
            }
            if (pngData) {
              resolve(pngData)
            } else {
              reject()
            }
          })
          .catch(reject)
      })
    },
    onSave() {
      this.getScreenShot().then((pngData) => {
        remote.dialog
          .showSaveDialog(this.win, {
            title: 'save screenshot',
            showsTagField: false,
            filters: [{ name: 'Images', extensions: ['png'] }]
          })
          .then((obj) => {
            if (obj.filePath) {
              fs.writeFile(obj.filePath, pngData, (error) => {
                if (error) console.error(error)
              })
            }
            this.win.focus()
          })
      })
      // desktopCapturer.getSources(options).then(sources => {
      //     sources.forEach(source => {
      //         const screenId = `screen:${this.currentSharedScreenId}:0`
      //         // if (source.name.toLowerCase() === 'entire screen' || +source.display_id === +this.currentSharedScreenId) {
      //         if (source.id === screenId) {
      //             const pngData = source.thumbnail.toPNG()
      //             remote.dialog.showSaveDialog(this.win, {
      //                 title: 'save screenshot',
      //                 showsTagField: false,
      //                 filters: [
      //                     { name: 'Images', extensions: ['png']},
      //                 ]
      //             }).then(obj => {
      //                 if (obj.filePath) {
      //                     fs.writeFile(obj.filePath, pngData, error => {
      //                         if (error) console.error(error)
      //                     })
      //                 }
      //                 this.win.focus()
      //             })
      //         }
      //     })
      // })
    },
    bindIpcEvent() {
      window.ipc.on(IPCEvents.MARKER.DRAW_LINE, () => {
        this.win.focus()
        this.showColorPicker = false
        this.onClickPencil()
      })
      window.ipc.on(IPCEvents.MARKER.DRAWING_STRAIGHT_LINE, () => {
        this.win.focus()
        this.showColorPicker = false
        this.onClickLine()
      })
      window.ipc.on(IPCEvents.MARKER.DRAW_CIRCLE, () => {
        this.win.focus()
        this.showColorPicker = false
        this.onClickCircle()
      })
      window.ipc.on(IPCEvents.MARKER.DRAW_RECTANGLE, () => {
        this.win.focus()
        this.showColorPicker = false
        this.onClickRectangle()
      })
      window.ipc.on(IPCEvents.MARKER.CLEAN, () => {
        this.win.focus()
        this.showColorPicker = false
        this.onClearAll()
      })
      window.ipc.on(IPCEvents.MARKER.UNDO, () => {
        this.win.focus()
        this.showColorPicker = false
        this.onUndo()
      })
      window.ipc.on(IPCEvents.MARKER.REDO, () => {
        this.win.focus()
        this.showColorPicker = false
        this.onRedo()
      })
      window.ipc.on(IPCEvents.MARKER.SAVE, () => {
        this.win.focus()
        this.showColorPicker = false
        this.onSave()
      })
      window.ipc.on(IPCEvents.MARKER.CONTROL, () => {
        this.win.focus()
        this.showColorPicker = false
        this.onScreenControl()
      })
      window.ipc.on(IPCEvents.MARKER.DRAW_COLOR, () => {
        this.win.focus()
        this.showColorPicker = true
      })
      window.ipc.on(IPCEvents.MARKER.DRAW_TEXT, () => {
        this.win.focus()
        this.showInputTextDlg = true
        this.onClickDrawText()
      })
    }
  }
}
</script>

<style lang="scss" scoped>
#screen-marker {
  width: 100%;
  height: 100%;
  pointer-events: none;
  .marker-container {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    .angle {
      position: absolute;
      width: 120px;
      height: 120px;
      z-index: -99;
    }
    .angle-left-top {
      top: 0;
      left: 0;
      border-left: 5px solid rgba(98, 211, 143, 0.8);
      border-top: 5px solid rgba(98, 211, 143, 0.8);
    }
    .angle-right-top {
      top: 0;
      right: 0;
      border-right: 5px solid rgba(98, 211, 143, 0.8);
      border-top: 5px solid rgba(98, 211, 143, 0.8);
    }
    .angle-left-bottom {
      bottom: 0;
      left: 0;
      border-bottom: 5px solid rgba(98, 211, 143, 0.8);
      border-left: 5px solid rgba(98, 211, 143, 0.8);
    }
    .angle-right-bottom {
      bottom: 0;
      right: 0;
      border-right: 5px solid rgba(98, 211, 143, 0.8);
      border-bottom: 5px solid rgba(98, 211, 143, 0.8);
    }
  }
  .canvas-cursor-default {
    cursor: default;
  }
  .canvas-cursor-pencil {
    cursor: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAYAAACNiR0NAAAAAXNSR0IArs4c6QAAActpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IlhNUCBDb3JlIDUuNC4wIj4KICAgPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4KICAgICAgPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIKICAgICAgICAgICAgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIgogICAgICAgICAgICB4bWxuczp0aWZmPSJodHRwOi8vbnMuYWRvYmUuY29tL3RpZmYvMS4wLyI+CiAgICAgICAgIDx4bXA6Q3JlYXRvclRvb2w+QWRvYmUgSW1hZ2VSZWFkeTwveG1wOkNyZWF0b3JUb29sPgogICAgICAgICA8dGlmZjpPcmllbnRhdGlvbj4xPC90aWZmOk9yaWVudGF0aW9uPgogICAgICA8L3JkZjpEZXNjcmlwdGlvbj4KICAgPC9yZGY6UkRGPgo8L3g6eG1wbWV0YT4KKS7NPQAAAMJJREFUOBHt1EENxCAQBVAkIAEJSEACEnCEBCQgAUlImOUTftLDHKbtXjZZLrST6eswBJxzTmKM0lqTOaes93cjhCAppY0uSUop7+BaqwBFWWfe+ONqz4fivQcqvfcNog2PUSyTGCoFBPAxqgFaDD8zDw3QYmYQiRqgxf6ovQNa/7SYXfz5jcI9sBbxnRNFDMeWx/RWL5nMTUFl5w5wxM/MVPtMFJURyznzxrJD10yiKybAxhi7n9ec289AUSHvUrTgAygTWpbmQUSvAAAAAElFTkSuQmCC'),
      auto;
  }
  .canvas-cursor-line {
    cursor: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAYAAACNiR0NAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAGtJREFUeNpiZGBg2A/EBxmwg3wgLgTiBQwkgAYc4vOBOIGBRMCEx7CDpLoMl4H9QLyRDMMMgPg9spcFgHg9VIKBTMMSYAYKQCOHYsNgXqSaYQxQAaoZBgIK1DSMYdSwUcNGDSMDUGwYQIABAGJmJu9IXGmAAAAAAElFTkSuQmCC'),
      auto;
  }
  .canvas-cursor-rectangle {
    cursor: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAYAAACNiR0NAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAJFJREFUeNpiZGBg2A/EBxmwg3wgLgTiBQwkgAYc4vOBOIGBRMCEx7CDpLoMBFiwiPUD8UYg3sBABkA2UADqsoVAbADFDOR6GWTYeiBuBOIPQBzPQB6oh3lxP5KLHKB8csB/EPEezXsUGQgKQ0MgfsBAJcBETcPwpcNRAwfQQBYc4gbkpkVGLGIC5ObjEQoAAgwAO8sXCR/kRncAAAAASUVORK5CYII='),
      auto;
  }
  .canvas-cursor-circle {
    cursor: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAYAAACNiR0NAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAPtJREFUeNqslIsNgjAQhq/GARyhI+AEsoGO4AbiBjgBboBOoE4ATAAbwAbiBt4lh2maK9Din/wJfX3cg6IAoEBXIOuEPqNv4KHUMZ+jj+Cp1Qis8o2MtBbmMvQL/UTHnHaE7ow9Gn1HX9G9K+UN+sGHh+dhLInK0UplSRlQGLB6Zv3EvZkBC2nGAP1l8jYGEcN9FZvntNXdGMJEQK2sSQp9GwhMqOP2d9hDuBqKcAV/lg3UC1haSrlZAN2hS+nrzwOja12L9ch1c4mu6MG1GPHb5kLzOVkN0GQizcKGqYk7SsA9F/vDvzDNDSBd7EYoj7uq2SWDO2njV4ABAE3eNnfW3i8NAAAAAElFTkSuQmCC'),
      auto;
  }
  .canvas-cursor-text {
    cursor: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAYAAACNiR0NAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAASdJREFUeNq0lIENgjAQRYsT4AYwgbgBTiAbqBMIG7iBcQLcwDiBcQLcoDgBOoFezb+kqe0BJl7yA4Hj9d/1aKSUupCuyh9bUkU6qhGxCzyvSWs1MiYC7DrWWcjhnlQ4z4xTjfboocCYdCJlnpwGixSAFn3AGIk+WAZXJq+D21oC7gUY97MEtIO7Dia80Qkwfp8DyO54EW8kAmyNvjIgtgzoXybgYpXIC5+wUAPng+aQnTPkRmpxfyYtSQfSyv0o6tksHqfcAsYoeYqyU9JjCNAkLwJ9fsD11x8VAhY4GM64ts57HpkKlcz7NkNsvFVBZl2DDhOAFgCnPT2+k2akTQhYIsH06SkcbwnGau7bHHf2tDN70pyaal5Caz6QfADMHqlM/SveAgwAuYRMsuNCEmsAAAAASUVORK5CYII='),
      auto;
  }
  .canvas-cursor-remove {
    cursor: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAYAAACNiR0NAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAM1JREFUeNrck30NwyAQxdkUIKESkIAEJCABCTiYBCRMQjMFzEEldBJ2TY7kjX7w0f61l7wQcvDLa++4iV9Z8oP85r0kK95/xFovshc7WmCRIahAHkWjFthMHnbqgd0EU4Vz1dAaWNJYgt55rQFKti5BFae0hTMTdDScgWJNwhR0QVMync2l6IEahiWAhrFyPVDsfko9QFoDd2KpsZjUAiBP6Lg+bbywQ+jWPzQNj2IF9dBhyUl9KyyHBvisZy8shzoGn4Ll0HgF7I/0FWAAKwk7xVUbfgwAAAAASUVORK5CYII='),
      auto;
  }
}
</style>
