<template>
  <div id="settingVideo" class="fill-height ml-9 pt-2">
    <div>
      <v-row class="pb-8">
        <v-col cols="2" class="d-flex align-center pl-3 pr-0 pt-0 pb-0">
          <span class="big-text">{{ $vuetify.lang.t('$vuetify.meeting.device') }}</span>
        </v-col>
        <v-col class="pl-0 mr-8 pt-0 pb-0 pr-5">
          <v-select
            ref="currentVideoId"
            v-model="currentVideoId"
            :items="videoDevices"
            item-text="devicename"
            item-value="deviceid"
            outlined
            solo
            full-width
            :menu-props="{ offsetY: true, maxHeight: '100' }"
            height="20"
            background-color="#f8f8f8"
            hide-details
            dense
            flat
            @click="getCameraDevices"
          >
            <template #item="{ item, on, attrs }">
              <v-list-item
                v-bind="attrs"
                style="min-height: 30px; margin: 0 10px; padding: 0 10px"
                v-on="on"
              >
                <v-list-item-title>
                  {{ `${item.devicename}` }}
                </v-list-item-title>
              </v-list-item>
            </template>
          </v-select>
        </v-col>
      </v-row>
      <v-row class="mt-0">
        <v-col cols="12" class="pt-0">
          <div
            id="localCameraTest"
            style="width: 480px; height: 270px; background-color: black"
            :class="[mirrorMode ? 'mirrorMode' : '']"
          />
        </v-col>
      </v-row>
      <v-row class="mt-0">
        <v-col class="pt-2">
          <v-checkbox
            v-model="mirrorMode"
            class="mt-0"
            color="#127BF8"
            off-icon="mdi-square"
            :label="$vuetify.lang.t('$vuetify.meeting.videoMirroring')"
          />
        </v-col>
      </v-row>
    </div>
    <v-dialog
      v-model="errorDlg"
      max-width="400"
      persistent
      attach="#settingVideo"
      no-click-animation
    >
      <v-card class="pt-3">
        <v-card-title class="leave-title pb-2">
          <span>{{ $vuetify.lang.t('$vuetify.meeting.prompt') }}</span>
        </v-card-title>
        <v-card-text class="leave-text pb-5">
          <span>{{ $vuetify.lang.t('$vuetify.meeting.cannotEnableCamera') }}</span>
        </v-card-text>
        <v-card-actions class="pl-10 pr-10 pb-5 d-flex justify-space-around">
          <v-btn
            color="red"
            height="30px"
            min-width="80px"
            outlined
            depressed
            @click="errorDlg = false"
            ><span class="normal-text">{{
              $vuetify.lang.t('$vuetify.meeting.iGet')
            }}</span></v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import { showToast } from '@/components/common/toast'
import { checkCameraDevice } from '@/utils'

export default {
  name: 'VideoView',
  data() {
    return {
      videoDevicesListFlag: false,
      videoDevices: [],
      currentVideoId: null,
      videoStreams: null,
      cameraMediaStreamTrack: null,
      mirrorMode: true,
      videoDom: null,
      videoDomPlayState: false,
      tester: null,
      errorDlg: false
    }
  },
  computed: {},
  watch: {
    currentVideoId(val, oldVal) {
      if (val === oldVal) return
      this.getCameraDevices()
      const device = this.videoDevices.find((v) => v.deviceid === val)
      if (device) {
        this.tester.setActiveCameraDevice(val)
        this.$configStore.set('cameraDeviceId', val)
      } else {
        showToast(this.$vuetify.lang.t('$vuetify.meeting.cameraDeviceInvalid'))
        this.currentVideoId = this.tester.getActiveCameraDevice()
      }
    }
  },
  beforeMount() {},
  mounted() {
    this.tester = window.meetingRoomCore.createRTCTester()
    this.tester.on('rtc-video-device-change', (deviceId, deviceType, deviceState) => {})
    this.initCameraDevice()
  },
  beforeDestroy() {
    if (this.cameraMediaStreamTrack) {
      this.cameraMediaStreamTrack.stop()
      this.cameraMediaStreamTrack = null
    }
    if (this.tester) {
      this.tester.stopCameraTest()
      this.tester.release()
      this.tester = null
    }
  },
  methods: {
    changeCameraDevice(deviceId) {
      navigator.mediaDevices
        .getUserMedia({
          audio: false,
          video: {
            deviceId,
            facingMode: 'user',
            width: 640,
            height: 360
          }
        })
        .then((stream) => {
          if (this.cameraMediaStreamTrack) {
            this.cameraMediaStreamTrack.stop()
            this.cameraMediaStreamTrack = null
          }
          this.cameraMediaStreamTrack =
            typeof stream.stop === 'function' ? stream : stream.getTracks()[0]
          this.videoDom.srcObject = stream
          this.videoDom.play()
        })
    },
    getCameraDevices() {
      this.videoDevices = this.tester.getCameraDevices()
    },
    initCameraDevice() {
      return new Promise((resolve, reject) => {
        if (!this.tester) return reject()
        this.videoDevices = this.tester.getCameraDevices()
        console.log(this.videoDevices)
        let cameraDeviceId = this.$configStore.get('cameraDeviceId')
        if (
          cameraDeviceId &&
          this.videoDevices.find((v) => v.deviceid === cameraDeviceId)
        ) {
          this.currentVideoId = cameraDeviceId
        } else {
          this.currentVideoId = this.tester.getActiveCameraDevice()
        }
        checkCameraDevice()
          .then(() => {
            this.tester.startCameraTest('localCameraTest')
            resolve()
          })
          .catch((e) => {
            this.errorDlg = true
            console.error('deviveRrror=>', e)
          })
      })
    }
  }
}
</script>

<style lang="scss" scoped>
::v-deep .v-select__selection--comma {
  position: absolute !important;
  top: 6px !important;
}
#settingVideo {
  ::v-deep .mdi-square {
    color: #eeeeee;
  }
  ::v-deep .v-menu__content {
    min-height: 0 !important;
  }
  ::v-deep .v-input {
    font-size: 12px !important;
  }
  .v-input__slot {
    // min-height: 25px;
    height: 25px;
  }
  ::v-deep .v-icon {
    font-size: 18px !important;
  }
  ::v-deep .v-label {
    font-size: 12px;
    color: #333333;
  }
  ::v-deep .v-text-field--outlined fieldset {
    border: #f8f8f8;
  }
  ::v-deep .v-input__append-inner {
    position: absolute;
    width: 100%;
    right: 0;
    left: 0;
    top: 0;
    bottom: 0;
  }
  ::v-deep .v-input__icon {
    position: absolute;
    right: 0;
    top: 8px;
  }
  ::v-deep .mirrorMode {
    canvas {
      transform: scaleX(1) !important;
    }
  }
  .leave-title {
    font-size: 16px !important;
    display: flex;
    color: #424242 !important;
    justify-content: center;
  }
  .leave-text {
    font-size: 14px !important;
    color: #a3a3a3 !important;
    display: flex;
    justify-content: center;
  }
}
</style>
