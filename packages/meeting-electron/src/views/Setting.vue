<template>
  <div id="setting">
    <app-bar :title="$vuetify.lang.t('$vuetify.meeting.settings')" @minimize="onMinus" />
    <div class="d-flex fill-height ml-2 pt-5">
      <v-tabs v-model="tab" vertical>
        <v-tab
          v-for="(t, i) in tabs"
          :id="t.id"
          :key="i"
          class="justify-start pl-1"
          :to="t.to"
        >
          <img
            alt
            :src="tab === t.to ? t.colorIcon : t.icon"
            class="pr-3 pl-2 img-icon"
          />
          <span class="big-text">{{
            $vuetify.lang.t(`$vuetify.meeting.${t.name}`)
          }}</span>
        </v-tab>
      </v-tabs>
      <router-view class="flex-fill" />
    </div>
  </div>
</template>

<script>
import AppBar from '../components/common/appBar'
import createMeetingCore from '../composables/createMeetingCoreInst'

export default {
  name: 'Setting',
  components: { AppBar },
  setup() {
    const { meetingRoomCore } = createMeetingCore()
    window.meetingRoomCore = meetingRoomCore
    return { meetingRoomCore }
  },
  data: (vm) => ({
    tab: null,
    tabs: [
      {
        id: 'settingVideoTab',
        name: 'videoSetting',
        icon: require('@/assets/video.svg'),
        colorIcon: require('@/assets/video_color.svg'),
        to: '/setting/video'
      },
      {
        id: 'settingAudioTab',
        name: 'audioSetting',
        icon: require('@/assets/audio.svg'),
        colorIcon: require('@/assets/audio_color.svg'),
        to: '/setting/audio'
      },
      {
        id: 'settingNetworkTab',
        name: 'networkTest',
        icon: require('@/assets/net_test.svg'),
        colorIcon: require('@/assets/net_test_color.svg'),
        to: '/setting/network'
      }
    ]
  }),
  computed: {},
  watch: {
    tab(value) {
      console.log(value)
    }
  },
  created() {},
  beforeMount() {},
  mounted() {
    document.querySelector('#settingVideoTab').dispatchEvent(new MouseEvent('click'))
  },
  methods: {
    onClose() {
      window.close()
    },
    onMinus() {
      window.ipc.send('settings-minimum')
    }
  }
}
</script>

<style lang="scss" scoped>
#setting {
  height: 100%;
  ::v-deep .v-tabs {
    width: 155px;
    flex: none;
  }
  ::v-deep .v-tab {
    height: 30px;
    margin-bottom: 8px;
    width: 155px;
  }
  ::v-deep .v-tab--active {
    background: #e6f1fe;
    color: #127bf8 !important;
    border-radius: 4px;
  }
  ::v-deep .v-tabs-slider-wrapper {
    width: 0 !important;
  }
  .img-icon {
    width: 40px;
    height: 28px;
  }
  .flex-fill {
    flex: 1 !important;
  }
}
</style>
