<template>
  <div id="meeting-win">
    <div class="meeting-container">
      <app-bar :on-close="onAppClose" :title="meetingTitle" />
      <div class="meeting-main">
        <component
          :is="currentComponent"
          :password="password"
          @goTo="onGoTo"
          @load="onLoading"
          @error="onError"
          @updateMeetingTitle="updateMeetingTitle($event)"
        />
        <overlay-with-loading v-model="meetingLoading" />
      </div>
    </div>
    <v-snackbar
      v-model="commonNotificationOpen"
      :timeout="commonNotification.timeout"
      :color="commonNotification.color"
      centered
    >
      <div style="margin-left: 8px">{{ commonNotification.msg }}</div>
    </v-snackbar>
    <error-overlay
      v-model="errorOverlay"
      :message="errorOverlayMsg"
      :after-closed="closeWin"
    />
    <white-board v-model="showWhiteboard" />
    <exit-meeting v-model="exitMeeting" />
  </div>
</template>

<script>
import { mapMutations, mapState } from 'vuex'
import AppBar from '../components/common/appBar'
import CreateMeetingCoreInst from '../composables/createMeetingCoreInst'
import { CustomEvents, IPCEvents, MeetingRole, ShareType } from '../common'
import { MeetingCoreRoomEvents } from '../common/renderCommon'
import MeetingWithPassword from '../components/meeting/meetingWithPassword'
import MeetingRoom from '../components/meeting/meetingRoom'
import ErrorOverlay from '../components/common/errorOverlay'
import OverlayWithLoading from '../components/common/overlayWithLoading'
import WhiteBoard from '../components/meeting/whiteboard'
import ExitMeeting from '../components/meeting/exitMeeting'

export default {
  name: 'MeetingView',
  components: {
    AppBar,
    MeetingWithPassword,
    MeetingRoom,
    ErrorOverlay,
    OverlayWithLoading,
    WhiteBoard,
    ExitMeeting
  },
  setup() {
    const { meetingRoomCore } = CreateMeetingCoreInst()
    window.meetingRoomCore = meetingRoomCore
    return { meetingRoomCore }
  },
  data() {
    return {
      meetingName: null,
      commonNotificationOpen: false,
      errorOverlay: false,
      errorOverlayMsg: '',
      commonNotification: {
        timeout: 2000,
        color: '#000000ee',
        msg: ''
      },
      meetingInfo: {},
      currentComponent: null,
      meetingLoading: false,
      password: null,
      showWhiteboard: false,
      exitMeeting: false,
      meetingTitle: null
    }
  },
  computed: {
    ...mapState('meeting', ['shareType', 'breakoutGroupStatus', 'userList'])
  },
  watch: {
    shareType(val) {
      this.showWhiteboard = val === ShareType.WhiteBoard
    }
  },
  beforeMount() {
    this.bindCustomEvents()
    this.bindCoreEvents()
    this.bindIPCEvents()

    const authToken = this.$tmpStore.get('authToken')
    const refreshToken = this.$tmpStore.get('refreshToken')
    if (!authToken || !refreshToken) {
      console.error('miss auth token or refresh token')
      return
    }
    const userInfo = this.$tmpStore.get('userInfo')
    if (!userInfo) {
      console.error('miss user info')
      return
    }
    this.setLoginUserInfo(userInfo)
    const userDisplayName = this.$tmpStore.get('userName')

    const meetingInfo = this.$tmpStore.get('meetingInfo')
    if (!meetingInfo) {
      console.error('miss meeting info')
      return
    }
    this.meetingName = meetingInfo.name
    this.setMeetingInfo(meetingInfo)
    this.setMeetingId(meetingInfo.number)

    let videoMute = this.$tmpStore.get('videoMute')
    videoMute = typeof videoMute !== 'boolean' ? false : videoMute
    let audioMute = this.$tmpStore.get('audioMute')
    audioMute = typeof audioMute !== 'boolean' ? true : audioMute

    this.meetingRoomCore.init({
      authToken,
      refreshToken,
      meetingId: meetingInfo.number,
      userId: userInfo.id,
      apiBaseURL: '',
      userInfo: {
        extId: userInfo.id,
        name: userDisplayName,
        avatar: userInfo.avatar,
        role:
          userInfo.id === meetingInfo.ownerId ? MeetingRole.Host : MeetingRole.Attendee,
        video: !videoMute,
        audio: !audioMute,
        hand: false,
        share: 'none'
      }
    })
    if (meetingInfo.password) {
      this.currentComponent = MeetingWithPassword
    } else {
      this.currentComponent = MeetingRoom
    }
    if (!this.breakoutGroupStatus) {
      this.updateMeetingTitle()
    }

    // this.mockData()
  },
  methods: {
    ...mapMutations('meeting', [
      'setMeetingInfo',
      'setLoginUserInfo',
      'addUser',
      'setChatMessageList',
      'setShareType',
      'setMeetingId',
      'removeUserById',
      'deleteVideoOnUser'
    ]),
    leave() {
      if (window.meetingRoomCore) {
        window.meetingRoomCore.leave()
        window.meetingRoomCore = null
      }
    },
    bindIPCEvents() {
      window.ipc.on(IPCEvents.MEETING.STOP_SCREEN_MARKER, () => {
        window.meetingRoomCore && window.meetingRoomCore.stopShare()
      })
    },
    bindCustomEvents() {
      this.$eventBus.$on(CustomEvents.CLOSE_MEETING, () => {
        this.onAppClose()
      })
      this.$eventBus.$on(CustomEvents.MEETING_SHOW_NOTIFICATION, (content) => {
        this.normalNotice(content)
      })
      this.$eventBus.$on(CustomEvents.SHOW_MEETING_LEAVE_DIALOG, () => {
        this.exitMeeting = true
      })
    },
    bindCoreEvents() {
      window.meetingRoomCore.on(MeetingCoreRoomEvents.ROOM_STOP, (roomId, senderId) => {
        const user = this.userList.find((u) => u.id === senderId)
        if (user) {
          this.errorOverlayMsg = this.$vuetify.lang.t(
            '$vuetify.meeting.meetingEndedBy',
            user.name
          )
          this.errorOverlay = true
        } else {
          this.errorOverlayMsg = this.$vuetify.lang.t('$vuetify.meeting.meetingTimeout')
          this.errorOverlay = true
        }
        this.setShareType(ShareType.None)
        this.leave()
        window.ipc.send('update-meeting-list')
      })
      window.meetingRoomCore.on(
        MeetingCoreRoomEvents.USER_KICK_OUT,
        (roomId, senderId, userId) => {
          if (userId === window.meetingRoomCore.user.id) {
            const user = this.userList.find((u) => u.id === senderId)
            let name = user ? user.name : this.$vuetify.lang.t('$vuetify.meeting.host')
            this.errorOverlayMsg = this.$vuetify.lang.t(
              '$vuetify.meeting.kickedOutBy',
              name
            )
            this.errorOverlay = true
            this.leave()
          } else {
            this.removeUserById(userId)
            this.deleteVideoOnUser(userId)
          }
        }
      )
      window.meetingRoomCore.on(MeetingCoreRoomEvents.REMOTE_LOGIN, () => {
        this.meetingLoading = false
        this.errorOverlayMsg = this.$vuetify.lang.t('$vuetify.meeting.remoteLogin')
        this.errorOverlay = true
        this.leave()
      })
      window.meetingRoomCore.on(MeetingCoreRoomEvents.SERVER_CONNECT_FAIL, () => {
        this.meetingLoading = false
        this.errorOverlayMsg = this.$vuetify.lang.t('$vuetify.meeting.serverConnectFail')
        this.errorOverlay = true
        this.leave()
      })
      window.meetingRoomCore.on(MeetingCoreRoomEvents.INIT_FAIL, (_) => {
        this.meetingLoading = false
        this.errorOverlayMsg = this.$vuetify.lang.t('$vuetify.meeting.joinMeetingFail')
        this.errorOverlay = true
        this.leave()
      })
      window.meetingRoomCore.on(MeetingCoreRoomEvents.LOCAL_USER_JOIN_FAIL, () => {
        this.meetingLoading = false
        this.errorOverlayMsg = this.$vuetify.lang.t('$vuetify.meeting.joinMeetingFail')
        this.errorOverlay = true
        this.leave()
      })
    },
    onAppClose() {
      this.exitMeeting = true
    },
    onJoinMeeting() {
      return this.meetingRoomCore.join()
    },
    normalNotice(msg, timeout = 1500) {
      this.commonNotification = {
        timeout,
        msg,
        color: '#000000ee'
      }
      this.commonNotificationOpen = true
    },
    onGoTo(component, opts = {}) {
      this.currentComponent = component
      opts.password && (this.password = opts.password)
    },
    onLoading(flag) {
      this.meetingLoading = flag
    },
    onError(message) {
      this.errorOverlayMsg = message
      this.meetingLoading = false
      this.errorOverlay = true
    },
    closeWin() {
      window.close()
    },
    mockData() {
      const { MockUsers, MockChatMsgList } = require('@/mock')
      MockUsers.map((u) => {
        this.addUser(u)
      })
      this.setChatMessageList(MockChatMsgList)
    },
    updateMeetingTitle(title) {
      this.meetingTitle = title
        ? title
        : `${this.$vuetify.lang.t('$vuetify.meeting.meeting')}${
            this.meetingName ? ` - ${this.meetingName}` : ''
          }`
    }
  }
}
</script>

<style lang="scss" scoped>
#meeting-win {
  .meeting-container {
    width: 100%;
    height: 100%;
    .meeting-main {
      background-color: white;
      position: absolute;
      width: 100%;
      height: calc(100% - 32px);
    }
  }
  ::v-deep .v-dialog:not(.v-dialog--fullscreen) {
    max-height: 100% !important;
  }
}
</style>
