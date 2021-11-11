<template>
  <div id="meeting-room">
    <div class="meeting-room-left">
      <meeting-top-bar ref="MeetingRoomTopBar" :show-grid-btn="showGridBtn" />
      <div style="height: calc(100% - 96px)">
        <users-grid />
      </div>
      <meeting-bottom-bar :new-msg-count="newMsgBadgeCount" />
      <div class="bubble-pop-up">
        <div v-for="(msg, i) in bubbleMessageList" :key="i" class="bubble">
          <p class="mb-0">
            <span class="name">{{ msg.userName }}:&ensp;</span>
            <span class="content">{{ msg.content }}</span>
          </p>
        </div>
      </div>
      <div
        v-if="reactionBackList.length > 0 || showHandUpNotice"
        class="reaction-back d-flex align-end"
      >
        <v-img
          v-if="showHandUpNotice"
          src="@/assets/hand_color.png"
          width="36px"
          height="46px"
          class="mr-7"
        />
        <div style="height: 48px; width: 48px" class="d-flex align-end">
          <v-img
            v-for="(info, index) in reactionBackList"
            :key="index"
            :src="require(`@/assets/reactions/${info.content}.png`)"
            style="max-width: 48px; max-height: 48px"
            class="mr-7"
          />
        </div>
      </div>
    </div>
    <div class="meeting-room-right">
      <meeting-side-bar />
    </div>
    <poll
      v-model="showPoll"
      :poll-page="pollPage"
      :poll-id="pollId"
      :poll-status="pollStatus"
      :can-share="pollCanShare"
    />
    <breakout-group v-model="showBreakoutGroup" />
    <pop-tip
      v-model="showPollResultTip"
      :title="$vuetify.lang.t('$vuetify.meeting.poll')"
      :content="pollTip"
      @check="toPollResult"
    />
    <pop-tip />
    <pop-tip
      v-model="showPollDetailTip"
      :title="$vuetify.lang.t('$vuetify.meeting.poll')"
      :content="pollTip"
      @check="toPollDetail"
    />
    <pop-tip />
    <common-dialog
      v-model="showJoinGroupDlg"
      :confirm-btn-label="commonConfirmText"
      :cancel-btn-label="commonCancelText"
      :title="groupDialogTitle"
      :content="joinGroupDlgContent"
      @cancelClick="onCancelJoinGroup"
      @confirmClick="onConfirmJoinGroup"
    />
    <common-dialog
      v-model="unmuteAudioRequestDlg"
      :title="$vuetify.lang.t('$vuetify.meeting.unmuteRequest')"
      :content="$vuetify.lang.t('$vuetify.meeting.unmuteRequestText')"
      @confirmClick="onUnmuteAudio"
    />
  </div>
</template>

<script>
import MeetingTopBar from './topBar'
import MeetingSideBar from './sideBar'
import MeetingBottomBar from './bottomBar/bar'
import UsersGrid from './usersGrid/grid'
import { mapMutations, mapState } from 'vuex'
import {
  MeetingRole,
  ShareType,
  CustomEvents,
  PollType,
  ReactionType,
  DEFAULT_BREAKOUT_GROUP_ID,
  ChatItemType,
  GridTypes
} from '../../common'
import { MeetingCoreRoomEvents } from '../../common/renderCommon'
import { getSystemInfo } from '../../utils'
import Poll from './poll'
import BreakoutGroup from './breakoutGroup/group'
import PopTip from '../common/popTip'
import CommonDialog from '../common/commonDialog'
import getHttpErrorMessage from '../../common/error'
import MeetingUsers from '../../composables/meetingUsers'

export default {
  name: 'MeetingRoom',
  components: {
    MeetingTopBar,
    MeetingSideBar,
    MeetingBottomBar,
    UsersGrid,
    Poll,
    BreakoutGroup,
    PopTip,
    CommonDialog
  },
  props: {
    password: {
      type: Boolean,
      default() {
        return null
      }
    }
  },
  setup(props, { root }) {
    const { attendees } = MeetingUsers(root.$store)
    return { attendees }
  },
  data() {
    return {
      activeUserCheckTimer: null,
      sharer: null,
      showPoll: false,
      showBreakoutGroup: false,
      showPollResultTip: false,
      showPollDetailTip: false,
      pollTip: '',
      pollPage: null,
      pollId: null,
      pollStatus: null,
      pollCanShare: false,
      pollContent: {},
      showJoinGroupDlg: false,
      commonConfirmText: '',
      commonCancelText: '',
      groupDialogTitle: '',
      joinGroupDlgContent: '',
      investGroup: null,
      newMsgBadgeCount: 0,
      bubbleMessageCount: 0,
      bubbleMessageList: [],
      initComplete: false,
      initChecker: null,
      unmuteAudioRequestDlg: false,
      backupGridType: null
    }
  },
  computed: {
    ...mapState('meeting', [
      'meetingInfo',
      'userList',
      'lockView',
      'shareType',
      'videoOnUserList',
      'sideBarType',
      'currentBreakoutGroup',
      'breakoutGroupStatus',
      'isHost',
      'isCoHost',
      'gridType',
      'reactionBackList'
    ]),
    showGridBtn() {
      return this.videoOnUserList.length > 0
    },
    showHandUpNotice() {
      return this.attendees.filter((u) => u.state.hand).length > 0
    }
  },
  watch: {
    breakoutGroupStatus(val) {
      if (!val) {
        this.setCurrentBreakoutGroup({})
        this.investGroup = null
      }
    },
    currentBreakoutGroup(val) {
      if (val) {
        const meetingTitle = this.breakoutGroupStatus && val ? val.name : null
        this.$emit('updateMeetingTitle', meetingTitle)
      } else {
        this.$emit('updateMeetingTitle', null)
      }
    },
    investGroup(val) {
      if (val && Object.keys(val).length > 0) {
        if (val.type === 'join') {
          this.joinGroupDlgContent = this.$vuetify.lang.t(
            '$vuetify.meeting.hostChangeUsersToOtherGroup'
          )
          this.groupDialogTitle = this.$vuetify.lang.t('$vuetify.meeting.joinGroupTitle')
        } else if (val.type === 'call') {
          this.joinGroupDlgContent = this.$vuetify.lang.t(
            '$vuetify.meeting.investHostTo',
            val.name
          )
          this.groupDialogTitle = this.$vuetify.lang.t('$vuetify.meeting.callHost')
        }
        this.commonConfirmText = this.$vuetify.lang.t('$vuetify.meeting.joinGroup')
        this.commonCancelText = this.$vuetify.lang.t('$vuetify.meeting.later')
        this.showJoinGroupDlg = true
      } else {
        this.showJoinGroupDlg = false
      }
    },
    sideBarType(val) {
      if (val === 'MeetingChat') {
        this.newMsgBadgeCount = 0
      }
    },
    initComplete(val) {
      if (val) {
        if (this.initChecker) {
          clearTimeout(this.initChecker)
          this.initChecker = null
        }
        this.$emit('load', false)
      }
    }
  },
  mounted() {
    this.$emit('load', true)
    this.bindCustomEvents()
    this.bindMeetingRoomCoreEvents()
    window.meetingRoomCore
      .join(this.password)
      .then(() => {})
      .catch((e) => {
        console.error(e)
        this.initComplete = true
        let errMsg = getHttpErrorMessage.call(this, e.code)
        this.$emit(
          'error',
          errMsg ? errMsg : this.$vuetify.lang.t('$vuetify.meeting.joinMeetingFail')
        )
      })
    this.initChecker = setTimeout(() => {
      if (!this.initComplete) {
        this.initComplete = true
        this.$emit('error', this.$vuetify.lang.t('$vuetify.meeting.joinMeetingFail'))
      }
    }, 30000)
  },
  methods: {
    ...mapMutations('meeting', [
      'addUser',
      'setHost',
      'setCoHost',
      'setAudioMute',
      'setVideoMute',
      'addVideoOnUser',
      'deleteVideoOnUser',
      'setShareType',
      'setPollVoted',
      'delReaction',
      'updateReaction',
      'setBreakOutGroupStatus',
      'updateUserGroupId',
      'setCurrentBreakoutGroup',
      'setMetingAudioMute',
      'updateUserProps',
      'removeUserById',
      'setGridType',
      'addChatMessage'
    ]),
    endShare() {
      const screenShareId = window.meetingRoomCore.screenShareId
      this.setShareType(ShareType.None)
      this.setGridType(this.backupGridType ? this.backupGridType : GridTypes.TYPE_3)
      this.removeUser(screenShareId)
      this.sharer = null
      this.sharerNotice = null
      this.backupGridType = null
    },
    removeUser(uid) {
      this.removeUserById(uid)
      this.deleteVideoOnUser(uid)
    },
    bindCustomEvents() {
      this.$eventBus.$on(CustomEvents.OPEN_POLL, () => {
        this.showPoll = true
      })
      this.$eventBus.$on(CustomEvents.CLOSE_POLL, () => {
        this.showPoll = false
      })
      this.$eventBus.$on(CustomEvents.OPEN_BREAKOUT_GROUP, () => {
        this.showBreakoutGroup = true
      })
      this.$eventBus.$on(CustomEvents.CLOSE_BREAKOUT_GROUP, () => {
        this.showBreakoutGroup = false
      })
    },
    bindMeetingRoomCoreEvents() {
      window.meetingRoomCore.on(
        MeetingCoreRoomEvents.LOCAL_USER_JOIN_SUCCESS,
        (roomId) => {}
      )
      window.meetingRoomCore.on(MeetingCoreRoomEvents.INIT_COMPLETE, (roomId) => {
        // set host flag and co-host flag
        this.setHost(window.meetingRoomCore.user.role === MeetingRole.Host)
        this.setCoHost(window.meetingRoomCore.user.role === MeetingRole.Assistant)
        // Start duration timer
        this.$refs.MeetingRoomTopBar.startMeetingDurationTimer()

        this.setAudioMute(!window.meetingRoomCore.user.audioState)
        this.setVideoMute(!window.meetingRoomCore.user.videoState)
        this.setMetingAudioMute(!window.meetingRoomCore.roomAudio)

        //set breakout group
        if (window.meetingRoomCore.breakoutGroupsInfo.length > 0) {
          this.setBreakOutGroupStatus(true)
          const group = window.meetingRoomCore.breakoutGroupsInfo.find((g) => {
            const idx = g.users.findIndex(
              (uid) => uid === window.meetingRoomCore.user.extId
            )
            return idx !== -1
          })
          if (group) {
            this.setCurrentBreakoutGroup({ id: group.id, name: group.name })
          } else {
            this.setCurrentBreakoutGroup({
              id: DEFAULT_BREAKOUT_GROUP_ID,
              name: this.$vuetify.lang.t('$vuetify.meeting.mainGroupName')
            })
          }
        } else {
          this.setBreakOutGroupStatus(false)
        }

        meetingRoomCore.users.map((user) => {
          if (window.meetingRoomCore.user.groupId === user.groupId && user.videoState) {
            this.addVideoOnUser(user.id)
          }
          this.addUser(JSON.parse(JSON.stringify(user)))
          if (!this.sharer) {
            if (user.state.share === 'whiteboard') {
              this.sharer = user.id
              this.setShareType(ShareType.WhiteBoard)
              this.sharerNotice =
                `${user.name} ` +
                this.$vuetify.lang.t('$vuetify.meeting.sharingWhiteboard')
              this.controlName = `${user.name}`
            } else if (
              user.state.share === 'desktop' ||
              user.state.share === 'application'
            ) {
              this.sharer = user.id
              this.setShareType(ShareType.Screen)
              this.backupGridType = this.gridType
              this.setGridType(GridTypes.TYPE_LR)
              this.sharerNotice =
                `${user.name} ` + this.$vuetify.lang.t('$vuetify.meeting.sharingScreen')
              this.controlName = `${user.name}`
              const screenShareId = window.meetingRoomCore.screenShareId
              const tmp = {
                id: screenShareId,
                role: MeetingRole.Share,
                name: this.sharerNotice,
                groupId: 0,
                state: {
                  video: true,
                  audio: false
                }
              }
              this.addUser(tmp)
              this.$nextTick(function () {
                this.$eventBus.$emit(CustomEvents.NEW_ACTIVE_USER, screenShareId)
              })
            }

            this.initComplete = true
            // if (this.sharer) {
            //   this.$nextTick(function () {
            //     this.$eventBus.$emit(CustomEvents.SET_USER_SHARE, [this.sharerNotice])
            //   })
            // }
          }
        })

        window.rtcClient = window.meetingRoomCore.createRTCClient()
        this.initCameraDevice()
        this.initSpeakerDevice()
        this.initMicrophoneDevice()
        window.rtcClient.start()

        // setup system info for analytical data
        getSystemInfo().then((resp) => {
          window.meetingRoomCore.setSystemInfo(resp)
        })

        // create whiteboard
        window.meetingRoomCore
          .createWhiteboardTool('dxz-wb')
          .then((wb) => {
            window.whiteboardClient = wb
          })
          .catch((e) => {
            console.error(e)
          })

        window.chatClient = window.meetingRoomCore.chatClient
        this.$emit('load', false)
      })
      window.meetingRoomCore.on(
        MeetingCoreRoomEvents.SYNC_USER_INFO_COMPLETE,
        (roomId) => {}
      )
      window.meetingRoomCore.on(MeetingCoreRoomEvents.USER_ATTR_INIT, (roomId, user) => {
        if (user.role === MeetingRole.Record) return
        this.addUser(JSON.parse(JSON.stringify(user)))
        if (
          user.id !== window.meetingRoomCore.user.id &&
          user.groupId === window.meetingRoomCore.user.groupId &&
          user.state.video
        ) {
          this.addVideoOnUser(user.id)
        }
      })
      window.meetingRoomCore.on(
        MeetingCoreRoomEvents.ROOM_START,
        (roomId, senderId) => {}
      )

      window.meetingRoomCore.on(
        MeetingCoreRoomEvents.MEMBER_ONLINE,
        (roomId, userId) => {}
      )
      window.meetingRoomCore.on(
        MeetingCoreRoomEvents.MEMBER_OFFLINE,
        (roomId, userId) => {
          this.removeUser(userId)
          if (this.sharer === userId) {
            this.endShare()
          }
        }
      )
      window.meetingRoomCore.on(
        MeetingCoreRoomEvents.CONTROL_CUSTOM_SIGNAL,
        (event, data, senderId) => {
          this.parseCustomControlEvents(event, data, senderId)
        }
      )
      window.meetingRoomCore.on(
        MeetingCoreRoomEvents.CHANGE_AUDIO_REQUEST,
        (roomId, userId, state) => {
          if (window.meetingRoomCore.userId === userId) {
            if (!state) {
              window.meetingRoomCore.changeAudio(state).catch((e) => {
                console.error(e)
              })
            } else {
              this.unmuteAudioRequestDlg = true
            }
          }
        }
      )
      window.meetingRoomCore.on(
        MeetingCoreRoomEvents.CHANGE_VIDEO_REQUEST,
        (roomId, userId, state) => {
          if (window.meetingRoomCore.userId === userId) {
            window.meetingRoomCore.changeVideo(state).catch((e) => {
              console.error(e)
            })
          }
        }
      )
      window.meetingRoomCore.on(
        MeetingCoreRoomEvents.CHANGE_NAME_REQUEST,
        (roomId, userId, name) => {
          if (window.meetingRoomCore.userId === userId) {
            window.meetingRoomCore.changeUserName(name).catch((e) => {
              console.error(e)
            })
          }
        }
      )
      window.meetingRoomCore.on(
        MeetingCoreRoomEvents.CHANGE_ROLE_REQUEST,
        (roomId, userId, role) => {
          if (window.meetingRoomCore.userId === userId) {
            window.meetingRoomCore.changeUserRole(role).catch((e) => {
              console.error(e)
            })
          }
        }
      )
      window.meetingRoomCore.on(
        MeetingCoreRoomEvents.CUSTOM_ROOM_MESSAGE,
        (category, senderId, receiverId, content) => {}
      )
      window.meetingRoomCore.on(
        MeetingCoreRoomEvents.CUSTOM_PEER_MESSAGE,
        (category, senderId, receiverId, content) => {}
      )
      window.meetingRoomCore.on(
        MeetingCoreRoomEvents.AUDIO_UNMUTE_ALL,
        (roomId, senderId) => {
          this.setMetingAudioMute(false)
          if (senderId !== window.meetingRoomCore.user.id) {
            this.unmuteAudioRequestDlg = true
          }
        }
      )
      window.meetingRoomCore.on(
        MeetingCoreRoomEvents.AUDIO_MUTE_ALL,
        (roomId, enableChange, senderId) => {
          this.setMetingAudioMute(true)
          if (senderId !== window.meetingRoomCore.user.id) {
            window.meetingRoomCore.changeVideo(false).catch((e) => {
              console.error(e)
            })
          }
        }
      )
      window.meetingRoomCore.on(MeetingCoreRoomEvents.ROOM_ATTR_UPDATE, (roomId) => {})
      window.meetingRoomCore.on(
        MeetingCoreRoomEvents.NAME_CHANGE,
        (roomId, userId, value) => {
          this.updateUserProps({
            uid: userId,
            name: value
          })
        }
      )
      window.meetingRoomCore.on(
        MeetingCoreRoomEvents.ROLE_CHANGE,
        (roomId, userId, value) => {
          this.updateUserProps({
            uid: userId,
            role: value
          })
        }
      )
      window.meetingRoomCore.on(
        MeetingCoreRoomEvents.AVATAR_CHANGE,
        (roomId, userId, value) => {
          this.updateUserProps({
            uid: userId,
            avatar: value
          })
        }
      )
      window.meetingRoomCore.on(
        MeetingCoreRoomEvents.VIDEO_CHANGE,
        (roomId, userId, value) => {
          if (userId === window.meetingRoomCore.user.id) {
            this.setVideoMute(!value)
          }
          if (value) {
            const user = this.userList.find((u) => u.id === userId)
            this.addVideoOnUser(user.id)
          } else {
            this.deleteVideoOnUser(userId)
          }
          this.updateUserProps({ uid: userId, video: value })
        }
      )
      window.meetingRoomCore.on(
        MeetingCoreRoomEvents.AUDIO_CHANGE,
        (roomId, userId, value) => {
          if (userId === window.meetingRoomCore.user.id) {
            this.setAudioMute(!value)
          }
          this.updateUserProps({ uid: userId, audio: value })
        }
      )
      window.meetingRoomCore.on(
        MeetingCoreRoomEvents.HAND_CHANGE,
        (roomId, userId, value) => {
          this.updateUserProps({ uid: userId, hand: value })
        }
      )
      let that = this
      window.meetingRoomCore.on(
        MeetingCoreRoomEvents.SHARE_CHANGE,
        (roomId, userId, value) => {
          this.updateUserProps({ uid: userId, share: value })
          if (value === 'whiteboard') {
            this.sharer = userId
            this.setShareType(ShareType.WhiteBoard)
            this.backupGridType = null
            const user = this.userList.find((u) => u.id === userId)
            if (user) {
              this.sharerNotice =
                `${user.name} ` +
                this.$vuetify.lang.t('$vuetify.meeting.sharingWhiteboard')
              this.controlName = `${user.name}`
            }
          } else if (value === 'desktop' || value === 'application') {
            this.sharer = userId
            this.setShareType(ShareType.Screen)
            this.backupGridType = this.gridType
            this.setGridType(GridTypes.TYPE_LR)
            const screenShareId = window.meetingRoomCore.screenShareId
            const user = this.userList.find((u) => u.id === userId)
            let shareName = this.$vuetify.lang.t('$vuetify.meeting.sharingScreen')
            if (user) {
              this.sharerNotice = `${user.name} ${shareName}`
              this.controlName = `${user.name}`
            }
            if (window.meetingRoomCore.user.id !== userId) {
              const user = {
                id: screenShareId,
                role: MeetingRole.Share,
                name: this.sharerNotice,
                groupId: 0,
                state: {
                  video: true,
                  audio: false
                }
              }
              this.addUser(user)
              this.$nextTick(function () {
                this.$eventBus.$emit(CustomEvents.NEW_ACTIVE_USER, screenShareId)
              })
            }
            this.desktopShareId = userId
          } else {
            this.endShare()
          }
        }
      )
      window.meetingRoomCore.on(
        MeetingCoreRoomEvents.GROUP_ID_CHANGE,
        (roomId, userId, value) => {
          this.updateUserGroupId({ uid: userId, groupId: value })
        }
      )
      window.meetingRoomCore.on(MeetingCoreRoomEvents.BREAKOUT_GROUPS_START, () => {
        this.setBreakOutGroupStatus(true)
        window.meetingRoomCore
          .getBreakoutGroupsDetail()
          .then(() => {
            const groups = window.meetingRoomCore.breakoutGroupsInfo
            const group = groups.find((g) => {
              const idx = g.users.findIndex(
                (uid) => uid === window.meetingRoomCore.user.extId
              )
              return idx > -1
            })
            if (group) {
              if (group.id === window.meetingRoomCore.user.groupId) {
                this.setCurrentBreakoutGroup({ id: group.id, name: group.name })
              } else {
                this.investGroup = { id: group.id, name: group.name, type: 'join' }
              }
            } else {
              this.setCurrentBreakoutGroup({
                id: DEFAULT_BREAKOUT_GROUP_ID,
                name: this.$vuetify.lang.t('$vuetify.meeting.mainGroupName')
              })
            }
          })
          .catch(() => {
            this.setCurrentBreakoutGroup({
              id: DEFAULT_BREAKOUT_GROUP_ID,
              name: this.$vuetify.lang.t('$vuetify.meeting.mainGroupName')
            })
          })
      })
      window.meetingRoomCore.on(MeetingCoreRoomEvents.BREAKOUT_GROUPS_STOP, () => {
        this.setBreakOutGroupStatus(false)
        if (window.meetingRoomCore.user.groupId !== DEFAULT_BREAKOUT_GROUP_ID) {
          // window.meetingRoomCore.moveUserToOtherBreakoutGroup(DEFAULT_BREAKOUT_GROUP_ID)
          window.meetingRoomCore.changeGroup(DEFAULT_BREAKOUT_GROUP_ID)
        }
      })
      window.meetingRoomCore.on(
        MeetingCoreRoomEvents.BREAKOUT_MOVE_USER_TO_GROUP_REQ,
        async (toGroupId, userIds) => {
          if (userIds.includes(window.meetingRoomCore.user.id)) {
            if (window.meetingRoomCore.breakoutGroupsInfo.length === 0) {
              await window.meetingRoomCore.getBreakoutGroupsDetail()
            }
            const group = window.meetingRoomCore.breakoutGroupsInfo.find(
              (g) => g.id === toGroupId
            )
            let name
            if (group) {
              name = group.name
            } else {
              name =
                toGroupId === DEFAULT_BREAKOUT_GROUP_ID
                  ? this.$vuetify.lang.t('$vuetify.meeting.mainGroupName')
                  : this.$vuetify.lang.t('$vuetify.meeting.newGroupName', group.id)
            }
            this.investGroup = { id: toGroupId, name: name, type: 'join' }
          }
        }
      )
      window.meetingRoomCore.on(
        MeetingCoreRoomEvents.BREAKOUT_BROADCAST_MESSAGE,
        (roomId, senderId, message, groupId) => {
          if (
            senderId !== window.meetingRoomCore.user.id &&
            this.sideBarType !== 'MeetingChat'
          ) {
            this.newMsgBadgeCount++
          }
          const user = this.userList.find((u) => u.id === senderId)
          const msgObj = {
            role:
              senderId === window.meetingRoomCore.user.id
                ? ChatItemType.Sender
                : ChatItemType.Receiver,
            content: message,
            userName: user.name,
            userRole: user.role,
            avatar: user.avatar,
            sendToId: null,
            groupId: groupId ? groupId : window.meetingRoomCore.user.groupId,
            sendToName: this.$vuetify.lang.t('$vuetify.meeting.everyone')
          }
          this.addChatMessage(msgObj)
        }
      )
      window.meetingRoomCore.on(
        MeetingCoreRoomEvents.BREAKOUT_CALL_HOST,
        async (senderId, groupId) => {
          if (this.isHost || this.isCoHost) {
            if (window.meetingRoomCore.breakoutGroupsInfo.length === 0) {
              await window.meetingRoomCore.getBreakoutGroupsDetail()
            }
            let group = window.meetingRoomCore.breakoutGroupsInfo.find(
              (g) => g.id === groupId
            )
            group = group
              ? { id: group.id, name: group.name }
              : groupId === DEFAULT_BREAKOUT_GROUP_ID
              ? {
                  id: groupId,
                  name: this.$vuetify.lang.t('$vuetify.meeting.mainGroupName')
                }
              : {
                  id: groupId,
                  name: this.$vuetify.lang.t('$vuetify.meeting.newGroupName', groupId)
                }

            this.investGroup = { ...group, type: 'call' }
          }
        }
      )
      window.meetingRoomCore.on(
        MeetingCoreRoomEvents.USER_REALTIME_VOLUME,
        (userId, volume) => {
          this.startActiveUserChecker(userId, volume)
        }
      )
      window.meetingRoomCore.on(
        MeetingCoreRoomEvents.CHAT_ROOM_MESSAGE,
        (senderId, receiverId, content) => {
          const user = this.userList.find((u) => u.id === senderId)
          if (user && user.groupId === window.meetingRoomCore.user.groupId) {
            if (this.sideBarType !== 'MeetingChat') {
              this.newMsgBadgeCount++
            }
            const msg = {
              role: ChatItemType.Receiver,
              content: content,
              userName: user.name,
              userRole: user.role,
              avatar: user.avatar,
              sendToId: null,
              groupId: user.groupId,
              sendToName: this.$vuetify.lang.t('$vuetify.meeting.everyone')
            }
            this.addChatMessage(msg)
            if (content.bubble) {
              if (this.bubbleMessageList.length >= 5) {
                this.bubbleMessageList.splice(0, 1)
              }
              this.bubbleMessageCount++
              this.bubbleMessageList.push({ ...content, id: this.bubbleMessageCount })
              const tempId = this.bubbleMessageCount
              setTimeout(() => {
                const idx = this.bubbleMessageList.findIndex((b) => b.id === tempId)
                if (idx !== -1) {
                  this.bubbleMessageList.splice(idx, 1)
                }
              }, 4000)
            }
          }
        }
      )
      window.meetingRoomCore.on(
        MeetingCoreRoomEvents.CHAT_PEER_MESSAGE,
        (senderId, receiverId, content) => {
          const senderUser = this.userList.find((u) => u.id === senderId)
          const receiveUser = this.userList.find((u) => u.id === receiverId)
          if (senderUser && receiveUser) {
            if (this.sideBarType !== 'MeetingChat') {
              this.newMsgBadgeCount++
            }
            const msg = {
              role: ChatItemType.Receiver,
              content: content,
              userName: senderUser.name,
              userRole: senderUser.role,
              avatar: senderUser.avatar,
              sendToId: receiveUser.id,
              sendToName: receiveUser.name,
              groupId: senderUser.groupId
            }
            this.addChatMessage(msg)
          }
        }
      )
      window.meetingRoomCore.on(
        MeetingCoreRoomEvents.CHAT_SYSTEM_ROOM_MESSAGE,
        (senderId, receiverId, content) => {}
      )
      window.meetingRoomCore.on(
        MeetingCoreRoomEvents.CHAT_SYSTEM_PEER_MESSAGE,
        (senderId, receiverId, content) => {}
      )
      // window.meetingRoomCore.on(MeetingCoreRoomEvents.SCREEN_SHARE_JOIN, (shareId) => {
      //   if (this.shareType === ShareType.Screen) {
      //     window.rtcClient.startShareScreen(this.shareObj.displayId)
      //   } else if (this.shareType === ShareType.Window) {
      //     window.rtcClient.startShareWindow(this.shareObj.windowId)
      //   }
      // })
      // window.meetingRoomCore.on(MeetingCoreRoomEvents.SCREEN_SHARE_LEAVE, (shareId) => {})
    },
    initCameraDevice() {
      if (!window.rtcClient) return
      let cameraDeviceId = this.$configStore.get('cameraDeviceId')
      const cameraDevices = window.rtcClient.getCameraDevices()
      if (cameraDeviceId && cameraDevices.find((c) => c.deviceid === cameraDeviceId)) {
        window.rtcClient.setCameraDevice(cameraDeviceId)
      } else {
        cameraDeviceId = window.rtcClient.getActiveCameraDevice()
        this.$configStore.set('cameraDeviceId', cameraDeviceId)
      }
    },
    initSpeakerDevice() {
      if (!window.rtcClient) return
      let speakerDeviceId = this.$configStore.get('speakerDeviceId')
      const speakerDevices = window.rtcClient.getSpeakerDevices()
      if (speakerDeviceId && speakerDevices.find((s) => s.deviceid === speakerDeviceId)) {
        window.rtcClient.setActiveSpeakerDevice(speakerDeviceId)
      } else {
        speakerDeviceId = window.rtcClient.getActiveSpeakerDevice()
        this.$configStore.set('speakerDeviceId', speakerDeviceId)
      }

      let speakerVolume = this.$configStore.get('speakerVolume')
      if (typeof speakerVolume !== 'number') {
        window.rtcClient.setSpeakerVolume(speakerVolume)
      } else {
        speakerVolume = window.rtcClient.getSpeakerVolume()
        this.$configStore.set('speakerVolume', speakerVolume)
      }
    },
    initMicrophoneDevice() {
      if (!window.rtcClient) return
      let micDeviceId = this.$configStore.get('microphoneDeviceId')
      const micDevices = window.rtcClient.getMicrophoneDevices()
      if (micDeviceId && micDevices.find((m) => m.deviceid === micDeviceId)) {
        window.rtcClient.setActiveSpeakerDevice(micDeviceId)
      } else {
        micDeviceId = window.rtcClient.getActiveMicrophoneDevice()
        this.$configStore.set('microphoneDeviceId', micDeviceId)
      }

      let micVolume = this.$configStore.get('microphoneVolume')
      if (typeof micVolume !== 'number') {
        window.rtcClient.setMicrophoneVolume(micVolume)
      } else {
        micVolume = window.rtcClient.getMicrophoneVolume()
        this.$configStore.set('microphoneVolume', micVolume)
      }
    },
    startActiveUserChecker(userId, volume) {
      if (!this.activeUserCheckTimer) {
        this.activeUserCheckTimer = setTimeout(() => {
          if (!window.meetingRoomCore) return
          if (
            (!this.sharer ||
              this.shareType === ShareType.WhiteBoard ||
              this.shareType === ShareType.WhiteBoardHide) &&
            !this.lockView
          ) {
            userId = userId === 0 ? window.meetingRoomCore.user.id : userId
            if (volume === 0) {
              this.$eventBus.$emit(CustomEvents.CLEAR_ACTIVE_USER, userId)
            } else {
              this.$eventBus.$emit(CustomEvents.NEW_ACTIVE_USER, userId)
            }
          }
          clearTimeout(this.activeUserCheckTimer)
          this.activeUserCheckTimer = null
        }, 2000)
      }
    },
    cleanLocalData() {
      window.rtcClient = null
      window.chat = null
    },
    async leave() {
      if (window.meetingRoomCore) {
        await window.meetingRoomCore.leave()
        window.meetingRoomCore = null
      }
      this.cleanLocalData()
    },
    toPollResult() {
      // this.pollId = this.pollContent.vote_id
      // this.pollStatus = 2
      // this.pollPage = 'PollResult'
      // this.showPoll = true
      // this.pollCanShare = true
      this.$eventBus.$emit(CustomEvents.OPEN_POLL)
      this.$eventBus.$emit(
        CustomEvents.OPEN_POLL_PAGE,
        this.pollId,
        this.pollPage,
        this.pollStatus,
        this.pollCanShare
      )
      this.showPollDetailTip = false
    },
    toPollDetail() {
      this.$eventBus.$emit(CustomEvents.OPEN_POLL)
      this.$eventBus.$emit(
        CustomEvents.OPEN_POLL_PAGE,
        this.pollId,
        this.pollPage,
        this.pollStatus,
        this.pollCanShare
      )
      this.showPollDetailTip = false
    },
    parseReactionEvents(messageType, id) {
      const reaction = {
        senderId: id,
        content: messageType
      }
      this.updateReaction(reaction)
      setTimeout(() => {
        this.delReaction(id)
      }, 10000)
    },
    parseCustomControlEvents(event, content, senderId) {
      switch (event) {
        case PollType.PUBLISH_RESULT:
          this.pollContent = content
          this.pollTip = this.$vuetify.lang.t('$vuetify.meeting.pollResultNotice')
          this.pollId = Number(this.pollContent.vote_id)
          this.pollPage = 'PollResult'
          this.pollStatus = 2
          this.pollCanShare = true
          this.showPollDetailTip = true
          break
        case PollType.PUBLISH_POLL:
          this.pollContent = content
          this.pollId = Number(this.pollContent.vote_id)
          this.pollTip = this.$vuetify.lang.t('$vuetify.meeting.newPOllNotice')
          this.pollPage = 'PollDetail'
          this.pollStatus = 1
          this.setPollVoted(false)
          this.showPollDetailTip = true
          break
        case PollType.STOP_PUBLISH_RESULT:
          this.pollCanShare = false
          break
        case ReactionType.REACTION_CLAP:
        case ReactionType.REACTION_CRY:
        case ReactionType.REACTION_HEART:
        case ReactionType.REACTION_THUMB:
        case ReactionType.REACTION_STUPEFY:
        case ReactionType.REACTION_CONGRATULATION:
          this.parseReactionEvents(event, senderId)
          break
      }
    },
    onCancelJoinGroup() {
      this.joinGroupDlgContent = null
      this.investGroup = null
    },
    onConfirmJoinGroup() {
      window.meetingRoomCore
        .moveUserToOtherBreakoutGroup(this.investGroup.id)
        .then(() => {
          this.setCurrentBreakoutGroup(this.investGroup)
          this.joinGroupDlgContent = null
          this.investGroup = null
        })
        .catch((e) => {
          console.error(e)
        })
    },
    onUnmuteAudio() {
      window.meetingRoomCore.changeAudio(true).catch((e) => {
        console.error(e)
      })
      this.unmuteAudioRequestDlg = false
    }
  }
}
</script>

<style lang="scss" scoped>
#meeting-room {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: row;
  .meeting-room-left {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    width: 77%;
    border-right: #e6e6e6 solid 1px;
    .bubble-pop-up {
      position: absolute;
      left: 0;
      bottom: 188px;
      z-index: 999;
      max-width: 20px;
      .bubble {
        display: inline-block !important;
        max-width: 245px;
        align-items: center;
        margin: 2.5px 0;
        padding: 0 15px 0 10px;
        background-color: rgba(0, 0, 0, 0.7);
        border-top-right-radius: 20px;
        border-bottom-right-radius: 20px;
        font-size: 12px;
        white-space: pre-wrap;
        word-break: break-all;
        overflow: hidden;
        box-sizing: border-box;
        .name {
          color: #ffa210;
        }
        .content {
          color: #fff;
        }
      }
    }
  }
  .meeting-room-right {
    width: 23%;
  }
  .reaction-back {
    position: absolute;
    left: 20px;
    top: 70px;
  }
}
</style>
