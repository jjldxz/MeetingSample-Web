<template>
  <div id="settingAudio" class="fill-height ml-8">
    <div class="d-flex align-center row-content">
      <span class="big-text mr-5" style="white-space: nowrap">{{
        $vuetify.lang.t('$vuetify.meeting.speaker')
      }}</span>
      <v-select
        v-model="currentSpeakerId"
        class="center-content"
        :items="speakerList"
        item-text="devicename"
        item-value="deviceid"
        outlined
        full-width
        solo
        height="30"
        background-color="#f8f8f8"
        color="#127BF8"
        style="max-width: 335px; min-width: 335px"
        hide-details
        dense
        :menu-props="{ offsetY: true, maxHeight: '100' }"
        flat
      >
        <template #item="{ item, on, attrs }">
          <v-list-item
            v-bind="attrs"
            style="min-height: 30px; margin: 0 10px; padding: 0 10px"
            v-on="on"
          >
            <v-list-item-title>
              <span>{{ `${item.devicename}` }}</span>
            </v-list-item-title>
          </v-list-item>
        </template>
      </v-select>
      <v-btn
        height="30"
        color="#127BF8"
        class="white--text ml-3"
        depressed
        min-width="60"
        @click="onSpeakerTest"
      >
        <span class="normal-text">{{
          speakerTesting
            ? $vuetify.lang.t('$vuetify.meeting.stopTest')
            : $vuetify.lang.t('$vuetify.meeting.speakerTest')
        }}</span>
      </v-btn>
    </div>
    <div class="d-flex align-center row-content">
      <span class="big-text mr-5" style="white-space: nowrap">{{
        $vuetify.lang.t('$vuetify.meeting.volume')
      }}</span>
      <v-slider
        v-model="speakerVolume"
        class="center-content pl-5 mr-11 pr-9"
        min="0"
        max="100"
        color="#127BF8"
        step="1"
        tick-size="1"
        style="max-width: 390px; min-width: 390px"
        thumb-label
        hide-details
        dense
        @end="onSpeakerVolumeChange"
      >
        <template slot="prepend" class="flex-center">
          <img alt src="@/assets/audio_color.svg" />
        </template>
      </v-slider>
    </div>
    <div class="d-flex align-center row-content">
      <span class="big-text mr-5" style="width: 45px; white-space: nowrap">{{
        $vuetify.lang.t('$vuetify.meeting.mac')
      }}</span>
      <v-select
        v-model="currentMicId"
        :items="micList"
        item-text="devicename"
        item-value="deviceid"
        outlined
        height="30"
        background-color="#f8f8f8"
        color="#127BF8"
        solo
        style="max-width: 335px; min-width: 335px"
        hide-details
        dense
        :menu-props="{ offsetY: true, maxHeight: '100' }"
        flat
        class="center-content"
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
      <v-btn
        height="30"
        color="#127BF8"
        class="white--text ml-3"
        depressed
        min-width="60"
        @click="onMicTest"
      >
        <span class="normal-text">
          {{
            micTesting
              ? $vuetify.lang.t('$vuetify.meeting.stopTest')
              : $vuetify.lang.t('$vuetify.meeting.macTest')
          }}
        </span>
      </v-btn>
    </div>
    <div class="d-flex align-center row-content">
      <span class="big-text mr-5" style="white-space: nowrap">{{
        $vuetify.lang.t('$vuetify.meeting.volume')
      }}</span>
      <v-slider
        v-model="micVolume"
        class="center-content pl-5 mr-11 pr-9"
        min="0"
        max="100"
        color="#127BF8"
        step="1"
        tick-size="1"
        style="max-width: 390px; min-width: 390px"
        thumb-label
        hide-details
        dense
        @end="onMicVolumeChange"
      >
        <template slot="prepend" class="flex-center">
          <img alt src="@/assets/audio_color.svg" />
        </template>
      </v-slider>
    </div>
    <div v-show="micTesting" style="display: flex" class="align-center row-content">
      <div style="width: 100%" class="mr-15">
        <volume-level :volume.sync="realTimeMicVolume" />
      </div>
    </div>
    <v-dialog
      v-model="errorDlg"
      max-width="400"
      persistent
      attach="#settingAudio"
      no-click-animation
    >
      <v-card class="pt-3">
        <v-card-title class="leave-title pb-2">
          <span>{{ $vuetify.lang.t('$vuetify.meeting.prompt') }}</span>
        </v-card-title>
        <v-card-text class="leave-text pb-5">
          <span>{{ $vuetify.lang.t('$vuetify.meeting.cannotEnableMicrophone') }}</span>
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
import VolumeLevel from '@/components/common/volumeLevel'
import { remote } from 'electron'
import { checkMicrophoneDevice } from '@/utils'

export default {
  name: 'AudioView',
  components: {
    VolumeLevel
  },
  data() {
    return {
      speakerList: [],
      currentSpeakerId: null,
      speakerTesting: false,
      speakerTestDom: null,
      speakerVolume: 0,
      micVolume: 0,
      micList: [],
      currentMicId: null,
      micTesting: false,
      micTestDom: null,
      audioContext: null,
      mediaStreamSource: null,
      tester: null,
      realTimeMicVolume: 0,
      errorDlg: false
    }
  },
  computed: {},
  watch: {
    currentSpeakerId(val, oldVal) {
      if (val === oldVal) return
      this.tester.setActiveSpeakerDevice(val)
      this.$configStore.set('speakerDeviceId', val)
    },
    currentMicId(val, oldVal) {
      if (val === oldVal) return
      this.tester.setActiveMicrophoneDevice(val)
      this.$configStore.set('microphoneDeviceId', val)
    },
    speakerVolume(val, oldVal) {},
    micVolume(val, oldVal) {}
  },
  mounted() {
    this.tester = window.meetingRoomCore.createRTCTester()
    this.tester.on('rtc-audio-level', (uid, volume) => {
      this.realTimeMicVolume = volume
    })
    this.initSpeakerDevice()
    this.initMicrophoneDevices()
  },
  beforeDestroy() {
    if (this.tester) {
      this.speakerTesting && this.tester.stopSpeakerTest()
      this.micTesting && this.tester.stopMicTest()
      this.tester.release()
    }
    this.speakerTesting = false
    this.micTesting = false
    this.tester = null
  },
  methods: {
    onSpeakerTest() {
      if (!this.tester) return
      if (!this.speakerTesting) {
        const filePath = remote.app.isPackaged ? process.resourcesPath : __static
        this.tester.startSpeakerTest(
          `${filePath}/media/${process.env.VUE_APP_SPEAKER_TEST_FILE}`
        )
        this.speakerTesting = true
      } else {
        this.tester.stopSpeakerTest()
        this.speakerTesting = false
      }
    },
    onMicTest() {
      checkMicrophoneDevice()
        .then(() => {
          if (!this.tester) return
          this.realTimeMicVolume = 0
          if (!this.micTesting) {
            this.micTesting = true
            this.tester.startMicTest()
          } else {
            this.tester.stopMicTest()
            this.micTesting = false
          }
        })
        .catch((e) => {
          this.micTesting = false
          this.errorDlg = true
          console.error('micTestError=>', e)
        })
    },
    onMicVolumeChange() {
      this.tester.setMicVolume(this.micVolume)
      this.$configStore.set('microphoneVolume', this.micVolume)
    },
    onSpeakerVolumeChange() {
      this.tester.setSpeakerVolume(this.speakerVolume)
      this.$configStore.set('speakerVolume', this.speakerVolume)
    },
    initSpeakerDevice() {
      return new Promise((resolve, reject) => {
        if (!this.tester) return reject()
        this.speakerList = this.tester.getSpeakerDevices()
        const speakerDeviceId = this.$configStore.get('speakerDeviceId')
        if (
          speakerDeviceId &&
          this.speakerList.find((s) => s.deviceid === speakerDeviceId)
        ) {
          this.currentSpeakerId = speakerDeviceId
        } else {
          this.currentSpeakerId = this.tester.getActiveSpeakerDevice()
        }
        const speakerVolume = this.$configStore.get('speakerVolume')
        if (speakerVolume) {
          this.speakerVolume = Number(speakerVolume)
          this.tester.setSpeakerVolume(this.speakerVolume)
        } else {
          this.speakerVolume = this.tester.getSpeakerVolume()
          this.$configStore.set('speakerVolume', this.speakerVolume)
        }
        resolve()
      })
    },
    initMicrophoneDevices() {
      return new Promise((resolve, reject) => {
        if (!this.tester) return reject()
        this.micList = this.tester.getMicrophoneDevices()

        const micDeviceId = this.$configStore.get('microphoneDeviceId')
        if (micDeviceId && this.micList.find((m) => m.deviceid === micDeviceId)) {
          this.currentMicId = micDeviceId
        } else {
          this.currentMicId = this.tester.getActiveMicrophoneDevice()
        }

        const micVolume = this.$configStore.get('microphoneVolume')
        if (micVolume) {
          this.micVolume = Number(micVolume)
          this.tester.setMicVolume(this.micVolume)
        } else {
          this.micVolume = this.tester.getMicVolume()
          this.$configStore.set('microphoneDeviceId', this.currentMicId)
        }
        resolve()
      })
    }
  }
}
</script>

<style lang="scss" scoped>
#settingAudio {
  ::v-deep .v-btn:not(.v-btn--round).v-size--default {
    padding: 0 10px;
  }
  -webkit-app-region: no-drag;
  .row-content {
    margin-bottom: 20px;
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
    bottom: 0;
  }
  .center-content {
    flex: 1;
    align-items: center;
  }
  ::v-deep .v-slider__track-container {
    height: 4px;
  }
  ::v-deep .v-slider__track-background {
    background: #f8f8f8 !important;
  }
  ::v-deep .v-input {
    font-size: 12px;
  }
  ::v-deep .v-application .primary--text {
    margin: 0 10px;
  }
  .v-input__slot {
    min-height: 25px;
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
