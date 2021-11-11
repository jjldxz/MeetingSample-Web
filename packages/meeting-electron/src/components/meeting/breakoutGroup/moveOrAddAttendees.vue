<template>
  <v-dialog
    id="move-or-add-dialog"
    v-model="moveAndAddDialog"
    width="520"
    hide-overlay
    persistent
    scrollable
  >
    <v-card class="move-add">
      <v-card-text class="pa-0" style="height: 435px">
        <v-system-bar color="white" height="56px" class="pl-2 pr-5">
          <v-btn icon class="pa-0" @click="$emit('close', false)">
            <img alt src="@/assets/back.svg" />
          </v-btn>
          <v-spacer />
          <span class="group-title">{{ title }}</span>
          <v-spacer />
        </v-system-bar>
        <v-divider />
        <v-radio-group
          v-if="operation.indexOf('move') > -1"
          v-model="moveAndAddValue"
          class="mt-1 ml-5 mr-5"
        >
          <v-radio
            v-for="(g, i) in getOtherGroups(moveUser.id)"
            :key="i"
            color="#127BF8"
            class="mb-3"
            :value="g"
            style="font-size: 14px !important"
            :label="g.name"
          />
        </v-radio-group>
        <div v-if="operation === 'add'" class="mt-1 ml-5 mr-5">
          <v-checkbox
            v-for="(g, i) in addUsers"
            :key="i"
            v-model="moveAndAddValue"
            color="#127BF8"
            class="mb-3"
            :value="g"
          >
            <template slot="label">
              <v-avatar size="26" class="ml-0 mr-2">
                <v-img
                  alt
                  width="26"
                  height="26"
                  :src="g.avatar ? g.avatar : require('@/assets/default-avatar.png')"
                />
              </v-avatar>
              <div class="normal-text">{{ g.name }}</div>
            </template>
          </v-checkbox>
        </div>
      </v-card-text>
      <v-card-actions class="mb-1 btn-action">
        <v-spacer />
        <v-btn
          color="#127BF8"
          height="30"
          min-width="80"
          outlined
          class="mr-5"
          @click="$emit('close', false)"
          ><span class="normal-text">{{
            $vuetify.lang.t('$vuetify.meeting.cancel')
          }}</span></v-btn
        >
        <v-btn
          color="#127BF8"
          height="30"
          min-width="80"
          class="white--text"
          :disabled="moveAndAddValue.length === 0"
          depressed
          @click="moveAndAddConfirm"
          ><span class="normal-text">{{
            $vuetify.lang.t('$vuetify.meeting.ok')
          }}</span></v-btn
        >
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  name: 'MoveOrAddAttendees',
  model: {
    prop: 'show',
    event: 'close'
  },
  props: {
    show: {
      type: Boolean,
      default: false
    },
    title: {
      type: String,
      default() {
        return ''
      }
    },
    addUsers: {
      type: Array,
      default() {
        return []
      }
    },
    moveUser: {
      type: Object,
      default() {
        return {}
      }
    },
    addToGroup: {
      type: Object,
      default: null
    },
    operation: {
      type: String,
      default: 'add'
    },
    groupsInfo: {
      type: Array,
      default() {
        return []
      }
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
      moveAndAddDialog: false,
      moveAndAddValue: []
    }
  },
  watch: {
    show(val) {
      this.moveAndAddDialog = val
    },
    moveAndAddDialog(val) {
      if (!val) {
        this.moveAndAddValue = []
      }
    }
  },
  methods: {
    getOtherGroups(uid, includeMain = false) {
      return this.$parent.getOtherGroups(uid, includeMain)
    },
    onMemberMoveTo() {
      let user = this.moveUser
      let group = this.moveAndAddValue
      let groupsInfo = JSON.parse(JSON.stringify(this.groupsInfo))
      let srcGid, distGid
      for (let i = 0; i < groupsInfo.length; i++) {
        const children = groupsInfo[i].children
        for (let j = 0; j < children.length; j++) {
          if (children[j].id === user.id) {
            srcGid = groupsInfo[i].id
            groupsInfo[i].children.splice(j, 1)
            break
          }
        }
      }
      let idx = groupsInfo.findIndex((g) => g.id === group.id)
      if (idx !== -1) {
        distGid = this.groupsInfo[idx].id
        groupsInfo[idx].children.push(user)
      }
      this.$emit('updateGroupsInfo', groupsInfo)
      this.$nextTick(function () {
        this.$emit('updateGroupsTree', true)
      })
      this.$emit('close', false)
      this.moveAndAddValue = []
    },
    onAddUsersToGroup() {
      if (!this.addToGroup) return
      let userList = Array.isArray(this.moveAndAddValue)
        ? this.moveAndAddValue
        : [this.moveAndAddValue]
      const idx = this.groupsInfo.findIndex((g) => g.id === this.addToGroup.id)
      if (idx !== -1) {
        let groupsInfo = JSON.parse(JSON.stringify(this.groupsInfo))
        groupsInfo[idx].children = [...this.groupsInfo[idx].children, ...userList]
        this.$emit('updateGroupsInfo', groupsInfo)
        const readyForBreakOutUsers = this.readyForBreakOutUsers.filter(
          (u) => userList.findIndex((s) => s.id === u.id) === -1
        )
        this.$emit('updateBreakoutUsers', readyForBreakOutUsers)
      }
      this.$emit('close', false)
      this.$nextTick(function () {
        this.$emit('updateGroupsTree', true)
      })
    },
    onMoveUserToOtherRoomRequest(user, room) {
      if (!window.meetingRoomCore) return
      const tmp = this.groupsInfo.find(
        (r) => r.children.findIndex((c) => c.id === user.id && c.inRoom) !== -1
      )
      if (tmp && tmp.id === room.id) return

      window.meetingRoomCore
        .moveUserToOtherBreakoutGroup(room.id, user.id)
        .then(() => {
          const roomIndex = this.groupsInfo.findIndex(
            (g) => g.children.findIndex((u) => u.id === user.id && !u.inRoom) !== -1
          )
          const idx = this.groupsInfo.findIndex((r) => r.id === room.id)
          if (idx !== -1) {
            let tmpUser = { ...user }
            tmpUser.inRoom = false
            let groupsInfo = JSON.parse(JSON.stringify(this.groupsInfo))
            const uIdx =
              roomIndex !== -1
                ? groupsInfo[roomIndex].children.findIndex((c) => c.id === user.id)
                : -1
            if (uIdx !== -1) {
              groupsInfo[roomIndex].children.splice(uIdx, 1)
              groupsInfo[idx].children.push(tmpUser)
            } else {
              groupsInfo[idx].children.push(tmpUser)
            }
            this.$emit('updateGroupsInfo', groupsInfo)
            this.$emit('close', false)
          }
          this.$nextTick(function () {
            this.$emit('updateGroupsTree', true)
          })
        })
        .catch((e) => {
          console.error(e)
        })
    },
    moveAndAddConfirm() {
      if (this.operation === 'add') {
        this.onAddUsersToGroup()
      } else {
        if (this.operation === 'move-start') {
          let user = this.moveUser
          let group = this.moveAndAddValue
          this.onMoveUserToOtherRoomRequest(user, group)
        } else {
          this.onMemberMoveTo()
        }
      }
    }
  }
}
</script>

<style scoped></style>
