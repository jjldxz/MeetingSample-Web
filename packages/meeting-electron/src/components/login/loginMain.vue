<template>
  <div id="login-main" class="pt-6">
    <v-btn
      text
      class="flex-v-end-h-center meeting-img pl-0 white--text"
      min-width="20px"
      height="20px"
      @click="openSettings"
    >
      <v-img
        max-height="18"
        max-width="16"
        min-height="18"
        min-width="16"
        src="@/assets/setting.svg"
      />
    </v-btn>
    <div class="flex-center">
      <div class="logo-pc"><img alt src="logo_pc.svg" /></div>
    </div>
    <div class="flex-center">
      <div class="meeting-title-center font-weight-bold">
        {{ $vuetify.lang.t('$vuetify.meeting.appTitle') }}
      </div>
    </div>
    <div class="ml-6 mr-6">
      <div class="mt-16">
        <!-- eslint-disable-next-line vue/max-attributes-per-line -->
        <v-btn color="#127BF8" block depressed large dark @click="onJoinMeeting">
          {{ $vuetify.lang.t('$vuetify.meeting.joinMeeting') }}
        </v-btn>
      </div>
      <div class="mt-4">
        <!-- eslint-disable-next-line vue/max-attributes-per-line -->
        <v-btn color="#127BF8" block depressed large outlined @click="onLogin">
          {{ $vuetify.lang.t('$vuetify.meeting.signUpAndLogin') }}
        </v-btn>
      </div>
    </div>
  </div>
</template>

<script>
import { IPCEvents } from '../../common'

export default {
  name: 'LoginMain',
  methods: {
    openSettings() {
      window.ipc.send(IPCEvents.OPEN_SETTING_WIN)
    },
    onJoinMeeting() {},
    onLogin() {
      this.$emit('goTo', 'LoginWithUserName')
    }
  }
}
</script>

<style lang="scss" scoped>
#login-main {
  height: 100%;
  -webkit-app-region: no-drag;
  display: flex;
  flex-direction: column;
  .meeting-img {
    padding-right: 30px;
    padding-top: 3px;
  }
  .logo-pc {
    height: 47.3px;
    margin-top: 62px;
    img {
      width: auto;
      height: auto;
    }
  }
  .meeting-title-center {
    font-size: 20px;
    color: #333333;
    margin-top: 18px;
  }
  .meeting-title-en-center {
    color: #333333;
    margin-bottom: 40px;
  }
}
</style>
