<template>
  <div id="home">
    <app-bar
      :on-close="onAppClose"
      :title="$vuetify.lang.t('$vuetify.meeting.appTitle')"
    />
    <div class="mt-2 pl-5 pr-5">
      <div class="flex-h-space-between">
        <user-center @logout="logoutDlg = true" />
        <v-icon @click="onOpenSettings">mdi-cog-outline</v-icon>
      </div>
      <div class="mt-6">
        <buttons-list @error="onError($event)" />
      </div>
    </div>
    <v-divider />
    <div class="meeting-list-area">
      <meetings-list @error="onError($event)" />
    </div>
    <!-- logout dialog  -->
    <v-dialog v-model="logoutDlg" max-width="265">
      <v-card width="265">
        <v-card-title class="justify-center">
          <span style="color: #424242; font-size: 16px">{{
            $vuetify.lang.t('$vuetify.meeting.logout')
          }}</span>
        </v-card-title>
        <v-card-text class="text-center">
          <span style="color: #666; font-size: 14px">{{
            $vuetify.lang.t('$vuetify.meeting.loginOutNotice')
          }}</span>
        </v-card-text>
        <v-card-actions class="pl-10 pr-10 pb-5 d-flex justify-space-between">
          <v-btn
            color="#127BF8"
            height="30px"
            min-width="80px"
            outlined
            depressed
            @click="logoutDlg = false"
            ><span class="normal-text">{{
              $vuetify.lang.t('$vuetify.meeting.cancel')
            }}</span></v-btn
          >
          <v-btn
            color="#127BF8"
            class="white--text"
            height="30px"
            min-width="80px"
            depressed
            @click="onLogout"
            ><span class="normal-text">{{
              $vuetify.lang.t('$vuetify.meeting.confirm')
            }}</span></v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-snackbar v-model="showErrorNotice" :timeout="-1" :value="true" centered>
      {{ noticeMessage }}
      <template v-if="errorNoticeBtn" #action="{ attrs }">
        <!-- eslint-disable-next-line vue/max-attributes-per-line -->
        <v-btn class="light-blue" v-bind="attrs" text depressed @click="onLogout">
          {{ $vuetify.lang.t('$vuetify.meeting.logout') }}
        </v-btn>
      </template>
    </v-snackbar>
  </div>
</template>

<script>
import AppBar from '../components/common/appBar'
import UserCenter from '../components/home/userCenter'
import ButtonsList from '../components/home/buttonsList/buttonsList'
import MeetingsList from '../components/home/meetingsList'
import { IPCEvents } from '../common'
import { checkMeetingAlive } from '../utils'

export default {
  name: 'Home',
  components: { AppBar, UserCenter, ButtonsList, MeetingsList },
  data() {
    return {
      logoutDlg: false,
      noticeMessage: null,
      showErrorNotice: false,
      errorNoticeBtn: true
    }
  },
  methods: {
    onOpenSettings() {
      window.ipc.send(IPCEvents.OPEN_SETTING_WIN)
    },
    onAppClose() {
      window.close()
    },
    onLogout() {
      if (checkMeetingAlive()) {
        this.$notify({
          title: this.$vuetify.lang.t('$vuetify.meeting.notification'),
          body: this.$vuetify.lang.t('$vuetify.meeting.closeWindowBeforeLogout')
        })
      } else {
        this.$tmpStore.set('meetingInfo', {})
        this.$tmpStore.set('userInfo', {})
        this.$tmpStore.set('authToken', null)
        this.$tmpStore.set('refreshToken', null)
        this.$router.push({ path: '/' })
      }
    },
    onError(message, needButton = true) {
      this.noticeMessage = message
      this.errorNoticeBtn = needButton
      this.showErrorNotice = true
    }
  }
}
</script>
<style lang="scss" scoped>
#home {
  height: 100%;
  .meeting-list-area {
    -webkit-app-region: no-drag;
    position: absolute;
    top: 190px;
    bottom: 0;
    overflow-y: auto;
  }
}
</style>
