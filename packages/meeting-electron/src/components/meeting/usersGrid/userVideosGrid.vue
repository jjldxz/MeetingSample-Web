<template>
  <div id="user-video-grid" :class="[lrVideoAreaClass]">
    <div v-show="gridType === GridTypes.TYPE_LR" class="left-video-grid" />
    <div :class="[rightVideoAreaClass]" style="padding-top: 1px; padding-right: 1px">
      <user-video-item
        v-for="u in videoList"
        :key="u.id"
        :grid-type.sync="gridType"
        :user="u"
      />
    </div>
  </div>
</template>

<script>
import UserVideoItem from './userVideoItem'
import { GridTypes } from '../../../common'
import { mapGetters, mapMutations, mapState } from 'vuex'
import MeetingUsers from '../../../composables/meetingUsers'

export default {
  name: 'UserVideosGrid',
  components: { UserVideoItem },
  setup(props, content) {
    const { videoList } = MeetingUsers(content.root.$store)
    return { videoList }
  },
  data() {
    return {
      GridTypes: GridTypes,
      rightVideoAreaClass: 'right-video-grid',
      lrVideoAreaClass: 'lr-layout-main'
    }
  },
  computed: {
    ...mapState('meeting', ['gridType', 'gridTypeAutoChange'])
  },
  watch: {
    videoList(val) {
      if (!this.gridTypeAutoChange) return
      let gridType
      if (!this.gridType) {
        gridType = GridTypes.TYPE_1
      } else {
        if (this.gridType === GridTypes.TYPE_LR && val.length > 1) {
          return
        }
        if (val.length === 1) {
          gridType = GridTypes.TYPE_1
        } else if (val.length > 1 && val.length <= 9) {
          gridType = GridTypes.TYPE_3
        } else if (val.length > 9 && val.length <= 16) {
          gridType = GridTypes.TYPE_4
        } else {
          gridType = GridTypes.TYPE_5
        }
      }
      this.setGridType(gridType)
    },
    gridType(val) {
      switch (val) {
        case GridTypes.TYPE_1:
        case GridTypes.TYPE_3:
        case GridTypes.TYPE_4:
        case GridTypes.TYPE_5:
          this.rightVideoAreaClass = 'right-video-grid'
          this.lrVideoAreaClass = ''
          break
        case GridTypes.TYPE_LR:
          this.rightVideoAreaClass = 'right-video-grid-lr'
          this.lrVideoAreaClass = 'lr-layout-main'
          break
        default:
          this.rightVideoAreaClass = ''
          break
      }
    }
  },
  methods: {
    ...mapMutations('meeting', ['setGridType'])
  }
}
</script>

<style lang="scss" scoped>
#user-video-grid {
  padding: 0;
  margin: 0;
  width: 100%;
  height: 100%;
  overflow-y: auto;
  overflow-x: hidden;
  background-color: black;
  &.lr-layout-main {
    display: flex;
  }
  .left-video-grid {
    width: 77%;
    height: 100%;
  }
  .right-video-grid-lr {
    width: 23%;
    overflow-y: auto;
    overflow-x: hidden;
  }
  .right-video-grid {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: center;
    align-content: flex-start;
    width: 100%;
    height: 100%;
    overflow-y: auto;
    overflow-x: hidden;
  }
}
</style>
