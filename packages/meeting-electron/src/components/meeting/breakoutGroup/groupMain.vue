<template>
  <div id="group-home" class="pr-5" style="margin-left: 50px">
    <div>
      <span class="big-text">{{
        $vuetify.lang.t('$vuetify.meeting.assignUserToNotice')
      }}</span>
    </div>
    <div class="mt-2 d-flex">
      <v-btn
        :disabled="groupCnt === 1"
        :ripple="false"
        color="#cfe5fe"
        x-small
        class="pa-0"
        width="24"
        height="24"
        depressed
        @click="onMinusRoomCount"
      >
        <v-icon :color="groupCnt === 1 ? '#CCCCCC !important' : '#127BF8'" size="14">
          mdi-minus
        </v-icon>
      </v-btn>
      <div class="big-text group-cnt">{{ groupCnt }}</div>
      <v-btn
        :disabled="groupCnt === 99"
        :ripple="false"
        color="#cfe5fe"
        x-small
        class="pa-0"
        width="24"
        height="24"
        depressed
        @click="onPlusRoomCount"
      >
        <v-icon :color="groupCnt === 99 ? '#CCCCCC !important' : '#127BF8'" size="14">
          mdi-plus
        </v-icon>
      </v-btn>
    </div>
    <div class="mt-7">
      <div>
        <span class="big-text">{{
          $vuetify.lang.t('$vuetify.meeting.groupPeople')
        }}</span>
      </div>
      <v-radio-group v-model="breakoutGroupType" class="mt-1" mandatory>
        <div class="d-flex align-center">
          <v-radio
            color="#127BF8"
            class="mb-0"
            :label="$vuetify.lang.t('$vuetify.meeting.Automatically')"
            value="auto"
          />
          <div
            class="normal-text"
            style="color: #999999; margin-left: 30px; margin-bottom: 0"
          >
            {{
              $vuetify.lang.t(
                '$vuetify.meeting.userCntPerGroupNotice',
                memberCntOfPerRoom
              )
            }}
          </div>
        </div>
        <v-radio
          color="#127BF8"
          class="mb-0"
          :label="$vuetify.lang.t('$vuetify.meeting.Manually')"
          value="manual"
        />
      </v-radio-group>
    </div>
    <div class="d-flex justify-end mt-4">
      <div class="xz-btn-disable">
        <v-btn
          min-width="80"
          height="30"
          class="white--text"
          :disabled="disableBreakoutRooms"
          color="#127BF8"
          depressed
          block
          @click="onCreateRooms"
          >{{ $vuetify.lang.t('$vuetify.meeting.createBreakoutGroups') }}</v-btn
        >
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'GroupMain',
  props: {
    readyForBreakOutUsers: {
      type: Array,
      default() {
        return []
      }
    }
  },
  data() {
    return {
      groupCnt: 1,
      breakoutGroupType: null
    }
  },
  computed: {
    userCnt() {
      return this.readyForBreakOutUsers.length
    },
    memberCntOfPerRoom() {
      return this.groupCnt > 0
        ? this.userCnt % this.groupCnt === 0
          ? this.userCnt / this.groupCnt
          : Math.ceil(this.userCnt / this.groupCnt)
        : 0
    },
    disableBreakoutRooms() {
      return this.userCnt === 0
    }
  },
  methods: {
    onMinusRoomCount() {
      if (this.groupCnt > 1) {
        --this.groupCnt
      }
    },
    onPlusRoomCount() {
      if (this.groupCnt < 99) {
        ++this.groupCnt
      }
    },
    onCreateRooms() {
      this.$emit('goTo', 'GroupDetail', {
        groupCnt: this.groupCnt,
        autoAddAttendees: this.breakoutGroupType !== 'manual',
        attendeesCntPerGroup: this.memberCntOfPerRoom
      })
    }
  }
}
</script>

<style lang="scss" scoped>
#group-home {
  .group-cnt {
    width: 40px;
    text-align: center;
    height: 24px;
    line-height: 24px;
    background: #f8f8f8;
    margin: 0 10px;
    border-radius: 4px;
  }
}
</style>
