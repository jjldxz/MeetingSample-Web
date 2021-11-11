<template>
  <div id="group-detail" style="width: 100%; height: 400px" class="pb-2">
    <div style="width: 100%; height: 95%; overflow-x: hidden; overflow-y: auto">
      <v-treeview
        ref="groupsTreeView"
        :items="groupsInfo"
        :open="openItemList"
        open-all
        dense
        expand-icon="mdi-chevron-down"
        hoverable
        light
      >
        <template #label="{ item, leaf }">
          <div
            :class="[
              'd-flex',
              !breakoutGroupStatus || !leaf
                ? 'normal-text'
                : item.inRoom
                ? 'normal-text'
                : 'change-group-title'
            ]"
          >
            <div>
              <span
                :style="
                  item.type === 'group'
                    ? 'color:#3A3A3A;font-weight:500;font-size: 14px'
                    : 'color:#333333'
                "
                >{{ item.name }}</span
              >
              <span
                v-if="
                  meetingUserId === item.id &&
                  breakoutGroupStatus &&
                  item.type !== 'group'
                "
                class="pl-1"
                >({{ $vuetify.lang.t('$vuetify.meeting.myself') }})</span
              ><span
                v-if="breakoutGroupStatus && item.type === 'group'"
                class="change-group-title pl-2"
                >({{
                  $vuetify.lang.t(
                    '$vuetify.meeting.groupPeopleNumber',
                    item.children ? item.children.length : 0
                  )
                }})</span
              >
            </div>
            <div
              v-if="breakoutGroupStatus && item.type !== 'group' && !item.inRoom"
              class="ml-1"
            >
              ({{ $vuetify.lang.t('$vuetify.meeting.unJoin') }})
            </div>
          </div>
        </template>
        <template #prepend="{ item }">
          <v-avatar v-if="item.type !== 'group'" size="26" class="ml-1 mr-1">
            <v-img
              alt=""
              width="26"
              height="26"
              :src="item.avatar ? item.avatar : require('@/assets/default-avatar.png')"
            />
          </v-avatar>
          <div
            v-if="
              showRenameDlg &&
              item.type === 'group' &&
              currentRenameGroup &&
              item.id === currentRenameGroup.id
            "
            class="rename-input"
          >
            <v-text-field
              v-model="groupNewName"
              color="#127BF8"
              :placeholder="$vuetify.lang.t('$vuetify.meeting.enterNewGroupName')"
              hide-details
              autofocus
              dense
              @blur.native.capture="onRenameRoom"
            />
          </div>
        </template>
        <template #append="{ item }">
          <div v-if="!breakoutGroupStatus">
            <div v-if="item.type === 'group'">
              <v-btn
                text
                x-small
                class="pa-0"
                :class="
                  groupsInfo.length === 1 && readyForBreakOutUsers.length === 0
                    ? 'mr-10'
                    : 'mr-5'
                "
                @click="onOpenRenameDlg(item)"
                ><span class="normal-text blue-text">{{
                  $vuetify.lang.t('$vuetify.meeting.rename')
                }}</span></v-btn
              >
              <v-btn
                v-if="readyForBreakOutUsers.length > 0"
                class="pa-0"
                :class="groupsInfo.length === 1 ? 'mr-10' : 'mr-5'"
                text
                x-small
                @click="moveAndAddFun(item, 'add')"
                ><span class="normal-text blue-text">{{
                  $vuetify.lang.t('$vuetify.meeting.addUsersToGroup')
                }}</span></v-btn
              >
              <v-btn
                v-if="groupsInfo.length > 1"
                text
                x-small
                class="pa-0 mr-10"
                @click="onDeleteRoom(item)"
                ><span class="red-text">{{
                  $vuetify.lang.t('$vuetify.meeting.delete')
                }}</span></v-btn
              >
            </div>
            <div v-else>
              <v-btn
                :disabled="getOtherGroups(item.id).length === 0"
                text
                x-small
                class="pa-0 mr-5"
                @click="moveAndAddFun(item, 'move')"
                ><span class="normal-text blue-text">{{
                  $vuetify.lang.t('$vuetify.meeting.moveTo')
                }}</span></v-btn
              >
              <v-btn
                v-if="isMemberExchangeEnable(item.id)"
                text
                x-small
                class="pa-0 mr-5"
                @click="exchange(item)"
                ><span class="normal-text blue-text">{{
                  $vuetify.lang.t('$vuetify.meeting.exchange')
                }}</span></v-btn
              >
              <v-btn
                text
                x-small
                class="pa-0 mr-10"
                @click="onRemoveMemberFromRoom(item)"
              >
                <span class="red-text">
                  {{ $vuetify.lang.t('$vuetify.meeting.removeFromGroup') }}
                </span>
              </v-btn>
            </div>
          </div>
          <div v-else>
            <div v-if="item.type === 'group'">
              <v-btn
                v-if="showJoinBtn(item)"
                text
                x-small
                class="mr-7"
                @click="onJoinGroup(item)"
              >
                <span class="normal-text blue-text">{{
                  item.id === 0
                    ? $vuetify.lang.t('$vuetify.meeting.returnMain')
                    : $vuetify.lang.t('$vuetify.meeting.join')
                }}</span></v-btn
              >
            </div>
            <div v-else class="mr-7">
              <v-btn
                v-show="!item.inRoom && !isHost(item.id)"
                text
                x-small
                @click="inviteAgain(item)"
                ><span class="normal-text blue-text">{{
                  $vuetify.lang.t('$vuetify.meeting.inviteAgain')
                }}</span></v-btn
              >
              <v-btn
                v-show="item.inRoom && !isHost(item.id)"
                text
                x-small
                @click="moveAndAddFun(item, 'move-start')"
                ><span class="normal-text blue-text">{{
                  $vuetify.lang.t('$vuetify.meeting.moveTo')
                }}</span></v-btn
              >
            </div>
          </div>
        </template>
      </v-treeview>
    </div>
    <div class="mt-2">
      <div v-if="!breakoutGroupStatus" class="d-flex justify-end pr-5">
        <v-btn
          color="#127BF8"
          outlined
          height="30"
          min-width="80"
          class="mr-5 pa-1"
          @click="onAddRoom"
          ><span class="normal-text">{{
            $vuetify.lang.t('$vuetify.meeting.addNewGroup')
          }}</span></v-btn
        >
        <v-btn
          color="#127BF8"
          class="white--text pa-1"
          depressed
          height="30"
          min-width="80"
          @click="onOpenAllRooms"
          ><span class="normal-text">{{
            $vuetify.lang.t('$vuetify.meeting.openAllGroups')
          }}</span></v-btn
        >
      </div>
      <div
        v-if="breakoutGroupStatus"
        id="breakout-room-status"
        class="d-flex justify-end pr-5"
      >
        <!-- 广播消息 -->
        <v-menu
          v-model="showBroadcastToAllDlg"
          :close-on-content-click="false"
          min-width="500"
          min-height="190"
          nudge-left="165"
          nudge-bottom="-10"
          attach="#group-detail"
          top
          offset-y
        >
          <template #activator="{ on, attrs }">
            <v-btn
              v-bind="attrs"
              color="#127BF8"
              min-width="90"
              outlined
              height="30"
              class="mr-5 pa-1"
              v-on="on"
              @click="showBroadcast"
              ><span class="normal-text">{{
                $vuetify.lang.t('$vuetify.meeting.broadcastMessageToAll')
              }}</span></v-btn
            >
          </template>
          <v-card class="pl-5 pr-5 ma-0">
            <v-card-text class="pa-0 ma-0 broadcast-message">
              <div
                class="big-text"
                style="height: 44px; line-height: 44px; color: #333333; font-weight: 400"
              >
                {{ $vuetify.lang.t('$vuetify.meeting.broadcastMessage') }}
              </div>
              <v-textarea
                v-model="broadcastToAllMessage"
                :placeholder="
                  $vuetify.lang.t('$vuetify.meeting.PleaseEnterBroadcastMessage')
                "
                flat
                dense
                type="text"
                color="#cccccc"
                no-resize
                clear
                light
                height="90"
                hide-details
                rows="3"
                autofocus
              />
            </v-card-text>
            <v-card-actions class="btn-action pl-0 pr-0" style="padding: 12px 0">
              <v-spacer />
              <v-btn
                color="#127BF8"
                height="30"
                min-width="80"
                outlined
                class="mr-5 pa-1"
                @click="showBroadcastToAllDlg = false"
                ><span class="normal-text">{{
                  $vuetify.lang.t('$vuetify.meeting.cancel')
                }}</span></v-btn
              >
              <v-btn
                color="#127BF8"
                height="30"
                min-width="80"
                class="white--text pa-1"
                :disabled="!broadcastToAllMessage"
                depressed
                @click="onBroadcastMessageToAll"
                ><span class="normal-text">{{
                  $vuetify.lang.t('$vuetify.meeting.broadcast')
                }}</span></v-btn
              >
            </v-card-actions>
          </v-card>
        </v-menu>
        <v-btn
          color="#127BF8"
          class="white--text pa-1"
          depressed
          height="30"
          min-width="90"
          @click="onCloseAllRooms"
          ><span class="normal-text">{{
            $vuetify.lang.t('$vuetify.meeting.closeAllGroups')
          }}</span></v-btn
        >
      </div>
    </div>
    <move-or-add-attendees
      v-model="moveAndAddDialog"
      :title.sync="moveAndAddTitle"
      :add-users.sync="addUsers"
      :add-to-group.sync="currentAddUserToGroup"
      :move-user.sync="moveUser"
      :groups-info.sync="groupsInfo"
      :operation.sync="moveAddType"
      :ready-for-break-out-users.sync="readyForBreakOutUsers"
      @updateGroupsTree="$refs.groupsTreeView.updateAll($event)"
      @updateBreakoutUsers="$emit('updateBreakoutUsers', $event)"
      @updateGroupsInfo="groupsInfo = $event"
    />
    <exchange-attendees
      v-model="exchangeDialog"
      :dist-room.sync="exchangeDistRoom"
      :groups-info.sync="groupsInfo"
      :user="exchangeUser"
      :exchange-groups="exchangeGroupsList"
      @updateGroupsInfo="groupsInfo = $event"
    />
    <v-snackbar
      v-model="showSnackbar"
      color="#000000cc"
      centered
      style="min-width: 40px"
      timeout="1500"
    >
      {{ showSnackbarText }}
    </v-snackbar>
  </div>
</template>

<script>
import { mapMutations, mapState } from 'vuex'
import { DEFAULT_BREAKOUT_GROUP_ID, MeetingRole } from '../../../common'
import MoveOrAddAttendees from './moveOrAddAttendees'
import ExchangeAttendees from './exchangeAttendee'
import { MeetingCoreRoomEvents } from '../../../common/renderCommon'

export default {
  name: 'GroupDetail',
  components: { MoveOrAddAttendees, ExchangeAttendees },
  props: {
    groupCnt: {
      type: Number,
      default: 1
    },
    autoAddAttendees: {
      type: Boolean,
      default: true
    },
    attendeesCntPerGroup: {
      type: Number,
      default: 0
    },
    readyForBreakOutUsers: {
      type: Array,
      default() {
        return []
      }
    }
  },
  data() {
    return {
      meetingUserId: null,
      mainGroupName: '',
      groupsInfo: [],
      breakoutList: JSON.parse(JSON.stringify(window.meetingRoomCore.users)),
      broadcastToAllMessage: null,
      showBroadcastToAllDlg: false,
      showRenameDlg: false,
      currentRenameGroup: null,
      groupNewName: null,
      moveAndAddDialog: false,
      addUsers: [],
      moveUser: {},
      currentAddUserToGroup: null,
      moveAndAddTitle: this.$vuetify.lang.t('$vuetify.meeting.moveTo'),
      moveAddType: 'add',
      showSnackbar: false,
      showSnackbarText: '',
      innerGroupCnt: 0,
      exchangeUser: null,
      exchangeDistRoom: null,
      exchangeDialog: false,
      exchangeGroupsList: []
    }
  },
  computed: {
    ...mapState('meeting', ['breakoutGroupStatus']),
    openItemList() {
      return this.groupsInfo.map((r) => r.id)
    }
  },
  watch: {
    groupCnt(val) {
      this.innerGroupCnt = val
    },
    showBroadcastToAllDlg() {
      this.broadcastToAllMessage = null
    },
    showAddUserDlg(val) {
      if (!val) {
        this.currentAddUserToGroup = null
      }
    },
    breakoutGroupStatus(val) {
      if (val) {
        let users = []
        this.groupsInfo.map((g) => {
          users = [...users, ...g.children]
        })
        users = users.map((u) => {
          let tmp = JSON.parse(JSON.stringify(u))
          tmp.inRoom = true
          return tmp
        })
        users.unshift({
          id: window.meetingRoomCore.user.id,
          name: window.meetingRoomCore.user.name,
          avatar: window.meetingRoomCore.user.avatar,
          groupId: window.meetingRoomCore.user.groupId,
          inRoom: true
        })
        const idx = this.breakoutList.findIndex((u) => u.role === MeetingRole.Assistant)
        if (idx > -1 && this.breakoutList[idx].id !== window.meeting.userId) {
          users.unshift({
            ...this.breakoutList[idx],
            groupId: window.meetingRoomCore.user.groupId,
            inRoom: true
          })
        }
        let readyUsers = this.readyForBreakOutUsers.map((u) => {
          let tmp = JSON.parse(JSON.stringify(u))
          tmp.inRoom = true
          return tmp
        })
        readyUsers = Array.from(new Set([...users, ...readyUsers]))
        this.groupsInfo.unshift({
          id: DEFAULT_BREAKOUT_GROUP_ID,
          name: this.$vuetify.lang.t('$vuetify.meeting.mainGroupName'),
          type: 'group',
          children: readyUsers
        })
      }
    }
  },
  mounted() {
    this.meetingUserId = window.meetingRoomCore.userId
    this.mainGroupName = this.$vuetify.lang.t('$vuetify.meeting.mainGroupName')
    this.innerGroupCnt = this.groupCnt
    this.bindEvents()
    this.init()
  },
  methods: {
    ...mapMutations('meeting', ['setCurrentBreakoutGroup']),
    bindEvents() {
      window.meetingRoomCore.on(
        MeetingCoreRoomEvents.GROUP_ID_CHANGE,
        (roomId, userId, value) => {
          if (this.breakoutGroupStatus) {
            const groupsInfo = this.groupsInfo.map((g) => {
              g.children = g.children.filter((c) => c.id !== userId)
              return g
            })

            let user = this.breakoutList.find((u) => u.id === userId)
            if (user) {
              let idx = groupsInfo.findIndex((g) => g.id === value)
              if (idx !== -1) {
                groupsInfo[idx].children.push({
                  id: user.id,
                  extId: user.extId,
                  name: user.name,
                  avatar: user.avatar,
                  groupId: user.groupId,
                  inRoom: true
                })
              }
            }
            this.groupsInfo = groupsInfo
          }
        }
      )
    },
    init() {
      if (!this.breakoutGroupStatus) {
        let groups = []
        let startIdx = 0
        for (let i = 1; i <= this.innerGroupCnt; i++) {
          let group = {
            id: i,
            type: 'group',
            name: this.$vuetify.lang.t('$vuetify.meeting.newGroupName', i),
            children: []
          }
          if (this.autoAddAttendees) {
            if (startIdx < this.readyForBreakOutUsers.length) {
              let endIdx = startIdx + this.attendeesCntPerGroup
              endIdx =
                endIdx > this.readyForBreakOutUsers.length
                  ? this.readyForBreakOutUsers.length
                  : endIdx
              group.children = this.readyForBreakOutUsers.slice(startIdx, endIdx)
              startIdx = endIdx
            }
          }
          groups.push(group)
        }
        this.groupsInfo = groups
        if (this.autoAddAttendees) {
          this.$emit('clearReadyUsers')
        }
      } else {
        window.meetingRoomCore
          .getBreakoutGroupsDetail()
          .then(() => {
            const users = JSON.parse(
              JSON.stringify(
                this.breakoutList.map((u) => {
                  return {
                    ...u,
                    inRoom: false
                  }
                })
              )
            )
            const groupsInfo = window.meetingRoomCore.breakoutGroupsInfo.map((g) => {
              const children = g.users.reduce((prev, curr) => {
                let user = users.find((i) => i.extId === curr)
                if (user) {
                  user.inRoom = g.id === user.groupId
                  prev.push(user)
                }
                return prev
              }, [])
              return {
                id: g.id,
                name: g.name,
                type: 'group',
                children
              }
            })
            groupsInfo.unshift({
              id: DEFAULT_BREAKOUT_GROUP_ID,
              name: this.$vuetify.lang.t('$vuetify.meeting.mainGroupName'),
              type: 'group',
              children: this.breakoutList
                .filter((u) => u.groupId === DEFAULT_BREAKOUT_GROUP_ID)
                .map((u) => {
                  return {
                    ...u,
                    inRoom: true
                  }
                })
            })
            this.groupsInfo = groupsInfo
          })
          .catch((e) => {
            console.error(e)
          })
      }
    },
    onAddRoom() {
      this.innerGroupCnt++
      let group = {
        id: this.innerGroupCnt,
        type: 'group',
        name: this.$vuetify.lang.t('$vuetify.meeting.newGroupName', this.innerGroupCnt),
        children: []
      }
      this.groupsInfo.push(group)
    },
    onOpenAllRooms() {
      if (!window.meetingRoomCore) return
      this.$emit('overlay', true)
      const reqOpts = this.groupsInfo.map((r) => {
        return {
          id: r.id,
          name: r.name,
          users: r.children.map((c) => c.extId)
        }
      })

      window.meetingRoomCore
        .startBreakoutGroups(reqOpts)
        .then(() => {
          this.$emit('overlay', false)
        })
        .catch((e) => {
          console.error(e)
          this.$emit('overlay', false)
        })
    },
    showBroadcast() {
      this.showBroadcastToAllDlg = true
    },
    onBroadcastMessageToAll() {
      const msg = this.broadcastToAllMessage ? this.broadcastToAllMessage.Trim() : ''
      if (!msg) return
      // const tmp = {
      //   role: 'sender',
      //   content: msg,
      //   userName: window.meetingRoomCore.user.name
      // }
      window.meetingRoomCore.broadcastMessageToAllBreakoutGroups(msg)
      this.showBroadcastToAllDlg = false
    },
    onCloseAllRooms() {
      if (!window.meetingRoomCore) return
      return window.meetingRoomCore
        .stopBreakoutGroups()
        .then(() => {
          this.$emit('close')
        })
        .catch((e) => {
          console.error(e)
          this.$emit('close')
        })
    },
    onRenameRoom() {
      if (!this.currentRenameGroup) return
      if (
        !this.groupNewName ||
        (this.groupNewName && !this.groupNewName.toString().trim())
      ) {
        this.groupNewName = this.currentRenameGroup.name
      }
      const idx = this.groupsInfo.findIndex((g) => g.name === this.groupNewName)
      if (idx !== -1) {
        this.groupNewName = this.currentRenameGroup.name
        this.showSnackbarText = this.$vuetify.lang.t('$vuetify.meeting.haveExit')
        this.showSnackbar = true
        this.groupNewName = null
        this.currentRenameGroup = null
        this.showRenameDlg = false
      } else {
        const idx = this.groupsInfo.findIndex((g) => g.id === this.currentRenameGroup.id)
        if (idx !== -1) {
          this.groupsInfo[idx].name = this.groupNewName
        }
        this.groupNewName = null
        this.currentRenameGroup = null
        this.showRenameDlg = false
      }
    },
    onOpenRenameDlg(group) {
      this.showRenameDlg = true
      this.currentRenameGroup = group
      this.groupNewName = group.name
    },
    moveAndAddFun(item, type) {
      this.moveAddType = type
      if (type === 'add') {
        this.addUsers = this.readyForBreakOutUsers
        this.currentAddUserToGroup = item
        this.moveAndAddTitle = this.$vuetify.lang.t('$vuetify.meeting.addUsersToGroup')
      } else {
        this.moveAndAddTitle = this.$vuetify.lang.t('$vuetify.meeting.moveTo')
        this.moveUser = item
      }
      this.moveAndAddDialog = true
    },
    onDeleteRoom(item) {
      const idx = this.groupsInfo.findIndex((g) => g.id === item.id)
      if (idx !== -1) {
        const readyForBreakOutUsers = [
          ...this.readyForBreakOutUsers,
          ...this.groupsInfo[idx].children
        ]
        this.$emit('updateBreakoutUsers', readyForBreakOutUsers)
        this.groupsInfo.splice(idx, 1)
      }
    },
    getOtherGroups(uid, includeMain = false) {
      let groups = this.groupsInfo.filter((g) => {
        let idx = -1
        if (this.breakoutRoomStatus) {
          idx = g.children.findIndex((c) => c.id === uid && c.inRoom)
        } else {
          idx = g.children.findIndex((c) => c.id === uid)
        }
        return idx === -1
      })
      if (includeMain) {
        groups.unshift({
          id: 0,
          name: this.$vuetify.lang.t('$vuetify.meeting.mainGroupName'),
          children: this.readyForBreakOutUsers
        })
      }
      return groups
    },
    inviteAgain(user) {
      if (!window.meetingRoomCore) return
      const group = this.groupsInfo.find(
        (g) => g.children.findIndex((u) => u.id === user.id && !u.inRoom) !== -1
      )
      if (group) {
        window.meetingRoomCore
          .moveUserToOtherBreakoutGroup(group.id, user.id)
          .then(() => {
            this.showSnackbarText = this.$vuetify.lang.t(
              '$vuetify.meeting.inviteAgainSend'
            )
            this.showSnackbar = true
          })
          .catch((e) => {
            console.error(e)
          })
      }
    },
    isMemberExchangeEnable(uid) {
      const groups = this.groupsInfo.filter((g) => {
        const idx = g.children.findIndex((c) => c.id === uid)
        return idx === -1
      })
      if (groups.length === 0) return false
      let users = []
      groups.map((g) => {
        users = [...users, ...g.children]
      })
      return users.length !== 0
    },
    exchange(item) {
      this.exchangeGroupsList = this.getOtherGroups(item.id).filter(
        (i) => i.children.length > 0
      )
      this.exchangeDistRoom = this.groupsInfo.find((g) => {
        let idx = g.children.findIndex((c) => c.id === item.id)
        return idx === -1
      })
      this.exchangeUser = item
      this.exchangeDialog = true
    },
    showJoinBtn(group) {
      return (
        group.children.findIndex((g) => g.id === window.meetingRoomCore.user.id) === -1
      )
    },
    onJoinGroup(group) {
      const tmp = this.groupsInfo.find(
        (r) =>
          r.children.findIndex(
            (c) => c.id === window.meetingRoomCore.user.id && c.inRoom
          ) !== -1
      )
      if (tmp && tmp.id === group.id) return
      window.meetingRoomCore
        .moveUserToOtherBreakoutGroup(group.id)
        .then((_) => {
          this.setCurrentBreakoutGroup({ id: group.id, name: group.name })
          this.$emit('close')
        })
        .catch((e) => {
          console.error(e)
        })
    },
    isHost(uid) {
      const idx = this.breakoutList.findIndex(
        (u) =>
          u.id === uid &&
          (u.role === MeetingRole.Host || u.role === MeetingRole.Assistant)
      )
      return idx !== -1
    },
    onRemoveMemberFromRoom(user) {
      for (let i = 0; i < this.groupsInfo.length; i++) {
        const idx = this.groupsInfo[i].children.findIndex((u) => u.id === user.id)
        if (idx !== -1) {
          this.$emit('updateBreakoutUsers', [...this.readyForBreakOutUsers, user])
          this.groupsInfo[i].children.splice(idx, 1)
          break
        }
      }
    }
  }
}
</script>

<style lang="scss" scoped>
#group-detail {
}
.broadcast-message {
  ::v-deep .v-textarea {
    border-radius: 4px;
    border: 1px solid #eeeeee;
    padding: 0 10px;
  }
  ::v-deep .theme--light.v-text-field > .v-input__control > .v-input__slot:before {
    border-color: #ffffff;
  }
  ::v-deep .v-text-field > .v-input__control > .v-input__slot:after {
    border-color: #ffffff;
  }
  ::v-deep .v-text-field > .v-input__control > .v-input__slot:after {
    border: #fff;
  }
  ::v-deep .v-text-field > .v-input__control > .v-input__slot:before {
    border: #fff;
  }
}
</style>
