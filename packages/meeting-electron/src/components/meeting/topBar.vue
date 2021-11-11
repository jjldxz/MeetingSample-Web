<template>
  <div
    id="meeting-main-top-bar"
    :style="{
      background: show ? '#F8F8F8' : '#000',
      color: show ? '#333' : '#fff'
    }"
    class="topBar flex-center"
    style="justify-content: space-between"
  >
    <div class="flex-center pl-2">
      <div class="flex-center">
        <v-menu min-width="240" open-on-hover offset-y>
          <template #activator="{ on, attrs }">
            <v-btn v-bind="attrs" icon class="mr-1" v-on="on">
              <v-icon color="#999999" size="22">mdi-information</v-icon>
            </v-btn>
          </template>
          <v-list class="pl-5 pr-5">
            <v-list-item class="pl-0 pb-0 pt-2 pr-0">
              <v-list-item-content class="pl-0 pb-0 pt-0 pr-0">
                <span class="info-name">{{ meetingInfo ? meetingInfo.name : '' }}</span>
              </v-list-item-content>
            </v-list-item>
            <v-list-item class="pl-0 pr-0 pb-2" style="min-height: 20px">
              <div class="light-color d-flex align-center">
                <v-img class="mr-2" height="15" width="12" src="@/assets/protect.png" />{{
                  $vuetify.lang.t('$vuetify.meeting.meetingEncrypted')
                }}
              </div>
            </v-list-item>
            <v-divider />
            <v-list-item class="pl-0 pr-0">
              <span class="light-color pr-2 pb-0" style="min-height: 20px">
                {{ $vuetify.lang.t('$vuetify.meeting.meetingId') }}
              </span>
              <span>{{ formatMeetingID(meetingInfo.number) }}</span>
              <v-btn color="#878787" icon @click="onCopyMeetingID">
                <img alt width="12px" height="12px" src="@/assets/copy_color.png" />
              </v-btn>
            </v-list-item>
            <v-list-item class="pa-0" style="min-height: 20px">
              <span class="light-color pr-2">{{
                $vuetify.lang.t('$vuetify.meeting.host')
              }}</span
              ><span>{{ meetingInfo.ownerName }}</span>
            </v-list-item>
          </v-list>
        </v-menu>
      </div>
      <!-- 信号 -->
      <div class="pl-1" :title="$vuetify.lang.t('$vuetify.meeting.uploadNetwork')">
        <v-img
          v-show="txQuality === 'none'"
          src="@/assets/wifi_none.png"
          width="16px"
          height="16px"
        />
        <v-img
          v-show="txQuality === 'error'"
          src="@/assets/wifi_error.png"
          width="16px"
          height="16px"
        />
        <v-img
          v-show="txQuality === 'normal'"
          src="@/assets/wifi_normal.png"
          width="16px"
          height="16px"
        />
        <v-img
          v-show="txQuality === 'good'"
          src="@/assets/wifi_good.png"
          width="16px"
          height="16px"
        />
      </div>
      <div class="pl-3" :title="$vuetify.lang.t('$vuetify.meeting.downloadNetwork')">
        <v-img
          v-show="rxQuality === 'none'"
          src="@/assets/wifi_none.png"
          width="16px"
          height="16px"
        />
        <v-img
          v-show="rxQuality === 'error'"
          src="@/assets/wifi_error.png"
          width="16px"
          height="16px"
        />
        <v-img
          v-show="rxQuality === 'normal'"
          src="@/assets/wifi_normal.png"
          width="16px"
          height="16px"
        />
        <v-img
          v-show="rxQuality === 'good'"
          src="@/assets/wifi_good.png"
          width="16px"
          height="16px"
        />
      </div>
    </div>
    <div class="flex-center pl-2">
      <div v-show="title">{{ title }}</div>
    </div>
    <!-- 中间布局改变按钮 -->
    <div class="flex-v-center pr-4 align-center">
      <div v-show="showGridBtn" class="flex-center">
        <v-btn :ripple="false" icon @click="onClick3v3Grid">
          <img style="width: 20px; height: 20px" src="@/assets/grid3v3.png" alt />
        </v-btn>
        <v-btn :ripple="false" icon @click="onClick4v4Grid">
          <img style="width: 16px; height: 16px" src="@/assets/grid4v4.png" alt />
        </v-btn>
        <v-btn :ripple="false" icon @click="onClickLRGrid">
          <img style="width: 20px; height: 20px" src="@/assets/layout-2-fill.png" alt />
        </v-btn>
        <v-divider class="v-divider" vertical />
      </div>
      <div class="timer">{{ meetingDuration }}</div>
      <v-divider class="v-divider" vertical />
      <v-btn
        class="ml-3 pl-0 pr-0"
        height="20"
        min-width="20"
        text
        @click="onSwitchFullInnerScreen"
      >
        <img
          alt
          :src="
            isFullScreen
              ? require('@/assets/quit_full.png')
              : require('@/assets/full_screen.png')
          "
          height="14px"
          width="14px"
        />
      </v-btn>
    </div>
  </div>
</template>

<script>
import { mapMutations, mapState } from 'vuex'
import moment from 'moment-timezone'
import MeetingCore from '@jjldxz/meeting-core-electron'
import { formatMeetingID } from '../../utils'
import { clipboard } from 'electron'
import { CustomEvents, GridTypes, IPCEvents } from '../../common'

export default {
  name: 'MeetingTopBar',
  props: {
    show: {
      type: Boolean,
      default() {
        return true
      }
    },
    title: {
      type: String,
      default() {
        return ''
      }
    },
    showGridBtn: {
      type: Boolean,
      default() {
        return false
      }
    }
    // isFullScreen: {
    //   type: Boolean,
    //   default() {
    //     return false
    //   }
    // }
  },
  data() {
    return {
      txQuality: 'none',
      rxQuality: 'none',
      meetingDuration: '00:00:00',
      isFullScreen: false
    }
  },
  computed: {
    ...mapState('meeting', ['meetingInfo'])
  },
  beforeMount() {
    window.meetingRoomCore.on(
      MeetingCore.MeetingCoreEvents.Room.LOCAL_NETWORK_QUALITY,
      (tx, rx) => {
        this.txQuality = tx
        this.rxQuality = rx
      }
    )
  },
  beforeDestroy() {
    this.closeMeetingDurationTimer()
  },
  methods: {
    ...mapMutations('meeting', ['setGridType', 'setGridTypeAutoChange']),
    formatMeetingID(meetingId) {
      if (!meetingId) return
      return formatMeetingID(meetingId)
    },
    onCopyMeetingID() {
      clipboard.writeText(this.meetingInfo.number.toString())
      this.$eventBus.$emit(
        CustomEvents.MEETING_SHOW_NOTIFICATION,
        this.$vuetify.lang.t('$vuetify.meeting.meetingIdCopy')
      )
    },
    onClick3v3Grid() {
      this.setGridType(GridTypes.TYPE_3)
      this.setGridTypeAutoChange(false)
    },
    onClick4v4Grid() {
      this.setGridType(GridTypes.TYPE_4)
      this.setGridTypeAutoChange(false)
    },
    onClickLRGrid() {
      this.setGridType(GridTypes.TYPE_LR)
      this.setGridTypeAutoChange(false)
    },
    onSwitchFullInnerScreen() {
      this.isFullScreen = !this.isFullScreen
      window.ipc.send(IPCEvents.MEETING.SWITCH_FULL_SCREEN)
      // this.$eventBus.$emit(CustomEvents.MEETING_SWITCH_FULL_SCREEN)
    },
    startMeetingDurationTimer() {
      if (this.meetingDurationTimer) return
      const actuallyBeginAt = this.meetingInfo.actuallyBeginAt
      const real = moment(actuallyBeginAt)
      let current = moment()
      this.meetingDuration = moment.utc(current - real).format('HH:mm:ss')
      this.meetingDurationTimer = setInterval(() => {
        current = moment()
        this.meetingDuration = moment.utc(current - real).format('HH:mm:ss')
      }, 1000)
    },
    closeMeetingDurationTimer() {
      if (this.meetingDurationTimer) {
        clearInterval(this.meetingDurationTimer)
        this.meetingDurationTimer = null
        this.meetingDuration = '00:00:00'
      }
    }
  }
}
</script>

<style lang="scss" scoped>
#meeting-main-top-bar {
  width: 100%;
  height: 36px;
  line-height: 36px;
  z-index: 2;
  .timer {
    height: 36px;
    width: 6rem;
    text-align: center;
  }
  .v-divider {
    margin: 8px 0;
  }
  .is-white {
    background: rgba(255, 255, 255, 0.4) !important;
  }
  .is-black {
    background-color: rgba(0, 0, 0, 0.7) !important;
  }
  .motion-status {
    position: absolute;
    top: 35px;
    right: 0;
    background: rgba(255, 255, 255, 0.4);
    border-top-left-radius: 4px;
    border-bottom-left-radius: 4px;
    z-index: 100;
    display: flex;
    justify-content: center;
    align-items: center;
    .white-string {
      width: 1px;
      height: 16px;
      background: #eeeeee;
      border-radius: 0px 0px 4px 4px;
    }
    .stop-status {
      width: 122px;
      height: 30px;
      text-align: center;
      line-height: 30px;
      cursor: pointer;
      display: flex;
      justify-content: center;
      align-items: center;
      .stop-icon {
        width: 16px;
        height: 16px;
        vertical-align: middle;
        margin-right: 10px;
      }
      .string-black {
        width: 1px;
        height: 10px;
        background: #666666;
        border-radius: 1px;
        margin-left: 6px;
        margin-right: 6px;
      }
      .stop-white {
        width: 12px;
        height: 12px;
      }
      span {
        font-size: 14px;
        color: #ffffff;
        vertical-align: middle;
      }
    }
  }
}
</style>
