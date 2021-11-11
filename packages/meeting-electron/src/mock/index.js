import Mock from 'mockjs'
import { MeetingRole } from '../common'

export const { MockUsers, MockChatMsgList } = Mock.mock({
  'MockUsers|1-5': [
    {
      'id|100000000-999999999': 1,
      'extId|+1': 1,
      groupId: 0,
      name: '@name',
      'role|1': Object.keys(MeetingRole)
        .map((r) => MeetingRole[r])
        .filter((r) => r !== MeetingRole.Share),
      avatar: '',
      state: {
        video: false,
        audio: true,
        hand: false,
        share: 'none'
      }
    }
  ],
  'MockChatMsgList|20-100': [
    {
      'content|10-20': '@string',
      'role|1': ['sender', 'receiver'],
      userAvatar: '',
      userName: '@cname'
    }
  ]
})
