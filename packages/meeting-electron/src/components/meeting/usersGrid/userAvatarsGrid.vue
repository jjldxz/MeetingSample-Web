<template>
  <v-row id="user-avatars-grid" class="overflow-x-hidden overflow-y-auto flex-center">
    <v-col
      v-for="user in attendees"
      :key="user.id"
      md="2"
      class="flex-column flex-center"
    >
      <v-avatar size="80">
        <v-img
          min-width="80px"
          min-height="80px"
          class="default-user-avatar"
          :src="user.avatar ? user.avatar : require('@/assets/default-avatar.png')"
          alt=""
        />
      </v-avatar>
      <div class="flex-center" style="width: 68px; height: 18px; margin-top: -12px">
        <v-avatar v-if="user.role === 'host'" size="18" color="orange">
          <v-img src="@/assets/host.png" />
        </v-avatar>
      </div>
      <div class="flex-center mt-3" style="width: 80px">
        <span
          style="font-size: 12px; white-space: nowrap; color: #333333"
          v-html="user.name"
        />
        <v-img
          max-width="14"
          width="14"
          height="18"
          max-height="20"
          class="ml-2"
          :src="
            user.state.audio
              ? require('@/assets/unmute.png')
              : require('@/assets/mute.png')
          "
        />
      </div>
    </v-col>
  </v-row>
</template>

<script>
import { mapGetters, mapState } from 'vuex'
import MeetingUsers from '../../../composables/meetingUsers'
import { MeetingRole } from '../../../common'
import { MeetingCoreRoomEvents } from '../../../common/renderCommon'

export default {
  name: 'UserAvatarsGrid',
  setup(props, { root }) {
    const { attendees } = MeetingUsers(root.$store)
    return { attendees }
  }
}
</script>

<style lang="scss" scoped>
#user-avatars-grid {
  padding: 0;
  margin: 0;
  width: 100%;
  height: 100%;
}
</style>
