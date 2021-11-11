import MeetingClient from './meetingClient'
import MeetingRoom from './meetingRoom'
import { MeetingCoreEvents } from './common'

export default class MeetingCore {}

/**
 * @function createMeeting
 * @return {MeetingClient}
 */
MeetingCore.createMeeting = function () {
  return new MeetingClient()
}

/**
 * @function createMeetingRoom
 * @return {MeetingRoom}
 */
MeetingCore.createMeetingRoom = function () {
  return new MeetingRoom()
}

/**
 * @type {{Client: {}, Room: {CONTROL_CUSTOM_SIGNAL: string, AUDIO_MUTE_ALL: string, LOCAL_VIDEO_DEVICE_CHANGE: string, AUDIO_UNMUTE_ALL: string, CUSTOM_ROOM_MESSAGE: string, NAME_CHANGE: string, INIT_COMPLETE: string, INIT_FAIL: string, MOVE_TO_GROUP_REQ: string, REMOTE_USER_AUDIO_ON: string, CHAT_ROOM_MESSAGE: string, LOCAL_USER_JOIN_FAIL: string, AVATAR_CHANGE: string, CHAT_SYSTEM_PEER_MESSAGE: string, CHANGE_AUDIO_REQUEST: string, REMOTE_USER_AUDIO_OFF: string, CHAT_PEER_MESSAGE: string, USER_REALTIME_VOLUME: string, SYNC_ROOM_ATTR_COMPLETE: string, CHAT_MESSAGE: string, REMOTE_USER_VIDEO_ON: string, USER_ATTR_INIT: string, MEMBER_OFFLINE: string, BREAKOUT_GROUPS_STOP: string, REMOTE_LOGIN: string, LOCAL_USER_RTC_LEAVE: string, LOCAL_RTC_FAIL: string, SHARE_CHANGE: string, GROUPS_CONFIG_CHANGE: string, VIDEO_CHANGE: string, REMOTE_USER_UNSUBSCRIBED: string, LOCAL_USER_AUDIO_PUBLISHED: string, CUSTOM_PEER_MESSAGE: string, AUDIO_CHANGE: string, CHAT_SYSTEM_ROOM_MESSAGE: string, SCREEN_SHARE_LEAVE: string, USER_KICK_OUT: string, CHANGE_VIDEO_REQUEST: string, USER_CHAT_MESSAGE: string, LOCAL_USER_AUDIO_UNPUBLISHED: string, LOCAL_RTC_CONNECTION_LOST: string, REMOTE_USER_RTC_JOIN: string, USER_VIDEO_SIZE_CHANGE: string, LOCAL_USER_JOIN_SUCCESS: string, SERVER_CONNECT_FAIL: string, LOCAL_USER_VIDEO_UNPUBLISHED: string, MEMBER_ONLINE: string, ROOM_STOP: string, ROLE_CHANGE: string, BREAKOUT_GROUPS_START: string, REMOTE_USER_RTC_LEAVE: string, LOCAL_USER_VIDEO_PUBLISHED: string, LOCAL_NETWORK_QUALITY: string, CHAT_CHANGE: string, SYSTEM_MESSAGE: string, ROOM_START: string, SCREEN_SHARE_JOIN: string, PEER_SYSTEM_MESSAGE: string, REMOTE_USER_VIDEO_OFF: string, LOCAL_AUDIO_DEVICE_CHANGE: string, SYNC_USER_INFO_COMPLETE: string, LOCAL_USER_RTC_JOIN: string, HAND_CHANGE: string, REMOTE_USER_SUBSCRIBED: string}}}
 */
MeetingCore.MeetingCoreEvents = MeetingCoreEvents
