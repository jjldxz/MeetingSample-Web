import moment from 'moment-timezone'

export const winBaseURL = process.env.WEBPACK_DEV_SERVER_URL
  ? process.env.WEBPACK_DEV_SERVER_URL
  : 'app://./index.html'

export const TIME_ZONE = moment.tz.guess()

export const CustomEvents = {
  UPDATE_MEETING_LIST: 'update-meeting-list',
  CLOSE_MEETING: 'close-meeting',
  MEETING_SHOW_NOTIFICATION: 'meeting-show-notification',
  MEETING_CHANGE_GRID_TYPE: 'meeting-change-grid-type',
  MEETING_SWITCH_FULL_SCREEN: 'meeting-switch-fullscreen',
  CHANGE_SIDE_BAR_TYPE: 'meeting-change-side-bar-type',
  CLEAR_ACTIVE_USER: 'clear-active-user',
  NEW_ACTIVE_USER: 'new-active-user',
  SHOW_MEETING_LEAVE_DIALOG: 'show-meeting-leave-dialog',
  OPEN_POLL: 'open-poll',
  CLOSE_POLL: 'close-poll',
  OPEN_BREAKOUT_GROUP: 'open-breakout-group',
  CLOSE_BREAKOUT_GROUP: 'close-breakout-group',
  OPEN_POLL_PAGE: 'open-poll-page',
  REACTION: 'click-reaction'
}

export const IPCEvents = {
  CHECK_LANGUAGE: 'check-language',
  CHECK_MEETING_ALIVE: 'check-meeting-alive',
  OPEN_SETTING_WIN: 'open-settings',
  OPEN_MEETING_WIN: 'open-meeting',
  HOME: {
    UPDATE_MEETING_LIST: 'update-meeting-list'
  },
  ICS: {
    CREATE_ICS: 'create-ics',
    OPEN_ICS_SUCCESS: 'open-isc-success'
  },
  SETTING: {
    MIN: 'settings-minimum',
    CLOSE: 'settings-clos'
  },
  MEETING: {
    MIN: 'meeting-minimum',
    CLOSE: 'meeting-close',
    OPEN_SCREEN_MARKER: 'open-screen-marker',
    STOP_SCREEN_MARKER: 'stop-screen-marker',
    CLOSE_SCREEN_MARKER: 'close-screen-marker',
    SWITCH_FULL_SCREEN: 'switch-meeting-fullscreen'
  },
  MARKER: {
    DRAW_LINE: 'screen-marker-draw-pencil',
    DRAWING_STRAIGHT_LINE: 'screen-marker-draw-line',
    DRAW_CIRCLE: 'screen-marker-draw-circle',
    DRAW_RECTANGLE: 'screen-marker-draw-rectangle',
    DRAW_TEXT: 'screen-marker-draw-text',
    DRAW_COLOR: 'screen-marker-draw-change-color',
    CLEAN: 'screen-marker-draw-clean-all',
    UNDO: 'screen-marker-draw-undo',
    REDO: 'screen-marker-draw-redo',
    SAVE: 'screen-marker-draw-save',
    CONTROL: 'screen-marker-screen-control',
    DRAW_TYPE_CHANGED: 'screen-marker-draw-type-changed'
  },
  WIN_SHARE_IND: {
    MIN: 'minimize-window-share-ind',
    STOP: 'stop-window-share-ind'
  }
}

export const MeetingRole = {
  Host: 'host',
  Assistant: 'co-host',
  Attendee: 'attendee',
  Share: 'share',
  Record: 'record'
}

export const GridTypes = {
  TYPE_1: '1x1',
  TYPE_3: '3xn',
  TYPE_4: '4xn',
  TYPE_5: '5xn',
  TYPE_LR: 'LR'
}

export const DrawType = {
  Line: 0,
  StraightLine: 1,
  Rectangle: 2,
  Round: 3,
  Text: 4,
  Eraser: 5
}

export const ReactionType = {
  REACTION_THUMB: 'reaction_thumb',
  REACTION_CLAP: 'reaction_clap',
  REACTION_CRY: 'reaction_cry',
  REACTION_STUPEFY: 'reaction_stupefy',
  REACTION_HEART: 'reaction_heart',
  REACTION_CONGRATULATION: 'reaction_congratulation'
}

export const Reactions = Object.keys(ReactionType).map((k) => ReactionType[k])

export const PollType = {
  PUBLISH_POLL: 'poll_start',
  PUBLISH_RESULT: 'poll_publishResult',
  ATTENDEES_POLL: 'poll_commit',
  STOP_PUBLISH_RESULT: 'poll_stopPublishResult',
  STOP_PUBLISH: 'poll_stop',
  DEL_EPOLL: 'poll_del'
}

export const ShareType = {
  None: null,
  WhiteBoard: 'whiteboard',
  WhiteBoardHide: 'wbHide',
  Screen: 'screen',
  Window: 'window'
}

export const ChatItemType = {
  Sender: 'sender',
  Receiver: 'receiver',
  Time: 'time'
}

export const DEFAULT_BREAKOUT_GROUP_ID = 0

export const MAIN_WIN_INIT_WIDTH = 380
export const MAIN_WIN_INIT_HEIGHT = 660

export const SETTINGS_WIN_INIT_WIDTH = 720
export const SETTINGS_WIN_INIT_HEIGHT = 540

export const MEETING_WIN_INIT_WIDTH = 1300
export const MEETING_WIN_INIT_HEIGHT = 705

export const SCREEN_MARKER_BAR_WIDTH = 740
export const SCREEN_MARKER_BAR_HEIGHT = 60

export const WIN_SHARE_IND_WIDTH = 400
export const WIN_SHARE_IND_HEIGHT = 300
