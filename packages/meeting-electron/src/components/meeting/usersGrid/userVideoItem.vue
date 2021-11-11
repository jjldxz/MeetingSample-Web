<template>
  <div
    class="d-flex"
    style="flex-direction: column"
    :class="[
      layoutClass,
      gridType === GridTypes.TYPE_LR && isMain
        ? 'pop-to-left'
        : layoutClass === ''
        ? 'd-flex100'
        : ''
    ]"
    :style="{
      display: gridType === GridTypes.TYPE_LR && !isMain ? 'block' : ''
    }"
  >
    <v-responsive style="flex: 0 0 auto" :aspect-ratio="16 / 9" max-height="100%">
      <div>
        <v-btn
          v-show="gridType === GridTypes.TYPE_LR && isMain && userInfo.role !== 'share'"
          class="ml-2 white--text"
          style="position: absolute; top: 10px; z-index: 2"
          color="rgba(73, 168, 238, 0.7)"
          depressed
          small
          tile
          @click="onSwitchLockView"
        >
          <v-icon color="white" left>{{
            lockView ? 'mdi-lock-open-variant' : 'mdi-lock'
          }}</v-icon>
          {{
            lockView
              ? $vuetify.lang.t('$vuetify.meeting.unlock')
              : $vuetify.lang.t('$vuetify.meeting.lock')
          }}
        </v-btn>
      </div>
      <div
        v-show="!cameraOn"
        style="
          width: 100%;
          height: 100%;
          flex-direction: column;
          border: ghostwhite solid 1px;
        "
        class="flex-center"
        :class="[isMain ? 'focus-win' : '']"
      >
        <v-avatar size="48">
          <img
            alt
            class="default-user-avatar"
            :src="
              userInfo.avatar ? userInfo.avatar : require('@/assets/default-avatar.png')
            "
          />
        </v-avatar>
        <div v-if="isHost" class="flex-center" style="margin-top: -5px">
          <v-avatar size="10" color="orange">
            <v-icon size="8" dark>mdi-account</v-icon>
          </v-avatar>
        </div>
        <div class="flex-center">
          <span class="white--text" style="font-size: 12px" v-html="userInfo.name" />
          <v-avatar size="10" color="#127bf8" class="ml-1">
            <v-icon
              size="8"
              :style="{ color: !microphoneOn ? 'red' : '' }"
              class="white--text"
              >{{ microphoneOn ? 'mdi-microphone' : 'mdi-microphone-off' }}</v-icon
            >
          </v-avatar>
        </div>
      </div>
      <div
        v-show="cameraOn"
        :id="`u-${id}`"
        :class="[
          isMain ? 'focus-win' : '',
          localLandscape
            ? gridType === GridTypes.TYPE_LR
              ? 'landscape-lr'
              : 'landscape'
            : 'portrait'
        ]"
        class="camera-container"
        :tabindex="isShare ? '1' : '-1'"
      >
        <div
          style="position: absolute; height: 30px; bottom: 1px; left: 1px; z-index: 1"
          class="flex-center"
        >
          <div
            v-if="isShare"
            style="
              background-color: #00000066;
              height: 24px;
              line-height: 30px;
              padding-left: 5px;
            "
          >
            <v-icon
              size="20"
              class="pr-1"
              :style="{ color: userInfo.role === 'host' ? '#127BF8' : '#fff' }"
              >mdi-monitor-dashboard</v-icon
            >
          </div>
          <div
            v-else
            :style="{
              'background-color': userInfo.role === 'host' ? 'orange' : '#127BF8'
            }"
            style="margin-left: 1px; margin-bottom: 1px"
          >
            <v-icon class="white--text" size="30">mdi-account</v-icon>
          </div>
          <div
            v-if="!isShare"
            style="
              background-color: #00000066;
              display: flex;
              align-items: center;
              height: 30px;
              line-height: 30px;
              padding: 0 10px;
            "
          >
            <v-img
              max-width="16"
              width="14"
              height="18"
              max-height="18"
              :src="
                microphoneOn
                  ? require('@/assets/mute_white.png')
                  : require('@/assets/unmute_white.png')
              "
            />
          </div>
          <div
            style="
              font-size: 12px;
              background-color: #00000066;
              height: 30px;
              line-height: 30px;
              padding-right: 10px;
            "
          >
            <span class="white--text" v-html="userInfo.name" />
          </div>
        </div>
      </div>
    </v-responsive>
  </div>
</template>

<script>
import { CustomEvents, GridTypes, MeetingRole } from '../../../common'
import { MeetingCoreRoomEvents } from '../../../common/renderCommon'
import { mapGetters, mapMutations, mapState } from 'vuex'

export default {
  name: 'UserVideoItem',
  props: {
    user: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  data() {
    return {
      id: this.user.id,
      userInfo: this.user,
      GridTypes: GridTypes,
      layoutClass: 'quarter-div',
      isMain: false,
      isHost: false,
      cameraOn: false,
      microphoneOn: true,
      localLandscape: true,
      isShare: false
    }
  },
  computed: {
    ...mapState('meeting', ['gridType', 'isLandscape', 'lockView']),
    ...mapGetters('meeting', ['videoList'])
  },
  watch: {
    videoList(val) {
      if (val.length === 1) {
        this.layoutClass = 'quarter-div'
      } else {
        this.getLayoutClass(this.gridType)
      }
    },
    gridType(val) {
      this.getLayoutClass(val)
    }
  },
  beforeDestroy() {
    if (!this.isMe) {
      window.rtcClient && window.rtcClient.unsubscribe(this.id)
    }
  },
  mounted() {
    this.bindCustomEvents()
    this.getLayoutClass(this.gridType)
    if (this.userInfo.role === MeetingRole.Host) {
      this.isHost = true
    }
    if (this.userInfo.role === MeetingRole.Share) {
      this.isShare = true
    }
    this.cameraOn = this.userInfo.state.video
    this.microphoneOn = this.userInfo.state.audio
    if (this.userInfo.role === MeetingRole.Share) {
      this.addVideoOnUser(this.userInfo.id)
    }
    if (this.isLandscape.hasOwnProperty(this.id.toString())) {
      this.localLandscape = this.isLandscape[this.id.toString()]
    }

    const initStream = () => {
      this.bindEvents()
      this.playCameraStream(this.id)
    }

    this.$nextTick(function () {
      if (window.meetingRoomCore && window.rtcClient) {
        this.isMe = window.meetingRoomCore.user.id === this.id
        initStream()
      } else {
        let timer = setInterval(() => {
          if (window.meetingRoomCore && window.rtcClient) {
            clearInterval(timer)
            this.isMe = window.meetingRoomCore.user.id === this.id
            initStream()
          }
        }, 100)
      }
    })
  },
  methods: {
    ...mapMutations('meeting', ['switchLockView', 'addVideoOnUser']),
    onSwitchLockView() {
      this.switchLockView()
    },
    getLayoutClass(type) {
      switch (type) {
        case GridTypes.TYPE_1:
          this.layoutClass = 'quarter-div'
          break
        case GridTypes.TYPE_3:
          this.layoutClass = 'quarter-div3'
          break
        case GridTypes.TYPE_4:
          this.layoutClass = 'quarter-div4'
          break
        case GridTypes.TYPE_5:
          this.layoutClass = 'quarter-div5'
          break
        case GridTypes.TYPE_LR:
        default:
          this.layoutClass = ''
          break
      }
    },
    playCameraStream(uid) {
      const dom = document.querySelector(`#u-${uid}`)
      if (dom) {
        if (window.meetingRoomCore.user.id === uid) {
          window.rtcClient.startPreview(`u-${uid}`)
        } else {
          window.rtcClient.subscribe(uid)
          window.rtcClient.play(`u-${uid}`, uid)
        }
      } else {
        console.error('userVideoView:playCameraStream - Dom is null:', uid)
      }
    },
    bindCustomEvents() {
      this.$eventBus.$on(CustomEvents.NEW_ACTIVE_USER, (id) => {
        this.isMain = id === this.id
      })
      this.$eventBus.$on(CustomEvents.CLEAR_ACTIVE_USER, (id) => {
        if (id === this.id) {
          this.isMain = false
        }
      })
    },
    bindEvents() {
      window.meetingRoomCore.on(
        MeetingCoreRoomEvents.VIDEO_CHANGE,
        (roomId, userId, value) => {
          if (userId === this.id) {
            this.cameraOn = value
          }
        }
      )
      window.meetingRoomCore.on(
        MeetingCoreRoomEvents.AUDIO_CHANGE,
        (roomId, userId, value) => {
          if (userId === this.id) {
            this.microphoneOn = value
          }
        }
      )
      window.meetingRoomCore.on(
        MeetingCoreRoomEvents.REMOTE_USER_UNSUBSCRIBED,
        (userId) => {
          if (userId === this.id) {
            this.cameraOn = false
          }
        }
      )
      window.meetingRoomCore.on(
        MeetingCoreRoomEvents.VIDEO_SIZE_CHANGE,
        (uid, width, height, rotation) => {
          if (this.id === uid) {
            console.log(
              'MeetingCoreRoomEvents.VIDEO_SIZE_CHANGE',
              uid,
              width,
              height,
              rotation
            )
            // this.isLandscape = rotation !== 90;
            this.localLandscape = width >= height
          }
        }
      )
    }
  }
}
</script>

<style lang="scss" scoped>
.d-flex100 {
  width: 100% !important;
}
.quarter-div5 {
  width: 20%;
  height: 20%;
  /*float: left;*/
}
.quarter-div4 {
  width: 25%;
  height: 25%;
  /*float: left;*/
}
.quarter-div3 {
  width: 33.3%;
  height: 33.33%;
  /*float: left;*/
}
.quarter-div2 {
  width: 50%;
  height: 50%;
  /*float: left;*/
}
.quarter-div {
  width: calc(100% - 2px);
  height: calc(100% - 2px);
}
.pop-to-left {
  color: white;
  position: absolute;
  left: 0;
  top: 15%;
  bottom: 0;
  width: 59%;
  height: auto !important;
  padding-top: 1px;
}
.pop-to-right {
  max-height: 130px;
}
.camera-container {
  height: 100%;
  padding: 1px;
  &.landscape {
    ::v-deep canvas {
      width: 100% !important;
      height: 100% !important;
    }
  }
  &.landscape-lr {
    ::v-deep canvas {
      height: 100% !important;
      width: 100% !important;
    }
  }
  &.portrait {
    ::v-deep canvas {
      width: 34% !important;
      height: 100% !important;
    }
  }
}
.focus-win {
  border: 1px solid lawngreen !important;
}
.reaction-small {
  position: absolute;
  left: 20px;
  top: 10px;
}
</style>
