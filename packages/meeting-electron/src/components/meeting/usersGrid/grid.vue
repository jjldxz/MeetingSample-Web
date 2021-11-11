<template>
  <div id="users-gird">
    <user-avatars-grid v-show="showAvatarGrid" />
    <user-videos-grid v-show="!showAvatarGrid" />
  </div>
</template>

<script>
import UserAvatarsGrid from './userAvatarsGrid'
import UserVideosGrid from './userVideosGrid'
import { mapState } from 'vuex'

export default {
  name: 'UsersGrid',
  components: { UserAvatarsGrid, UserVideosGrid },
  computed: {
    ...mapState('meeting', ['videoOnUserList']),
    showAvatarGrid() {
      return this.videoOnUserList.length === 0
    }
  }
}
</script>

<style lang="scss" scoped>
#users-gird {
  width: 100%;
  height: 100%;
}
</style>
