import EventEmitter from 'wolfy87-eventemitter'
import LvbEngine from '@jjldxz/lvb-electron'
import {
  commitPollRequest,
  createNewPollRequest,
  deletePollRequest,
  getBreakoutGroupsDetailRequest,
  getPollAnswerRequest,
  getPollDetailRequest,
  getPollListRequest,
  getPollResultRequest,
  joinMeetingRequest,
  moveUserToBreakoutGroupRequest,
  setApiBaseURL,
  setAuthToken,
  setRefreshToken,
  sharePollRequest,
  startBreakoutGroupsRequest,
  startPollRequest,
  stopBreakoutGroupsRequest,
  stopMeetingRequest,
  stopPollRequest,
  updatePollRequest
} from '../common/request'
import RTCClient from './rtc'
import { UserMgr } from './user'
import { boolToNumber, stringToBool } from '../utils'
import {
  AudioChange,
  BroadcastMessageToGroups,
  BreakoutCallHostToGroup,
  controlMessageType,
  CustomEvent,
  MeetingCoreEvents,
  messageType,
  MoveUsersToBreakoutGroup,
  NameChange,
  RoleChange,
  ShareType,
  VideoChange,
  ChangeBreakoutGroupsStatus,
  GroupIdChange
} from '../common'
import ChatTool from './lvbTools/chat'
import ShareTool from './lvbTools/share'
import HandTool from './lvbTools/hand'
import WhiteboardTool from './lvbTools/whiteboard'
import AnalyticalParser from './analytical'

const UserAttrToEvent = {
  name: MeetingCoreEvents.Room.NAME_CHANGE,
  role: MeetingCoreEvents.Room.ROLE_CHANGE,
  avatar: MeetingCoreEvents.Room.AVATAR_CHANGE,
  video: MeetingCoreEvents.Room.VIDEO_CHANGE,
  audio: MeetingCoreEvents.Room.AUDIO_CHANGE,
  hand: MeetingCoreEvents.Room.HAND_CHANGE,
  share: MeetingCoreEvents.Room.SHARE_CHANGE,
  groupId: MeetingCoreEvents.Room.GROUP_ID_CHANGE
}

export default class MeetingRoom extends EventEmitter {
  /**
   * @constructor
   */
  constructor() {
    super()
    this._meetingId = null
    this._userId = null
    this._lvbEngine = null
    this._init = false
    this._rtm = null
    this._rtc = null
    this._userMgr = null
    this._userInitInfo = {}
    this._innerRoomId = null
    this._innerUserId = null
    this._roomAttrs = { audio: true, enableAudioChange: true }
    this._roomAttrsCache = {}
    this._userUpdateAttrsCache = {}
    this._enforceAudioMute = false
    this._joined = false
    this._shareType = ShareType.None
    this._tools = {}
    this._appKey = null
    this._share = {}
    this._breakoutInfo = []
  }

  get user() {
    if (!this._userMgr || !this._userMgr.user) return {}
    return this._userMgr.user
  }

  get userId() {
    if (!this._userMgr) return
    return this._userMgr.user.id
  }

  get users() {
    if (!this._userMgr) return []
    return this._userMgr.users
  }

  get remoteUsers() {
    if (!this._userMgr) return []
    return Object.keys(this._userMgr.remoteUsers).map((k) => this._userMgr.remoteUsers[k])
  }

  get roomAudio() {
    return this._roomAttrs.hasOwnProperty('audio') ? this._roomAttrs.audio : true
  }

  get enableAudioChange() {
    return this._roomAttrs.enableAudioChange
  }

  get pollInfo() {
    return this._roomAttrs.poll ? this._roomAttrs.poll : {}
  }

  get breakoutGroupsInfo() {
    return this._breakoutInfo
  }

  get chatClient() {
    return this._tools.chat
  }

  get shareClient() {
    return this._tools.share
  }

  get screenShareId() {
    if (!this._lvbEngine) return
    return this._lvbEngine.screenShareId
  }

  /**
   * @function init
   * @param props {Object}
   * @param props.authToken {String}
   * @param props.refreshToken {String}
   * @param props.meetingId {String}
   * @param props.userId {Number}
   * @param props.apiBaseURL {String}
   * @param props.initUserInfo {Object}
   * @public
   */
  init(props = {}) {
    if (this._init) return
    if (props.hasOwnProperty('authToken')) {
      setAuthToken(props.authToken)
    } else {
      throw Error('MeetingRoom:init - Miss auth token')
    }
    if (props.hasOwnProperty('refreshToken')) {
      setRefreshToken(props.refreshToken)
    } else {
      throw Error('MeetingRoom:init - Miss auth refresh token')
    }
    if (props.hasOwnProperty('meetingId')) {
      this._meetingId = props.meetingId
    } else {
      throw Error('MeetingRoom:init - Miss meeting id')
    }
    if (props.hasOwnProperty('userId')) {
      this._userId = props.userId
    } else {
      throw Error('MeetingRoom:init - Miss user id')
    }
    if (props.hasOwnProperty('apiBaseURL')) {
      setApiBaseURL(props.apiBaseURL)
    }
    props.hasOwnProperty('userInfo') && (this._userInitInfo = props.userInfo)
    props.hasOwnProperty('enforceAudioMute') &&
      (this._enforceAudioMute = props.enforceAudioMute)
    this._init = true
  }

  /**
   * @function join
   * @param password {String}
   * @return {Promise<void>}
   * @public
   */
  async join(password = null) {
    if (!this._init) throw Error('MeetingRoom:join - Please call init at first')
    const resp = await joinMeetingRequest(this._meetingId, password)
    this._appKey = resp.appKey
    this._share = {
      id: resp.shareUserId,
      token: resp.shareUserToken
    }
    this._lvbEngine = new LvbEngine()
    this._lvbEngine.init({
      token: resp.token,
      appKey: resp.appKey,
      roomId: this._meetingId,
      userId: this._userId,
      share: this._share
    })
    this._bindRTMEvents()
    await this._lvbEngine.join()
    // init user manager
    this._innerRoomId = this._lvbEngine.roomId
    this._innerUserId = this._lvbEngine.userId
    this._userMgr = new UserMgr(this._innerRoomId, this._innerUserId)

    // create RTM client
    this._rtm = await this._lvbEngine.createRTM()

    // create lvb tools
    this.createShareTool()
    this.createChatTool()
    this.createHandTool()
  }

  createShareTool() {
    if (!this._tools.share) {
      this._tools.share = new ShareTool()
      console.debug('createShareTool', this._innerRoomId, this._innerUserId)
      this._tools.share.init({
        roomId: this._innerRoomId,
        userId: this._innerUserId,
        rtm: this._rtm
      })
    }
    return this._tools.share
  }

  createChatTool() {
    if (!this._tools.chat) {
      this._tools.chat = new ChatTool()
      this._tools.chat.init({
        roomId: this._innerRoomId,
        rtm: this._rtm,
        eventTrigger: this
      })
    }
    return this._tools.chat
  }

  createHandTool() {
    if (!this._tools.hand) {
      this._tools.hand = new HandTool()
      this._tools.hand.init({
        roomId: this._innerRoomId,
        userId: this._innerUserId,
        rtm: this._rtm,
        eventTrigger: this
      })
    }
    return this._tools.hand
  }

  /**
   * @function createWhiteboardTool
   * @param domId {String}
   * @param color {String|null}
   * @return {Promise<string|*>}
   * @public
   */
  async createWhiteboardTool(domId, color = null) {
    if (!this._joined) throw Error('Please join room firstly.')
    if (!this._tools.whiteboard) {
      this._tools.whiteboard = new WhiteboardTool()
      await this._tools.whiteboard.init({
        domId,
        color,
        roomId: this._innerRoomId,
        userId: this._innerUserId,
        rtm: this._rtm,
        eventTrigger: this
      })
    }
    return this._tools.whiteboard
  }

  /**
   * @function _bindRTMEvents
   * @private
   */
  _bindRTMEvents() {
    if (!this._lvbEngine)
      throw Error(
        'MeetingRoom:_bindRTMEvents - Miss lvbEngine object, please call MeetingRoom.join at first'
      )
    this._lvbEngine.on(LvbEngine.RTMEvents.LOCAL_USER_JOIN_FAIL, (roomId) => {
      if (this._innerRoomId !== roomId) return
      this.trigger(MeetingCoreEvents.Room.LOCAL_USER_JOIN_FAIL, [roomId])
    })
    this._lvbEngine.on(LvbEngine.RTMEvents.LOCAL_USER_JOIN_SUCCESS, (roomId) => {
      if (this._innerRoomId !== roomId) return
      this._rtm.requestSyncRoomAttrs(roomId)
      this.trigger(MeetingCoreEvents.Room.LOCAL_USER_JOIN_SUCCESS, [roomId])
    })
    this._lvbEngine.on(LvbEngine.RTMEvents.SYNC_ROOM_ATTR, (roomId, attrs) => {
      if (this._innerRoomId !== roomId) return
      this._rtm.requestSyncUsersAttrs(roomId)
      this._parseRoomAttrs(roomId, attrs)
    })
    this._lvbEngine.on(
      LvbEngine.RTMEvents.SYNC_USER_ATTR,
      (roomId, attrsList, hasMore) => {
        if (this._innerRoomId !== roomId) return
        this._onSyncUserAttrs(roomId, attrsList, hasMore)
      }
    )
    this._lvbEngine.on(LvbEngine.RTMEvents.ROOM_START, (roomId, senderId) => {
      this.trigger(MeetingCoreEvents.Room.ROOM_START, [roomId, senderId])
    })
    this._lvbEngine.on(LvbEngine.RTMEvents.ROOM_STOP, (roomId, senderId) => {
      this.trigger(MeetingCoreEvents.Room.ROOM_STOP, [roomId, senderId])
    })
    this._lvbEngine.on(LvbEngine.RTMEvents.MEMBER_ONLINE, (roomId, userId) => {
      if (this._innerRoomId !== roomId) return
      this.trigger(MeetingCoreEvents.Room.MEMBER_ONLINE, [roomId, userId])
    })
    this._lvbEngine.on(LvbEngine.RTMEvents.MEMBER_OFFLINE, (roomId, userId) => {
      if (this._innerRoomId !== roomId) return
      this.trigger(MeetingCoreEvents.Room.MEMBER_OFFLINE, [roomId, userId])
    })
    this._lvbEngine.on(
      LvbEngine.RTMEvents.CONTROL_MESSAGE,
      (senderId, receiverId, content, msgType) => {
        if (
          msgType === LvbEngine.RTMCustomMessageType.Room &&
          this._innerRoomId !== receiverId
        )
          return
        content = JSON.parse(content)
        this._onControlSignal(content, senderId)
      }
    )
    this._lvbEngine.on(
      LvbEngine.RTMEvents.CUSTOM_MESSAGE,
      (category, senderId, receiverId, content, msgType) => {
        if (
          msgType === LvbEngine.RTMCustomMessageType.Room &&
          this._innerRoomId !== roomId
        )
          return
        const event =
          msgType === 'room'
            ? MeetingCoreEvents.Room.CUSTOM_ROOM_MESSAGE
            : MeetingCoreEvents.Room.CUSTOM_PEER_MESSAGE
        this.trigger(event, [category, senderId, receiverId, content])
      }
    )
    this._lvbEngine.on(
      LvbEngine.RTMEvents.ROOM_ATTR_UPDATE,
      (roomId, attrs, senderId) => {
        if (this._innerRoomId !== roomId) return
        this._onRoomAttrsUpdate(roomId, attrs, senderId)
      }
    )
    this._lvbEngine.on(
      LvbEngine.RTMEvents.USER_ATTR_UPDATE,
      (roomId, userId, attrs, senderId) => {
        if (this._innerRoomId !== roomId) return
        this._onUserAttrUpdate(roomId, userId, attrs, senderId)
      }
    )
    this._lvbEngine.on(
      LvbEngine.RTMEvents.USER_ATTR_INIT,
      (roomId, userId, attrs, senderId) => {
        if (this._innerRoomId !== roomId || this._innerUserId === userId) return
        this._userMgr.updateRemoteUser({ ...attrs, id: userId })
        this.trigger(MeetingCoreEvents.Room.USER_ATTR_INIT, [
          roomId,
          this._userMgr.remoteUsers[userId.toString()]
        ])
      }
    )
    this._lvbEngine.on(LvbEngine.RTMEvents.KICK_OUT, (roomId, senderId, userId) => {
      if (this._innerRoomId !== roomId) return
      this._onKickOut(roomId, senderId, userId)
    })
    this._lvbEngine.on(LvbEngine.RTMEvents.REMOTE_LOGIN, (system) => {
      this.trigger(MeetingCoreEvents.Room.REMOTE_LOGIN, [system])
    })
    this._lvbEngine.on(LvbEngine.RTMEvents.RECONNECT_MAX_TIME, () => {
      this.emitEvent(MeetingCoreEvents.Room.SERVER_CONNECT_FAIL)
    })
    this._lvbEngine.on(LvbEngine.RTMEvents.CONNECTED, () => {
      this.emitEvent(MeetingCoreEvents.Room.SERVER_CONNECTED)
    })
    this._lvbEngine.on(LvbEngine.RTMEvents.RECONNECTED, () => {
      this.emitEvent(MeetingCoreEvents.Room.SERVER_RECONNECTED)
    })
    this._lvbEngine.on(LvbEngine.RTMEvents.RECONNECTING, () => {
      this.emitEvent(MeetingCoreEvents.Room.SERVER_RECONNECTING)
    })
  }

  /**
   * @function _parseRoomAttrs
   * @param roomId {Number}
   * @param roomAttrs {Object}
   * @private
   */
  _parseRoomAttrs(roomId, roomAttrs) {
    this._roomAttrs = {}
    Object.keys(roomAttrs).map((key) => {
      this._roomAttrs[key] = roomAttrs[key]
    })
    this._joined &&
      this.trigger(MeetingCoreEvents.Room.SYNC_ROOM_ATTR_COMPLETE, [
        roomId,
        this._roomAttrs
      ])
  }
  _onSyncUserAttrs(roomId, users, hasMore) {
    console.log('=========_onSyncUserAttrs:', users)
    users.map((user) => this._userMgr.updateRemoteUser(user))
    if (!this._joined) {
      if (!hasMore) {
        this._mergeRoomState()
        this._mergeUsersState()
        this._initUserInfo()
          .then(() => {
            this.trigger(MeetingCoreEvents.Room.INIT_COMPLETE, [roomId])
          })
          .catch((e) => {
            console.error(e)
            this.trigger(MeetingCoreEvents.Room.INIT_FAIL, [roomId])
          })
        this._joined = true
      }
    } else {
      !hasMore && this.emitEvent(MeetingCoreEvents.Room.SYNC_USER_INFO_COMPLETE, [roomId])
    }
  }
  _mergeRoomState() {
    Object.keys(this._roomAttrsCache).map((key) => {
      this._roomAttrs[key] = this._roomAttrsCache[key]
    })
    this._roomAttrsCache = {}
  }
  _mergeUsersState() {
    Object.keys(this._userUpdateAttrsCache).map((uid) => {
      this._userMgr.updateUserStates(this._userUpdateAttrsCache[uid.toString()], uid)
    })
    this._userUpdateAttrsCache = {}
  }
  async _initUserInfo() {
    if (this._roomAttrs.hasOwnProperty('audio') && !this._roomAttrs.audio) {
      this._userInitInfo.audio = false
    }
    if (this._enforceAudioMute) {
      this._userInitInfo.audio = false
    }
    await this.getBreakoutGroupsDetail()
    if (this.breakoutGroupsInfo.length > 0) {
      const group = this.breakoutGroupsInfo.find(
        (g) => g.users.findIndex((uid) => uid === this._userId) !== -1
      )
      if (group) {
        this._userInitInfo.groupId = group.id
      }
    }
    this._userMgr.addUser(this._innerUserId, this._userInitInfo)
    return this._rtm.setUserInitAttrs(
      this._innerRoomId,
      this._innerUserId,
      this._userMgr.user.getProps()
    )
  }
  _onControlSignal(signal, memberId) {
    if (signal.kind === messageType.MESSAGE_CONTROL) {
      switch (signal.type) {
        case controlMessageType.CONTROL_CUSTOM_SIGNAL:
          this.trigger(MeetingCoreEvents.Room.CONTROL_CUSTOM_SIGNAL, [
            signal.subType,
            signal.data,
            memberId
          ])
          break
        case controlMessageType.CONTROL_AUDIO_CHANGE:
          this.trigger(MeetingCoreEvents.Room.CHANGE_AUDIO_REQUEST, [
            signal.roomId,
            signal.userId,
            signal.value
          ])
          break
        case controlMessageType.CONTROL_VIDEO_CHANGE:
          this.trigger(MeetingCoreEvents.Room.CHANGE_VIDEO_REQUEST, [
            signal.roomId,
            signal.userId,
            signal.value
          ])
          break
        case controlMessageType.CONTROL_NAME_CHANGE:
          this.trigger(MeetingCoreEvents.Room.CHANGE_NAME_REQUEST, [
            signal.roomId,
            signal.userId,
            signal.value
          ])
          break
        case controlMessageType.CONTROL_ROLE_CHANGE:
          this.trigger(MeetingCoreEvents.Room.CHANGE_ROLE_REQUEST, [
            signal.roomId,
            signal.userId,
            signal.value
          ])
          break
        case controlMessageType.CONTROL_BREAKOUT_GROUP:
          {
            let event,
              eventOpts = [signal.roomId]
            if (signal.state === 'start') {
              event = MeetingCoreEvents.Room.BREAKOUT_GROUPS_START
              eventOpts.push(signal.groups)
            } else {
              event = MeetingCoreEvents.Room.BREAKOUT_GROUPS_STOP
            }
            this.trigger(event, eventOpts)
          }
          break
        // case controlMessageType.CONTROL_MOVE_USER_TO_GROUP:
        //   this.trigger(MeetingCoreEvents.Room.MOVE_TO_GROUP_REQ, [
        //     signal.roomId,
        //     signal.userId,
        //     signal.groupId
        //   ])
        //   break
        case controlMessageType.CONTROL_CALL_HOST_TO_GROUP:
          this.trigger(MeetingCoreEvents.Room.BREAKOUT_CALL_HOST, [
            signal.senderId,
            signal.groupId
          ])
          break
        case controlMessageType.CONTROL_BROADCAST_MSG_TO_GROUPS:
          this.trigger(MeetingCoreEvents.Room.BREAKOUT_BROADCAST_MESSAGE, [
            signal.roomId,
            signal.senderId,
            signal.message,
            signal.groupId
          ])
          break
        case controlMessageType.CONTROL_MOVE_USER_TO_GROUP_REQ:
          this.trigger(MeetingCoreEvents.Room.BREAKOUT_MOVE_USER_TO_GROUP_REQ, [
            signal.toGroupId,
            signal.userIds
          ])
          break
        case controlMessageType.CONTROL_CHANGE_BREAKOUT_GROUPS_STATUS:
          let event = MeetingCoreEvents.Room.BREAKOUT_GROUPS_START
          if (!signal.status) {
            event = MeetingCoreEvents.Room.BREAKOUT_GROUPS_STOP
          }
          this.trigger(event, [this._innerRoomId])
          break
      }
    }
  }
  _onRoomAttrsUpdate(roomId, roomAttrs, senderId) {
    if (!this._joined) {
      Object.keys(roomAttrs).map((key) => {
        this._roomAttrsCache[key] = roomAttrs[key]
      })
    } else {
      Object.keys(roomAttrs).map((key) => {
        this._roomAttrs[key] = roomAttrs[key]
        switch (key) {
          case 'audio':
            {
              if (this._roomAttrs[key]) {
                this.trigger(MeetingCoreEvents.Room.AUDIO_UNMUTE_ALL, [roomId, senderId])
              } else {
                let enableChange = roomAttrs.hasOwnProperty('enableAudioChange')
                  ? roomAttrs.enableAudioChange
                  : false
                this._roomAttrs['enableAudioChange'] = enableChange
                this.trigger(MeetingCoreEvents.Room.AUDIO_MUTE_ALL, [
                  roomId,
                  enableChange,
                  senderId
                ])
              }
            }
            break
          case 'enableAudioChange':
            break
          default:
            this.trigger(MeetingCoreEvents.Room.ROOM_ATTR_UPDATE, [
              roomId,
              key,
              this._roomAttrs[key],
              senderId
            ])
            break
        }
      })
    }
  }
  _onUserAttrUpdate(roomId, uid, newAttrs, senderId) {
    if (!this._joined) {
      if (!this._userUpdateAttrsCache.hasOwnProperty(uid.toString())) {
        this._userUpdateAttrsCache[uid.toString()] = {}
      }
      Object.keys(newAttrs).map((key) => {
        this._userUpdateAttrsCache[uid.toString()][key] = newAttrs[key]
      })
    } else if (senderId !== this._innerUserId) {
      this._userMgr.updateUserStates(newAttrs, uid)
      Object.keys(newAttrs).map((key) => {
        let event = UserAttrToEvent[key]
        event && this.trigger(event, [roomId, uid, newAttrs[key]])
      })
    }
  }
  _onKickOut(roomId, senderId, uid) {
    if (uid === this.user.id) {
      const tempCall = async () => {
        if (this._shareType === ShareType.Whiteboard) {
          await this._tools.share.stopShareWhiteboard(uid)
        } else if (this._shareType === ShareType.Desktop) {
          await this._tools.share.stopShareDesktop(uid)
          this._rtc && this._rtc.destroyScreenShare()
        }
        this.trigger(MeetingCoreEvents.Room.USER_KICK_OUT, [roomId, senderId, uid])
      }
      tempCall().catch(console.error)
    } else {
      this.trigger(MeetingCoreEvents.Room.USER_KICK_OUT, [roomId, senderId, uid])
    }
  }
  /**
   * @function createRTCClient
   * @param opts
   * @public
   */
  createRTCClient(opts = {}) {
    if (!this._lvbEngine)
      throw Error(
        'MeetingRoom:createRTCClient - Miss lvbEngine object, please call MeetingRoom.join at first'
      )
    this._bindRTCEvents()
    this._rtc = new RTCClient(this._lvbEngine, { ...opts })
    this._rtc.init({
      video: this.user.videoState,
      audio: this.user.audioState
    })
    // create analytical tool for rtc data monitor
    this.createAnalyticalTool()
    return this._rtc
  }

  /**
   * @function _bindRTCEvents
   * @private
   */
  _bindRTCEvents() {
    if (!this._lvbEngine)
      throw Error(
        'MeetingRoom:_bindRTCEvents - Miss lvbEngine object, please call MeetingRoom.join at first'
      )
    this._lvbEngine.on(LvbEngine.RTCEvents.LOCAL_JOIN, (channel, userId) => {
      this.trigger(MeetingCoreEvents.Room.LOCAL_USER_RTC_JOIN, [channel, userId])
    })
    this._lvbEngine.on(LvbEngine.RTCEvents.LOCAL_LEAVE, (userId) => {
      this.trigger(MeetingCoreEvents.Room.LOCAL_USER_RTC_LEAVE, [userId])
    })
    this._lvbEngine.on(LvbEngine.RTCEvents.REMOTE_USER_JOIN, (userId) => {
      this.trigger(MeetingCoreEvents.Room.REMOTE_USER_RTC_JOIN, [userId])
    })
    this._lvbEngine.on(LvbEngine.RTCEvents.REMOTE_USER_LEAVE, (userId) => {
      this.trigger(MeetingCoreEvents.Room.REMOTE_USER_RTC_LEAVE, [userId])
    })
    this._lvbEngine.on(LvbEngine.RTCEvents.AUDIO_LEVEL_CHANGE, (userId, volume) => {
      this.trigger(MeetingCoreEvents.Room.USER_REALTIME_VOLUME, [userId, volume])
    })
    this._lvbEngine.on(
      LvbEngine.RTCEvents.AUDIO_DEVICE_STATE_CHANGE,
      (deviceId, deviceType, deviceState) => {
        this.trigger(MeetingCoreEvents.Room.LOCAL_AUDIO_DEVICE_CHANGE, [
          deviceId,
          deviceType,
          deviceState
        ])
      }
    )
    this._lvbEngine.on(
      LvbEngine.RTCEvents.VIDEO_DEVICE_STATE_CHANGE,
      (deviceId, deviceType, deviceState) => {
        this.trigger(MeetingCoreEvents.Room.LOCAL_VIDEO_DEVICE_CHANGE, [
          deviceId,
          deviceType,
          deviceState
        ])
      }
    )
    this._lvbEngine.on(
      LvbEngine.RTCEvents.LOCAL_NETWORK_QUALITY,
      (txQuality, rxQuality) => {
        this.trigger(MeetingCoreEvents.Room.LOCAL_NETWORK_QUALITY, [txQuality, rxQuality])
      }
    )
    this._lvbEngine.on(
      LvbEngine.RTCEvents.VIDEO_SIZE_CHANGE,
      (userId, width, height, rotation) => {
        this.trigger(MeetingCoreEvents.Room.USER_VIDEO_SIZE_CHANGE, [
          userId,
          width,
          height,
          rotation
        ])
      }
    )
    this._lvbEngine.on(LvbEngine.RTCEvents.CONNECTION_LOST, () => {
      this.emitEvent(MeetingCoreEvents.Room.LOCAL_RTC_CONNECTION_LOST)
    })
    this._lvbEngine.on(LvbEngine.RTCEvents.ERROR, (error) => {
      this.trigger(MeetingCoreEvents.Room.LOCAL_RTC_FAIL, [error])
    })
    this._lvbEngine.on(LvbEngine.RTCEvents.SCREEN_SHARE_JOIN, (shareId) => {
      this.trigger(MeetingCoreEvents.Room.SCREEN_SHARE_JOIN, [shareId])
    })
    this._lvbEngine.on(LvbEngine.RTCEvents.SCREEN_SHARE_LEAVE, (shareId) => {
      this.trigger(MeetingCoreEvents.Room.SCREEN_SHARE_LEAVE, [shareId])
    })
    this._lvbEngine.on(LvbEngine.RTCEvents.REMOTE_VIDEO_ON, (userId) => {
      this.trigger(MeetingCoreEvents.Room.REMOTE_USER_VIDEO_ON, [userId])
    })
    this._lvbEngine.on(LvbEngine.RTCEvents.REMOTE_VIDEO_OFF, (userId) => {
      this.trigger(MeetingCoreEvents.Room.REMOTE_USER_VIDEO_OFF, [userId])
    })
    this._lvbEngine.on(LvbEngine.RTCEvents.REMOTE_AUDIO_OFF, (userId) => {
      this.trigger(MeetingCoreEvents.Room.REMOTE_USER_AUDIO_ON, [userId])
    })
    this._lvbEngine.on(LvbEngine.RTCEvents.REMOTE_AUDIO_ON, (userId) => {
      this.trigger(MeetingCoreEvents.Room.REMOTE_USER_AUDIO_OFF, [userId])
    })
    this._lvbEngine.on(LvbEngine.RTCEvents.REMOTE_STREAM_SUBSCRIBED, (userId) => {
      this.trigger(MeetingCoreEvents.Room.REMOTE_USER_SUBSCRIBED, [userId])
    })
    this._lvbEngine.on(LvbEngine.RTCEvents.REMOTE_STREAM_UNSUBSCRIBED, (userId) => {
      this.trigger(MeetingCoreEvents.Room.REMOTE_USER_UNSUBSCRIBED, [userId])
    })
    this._lvbEngine.on(LvbEngine.RTCEvents.LOCAL_USER_VIDEO_UNPUBLISHED, (userId) => {
      this.trigger(MeetingCoreEvents.Room.LOCAL_USER_VIDEO_UNPUBLISHED, [userId])
    })
    this._lvbEngine.on(LvbEngine.RTCEvents.LOCAL_USER_VIDEO_PUBLISHED, (userId) => {
      this.trigger(MeetingCoreEvents.Room.LOCAL_USER_VIDEO_PUBLISHED, [userId])
    })
    this._lvbEngine.on(LvbEngine.RTCEvents.LOCAL_USER_AUDIO_UNPUBLISHED, (userId) => {
      this.trigger(MeetingCoreEvents.Room.LOCAL_USER_AUDIO_UNPUBLISHED, [userId])
    })
    this._lvbEngine.on(LvbEngine.RTCEvents.LOCAL_USER_AUDIO_PUBLISHED, (userId) => {
      this.trigger(MeetingCoreEvents.Room.LOCAL_USER_AUDIO_PUBLISHED, [userId])
    })
    this._lvbEngine.on(
      LvbEngine.RTCEvents.AUDIO_VOLUME_IND,
      (uid, volume, speakerNumber, totalVolume) => {}
    )
    this._lvbEngine.on(LvbEngine.RTCEvents.AUDIO_MIXING_STATE, (state) => {})
    this._lvbEngine.on(
      LvbEngine.RTCEvents.REMOTE_NETWORK_QUALITY,
      (userId, txQuality, rxQuality) => {}
    )
    this._lvbEngine.on(LvbEngine.RTCEvents.ACTIVE_USER, (userId) => {})
    this._lvbEngine.on(LvbEngine.RTCEvents.REMOTE_VIDEO_FIRST_FRAME, (userId) => {})
    this._lvbEngine.on(LvbEngine.RTCEvents.LOCAL_USER_BANNED, () => {})
    this._lvbEngine.on(LvbEngine.RTCEvents.LOCAL_USER_OFFLINE, (userId) => {})
    this._lvbEngine.on(LvbEngine.RTCEvents.LOCAL_USER_ONLINE, (userId) => {})
  }

  /**
   * @function createRTCTestClient
   * @param appId {String|null}
   * @return {*}
   * @public
   */
  createRTCTestClient(appId = null) {
    if (!this._lvbEngine)
      throw Error(
        'MeetingRoom:createRTCTestClient - Miss lvbEngine object, please call MeetingRoom.join at first'
      )
    const tester = this._lvbEngine.createRTCForTest(appId)
    // const rtc = new RTCClient(this._lvbEngine)
    // const tester = rtc.createTestClient(appId)
    this._bindRTCTestEvents(tester)
    return tester
  }

  /**
   * @function _bindRTCTestEvents
   * @param tester {Object}
   * @private
   */
  _bindRTCTestEvents(tester) {
    if (!this._lvbEngine)
      throw Error(
        'MeetingRoom:_bindRTCTestEvents - Miss lvbEngine object, please call MeetingRoom.join at first'
      )
    tester.on(LvbEngine.RTCTestEvents.NETWORK_QUALITY, (quality) => {})
    tester.on(LvbEngine.RTCTestEvents.NETWORK_RESULT, (result) => {})
    tester.on(
      LvbEngine.RTCTestEvents.VIDEO_DEVICE_CHANGE,
      (deviceId, deviceType, deviceState) => {}
    )
    tester.on(
      LvbEngine.RTCTestEvents.AUDIO_DEVICE_CHANGE,
      (deviceId, deviceType, deviceState) => {}
    )
    tester.on(LvbEngine.RTCTestEvents.AUDIO_LEVEL_CHANGE, (userId, volume) => {})
  }

  /**
   * @function leave
   * @public
   */
  leave() {
    if (!this._init) throw Error('MeetingRoom:leave - Please call init at first')
    if (this._rtc) {
      this._rtc.leave()
      this._rtc = null
    }
    if (this._rtm) {
      this._rtm.leave(this._innerRoomId)
      this._rtm.logout()
      this._rtm = null
    }
  }

  /**
   * @function getUsers
   * @return {User[]}
   * @public
   */
  getUsers() {
    if (!this._init) throw Error('MeetingRoom:getUsers - Please call init at first')
    return this._userMgr.users
  }

  /**
   * @function findUser
   * @param userId {Number}
   * @return {User}
   * @public
   */
  findUser(userId) {
    if (!this._init) throw Error('MeetingRoom:findUser - Please call init at first')
    return this._userMgr.findUser(userId)
  }

  /**
   * @function _setRoomUserAttrRequest
   * @param attrs {Object}
   * @param userId {Number}
   * @return {Promise<AxiosResponse<*>>}
   * @private
   */
  async _setRoomUserAttrRequest(attrs = {}, userId = null) {
    userId = userId ? userId : this._innerUserId
    return this._rtm.setUserAttrs(this._innerRoomId, userId, attrs)
  }

  /**
   * @function _setRoomAttrRequest
   * @param key {String}
   * @param val {any}
   * @return {Promise<AxiosResponse<*>>}
   * @private
   */
  async _setRoomAttrRequest(key, val) {
    return this._rtm.setRoomAttr(this._innerRoomId, key, val)
  }

  async _setRoomAttrsRequest(attrs = {}) {
    return this._rtm.setRoomAttrs(this._innerRoomId, attrs)
  }

  /**
   * @function _sendControlSignal
   * @param signal {any}
   * @param userId
   * @private
   */
  _sendControlSignal(signal, userId = null) {
    if (!this._joined && !this._rtm) return
    if (userId) {
      this._rtm.sendMessageToPeer(userId, LvbEngine.RTMDefaultCategory.Control, signal)
    } else {
      this._rtm.sendMessageToRoom(
        this._innerRoomId,
        LvbEngine.RTMDefaultCategory.Control,
        signal
      )
    }
  }

  /**
   * @function changeVideo
   * @param state {Boolean}
   * @param userId {Number}
   * @return {Promise<unknown>}
   * @public
   */
  changeVideo(state, userId = null) {
    return new Promise((resolve, reject) => {
      if (!this._rtc) return reject()
      if (!userId || userId === this.user.id) {
        const oldState = this.user.videoState
        if (oldState === state) return resolve()

        this.user.videoState = state
        if (this._rtc.setVideo(this.user.videoState) === 0) {
          this._setRoomUserAttrRequest({ video: this.user.videoState })
            .then(() => {
              this.trigger(MeetingCoreEvents.Room.VIDEO_CHANGE, [
                this._innerRoomId,
                this._innerUserId,
                state
              ])
              resolve()
            })
            .catch(reject)
        } else {
          this.user.videoLocalState = oldState
          reject()
        }
      } else {
        const user = this.findUser(userId)
        if (user) {
          if (user.videoState === state) return resolve()
          const msg = VideoChange(this._innerRoomId, userId, state)
          this._sendControlSignal(msg)
          resolve()
        } else {
          reject()
        }
      }
    })
  }

  /**
   * @function switchVideo
   * @param userId {Number}
   * @return {Promise<unknown>}
   * @public
   */
  switchVideo(userId) {
    return new Promise((resolve, reject) => {
      if (!this._rtc) return reject('switchVideo - Miss rtc object')

      if (!userId || userId === this.user.id) {
        const oldState = this.user.videoState
        this.user.videoState = !oldState
        if (this._rtc.setVideo(this.user.videoState) === 0) {
          this._setRoomUserAttrRequest({ video: this.user.videoState })
            .then(() => {
              this.trigger(MeetingCoreEvents.Room.VIDEO_CHANGE, [
                this._innerRoomId,
                this._innerUserId,
                this.user.videoState
              ])
              resolve()
            })
            .catch(reject)
        } else {
          this.user.videoState = oldState
          reject('switchVideo - rtc setVideo failed')
        }
      } else {
        const user = this.findUser(userId)
        if (user) {
          const msg = VideoChange(this._innerRoomId, userId, !user.videoState)
          this._sendControlSignal(msg)
          resolve()
        } else {
          reject('switchVideo - invalid user')
        }
      }
    })
  }

  /**
   * @function changeAudio
   * @param state {Boolean}
   * @param userId {Number}
   * @return {Promise<unknown>}
   * @public
   */
  changeAudio(state, userId) {
    return new Promise((resolve, reject) => {
      if (!this._rtc) return reject()

      userId = userId ? userId : this.user.id
      if (userId === this.user.id) {
        const oldState = this.user.audioState
        if (oldState === state) return resolve()

        this.user.audioState = state
        if (this._rtc.setAudio(this.user.audioState) === 0) {
          this._setRoomUserAttrRequest({ audio: this.user.audioState })
            .then(() => {
              this.trigger(MeetingCoreEvents.Room.AUDIO_CHANGE, [
                this._innerRoomId,
                this._innerUserId,
                state
              ])
              resolve()
            })
            .catch(reject)
        } else {
          this.user.audioState = oldState
          reject()
        }
      } else {
        const user = this.findUser(userId)
        if (user) {
          const oldState = user.audioState
          if (oldState === state) return resolve()

          const msg = AudioChange(this._innerRoomId, userId, state)
          this._sendControlSignal(msg)
          resolve()
        } else {
          reject()
        }
      }
    })
  }

  /**
   * @function switchAudio
   * @param userId {Number}
   * @return {Promise<unknown>}
   * @public
   */
  switchAudio(userId) {
    return new Promise((resolve, reject) => {
      if (!this._rtc) return reject()
      if (!userId || userId === this.user.id) {
        const state = this.user.audioState
        this.user.audioState = !state
        if (this._rtc.setAudio(this.user.audioState) === 0) {
          this._setRoomUserAttrRequest({ audio: this.user.audioState })
            .then(() => {
              this.trigger(MeetingCoreEvents.Room.AUDIO_CHANGE, [
                this._innerRoomId,
                this._innerUserId,
                this.user.audioState
              ])
              resolve()
            })
            .catch(reject)
        } else {
          this.user.audioState = state
          reject()
        }
      } else {
        const user = this.findUser(userId)
        if (user) {
          const msg = AudioChange(this._innerRoomId, userId, !user.audioState)
          this._sendControlSignal(msg)
          resolve()
        } else {
          reject()
        }
      }
    })
  }

  /**
   * @function muteRoomAudio
   * @param enableAudioChange {Boolean}
   * @return {Promise<unknown>}
   * @public
   */
  muteRoomAudio(enableAudioChange) {
    return this._setRoomAttrsRequest({
      audio: false,
      enableAudioChange
    })
  }

  /**
   * @function unmuteRoomAudio
   * @return {Promise<unknown>}
   */
  unmuteRoomAudio() {
    return this._setRoomAttrsRequest({
      audio: true,
      enableAudioChange: true
    })
  }

  /**
   * @function switchRoomAudio
   * @param enableAudioChange {Boolean}
   * @return {Promise<*>}
   * @public
   */
  switchRoomAudio(enableAudioChange = true) {
    const audio = this._roomAttrs.hasOwnProperty('audio') ? this._roomAttrs.audio : true
    if (audio) {
      return this.muteRoomAudio(enableAudioChange)
    } else {
      return this.unmuteRoomAudio()
    }
  }

  /**
   * @function kickOut
   * @param userId {Number}
   * @return {Promise<void>}
   * @public
   */
  async kickOut(userId) {
    if (!this._rtm) return
    await this._rtm.kickOut(this._innerRoomId, userId)
  }

  /**
   *
   * @param role {String}
   * @param userId {Number}
   * @return {Promise<unknown>}
   * @public
   */
  changeUserRole(role, userId = null) {
    return new Promise((resolve, reject) => {
      if (!this._init) return reject()
      if (!userId || userId === this.user.id) {
        this._setRoomUserAttrRequest({ role }, this.user.id)
          .then(() => {
            this._userMgr.updateUserRole(role, this.user.id)
            this.trigger(MeetingCoreEvents.Room.ROLE_CHANGE, [
              this._innerRoomId,
              this.user.id,
              role
            ])
            resolve()
          })
          .catch(reject)
      } else {
        const user = this.findUser(userId)
        if (user) {
          const msg = RoleChange(this._innerRoomId, userId, role)
          this._sendControlSignal(msg)
          resolve()
        } else {
          reject('setUserRole: invalid user')
        }
      }
    })
  }

  /**
   * @param name {String}
   * @param userId {Number}
   * @return {Promise<unknown>}
   * @public
   */
  changeUserName(name, userId = null) {
    return new Promise((resolve, reject) => {
      if (!this._init) return reject()
      if (!userId || userId === this.user.id) {
        this._setRoomUserAttrRequest({ name }, this.user.id)
          .then((_) => {
            this._userMgr.updateUserName(name, this.user.id)
            this.trigger(MeetingCoreEvents.Room.NAME_CHANGE, [
              this._innerRoomId,
              this.user.id,
              name
            ])
            resolve()
          })
          .catch(reject)
      } else {
        const user = this.findUser(userId)
        if (user) {
          const msg = NameChange(this._innerRoomId, userId, name)
          this._sendControlSignal(msg)
          resolve()
        } else {
          reject('setUserName: invalid user')
        }
      }
    })
  }

  /**
   * @param groupId {String}
   * @param userId {Number}
   * @return {Promise<unknown>}
   * @public
   */
  changeGroup(groupId, userId = null) {
    return new Promise((resolve, reject) => {
      if (!this._init) return reject()
      if (!userId || userId === this.user.id) {
        this._setRoomUserAttrRequest({ groupId }, this.user.id)
          .then((_) => {
            this._userMgr.updateUserGroupId(groupId, this.user.id)
            this.trigger(MeetingCoreEvents.Room.GROUP_ID_CHANGE, [
              this._innerRoomId,
              this.user.id,
              groupId
            ])
            resolve()
          })
          .catch(reject)
      } else {
        const user = this.findUser(userId)
        if (user) {
          const msg = GroupIdChange(this._innerRoomId, userId, groupId)
          this._sendControlSignal(msg)
          resolve()
        } else {
          reject('changeGroup: invalid group id')
        }
      }
    })
  }

  /**
   * @function createRTCTester
   * @return {*}
   */
  createRTCTester() {
    const lvb = new LvbEngine()
    return lvb.createRTCForTest()
  }

  /**
   * @function getScreenWindowsInfo
   * @return {[]}
   */
  getScreenWindowsInfo() {
    if (!this._rtc) return []
    return this._rtc.getScreenWindowsInfo()
  }

  /**
   * @function getScreenDisplaysInfo
   * @return {[]}
   */
  getScreenDisplaysInfo() {
    if (!this._rtc) return []
    return this._rtc.getScreenDisplaysInfo()
  }

  startShareWhiteboard() {
    return new Promise((resolve, reject) => {
      if (!this._tools.share) return reject('startShareWhiteboard: Miss share object')
      this._tools.share
        .startShareWhiteboard()
        .then(() => {
          this.trigger(MeetingCoreEvents.Room.SHARE_CHANGE, [
            this._innerRoomId,
            this.user.id,
            ShareType.Whiteboard
          ])
          resolve()
        })
        .catch(reject)
    })
  }

  startShareDesktop() {
    return new Promise((resolve, reject) => {
      if (!this._tools.share || !this._rtc) return reject()
      this._tools.share
        .startShareDesktop()
        .then(() => {
          this._rtc.createScreenShare()
          this.trigger(MeetingCoreEvents.Room.SHARE_CHANGE, [
            this._innerRoomId,
            this.user.id,
            ShareType.Desktop
          ])
          resolve()
        })
        .catch(reject)
    })
  }

  startShareApplication() {
    return new Promise((resolve, reject) => {
      if (!this._tools.share || !this._rtc) return reject()
      this._tools.share
        .startShareApplication()
        .then(() => {
          this._rtc.createScreenShare()
          this.trigger(MeetingCoreEvents.Room.SHARE_CHANGE, [
            this._innerRoomId,
            this.user.id,
            ShareType.App
          ])
          resolve()
        })
        .catch(reject)
    })
  }

  stopShare() {
    return new Promise((resolve, reject) => {
      if (!this._tools.share) return reject()
      this._tools.share
        .stopShare(this._innerUserId)
        .then(() => {
          this._rtc.destroyScreenShare()
          this.trigger(MeetingCoreEvents.Room.SHARE_CHANGE, [
            this._innerRoomId,
            this.user.id,
            ShareType.None
          ])
          resolve()
        })
        .catch(reject)
    })
  }

  createAnalyticalTool() {
    if (!this._init) return
    if (this._tools.analytical) {
      this._tools.analytical.stop()
      this._tools.analytical = null
    }

    let parser = new AnalyticalParser()
    parser.init({
      rtm: this._rtm,
      rtc: this._rtc.rtc,
      userInfo: {
        id: this._userMgr.user.id,
        name: this._userMgr.user.name,
        role: this._userMgr.user.role
      },
      roomInfo: {
        roomId: this._innerRoomId,
        appKey: this._appKey
      }
    })
    this._tools.analytical = parser
    return this._tools.analytical
  }

  /**
   *
   * @param info {Object}
   * @param info.device {String}
   * @param info.os {String}
   * @param info.osVersion {String}
   * @param info.cpu {String}
   * @param info.language {String}
   */
  setSystemInfo(info) {
    if (!this._tools.analytical) return
    this._tools.analytical.setSystemInfo(info)
  }

  stopMeeting() {
    return new Promise((resolve, reject) => {
      stopMeetingRequest(this._meetingId)
        .then(() => {
          return this._rtm.stopRoom(this._innerRoomId)
        })
        .then(resolve)
        .catch(reject)
    })
  }

  createPoll(title, questions, isAnonymous = false) {
    return createNewPollRequest(this._meetingId, questions, title, isAnonymous)
  }

  deletePoll(pollId) {
    return deletePollRequest(pollId)
  }

  updatePoll(pollId, title, questions, isAnonymous = false) {
    return updatePollRequest(pollId, title, questions, isAnonymous)
  }

  startPoll(pollId) {
    return new Promise((resolve, reject) => {
      startPollRequest(pollId).then(resolve).catch(reject)
    })
  }

  stopPoll(pollid) {
    return stopPollRequest(pollid)
  }

  commitPollAnswer(pollId, questions) {
    return new Promise((resolve, reject) => {
      if (!this._rtm)
        return reject('MeetingCoreRoomEngine:commitPollAnswer - miss rtm object')
      commitPollRequest(pollId, questions)
        .then(() => {
          let voters =
            this.pollInfo && this.pollInfo.hasOwnProperty('voters')
              ? this.pollInfo.voters
              : []
          const voter = {
            id: this.userId,
            extId: this.user.extId,
            name: this.user.name,
            avatar: this.user.avatar
          }
          const idx = voters.findIndex((v) => (v.senderId = this.userId))
          if (idx === -1) {
            voters.push(voter)
          } else {
            voters.splice(idx, 1, voter)
          }
          return this._setRoomAttrRequest('poll', { voters })
        })
        .then(() => {
          resolve()
        })
        .catch(reject)
    })
  }

  getMyPollAnswer(pollId) {
    return getPollAnswerRequest(pollId)
  }

  getPollResult(pollId) {
    return getPollResultRequest(pollId)
  }

  getPollDetail(pollId) {
    return getPollDetailRequest(pollId)
  }

  getPolls() {
    return getPollListRequest(this._meetingId)
  }

  startSharePoll(pollId) {
    return sharePollRequest(pollId, true)
  }

  stopSharePoll(pollId) {
    return sharePollRequest(pollId, false)
  }

  sendCustomEvent(type, opts = {}, uid = null) {
    const signal = CustomEvent(type, opts)
    this._sendControlSignal(signal, uid)
  }

  startBreakoutGroups(groups) {
    return new Promise((resolve, reject) => {
      if (!this._rtm) return reject()
      startBreakoutGroupsRequest(this._meetingId, groups)
        .then(() => {
          const msg = ChangeBreakoutGroupsStatus(true)
          this._sendControlSignal(msg)
          this.trigger(MeetingCoreEvents.Room.BREAKOUT_GROUPS_START, [this._innerUserId])
          resolve()
        })
        .catch(reject)
    })
  }

  stopBreakoutGroups() {
    return new Promise((resolve, reject) => {
      if (!this._rtm) return reject()
      stopBreakoutGroupsRequest(this._meetingId)
        .then(() => {
          const msg = ChangeBreakoutGroupsStatus(false)
          this._sendControlSignal(msg)
          this.trigger(MeetingCoreEvents.Room.BREAKOUT_GROUPS_STOP, [this._innerUserId])
          resolve()
        })
        .catch(reject)
    })
  }

  moveUserToOtherBreakoutGroup(toGroupId, uid = null) {
    return new Promise((resolve, reject) => {
      if (!this._rtm) return reject()
      if (!uid || uid === this._innerUserId) {
        const fromGroupId = this.user.groupId
        if (fromGroupId === toGroupId) return resolve()
        moveUserToBreakoutGroupRequest(this._meetingId, fromGroupId, toGroupId, [
          this._userId
        ])
          .then(() => {
            return this._setRoomUserAttrRequest({ groupId: toGroupId })
          })
          .then(() => {
            this._userMgr.updateUserGroupId(toGroupId, this.user.id)
            this.trigger(MeetingCoreEvents.Room.GROUP_ID_CHANGE, [
              this._innerRoomId,
              this.user.id,
              toGroupId
            ])
            resolve()
          })
          .catch(reject)
      } else {
        const signal = MoveUsersToBreakoutGroup(toGroupId, [uid])
        this._sendControlSignal(signal)
        resolve()
      }
    })
  }

  requestMoveUsersToBreakoutGroup(toGroupId, userIds = []) {
    if (!Array.isArray(userIds) || userIds.length === 0) return
    const req = MoveUsersToBreakoutGroup(toGroupId, userIds)
    return this._sendControlSignal(req)
  }

  broadcastMessageToAllBreakoutGroups(message, groupId = null) {
    const msg = BroadcastMessageToGroups(this._innerUserId, message, groupId)
    this._sendControlSignal(msg)
    this.trigger(MeetingCoreEvents.Room.BREAKOUT_BROADCAST_MESSAGE, [
      this._innerRoomId,
      this._innerUserId,
      message,
      groupId
    ])
  }

  callHostToBreakoutGroup(groupId) {
    const msg = BreakoutCallHostToGroup(this._innerUserId, groupId)
    this._sendControlSignal(msg)
    this.trigger(MeetingCoreEvents.Room.BREAKOUT_CALL_HOST, [this._innerUserId, groupId])
  }

  getBreakoutGroupsDetail() {
    return new Promise((resolve, reject) => {
      getBreakoutGroupsDetailRequest(this._meetingId)
        .then((resp) => {
          this._breakoutInfo = resp.group ? resp.group : []
          resolve(this._breakoutInfo)
        })
        .catch(reject)
    })
  }
}
