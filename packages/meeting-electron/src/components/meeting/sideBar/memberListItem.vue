<template>
  <v-hover id="item-user" v-slot="{ hover }">
    <v-list-item class="pt-0 pl-2 pr-3" dense>
      <v-list-item-avatar size="40" class="mr-2">
        <img
          alt
          class="default-user-avatar"
          :src="avatar ? avatar : require('@/assets/default-avatar.png')"
        />
      </v-list-item-avatar>
      <v-list-item-content class="pt-0 pb-0">
        <v-list-item-title class="pb-2">
          <span class="big-text">{{ name }}</span>
        </v-list-item-title>
        <v-list-item-subtitle style="color: #999999">{{
          roleList.length > 0 ? `(${roleList.join(',')})` : ''
        }}</v-list-item-subtitle>
      </v-list-item-content>
      <v-list-item-action style="display: -webkit-inline-box">
        <div class="flex-center d-flex align-end justify-end">
          <img
            v-show="hand"
            alt
            width="14px"
            height="18px"
            src="@/assets/hand_color.png"
            class="mr-2"
          />
          <v-icon v-show="share" size="21" class="mr-2">mdi-monitor-dashboard</v-icon>
          <div class="flex-center" style="justify-content: flex-end">
            <v-img
              class="mr-2"
              max-width="16"
              width="14"
              height="18"
              max-height="18"
              :src="audio ? require('@/assets/unmute.png') : require('@/assets/mute.png')"
            />
            <v-img
              alt=""
              width="18px"
              height="14px"
              :src="
                video
                  ? require('@/assets/bottom_btn/video.png')
                  : require('@/assets/bottom_btn/close_video.png')
              "
            />
          </div>
        </div>
      </v-list-item-action>
      <div v-show="hover" class="flex-center" style="position: absolute; right: 2px">
        <v-btn
          v-show="isHost || isCoHost || isMe"
          color="#127bf8"
          class="white--text pl-2 pr-2 mr-2"
          depressed
          small
          @click="onChangeAudio"
          >{{
            audio
              ? $vuetify.lang.t('$vuetify.meeting.mute')
              : $vuetify.lang.t('$vuetify.meeting.unmute')
          }}</v-btn
        >
        <v-menu
          v-model="showRenameDlg"
          :close-on-content-click="false"
          attach="#item-user"
        >
          <template #activator="{ on, attrs }">
            <v-btn
              v-if="isHost || isCoHost || isMe"
              v-bind="attrs"
              color="#127bf8"
              class="white--text pl-2 pr-2 mr-2"
              depressed
              small
              v-on="on"
              >{{ $vuetify.lang.t('$vuetify.meeting.rename') }}</v-btn
            >
          </template>
          <v-card>
            <v-card-text class="flex-center pa-2">
              <v-text-field
                v-model="userNewName"
                :placeholder="name"
                hide-details
                autofocus
                dense
              >
                <template #append-outer>
                  <v-btn
                    :disabled="!userNewName || (userNewName && userNewName.length > 10)"
                    class="white--text"
                    color="#127bf8"
                    depressed
                    small
                    @click="onRename"
                    >{{ $vuetify.lang.t('$vuetify.meeting.confirm') }}</v-btn
                  >
                </template>
              </v-text-field>
            </v-card-text>
          </v-card>
        </v-menu>
        <v-menu offset-x>
          <template #activator="{ on, attrs }">
            <v-btn
              v-show="moreShow()"
              v-bind="attrs"
              color="#127bf8"
              class="white--text"
              depressed
              small
              v-on="on"
              >{{ $vuetify.lang.t('$vuetify.meeting.more') }} ></v-btn
            >
          </template>
          <v-list class="pa-0 pt-2 pb-2" dense>
            <v-list-item v-if="isHost" class="pl-2 pr-2">
              <v-btn
                color="#127bf8"
                class="white--text"
                min-width="90"
                depressed
                small
                block
                @click="switchCoHostRole"
              >
                {{
                  role === RoleType.Assistant
                    ? $vuetify.lang.t('$vuetify.meeting.cancelCoHost')
                    : $vuetify.lang.t('$vuetify.meeting.setCoHost')
                }}
              </v-btn>
            </v-list-item>
            <v-list-item class="pl-2 pr-2 pt-1">
              <v-btn
                color="#127bf8"
                class="white--text"
                min-width="90"
                depressed
                small
                block
                @click="onKickOut"
                >{{ $vuetify.lang.t('$vuetify.meeting.remove') }}</v-btn
              >
            </v-list-item>
          </v-list>
        </v-menu>
      </div>
    </v-list-item>
  </v-hover>
</template>

<script>
import { mapState } from 'vuex'
import { MeetingRole } from '@/common'
import MeetingCore from '@jjldxz/meeting-core-electron'

const MeetingCoreRoomEvents = MeetingCore.MeetingCoreEvents.Room

export default {
  name: 'MemberListItem',
  props: {
    user: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  data() {
    return {
      RoleType: MeetingRole,
      audio: false,
      video: false,
      hand: false,
      share: false,
      isDesktop: false,
      isMe: false,
      role: null,
      name: null,
      avatar: null,
      roleList: [],
      showRenameDlg: false,
      userNewName: null,
      hover: false
    }
  },
  computed: {
    ...mapState('meeting', ['isHost', 'isCoHost'])
  },
  mounted() {
    this.init()
    // if (window.meetingRoomCore) {
    //   this.init()
    // } else {
    //   const timer = setInterval(() => {
    //     if (window.meetingRoomCore) {
    //       clearInterval(timer)
    //       this.init()
    //     }
    //   }, 50)
    // }
  },
  methods: {
    bindEvents() {
      window.meetingRoomCore.on(
        MeetingCoreRoomEvents.VIDEO_CHANGE,
        (roomId, uid, state) => {
          if (this.user.id === uid) {
            this.video = state
          }
        }
      )
      window.meetingRoomCore.on(
        MeetingCoreRoomEvents.AUDIO_CHANGE,
        (roomId, uid, state) => {
          if (this.user.id === uid) {
            this.audio = state
          }
        }
      )
      window.meetingRoomCore.on(
        MeetingCoreRoomEvents.HAND_CHANGE,
        (roomId, uid, state) => {
          if (this.user.id === uid) {
            this.hand = state
          }
        }
      )
      window.meetingRoomCore.on(
        MeetingCoreRoomEvents.SHARE_CHANGE,
        (roomId, uid, state) => {
          if (this.user.id === uid) {
            this.share = state !== 'none'
          } else if (this.share) {
            this.share = false
          }
          this.isDesktop = state === 'desktop' && window.meetingRoomCore.user.id === uid
          if (state === 'none') {
            this.$emit('popStatus')
          }
          this.remoteCtlColor = '#127bf8'
          this.isRemoteCtl = false
        }
      )
      window.meetingRoomCore.on(
        MeetingCoreRoomEvents.NAME_CHANGE,
        (roomId, uid, name) => {
          if (uid === this.user.id && name) {
            this.name = name
          }
        }
      )
      window.meetingRoomCore.on(
        MeetingCoreRoomEvents.ROLE_CHANGE,
        (roomId, uid, role) => {
          if (uid === this.user.id) {
            this.role = role
            if (this.role === MeetingRole.Attendee) {
              this.roleList = this.roleList.filter(
                (role) => role !== this.$vuetify.lang.t('$vuetify.meeting.coHost')
              )
            } else {
              this.roleList.push(this.$vuetify.lang.t('$vuetify.meeting.coHost'))
            }
          }
        }
      )
      window.meetingRoomCore.on(
        MeetingCoreRoomEvents.AVATAR_CHANGE,
        (roomId, uid, avatar) => {
          if (uid === this.user.id && avatar) {
            this.avatar = avatar
          }
        }
      )
    },
    init() {
      this.bindEvents()
      this.video = !!this.user.state.video
      this.role = this.user.role
      if (this.role === MeetingRole.Host) {
        this.roleList.push(this.$vuetify.lang.t('$vuetify.meeting.host'))
      } else if (this.role === MeetingRole.Assistant) {
        this.roleList.push(this.$vuetify.lang.t('$vuetify.meeting.coHost'))
      }

      this.audio = !!this.user.state.audio
      if (this.user.id === window.meetingRoomCore.user.id) {
        this.roleList.push(this.$vuetify.lang.t('$vuetify.meeting.me'))
        this.isMe = true
      } else {
        this.isMe = false
        // if (window.meeting.shareType === 'desktop') {
        //   this.isDesktop = true
        //   this.remoteCtlColor = '#127bf8'
        // }
      }
      this.share = this.user.state.share !== 'none'
      this.hand = !!this.user.state.hand
      this.name = this.user.name
      this.avatar = this.user.avatar
    },
    onChangeAudio() {
      if (!window.meetingRoomCore) return
      window.meetingRoomCore.changeAudio(!this.audio, this.user.id)
    },
    onRename() {
      if (!window.meetingRoomCore || !this.userNewName) return
      window.meetingRoomCore
        .changeUserName(this.userNewName, this.user.id)
        .then(() => {
          this.userNewName = null
          this.showRenameDlg = false
        })
        .catch((e) => console.error(e))
    },
    switchCoHostRole() {
      const role =
        this.role === MeetingRole.Attendee ? MeetingRole.Assistant : MeetingRole.Attendee
      window.meetingRoomCore.changeUserRole(role, this.user.id)
    },
    moreShow() {
      return (
        (this.isHost || (this.isCoHost && this.role !== MeetingRole.Host)) && !this.isMe
      )
    },
    onKickOut() {
      if (!window.meetingRoomCore) return
      window.meetingRoomCore.kickOut(this.user.id)
    }
  }
}
</script>

<style scoped></style>
