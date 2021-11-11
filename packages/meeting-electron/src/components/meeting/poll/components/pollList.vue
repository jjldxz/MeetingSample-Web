<template>
  <div class="poll-list">
    <poll-title
      :minus="false"
      :back-flag="true"
      :title="$vuetify.lang.t('$vuetify.meeting.poll')"
      @onClose="onClose"
    />
    <div class="child">
      <v-list
        v-if="pollListShow"
        flat
        class="overflow-x-hidden list-content"
        style="padding-top: 0"
      >
        <div v-for="(p, index) in pollList" :key="index">
          <v-hover
            v-if="isHost || isCoHost || p.status !== 0"
            v-slot="{ hover }"
            :key="index"
          >
            <v-list-item
              :ripple="false"
              class="pl-5 pr-5"
              :style="{ background: hover ? 'rgba(0,0,0,0.12)' : '' }"
            >
              <v-list-item-content
                class="pt-3 pb-3"
                @click.stop="linkDetailOrResult(p.id, p.status, p.share)"
              >
                <div
                  class="d-flex justify-space-between align-center"
                  style="position: relative"
                >
                  <div class="pt-2 pb-1 title">{{ p.title }}</div>
                  <div
                    v-if="!btnDisabled && hover"
                    class="d-flex"
                    style="position: absolute; top: 30px; right: 10px"
                  >
                    <div v-if="isHost && p.status === 0">
                      <v-btn
                        color="#EA2828"
                        height="24"
                        width="49"
                        depressed
                        outlined
                        class="mr-1"
                        small
                        dark
                        @click.stop="deletePoll(p.id)"
                      >
                        <div class="d-flex align-center">
                          <span class="normal-text">{{
                            $vuetify.lang.t('$vuetify.meeting.delete')
                          }}</span>
                        </div>
                      </v-btn>
                      <v-btn
                        class="ml-6"
                        color="#127BF8"
                        max-height="24"
                        max-width="49"
                        depressed
                        small
                        dark
                        @click.stop="editPoll(p.id)"
                      >
                        <div class="d-flex align-center">
                          <span class="normal-text">{{
                            $vuetify.lang.t('$vuetify.meeting.edit')
                          }}</span>
                        </div>
                      </v-btn>
                    </div>
                  </div>
                  <v-btn
                    text
                    style="font-weight: 600; font-size: 1rem"
                    :color="getPollResColor(p.status, p.share)"
                    small
                    height="20"
                    class="ml-4 pl-1 pr-1"
                  >
                    <span class="finished">{{
                      p.share
                        ? $vuetify.lang.t('$vuetify.meeting.publishing')
                        : statusMap[p.status]
                    }}</span>
                  </v-btn>
                </div>
                <div class="time-id">
                  <!-- eslint-disable-next-line vue/max-attributes-per-line -->
                  <v-chip class="me-2 pa-1" color="#f8f8f8" text-color="#999" label small>
                    {{
                      p.is_anonymous
                        ? $vuetify.lang.t('$vuetify.meeting.anonymous')
                        : $vuetify.lang.t('$vuetify.meeting.nonAnonymous')
                    }}
                  </v-chip>
                  <span class="mr-4">{{
                    $vuetify.lang.t('$vuetify.meeting.question', p.questionCount)
                  }}</span>
                </div>
              </v-list-item-content>
            </v-list-item>
          </v-hover>
        </div>
      </v-list>
      <div v-else class="d-flex justify-center align-center flex-fill img-box">
        <v-img max-height="110" max-width="140" src="@/assets/no_list.png" />
        <p v-if="isHost" class="no-lista">
          {{ $vuetify.lang.t('$vuetify.meeting.noCreatePoll') }}
        </p>
        <p v-else class="no-list">
          {{ $vuetify.lang.t('$vuetify.meeting.unCreatePoll') }}
        </p>
      </div>
      <v-row class="ma-5 pa-0 justify-center">
        <v-col cols="2" class="pa-0">
          <v-btn
            v-if="!btnDisabled && isHost"
            class="white--text"
            color="#127BF8"
            elevation="0"
            min-width="80"
            block
            depressed
            @click="addPoll()"
            >{{ $vuetify.lang.t('$vuetify.meeting.createPoll') }}</v-btn
          >
        </v-col>
      </v-row>
    </div>
    <v-overlay :value="getDateLoading" :opacity="0.5">
      <v-progress-circular color="light-blue" indeterminate size="48" />
    </v-overlay>
    <common-dialog
      v-model="showDeleteDlg"
      :width="width"
      @cancelClick="onCancelDelete"
      @okClick="onConfirmDelete"
    >
      <template #content>
        <span>{{ $vuetify.lang.t('$vuetify.meeting.deletePollConfirm') }}</span>
      </template>
    </common-dialog>
    <v-snackbar
      v-model="showSnackbar"
      color="#000000cc"
      centered
      min-width="80"
      timeout="1500"
    >
      {{ showSnackbarText }}
    </v-snackbar>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { PollType } from '@/common'
import CommonDialog from '@/components/common/commonDialog'
import pollTitle from './pollTitle.vue'
import { MeetingCoreRoomEvents } from '../../../../common/renderCommon'
import { CustomEvents } from '../../../../common'
export default {
  name: 'PollList',
  components: {
    CommonDialog,
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
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      width: 300,
      showSnackbar: false,
      showSnackbarText: '',
      type: '',
      getDateLoading: false,
      statusMap: {
        0: this.$vuetify.lang.t('$vuetify.meeting.upcoming'),
        1: this.$vuetify.lang.t('$vuetify.meeting.inProgress'),
        2: this.$vuetify.lang.t('$vuetify.meeting.ended')
      },
      delId: null,
      showDeleteDlg: false,
      pollList: [],
      havePoll: false
    }
  },
  computed: {
    ...mapState('meeting', ['isHost', 'isCoHost', 'meetingInfo', 'pollVoted']),
    pollListShow() {
      let pollList
      if (!this.isHost && !this.isCoHost) {
        pollList = this.pollList.filter((r) => r.status !== 0)
      } else {
        pollList = this.pollList
      }
      return pollList.length > 0
    }
  },
  watch: {
    pollFlag(newName, oldName) {
      if (newName) this.innit()
    }
  },
  created() {
    this.innit()
  },

  methods: {
    onClose() {
      this.$eventBus.$emit(CustomEvents.CLOSE_POLL)
    },
    pollResult(path, pollId, status, share) {
      if (!pollId) return
      let havePoll = false
      window.meetingRoomCore
        .getPollResult(pollId)
        .then((resp) => {
          resp.questions.forEach((question) => {
            question.options.forEach((o) => {
              if (o.voters) {
                havePoll = o.voters.find(
                  (v) => v.id === window.meetingRoomCore.user.extId
                )
                if (havePoll) {
                  this.havePoll = true
                }
              }
            })
          })
          this.$emit(
            'linkTo',
            this.havePoll ? 'PollResult' : 'PollDetail',
            pollId,
            status,
            share
          )
        })
        .catch((e) => {
          console.log(e)
        })
    },
    linkDetailOrResult(pollId, status, share) {
      if (this.btnDisabled) {
        this.$emit('linkTo', 'PollResult', pollId, status, share)
        return false
      }
      // 先取props传过来的值
      const canPoll = status === 1 && this.pollVoted
      let path = null
      switch (status) {
        case 0:
          path = 'PollDetail'
          break
        case 1: // 进行中如果是主持人进入结果页面 如果是参会者 已经投过了近结果页面
          this.isHost
            ? (path = 'PollResult')
            : canPoll
            ? (path = 'PollResult')
            : (path = 'PollDetail')
          break
        default:
          path = 'PollResult'
      }
      if (status === 1 && !this.isHost) {
        this.pollResult(path, pollId, status, share)
      } else {
        this.$emit('linkTo', path, pollId, status, share)
      }
    },
    editPoll(pollId) {
      this.$emit('linkTo', 'PollEdit', pollId)
    },
    deletePoll(id) {
      this.delId = id
      this.showDeleteDlg = true
    },
    onCancelDelete() {
      this.showDeleteDlg = false
    },
    onConfirmDelete() {
      if (!this.delId) return
      window.meetingRoomCore
        .deletePoll(this.delId)
        .then(() => {
          this.getPollList()
          this.showSnackbarText = this.$vuetify.lang.t('$vuetify.meeting.deleteSuccess')
          this.showSnackbar = true
        })
        .catch((e) => {
          console.log(e)
        })
    },
    addPoll() {
      this.$emit('linkTo', 'PollEdit')
    },
    getPollList() {
      this.getDateLoading = true
      window.meetingRoomCore
        .getPolls()
        .then((resp) => {
          this.pollList = resp
          this.getDateLoading = false
        })
        .catch((e) => {
          console.error(e)
          this.getDateLoading = false
        })
    },
    getPollResColor(status, share) {
      // 0未开始 1投票中 2已结束 share为true表示公布结果中
      if (share && status === 2) {
        return '#127BF8'
      }
      if (status === 0 || status === 2) {
        return '#999'
      }
      if (status === 1) {
        return '#15BE24'
      }
      return '#999'
    },
    innit() {
      this.getPollList()
      this.bindPollEvent()
    },
    bindPollEvent() {
      window.meetingRoomCore.on(
        MeetingCoreRoomEvents.CONTROL_CUSTOM_SIGNAL,
        (event, data, senderId) => {
          this.type = event
          // 1 发起投票 PollType.PUBLISH_POLL
          // 2 学生投票 PollType.ATTENDEES_POLL
          // 3 投票结束 PollType.STOP_PUBLISH
          // 4 公布结果 PollType.PUBLISH_RESULT
          // 5 公布结束 PollType.STOP_PUBLISH_RESULT
          const typeList = [
            PollType.PUBLISH_POLL,
            PollType.STOP_PUBLISH,
            PollType.PUBLISH_RESULT,
            PollType.STOP_PUBLISH_RESULT
          ]
          if (typeList.includes(event)) {
            this.getPollList() // 列表页面
          }
        }
      )
    }
  }
}
</script>

<style lang="scss" scoped>
.poll-list {
  width: 100%;
  height: 100%;
  flex: 1;
  display: flex;
  flex-direction: column;
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
    justify-content: space-between;
  }
  .list-content {
    flex: 1;
    overflow: auto;
    .time-id {
      color: #999999;
      font-size: 12px;
      .unstart {
        color: #fdab3b;
      }
      .going {
        color: #38c33c;
      }
      .finished {
        color: #999999;
      }
    }
    .title {
      font-size: 14px;
      max-width: 200px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      text-align: center;
    }
  }
  .img-box {
    margin-left: 90px;
  }
  .nodata-box {
    position: fixed;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    .title-a {
      color: #999;
      font-size: 12px;
      margin: 10px 0px 0px 20px;
    }
    .title-b {
      color: #999;
      font-size: 12px;
      margin-top: 10px;
    }
  }
  .no-list {
    position: relative;
    top: 80px;
    right: 130px;
    color: #999;
    font-size: 12px;
  }
  .no-lista {
    position: relative;
    top: 80px;
    right: 112px;
    color: #999;
    font-size: 12px;
  }
}
</style>
