import User from './user'
import { hasOwnProperty } from '../../utils'

export default class UserMgr {
  constructor(roomId, userId) {
    this._roomId = roomId
    this._userId = userId
    this._user = null
    this._remoteUsers = {}
  }

  get users() {
    return [
      this._user,
      ...Object.keys(this._remoteUsers).map((uid) => this._remoteUsers[uid])
    ]
  }

  get user() {
    return this._user
  }

  get remoteUsers() {
    return this._remoteUsers
  }

  updateUser(props = {}, userId = null) {
    userId = userId ? userId : this._userId
    if (this._userId === userId) {
      if (this._user) {
        this._user.updateProps(props)
      } else {
        this._user = new User({ ...props, id: userId })
      }
    } else if (hasOwnProperty(this._remoteUsers, userId.toString())) {
      this._remoteUsers[userId.toString()].updateProps(props)
    } else {
      this._remoteUsers[userId.toString()] = new User({ ...props, id: userId })
    }
  }

  addUser(userId, props) {
    if (userId === this._userId && !this._user) {
      this._user = new User({ ...props, id: userId })
    } else if (!this._remoteUsers.hasOwnProperty(userId.toString())) {
      this._remoteUsers[userId.toString()] = new User({ ...props, id: userId })
    }
  }

  removeUser(userId) {
    const strUid = userId.toString()
    if (strUid === this._userId.toString()) {
      this._user = null
    } else {
      this._remoteUsers[strUid] && delete this._remoteUsers[strUid]
    }
  }

  removeUsers() {
    this._remoteUsers = {}
  }

  updateRemoteUser(props) {
    if (!props || !props.id) return
    typeof props.id !== 'number' && (props.id = Number(props.id))
    if (this._userId === props.id) return
    if (hasOwnProperty(this._remoteUsers, props.id.toString())) {
      this._remoteUsers[props.id.toString()].updateProps(props)
    } else {
      this._remoteUsers[props.id.toString()] = new User(props)
    }
  }

  updateUserName(name, userId = null) {
    if (!name || typeof name !== 'string') return
    if (!userId || userId === this._userId) {
      this._user.name = name
    } else if (hasOwnProperty(this._remoteUsers, userId.toString())) {
      this._remoteUsers[userId.toString()].name = name
    }
  }

  updateUserRole(role, userId = null) {
    if (!role) return
    if (!userId || userId === this._userId) {
      this._user.role = role
    } else if (hasOwnProperty(this._remoteUsers, userId.toString())) {
      this._remoteUsers[userId.toString()].role = role
    }
  }

  updateUserAvatar(avatar, userId = null) {
    if (!avatar) return
    if (!userId || userId === this._userId) {
      this._user.avatar = avatar
    } else if (hasOwnProperty(this._remoteUsers, userId.toString())) {
      this._remoteUsers[userId.toString()].avatar = avatar
    }
  }

  updateUserGroupId(groupId, userId = null) {
    if (typeof groupId !== 'number') return
    if (!userId || userId === this._userId) {
      this._user.groupId = groupId
    } else if (hasOwnProperty(this._remoteUsers, userId.toString())) {
      this._remoteUsers[userId.toString()].groupId = groupId
    }
  }

  updateUserStates(states, userId = null) {
    let ret
    userId = userId ? userId : this._userId
    if (userId.toString() === this._userId.toString()) {
      this._user.updateProps(states)
      ret = this._user
    } else if (hasOwnProperty(this._remoteUsers, userId.toString())) {
      this._remoteUsers[userId.toString()].updateProps(states)
      ret = this._remoteUsers[userId.toString()]
    } else {
      this._remoteUsers[userId.toString()] = new User({
        id: userId,
        ...states
      })
      ret = this._remoteUsers[userId.toString()]
    }

    return ret
  }

  updateUserState(userId, type, state) {
    let ret = true
    if (userId === this._userId) {
      this._user.updateState(type, state)
    } else if (userId && this._remoteUsers.hasOwnProperty(userId.toString())) {
      this._remoteUsers[userId.toString()].updateState(type, state)
    } else {
      ret = false
    }
    return ret
  }

  getUserByRole(role) {
    return Object.keys(this._remoteUsers)
      .filter((uid) => this._remoteUsers[uid].role === role)
      .map((uid) => {
        return this._remoteUsers[uid]
      })
  }

  findUser(userId) {
    return userId === this._userId ? this._user : this._remoteUsers[userId.toString()]
  }

  getUserState(userId, type) {
    const user = this.findUser(userId)
    return user.getState(type)
  }

  getUserCount() {
    return Object.keys(this._remoteUsers).length + (this._user ? 1 : 0)
  }
}
