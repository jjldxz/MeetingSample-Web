<template>
  <div id="join-meeting">
    <v-card class="flex-space-h">
      <app-bar :on-close="onClose" :minus-btn="false" />
      <v-card-text>
        <v-form ref="joinMeetingForm" v-model="joinMeetingForm">
          <div class="meeting-id">
            <v-subheader class="pl-0">{{
              $vuetify.lang.t('$vuetify.meeting.meetingId')
            }}</v-subheader>
            <v-text-field
              id="inputMeetingId"
              v-model="meetingID"
              :rules="meetingIdRules"
              :placeholder="$vuetify.lang.t('$vuetify.meeting.enterMeetingId')"
              outlined
              flat
              dense
              type="text"
              color="#cccccc"
              clear
              autofocus
              validate-on-blur
              oninput="value = value = String(value).substr(0, 11)"
              @input="onMeetingIdChange"
            />
          </div>
          <div>
            <v-subheader class="pl-0">{{
              $vuetify.lang.t('$vuetify.meeting.yourName')
            }}</v-subheader>
            <v-text-field
              v-model="userName"
              class="mt-2"
              color="#cccccc"
              :placeholder="$vuetify.lang.t('$vuetify.meeting.enterYourDisplayName')"
              autocomplete="off"
              :rules="userNameRules"
              outlined
              flat
              dense
            />
          </div>
          <div class="content-bottom">
            <v-subheader class="pl-0" style="height: 25px">{{
              $vuetify.lang.t('$vuetify.meeting.meetingSetting')
            }}</v-subheader>
            <v-checkbox
              v-model="needAudio"
              class="mt-0"
              color="#127BF8"
              dense
              hide-details
              off-icon="mdi-square"
            >
              <template #label>
                <div style="font-size: 12px; color: #333333">
                  {{ $vuetify.lang.t('$vuetify.meeting.connectAudio') }}
                </div>
              </template>
            </v-checkbox>
            <v-checkbox
              v-model="needVideo"
              class="mt-0"
              color="#127BF8"
              dense
              hide-details
              off-icon="mdi-square"
            >
              <template #label>
                <div style="font-size: 12px; color: #333333">
                  {{ $vuetify.lang.t('$vuetify.meeting.turnOnVideo') }}
                </div>
              </template>
            </v-checkbox>
          </div>
        </v-form>
      </v-card-text>
      <v-card-actions class="flex-center card-btn">
        <v-btn
          :disabled="!joinMeetingForm"
          class="white--text"
          width="45%"
          depressed
          color="#127BF8"
          block
          large
          @click="onJoinMeeting"
          >{{ $vuetify.lang.t('$vuetify.meeting.joinMeeting') }}</v-btn
        >
      </v-card-actions>
    </v-card>
  </div>
</template>

<script>
import { formatMeetingID } from '../../../utils'
import { CustomEvents, IPCEvents } from '../../../common'
import { ErrorCode } from '../../../common/error'
import { mapState } from 'vuex'
import AppBar from '../../common/appBar'

export default {
  name: 'JoinMeeting',
  components: { AppBar },
  data() {
    return {
      meetingID: null,
      joinMeetingForm: false,
      userName: null,
      needAudio: true,
      needVideo: false,
      meetingIdRules: [
        (v) => !!v || this.$vuetify.lang.t('$vuetify.meeting.enterMeetingId'),
        (v) => {
          const temp = typeof v === 'string' ? v : v ? v.id.toString() : ''
          return (
            temp.length === 11 || this.$vuetify.lang.t('$vuetify.meeting.meetingIdDigit')
          )
        }
      ],
      userNameRules: [
        (v) => !!v || this.$vuetify.lang.t('$vuetify.meeting.enterYourDisplayName'),
        (v) =>
          ((v && v.Trim()) || '').length > 0 ||
          this.$vuetify.lang.t('$vuetify.meeting.enterYourDisplayName')
      ]
    }
  },
  computed: {
    ...mapState('users', ['loginUserInfo'])
  },
  methods: {
    formatMeetingID(id) {
      if (!id) return ''
      return formatMeetingID(id)
    },
    onClose() {
      this.$refs.joinMeetingForm.resetValidation()
      this.needAudio = true
      this.needVideo = false
      this.meetingID = null
      this.userName = null
      this.$emit('close')
    },
    onJoinMeeting() {
      const meetingId = this.meetingID.split(' ').join('')
      window.meetingCore
        .getMeetingInfo(meetingId)
        .then((resp) => {
          console.log(resp)
          this.$tmpStore.set('meetingInfo', resp)
          this.$tmpStore.set('videoMute', !this.needVideo)
          this.$tmpStore.set('audioMute', !this.needAudio)
          this.$tmpStore.set(
            'userName',
            this.userName ? this.userName : this.loginUserInfo.username
          )
          window.ipc.send(IPCEvents.OPEN_MEETING_WIN)
          this.$eventBus.$emit(CustomEvents.UPDATE_MEETING_LIST)
          this.$emit('close')
        })
        .catch((e) => {
          console.error(e)
          if (e && e.code === ErrorCode.TOKEN_EXPIRED) {
            this.$emit('error', this.$vuetify.lang.t('$vuetify.meeting.tokenExpired'))
          } else {
            this.$notify({
              title: this.$vuetify.lang.t('$vuetify.meeting.error'),
              body: this.$vuetify.lang.t('$vuetify.meeting.joinMeetingFail')
            })
          }
        })
    },
    onMeetingIdChange(value) {
      value = value.toString().replace(/\s+/g, '')
      this.meetingID = formatMeetingID(value)
    }
  }
}
</script>

<style lang="scss" scoped>
@import '../../../styles/variables';
#join-meeting {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  .back-btn {
    margin: 5px 0 0 5px;
  }
  ::v-deep .v-input--selection-controls__ripple {
    color: #fff !important;
  }
  ::v-deep .v-text-field--outlined {
    color: #cccccc !important;
  }
  ::v-deep .v-card__text {
    padding: 5px 30px;
    color: #666666;
    .v-subheader {
      font-size: 12px !important;
      margin-bottom: 4px;
    }
  }
  ::v-deep .v-sheet.v-card:not(.v-sheet--outlined) {
    box-shadow: none;
  }
  ::v-deep .mdi-square {
    color: #eeeeee;
  }
  ::v-deep .v-text-field--placeholder {
    font-size: 14px !important;
  }
  ::v-deep .v-text-field__details {
    padding-left: 0;
    padding-top: 3px;
  }
  .meeting-id {
    ::v-deep .v-input__append-inner {
      display: none;
    }
  }
  .card-btn {
    margin: 0 22px 12px 22px;
    ::v-deep .theme--light.v-btn.v-btn--disabled {
      background: #cfe5fe !important;
      color: #ffffff !important;
    }
  }
  .content-bottom {
    ::v-deep .v-icon {
      font-size: 18px !important;
    }
  }
}
</style>
