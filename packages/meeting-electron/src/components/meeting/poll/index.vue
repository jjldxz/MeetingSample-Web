<template>
  <section>
    <v-dialog
      v-model="showFlag"
      persistent
      no-click-animation
      width="600"
      attach="#meeting-win"
      style="height: 100%"
    >
      <div class="poll-index poll-index-his">
        <component
          :is="currentComponent"
          ref="childPage"
          :can-share="innerCanShare"
          :poll-flag="showFlag"
          :poll-id="innerPollId"
          :poll-status="innerPollStatus"
          :btn-disabled="false"
          @linkTo="linkTo"
          @back="back"
          @error="onError($event)"
        />
      </div>
    </v-dialog>
    <v-snackbar v-model="showErrorNotice" timeout="2000" color="error" top>
      {{ errorNoticeContent }}
    </v-snackbar>
  </section>
</template>

<script>
import CommonDialog from '../../common/commonDialog'
import PollDetail from './components/pollDetail'
import PollEdit from './components/pollEdit'
import PollList from './components/pollList'
import PollResult from './components/pollResult'
import { CustomEvents } from '../../../common'

export default {
  name: 'Poll',
  components: {
    CommonDialog,
    PollDetail,
    PollEdit,
    PollList,
    PollResult
  },
  model: {
    prop: 'show',
    event: 'close'
  },
  props: {
    show: {
      type: Boolean,
      default() {
        return false
      }
    },
    canShare: {
      type: Boolean,
      default: false
    },
    pollPage: {
      type: String,
      default: ''
    },
    pollId: {
      type: Number,
      default: null
    },
    pollStatus: {
      type: Number,
      default: null
    }
  },
  data() {
    return {
      currentComponent: PollList,
      showFlag: false,
      share: false,
      innerPollId: null,
      innerPollStatus: null,
      innerCanShare: false,
      showErrorNotice: false,
      errorNoticeContent: null
    }
  },
  watch: {
    show(val) {
      this.showFlag = val
    },
    pollId(val) {
      this.innerPollId = val
    },
    pollStatus(val) {
      this.innerPollStatus = val
    },
    canShare(val) {
      this.innerCanShare = val
    }
  },
  mounted() {
    this.showFlag = this.show
    if (this.pollPage) {
      this.currentComponent = this.pollPage
      this.innerPollId = this.pollId
      this.innerPollStatus = this.pollStatus
    }
    this.bindCustomEvents()
  },
  methods: {
    back(action) {
      this.$emit('pollBack', action)
    },
    linkTo(url, id, pollStatus, share) {
      if (!url) {
        this.$emit('pollBack')
        return
      }
      this.currentComponent = url
      this.innerPollId = id
      this.innerPollStatus = pollStatus
      this.innerCanShare = share
    },
    bindCustomEvents() {
      this.$eventBus.$on(CustomEvents.OPEN_POLL_PAGE, (pollId, page, status, share) => {
        this.currentComponent = page
        this.innerPollId = pollId
        this.innerPollStatus = status
        this.innerCanShare = share
      })
    },
    onError(message) {
      this.showErrorNotice = true
      this.errorNoticeContent = message
    }
  }
}
</script>

<style lang="scss" scoped>
.poll-index {
  width: 600px;
  height: 660px;
  flex: 1;
  background: #fff;
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
}
</style>
