<template>
  <div id="home-meetings-list">
    <v-list
      v-if="scheduleMeetings.length > 0"
      class="overflow-x-hidden overflow-y-auto pa-0 flex-fill list-meeting"
    >
      <v-list-item-group>
        <div v-for="(s, i) in scheduleMeetings" :key="i">
          <div class="schedule-title pl-5 pr-5 mb-0">
            <span class="day-month">{{ s.dayOfMonth }}</span>
            <span class="ml-2">{{ s.month }}</span>
            <span class="ml-1">{{ s.dayOfWeek }}</span>
            <span class="ml-1">{{ s.year }}</span>
          </div>
          <div
            v-for="(m, j) in s.meetings"
            :key="j"
            @click.prevent.stop="onShowRoomInfo(m.number)"
          >
            <v-hover v-slot="{ hover }" :key="`${i}-${j}`">
              <v-list-item
                :ripple="false"
                class="pl-5 pr-5"
                :style="hover ? 'background:#EEEEEE;' : ''"
              >
                <v-list-item-content class="pt-3 pb-3">
                  <div class="time-id">
                    <span>{{ formatTime(m.beginAt) }} - {{ formatTime(m.endAt) }}</span>
                    <span class="ml-4">{{ formatMeetingID(m.number) }}</span>
                    <span
                      :class="
                        m.status === 0
                          ? 'ml-4 unstart'
                          : m.status === 1
                          ? 'ml-4 going'
                          : 'ml-4 finished'
                      "
                      >{{ m.statusText }}</span
                    >
                  </div>
                  <div class="d-flex justify-space-between align-center">
                    <span class="pb-1 time-name" style="padding-top: 10px">{{
                      m.name
                    }}</span>
                    <div v-if="hover || m.click" class="d-flex">
                      <div
                        v-if="!dateIsBeforeCurrent(m.endAt) && m.status !== 2"
                        class="d-flex"
                      >
                        <div class="enter-one">
                          <v-btn
                            color="#127BF8"
                            max-height="24"
                            max-width="49"
                            min-height="24"
                            min-width="49"
                            depressed
                            tile
                            small
                            dark
                            @click.prevent.stop="onEnterMeeting(m)"
                          >
                            <div class="d-flex align-center">
                              <span class="normal-text">{{
                                $vuetify.lang.t('$vuetify.meeting.enter')
                              }}</span>
                            </div>
                          </v-btn>
                        </div>
                        <v-menu offset-y rounded style="z-index: 88" nudge-bottom="8">
                          <template #activator="{ on, attrs }">
                            <div class="enter-two">
                              <div class="divider" />
                              <v-btn
                                max-height="24"
                                max-width="26"
                                min-height="24"
                                min-width="26"
                                color="#127BF8"
                                v-bind="attrs"
                                tile
                                depressed
                                small
                                dark
                                v-on="on"
                              >
                                <v-img
                                  class="pl-2"
                                  max-height="6"
                                  max-width="12"
                                  min-height="6"
                                  min-width="12"
                                  src="@/assets/down.svg"
                                />
                              </v-btn>
                            </div>
                          </template>
                          <v-list
                            dense
                            width="120"
                            flat
                            @mouseenter.native="mouseenter(m)"
                            @mouseleave.native="mouseleave(m)"
                          >
                            <v-list-item class="mr-1" dense link style="min-height: 24px">
                              <v-list-item-title
                                class="d-flex justify-center"
                                style="line-height: 14px"
                                @click="onCopyInvitation(m.number, m.ownerName)"
                                >{{
                                  $vuetify.lang.t('$vuetify.meeting.copyInvitation')
                                }}</v-list-item-title
                              >
                            </v-list-item>
                            <v-list-item
                              v-show="m.status === 0 && m.ownerId === loginUserInfo.id"
                              style="min-height: 24px; margin-top: 5px"
                              class="mb-1"
                              dense
                              link
                              @click="onShowCancelDlg(m.number)"
                            >
                              <v-list-item-title
                                class="d-flex justify-center red-text"
                                style="line-height: 14px"
                                >{{
                                  $vuetify.lang.t('$vuetify.meeting.cancelMeeting')
                                }}</v-list-item-title
                              >
                            </v-list-item>
                          </v-list>
                        </v-menu>
                      </div>
                      <v-chip
                        v-else
                        color="#127BF8"
                        max-height="24"
                        max-width="49"
                        min-height="24"
                        min-width="49"
                        depressed
                        :label="true"
                        small
                        dark
                      >
                        {{ $vuetify.lang.t('$vuetify.meeting.expired') }}
                      </v-chip>
                    </div>
                  </div>
                </v-list-item-content>
              </v-list-item>
            </v-hover>
            <v-divider class="ml-5 mr-5" />
          </div>
        </div>
      </v-list-item-group>
    </v-list>
    <div
      v-if="scheduleMeetings.length === 0"
      class="d-flex justify-center align-center flex-fill no-meeting flex-column"
    >
      <v-img class="mt-16" max-height="110" max-width="140" src="@/assets/no_list.png" />
      <div class="mt-4">{{ $vuetify.lang.t('$vuetify.meeting.noMeetings') }}</div>
    </div>
  </div>
</template>

<script>
import { reactive, onBeforeMount } from '@vue/composition-api'
import moment from 'moment-timezone'
import getScheduleMeetings from '../../composables/getScheduleMeetings'
import { mapState } from 'vuex'
import { formatMeetingID, dateIsBeforeCurrent } from '@/utils'
import { CustomEvents, IPCEvents, TIME_ZONE } from '../../common'

export default {
  name: 'MeetingsList',
  setup(props, context) {
    let scheduleMeetings = reactive([])
    const getMeetings = async () => {
      scheduleMeetings.length = 0
      let { meetings } = await getScheduleMeetings(context.root.$vuetify)
      scheduleMeetings.push(...meetings)
    }
    onBeforeMount(getMeetings)
    return { scheduleMeetings, getMeetings }
  },
  computed: {
    ...mapState('users', ['loginUserInfo'])
  },
  beforeMount() {
    this.$eventBus.$on(CustomEvents.UPDATE_MEETING_LIST, () => {
      this.getMeetings()
    })
    window.ipc.on(IPCEvents.HOME.UPDATE_MEETING_LIST, () => {
      this.getMeetings()
    })
  },
  methods: {
    formatTime(date) {
      if (!date) return ''
      return moment.utc(date).tz(TIME_ZONE).format('HH:mm')
    },
    formatMeetingID(id) {
      if (!id) return ''
      return formatMeetingID(id)
    },
    dateIsBeforeCurrent(date) {
      return dateIsBeforeCurrent(date)
    },
    mouseenter(m) {
      this.$set(m, 'click', true)
    },
    mouseleave(m) {
      this.$set(m, 'click', false)
    },
    onShowRoomInfo(meetingId) {},
    onEnterMeeting(meetingInfo) {
      this.$tmpStore.set('meetingInfo', meetingInfo)
      this.$tmpStore.set('videoMute', true)
      this.$tmpStore.set('audioMute', false)
      this.$tmpStore.set('userName', this.loginUserInfo.username)
      window.ipc.send(IPCEvents.OPEN_MEETING_WIN)
    },
    onCopyInvitation(meetingId, owner) {},
    onShowCancelDlg(meetingId) {}
  }
}
</script>

<style lang="scss" scoped>
#home-meetings-list {
  .flex-fill {
    flex: 1 !important;
  }
  .no-meeting {
    position: absolute;
    width: 100%;
  }
  .schedule-title {
    margin-top: 14px;
    margin-bottom: 16px;
    font-size: 14px;
  }
  .day-month {
    font-size: 24px;
  }
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
  .time-name {
    font-size: 14px;
  }
  .enter-one {
    .v-btn:not(.v-btn--round).v-size--small {
      border-radius: 4px 0 0 4px;
    }
  }
  .enter-two {
    display: flex;
    position: relative;
    .divider {
      position: absolute;
      background: #9fcafc;
      width: 1px;
      height: 10px;
      top: 7px;
      z-index: 9;
    }
    .v-btn:not(.v-btn--round).v-size--small {
      border-radius: 0 4px 4px 0;
    }
  }
}
</style>
