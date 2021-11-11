<template>
  <div id="sign-up">
    <div class="mt-2">
      <v-btn icon @click="onBackToPreviousPage">
        <img alt src="@/assets/back.svg" />
      </v-btn>
    </div>
    <v-form ref="signForm" v-model="signForm" :input-options="inputOptions">
      <div class="ml-6 mr-6 mt-12">
        <div>
          <v-text-field
            v-model="userName"
            :placeholder="$vuetify.lang.t('$vuetify.meeting.enterUserName')"
            :rules="[rules.required]"
            clearable
            persistent-placeholder
            flat
          >
            <template slot="label" class="mb-2">
              <span class="title">{{ $vuetify.lang.t('$vuetify.meeting.name') }}</span>
            </template>
          </v-text-field>
        </div>
        <div class="mt-6">
          <password-input v-model="password" />
        </div>
        <div class="mt-6">
          <password-input v-model="repeatPassword" confirm :confirm-password="password" />
        </div>
        <div class="mt-2">
          <v-checkbox
            v-model="agreement"
            class="user-policy-checkbox ma-0 pa-0"
            :rules="[rules.required]"
            hide-details
          >
            <template #label>
              {{ $vuetify.lang.t('$vuetify.meeting.readAndAgree') }}&nbsp;
              <a href="#" @click.stop.prevent="showPolicyDialog = true">{{
                $vuetify.lang.t('$vuetify.meeting.UserAgreement')
              }}</a>
              &nbsp;{{ $vuetify.lang.t('$vuetify.meeting.and') }}&nbsp;
              <a href="#" @click.stop.prevent="showPolicyDialog = true">{{
                $vuetify.lang.t('$vuetify.meeting.privacyPolicy')
              }}</a>
            </template>
          </v-checkbox>
        </div>
        <div class="mt-6">
          <!-- eslint-disable-next-line vue/max-attributes-per-line -->
          <v-btn
            class="white--text"
            color="#127BF8"
            block
            depressed
            large
            :disabled="!signForm"
            @click="onSignUp"
          >
            {{ $vuetify.lang.t('$vuetify.meeting.signUp') }}
          </v-btn>
        </div>
      </div>
    </v-form>
    <v-dialog v-model="showSignUpSuccessDlg" persistent>
      <v-card>
        <v-card-title>
          {{ $vuetify.lang.t('$vuetify.meeting.registerSuccess') }}
        </v-card-title>
        <v-card-text>
          {{ $vuetify.lang.t('$vuetify.meeting.loginLater') }}
        </v-card-text>
        <v-card-actions>
          <v-btn
            block
            color="light-blue"
            depressed
            elevation="0"
            @click.stop.prevent="onExitSignUpSuccessDlg"
            >{{ $vuetify.lang.t('$vuetify.meeting.ok') }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import PasswordInput from '../common/passwordInput'

export default {
  name: 'SignUp',
  components: { PasswordInput },
  data() {
    return {
      userName: null,
      password: null,
      repeatPassword: null,
      signForm: false,
      inputOptions: {
        showDialCode: false,
        tabindex: 0
      },
      showPassword: false,
      showRepeatPassword: false,
      agreement: false,
      rules: {
        length: (min, max) => (v) =>
          ((v || '').length >= min && (v || '').length <= max) ||
          this.$vuetify.lang.t('$vuetify.meeting.charLengthRangeCHeck', min, max),
        password: (v) =>
          !!(v || '').match(
            /^(?=.*[0-9].*)(?=.*[A-Z].*)(?=.*[a-z].*).{8,16}$/
            ///^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*(_|[^\w])).+$/
          ) || this.$vuetify.lang.t('$vuetify.meeting.passwordRule'),
        required: (v) => !!v || this.$vuetify.lang.t('$vuetify.meeting.required'),
        match: (v) =>
          this.password === v || this.$vuetify.lang.t('$vuetify.meeting.passwordNotMatch')
      },
      showPolicyDialog: false,
      showSignUpSuccessDlg: false
    }
  },
  methods: {
    onBackToPreviousPage() {
      this.$emit('goTo', 'LoginWithUserName')
    },
    onSignUp() {
      window.meetingCore
        .signUp(this.userName, this.password)
        .then(() => {
          this.$tmpStore.set('authToken', window.meetingCore.token)
          this.$tmpStore.set('refreshToken', window.meetingCore.refreshToken)
          this.$router.push({ name: 'Home' })
        })
        .catch((e) => {
          console.error(e)
        })
    },
    onExitSignUpSuccessDlg() {
      this.showSignUpSuccessDlg = false
      this.onBackToPreviousPage()
    }
  }
}
</script>

<style lang="scss" scoped>
#sign-up {
  .title {
    font-size: 1.5rem !important;
    line-height: inherit;
    padding-bottom: 5px;
  }
  .user-policy-checkbox {
    ::v-deep .v-label {
      display: block !important;
      font-size: 12px !important;
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
