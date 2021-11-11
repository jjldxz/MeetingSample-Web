export const ExternalEvents = {
  HAND: {
    USER_CAN_HAND_UP: 'tool-hand-user-can-hand-up',
    USER_HAND_UP: 'tool-hand-user-hand-up',
    USER_HAND_UP_ACK: 'tool-hand-user-hand-up-ack',
    USER_HAND_DOWN: 'tool-hand-user-hand-down'
  },
  WB: {
    DRAW_START: 'tool-wb-draw-start',
    PAGE_CHANGE: 'tool-wb-page-change',
    PAGE_GROUP_CHANGE: 'tool-wb-page-group-change',
    UPDATE_WHITEBOARD_COMPLETE: 'tool-wb-whiteboard-update-complete',
    PREV_ACTIVE_PG_COMPLETE: 'tool-wb-prev-active-pg-complete',
    COURSEWARE_UPDATED: 'tool-wb-courseware-updated',
    USER_WB_STATE_CHANGE: 'tool-wb-user-whiteboard-change'
  },
  CHAT: {
    USER_NEW_CHAT_MESSAGE: 'tool-chat-user-new-chat-message',
    SYSTEM_MESSAGE: 'tool-chat-system-message',
    PEER_NEW_CHAT_MESSAGE: 'tool-chat-peer-new-message',
    PEER_SYSTEM_MESSAGE: 'tool-chat-peer-system-message',
    ENABLE_CHANGE: 'tool-chat-enable-change'
  },
  ASR: {
    MESSAGE: 'tool-asr-message'
  }
  // VIDEO: {
  //   VIDEO_INIT: 'video-courseware-init',
  //   VIDEO_LOAD: 'video-courseware-load',
  //   VIDEO_LOAD_AND_PLAY: 'video-courseware-load-play',
  //   VIDEO_CLOSE: 'video-courseware-close',
  //   VIDEO_PLAY: 'video-courseware-play'
  // },
  // REMOTECTL: {
  //   REMOTE_CTL_KB: 'remote-ctl-keyboard',
  //   REMOTE_CTL_MS: 'remote-ctl-mouse'
  // }
}
