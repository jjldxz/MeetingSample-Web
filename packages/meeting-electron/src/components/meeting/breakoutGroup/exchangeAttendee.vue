<template>
  <v-dialog
    id="exchangeDialog"
    v-model="exchangeDialog"
    width="520"
    hide-overlay
    persistent
    scrollable
    z-index="30"
  >
    <v-card class="move-add">
      <v-card-text class="pa-0" style="height: 435px">
        <v-system-bar color="white" height="56px" class="pl-2 pr-5">
          <v-btn icon class="pa-0" @click="exchangeDialog = false">
            <img alt src="@/assets/back.svg" />
          </v-btn>
          <v-spacer />
          <span class="group-title">{{
            $vuetify.lang.t('$vuetify.meeting.exchange')
          }}</span>
          <v-spacer />
        </v-system-bar>
        <v-divider />
        <v-list class="pt-1" dense>
          <v-radio-group v-model="exchangeUser" class="pa-0">
            <section v-for="(g, j) in exchangeGroups" :key="j" class="pb-7">
              <div class="d-flex">
                <div class="change-group-name pl-5">{{ g.name }}</div>
                <div class="change-group-title pl-1">
                  ({{
                    $vuetify.lang.t(
                      '$vuetify.meeting.groupPeopleNumber',
                      g.children ? g.children.length : 0
                    )
                  }})
                </div>
              </div>
              <v-list-item v-for="(u, i) in g.children" :key="i" class="pa-0">
                <v-list-item-content class="pr-5" max-height="40">
                  <div class="d-flex">
                    <v-radio color="#127BF8" class="mb-0 pl-5" label="" :value="u" />
                    <div class="d-flex align-center">
                      <v-avatar size="26" width="26" height="26" class="ml-1 mr-2">
                        <v-img
                          alt=""
                          width="26"
                          height="26"
                          class="default-user-avatar"
                          :src="
                            u.avatar ? u.avatar : require('@/assets/default-avatar.png')
                          "
                        />
                      </v-avatar>
                      <div class="normal-text">{{ u.name }}</div>
                    </div>
                  </div>
                </v-list-item-content>
              </v-list-item>
            </section>
          </v-radio-group>
        </v-list>
      </v-card-text>
      <v-card-actions class="mb-1 btn-action">
        <v-spacer />
        <v-btn
          color="#127BF8"
          height="30"
          min-width="80"
          outlined
          class="mr-5"
          @click="exchangeDialog = false"
          ><span class="normal-text">{{
            $vuetify.lang.t('$vuetify.meeting.cancel')
          }}</span></v-btn
        >
        <v-btn
          color="#127BF8"
          height="30"
          min-width="80"
          class="white--text"
          :disabled="!exchangeUser"
          depressed
          @click="onMemberExchange"
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
  name: 'ExchangeAttendees',
  model: {
    prop: 'show',
    event: 'close'
  },
  props: {
    show: {
      type: Boolean,
      default: false
    },
    groupsInfo: {
      type: Array,
      default() {
        return []
      }
    },
    user: {
      type: Object,
      default() {
        return {}
      }
    },
    distRoom: {
      type: Object,
      default() {
        return {}
      }
    },
    exchangeGroups: {
      type: Array,
      default() {
        return []
      }
    }
  },
  data() {
    return {
      exchangeDialog: false,
      exchangeUser: null
    }
  },
  watch: {
    show(val) {
      this.exchangeDialog = val
    },
    exchangeDialog(val) {
      if (!val) {
        this.exchangeUser = null
        this.$emit('close', false)
      }
    }
  },
  mounted() {
    this.exchangeDialog = this.show
  },
  methods: {
    onMemberExchange() {
      let srcUser = this.user
      let distUser = this.exchangeUser
      let distRoom = this.distRoom
      console.log(srcUser, distUser, distRoom)
      const srcGroupIdx = this.groupsInfo.findIndex(
        (g) => g.children.findIndex((u) => u.id === srcUser.id) !== -1
      )
      const distGroupIdx = this.groupsInfo.findIndex((g) => g.id === distRoom.id)
      if (srcGroupIdx !== -1 && distGroupIdx !== -1) {
        let srcGroupsUsers = this.groupsInfo[srcGroupIdx].children.filter(
          (c) => c.id !== srcUser.id
        )
        srcGroupsUsers.push(distUser)

        let distGroupUsers = this.groupsInfo[distGroupIdx].children.filter(
          (c) => c.id !== distUser.id
        )
        distGroupUsers.push(srcUser)

        let groupsInfo = JSON.parse(JSON.stringify(this.groupsInfo))
        groupsInfo[srcGroupIdx].children = srcGroupsUsers
        groupsInfo[distGroupIdx].children = distGroupUsers
        this.$emit('updateGroupsInfo', groupsInfo)
        this.$nextTick(function () {
          this.$emit('updateGroupsTree', true)
        })
      }
      this.exchangeDialog = false
      this.exchangeUser = null
    }
  }
}
</script>

<style scoped></style>
