<template>
  <div id="screenMarkerBar" style="width: 100%" class="flex-center">
    <div class="pl-4 pr-4 flex-center mar-btns-box">
      <v-btn text class="pa-0 mar-btn" small @click="onClickColorPicker">
        <v-icon
          class="mar-btn-icon"
          dense
          :style="{ color: `${drawColor} !important`, 'font-size': '24px' }"
          >mdi-palette</v-icon
        >
        <div class="mar-btn-txt">
          {{ $vuetify.lang.t('$vuetify.meeting.color') }}
        </div>
      </v-btn>
      <v-btn text class="pa-0 mar-btn" small @click="onClickPencil()">
        <v-img
          v-if="active !== 'pencil'"
          class="mar-btn-icon"
          src="@/assets/white_pencil_draw.png"
        />
        <v-img
          v-if="active === 'pencil'"
          class="mar-btn-icon"
          src="@/assets/blue_pencil_draw.png"
        />
        <div class="mar-btn-txt">
          {{ $vuetify.lang.t('$vuetify.meeting.pencil') }}
        </div>
      </v-btn>
      <v-btn text class="pa-0 mar-btn" small @click="onClickLine">
        <v-img
          v-if="active !== 'line'"
          class="mar-btn-icon"
          src="@/assets/white_line_draw.png"
        />
        <v-img
          v-if="active === 'line'"
          class="mar-btn-icon"
          src="@/assets/blue_line_draw.png"
        />
        <div class="mar-btn-txt">
          {{ $vuetify.lang.t('$vuetify.meeting.line') }}
        </div>
      </v-btn>
      <v-btn text class="pa-0 mar-btn" small @click="onClickRectangle">
        <v-img
          v-if="active !== 'rectangle'"
          class="mar-btn-icon"
          src="@/assets/white_rectangle_draw.png"
        />
        <v-img
          v-if="active === 'rectangle'"
          class="mar-btn-icon"
          src="@/assets/blue_rectangle_draw.png"
        />
        <div class="mar-btn-txt">
          {{ $vuetify.lang.t('$vuetify.meeting.rectangle') }}
        </div>
      </v-btn>
      <v-btn text class="pa-0 mar-btn" small @click="onClickCircle">
        <v-img
          v-if="active !== 'circle'"
          class="mar-btn-icon"
          src="@/assets/white_round_draw.png"
        />
        <v-img
          v-if="active === 'circle'"
          class="mar-btn-icon"
          src="@/assets/blue_round_draw.png"
        />
        <div class="mar-btn-txt">
          {{ $vuetify.lang.t('$vuetify.meeting.round') }}
        </div>
      </v-btn>
      <!-- eslint-disable-next-line vue/max-attributes-per-line -->
      <v-btn text class="pa-0 mar-btn" width="50px" small @click="onClickText">
        <v-img
          v-if="active === 'text'"
          class="mar-btn-icon"
          src="@/assets/blue_text_draw.png"
        />
        <v-img
          v-if="active !== 'text'"
          class="mar-btn-icon"
          src="@/assets/white_text_draw.png"
        />
        <div class="mar-btn-txt">
          {{ $vuetify.lang.t('$vuetify.meeting.text') }}
        </div>
      </v-btn>
      <v-btn text class="pa-0 mar-btn" small @click="onClearAll">
        <v-img class="mar-btn-icon" src="@/assets/white_clear_draw.png" />
        <div class="mar-btn-txt">
          {{ $vuetify.lang.t('$vuetify.meeting.clear') }}
        </div>
      </v-btn>
      <v-btn text class="pa-0 mar-btn" small @click="onUndo">
        <v-img class="mar-btn-icon" src="@/assets/white_undo_draw.png" />
        <div class="mar-btn-txt">
          {{ $vuetify.lang.t('$vuetify.meeting.undo') }}
        </div>
      </v-btn>
      <v-btn text class="pa-0 mar-btn" small @click="onRedo">
        <v-img
          class="mar-btn-icon"
          style="transform: scaleX(-1)"
          src="@/assets/white_undo_draw.png"
        />
        <div class="mar-btn-txt">
          {{ $vuetify.lang.t('$vuetify.meeting.redo') }}
        </div>
      </v-btn>
      <v-divider
        vertical
        style="border-color: #fff; margin-right: 20px; margin-top: 15px; margin-left: 5px"
      />
      <div>
        <v-btn
          color="dxz-blue"
          class="white--text pa-0 font-weight-bold mr-2 btn-color"
          style="font-size: 12px; padding: 0 8px !important"
          height="30px"
          small
          depressed
          @click="onSave"
        >
          {{ $vuetify.lang.t('$vuetify.meeting.save') }}
        </v-btn>
        <v-btn
          v-if="controlMode === 1"
          color="dxz-blue"
          class="white--text pa-0 font-weight-bold mr-2 btn-color"
          height="30px"
          style="font-size: 12px; padding: 0 8px !important"
          small
          depressed
          @click="onScreenControl"
        >
          {{ $vuetify.lang.t('$vuetify.meeting.control') }}
        </v-btn>
        <v-btn
          v-else
          color="dxz-blue"
          class="white--text pa-0 font-weight-bold mr-2 btn-color"
          height="30px"
          style="font-size: 12px; padding: 0 8px !important"
          small
          depressed
          @click="onContinueControl"
        >
          {{ $vuetify.lang.t('$vuetify.meeting.continueControl') }}
        </v-btn>
        <v-btn
          color="red"
          class="white--text pa-0 font-weight-bold mr-2 btn-color"
          height="30px"
          style="font-size: 12px; padding: 0 8px !important"
          small
          depressed
          @click="onEnd"
        >
          {{ $vuetify.lang.t('$vuetify.meeting.end') }}
        </v-btn>
      </div>
    </div>
  </div>
</template>

<script>
import { IPCEvents } from '../common'

export default {
  name: 'ScreenMarkerBar',
  data() {
    return {
      controlMode: 1,
      drawColor: localStorage.getItem('markerDrawerColor') ?? '#FF0000',
      active: null,
      tmp: null
    }
  },
  mounted() {
    // 进来以后默认选中铅笔
    this.onClickPencil()
    window.addEventListener('storage', (e) => {
      this.drawColor = e.newValue
    })
  },
  beforeMount() {
    this.bindIpcEvent()
  },
  methods: {
    bindIpcEvent() {
      window.ipc.on(IPCEvents.MARKER.DRAW_TYPE_CHANGED, (event, obj) => {
        this.active = this.tmp = obj
      })
    },
    onClickColorPicker() {
      window.ipc.send(IPCEvents.MARKER.DRAW_COLOR)
    },
    onClickPencil() {
      this.controlMode = 1
      this.active = this.tmp = 'pencil'
      window.ipc.send(IPCEvents.MARKER.DRAW_LINE)
    },
    onClickLine() {
      this.controlMode = 1
      this.active = this.tmp = 'line'
      window.ipc.send(IPCEvents.MARKER.DRAWING_STRAIGHT_LINE)
    },
    onClickRectangle() {
      this.controlMode = 1
      this.active = this.tmp = 'rectangle'
      window.ipc.send(IPCEvents.MARKER.DRAW_RECTANGLE)
    },
    onClickCircle() {
      this.controlMode = 1
      this.active = this.tmp = 'circle'
      window.ipc.send(IPCEvents.MARKER.DRAW_CIRCLE)
    },
    onClickText() {
      this.controlMode = 1
      this.active = 'text'
      window.ipc.send(IPCEvents.MARKER.DRAW_TEXT)
    },
    onClearAll() {
      this.controlMode = 1
      window.ipc.send(IPCEvents.MARKER.CLEAN)
    },
    onUndo() {
      window.ipc.send(IPCEvents.MARKER.UNDO)
    },
    onRedo() {
      window.ipc.send(IPCEvents.MARKER.REDO)
    },
    onSave() {
      window.ipc.send(IPCEvents.MARKER.SAVE)
    },
    onScreenControl() {
      this.controlMode = 0
      this.active = null
      window.ipc.send(IPCEvents.MARKER.CONTROL)
    },
    onContinueControl() {
      this.controlMode = 1
      this.active = this.tmp
      window.ipc.send(`screen-marker-draw-${this.active}`)
    },
    onEnd() {
      window.ipc.send(IPCEvents.MEETING.STOP_SCREEN_MARKER)
    }
  }
}
</script>

<style scoped lang="scss">
.btn-color {
  margin-top: 15px;
  font-size: 12px;
  padding: 0 8px !important;
}
.mar-btns-box {
  background-color: rgba(0, 0, 0, 0.7);
  z-index: 999;
  padding-bottom: 18px;
  padding-top: 0;
  .mar-btn {
    position: relative;
  }
  .mar-btn-txt {
    color: #fff;
    position: absolute;
    bottom: -20px;
    left: 15px;
    right: 15px;
    font-weight: bold;
    font-size: 12px;
  }
}
</style>
<style lang="scss">
.mar-btns-box {
  .mar-btn {
    .v-btn__content {
      display: block !important;
      .mar-btn-icon {
        width: 18px;
        height: 18px;
        margin: 0 auto;
      }
    }
  }
}
</style>
