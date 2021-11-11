import { reactive, ref, computed } from '@vue/composition-api'
import { MeetingRole } from '../common'

export default function MeetingUsers(store) {
  const meetingStoreState = store.state.meeting

  const attendees = computed(() => {
    let users = reactive([])
    let tmp = meetingStoreState.userList.filter(
      (u) =>
        u.role !== MeetingRole.Share &&
        u.role !== MeetingRole.Record &&
        u.groupId === window.meetingRoomCore.user.groupId
    )
    users.push(...tmp)
    return users
  })
  const attendeesCount = computed(() => {
    let count = ref(0)
    count.value = attendees.value.length
    return count
  })
  const videoList = computed(() => {
    let users = reactive([])
    let tmp = meetingStoreState.userList.filter(
      (u) =>
        u.role !== MeetingRole.Record && u.groupId === window.meetingRoomCore.user.groupId
    )
    users.push(...tmp)
    return users
  })
  return { attendees, attendeesCount, videoList }
}
