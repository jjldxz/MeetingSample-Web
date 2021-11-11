import moment from 'moment-timezone'
import { TIME_ZONE } from '../common'
import { formatMeetingID, createInvitationMessage } from '../utils'

export default async function AddScheduleToCalendar(meetingId, inviteOwnerName, i18n) {
  const getInvitationMessage = async () => {
    const resp = await window.meetingCore.getMeetingInfo(meetingId)
    const copyInvitationContent = createInvitationMessage(resp, inviteOwnerName, i18n)
    return { copyInvitationContent, resp }
  }

  const { copyInvitationContent, resp } = await getInvitationMessage()
  const statTime = moment.utc(resp.beginAt).tz(TIME_ZONE).format('YYYY,MM,DD,HH,mm')
  const endTime = moment.utc(resp.endAt).tz(TIME_ZONE).format('YYYY,MM,DD,HH,mm')
  let start = statTime.split(',').map((time) => {
    return Number(time)
  })
  let end = endTime.split(',').map((time) => {
    return Number(time)
  })
  let meetingInfo = {
    ...resp,
    start: start,
    end: end,
    des: copyInvitationContent
  }
  // 根据会议信息创建isc 文件并保存
  window.ipc.send('create-ics', meetingInfo)
  // 加入日历成功
  window.ipc.on('open-isc-success', (id) => {
    console.debug('add success ics')
  })

  return { getInvitationMessage }
}
