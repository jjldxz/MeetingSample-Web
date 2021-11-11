import { ChatItemType } from '../common'

export default function chatMessage(store) {
  const sendChatMessage = (msg, opts = {}) => {
    const sendToId = opts.hasOwnProperty('sendToId') ? opts.sendToId : null
    const sendToName = opts.hasOwnProperty('sendToName')
      ? opts.sendToName
      : this.$vuetify.lang.t('$vuetify.meeting.everyone')
    msg = msg ? msg.Trim() : msg
    if (msg) {
      const tmp = {
        role: ChatItemType.Sender,
        content: msg,
        userName: window.meetingRoomCore.user.name,
        userRole: window.meetingRoomCore.user.role,
        groupId: window.meetingRoomCore.user.groupId,
        userAvatar: window.meetingRoomCore.user.avatar,
        sendToId,
        sendToName
      }
      const needBubble = opts.hasOwnProperty('needBubble') ? opts.needBubble : false
      if (sendToId && !needBubble) {
        window.chatClient.sendMessage(msg, {}, sendToId)
      } else {
        window.chatClient.sendMessage(msg, {
          bubble: needBubble ? 1 : null
        })
      }
      store.commit('meeting/addChatMessage', tmp)
    }
  }

  return { sendChatMessage }
}
