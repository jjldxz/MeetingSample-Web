<template>
  <v-dialog
    id="leave-meeting-dialog"
    v-model="showDlg"
    max-width="400"
    persistent
    attach="#meeting-win"
    no-click-animation
  >
    <v-card class="pt-3">
      <v-card-title class="leave-title pb-2">
        <span>{{ $vuetify.lang.t('$vuetify.meeting.endMeeting') }}</span>
      </v-card-title>
      <v-card-text class="leave-text pb-5">
        <span
          >{{
            isHost
              ? $vuetify.lang.t('$vuetify.meeting.hostEndOrLeaveText', meetingInfo.owner)
              : $vuetify.lang.t('$vuetify.meeting.conformLeave', meetingInfo.owner)
          }}
        </span>
      </v-card-text>
      <v-card-actions class="pl-10 pr-10 pb-5 d-flex justify-center">
        <v-btn
          color="#127BF8"
          height="30px"
          min-width="80px"
          outlined
          class="ml-5 mr-3"
          depressed
          @click="onCancel"
          ><span class="normal-text">{{
            $vuetify.lang.t('$vuetify.meeting.cancel')
          }}</span></v-btn
        >
        <v-btn
          v-show="isHost || isCoHost"
          :loading="closeWinLoading"
          color="#127BF8"
          height="30px"
          min-width="80px"
          class="white--text mr-3 ml-3"
          depressed
          @click="onEndMeeting"
          ><span class="normal-text">{{
            $vuetify.lang.t('$vuetify.meeting.endMeeting')
          }}</span></v-btn
        >
        <v-btn
          color="#127BF8"
          class="white--text mr-5 ml-3"
          height="30px"
          min-width="80px"
          depressed
          @click="onLeaveMeeting"
          ><span class="normal-text">{{
            $vuetify.lang.t('$vuetify.meeting.leaveMeeting')
          }}</span></v-btn
        >
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { mapState } from 'vuex'
import { IPCEvents } from '../../common'

export default {
  name: 'ExitMeeting',
  model: {
    prop: 'show',
    event: 'close'
  },
  props: {
    show: {
      type: Boolean,
      default() {
        return false
      }
    }
  },
  data() {
    return {
      closeWinLoading: false,
      showDlg: false
    }
  },
  computed: {
    ...mapState('meeting', ['meetingInfo', 'isHost', 'isCoHost'])
  },
  watch: {
    show(val) {
      this.showDlg = val
    }
  },
  mounted() {
    this.showDlg = this.show
  },
  methods: {
    leave() {
      if (window.meetingRoomCore) {
        window.meetingRoomCore.leave()
      }
    },
    onCancel() {
      this.$emit('close', false)
    },
    onLeaveEndMeeting() {
      window.close()
    },
    onEndMeeting() {
      this.closeWinLoading = true
      window.meetingRoomCore
        .stopMeeting()
        .then(() => {
          this.closeWinLoading = false
          this.$emit('close', false)
          window.ipc.send(IPCEvents.HOME.UPDATE_MEETING_LIST)
          this.leave()
          this.onLeaveEndMeeting()
        })
        .catch((e) => {
          console.error(e)
          this.$emit('close', false)
          this.onLeaveEndMeeting()
        })
    },
    async onLeaveMeeting() {
      this.$emit('close', false)
      this.leave()
      this.onLeaveEndMeeting()
    }
  }
}
</script>

<style lang="scss" scoped></style>
