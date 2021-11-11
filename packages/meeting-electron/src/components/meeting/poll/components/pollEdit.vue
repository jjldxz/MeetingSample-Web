<template>
  <div class="pollEdit d-flex flex-column">
    <poll-title
      :title="title"
      @onBackToPreviousPage="onBackToPreviousPage"
      @onClose="onClose"
    />
    <div class="child">
      <v-form
        ref="pollForm"
        v-model="pollForm"
        :input-options="inputOptions"
        class="d-flex flex-column fill-height overflow-x-hidden list-content"
      >
        <div>
          <v-text-field
            v-model="pollFormContent.title"
            maxlength="200"
            label=""
            :placeholder="$vuetify.lang.t('$vuetify.meeting.inputPollTopic')"
            :rules="[rules.required, rules.length(1, 200)]"
            dense
          />
          <v-checkbox
            v-model="pollFormContent.is_anonymous"
            class="pa-0 mt-0"
            color="#127BF8"
            :label="$vuetify.lang.t('$vuetify.meeting.anonymous')"
            dense
          />
        </div>
        <section
          v-for="(question, index) in pollFormContent.questions"
          :key="index"
          class="mb-2 flex-detail content-p question-shadow"
        >
          <div class="subject-group">
            <div class="d-flex align-center question-box">
              <span class="index-text">{{ index + 1 }}.</span>
              <div class="topic">
                <v-text-field
                  id="input-value"
                  v-model="question.content"
                  label=""
                  :placeholder="$vuetify.lang.t('$vuetify.meeting.inputQuestions')"
                  maxlength="200"
                  :rules="[rules.required, rules.length(1, 200)]"
                />
              </div>
            </div>
            <div class="group">
              <div class="options">
                <div
                  v-for="(o, i) in question.options"
                  :key="i"
                  class="d-flex flex-center question-options"
                >
                  <v-text-field
                    v-model="o.content"
                    label=""
                    success
                    outlined
                    maxlength="200"
                    :placeholder="`${$vuetify.lang.t('$vuetify.meeting.option')}${i + 1}`"
                    dense
                  />
                  <v-btn
                    v-if="question.options.length > 2"
                    icon
                    class="sub-btn flex-center pa-0 ml-1 white--text"
                    width="20"
                    @click="removeOptions(question.options, i)"
                  >
                    <img
                      src="@/assets/poll/remove@2x.png"
                      alt=""
                      style="width: 14px; height: 14px"
                    />
                  </v-btn>
                </div>
                <div class="d-flex justify-space-between mt-1">
                  <div
                    v-if="question.options.length < 10"
                    class="d-flex justify-start mt-1"
                  >
                    <div class="add-options">
                      <img
                        src="@/assets/poll/add@2x.png"
                        alt=""
                        @click="addOption(index)"
                      />
                    </div>
                    <v-btn
                      color="#127BF8"
                      width="48px"
                      height="17px"
                      text
                      @click="addOption(index)"
                      ><span class="normal-text">{{
                        $vuetify.lang.t('$vuetify.meeting.addChoice')
                      }}</span></v-btn
                    >
                  </div>
                  <div class="single-box">
                    <div>
                      <v-radio-group v-model="question.isSingle" class="pb-0 ma-0" row>
                        <v-radio
                          :value="singleChoice"
                          :label="$vuetify.lang.t('$vuetify.meeting.singleChoice')"
                        />
                        <v-radio
                          :value="multipleChoice"
                          :label="$vuetify.lang.t('$vuetify.meeting.multipleChoice')"
                        />
                      </v-radio-group>
                    </div>
                    <div v-if="pollFormContent.questions.length > 1" class="dele">
                      <v-btn
                        small
                        color="#127BF8"
                        class="white--text"
                        text
                        @click="deleteQuestion(index)"
                      >
                        <img
                          src="@/assets/poll/dele@2x.png"
                          alt=""
                          style="width: 20px; height: 18px"
                      /></v-btn>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        <div
          v-if="pollFormContent.questions.length < 10"
          class="d-flex justify-center mt-2"
        >
          <v-btn
            color="#127BF8"
            width="520"
            style="margin-left: 20px; margin-right: 20px; margin-bottom: 20px"
            outlined
            depressed
            @click="addTopic"
            ><span class="normal-text">{{
              $vuetify.lang.t('$vuetify.meeting.addQuestion')
            }}</span></v-btn
          >
        </div>
      </v-form>
      <section class="pl-10 pr-10 pb-5 d-flex justify-center">
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
        <v-btn
          :disabled="!pollForm"
          :loading="isLoading"
          class="white--text"
          color="#127BF8"
          elevation="0"
          min-width="80px"
          height="30px"
          style="margin-left: 20px"
          depressed
          @click="rulesFun"
          >{{ $vuetify.lang.t('$vuetify.meeting.complete') }}</v-btn
        >
      </section>
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
  </div>
</template>

<script>
import pollTitle from './pollTitle.vue'
import { mapState } from 'vuex'
import { CustomEvents } from '../../../../common'

export default {
  name: 'PollEdit',
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
    }
  },
  data() {
    return {
      isHosting: false,
      showSnackbar: false,
      showSnackbarText: '',
      title: this.$vuetify.lang.t('$vuetify.meeting.createPoll'),
      pollForm: false,
      isLoading: false,
      singleChoice: true,
      multipleChoice: false,
      pollFormContent: {
        title: null,
        room_id: null,
        is_anonymous: false,
        questions: [
          {
            content: null,
            isSingle: true,
            options: [{ content: null }, { content: null }]
          }
        ]
      },
      inputOptions: {
        showDialCode: false,
        tabindex: 0
      },
      rules: {
        length: (min, max) => (v) =>
          ((v || '').length >= min && (v || '').length <= max) ||
          this.$vuetify.lang.t('$vuetify.meeting.charLengthRangeCHeck', min, max),
        required: (v) => !!v || this.$vuetify.lang.t('$vuetify.meeting.required')
      }
    }
  },
  computed: {
    ...mapState('user', ['loginUserInfo']),
    ...mapState('meeting', ['isHost', 'isCoHost', 'meetingId'])
  },
  watch: {
    pollFlag(newName) {
      if (newName) {
        this.pollFormContent.room_id = this.meetingId
        this.pollDetail()
      }
    }
  },
  mounted() {
    this.pollFormContent.room_id = this.meetingId
    this.pollDetail()
  },
  methods: {
    rulesFun() {
      let check = false
      this.pollFormContent.questions.forEach((q) => {
        q.options.forEach((o) => {
          if (!(o.content && o.content.trim)) {
            check = true
          }
        })
      })
      if (check) {
        this.showSnackbarText = this.$vuetify.lang.t('$vuetify.meeting.checkQuestions')
        this.showSnackbar = true
        return false
      } else {
        this.savePoll()
      }
    },
    onBackToPreviousPage() {
      this.$emit('linkTo', 'pollList')
    },
    onClose() {
      this.$eventBus.$emit(CustomEvents.CLOSE_POLL)
    },
    removeOptions(options, i) {
      options.splice(i, 1)
    },
    addOption(index) {
      if (this.pollFormContent.questions[index].options.length < 10) {
        this.pollFormContent.questions[index].options.push({ content: null })
      }
    },
    addTopic() {
      if (this.pollFormContent.questions.length < 10) {
        this.pollFormContent.questions.push({
          content: null,
          isSingle: true,
          options: [{ content: null }, { content: null }]
        })
      }
    },
    savePoll() {
      if (this.pollId) this.pollFormContent.id = this.pollId
      this.pollFormContent.id
        ? window.meetingRoomCore
            .updatePoll(
              this.pollFormContent.id,
              this.pollFormContent.title,
              this.pollFormContent.questions
            )
            .then((resp) => {
              this.$emit('linkTo', 'pollList', this.pollId)
            })
            .catch((e) => {
              console.log(e)
            })
        : window.meetingRoomCore
            .createPoll(this.pollFormContent.title, this.pollFormContent.questions)
            .then((resp) => {
              this.$emit('linkTo', 'pollList', resp.id)
            })
            .catch((e) => {
              console.log(e)
            })
    },
    deleteQuestion(index) {
      this.pollFormContent.questions.splice(index, 1)
    },
    pollDetail() {
      if (!this.pollId) return
      window.meetingRoomCore
        .getPollDetail(this.pollId)
        .then((resp) => {
          this.pollFormContent = resp
        })
        .catch((e) => {
          console.log(e)
        })
    }
  }
}
</script>

<style lang="scss" scoped>
.pollEdit {
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
  .child {
    flex: 1;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    justify-content: space-between;
    padding: 0 20px;
    .question-box {
      .index-text {
        color: #333;
        font-size: 14px;
        margin: 0px -10px 15px 0px;
      }
      .topic {
        width: 530px;
        // ::v-deep #input-209 {
        //   text-indent: 2em;
        // }
        // margin-left: 5px;
      }
    }
    // .subject-group {
    //   padding: 10px;
    //   background: #cfe5fe;
    //   border-radius: 5px;
    //   position: relative;
    //   .index-text {
    //     position: absolute;
    //     left: -20px;
    //     top: 25px;
    //     font-size: 16px;
    //   }
    // }
  }
  .subject-group {
    .group {
      .options {
        ::v-deep .flex-center {
          justify-content: inherit !important;
        }
      }
    }
  }
  .question-shadow {
    padding: 0 30px 0 15px !important;
  }
  .question-shadow:hover {
    box-shadow: 0 4px 20px 0 rgba(0, 0, 0, 0.1);
    border-radius: 4px;
    background: #fff;
  }
  .add-options {
    width: 14px;
    height: 14px;
    margin-top: 2px;
    img {
      width: 14px;
      height: 14px;
    }
  }
  .single-box {
    width: 156px;
    margin-left: 10px;
  }
  .dele {
    margin-top: -4px;
    position: relative;
    top: -30px;
    left: 145px;
  }
  .list-content {
    flex: 1;
    overflow: auto;
  }
  ::v-deep #input-value {
    text-indent: 2em;
  }
  ::v-deep .v-input__append-inner {
    display: flex;
    align-items: center;
    align-self: center;
  }
  ::v-deep .v-btn.v-btn--disabled {
    background: #cfe5fe !important;
    color: #ffffff !important;
  }
  ::v-deep .v-text-field--placeholder {
    font-size: 14px !important;
    color: #cccccc !important;
  }
  ::v-deep .v-text-field {
    padding-top: 4px !important;
    margin-top: 0 !important;
  }
  ::v-deep .v-messages {
    min-height: 0 !important;
  }

  .group {
    width: 495px;
    margin-left: 10px;
    ::v-deep .v-text-field__details {
      min-height: 0 !important;
      margin-bottom: 0 !important;
    }
    ::v-deep .mdi-radiobox-blank .mdi-radiobox-marked {
      font-size: 18px;
    }
    ::v-deep .v-label {
      font-size: 14px;
    }
    // .question-options {
    //   width: 500px;
    //   margin-left: 15px;
    // }
    .sub-btn {
      margin-left: 10px !important;
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
::v-deep .v-input__slot:before {
  border-color: #f8f8f8 !important;
}
// ::v-deep .v-input__slot {
//   width: 495px;
// }
::v-deep .v-text-field {
  width: 495px !important;
}
::v-deep .v-input__control {
  width: 495px;
  fieldset {
    border: 1px solid !important;
  }
}
// ::v-deep #options-input {
// }
</style>
