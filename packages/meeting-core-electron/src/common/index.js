export const ShareType = {
  None: 'none',
  Desktop: 'desktop',
  App: 'application',
  Whiteboard: 'whiteboard'
}

export const MeetingCoreEvents = {
  Client: {},
  Room: {
    // Common
    LOCAL_USER_JOIN_SUCCESS: 'meeting-room-local-user-join-success',
    LOCAL_USER_JOIN_FAIL: 'meeting-room-local-user-join-fail',
    USER_ATTR_INIT: 'meeting-room-user-attrs-init',
    INIT_COMPLETE: 'meeting-room-init-success',
    INIT_FAIL: 'meeting-room-init-fail',
    SYNC_ROOM_ATTR_COMPLETE: 'meeting-room-sync-room-attr-complete',
    SYNC_USER_INFO_COMPLETE: 'meeting-room-sync-user-info-complete',
    MEMBER_ONLINE: 'meeting-room-member-onLine',
    MEMBER_OFFLINE: 'meeting-room-member-offline',
    CONTROL_CUSTOM_SIGNAL: 'meeting-room-custom-control-signal',
    // MOVE_TO_GROUP_REQ: 'meeting-room-move-user-to-group-request',
    CUSTOM_ROOM_MESSAGE: 'meeting-room-custom-message',
    CUSTOM_PEER_MESSAGE: 'meeting-room-custom-peer-message',
    AUDIO_UNMUTE_ALL: 'meeting-room-audio-unmute-all',
    AUDIO_MUTE_ALL: 'meeting-room-audio-mute-all',
    GROUPS_CONFIG_CHANGE: 'meeting-room-groups-config-change',
    CHANGE_AUDIO_REQUEST: 'meeting-room-change-audio-request',
    CHANGE_VIDEO_REQUEST: 'meeting-room-change-video-request',
    CHANGE_NAME_REQUEST: 'meeting-room-change-name-request',
    CHANGE_ROLE_REQUEST: 'meeting-room-change-role-request',
    AUDIO_CHANGE: 'meeting-room-audio-change',
    VIDEO_CHANGE: 'meeting-room-video-change',
    HAND_CHANGE: 'meeting-room-hand-change',
    CHAT_CHANGE: 'meeting-room-chat-change',
    ROLE_CHANGE: 'meeting-room-role-change',
    NAME_CHANGE: 'meeting-room-name-change',
    AVATAR_CHANGE: 'meeting-room-avatar-change',
    SHARE_CHANGE: 'meeting-room-share-change',
    GROUP_ID_CHANGE: 'meeting-room-group-id-change',
    USER_KICK_OUT: 'meeting-room-user-kick-out',
    CHAT_MESSAGE: 'meeting-room-chat-message',
    USER_CHAT_MESSAGE: 'meeting-room-user-chat-message',
    SYSTEM_MESSAGE: 'meeting-room-system-message',
    PEER_SYSTEM_MESSAGE: 'meeting-room-peer-system-message',
    ROOM_START: 'meeting-room-start',
    ROOM_STOP: 'meeting-room-stop',
    REMOTE_LOGIN: 'meeting-room-remote-login',
    SERVER_CONNECT_FAIL: 'meeting-room-server-connect-fail',
    SERVER_CONNECTED: 'meeting-room-server-connected',
    SERVER_RECONNECTED: 'meeting-room-server-reconnected',
    SERVER_RECONNECTING: 'meeting-room-server-reconnecting',
    POLL_INFO_CHANGE: 'meeting-room-poll-info-change',

    // Groups
    BREAKOUT_GROUPS_START: 'meeting-room-breakout-groups-start',
    BREAKOUT_GROUPS_STOP: 'meeting-room-breakout-groups-stop',
    BREAKOUT_BROADCAST_MESSAGE: 'meeting-room-breakout-broadcast-message',
    BREAKOUT_CALL_HOST: 'meeting-room-breakout-call-host',
    BREAKOUT_MOVE_USER_TO_GROUP_REQ: 'meeting-room-breakout-move-user-to-group-request',

    // CHAT
    CHAT_ROOM_MESSAGE: 'meeting-room-chat-room-message',
    CHAT_PEER_MESSAGE: 'meeting-room-chat-peer-message',
    CHAT_SYSTEM_ROOM_MESSAGE: 'meeting-room-chat-system-room-message',
    CHAT_SYSTEM_PEER_MESSAGE: 'meeting-room-chat-system-peer-message',

    // RTC
    LOCAL_NETWORK_QUALITY: 'meeting-room-local-network-quality',
    USER_REALTIME_VOLUME: 'meeting-room-user-realtime-volume',
    LOCAL_USER_RTC_JOIN: 'meeting-room-local-user-rtc-join',
    LOCAL_USER_RTC_LEAVE: 'meeting-room-local-user-rtc-leave',
    REMOTE_USER_RTC_JOIN: 'meeting-room-remote-user-rtc-join',
    REMOTE_USER_RTC_LEAVE: 'meeting-room-remote-user-rtc-leave',
    LOCAL_AUDIO_DEVICE_CHANGE: 'meeting-room-local-audio-device-change',
    LOCAL_VIDEO_DEVICE_CHANGE: 'meeting-room-local-video-device-change',
    USER_VIDEO_SIZE_CHANGE: 'meeting-room-user-video-size-change',
    LOCAL_RTC_CONNECTION_LOST: 'meeting-room-local-rtc-connect-lost',
    LOCAL_RTC_FAIL: 'meeting-room-local-rtc-fail',
    SCREEN_SHARE_JOIN: 'meeting-room-screen-share-join',
    SCREEN_SHARE_LEAVE: 'meeting-room-screen-share-leave',
    REMOTE_USER_VIDEO_ON: 'meeting-room-remote-user-video-on',
    REMOTE_USER_VIDEO_OFF: 'meeting-room-remote-user-video-off',
    REMOTE_USER_AUDIO_ON: 'meeting-room-remote-user-audio-on',
    REMOTE_USER_AUDIO_OFF: 'meeting-room-remote-user-audio-off',
    REMOTE_USER_SUBSCRIBED: 'meeting-room-remote-user-subscribed',
    REMOTE_USER_UNSUBSCRIBED: 'meeting-room-remote-user-unsubscribed',
    LOCAL_USER_VIDEO_PUBLISHED: 'meeting-room-local-user-video-publish',
    LOCAL_USER_VIDEO_UNPUBLISHED: 'meeting-room-local-user-video-unpublish',
    LOCAL_USER_AUDIO_PUBLISHED: 'meeting-room-local-user-audio-publish',
    LOCAL_USER_AUDIO_UNPUBLISHED: 'meeting-room-local-user-audio-unpublish'
  }
}

export const messageType = {
  MESSAGE_CONTROL: 'msg_control',
  MESSAGE_ANALYTICAL: 'msg_analytical'
}

export const controlMessageType = {
  CONTROL_CUSTOM_SIGNAL: 'ctl_custom_signal',
  CONTROL_VIDEO_CHANGE: 'ctl_video_change',
  CONTROL_AUDIO_CHANGE: 'ctl_audio_change',
  CONTROL_BREAKOUT_GROUP: 'ctl_breakout_group',
  CONTROL_MOVE_USER_TO_GROUP: 'ctl_move_user_to_group',
  CONTROL_NAME_CHANGE: 'ctl_name_change',
  CONTROL_ROLE_CHANGE: 'ctl_role_change',
  CONTROL_AVATAR_CHANGE: 'ctl_avatar_change',
  CONTROL_GROUP_ID_CHANGE: 'ctl_group_id_change',
  CONTROL_MOVE_USER_TO_GROUP_REQ: 'ctl_move_user_to_group_request',
  CONTROL_BROADCAST_MSG_TO_GROUPS: 'ctl_broadcast_message_to_groups',
  CONTROL_CALL_HOST_TO_GROUP: 'ctl_call_host_to_group',
  CONTROL_CHANGE_BREAKOUT_GROUPS_STATUS: 'ctl_change_breakout_groups_status'
  // CONTROL_POWER_CHANGE: 'ctl_power_change',
  // CONTROL_POWER_CHANGE_RESPONSE: 'ctl_power_change_response',
  // CONTROL_CHANNEL_STOP: 'ctl_channel_stop',
  // CONTROL_CHANGE_USABLE: 'ctl_usable',
  // CONTROL_RTC_HEARTBEAT: 'ctl_rtc_heartbeat',
  // CONTROL_USER_JOIN: 'ctl_user_join',
  // CONTROL_USER_LEAVE: 'ctl_user_leave',
  // CONTROL_USER_PING: 'ctl_user_ping',
  // CONTROL_USER_PONG: 'ctl_user_pong',
  // CONTROL_VIDEO_COURSEWARE: 'ctrl_video_courseware',
  // UPDATE_COURSEWARE_STATE: 'upd_courseware_state',
  // CONTROL_CLASS_POWER_CHANGE: 'ctl_class_power_change',
  // CONTROL_CONNECTION_CHECK: 'ctl_connection_check',
  // CONTROL_CONNECTION_SERVER_FAIL: 'ctl_connection_failure',
  // CONTROL_BREAKOUT_ROOMS: 'ctl_breakout_rooms',
  // CONTROL_MOVE_USER_TO_ROOM_REQ: 'ctl_move_user_to_room_request',
  //
  // CONTROL_UPDATE: 'ctl_update',
  // CONTROL_HAND: 'ctl_hand',
  // CONTROL_LOAD_COURSEWARE: 'ctl_load_courseware',
  // CONTROL_KICK_OUT: 'ctl_kick_out',
  // CONTROL_SHARE: 'ctl_share',
  // CONTROL_MUTE_ALL: 'ctl_staging_change'
}

export const ChatRole = {
  Sender: 'send',
  Receiver: 'receiver'
}
export const ANALYTICAL_INTERVAL = 5000

export function VideoChange(roomId, userId, value) {
  return {
    kind: messageType.MESSAGE_CONTROL,
    type: controlMessageType.CONTROL_VIDEO_CHANGE, //'ctl_video_change',
    value, //true|false
    roomId,
    userId
  }
}

export function AudioChange(roomId, userId, value) {
  return {
    kind: messageType.MESSAGE_CONTROL,
    type: controlMessageType.CONTROL_AUDIO_CHANGE, //'ctl_audio_change',
    value, // true|false
    roomId,
    userId
  }
}

export function NameChange(roomId, userId, value) {
  return {
    kind: messageType.MESSAGE_CONTROL,
    type: controlMessageType.CONTROL_NAME_CHANGE, //'ctl_name_change',
    value,
    roomId,
    userId
  }
}

export function RoleChange(roomId, userId, value) {
  return {
    kind: messageType.MESSAGE_CONTROL,
    type: controlMessageType.CONTROL_ROLE_CHANGE, //'ctl_role_change',
    value,
    roomId,
    userId
  }
}

export function GroupIdChange(roomId, userId, groupId) {
  return {
    kind: messageType.MESSAGE_CONTROL,
    type: controlMessageType.CONTROL_GROUP_ID_CHANGE, //'ctl_group_id_change',
    value: groupId,
    roomId,
    userId
  }
}

export function CustomEvent(type, opts = {}) {
  let message = {
    kind: messageType.MESSAGE_CONTROL,
    type: controlMessageType.CONTROL_CUSTOM_SIGNAL,
    subType: type
  }

  if (Object.keys(opts).length !== 0) {
    message.data = opts
  }
  return message
}

export function ChangeBreakoutGroupsStatus(status) {
  return {
    kind: messageType.MESSAGE_CONTROL, // msg_control
    type: controlMessageType.CONTROL_CHANGE_BREAKOUT_GROUPS_STATUS, // ctl_change_breakout_groups_status
    status
  }
}

export function MoveUsersToBreakoutGroup(toGroupId, userIds = []) {
  return {
    kind: messageType.MESSAGE_CONTROL, // msg_control
    type: controlMessageType.CONTROL_MOVE_USER_TO_GROUP_REQ, // ctl_move_user_to_group_request
    toGroupId,
    userIds
  }
}

export function BroadcastMessageToGroups(senderId, message, groupId) {
  return {
    kind: messageType.MESSAGE_CONTROL, // msg_control
    type: controlMessageType.CONTROL_BROADCAST_MSG_TO_GROUPS, // ctl_broadcast_message_to_groups
    groupId,
    senderId,
    message
  }
}

export function BreakoutCallHostToGroup(senderId, groupId) {
  return {
    kind: messageType.MESSAGE_CONTROL, // msg_control
    type: controlMessageType.CONTROL_CALL_HOST_TO_GROUP, // ctl_call_host_to_group
    senderId,
    groupId
  }
}
