import { hasOwnProperty } from '../../utils'
import { ShareType } from '../../common'

// function toBool(value) {
//   return typeof value === 'string'
//     ? stringToBool(value)
//     : typeof value === 'number'
//     ? !!value
//     : value
// }

export default class User {
  constructor(props = {}) {
    if (hasOwnProperty(props, 'id')) {
      this.id = props.id
    } else {
      throw Error('MeetingCore:User - Miss id')
    }
    if (hasOwnProperty(props, 'user_ext_id')) {
      this.extId = props.user_ext_id
    } else if (hasOwnProperty(props, 'extId')) {
      this.extId = props.extId
    } else {
      this.extId = null
    }
    this.groupId = hasOwnProperty(props, 'groupId') ? props.groupId : 0
    this.name = hasOwnProperty(props, 'name') ? props.name : this.id.toString()
    this.avatar = hasOwnProperty(props, 'avatar') ? props.avatar : null
    this.role = hasOwnProperty(props, 'role') ? props.role : null
    this.state = {
      video: hasOwnProperty(props, 'video') ? props.video : false,
      audio: hasOwnProperty(props, 'audio') ? props.audio : true,
      hand: hasOwnProperty(props, 'hand') ? props.hand : false,
      share: hasOwnProperty(props, 'share') ? props.share : ShareType.None
    }
  }

  get videoState() {
    return this.state.video
  }
  set videoState(state) {
    this.state.video = state
  }

  get audioState() {
    return this.state.audio
  }
  set audioState(state) {
    this.state.audio = state
  }

  get handState() {
    return this.state.hand
  }
  set handState(state) {
    this.state.hand = state
  }

  get shareState() {
    return this.state.share
  }
  set shareState(state) {
    this.state.share = state
  }

  getState(type) {
    return this.state[type]
  }

  updateState(type, state) {
    this.state.hasOwnProperty(type) && (this.state[type] = state)
  }

  updateStates(state) {
    hasOwnProperty(state, 'audio') && (this.audioState = state.audio)
    hasOwnProperty(state, 'video') && (this.videoState = state.video)
    hasOwnProperty(state, 'hand') && (this.handState = state.hand)
    hasOwnProperty(state, 'share') && (this.shareState = state.share)
  }

  updateProps(props) {
    hasOwnProperty(props, 'id') && (this.id = props.id)
    hasOwnProperty(props, 'user_ext_id') && (this.extId = props.user_ext_id)
    hasOwnProperty(props, 'extId') && (this.extId = props.extId)
    hasOwnProperty(props, 'groupId') && (this.groupId = props.groupId)
    hasOwnProperty(props, 'name') && (this.name = props.name)
    hasOwnProperty(props, 'role') && (this.role = props.role)
    hasOwnProperty(props, 'avatar') && (this.avatar = props.avatar)
    this.updateStates(props)
  }

  getProps(includeId = false) {
    let ret = {
      id: this.id,
      groupId: this.groupId,
      name: this.name,
      avatar: this.avatar,
      role: this.role,
      video: this.videoState,
      audio: this.audioState,
      hand: this.handState,
      share: this.shareState
    }
    if (includeId) {
      ret.user_ext_id = this.extId
    }
    return ret
  }
}
