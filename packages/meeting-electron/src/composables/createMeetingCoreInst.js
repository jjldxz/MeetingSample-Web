import MeetingCore from '@jjldxz/meeting-core-electron'

export default function CreateMeetingCoreInst() {
  const meetingCore = MeetingCore.createMeeting()
  const meetingRoomCore = MeetingCore.createMeetingRoom()
  return {
    meetingCore,
    meetingRoomCore
  }
}
