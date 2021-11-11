<template>
  <div id="meeting-with-password" class="meeting-password flex-center">
    <v-card width="350">
      <v-card-title class="justify-center">{{
        $vuetify.lang.t('$vuetify.meeting.joinMeetingPassword')
      }}</v-card-title>
      <v-card-text class="mt-2">
        <v-form v-model="meetingPasswordValid">
          <password-input v-model="meetingPassword" />
        </v-form>
      </v-card-text>
      <v-divider />
      <v-card-actions class="d-flex align-end pl-0 pr-0 pt-0 pb-0 justify-space-between">
        <v-btn
          class="btn-left mr-0"
          depressed
          height="38"
          color="#ffff"
          width="175"
          tile
          @click="onClose"
          >{{ $vuetify.lang.t('$vuetify.meeting.cancel') }}</v-btn
        >
        <v-divider vertical />
        <v-btn
          :disabled="!meetingPasswordValid"
          class="mr-0"
          depressed
          height="38"
          width="174"
          color="#ffff"
          tile
          @click="onJoin"
          ><span class="pt-0 mb-0" style="color: #127bf8">{{
            $vuetify.lang.t('$vuetify.meeting.joinMeeting')
          }}</span></v-btn
        >
      </v-card-actions>
    </v-card>
  </div>
</template>

<script>
import PasswordInput from '../common/passwordInput'
import { CustomEvents } from '../../common'

export default {
  name: 'MeetingWithPassword',
  components: { PasswordInput },
  data() {
    return {
      meetingPasswordValid: false,
      meetingPassword: null
    }
  },
  methods: {
    onClose() {
      this.$eventBus.$emit(CustomEvents.CLOSE_MEETING)
    },
    onJoin() {
      this.$emit('goTo', 'MeetingRoom', { password: this.meetingPassword })
    }
  }
}
</script>

<style lang="scss" scoped>
#meeting-with-password {
  width: 100%;
  height: 100%;
  .meeting-password {
    -webkit-app-region: no-drag;
  }
}
</style>
