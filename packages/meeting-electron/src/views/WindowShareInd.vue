<template>
  <div id="window-share-ind">
    <v-system-bar color="black">
      <v-icon class="white--text" @click="onHideWinShareInd">mdi-minus</v-icon>
    </v-system-bar>
    <v-responsive :aspect-ratio="16 / 9">
      <video id="window-share-ind-video" height="100%" width="100%" style="width: auto" />
    </v-responsive>
    <div
      class="flex-center"
      style="
        position: absolute;
        width: 100%;
        bottom: 0;
        top: 250px;
        background-color: black;
      "
    >
      <!-- 结束共享 -->
      <v-btn
        color="#EA2828"
        class="white--text mark-icon"
        tile
        height="30px"
        min-width="80px"
        depressed
        @click="onEndWinShareInd"
      >
        {{ $vuetify.lang.t('$vuetify.dxz.endScreen') }}
      </v-btn>
    </div>
  </div>
</template>
>

<script>
import { IPCEvents } from '../common'

export default {
  name: 'WindowShareInd',
  data() {
    return {
      drawMode: 1,
      drawTimer: null
    }
  },
  mounted() {
    window.ipc.on('set-screen-draw-mode', (e, reply) => {
      this.drawMode = reply.mode
    })

    const type = this.$route.params.type
    const id = this.$route.params.id
    navigator.mediaDevices
      .getUserMedia({
        audio: false,
        video: {
          mandatory: {
            chromeMediaSource: 'desktop',
            chromeMediaSourceId: `${type}:${id}:0`
          }
        }
      })
      .then((stream) => {
        const video = this.$el.querySelector('#window-share-ind-video')
        video.srcObject = stream
        video.onloadedmetadata = () => video.play()
      })
  },
  methods: {
    onHideWinShareInd() {
      window.ipc.send(IPCEvents.WIN_SHARE_IND.MIN)
    },
    onEndWinShareInd() {
      window.ipc.send(IPCEvents.WIN_SHARE_IND.STOP)
    }
  }
}
</script>

<style lang="scss" scoped>
#window-share-ind {
  width: 100%;
  height: 100%;
  background-color: black;
  #window-share-ind-video {
    object-fit: fill;
    position: absolute;
    top: 0;
    left: 50%;
    transform: translateX(-50%);
  }
  .mark-icon {
    border-radius: 6px;
  }
}
</style>
