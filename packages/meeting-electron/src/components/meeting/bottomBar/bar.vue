<template>
  <div id="meeting-bottom-bar" class="pb-1">
    <v-bottom-navigation class="bottom-bar" height="56" :input-value.sync="show">
      <!-- Local audio control  -->
      <v-btn
        :ripple="false"
        value="SwitchAudio"
        class="pl-1 pr-1"
        min-width="70"
        @click="onSwitchAudio"
      >
        <span class="normal-text title-center">{{
          audioMute
            ? $vuetify.lang.t('$vuetify.meeting.unmute')
            : $vuetify.lang.t('$vuetify.meeting.mute')
        }}</span>
        <v-img
          class="bottom-bar-img"
          width="18"
          min-height="18"
          max-height="18"
          :src="
            audioMute
              ? require('@/assets/bottom_btn/mute.png')
              : require('@/assets/bottom_btn/unmute.png')
          "
        />
      </v-btn>
      <!-- Local video control  -->
      <v-btn
        :ripple="false"
        value="SwitchVideo"
        class="pl-1 pr-1"
        min-width="70"
        @click="onSwitchVideo"
      >
        <span class="normal-text title-center" style="padding-top: 1px">{{
          videoMute
            ? $vuetify.lang.t('$vuetify.meeting.startWithVideo')
            : $vuetify.lang.t('$vuetify.meeting.closeWithVideo')
        }}</span>
        <v-img
          class="bottom-bar-img"
          width="18"
          min-height="16"
          max-height="16"
          :src="
            videoMute
              ? require('@/assets/bottom_btn/close_video.png')
              : require('@/assets/bottom_btn/video.png')
          "
        />
      </v-btn>
      <!-- Share  -->
      <share-widget />
      <!-- Invite  -->
      <copy-invite-widget />
      <!-- Open attendees side bar  -->
      <v-btn
        ref="bottomBarAttendees"
        :ripple="false"
        value="Attendees"
        class="pl-1 pr-1 flex-column align-center"
        min-width="70"
        height="56"
        @click="onClickAttendees"
      >
        <span class="normal-text title-center">
          {{ $vuetify.lang.t('$vuetify.meeting.attendees') }}({{ attendeesCount.value }})
        </span>
        <img
          alt=""
          class="bottom-bar-img"
          width="18"
          height="18"
          src="@/assets/bottom_btn/supervisor.png"
        />
      </v-btn>
      <!-- Open chat side bar  -->
      <v-btn
        :ripple="false"
        value="Chat"
        class="pl-1 pr-1"
        height="56"
        min-width="70"
        @click="onClickChat"
      >
        <v-badge
          :value="newMsgCount"
          :content="newMsgCount"
          color="error"
          bordered
          overlap
        >
          <div class="d-flex flex-column align-center">
            <img
              alt=""
              class="bottom-bar-img"
              width="18"
              height="18"
              src="@/assets/bottom_btn/chat.png"
            />
            <span class="normal-text title-center">{{
              $vuetify.lang.t('$vuetify.meeting.chat')
            }}</span>
          </div>
        </v-badge>
      </v-btn>
      <reaction />
      <more-widget />
      <div class="flex-center ml-5 mr-4">
        <v-btn
          v-if="
            !breakoutGroupStatus ||
            (currentBreakoutGroup && currentBreakoutGroup.id === 0)
          "
          height="30px"
          outlined
          style="border-color: red; border-radius: 5px"
          min-width="80"
          @click="onLeaveMeeting"
          ><span class="red--text normal-text">{{
            isHost || isCoHost
              ? $vuetify.lang.t('$vuetify.meeting.endMeeting')
              : $vuetify.lang.t('$vuetify.meeting.leaveMeeting')
          }}</span></v-btn
        >
        <v-btn
          v-else
          height="30px"
          style="border-color: red; border-radius: 5px"
          min-width="80"
          outlined
          @click="onLeaveGroup"
        >
          <span class="red--text normal-text">{{
            $vuetify.lang.t('$vuetify.meeting.leaveGroup')
          }}</span>
        </v-btn>
      </div>
    </v-bottom-navigation>
  </div>
</template>

<script>
import { mapState, mapGetters, mapMutations } from 'vuex'
import ShareWidget from './share'
import CopyInviteWidget from './invite'
import Reaction from './reaction'
import MoreWidget from './more'
import { CustomEvents, DEFAULT_BREAKOUT_GROUP_ID } from '../../../common'
import MeetingUsers from '../../../composables/meetingUsers'

export default {
  name: 'MeetingBottomBar',
  components: {
    ShareWidget,
    CopyInviteWidget,
    Reaction,
    MoreWidget
  },
  props: {
    show: {
      type: Boolean,
      default() {
        return true
      }
    },
    newMsgCount: {
      type: Number,
      default() {
        return 0
      }
    }
  },
  setup(props, content) {
    const { attendeesCount } = MeetingUsers(content.root.$store)
    return { attendeesCount }
  },
  data() {
    return {
      sRecording: false,
      recordLoading: false,
      reaction: false
    }
  },
  computed: {
    ...mapState('meeting', [
      'isHost',
      'isCoHost',
      'meetingAudioMute',
      'audioMute',
      'videoMute',
      'breakoutGroupStatus',
      'currentBreakoutGroup'
    ])
  },
  methods: {
    ...mapMutations('meeting', ['setSideBarType', 'setCurrentBreakoutGroup']),
    onSwitchAudio() {
      if (!window.meetingRoomCore) return
      if (
        this.isHost ||
        this.isCoHost ||
        !this.meetingAudioMute ||
        window.meetingRoomCore.enableAudioChange
      ) {
        window.meetingRoomCore.switchAudio()
      }
    },
    onSwitchVideo() {
      if (!window.meetingRoomCore) return
      window.meetingRoomCore
        .switchVideo()
        .then()
        .catch((e) => {
          console.error(e)
        })
    },
    onClickAttendees() {
      this.setSideBarType('MeetingMemberList')
    },
    onClickChat() {
      this.setSideBarType('MeetingChat')
    },
    reactionClick() {
      this.reaction = !this.reaction
      // setTimeout(() => {
      //   this.reaction = false
      // }, 10000)
    },
    onLeaveMeeting() {
      this.$eventBus.$emit(CustomEvents.SHOW_MEETING_LEAVE_DIALOG)
    },
    onLeaveGroup() {
      window.meetingRoomCore
        .moveUserToOtherBreakoutGroup(DEFAULT_BREAKOUT_GROUP_ID)
        .then(() => {
          this.setCurrentBreakoutGroup({
            id: DEFAULT_BREAKOUT_GROUP_ID,
            name: this.$vuetify.lang.t('$vuetify.meeting.mainGroupName')
          })
        })
        .catch((e) => {
          console.error(e)
        })
    }
  }
}
</script>

<style lang="scss" scoped>
#meeting-bottom-bar {
  .bottom-bar {
    transition: max-width 0.4s;
    box-shadow: none;
    z-index: 1;
    display: flex;
    justify-content: space-around;
    padding: 0 20px;
    .bottom-navigation-item {
      padding: 0;
      min-width: 60px;
      span {
        font-size: 12px;
      }
    }
    .bottom-bar-img {
      margin-bottom: 4.5px;
    }
    .transcribe-box {
      width: 14px;
      height: 14px;
      position: absolute;
      top: 5px;
      right: 3px;
    }
    .transcribe {
      // position: absolute;
      // top: 11px;
      // right: 5px;
    }
    .arrows-bottom {
      -webkit-transition: 0.5s;
      transition: 0.5s;
      -webkit-transform: rotate(0deg);
      transform: rotate(0deg);
    }
    .arrows-top {
      -webkit-transition: 0.5s;
      transition: 0.5s;
      -webkit-transform: rotate(180deg);
      transform: rotate(180deg);
    }
  }
}
</style>
