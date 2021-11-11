<template>
  <div id="settingNetwork">
    <div v-show="!showNetworkState" class="net-default pr-5">
      <v-img alt="" max-height="70" max-width="70" src="@/assets/net_test_defult.svg" />
      <div class="test-font mt-4">
        {{ $vuetify.lang.t('$vuetify.meeting.networkTest') }}
      </div>
      <div class="test-font mb-2">
        {{ $vuetify.lang.t('$vuetify.meeting.clickStartTest') }}
      </div>
      <v-btn
        :loading="inTesting"
        color="#127BF8"
        outlined
        class="mt-2 mb-12"
        height="30px"
        width="120"
        depressed
        @click="onTesting"
        >{{ $vuetify.lang.t('$vuetify.meeting.startTest') }}</v-btn
      >
    </div>
    <div v-show="showNetworkState" class="net-default pr-5">
      <v-img alt="" max-height="70" max-width="70" :src="testImg" />
      <div class="test-font mt-4">
        {{
          quality === 'none'
            ? $vuetify.lang.t('$vuetify.meeting.unknownNetworkCondition')
            : quality === 'good' || quality === 'normal'
            ? $vuetify.lang.t('$vuetify.meeting.normalNetworkCondition')
            : $vuetify.lang.t('$vuetify.meeting.netErrorNetworkCondition')
        }}
      </div>
      <div class="test-font mb-2">
        {{ $vuetify.lang.t('$vuetify.meeting.networkResult', networkQuality) }}
      </div>

      <v-btn
        color="#127BF8"
        outlined
        height="30"
        width="120"
        class="mt-2 mb-12"
        depressed
        @click="onTestAgain"
        >{{ $vuetify.lang.t('$vuetify.meeting.testAgain') }}</v-btn
      >
    </div>
  </div>
</template>

<script>
import net_normal from '@/assets/net_normal.svg'
import net_error from '@/assets/net_error.svg'

export default {
  name: 'NetworkView',
  data() {
    return {
      quality: '',
      testImg: '',
      tester: null,
      inTesting: false,
      networkQuality: this.$vuetify.lang.t('$vuetify.meeting.unknown'),
      showNetworkState: false
    }
  },
  watch: {
    inTesting(val) {
      if (!val) {
        this.tester.stopLastmileProbeTest()
      } else {
        this.tester.startLastmileProbeTest()
      }
    }
  },
  mounted() {
    this.tester = window.meetingRoomCore.createRTCTester()
    this.tester.on('rtc-test-network-quality', (quality) => {
      this.quality = quality
      this.testImg = quality === 'good' || quality === 'normal' ? net_normal : net_error
      this.networkQuality =
        quality === 'none'
          ? this.$vuetify.lang.t('$vuetify.meeting.unknown')
          : quality === 'good' || quality === 'normal'
          ? this.$vuetify.lang.t('$vuetify.meeting.good')
          : this.$vuetify.lang.t('$vuetify.meeting.error')
      this.inTesting = false
      this.showNetworkState = true
    })
  },
  beforeDestroy() {
    if (this.tester) {
      this.tester.stopLastmileProbeTest()
      this.tester.release()
    }
  },
  methods: {
    onTesting() {
      this.inTesting = true
    },
    onTestAgain() {
      this.showNetworkState = false
      this.inTesting = true
    }
  }
}
</script>

<style lang="scss" scoped>
#settingNetwork {
  display: flex;
  ::v-deep .v-btn__content {
    font-size: 12px;
  }
  ::v-deep .v-application .primary--text {
    margin: 0 10px;
  }
  ::v-deep .v-list-item {
    min-height: 30px !important;
  }
  .net-default {
    display: flex;
    margin-top: 80px;
    align-items: center;
    flex: 1;
    flex-direction: column;
  }
  .test-font {
    font-size: 14px;
    color: #999999 !important;
  }
}
</style>
