<template>
  <keep-alive>
    <component :is="currentComponent" @goTo="onGoTo" />
  </keep-alive>
</template>

<script>
import MeetingChat from './meetingChat'
import MeetingMemberList from './memberList'
import { CustomEvents } from '../../../common'
import { mapState } from 'vuex'

export default {
  name: 'MeetingSideBar',
  components: { MeetingChat, MeetingMemberList },
  data() {
    return {
      currentComponent: MeetingMemberList
    }
  },
  computed: {
    ...mapState('meeting', ['sideBarType'])
  },
  watch: {
    sideBarType(val) {
      this.onGoTo(val ? val : 'MeetingMemberList')
    }
  },
  mounted() {
    this.onGoTo(this.sideBarType ? this.sideBarType : 'MeetingMemberList')
  },
  methods: {
    onGoTo(component) {
      this.currentComponent = component
    }
  }
}
</script>

<style scoped></style>
