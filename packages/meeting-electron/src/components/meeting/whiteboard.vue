<template>
  <div id="whiteboard-container" :style="{ 'z-index': show ? '100' : '-1' }">
    <app-bar
      :close-btn="isSharer"
      :title="$vuetify.lang.t('$vuetify.meeting.whiteboard')"
      :on-close="onClose"
      :on-minimize="onMinus"
    />
    <div class="wb-main flex-h-center mt-2" style="background-color: lightgrey">
      <v-responsive width="100%" style="flex: 0 0 auto" :aspect-ratio="16 / 9">
        <div id="dxz-wb" style="width: 100%; height: 100%" />
      </v-responsive>
    </div>
    <v-divider />
    <div class="wb-bottom-bar flex-center">
      <v-menu v-model="showColorPicker" :close-on-content-click="false" offset-x>
        <template #activator="{ on, attrs }">
          <!-- eslint-disable-next-line vue/max-attributes-per-line -->
          <v-btn v-bind="attrs" text class="pa-0" width="50px" v-on="on">
            <v-icon
              dense
              :style="{ color: `${boardColor} !important`, 'font-size': '21px' }"
              >mdi-palette</v-icon
            >
            <span class="title-center normal-text pt-1">{{
              $vuetify.lang.t('$vuetify.meeting.color')
            }}</span>
          </v-btn>
        </template>
        <div>
          <v-color-picker
            v-model="selectedColor"
            :swatches="swatches"
            hide-inputs
            hide-mode-switch
            show-swatches
            flat
            @input="getBoardColor"
          />
        </div>
      </v-menu>
      <v-btn text class="pa-0" width="50px" @click="drawLine">
        <v-img
          v-if="drawType !== 0"
          width="18px"
          height="18px"
          src="@/assets/white_pencil_board.png"
        />
        <v-img
          v-if="drawType === 0"
          width="18px"
          height="18px"
          src="@/assets/blue_pencil_draw.png"
        />
        <span class="title-center normal-text pt-1">{{
          $vuetify.lang.t('$vuetify.meeting.pencil')
        }}</span>
      </v-btn>
      <v-btn text class="pa-0" width="50px" @click="drawStraightLine">
        <v-img
          v-if="drawType !== 1"
          width="18px"
          height="18px"
          src="@/assets/white_line_board.png"
        />
        <v-img
          v-if="drawType === 1"
          width="18px"
          height="18px"
          src="@/assets/blue_line_draw.png"
        />
        <span class="title-center normal-text pt-1">{{
          $vuetify.lang.t('$vuetify.meeting.line')
        }}</span>
      </v-btn>
      <v-dialog v-model="showInputTextDlg" width="400">
        <template #activator="{ on, attrs }">
          <!-- eslint-disable-next-line vue/max-attributes-per-line -->
          <v-btn v-bind="attrs" text class="pa-0" width="50px" v-on="on">
            <v-img width="18px" height="18px" src="@/assets/white_text_board.png" />
            <span class="title-center normal-text pt-1">{{
              $vuetify.lang.t('$vuetify.meeting.text')
            }}</span>
          </v-btn>
        </template>
        <v-card>
          <v-card-title>{{ $vuetify.lang.t('$vuetify.meeting.inputText') }}</v-card-title>
          <v-card-text>
            <v-text-field v-model="inputText" />
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
              @click="showInputTextDlg = !showInputTextDlg"
              >{{ $vuetify.lang.t('$vuetify.meeting.cancel') }}</v-btn
            >
            <v-divider vertical />
            <!-- eslint-disable-next-line vue/max-attributes-per-line -->
            <v-btn class="ma-0" width="199" height="38" tile @click="drawText">
              <span class="pt-0 mb-0" style="color: #127bf8">
                {{ $vuetify.lang.t('$vuetify.meeting.confirm') }}
              </span>
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
      <v-btn text class="pa-0" width="50px" @click="drawRectangle">
        <v-img
          v-if="drawType !== 2"
          width="18px"
          height="18px"
          src="@/assets/white_rectangle_board.png"
        />
        <v-img
          v-if="drawType === 2"
          width="18px"
          height="18px"
          src="@/assets/blue_rectangle_draw.png"
        />
        <span class="title-center normal-text pt-1">{{
          $vuetify.lang.t('$vuetify.meeting.rectangle')
        }}</span>
      </v-btn>
      <v-btn text class="pa-0" width="50px" @click="drawRound">
        <v-img
          v-if="drawType !== 3"
          width="18px"
          height="18px"
          src="@/assets/white_round_board.png"
        />
        <v-img
          v-if="drawType === 3"
          width="18px"
          height="18px"
          src="@/assets/blue_round_draw.png"
        />
        <span class="title-center normal-text pt-1">{{
          $vuetify.lang.t('$vuetify.meeting.round')
        }}</span>
      </v-btn>
      <v-btn text class="pa-0" width="50px" @click="clear">
        <v-img width="18px" height="18px" src="@/assets/white_clear_board.png" />
        <span class="title-center normal-text pt-1">{{
          $vuetify.lang.t('$vuetify.meeting.clear')
        }}</span>
      </v-btn>
      <v-btn text class="pa-0" width="50px" @click="undo">
        <v-img width="20px" height="18px" src="@/assets/white_undo_board.png" />
        <span class="title-center normal-text pt-1">{{
          $vuetify.lang.t('$vuetify.meeting.undo')
        }}</span>
      </v-btn>
      <v-btn
        :ripple="false"
        class="ml-4"
        color="rgb(52, 125, 240)"
        height="30"
        min-width="80"
        outlined
        @click="onMinus"
        >{{ $vuetify.lang.t('$vuetify.meeting.hideWhiteboard') }}</v-btn
      >
      <v-dialog v-model="showExitWhiteboardDlg" width="300" persistent no-click-animation>
        <template #activator="{ on, attrs }">
          <v-btn
            v-show="isSharer"
            :ripple="false"
            v-bind="attrs"
            class="ml-4"
            height="30"
            color="red"
            outlined
            min-width="80"
            v-on="on"
            >{{ $vuetify.lang.t('$vuetify.meeting.whiteboardEnd') }}</v-btn
          >
        </template>
        <v-card>
          <div class="pt-5 pb-5 pl-11 pr-11">
            <span class="big-text flex-center">{{
              $vuetify.lang.t('$vuetify.meeting.exitWhiteboardText')
            }}</span>
          </div>
          <v-divider />
          <v-card-actions
            class="d-flex align-end pl-0 pr-0 pt-0 pb-0 justify-space-between"
          >
            <v-btn
              class="btn-left mr-0"
              depressed
              height="38"
              color="#fff"
              width="149"
              tile
              @click="showExitWhiteboardDlg = false"
              >{{ $vuetify.lang.t('$vuetify.meeting.cancel') }}</v-btn
            >
            <v-divider vertical />
            <v-btn
              class="mr-0"
              depressed
              height="38"
              color="#fff"
              width="149"
              @click="onEndWhiteboard"
              ><span class="pt-0 mb-0" style="color: #127bf8">{{
                $vuetify.lang.t('$vuetify.meeting.confirm')
              }}</span></v-btn
            >
          </v-card-actions>
        </v-card>
      </v-dialog>
    </div>
  </div>
</template>

<script>
import { mapMutations, mapState } from 'vuex'
import { DrawType, ShareType } from '../../common'
import AppBar from '../common/appBar'
import { MeetingCoreRoomEvents } from '../../common/renderCommon'

export default {
  name: 'WhiteBoardView',
  components: {
    AppBar
  },
  model: {
    prop: 'show',
    event: 'close'
  },
  props: {
    show: {
      type: Boolean,
      default() {
        return false
      }
    }
  },
  data() {
    return {
      isEraserMode: false,
      drawType: DrawType.Line,
      hex: null,
      showColorPicker: false,
      swatches: [
        ['#FF0000', '#AA0000', '#550000'],
        ['#FFFF00', '#AAAA00', '#555500'],
        ['#00FF00', '#00AA00', '#005500'],
        ['#00FFFF', '#00AAAA', '#005555'],
        ['#0000FF', '#0000AA', '#000055']
      ],
      showInputTextDlg: false,
      inputText: null,
      showExitWhiteboardDlg: false,
      isSharer: false,
      sharerName: null,
      boardColor: '#FF0000'
    }
  },
  computed: {
    ...mapState('meeting', ['userList']),
    selectedColor: {
      get() {
        return this.hex
      },
      set(v) {
        this.hex = v
      }
    }
  },
  watch: {
    selectedColor(val) {
      this.setColor(val)
    }
  },
  mounted() {
    if (window.meetingRoomCore) {
      this.bindEvents()
    } else {
      let timer = setInterval(() => {
        if (window.meetingRoomCore) {
          clearInterval(timer)
          this.bindEvents()
        }
      }, 100)
    }
  },
  beforeCreate() {
    const timer = setTimeout(() => {
      clearTimeout(timer)
      window.whiteboardClient && window.whiteboardClient.setColor('#FF0000')
    }, 3000)
  },
  methods: {
    ...mapMutations('meeting', ['setShareType']),
    getBoardColor(e) {
      this.boardColor = e.hex
    },
    onSwitchFullscreen() {
      this.$emit('onSwitchFullscreen')
    },
    onMinus() {
      // this.$emit('close', false)
      this.setShareType(ShareType.WhiteBoardHide)
    },
    onClose() {
      this.showExitWhiteboardDlg = true
    },
    onEndWhiteboard() {
      if (!window.meetingRoomCore) return
      window.meetingRoomCore.stopShare().then(() => {
        this.showExitWhiteboardDlg = false
        // this.$emit('close', false)
      })
    },
    drawLine() {
      if (!window.whiteboardClient) return
      this.isEraserMode = false
      this.drawType = DrawType.Line
      window.whiteboardClient.drawLine()
    },
    drawStraightLine() {
      if (!window.whiteboardClient) return
      this.isEraserMode = false
      this.drawType = DrawType.StraightLine
      window.whiteboardClient.drawStraightLine()
    },
    drawRectangle() {
      if (!window.whiteboardClient) return
      this.isEraserMode = false
      this.drawType = DrawType.Rectangle
      window.whiteboardClient.drawRectangle()
    },
    drawRound() {
      if (!window.whiteboardClient) return
      this.isEraserMode = false
      this.drawType = DrawType.Round
      window.whiteboardClient.drawRound()
    },
    drawText() {
      if (window.whiteboardClient && this.inputText) {
        if (this.isEraserMode) {
          this.switchDelete()
        }
        window.whiteboardClient.drawText(this.inputText)
        this.inputText = null
      }
      this.showInputTextDlg = !this.showInputTextDlg
    },
    switchDelete() {
      if (!window.whiteboardClient) return
      if (this.isEraserMode) {
        this.drawType = this.storeDrawTypeInEraserMode
        this.isEraserMode = false
      } else {
        this.storeDrawTypeInEraserMode = this.drawType
        this.drawType = DrawType.Eraser
        this.isEraserMode = true
      }
      window.whiteboardClient.switchDelete()
    },
    setColor(color) {
      if (!window.whiteboardClient || !color) return
      if (this.isEraserMode) {
        this.switchDelete()
      }
      window.whiteboardClient.setColor(color.hex)
    },
    clear() {
      if (!window.whiteboardClient) return
      window.whiteboardClient.clearAll()
    },
    undo() {
      if (!window.whiteboardClient) return
      window.whiteboardClient.undo()
    },
    bindEvents() {
      window.meetingRoomCore.on(
        MeetingCoreRoomEvents.SHARE_CHANGE,
        (roomId, uid, value) => {
          if (value === 'whiteboard') {
            if (window.meetingRoomCore.user.id === uid) {
              this.isSharer = true
              this.sharerName = window.meetingRoomCore.user.name
            } else {
              const user = this.userList.find((u) => u.id === uid)
              if (user) {
                this.sharerName = user.name
              }
            }
          } else {
            this.isSharer = false
            this.sharerName = null
          }
        }
      )
      window.meetingRoomCore.on(
        MeetingCoreRoomEvents.GROUP_ID_CHANGE,
        (uid, breakoutId) => {
          if (uid === window.meetingRoomCore.userId) {
            this.showExitWhiteboardDlg = false
            this.$emit('close', false)
          }
        }
      )
    }
  }
}
</script>

<style lang="scss">
#whiteboard-container {
  position: absolute;
  top: 0;
  bottom: 0;
  width: 100%;
  background-color: white;
  .wb-main {
    width: 100%;
    height: calc(100% - 24px - 56px);
  }
  .wb-bottom-bar {
    position: absolute;
    bottom: 0;
    width: 100%;
    height: 56px;
    .v-btn__content {
      display: flex;
      align-items: center;
      justify-content: center;
      flex-direction: column;
    }
    button {
      height: 100%;
    }
  }
}
</style>
