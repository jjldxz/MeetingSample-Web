<template>
  <div class="poll-detail">
    <poll-title
      :minus="false"
      :title="$vuetify.lang.t('$vuetify.meeting.poll')"
      @onBackToPreviousPage="onBackToPreviousPage"
      @onClose="onClose"
    />
    <section class="child">
      <v-row class="pb-4 pl-8 pr-8">
        <v-col cols="12" class="d-flex justify-space-between">
          <div
            class="bigger-text"
            style="flex: 1; font-weight: 700; font-size: 14px; color: #333"
          >
            {{ pollResult.title }}
          </div>
        </v-col>
      </v-row>
      <div class="label">
        <v-btn outlined x-small color="#f8f8f8" class="mr-1">
          <span style="color: #999" class="normal-text">{{
            pollResult.is_anonymous
              ? $vuetify.lang.t('$vuetify.meeting.anonymous')
              : $vuetify.lang.t('$vuetify.meeting.nonAnonymous')
          }}</span></v-btn
        >
      </div>
      <v-list flat class="overflow-x-hidden list-content">
        <div v-for="(q, index) in pollResult.questions" :key="index">
          <v-list-item :ripple="false" class="pa-0">
            <v-list-item-content class="pt-3 pb-3">
              <div class="d-flex justify-space-between align-center">
                <div class="content">{{ index + 1 }}. {{ q.content }}</div>
                <div class="choose">
                  {{
                    q.isSingle == true
                      ? $vuetify.lang.t('$vuetify.meeting.singleChoice')
                      : $vuetify.lang.t('$vuetify.meeting.multipleChoice')
                  }}
                </div>
              </div>
              <v-radio-group v-if="q.isSingle" v-model="q.select" class="mt-2 content-p">
                <v-radio
                  v-for="(o, i) in q.options"
                  :key="i"
                  :label="o.content"
                  :value="o.id"
                  :disabled="btnDisabled || isHost"
                  color="#127BF8"
                />
              </v-radio-group>
              <div v-if="!q.isSingle" class="mt-2 content-p">
                <v-checkbox
                  v-for="(o, i) in q.options"
                  :key="i"
                  v-model="q.select"
                  class="pa-0 mb-0"
                  color="#127BF8"
                  :label="o.content"
                  :disabled="btnDisabled || isHost || isCoHost"
                  :value="o.id"
                />
              </div>
            </v-list-item-content>
          </v-list-item>
        </div>
      </v-list>
    </section>
    <div
      v-if="!btnDisabled && !isHost && !isCoHost && pollStatus === 1"
      class="pa-4 d-flex justify-center"
    >
      <v-btn
        color="#127BF8"
        height="30px"
        min-width="80px"
        outlined
        depressed
        @click="onBackToPreviousPage"
        ><span class="normal-text">{{
          $vuetify.lang.t('$vuetify.meeting.back')
        }}</span></v-btn
      >
      <div style="width: 30px" />
      <v-btn
        color="#127BF8"
        height="30px"
        min-width="80px"
        class="white--text"
        @click="submit()"
        >{{ $vuetify.lang.t('$vuetify.meeting.submit') }}</v-btn
      >
      <!--参会者才能提交-->
    </div>
    <div
      v-if="!btnDisabled && (isHost || isCoHost) && pollStatus === 0"
      style="width: 330px; margin-left: 120px"
      class="pa-4 d-flex justify-space-between"
    >
      <v-btn
        color="#127BF8"
        height="30px"
        min-width="80px"
        outlined
        depressed
        @click="onBackToPreviousPage"
        >{{ $vuetify.lang.t('$vuetify.meeting.back') }}</v-btn
      >
      <v-btn
        color="#127BF8"
        depressed
        class="white--text"
        height="30px"
        min-width="80px"
        @click="publish"
        ><span class="normal-text">{{
          $vuetify.lang.t('$vuetify.meeting.publishPoll')
        }}</span></v-btn
      >
      <div class="d-flex align-center row-content send-chat">
        <!-- eslint-disable-next-line vue/max-attributes-per-line -->
        <v-menu v-model="menuValue" offset-y max-height="200" nudge-top="10" top>
          <template #activator="{ on, attrs }">
            <v-btn
              v-bind="attrs"
              class="white--text"
              color="#127BF8"
              height="30px"
              min-width="80px"
              v-on="on"
              @click="selectSendUserFlag = !selectSendUserFlag"
            >
              <span>{{ $vuetify.lang.t('$vuetify.meeting.more') }}</span>
              <v-icon :class="menuValue ? ' clockwise' : ''" color="#ffffff">
                mdi-menu-down
              </v-icon>
            </v-btn>
          </template>
          <v-list class="pa-0" min-width="120" max-width="150">
            <v-list-item
              v-for="(item, index) in optionsList"
              :key="index"
              style="min-height: 30px"
              color="#127BF8"
              :input-value="tabIndex === index"
              @click="changeOptions(item.value)"
            >
              <v-list-item-content class="pa-1">{{ item.name }}</v-list-item-content>
            </v-list-item>
          </v-list>
        </v-menu>
      </div>
    </div>
    <v-snackbar
      v-model="showSnackbar"
      color="#000000cc"
      centered
      min-width="80"
      timeout="1500"
    >
      {{ showSnackbarText }}
    </v-snackbar>
    <v-overlay :value="getDateLoading" :opacity="0.5">
      <v-progress-circular color="light-blue" indeterminate size="48" />
    </v-overlay>
    <!-- 已终止提交弹窗 -->
    <v-dialog
      v-model="showStopPollDlg"
      hide-overlay
      persistent
      no-click-animation
      max-width="400"
    >
      <v-card width="400">
        <v-card-title class="justify-center align-center">
          <span>{{ $vuetify.lang.t('$vuetify.meeting.prompt') }}</span>
          <img
            src="@/assets/close.svg"
            alt=""
            style="position: absolute; right: 20px"
            @click="closePoll"
          />
        </v-card-title>
        <v-card-text class="text-center">
          <span>{{ $vuetify.lang.t('$vuetify.meeting.pollFailed') }}</span>
        </v-card-text>
        <v-card-actions class="pl-10 pr-10 pb-5 d-flex justify-center">
          <v-btn
            color="#127BF8"
            class="white--text"
            height="30px"
            min-width="80px"
            @click="closePoll"
            ><span class="normal-text">{{
              $vuetify.lang.t('$vuetify.meeting.back')
            }}</span></v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>
    <!-- 删除投票弹窗 -->
    <v-dialog v-model="showDelePollDlg" max-width="400">
      <v-card width="400">
        <v-card-title class="justify-center align-center">
          <span>{{ $vuetify.lang.t('$vuetify.meeting.delPoll') }}</span>
          <img
            src="@/assets/close.svg"
            alt=""
            style="position: absolute; right: 20px"
            @click="showDelePollDlg = false"
          />
        </v-card-title>
        <v-card-text class="text-center">
          <span style="font-size: 14px; color: #a3a3a3">{{
            $vuetify.lang.t('$vuetify.meeting.deletePollConfirm')
          }}</span>
        </v-card-text>
        <v-card-actions class="pl-10 pr-10 pb-5 d-flex justify-center">
          <v-btn
            color="#127BF8"
            height="30px"
            min-width="80px"
            outlined
            depressed
            @click="showDelePollDlg = false"
            ><span class="normal-text">{{
              $vuetify.lang.t('$vuetify.meeting.cancel')
            }}</span></v-btn
          >
          <div style="width: 25px" />
          <v-btn
            color="#127BF8"
            class="white--text"
            height="30px"
            min-width="80px"
            @click="deletePoll"
            ><span class="normal-text">{{
              $vuetify.lang.t('$vuetify.meeting.confirm')
            }}</span></v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import pollTitle from './pollTitle.vue'
import { mapState, mapMutations } from 'vuex'
import { CustomEvents, PollType } from '@/common'

export default {
  name: 'PollDetail',
  components: {
    pollTitle
  },
  props: {
    pollFlag: {
      type: Boolean
    },
    pollId: {
      type: Number
    },
    btnDisabled: {
      type: Boolean
    },
    pollStatus: {
      type: Number
    }
  },
  data() {
    return {
      tabIndex: 0,
      fromMeeting: true,
      showSnackbarText: '',
      showSnackbar: false,
      unEdit: false,
      getDateLoading: false,
      pollResult: {},
      pollCommitInfo: {
        poll_id: this.pollId,
        questions: []
      },
      menuValue: false,
      selectSendUserFlag: false,
      // 更多选项
      optionsList: [
        { name: this.$vuetify.lang.t('$vuetify.meeting.editPoll'), value: '0' },
        { name: this.$vuetify.lang.t('$vuetify.meeting.delPoll'), value: '1' }
      ],
      // 显示删除投票弹窗
      showDelePollDlg: false,
      // 显示投票终止的弹窗
      showStopPollDlg: false
    }
  },
  computed: {
    ...mapState('user', ['loginUserInfo']),
    ...mapState('meeting', ['isHost', 'isCoHost', 'meetingId'])
  },
  watch: {
    pollFlag(newName) {
      if (newName) {
        this.pollDetail()
      }
    }
  },
  mounted() {
    this.pollDetail()
  },
  methods: {
    ...mapMutations('meeting', ['setPollVoted']),
    // 停止投票的弹窗
    closePoll() {
      this.showStopPollDlg = false
    },
    // 编辑/删除投票选项
    changeOptions(val) {
      if (val === '1') {
        this.tabIndex = 1
        this.showDelePollDlg = true
        let timer = setTimeout(() => {
          this.tabIndex = 0
          clearTimeout(timer)
        }, 500)
      } else {
        this.$emit('linkTo', 'pollEdit', this.pollId)
      }
    },
    // 删除投票
    deletePoll() {
      if (!this.pollId) return
      window.meetingRoomCore
        .deletePoll(this.pollId)
        .then((resp) => {
          this.showDelePollDlg = false
          this.$emit('linkTo', 'PollList')
        })
        .catch((e) => {
          console.log(e)
        })
    },
    onBackToPreviousPage() {
      this.$emit('linkTo', 'PollList')
    },
    onClose() {
      this.$eventBus.$emit(CustomEvents.CLOSE_POLL)
    },
    edit() {
      this.$emit('linkTo', 'pollEdit', this.pollId)
    },
    publish() {
      if (!this.pollId) return
      window.meetingRoomCore
        .startPoll(this.pollId)
        .then(() => {
          window.meetingRoomCore.sendCustomEvent(PollType.PUBLISH_POLL, {
            vote_id: this.pollId
          })
          this.showSnackbarText = this.$vuetify.lang.t('$vuetify.meeting.havePublish')
          this.showSnackbar = true
          // 主持人跳转到投票结果页面 投票结果页面返回后是列表页面，点击详情到投票结果页面
          this.$emit('linkTo', 'pollResult', this.pollId)
        })
        .catch((e) => {
          console.log(e)
          this.$emit('error', this.$vuetify.lang.t('$vuetify.meeting.pollPublishedFail'))
        })
    },
    submit() {
      this.pollCommitInfo.poll_id = this.pollId
      this.pollResult.questions.forEach((el) => {
        let question = {
          id: el.id,
          options: []
        }
        if (Array.isArray(el.select)) {
          el.select.forEach((se) => {
            let option = { id: se }
            question.options.push(option)
          })
        } else {
          question.options.push({ id: el.select })
        }
        this.pollCommitInfo.questions.push(question)
      })
      let checkFlag = false
      for (let i = 0; i < this.pollCommitInfo.questions.length; i++) {
        if (this.pollCommitInfo.questions[i].options.length === 0) {
          this.showSnackbarText = this.$vuetify.lang.t('$vuetify.meeting.unCompletePoll')
          this.showSnackbar = true
          checkFlag = true
          this.pollCommitInfo.questions = []
          break
        }
      }
      if (checkFlag) return
      window.meetingRoomCore
        .commitPollAnswer(this.pollCommitInfo.poll_id, this.pollCommitInfo.questions)
        .then(() => {
          // 参与者答题
          window.meetingRoomCore.sendCustomEvent(PollType.ATTENDEES_POLL, this.pollResult)
          // 参与者投票之后存一个状态，为true得时候不可以再投票
          this.setPollVoted(true)
          // 主持人跳转到投票结果页面 投票结果页面返回后是列表页面，点击详情到投票结果页面
          this.$emit('linkTo', 'pollResult', this.pollId)
        })
        .catch((e) => {
          console.error(e)
          this.showStopPollDlg = true
        })
    },
    pollDetail() {
      this.getDateLoading = true
      window.meetingRoomCore
        .getPollDetail(this.pollId)
        .then((resp) => {
          this.pollResult = resp
          this.pollResult.questions.forEach((q) => {
            this.$set(q, 'select', [])
          })
          this.getDateLoading = false
        })
        .catch((e) => {
          console.log(e)
          this.getDateLoading = false
          this.$emit('error', this.$vuetify.lang.t('$vuetify.meeting.getPollDetailFail'))
        })
    }
  }
}
</script>

<style lang="scss" scoped>
.poll-detail {
  width: 100%;
  height: 100%;
  flex: 1;
  display: flex;
  flex-direction: column;
  ::v-deep .mdi-square {
    color: #eeeeee;
  }
  ::v-deep .v-snack__wrapper {
    min-width: 40px;
  }
  ::v-deep .v-snack__content {
    text-align: center;
  }
  ::v-deep .v-snack__action {
    margin-right: 0;
  }
  ::v-deep .v-messages {
    min-height: 0 !important;
  }
  ::v-deep .v-label {
    font-size: 14px !important;
  }
  ::v-deep .v-icon {
    font-size: 20px !important;
  }
  ::v-deep .row {
    flex: none;
  }
  .child {
    flex: 1;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    margin-top: 20px;
    .label {
      width: 120px;
      margin-left: 35px;
      color: #999;
      // display: flex;
      // justify-content: flex-end;
    }
    .content {
      margin-left: 30px;
      font-size: 14px;
      color: #333;
    }
    .choose {
      margin-right: 30px;
      width: 34px;
      height: 20px;
      line-height: 20px;
      text-align: center;
      background: #f8f8f8;
      border-radius: 4px;
      font-size: 12px;
      color: #999999;
    }
  }
  .clockwise {
    transform: rotate(180deg);
  }
  .send-chat {
    ::v-deep .v-menu__content {
      box-shadow: 0px 4px 20px 0px rgba(0, 0, 0, 0.1) !important;
    }
    ::v-deep .v-list-item--active {
      background-color: #e6f1fe !important;
    }
  }
  .list-content {
    flex: 1;
    overflow: auto;
    .normal-line-height {
      line-height: 18px;
    }
  }
  /*定义滚动条高宽及背景 高宽分别对应横竖滚动条的尺寸*/
  ::-webkit-scrollbar {
    width: 3px;
    height: 10px;
    background-color: #f8f8f8;
  }

  /*定义滚动条轨道 内阴影+圆角*/
  ::-webkit-scrollbar-track {
    border-radius: 10px;
    height: 10px;
    background-color: #f8f8f8;
  }

  /*定义滑块 内阴影+圆角*/
  ::-webkit-scrollbar-thumb {
    border-radius: 2px;
    height: 10px;
    -webkit-box-shadow: #ccc;
    background-color: #ccc;
  }
}
</style>
