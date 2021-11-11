<template>
  <div id="user-center">
    <v-menu
      v-model="showUserCenter"
      :close-on-content-click="false"
      :nudge-width="200"
      offset-y
    >
      <template #activator="{ on, attrs }">
        <v-avatar max-width="40" max-height="40">
          <v-img
            alt=""
            v-bind="attrs"
            max-width="40"
            max-height="40"
            class="default-user-avatar"
            style="cursor: pointer"
            :src="
              loginUserInfo.avatar
                ? loginUserInfo.avatar
                : require('@/assets/default-avatar.png')
            "
            v-on="on"
            @click="showUserCenter = true"
          />
        </v-avatar>
        <v-btn
          class="title-icon pl-0 pr-0"
          text
          height="20px"
          min-width="16px"
          @click="showUserCenter = true"
          ><span class="pl-2">{{ loginUserInfo.username | changeName }}</span></v-btn
        >
      </template>
      <div class="pb-4 user-center-main">
        <v-list dense>
          <v-list-item>
            <v-list-item-avatar>
              <v-img
                alt=""
                max-width="40"
                max-height="40"
                class="default-user-avatar"
                style="cursor: pointer"
                :src="
                  loginUserInfo.avatar
                    ? loginUserInfo.avatar
                    : require('@/assets/default-avatar.png')
                "
              />
            </v-list-item-avatar>
            <v-list-item-content>
              <v-list-item-title>{{
                loginUserInfo.username | changeName
              }}</v-list-item-title>
              <v-list-item-subtitle>{{ loginUserInfo.email }}</v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
        </v-list>
        <v-divider />
        <v-list flat dense>
          <v-list-item-group>
            <v-list-item @click="changePasswordDlg = true">
              <v-list-item-icon>
                <v-icon>mdi-lock-check</v-icon>
              </v-list-item-icon>
              <v-list-item-content>
                <v-list-item-title>Change Password</v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </v-list-item-group>
        </v-list>
        <v-divider />
        <div class="mt-4 flex-center">
          <v-btn color="error" min-width="60%" outlined @click="onLogout">{{
            $vuetify.lang.t('$vuetify.meeting.logout')
          }}</v-btn>
        </div>
      </div>
    </v-menu>
    <v-dialog v-model="changePasswordDlg" width="400">
      <div class="pl-4 pr-4 pt-8 pb-4" style="background-color: white">
        <v-form ref="changePdForm" v-model="changePdForm" :input-options="inputOptions">
          <div>
            <password-input
              v-model="oldPassword"
              :title="$vuetify.lang.t('$vuetify.meeting.oldPassword')"
              :placeholder="$vuetify.lang.t('$vuetify.meeting.enterOldPassword')"
              dense
            />
          </div>
          <div class="mt-4">
            <password-input
              v-model="newPassword"
              :title="$vuetify.lang.t('$vuetify.meeting.newPassword')"
              :placeholder="$vuetify.lang.t('$vuetify.meeting.enterNewPassword')"
              dense
            />
          </div>
          <div class="mt-4">
            <password-input
              v-model="repeatPassword"
              :confirm-password="newPassword"
              confirm
              dense
            />
          </div>
          <div class="flex-center">
            <v-btn
              color="#127BF8"
              class="white--text"
              min-width="60%"
              depressed
              :disabled="!changePdForm"
              @click="onChangePassword"
              >Confirm</v-btn
            >
          </div>
        </v-form>
      </div>
    </v-dialog>
  </div>
</template>

<script>
import { mapMutations, mapState } from 'vuex'
import PasswordInput from '../common/passwordInput'
import { ErrorCode } from '../../common/error'

export default {
  name: 'UserCenter',
  components: { PasswordInput },
  filters: {
    // 名字超过十位加...
    changeName(value) {
      if (value && value.length > 11) {
        return value.substr(0, 11) + '...'
      } else {
        return value
      }
    }
  },
  data() {
    return {
      oldPassword: null,
      newPassword: null,
      repeatPassword: null,
      showUserCenter: false,
      changePasswordDlg: false,
      changePdForm: false,
      inputOptions: {
        showDialCode: false,
        tabindex: 0
      }
    }
  },
  computed: {
    ...mapState('users', ['loginUserInfo'])
  },
  beforeMount() {
    window.meetingCore
      .getUserInfo()
      .then((resp) => {
        console.log(resp)
        this.$tmpStore.set('userInfo', resp)
        this.setLoginUserInfo(resp)
      })
      .catch((e) => {
        console.error(e)
      })
  },
  mounted() {},
  methods: {
    ...mapMutations('users', ['setLoginUserInfo']),
    onChangePassword() {
      window.meetingCore
        .changePassword(this.oldPassword, this.repeatPassword)
        .then(() => {
          this.changePasswordDlg = false
        })
        .catch((e) => {
          console.error(e)
          if (e && e.code === ErrorCode.TOKEN_EXPIRED) {
            this.$emit('error', this.$vuetify.lang.t('$vuetify.meeting.tokenExpired'))
          } else {
            this.$notify({
              title: this.$vuetify.lang.t('$vuetify.meeting.error'),
              body: this.$vuetify.lang.t('$vuetify.meeting.changePasswordFailed')
            })
          }
        })
    },
    onLogout() {
      this.$emit('logout')
    }
  }
}
</script>

<style lang="scss" scoped>
#user-center {
  .title-icon {
    img {
      width: auto;
      height: auto;
    }
  }
}
.user-center-main {
  background-color: white;
}
</style>
