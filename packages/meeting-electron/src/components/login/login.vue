<template>
  <div id="login-view">
    <div class="mt-2">
      <v-btn icon @click="onBackToPreviousPage">
        <img alt src="@/assets/back.svg" />
      </v-btn>
    </div>
    <div class="ml-6 mr-6 mt-12">
      <v-form ref="loginForm" v-model="loginForm" :input-options="inputOptions">
        <div>
          <v-text-field
            v-model="userName"
            :placeholder="$vuetify.lang.t('$vuetify.meeting.enterUserName')"
            :rules="[rules.required]"
            clearable
            persistent-placeholder
            flat
            autofocus
          >
            <template slot="label" class="mb-2">
              <span class="title">{{ $vuetify.lang.t('$vuetify.meeting.name') }}</span>
            </template>
          </v-text-field>
        </div>
        <div class="mt-6">
          <password-input v-model="password" />
        </div>
      </v-form>
      <div class="mt-6">
        <!-- eslint-disable-next-line vue/max-attributes-per-line -->
        <v-btn
          class="white--text"
          color="#127BF8"
          block
          depressed
          large
          :disabled="!loginForm"
          @click="onLogin"
        >
          {{ $vuetify.lang.t('$vuetify.meeting.joinMeeting') }}
        </v-btn>
      </div>
      <div class="mt-2 flex-h-space-between login-btns">
        <v-checkbox
          v-model="rememberPassword"
          color="#127BF8"
          :label="$vuetify.lang.t('$vuetify.meeting.rememberPassword')"
          hide-details
          off-icon="mdi-square"
          dense
        />
        <v-btn :ripple="false" text @click="onSignUp">{{
          $vuetify.lang.t('$vuetify.meeting.signUp')
        }}</v-btn>
      </div>
    </div>
  </div>
</template>

<script>
import PasswordInput from '../common/passwordInput'

export default {
  name: 'LoginWithUserName',
  components: { PasswordInput },
  data() {
    return {
      userName: null,
      password: null,
      showPassword: false,
      rememberPassword: false,
      rules: {
        length: (min, max) => (v) =>
          ((v || '').length >= min && (v || '').length <= max) ||
          this.$vuetify.lang.t('$vuetify.meeting.charLengthRangeCHeck', min, max),
        password: (v) =>
          !!(v || '').match(
            /^(?=.*[0-9].*)(?=.*[A-Z].*)(?=.*[a-z].*).{8,16}$/
            ///^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*(_|[^\w])).+$/
          ) || this.$vuetify.lang.t('$vuetify.meeting.passwordRule'),
        required: (v) => !!v || this.$vuetify.lang.t('$vuetify.meeting.required')
      },
      loginForm: false,
      inputOptions: {
        showDialCode: false,
        tabindex: 0
      }
    }
  },
  methods: {
    onBackToPreviousPage() {
      this.$emit('goTo', 'LoginMain')
    },
    onLogin() {
      window.meetingCore
        .login(this.userName, this.password)
        .then(() => {
          this.$tmpStore.set('authToken', window.meetingCore.token)
          this.$tmpStore.set('refreshToken', window.meetingCore.refreshToken)
          this.$router.push({ name: 'Home' })
        })
        .catch((e) => {
          console.error(e)
        })
    },
    onSignUp() {
      this.$emit('goTo', 'SignUp')
    }
  }
}
</script>

<style lang="scss" scoped>
#login-view {
  .title {
    font-size: 1.5rem !important;
    line-height: inherit;
    padding-bottom: 5px;
  }
  .for-btn {
    font-size: 12px;
    color: #666666;
  }
  .login-btns {
    ::v-deep .v-label {
      font-size: 12px;
      color: #333333;
    }
    ::v-deep .v-icon {
      font-size: 18px !important;
    }
    ::v-deep .v-btn.v-size--x-small {
      font-size: 12px;
      padding: 0;
    }
  }
}
</style>
