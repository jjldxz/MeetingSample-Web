import Vue from 'vue'
import moment from 'moment-timezone'
import { GridTypes, MeetingRole, TIME_ZONE } from '../../common'

const state = {
  isHost: false,
  isCoHost: false,
  chatMsgList: [],
  videoOnUserList: [],
  bubbleMessageList: [],
  userList: [],
  bubbleMessageCount: 0,
  meetingInfo: {},
  meetingId: null,
  audioMute: false,
  videoMute: false,
  breakoutGroupStatus: false,
  shareType: null,
  loginUserInfo: {},
  gridType: GridTypes.TYPE_1,
  gridTypeAutoChange: true,
  lockView: false,
  isLandscape: {},
  pollVoted: false,
  reactionBackList: [],
  sideBarType: null,
  currentBreakoutGroup: {},
  joinedMembers: [],
  pollVoters: [],
  meetingAudioMute: false
}

const mutations = {
  addUser(state, user) {
    const idx = state.userList.findIndex((u) => u.id === user.id)
    if (idx === -1) {
      state.userList.push(user)
    } else {
      state.userList.splice(idx, 1, user)
    }
    const id = state.joinedMembers.findIndex((u) => u.id === user.id)
    if (id === -1) {
      state.joinedMembers.push(user)
    } else {
      state.joinedMembers.splice(id, 1, user)
    }
  },
  removeUser(state, idx) {
    if (state.userList[idx]) {
      state.userList.splice(idx, 1)
    }
  },
  removeUserById(state, id) {
    const idx = state.userList.findIndex((u) => u.id === id)
    if (idx !== -1) {
      state.userList.splice(idx, 1)
    }
  },
  removeUserByIds(state, uids) {
    for (const uid of uids) {
      const idx = state.userList.findIndex(
        (user) => user.id.toString() === uid.toString()
      )
      if (idx !== -1) {
        state.userList.splice(idx, 1)
      }
    }
  },
  removeUsers(state) {
    state.userList = []
  },
  updateUserGroupId(state, opts = {}) {
    const idx = state.userList.findIndex((u) => u.id === opts.uid)
    if (idx !== -1) {
      let user = state.userList[idx]
      user.groupId = opts.groupId
      state.userList.splice(idx, 1, user)
    }

    if (window.meetingRoomCore.user.id !== opts.uid) {
      const idx = state.videoOnUserList.findIndex((id) => id === opts.uid)
      if (window.meetingRoomCore.user.groupId !== opts.groupId) {
        if (idx !== -1) {
          state.videoOnUserList.splice(idx, 1)
        }
      } else {
        if (idx === -1) {
          state.videoOnUserList.push(opts.uid)
        }
      }
    } else {
      let videoOnList = window.meetingRoomCore.users
        .filter((u) => u.groupId === opts.groupId && u.videoState)
        .map((u) => u.id)
      state.videoOnUserList = videoOnList
    }
  },
  updateUserProps(state, opts = {}) {
    const idx = state.userList.findIndex((u) => u.id === opts.uid)
    if (idx !== -1) {
      let user = state.userList[idx]
      opts.hasOwnProperty('role') && (user.role = opts.role)
      opts.hasOwnProperty('name') && (user.name = opts.name)
      opts.hasOwnProperty('avatar') && (user.avatar = opts.avatar)
      opts.hasOwnProperty('groupId') && (user.groupId = opts.groupId)

      opts.hasOwnProperty('audio') && (user.state.audio = opts.audio)
      opts.hasOwnProperty('video') && (user.state.video = opts.video)
      opts.hasOwnProperty('hand') && (user.state.hand = opts.hand)
      opts.hasOwnProperty('share') && (user.state.share = opts.share)
      state.userList.splice(idx, 1, user)
    }
  },
  setChatMessageList(state, msgs) {
    state.chatMsgList = msgs
  },
  clearChatMessageList(state) {
    state.chatMsgList = []
    state.lastChatTime = null
  },
  addChatMessage(state, msg) {
    let current = moment().tz(TIME_ZONE)
    if (
      !state.lastChatTime ||
      current - state.lastChatTime >
        Number(process.env.VUE_APP_CHAT_MESSAGE_TIME_INTERVAL) * 60000
    ) {
      state.lastChatTime = current
      const dispTime = current.format('MM-DD HH:mm')
      state.chatMsgList.push({
        role: 'time',
        content: dispTime
      })
    }
    state.chatMsgList.push(msg)
  },
  setHost(state, flag) {
    if (typeof flag !== 'boolean') return
    state.isHost = flag
  },
  setCoHost(state, flag) {
    if (typeof flag !== 'boolean') return
    state.isCoHost = flag
  },
  updateBubbleMessageList(state, msg) {
    if (state.bubbleMessageList.length >= 5) {
      state.bubbleMessageList.splice(0, 1)
    }
    state.bubbleMessageCount++
    state.bubbleMessageList.push({ ...msg, id: state.bubbleMessageCount })
    const tempId = state.bubbleMessageCount
    setTimeout(() => {
      const idx = state.bubbleMessageList.findIndex((b) => b.id === tempId)
      if (idx !== -1) {
        state.bubbleMessageList.splice(idx, 1)
      }
    }, 4000)
  },
  setMeetingInfo(state, info) {
    state.meetingInfo = info
  },
  setAudioMute(state, muted) {
    state.audioMute = muted
  },
  setVideoMute(state, muted) {
    state.videoMute = muted
  },
  setBreakOutGroupStatus(state, flag) {
    state.breakoutGroupStatus = flag
  },
  setShareType(state, type) {
    state.shareType = type
  },
  setLoginUserInfo(state, info) {
    state.loginUserInfo = info
  },
  setGridType(state, type) {
    state.gridType = type
  },
  setGridTypeAutoChange(state, flag) {
    state.gridTypeAutoChange = flag
  },
  addVideoOnUser(state, uid) {
    const idx = state.videoOnUserList.findIndex((id) => id === uid)
    if (idx === -1) {
      state.videoOnUserList.push(uid)
    }
  },
  deleteVideoOnUser(state, uid) {
    const idx = state.videoOnUserList.findIndex((id) => id === uid)
    if (idx !== -1) {
      state.videoOnUserList.splice(idx, 1)
    }
  },
  switchLockView(state) {
    state.lockView = !state.lockView
  },
  changeLockView(state, lock) {
    state.lockView = lock
  },
  resetLockView(state) {
    state.lockView = false
  },
  setLandscape(state, info) {
    Vue.set(state.isLandscape, info.uid.toString(), info.landscape)
  },
  setPollVoted(state, flag) {
    state.pollVoted = flag
  },
  setMeetingId(state, id) {
    state.meetingId = id
  },
  addReaction(state, reaction) {
    state.reactionBackList.push(reaction)
  },
  delReaction(state, senderId) {
    const ids = state.reactionBackList.findIndex((b) => b.senderId === senderId)
    if (ids !== -1) {
      state.reactionBackList.splice(ids, 1)
    }
  },
  updateReaction(state, reaction) {
    const ids = state.reactionBackList.findIndex((b) => b.senderId === reaction.senderId)
    if (ids !== -1) {
      state.reactionBackList.splice(ids, 1)
    }
    state.reactionBackList.push(reaction)
  },
  setSideBarType(state, type) {
    state.sideBarType = type
  },
  setCurrentBreakoutGroup(state, group) {
    state.currentBreakoutGroup = group
  },
  addPollVoter(state, voter) {
    const idx = state.pollVoters.findIndex((v) => v.id === voter.id)
    if (idx > -1) {
      state.pollVoters.splice(idx, 1, voter)
    } else {
      state.pollVoters.push(voter)
    }
  },
  setPollVoters(state, voters) {
    state.pollVoters = JSON.parse(JSON.stringify(voters))
  },
  setMetingAudioMute(state, muted) {
    state.meetingAudioMute = muted
  }
}

const getters = {
  attendees: (state) => {
    return state.userList.filter(
      (u) =>
        u.role !== MeetingRole.Share &&
        u.role !== MeetingRole.Record &&
        u.groupId === window.meetingRoomCore.user.groupId
    )
  },
  attendeesCount: (state, getters) => {
    return getters.attendees.length
  },
  videoList: (state) => {
    return state.userList.filter(
      (u) =>
        u.role !== MeetingRole.Record && u.groupId === window.meetingRoomCore.user.groupId
    )
  }
}

const actions = {}

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}
