<template>
  <div id="login-win">
    <app-bar :title="$vuetify.lang.t('$vuetify.meeting.appTitle')" />
    <component :is="currentComponent" @goTo="onGoTo" />
  </div>
</template>

<script>
import LoginMain from '../components/login/loginMain'
import LoginWithUserName from '../components/login/login'
import SignUp from '../components/login/signUp'
import AppBar from '../components/common/appBar'
import createMeetingCore from '../composables/createMeetingCoreInst'

export default {
  name: 'Login',
  components: { LoginMain, LoginWithUserName, SignUp, AppBar },
  setup(props, context) {
    const { meetingCore } = createMeetingCore()
    window.meetingCore = meetingCore
    return { meetingCore }
  },
  data() {
    return {
      currentComponent: LoginMain
    }
  },
  methods: {
    onMinApp() {},
    onCloseApp() {
      window.close()
    },
    onGoTo(component) {
      this.currentComponent = component
    }
  }
}
</script>

<style lang="scss" scoped>
#login-win {
}
</style>
