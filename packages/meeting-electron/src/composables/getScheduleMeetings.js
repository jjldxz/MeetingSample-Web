import { reactive, ref } from '@vue/composition-api'
import moment from 'moment-timezone'
import { TIME_ZONE } from '../common'

export default async function getScheduleMeetings(i18n) {
  let meetings = reactive([])
  let tmp = ref(0)
  const getStateStr = (status) => {
    const statusMap = {
      0: i18n.lang.t('$vuetify.meeting.upcoming'),
      1: i18n.lang.t('$vuetify.meeting.going'),
      2: i18n.lang.t('$vuetify.meeting.finish')
    }
    return statusMap[status]
  }
  const isToday = (date) => {
    let d = new Date(date).setHours(0, 0, 0, 0)
    let today = new Date().setHours(0, 0, 0, 0)
    let obj = {
      0: i18n.lang.t('$vuetify.meeting.today'),
      86400000: i18n.lang.t('$vuetify.meeting.tomorrow')
    }

    return obj[d - today] || null
  }

  const resp = await window.meetingCore.getMeetingsList()
  console.log(resp)
  let tempList = []
  for (const r of resp) {
    const statusText = getStateStr(r.status)
    const date = moment.utc(r.beginAt).tz(TIME_ZONE)
    const dateStr = date.format('YYYY-MM-DD')
    const idx = tempList.findIndex((h) => h.dateStr === dateStr)
    if (idx !== -1) {
      tempList[idx].meetings.push({ ...r, statusText: statusText })
    } else {
      const dayOfMonth = date.format('D')
      let dayOfWeek = date.format('ddd')
      let month = date.format('MMM')
      const year = date.format('YYYY')
      month = i18n.lang.t(`$vuetify.meeting.${month}`)
      const today = isToday(date)
      if (today) {
        dayOfWeek = today
      } else {
        dayOfWeek = i18n.lang.t(`$vuetify.meeting.${dayOfWeek}`)
      }
      tempList.push({
        date,
        dateStr,
        dayOfMonth,
        dayOfWeek,
        month,
        year,
        meetings: [{ ...r, statusText: statusText }]
      })
    }
  }
  meetings.push(...tempList)
  return {
    meetings
  }
}
