<template>
  <v-dialog v-model="showCopyInvitationDlg" width="500" attach="#meeting-win" persistent>
    <template #activator="{ on, attrs }">
      <section class="invite-btn">
        <v-btn
          v-bind="attrs"
          :ripple="false"
          min-width="70"
          height="56"
          value="Invite"
          class="pa-0 flex-column align-center"
          v-on="on"
        >
          <span class="normal-text title-center" style="padding-top: 2px">{{
            $vuetify.lang.t('$vuetify.meeting.invite')
          }}</span>
          <v-img
            class="bottom-bar-img"
            width="18"
            min-height="20"
            max-height="20"
            src="@/assets/bottom_btn/invite.png"
          />
        </v-btn>
      </section>
    </template>
    <v-card>
      <v-card-text
        style="height: 300px; user-select: auto; line-height: 20px"
        class="bigger-text pt-5"
        v-html="copyInvitationContentStr"
      />
      <v-card-actions>
        <v-spacer />
        <v-btn
          color="#127BF8"
          depressed
          min-width="80"
          height="30"
          outlined
          @click="showCopyInvitationDlg = false"
          >{{ $vuetify.lang.t('$vuetify.meeting.close') }}</v-btn
        >
        <v-btn
          :disabled="!copyInvitationContent"
          color="#127BF8"
          min-width="80"
          height="30"
          class="white--text"
          depressed
          @click="onCopyInvitation"
          >{{ $vuetify.lang.t('$vuetify.meeting.copy') }}</v-btn
        >
      </v-card-actions>
    </v-card>
    <v-snackbar
      v-model="showCopySnackbar"
      color="#000000cc"
      timeout="1500"
      style="min-width: 40px"
      centered
    >
      <span style="padding-left: 8px">{{
        $vuetify.lang.t('$vuetify.meeting.meetingIdCopy')
      }}</span>
    </v-snackbar>
  </v-dialog>
</template>

<script>
import { clipboard } from 'electron'
import { createInvitationMessage } from '../../../utils'
import { mapState } from 'vuex'

export default {
  name: 'BottomBarInviteWidget',
  data() {
    return {
      showCopyInvitationDlg: false,
      copyInvitationContent: '',
      showCopySnackbar: false
    }
  },
  computed: {
    ...mapState('meeting', ['meetingInfo', 'loginUserInfo']),
    copyInvitationContentStr() {
      return this.copyInvitationContent.replace(/\n/g, '<br>')
    }
  },
  watch: {
    showCopyInvitationDlg(val) {
      if (!val) {
        this.copyInvitationContent = ''
      } else {
        this.copyInvitationContent = createInvitationMessage(
          this.meetingInfo,
          this.loginUserInfo.username,
          this.$vuetify
        )
      }
    }
  },
  methods: {
    onCopyInvitation() {
      if (this.copyInvitationContent) {
        clipboard.writeText(this.copyInvitationContent)
        this.showCopySnackbar = true
      }
    }
  }
}
</script>

<style scoped></style>
