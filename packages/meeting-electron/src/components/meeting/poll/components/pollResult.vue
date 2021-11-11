<template>
  <div class="poll-result">
    <poll-title
      :title="$vuetify.lang.t('$vuetify.meeting.poll')"
      :minus="false"
      @onBackToPreviousPage="onBackToPreviousPage"
      @onClose="onClose"
    />
    <section class="child">
      <v-row class="pb-4 pl-8 pr-8 pt-3">
        <v-col cols="12" class="justify-space-between">
          <div class="bigger-text mb-2" style="font-weight: 700">
            {{ pollResultInfo.title }}
          </div>
          <div>
            <v-chip
              small
              color="#F8F8F8"
              class="mr-1"
              label
              text-color="#999"
              style="padding: 0 6px"
            >
              {{
                pollResultInfo.isAnonymous
                  ? $vuetify.lang.t('$vuetify.meeting.anonymous')
                  : $vuetify.lang.t('$vuetify.meeting.nonAnonymous')
              }}
            </v-chip>
            <!-- 非匿名下可点击提交状态的弹窗 -->
            <span v-if="isHosting" id="btn-im">
              <v-btn class="title-icon pl-0 pr-0 white--text" text @click="openPop">
                <span style="color: #127bf8">
                  {{ pollResultInfo.voterNum }}/{{ userList.length - 1 }}
                  {{ $vuetify.lang.t('$vuetify.meeting.submit') }}
                </span>
              </v-btn>
            </span>
          </div>
        </v-col>
      </v-row>
      <v-divider class="ml-8 mr-8" />
      <v-list flat class="overflow-x-hidden list-content content-p">
        <div v-for="(q, index) in pollResultInfo.questions" :key="index">
          <v-list-item :ripple="false" class="pa-0">
            <v-list-item-content class="pt-3 pb-3">
              <div class="big-text pb-2 normal-line-height poll-title">
                <div class="content-box">{{ index + 1 }}. {{ q.content }}</div>
                <div class="type-box">
                  <v-chip
                    small
                    color="#F8F8F8"
                    class="mr-1 poll-title-checktype"
                    label
                    text-color="#999"
                  >
                    {{
                      q.isSingle
                        ? $vuetify.lang.t('$vuetify.meeting.singleChoice')
                        : $vuetify.lang.t('$vuetify.meeting.multipleChoice')
                    }}
                  </v-chip>
                </div>
              </div>
              <div v-for="(o, i) in q.options" :key="i">
                <div class="content-item">
                  <div class="d-flex justify-space-between">
                    <div class="normal-text pb-2 normal-line-height">
                      {{ o.content }}
                      <v-icon v-if="!isHosting && o.select" size="20" color="#127BF8">
                        mdi-check
                      </v-icon>
                    </div>
                    <div
                      v-if="isHosting || isPublishResult"
                      class="normal-text pb-2 word-keep"
                    >
                      <span class="pr-2" style="width: 50px">{{
                        $vuetify.lang.t('$vuetify.meeting.hasVote', o.count)
                      }}</span>
                      <span>({{ o.percentage || 0 }}%)</span>
                    </div>
                  </div>
                </div>
                <div v-if="isHosting || isPublishResult">
                  <v-progress-linear
                    background-color="#eee"
                    color="#127BF8"
                    buffer-value="100"
                    :value="o.percentage"
                    rounded
                  />
                  <div :ref="`toggle_${index}_${i}`" class="poll-voters-box-toggle">
                    <div
                      v-if="o.votersName"
                      style="color: #999"
                      class="normal-text pb-2 normal-line-height poll-voters"
                    >
                      {{ o.votersName.join('、') }}
                    </div>
                    <div v-if="o.votersName" style="width: 30px" class="voters">
                      <span class="pl-2">
                        <img
                          src="@/assets/slide_down.png"
                          alt=""
                          @click="onClickSlide($event, `toggle_${index}_${i}`)"
                        />
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </v-list-item-content>
          </v-list-item>
        </div>
      </v-list>
      <section class="pl-10 pr-10 pb-5 d-flex justify-center" />
    </section>
    <!-- 参会人端加一个返回按钮,否则无法返回了 -->
    <div v-if="!isHosting && !btnDisabled" class="pa-4 d-flex justify-center">
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
    </div>
    <div v-if="!btnDisabled && isHosting" class="pa-4 d-flex justify-center">
      <v-btn
        v-if="status === 2 && !shareFlag"
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
        v-if="status === 2"
        color="#127BF8"
        height="30px"
        min-width="80px"
        :class="shareFlag === true ? '' : 'white--text'"
        :outlined="shareFlag"
        @click="shareResult"
        >{{ shareBtnText }}</v-btn
      >
      <div style="width: 30px" />
      <v-btn
        v-if="status === 1"
        color="#127BF8"
        height="30px"
        min-width="80px"
        class="white--text"
        style="margin-right: 40px"
        @click="stopDlg = true"
        >{{ $vuetify.lang.t('$vuetify.meeting.terminateVoting') }}</v-btn
      >
      <div v-if="status === 2" class="d-flex align-center row-content send-chat">
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
          <v-list class="pa-0" width="90">
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
    <!-- 重新开始弹窗 -->
    <div v-if="showRelaunchDlg" class="relaunch-dialog">
      <p class="relaunch-title">{{ $vuetify.lang.t('$vuetify.meeting.relaunch') }}</p>
      <p class="relaunch-text">{{ $vuetify.lang.t('$vuetify.meeting.relaunchText') }}</p>
      <div class="relaunch-btn">
        <v-btn
          color="#127BF8"
          height="30px"
          min-width="80px"
          outlined
          depressed
          @click="showRelaunchDlg = false"
          ><span class="normal-text">{{
            $vuetify.lang.t('$vuetify.meeting.cancel')
          }}</span></v-btn
        >
        <div style="width: 30px" />
        <v-btn
          color="#127BF8"
          class="white--text"
          height="30px"
          min-width="80px"
          depressed
          @click="relaunch"
          ><span class="normal-text">{{
            $vuetify.lang.t('$vuetify.meeting.confirm')
          }}</span></v-btn
        >
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
    <!-- 提交弹窗 -->
    <div v-if="isSubmitStatus" class="status-box">
      <div class="title-box">
        <span>{{ $vuetify.lang.t('$vuetify.meeting.pollStatus') }}</span>
        <img
          src="@/assets/close.svg"
          alt=""
          style="position: absolute; right: 20px"
          @click="closePop"
        />
      </div>
      <div class="submit-box">
        <div class="submitted">
          <p>{{ $vuetify.lang.t('$vuetify.meeting.submitted') }}</p>
          <ul>
            <li v-for="(item, index) in submittedList" :key="index">
              <v-avatar max-width="50" max-height="50">
                <v-img
                  alt=""
                  max-width="20"
                  max-height="20"
                  class="default-user-avatar"
                  :src="
                    item.avatar ? item.avatar : require('@/assets/default-avatar.png')
                  "
                />
              </v-avatar>
              <span>{{ item.name | changeName }}</span>
            </li>
          </ul>
        </div>
        <div class="unsubmit">
          <p>{{ $vuetify.lang.t('$vuetify.meeting.unSubmit') }}</p>
          <ul>
            <li v-for="(item, index) in unSubmitList" :key="index">
              <v-avatar max-width="50" max-height="50">
                <v-img
                  alt=""
                  max-width="20"
                  max-height="20"
                  class="default-user-avatar"
                  :src="
                    item.avatar ? item.avatar : require('@/assets/default-avatar.png')
                  "
                />
              </v-avatar>
              <span>{{ item.name | changeName }}</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
    <!-- 终止投票的弹窗 -->
    <v-overlay v-model="stopDlg">
      <div class="stop-poll flex-center flex-column">
        <p>{{ $vuetify.lang.t('$vuetify.meeting.terminateVoting') }}</p>
        <p class="confirm-title">
          {{ $vuetify.lang.t('$vuetify.meeting.terminatedText') }}
        </p>
        <div class="dialog-btn">
          <v-btn
            color="#127BF8"
            height="30px"
            min-width="80px"
            outlined
            depressed
            @click="stopDlg = false"
            ><span class="normal-text">{{
              $vuetify.lang.t('$vuetify.meeting.cancel')
            }}</span></v-btn
          >
          <div style="width: 30px" />
          <v-btn
            color="#127BF8"
            class="white--text"
            height="30px"
            min-width="80px"
            depressed
            @click="stopPoll"
            ><span class="normal-text">{{
              $vuetify.lang.t('$vuetify.meeting.confirm')
            }}</span></v-btn
          >
        </div>
      </div>
    </v-overlay>
  </div>
</template>

<script>
import pollTitle from './pollTitle.vue'
import { mapMutations, mapState } from 'vuex'
import { CustomEvents, PollType } from '@/common'
import { MeetingCoreRoomEvents } from '@/common/renderCommon'

export default {
  name: 'PollResult',
  components: {
    pollTitle
  },
  filters: {
    // 名字超过十位加...
    changeName(value) {
      if (value.length > 11) {
        return value.substr(0, 11) + '...'
      } else {
        return value
      }
    }
  },
  props: {
    canShare: {
      type: Boolean
    },
    pollFlag: {
      type: Boolean
    },
    pollId: {
      type: Number
    },
    btnDisabled: {
      type: Boolean
    }
  },
  data() {
    return {
      tabIndex: 0,
      // 下拉列表
      selectSendUserFlag: false,
      // 更多选项
      optionsList: [
        { name: this.$vuetify.lang.t('$vuetify.meeting.relaunch'), value: '0' },
        { name: this.$vuetify.lang.t('$vuetify.meeting.edit'), value: '1' }
      ],
      // 下拉列表的显示
      menuValue: false,
      // 提交状态的弹窗
      isSubmitStatus: false,
      // 已提交的列表
      submittedList: [],
      submittedNameList: [],
      // 未提交的列表
      unSubmitList: [],
      showEndDlg: false,
      // 终止提交的弹窗
      stopDlg: false,
      showRelaunchDlg: false,
      CHAT_MEMBER_TYPE: {
        Sender: 'sender',
        Receiver: 'receiver'
      },
      status: '',
      type: '',
      width: 300,
      isHosting: false,
      showSnackbar: false,
      showSnackbarText: '', // 已停止公布结果
      shareFlag: false,
      shareBtnText: this.$vuetify.lang.t('$vuetify.meeting.publish'),
      isPublishResult: false, // 未公布投票时只显示自己的投票结果
      pollResultInfo: {
        title: '',
        questions: []
      }
    }
  },
  computed: {
    ...mapState('user', ['loginUserInfo']),
    ...mapState('meeting', [
      'isHost',
      'isCoHost',
      'userList',
      'joinedMembers',
      'pollPerson',
      'meetingId'
    ])
  },
  watch: {
    pollFlag(newName) {
      if (newName) this.init()
    },
    // 动态监视dom中voters的高度
    pollResultInfo: {
      handler(n, o) {
        if (n) {
          this.$nextTick(() => {
            const nodes = this.$refs
            for (let [name, value] of Object.entries(nodes)) {
              if (name.indexOf('toggle_') !== -1) {
                if (value.length === 0) {
                  continue
                }
                const h = value[0]?.offsetHeight ?? 26
                if (h > 26) {
                  value[0].classList.add('poll-voters-box-hidden')
                  value[0].classList.remove('poll-voters-box')
                  if (Array.isArray(value[0].children) && value[0].children.length > 2) {
                    value[0].children[1].style.display = 'block'
                  }
                } else {
                  value[0].classList.remove('poll-voters-box-hidden')
                  value[0].classList.add('poll-voters-box')
                  if (Array.isArray(value[0].children) && value[0].children.length > 2) {
                    value[0].children[1].style.display = 'none'
                  }
                }
              }
            }
          })
        }
      },
      deep: true
    }
  },
  mounted() {
    this.init()
  },
  methods: {
    ...mapMutations('meeting', ['setPollVoted', 'addChatMessage']),
    // 更多操作
    changeOptions(val) {
      if (val === 0) {
        this.showRelaunchDlg = true
      } else {
        this.tabIndex = 1
        this.$emit('linkTo', 'pollEdit', this.pollId)
        let timer = setTimeout(() => {
          this.tabIndex = 0
          clearTimeout(timer)
        }, 500)
      }
    },
    // 打开提交状态的弹窗
    openPop() {
      this.isSubmitStatus = true
    },
    // 关闭提交状态弹窗
    closePop() {
      this.isSubmitStatus = false
    },
    relaunch() {
      if (!this.pollId) return
      window.meetingRoomCore
        .startPoll(this.pollId)
        .then((resp) => {
          window.meetingRoomCore.sendCustomEvent(PollType.PUBLISH_POLL, {
            vote_id: this.pollId
          })
          this.showSnackbarText = this.$vuetify.lang.t('$vuetify.meeting.haveRelaunch')
          this.showSnackbar = true
          this.pollResult()
          this.stopDlg = false
          this.showRelaunchDlg = false
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
    // 终止投票
    stopPoll() {
      if (!this.pollId) return
      window.meetingRoomCore
        .stopPoll(this.pollId)
        .then((resp) => {
          window.meetingRoomCore.sendCustomEvent(PollType.STOP_PUBLISH, {
            vote_id: this.pollId.toString()
          })
          this.status = resp.status
          this.stopDlg = false
        })
        .catch((e) => {
          console.error(e)
        })
    },
    pollResult() {
      if (!this.pollId) return
      window.meetingRoomCore
        .getPollResult(this.pollId)
        .then((resp) => {
          let list =
            window.meetingRoomCore.pollInfo && window.meetingRoomCore.pollInfo.voters // 房间属性
          this.submittedList = []
          this.submittedNameList = []
          this.unSubmitList = []
          this.joinedMembers.forEach((item) => {
            let flag = false
            list &&
              list.forEach((el) => {
                if (item.id === el[1]) {
                  flag = true
                }
              })
            if (flag) {
              this.submittedList.push(item)
              this.submittedNameList.push(item.name)
            } else {
              this.unSubmitList.push(item)
            }
          })
          this.unSubmitList.shift()
          resp.questions.forEach((question) => {
            let counts = 0
            question.options.forEach((o) => {
              counts = counts + (o.count || 0)
            })
            question.options.forEach((o) => {
              if (counts === 0) {
                o.percentage = 0
              } else {
                o.percentage = Math.ceil((o.count * 100) / counts)
              }
              if (o.voters) {
                o.votersName = o.voters.map((v) => v.name)
              }
            })
          })
          this.pollResultInfo = resp
          this.status = resp.status
        })
        .catch((e) => {
          console.error(e)
        })
    },
    pollAnswer() {
      window.meetingRoomCore
        .getMyPollAnswer(this.pollId)
        .then((resp) => {
          console.log('pollAnswer', resp)
          this.pollResultInfo = resp
        })
        .catch((e) => {
          console.error(e)
        })
    },
    shareResult() {
      this.shareFlag = !this.shareFlag
      let params = null
      if (this.shareFlag) {
        this.shareBtnText = this.$vuetify.lang.t('$vuetify.meeting.stopPublishing')
        this.showSnackbarText = this.$vuetify.lang.t('$vuetify.meeting.publishText')
        params = {
          type: PollType.PUBLISH_RESULT,
          content: { vote_id: this.pollId.toString() }
        }
      } else {
        this.shareBtnText = this.$vuetify.lang.t('$vuetify.meeting.publish')
        this.showSnackbarText = this.$vuetify.lang.t('$vuetify.meeting.publishStopped')
        params = {
          type: PollType.STOP_PUBLISH_RESULT,
          content: { vote_id: this.pollId.toString() }
        }
      }
      const sharePollFun = this.shareFlag
        ? window.meetingRoomCore.startSharePoll
        : window.meetingRoomCore.stopSharePoll
      sharePollFun(this.pollId)
        .then(() => {
          this.showSnackbar = true
          window.meetingRoomCore.sendCustomEvent(params.type, params.content)
        })
        .catch((e) => {
          console.error(e)
        })
    },
    onClickSlide(e, root) {
      let currentNode = e.target
      const rootNode = this.$refs[root][0]
      const rootClassList = rootNode.classList
      if (rootNode.className.indexOf('poll-voters-box-hidden') !== -1) {
        rootClassList.remove('poll-voters-box-hidden')
        rootClassList.add('poll-voters-box')
        currentNode.src = require('@/assets/slide_up.png')
      } else {
        rootClassList.add('poll-voters-box-hidden')
        rootClassList.remove('poll-voters-box')
        currentNode.src = require('@/assets/slide_down.png')
      }
    },
    init() {
      this.bindPollEvent()
      this.isHosting = this.isHost || this.isCoHost
      if (this.canShare) {
        this.isPublishResult = true
        this.shareFlag = true
        this.shareBtnText = this.$vuetify.lang.t('$vuetify.meeting.stopPublishing')
      }
      this.pollResultInfo = {
        title: '',
        questions: []
      }
      if (this.isHosting || this.isPublishResult) {
        this.pollResult()
      } else {
        this.pollAnswer()
      }
    },
    bindPollEvent() {
      window.meetingRoomCore.on(
        MeetingCoreRoomEvents.CONTROL_CUSTOM_SIGNAL,
        (event, data, senderId) => {
          // 1 发起投票 PollType.PUBLISH_POLL
          // 2 学生投票 PollType.ATTENDEES_POLL
          // 3 投票结束 PollType.STOP_PUBLISH
          // 4 公布结果 PollType.PUBLISH_RESULT
          // 5 公布结束 PollType.STOP_PUBLISH_RESULT
          if (event === PollType.PUBLISH_POLL) {
            // 重新进行投票和第一次的投票的时候把状态改回false
            this.setPollVoted(false)
          }
          if (event === PollType.STOP_PUBLISH) {
            // 结束投票
            this.setPollVoted(false)
          }
          if (event === PollType.ATTENDEES_POLL) {
            if (this.isHosting) {
              this.pollResult() // 结果页面
            }
          }
        }
      )
    }
  }
}
</script>

<style lang="scss" scoped>
.poll-result {
  width: 100%;
  height: 100%;
  flex: 1;
  display: flex;
  flex-direction: column;
  position: relative;
  ::v-deep .v-snack__wrapper {
    min-width: 40px;
  }
  ::v-deep .v-snack__content {
    text-align: center;
  }
  ::v-deep .v-snack__action {
    margin-right: 0;
  }
  ::v-deep .row {
    flex: none;
  }

  .child {
    flex: 1;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    .label {
      width: 120px;
      display: flex;
      justify-content: flex-end;
    }
    #btn-im {
      ::v-deep .v-btn.v-btn--disabled {
        background-color: #ffffff !important;
      }
    }
  }
  .word-keep {
    word-break: keep-all;
    display: flex;
    align-items: flex-end;
  }
  .list-content {
    flex: 1;
    overflow: auto;
    .normal-line-height {
      line-height: 18px;
    }
    .poll-title {
      display: flex;
      .content-box {
        // overflow: hidden;
        // text-overflow: ellipsis;
        // white-space: nowrap;
        width: 92%;
        word-break: break-all;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 2;
        overflow: hidden;
      }
      .type-box {
        width: 8%;
      }
      .poll-title-checktype {
        padding: 0 6px;
      }
    }
    .content-item {
      background-color: #f8f8f8;
      padding: 10px 10px 0 10px;
      border-radius: 4px;
    }
    .poll-voters-box-toggle {
      justify-content: space-between !important;
      display: flex !important;
    }
    .poll-voters-box {
      width: 100%;
      height: auto;
      background-color: #f8f8f8;
      padding: 10px;
      .poll-voters {
        width: 95%;
      }
    }
    .poll-voters-box-hidden {
      width: 100%;
      overflow: hidden;
      height: 38px;
      background-color: #f8f8f8;
      padding: 10px;
      .poll-voters {
        width: 95%;
        word-break: break-all;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 1;
        overflow: hidden;
      }
    }
  }
  .clockwise {
    transform: rotate(180deg);
  }
  .status-box {
    width: 400px;
    height: 380px !important;
    background: #ffffff;
    box-shadow: 0 4px 20px 0px rgba(0, 0, 0, 0.1);
    border-radius: 4px;
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    margin: auto;
    .title-box {
      display: flex;
      align-items: center;
      justify-content: center;
      height: 55px;
      border-bottom: 1px solid #f8f8f8;
      span {
        font-size: 16px;
        color: #3a3a3a;
      }
    }
    .submit-box {
      display: flex;
      height: 325px;
      width: 100%;
      .submitted {
        height: 325px;
        width: 189px;
        border-right: 1px solid #f8f8f8;
        p {
          margin: 10px 0 0 20px;
          font-size: 14px;
          color: #3a3a3a;
        }
        ul {
          margin: 20px 0 0 20px;
          padding: 0 !important;
          li {
            list-style: none;
            span {
              margin-left: 10px;
            }
          }
        }
      }
      .unsubmit {
        height: 325px;
        width: 190px;
        p {
          margin: 10px 0 0 20px;
          font-size: 14px;
          color: #3a3a3a;
        }
        ul {
          margin: 20px 0 0 20px;
          padding: 0 !important;
          li {
            list-style: none;
            span {
              margin-left: 10px;
            }
          }
        }
      }
    }
  }
  .send-chat {
    ::v-deep .v-list-item--active {
      background-color: #e6f1fe !important;
    }
  }
  .stop-poll {
    padding: 0 15px;
    width: 400px;
    height: 200px;
    background: #ffffff;
    box-shadow: 0 4px 20px 0 rgba(0, 0, 0, 0.1);
    border-radius: 4px;
    margin: auto;
    p {
      text-align: center;
      color: #424242;
      font-size: 16px;
    }
    .confirm-title {
      margin-top: 10px;
      margin-bottom: 2px !important;
      font-size: 14px;
      color: #a3a3a3;
    }
    .dialog-btn {
      margin-top: 30px;
      display: flex;
      justify-content: center;
    }
  }
  .relaunch-dialog {
    width: 400px;
    height: 162px;
    background: #ffffff;
    box-shadow: 0 4px 20px 0 rgba(0, 0, 0, 0.1);
    border-radius: 4px;
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    margin: auto;
    .relaunch-title {
      text-align: center;
      margin-top: 30px;
      color: #424242;
      font-size: 16px;
      margin-bottom: 0 !important;
    }
    .relaunch-text {
      text-align: center;
      font-size: 14px;
      color: #a3a3a3;
      margin-top: 0;
      margin-bottom: 2px !important;
    }
    .relaunch-btn {
      margin-top: 30px;
      display: flex;
      justify-content: center;
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

::v-deep .v-btn.v-btn--disabled {
  background-color: #fff !important;
}
</style>
