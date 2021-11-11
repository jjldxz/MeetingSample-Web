import * as uuid from 'uuid'
import { ExternalEvents } from './events'

export { ExternalEvents }

export const messageType = {
  MESSAGE_CONTROL: 'msg_control',
  MESSAGE_DRAWING: 'msg_drawing',
  MESSAGE_CHAT: 'msg_chat',
  MESSAGE_ASR: 'msg_asr',
  MESSAGE_HAND: 'msg_hand'
}

export const drawingMessageType = {
  DRAWING_LINE: 'drw_line',
  DRAWING_STRAIGHT_LINE: 'drw_straight_line',
  DRAWING_RECT: 'drw_rect',
  DRAWING_ROUND: 'drw_round',
  DRAWING_TEXT: 'drw_text',
  DRAWING_IMAGE: 'drw_image',
  DRAWING_DELETE_IMAGE: 'drw_del_image',
  DRAWING_DELETE: 'drw_delete',
  DRAWING_REVOKE: 'drw_revoke',
  DRAWING_REVOKE_ON: 'drw_revoke_on',
  DRAWING_REVOKE_OFF: 'drw_revoke_off',
  DRAWING_CLEARALL: 'drw_clearall',
  DRAWING_PAGE: 'drw_page',
  DRAWING_PAGE_CHANGE: 'drw_page_change',
  DRAWING_PAGE_DELETE: 'drw_page_delete',
  SYNC_DATA: 'sync_data'
}

export const controlMessageType = {
  CONTROL_POWER_CHANGE: 'ctl_power_change',
  CONTROL_POWER_CHANGE_RESPONSE: 'ctl_power_change_response',
  CONTROL_UPDATE: 'ctl_update',
  CONTROL_HAND: 'ctl_hand',
  CONTROL_CHANNEL_STOP: 'ctl_channel_stop',
  CONTROL_LOAD_COURSEWARE: 'ctl_load_courseware',
  CONTROL_KICK_OUT: 'ctl_kick_out',
  CONTROL_CHANGE_USABLE: 'ctl_usable',
  CONTROL_CUSTOM_SIGNAL: 'ctl_custom_signal',
  CONTROL_RTC_HEARTBEAT: 'ctl_rtc_heartbeat',
  CONTROL_USER_JOIN: 'ctl_user_join',
  CONTROL_USER_LEAVE: 'ctl_user_leave',
  CONTROL_USER_PING: 'ctl_user_ping',
  CONTROL_USER_PONG: 'ctl_user_pong',
  CONTROL_VIDEO_COURSEWARE: 'ctrl_video_courseware',
  UPDATE_COURSEWARE_STATE: 'upd_courseware_state',
  CONTROL_CLASS_POWER_CHANGE: 'ctl_class_power_change',
  CONTROL_CONNECTION_CHECK: 'ctl_connection_check',
  CONTROL_CONNECTION_SERVER_FAIL: 'ctl_connection_failure',
  CONTROL_SHARE: 'ctl_share',
  CONTROL_AUDIO_CHANGE: 'ctl_audio_change',
  CONTROL_VIDEO_CHANGE: 'ctl_video_change',
  CONTROL_WB_CHANGE: 'ctl_wb_change',
  CONTROL_CHAT_CHANGE: 'ctl_chat_change',
  CONTROL_PLATFORM_CHANGE: 'ctl_platform_change',
  CONTROL_HAND_CHANGE: 'ctl_hand_change'
}

export const controlUpdateMessageType = {
  UPDATE_WHITEBOARD: 'upd_whiteboard',
  UPDATE_POWER: 'upd_power',
  UPDATE_WHITEBOARD_INFO_QUERY: 'upd_whiteboard_info_query',
  UPDATE_CHAT_STATE: 'upd_chat_state',
  UPDATE_WHITEBOARD_STATE: 'upd_whiteboard_state',
  UPDATE_HAND_STATE: 'upd_hand_state',
  UPDATE_USER_INFO_QUERY: 'upd_userinfo_q',
  UPDATE_USER_INFO_RESPONSE: 'upd_userinfo_r',
  UPDATE_VIDEO_COURSEWARE: 'upd_video_player',
  UPDATE_USER_STATE_QUERY: 'upd_userstate_q',
  UPDATE_USER_STATE_RESPONSE: 'upd_userstate_r',
  UPDATE_COURSEWARE_STATE: 'upd_courseware_state',
  UPDATE_SHARE: 'upd_share',
  UPDATE_USER_INFO: 'upd_user_info'
}

export const chatMessageType = {
  CHAT_TEXT_MESSAGE: 'chat_text_msg',
  SYSTEM_TEXT_MESSAGE: 'system_text_msg'
}

export const handMessageType = {
  HAND_UP: 'hand_up',
  HAND_ACK: 'hand_ack',
  HAND_DOWN: 'hand_down'
}

/**
 * @function Deleted
 * @description the message for delete draw
 * @param id
 * @param groupId
 * @param pageId
 * @return {{targetId, kind: string, groupId, id: *, time: number, type: string, pageId}}
 * @constructor
 */
export function Delete(id, groupId, pageId) {
  return {
    kind: messageType.MESSAGE_DRAWING,
    type: drawingMessageType.DRAWING_DELETE,
    id: uuid.v1(),
    time: Date.now(),
    targetId: id,
    groupId: groupId,
    pageId: pageId
  }
}

/**
 * @function Page
 * @description create a new page
 * @param groupName
 * @param groupId
 * @param pageId
 * @return {{groupName, kind: string, groupId, id, type: string}}
 * @constructor
 */
export function Page(groupName, groupId, pageId) {
  return {
    kind: messageType.MESSAGE_DRAWING,
    type: drawingMessageType.DRAWING_PAGE,
    groupName: groupName,
    groupId: groupId,
    id: pageId
  }
}

/**
 * @function PageChange
 * @param groupId
 * @param pageId
 * @return {{kind: string, groupId, id, type: string}}
 * @constructor
 */
export function PageChange(groupId, pageId) {
  return {
    kind: messageType.MESSAGE_DRAWING,
    type: drawingMessageType.DRAWING_PAGE_CHANGE,
    groupId: groupId,
    id: pageId
  }
}

export function PageDelete(groupId, pageId) {
  return {
    kind: messageType.MESSAGE_DRAWING,
    type: drawingMessageType.DRAWING_PAGE_DELETE,
    groupId: groupId,
    id: pageId
  }
}

export function CourseWareLoad(groupId, pageId, courseCnt) {
  return {
    kind: messageType.MESSAGE_CONTROL,
    type: controlMessageType.CONTROL_LOAD_COURSEWARE,
    groupId: groupId,
    pageId: pageId,
    count: courseCnt
  }
}

export function PageClean(groupId, pageId) {
  return {
    kind: messageType.MESSAGE_DRAWING,
    type: drawingMessageType.DRAWING_CLEARALL,
    groupId: groupId,
    pageId: pageId,
    time: Date.now(),
    id: uuid.v1()
  }
}

export function Line(lineColor, lineWidth, points, groupId, pageId) {
  return {
    kind: messageType.MESSAGE_DRAWING, // msg_drawing
    type: drawingMessageType.DRAWING_LINE, // drw_line
    id: uuid.v1(),
    time: Date.now(),
    lineColor: lineColor,
    lineWidth: lineWidth,
    points: points,
    groupId: groupId,
    pageId: pageId
  }
}

export function StraightLine(lineColor, lineWidth, startDot, endDot, groupId, pageId) {
  return {
    kind: messageType.MESSAGE_DRAWING,
    type: drawingMessageType.DRAWING_STRAIGHT_LINE,
    id: uuid.v1(),
    time: Date.now(),
    lineColor: lineColor,
    lineWidth: lineWidth,
    startDot: startDot,
    endDot: endDot,
    groupId: groupId,
    pageId: pageId
  }
}

export function Rect(
  lineColor,
  lineWidth,
  startDot,
  endDot,
  sideLength,
  groupId,
  pageId
) {
  return {
    kind: messageType.MESSAGE_DRAWING,
    type: drawingMessageType.DRAWING_RECT,
    id: uuid.v1(),
    time: Date.now(),
    lineColor: lineColor,
    lineWidth: lineWidth,
    startDot: startDot,
    endDot: endDot,
    sideLength: sideLength,
    groupId: groupId,
    pageId: pageId
  }
}

export function Round(
  lineColor,
  lineWidth,
  startDot,
  endDot,
  sideLength,
  r,
  groupId,
  pageId
) {
  return {
    kind: messageType.MESSAGE_DRAWING,
    type: drawingMessageType.DRAWING_ROUND,
    id: uuid.v1(),
    time: Date.now(),
    lineColor: lineColor,
    lineWidth: lineWidth,
    startDot: startDot,
    endDot: endDot,
    sideLength: sideLength,
    r: r,
    groupId: groupId,
    pageId: pageId
  }
}

export function Text(lineColor, lineWidth, content, startDot, groupId, pageId) {
  return {
    kind: messageType.MESSAGE_DRAWING,
    type: drawingMessageType.DRAWING_TEXT,
    id: uuid.v1(),
    time: Date.now(),
    lineColor: lineColor,
    lineWidth: lineWidth,
    content: content,
    startDot: startDot,
    groupId: groupId,
    pageId: pageId
  }
}

export function ChatMessage(content, opts = {}) {
  let ret = {
    kind: messageType.MESSAGE_CHAT, // msg_chat
    type: chatMessageType.CHAT_TEXT_MESSAGE, // chat_text_msg
    time: Date.now(),
    content: content
  }
  if (opts && Object.keys(opts).length !== 0) {
    ret.data = opts
  }
  return ret
}

export function SystemMessage(content) {
  return {
    kind: messageType.MESSAGE_CHAT,
    type: chatMessageType.SYSTEM_TEXT_MESSAGE, // system_text_msg
    time: Date.now(),
    content: content
  }
}

export function AsrMessage(content) {
  return {
    kind: messageType.MESSAGE_ASR,
    type: chatMessageType.CHAT_TEXT_MESSAGE,
    content: content
  }
}

export function HandUpAckRequest(userId) {
  return {
    kind: messageType.MESSAGE_HAND,
    type: handMessageType.HAND_ACK,
    userId
  }
}

export function SyncWhiteboard(userId) {
  return {
    kind: messageType.MESSAGE_DRAWING,
    type: drawingMessageType.SYNC_DATA,
    userId
  }
}
