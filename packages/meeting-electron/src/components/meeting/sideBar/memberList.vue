<template>
  <div id="attendees-list" ref="attendees">
    <v-divider />
    <v-row class="ma-0">
      <v-col cols="12" class="pl-0 pr-3 pt-0 pb-0 search-name d-flex align-center">
        <v-text-field
          v-model="searchName"
          color="light-blue"
          :placeholder="$vuetify.lang.t('$vuetify.meeting.searchAttendees')"
          autocomplete="off"
          hide-details
          flat
          solo
          dense
        >
          <template slot="prepend-inner">
            <div class="d-icon pt-1 pr-2">
              <img alt src="@/assets/search.svg" />
            </div>
          </template>
        </v-text-field>
        <span class="normal-text">
          {{ $vuetify.lang.t('$vuetify.meeting.attendees') }}({{ attendeesCount }})
        </span>
      </v-col>
    </v-row>
    <v-divider />
    <v-list
      style="height: calc(100% - 96px)"
      class="overflow-y-auto overflow-x-hidden pa-0"
    >
      <member-list-item v-for="u in attendeeList" :key="u.id" :user="u" />
    </v-list>
    <div class="right-bottom">
      <div
        v-if="!breakoutGroupStatus && (isHost || isCoHost)"
        class="flex-center"
        style="justify-content: space-around"
      >
        <!-- 全体静音弹框 -->
        <v-dialog
          v-model="muteAudioAllDlg"
          width="350"
          :retain-focus="false"
          persistent
          no-click-animation
        >
          <template #activator="{ on, attrs }">
            <v-btn
              v-bind="attrs"
              :class="[meetingAudioMute ? 'white--text' : '']"
              color="#127BF8"
              height="30px"
              width="113px"
              :outlined="!meetingAudioMute"
              depressed
              v-on="on"
            >
              <span class="normal-text">{{
                $vuetify.lang.t('$vuetify.meeting.muteAll')
              }}</span>
            </v-btn>
          </template>
          <v-card>
            <div class="pt-5 pb-5 pl-11 pr-11">
              <span class="big-text flex-center">{{
                $vuetify.lang.t('$vuetify.meeting.muteAllText')
              }}</span>
              <v-checkbox
                v-model="enableAudioChange"
                color="#127bf8"
                hide-details
                off-icon="mdi-square"
                dense
              >
                <template #label>
                  <span style="font-size: 12px">{{
                    $vuetify.lang.t('$vuetify.meeting.enableAudioChange')
                  }}</span>
                </template>
              </v-checkbox>
            </div>
            <v-divider />
            <v-card-actions
              class="d-flex align-center pl-0 pr-0 pt-0 pb-0 justify-space-between"
            >
              <v-btn
                class="mr-0"
                depressed
                height="38"
                color="#ffff"
                tile
                width="174"
                @click="muteAudioAllDlg = false"
                >{{ $vuetify.lang.t('$vuetify.meeting.cancel') }}</v-btn
              >
              <v-divider vertical />
              <v-btn
                class="mr-0"
                depressed
                height="38"
                color="#fff"
                width="174"
                @click="onMuteAllAudio"
                ><span class="pt-0 mb-0" style="color: #127bf8">{{
                  $vuetify.lang.t('$vuetify.meeting.muteAll')
                }}</span></v-btn
              >
            </v-card-actions>
          </v-card>
        </v-dialog>
        <!-- eslint-disable-next-line vue/max-attributes-per-line -->
        <v-btn color="#127BF8" height="30px" width="113px" outlined @click="unmuteAll">
          <span class="normal-text">{{
            $vuetify.lang.t('$vuetify.meeting.unmuteAll')
          }}</span></v-btn
        >
      </div>
      <div v-else class="flex-center" style="justify-content: space-around" />
    </div>
  </div>
</template>

<script>
import MemberListItem from './memberListItem'
import { mapMutations, mapState } from 'vuex'
import { MeetingRole } from '../../../common'
import { clipboard } from 'electron'
import MeetingUsers from '../../../composables/meetingUsers'

export default {
  name: 'MeetingMemberList',
  components: { MemberListItem },
  setup(props, content) {
    const { attendees } = MeetingUsers(content.root.$store)
    return { memberList: attendees }
  },
  data() {
    return {
      searchName: '',
      muteAudioAllDlg: false,
      enableAudioChange: true
    }
  },
  computed: {
    ...mapState('meeting', [
      'isHost',
      'isCoHost',
      'breakoutGroupStatus',
      'meetingAudioMute'
    ]),
    attendeeList() {
      return this.memberList.filter((u) => u.name.indexOf(this.searchName) !== -1)
    },
    attendeesCount() {
      return this.attendeeList.length
    }
  },
  methods: {
    unmuteAll() {
      window.meetingRoomCore.unmuteRoomAudio()
    },
    onMuteAllAudio() {
      window.meetingRoomCore.muteRoomAudio(this.enableAudioChange)
      this.muteAudioAllDlg = false
    }
  }
}
</script>

<style lang="scss" scoped>
#attendees-list {
  width: 100%;
  height: 100%;
  .right-bottom {
    height: 56px;
    margin-top: 10px;
  }
}
</style>
