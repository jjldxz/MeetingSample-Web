<template>
  <section id="more-click">
    <!-- eslint-disable-next-line vue/max-attributes-per-line -->
    <v-menu v-model="more" top max-height="200" nudge-top="55" attach="#more-click">
      <template #activator="{ on, attrs }">
        <section class="invite-btn">
          <v-btn
            :ripple="false"
            class="pl-1 pr-1 flex-column align-center"
            min-width="70"
            height="56"
            light
            v-bind="attrs"
            v-on="on"
          >
            <span class="normal-text title-center">{{
              $vuetify.lang.t('$vuetify.meeting.more')
            }}</span>
            <v-icon color="#999999" class="bottom-bar-img" size="22">mdi-more</v-icon>
          </v-btn>
        </section>
      </template>
      <v-list class="pa-0" dense min-width="100">
        <section v-for="(item, idx) in menuList" :key="idx">
          <section v-show="item.show">
            <v-divider v-if="idx > 0" class="ml-1 mr-1" />
            <v-list-item
              style="min-height: 30px"
              class="pa-0 d-flex justify-center"
              dense
            >
              <v-btn
                :ripple="false"
                height="30"
                width="100%"
                class="flex-row align-center"
                @click="item.onClick"
              >
                <span class="normal-text title-center">{{ item.title }}</span>
              </v-btn>
            </v-list-item>
          </section>
        </section>
      </v-list>
    </v-menu>
  </section>
</template>

<script>
import { mapState } from 'vuex'
import { CustomEvents } from '../../../common'

export default {
  name: 'MeetingBottomBtnMore',
  data() {
    return {
      more: false
    }
  },
  computed: {
    ...mapState('meeting', ['isHost', 'isCoHost', 'breakoutGroupStatus']),
    menuList() {
      return [
        {
          title:
            this.isHost || this.isCoHost
              ? this.$vuetify.lang.t('$vuetify.meeting.createPoll')
              : this.$vuetify.lang.t('$vuetify.meeting.polling'),
          onClick: this.onOpenPoll,
          show: true
        },
        {
          title: this.breakoutGroupStatus
            ? this.$vuetify.lang.t('$vuetify.meeting.groupManagement')
            : this.$vuetify.lang.t('$vuetify.meeting.createBreakoutGroups'),
          onClick: this.onOpenBreakoutGroup,
          show: this.isCoHost || this.isHost
        },
        {
          title: this.$vuetify.lang.t('$vuetify.meeting.callHost'),
          onClick: this.onCallHost,
          show: this.breakoutGroupStatus && !(this.isHost || this.isCoHost)
        }
      ]
    }
  },
  methods: {
    onOpenPoll() {
      this.$eventBus.$emit(CustomEvents.OPEN_POLL)
    },
    onOpenBreakoutGroup() {
      this.$eventBus.$emit(CustomEvents.OPEN_BREAKOUT_GROUP)
    },
    onCallHost() {
      window.meetingRoomCore.callHostToBreakoutGroup(window.meetingRoomCore.user.groupId)
    }
  }
}
</script>

<style scoped></style>
