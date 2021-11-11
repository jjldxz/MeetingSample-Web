export const ErrorCode = {
  REGISTER_USER_FAIL: 20002,
  USER_NOT_FOUND: 20004,
  INVALID_PASSWORD: 20005,
  TOKEN_EXPIRED: 20006,
  TOKEN_INVALID: 20007,
  NEW_MEETING_FAILED: 30002,
  MEETING_NOT_FOUND: 30003,
  MEETING_IS_OVER: 30006,
  MEETING_NOT_START: 30007,
  OTHER_SHARING: 30008,
  CHANGE_PASSWORD_FAILED: 40001,
  POLL_INPUT: 50001,
  GET_POLL_LIST_FAILED: 50002,
  POLL_NOT_FOUND: 50003,
  POLL_NO_PERMISSION: 50004,
  POLL_ALREADY_START: 50006,
  POLL_NOT_START: 50007,
  POLL_IS_CLOSED: 50008,
  POLL_ALREADY_DONE: 50009
}

export default function getHttpErrorMessage(code) {
  const CodeToMessage = new Map([
    [ErrorCode.MEETING_IS_OVER, this.$vuetify.lang.t('$vuetify.meeting.meetingExport')],
    [
      ErrorCode.MEETING_NOT_START,
      this.$vuetify.lang.t('$vuetify.meeting.meetingNotStart')
    ]
  ])
  return CodeToMessage.get(code)
}
