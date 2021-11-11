<template>
  <div id="home-buttons-list" class="d-flex justify-space-between">
    <div class="d-flex flex-column align-center">
      <v-hover>
        <v-dialog v-model="joinMeetingDlg">
          <template #activator="{ attrs, on }">
            <v-btn
              v-bind="attrs"
              color="#127BF8"
              class="radius-icon"
              width="44"
              height="44"
              min-width="44"
              depressed
              v-on="on"
            >
              <v-img
                alt=""
                max-width="44"
                max-height="44"
                src="@/assets/join_meeting.png"
              />
            </v-btn>
          </template>
          <join-meeting @close="joinMeetingDlg = false" @error="onError($event)" />
        </v-dialog>
      </v-hover>
      <div>
        <p class="button-title-font">
          {{ $vuetify.lang.t('$vuetify.meeting.join') }}
        </p>
      </div>
    </div>
    <div class="d-flex flex-column align-center">
      <v-hover>
        <v-btn
          color="#127BF8"
          class="radius-icon"
          width="44"
          height="44"
          min-width="44"
          depressed
          text
          @click="onStartMeeting"
        >
          <v-img alt="" max-width="44" max-height="44" src="@/assets/quick_meeting.png" />
        </v-btn>
      </v-hover>
      <div>
        <p class="button-title-font">
          {{ $vuetify.lang.t('$vuetify.meeting.start') }}
        </p>
      </div>
    </div>
    <div class="d-flex flex-column align-center">
      <v-hover>
        <v-dialog v-model="scheduleMeetingDlg" persistent>
          <template #activator="{ attrs, on }">
            <v-btn
              v-bind="attrs"
              color="#127BF8"
              class="radius-icon"
              width="44"
              height="44"
              min-width="44"
              depressed
              v-on="on"
            >
              <v-img
                alt=""
                max-width="44"
                max-height="44"
                src="@/assets/schedule_meeting.png"
              />
            </v-btn>
          </template>
          <schedule-meeting
            @close="scheduleMeetingDlg = false"
            @error="onError($event)"
          />
        </v-dialog>
      </v-hover>
      <div>
        <p class="button-title-font">
          {{ $vuetify.lang.t('$vuetify.meeting.scheduledMeeting') }}
        </p>
      </div>
    </div>
  </div>
</template>

<script>
import moment from 'moment-timezone'
import JoinMeeting from './joinMeeting'
import ScheduleMeeting from './scheduleMeeting'
import { CustomEvents, IPCEvents, TIME_ZONE } from '../../../common'
import { mapState } from 'vuex'
import { checkMeetingAlive } from '../../../utils'
import { ErrorCode } from '../../../common/error'

export default {
  name: 'ButtonsList',
  components: { JoinMeeting, ScheduleMeeting },
  data() {
    return {
      joinMeetingDlg: false,
      scheduleMeetingDlg: false
    }
  },
  computed: {
    ...mapState('users', ['loginUserInfo'])
  },
  methods: {
    onStartMeeting() {
      if (checkMeetingAlive()) {
        this.$notify({
          title: this.$vuetify.lang.t('$vuetify.meeting.notification'),
          body: this.$vuetify.lang.t('$vuetify.meeting.closeWindow')
        })
        return
      }
      const meetingName = this.$vuetify.lang.t(
        '$vuetify.meeting.quickMeetingTopic',
        this.loginUserInfo.username
      )
      const startTime = moment().tz(TIME_ZONE).utc().format()
      const endTime = moment.tz(TIME_ZONE).utc().add(2, 'hours').format()
      window.meetingCore
        .createMeeting(meetingName, startTime, endTime, { muteType: 0 })
        .then((resp) => {
          this.$eventBus.$emit(CustomEvents.UPDATE_MEETING_LIST)
          return window.meetingCore.getMeetingInfo(resp.number)
        })
        .then((resp) => {
          this.$tmpStore.set('meetingInfo', resp)
          this.$tmpStore.set('videoMute', true)
          this.$tmpStore.set('audioMute', false)
          this.$tmpStore.set('userName', this.loginUserInfo.username)
          window.ipc.send(IPCEvents.OPEN_MEETING_WIN)
        })
        .catch((e) => {
          console.error(e)
          if (e && e.code === ErrorCode.TOKEN_EXPIRED) {
            this.$emit('error', this.$vuetify.lang.t('$vuetify.meeting.tokenExpired'))
          } else {
            this.$notify({
              title: this.$vuetify.lang.t('$vuetify.meeting.error'),
              body: this.$vuetify.lang.t('$vuetify.meeting.meetingCreatedFail')
            })
          }
        })
    },
    onError(message, needButton = true) {
      this.$emit('error', message, needButton)
    }
  }
}
</script>

<style lang="scss" scoped>
#home-buttons-list {
  .radius-icon {
    border-radius: 50% !important;
    span {
      div {
        border-radius: 50% !important;
      }
    }
  }
  .button-title-font {
    padding-top: 10px !important;
    text-align: center;
    text-transform: capitalize;
  }
}
</style>
