<template>
  <v-dialog v-model="showDlg" width="520" persistent>
    <v-card id="breakout-group">
      <app-bar
        :title="
          currentComponent === 'GroupMain'
            ? $vuetify.lang.t('$vuetify.meeting.createBreakoutGroups')
            : $vuetify.lang.t('$vuetify.meeting.group')
        "
        :minus-btn="false"
        :on-close="onClose"
      />
      <v-divider class="pa-0" />
      <v-card-text class="group-content pl-0 pr-0 mt-2">
        <component
          :is="currentComponent"
          :group-cnt="groupCnt"
          :auto-add-attendees="autoAddAttendees"
          :ready-for-break-out-users.sync="readyForBreakOutUsers"
          :attendees-cnt-per-group.sync="attendeesCntPerGroup"
          @goTo="onGoTo"
          @clearReadyUsers="readyForBreakOutUsers = []"
          @updateBreakoutUsers="readyForBreakOutUsers = $event"
          @overlay="showOverlay = $event"
          @close="onClose"
        />
        <v-overlay :value="showOverlay" absolute>
          <v-progress-circular color="#127bf8" indeterminate size="48" />
        </v-overlay>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script>
import AppBar from '../../common/appBar'
import GroupMain from './groupMain'
import GroupDetail from './groupDetail'
import { mapState } from 'vuex'
import { MeetingRole } from '../../../common'
import MeetingUsers from '../../../composables/meetingUsers'

export default {
  name: 'BreakoutGroup',
  components: { AppBar, GroupMain, GroupDetail },
  model: {
    prop: 'show',
    event: 'close'
  },
  props: {
    show: {
      type: Boolean,
      default: false
    }
  },
  setup(props, content) {
    const { attendees } = MeetingUsers(content.root.$store)
    return { attendeesList: attendees }
  },
  data() {
    return {
      showDlg: false,
      currentComponent: null,
      groupCnt: 1,
      autoAddAttendees: true,
      readyForBreakOutUsers: [],
      attendeesCntPerGroup: 0,
      showOverlay: false
    }
  },
  computed: {
    ...mapState('meeting', ['breakoutGroupStatus'])
  },
  watch: {
    show(val) {
      this.showDlg = val
      if (val && this.currentComponent === 'GroupMain') {
        this.getReadyUsers()
      }
    },
    showDlg(val) {
      if (val) {
        this.currentComponent = this.breakoutGroupStatus ? 'GroupDetail' : 'GroupMain'
      }
    },
    currentComponent(val) {
      if (val === 'GroupMain') {
        this.getReadyUsers()
      }
    },
    attendeesList() {
      this.getReadyUsers()
    }
  },
  mounted() {
    this.showDlg = this.show
  },
  methods: {
    onClose() {
      this.$emit('close', false)
    },
    onGoTo(component, opts = {}) {
      if (component === 'GroupDetail') {
        this.groupCnt = opts.hasOwnProperty('groupCnt') ? opts.groupCnt : this.groupCnt
        this.autoAddAttendees = opts.hasOwnProperty('autoAddAttendees')
          ? opts.autoAddAttendees
          : this.autoAddAttendees
        this.attendeesCntPerGroup = opts.hasOwnProperty('attendeesCntPerGroup')
          ? opts.attendeesCntPerGroup
          : this.attendeesCntPerGroup
      }
      this.currentComponent = component
    },
    getReadyUsers() {
      this.readyForBreakOutUsers = this.attendeesList
        .filter((u) => u.role === MeetingRole.Attendee)
        .map((u) => {
          return {
            ...u,
            inRoom: false
          }
        })
    },
    bindEvents() {}
  }
}
</script>

<style lang="scss" scoped>
#breakout-group {
}
</style>
