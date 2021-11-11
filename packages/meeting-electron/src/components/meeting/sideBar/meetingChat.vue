<template>
  <div id="meeting-chat" ref="meetingChat">
    <v-divider />
    <div class="flex-center" style="height: 33px; line-height: 33px">
      <span>{{ $vuetify.lang.t('$vuetify.meeting.chat') }}</span>
    </div>
    <v-divider />
    <v-list
      id="chat-msg-list"
      class="overflow-x-hidden overflow-y-auto pa-0 pl-2 pr-2"
      style="height: calc(100% - 35px - 142px)"
    >
      <v-list-item v-for="(msg, idx) in chatMsgList" :key="idx" class="pa-0 chat-list">
        <v-list-item-content class="d-flex align-center">
          <div v-if="msg.role === ChatItemType.Time" class="time">
            {{ msg.content }}
          </div>
          <div
            v-else
            :class="{
              sent: msg.role === ChatItemType.Sender,
              receive: msg.role === ChatItemType.Receiver
            }"
            class="chat-msg"
          >
            <div
              class="d-flex"
              :style="{
                'flex-direction': msg.role === ChatItemType.Sender ? 'row-reverse' : 'row'
              }"
            >
              <v-avatar size="40">
                <img
                  alt
                  class="default-user-avatar"
                  :src="
                    msg.userAvatar
                      ? msg.userAvatar
                      : require('@/assets/default-avatar.png')
                  "
                />
              </v-avatar>
              <div
                class="pl-2 pr-2 d-flex flex-column"
                :style="{
                  'justify-content':
                    msg.role === ChatItemType.Sender ? 'flex-end' : 'flex-start'
                }"
              >
                <div class="nickname">
                  <div v-if="msg.role === ChatItemType.Sender" class="d-flex justify-end">
                    <div>{{ $vuetify.lang.t('$vuetify.meeting.from') }}</div>
                    <div v-if="$vuetify.lang.current === 'en'" style="margin-left: 3px">
                      {{ $vuetify.lang.t('$vuetify.meeting.me') }}
                    </div>
                    <div v-if="$vuetify.lang.current === 'en'" style="margin-left: 3px">
                      {{ $vuetify.lang.t('$vuetify.meeting.to') }}
                    </div>
                    <div
                      v-if="msg.sendToId"
                      class="orange--text"
                      :class="
                        $vuetify.lang.current !== 'en'
                          ? 'min-chat-nickname'
                          : 'chat-nickname'
                      "
                      style="margin-left: 3px"
                    >
                      {{ msg.sendToName }}
                    </div>
                    <div v-else class="orange--text" style="margin-left: 3px">
                      {{ $vuetify.lang.t('$vuetify.meeting.everyone') }}
                    </div>
                    <div
                      v-if="msg.sendToId"
                      class="orange--text"
                      style="margin-left: 3px"
                    >
                      ({{ $vuetify.lang.t('$vuetify.meeting.private') }})
                    </div>
                  </div>
                  <div v-if="msg.role === ChatItemType.Receiver" class="d-flex">
                    <div v-if="$vuetify.lang.current === 'en'">
                      {{ $vuetify.lang.t('$vuetify.meeting.from') }}
                    </div>
                    <div
                      :class="
                        msg.sendToId && $vuetify.lang.current !== 'en'
                          ? 'min-chat-nickname'
                          : 'chat-nickname'
                      "
                      style="margin-left: 3px"
                    >
                      {{ msg.userName }}
                    </div>
                    <div style="margin-left: 3px">
                      {{ $vuetify.lang.t('$vuetify.meeting.to') }}
                    </div>
                    <div
                      v-if="msg.sendToId"
                      class="orange--text"
                      style="margin-left: 3px"
                    >
                      {{ $vuetify.lang.t('$vuetify.meeting.myself') }}
                    </div>
                    <div
                      v-if="!msg.sendToId"
                      class="orange--text"
                      style="margin-left: 3px"
                    >
                      {{ $vuetify.lang.t('$vuetify.meeting.everyone') }}
                    </div>
                    <div v-if="!($vuetify.lang.current === 'en')" class="orange--text">
                      {{ $vuetify.lang.t('$vuetify.meeting.say') }}
                    </div>
                    <div
                      v-if="msg.sendToId"
                      class="orange--text"
                      style="margin-left: 3px"
                    >
                      ({{ $vuetify.lang.t('$vuetify.meeting.private') }})
                    </div>
                  </div>
                </div>
                <div
                  class="d-flex"
                  :style="{
                    'justify-content':
                      msg.role === ChatItemType.Sender ? 'flex-end' : 'flex-start'
                  }"
                >
                  <div class="content" v-html="msg.content" />
                </div>
              </div>
            </div>
          </div>
        </v-list-item-content>
      </v-list-item>
    </v-list>
    <div class="pl-2 pr-2 pb-2" style="width: 100%; height: 142px">
      <!-- private chat -->
      <div id="send-chat" class="d-flex align-center row-content send-chat">
        <v-menu
          v-model="sendToMenu"
          max-height="200"
          nudge-top="35"
          attach="#send-chat"
          top
        >
          <template #activator="{ on, attrs }">
            <span class="normal-text">{{
              $vuetify.lang.t('$vuetify.meeting.sendTo')
            }}</span>
            <v-btn
              v-bind="attrs"
              text
              class="pa-0 ma-0"
              height="18"
              min-width="0"
              v-on="on"
              @click="selectSendUserFlag = !selectSendUserFlag"
              ><span class="blue-text">{{
                sendToName || $vuetify.lang.t('$vuetify.meeting.everyone')
              }}</span>
              <v-icon :class="sendToMenu ? ' clockwise' : ''" color="#127BF8">
                mdi-menu-down
              </v-icon>
            </v-btn>
          </template>
          <v-list class="pa-0" dense width="210">
            <v-list-item
              v-for="item in sendToUserList"
              :key="item.id"
              style="min-height: 30px"
              dense
              color="#127BF8"
              :input-value="item.id === sendToId"
              @click="selectSendUser(item)"
            >
              <v-list-item-content class="pa-1">
                <div class="d-flex">
                  {{ item.name }}
                  <div
                    v-if="item.role === 'host'"
                    style="color: #999999; margin-left: 3px"
                  >
                    ({{ $vuetify.lang.t('$vuetify.meeting.host') }})
                  </div>
                </div>
              </v-list-item-content>
            </v-list-item>
          </v-list>
        </v-menu>
      </div>
      <label class="send-btn">
        <textarea
          ref="inputArea"
          v-model="chatText"
          class="im-input pt-2"
          :placeholder="$vuetify.lang.t('$vuetify.meeting.pleaseEnterTheChatContent')"
          type="text"
          @keypress="pressKeyAtChat"
        />
        <div class="d-flex justify-end" style="padding-right: 2px; padding-bottom: 5px">
          <v-btn
            color="#127BF8"
            class="white--text"
            depressed
            min-width="60"
            height="30"
            :disabled="!chatText || chatText.Trim().length === 0"
            @click="sendMessage"
          >
            {{ $vuetify.lang.t('$vuetify.meeting.send') }}
          </v-btn>
        </div>
      </label>
    </div>
  </div>
</template>

<script>
import { mapMutations, mapState } from 'vuex'
import { pySort } from '../../../utils'
import chatMessage from '../../../composables/chatMessage'
import { ChatItemType } from '../../../common'

export default {
  name: 'MeetingChat',
  setup(props, context) {
    const { sendChatMessage } = chatMessage(context.root.$store)
    return { ChatItemType, sendChatMessage }
  },
  data() {
    return {
      sendToMenu: false,
      sendToName: null,
      sendToId: null,
      selectSendUserFlag: false,
      chatText: ''
    }
  },
  computed: {
    ...mapState('meeting', ['chatMsgList', 'userList', 'addChatMessage', 'sideBarType']),
    sendToUserList() {
      let tmp = []
      let hostUser
      tmp ? (tmp = pySort(tmp)) : tmp
      if (hostUser) {
        return [
          { id: null, name: this.$vuetify.lang.t('$vuetify.meeting.everyone') },
          { ...hostUser },
          ...tmp
        ]
      }
      return [
        { id: null, name: this.$vuetify.lang.t('$vuetify.meeting.everyone') },
        ...tmp
      ]
    }
  },
  watch: {
    chatMsgList() {
      this.scrollChatToBottom()
    },
    sideBarType(val) {
      if (val === 'MeetingChat') {
        this.scrollChatToBottom()
      }
    }
  },
  mounted() {
    this.scrollChatToBottom()
  },
  methods: {
    ...mapMutations('meeting', ['updateBubbleMessageList']),
    selectSendUser(item) {
      this.selectSendUserFlag = !this.selectSendUserFlag
      this.sendToId = item.id
      this.sendToName = item.name
    },
    sendMessage() {
      this.sendChatMessage(this.chatText, {
        sendToId: this.sendToId,
        sendToName: this.sendToName
      })
      this.chatText = ''
    },
    pressKeyAtChat(e) {
      if (e.keyCode === 13) {
        e.preventDefault()
        if (e.shiftKey) {
          this.chatText += '\n'
        } else {
          this.sendMessage()
        }
        return false
      }
    },
    scrollChatToBottom() {
      this.$nextTick(() => {
        let container = this.$el.querySelector('#chat-msg-list')
        if (container) {
          container.scrollTop = container.scrollHeight
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
#meeting-chat {
  width: 100%;
  height: 100%;
  border-left: rgb(230, 230, 230) solid 1px;
  ::v-deep .v-text-field--placeholder {
    font-size: 12px !important;
    color: #cccccc !important;
  }
  .right-bottom {
    width: 100%;
    height: 56px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    position: absolute;
    bottom: 0;
    border-top: rgb(230, 230, 230) solid 1px;
  }
  .search-name {
    ::v-deep .v-text-field--placeholder {
      font-size: 12px !important;
      color: #cccccc !important;
    }
    ::v-deep .v-input__control {
      min-height: 34px !important;
    }
  }
  #chat-msg-list {
    .chat-list {
      .time {
        width: 100%;
        text-align: center;
        color: #666666;
      }
      .chat-msg {
        flex-shrink: 0;
        .nickname {
          margin-bottom: 3px;
          font-size: 12px;
          line-height: 14px;
          color: #666666;
        }
        .chat-nickname {
          max-width: 120px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          text-align: center;
        }
        .min-chat-nickname {
          max-width: 50px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          text-align: center;
        }
        .content {
          display: inline-block !important;
          padding: 5px 10px;
          border-radius: 4px;
          white-space: pre-wrap;
          word-break: break-all;
          overflow: hidden;
          font-size: 14px;
          font-weight: 400;
          color: #333333;
          line-height: 20px;
          box-sizing: border-box;
        }
        &.sent {
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          .nickname {
            text-align: end;
          }
          .content {
            color: #fff;
            margin-left: 13px;
            display: flex;
            background-color: #127bf8;
          }
        }
        &.receive {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          .nickname {
            text-align: start;
          }
          .content {
            margin-right: 20px;
            background-color: #f8f8f8;
          }
        }
      }
    }
    &::-webkit-scrollbar {
      width: 14px;
      height: 14px;
    }
    &::-webkit-scrollbar-thumb,
    &::-webkit-scrollbar-track {
      border-radius: 999px;
      border: 5px solid transparent;
    }
    &::-webkit-scrollbar-track {
      -webkit-box-shadow: 1px 1px 5px rgba(0, 0, 0, 0.2) inset;
    }
    &::-webkit-scrollbar-thumb {
      min-height: 28px;
      background-clip: content-box;
      -webkit-box-shadow: 0 0 5px rgba(0, 0, 0, 0.2) inset;
    }
    &::-webkit-scrollbar-corner {
      background: transparent;
    }
  }
  .send-chat {
    ::v-deep .v-menu__content {
      box-shadow: 0px 4px 20px 0px rgba(0, 0, 0, 0.1) !important;
    }
    ::v-deep .v-list-item--active {
      background-color: #e6f1fe !important;
    }
  }
  .send-btn {
    ::v-deep .v-btn.v-btn--disabled {
      background-color: #cfe5fe !important;
      color: #fff !important;
    }
    .im-input {
      width: 100%;
      height: 68px;
      font-size: 15px;
      resize: none;
      outline: none;
    }
  }
}
</style>
