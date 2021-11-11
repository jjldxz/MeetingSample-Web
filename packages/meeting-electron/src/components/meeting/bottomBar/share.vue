<template>
  <div id="meeting-bottom-bar-share">
    <v-dialog
      v-model="showShareDlg"
      persistent
      no-click-animation
      attach="#meeting-win"
      class="share-dialog d-flex justify-center flex-column"
      style="overflow: hidden; flex: 1"
      scrollable
    >
      <template #activator="{ attrs }">
        <v-btn
          v-bind="attrs"
          :ripple="false"
          value="ShareScreen"
          class="pl-1 pr-1"
          min-width="70"
          height="56"
          @click="onClickShareBtn"
        >
          <span class="normal-text title-center" style="padding-top: 2px">
            {{ shareText ? shareText : $vuetify.lang.t('$vuetify.meeting.shareScreen') }}
          </span>
          <v-img
            class="bottom-bar-img"
            width="16"
            min-height="18"
            max-height="20"
            :src="
              shareType === 'window' || shareType === 'screen'
                ? require('@/assets/bottom_btn/close_share.png')
                : shareType && shareType.indexOf('wb') !== -1
                ? require('@/assets/white.png')
                : require('@/assets/bottom_btn/share.png')
            "
          />
        </v-btn>
      </template>
      <v-card class="d-flex pl-5 pr-5 justify-center flex-column share-dlg-box">
        <div
          class="d-flex justify-center flex-column"
          style="overflow: hidden; flex: 1; padding-bottom: 20px"
        >
          <v-card-title
            class="justify-center leave-title mb-2"
            style="height: 56px; font-size: 16px; color: #3a3a3a"
            >{{ $vuetify.lang.t('$vuetify.meeting.shareContent') }}</v-card-title
          >
          <v-card-text
            class="pb-5 pt-3 pl-0 pr-0"
            style="overflow-x: hidden; flex: 1; height: 100%"
          >
            <div style="overflow-y: auto">
              <v-item-group v-model="currentShareCategoryIdx" active-class="light-blue">
                <v-row
                  class="ma-0"
                  style="
                    display: grid;
                    grid-template-columns: 1fr 1fr 1fr 1fr 1fr;
                    margin-bottom: 10px;
                    width: 100%;
                  "
                >
                  <div class="flex-center flex-column justify-center">
                    <v-item
                      v-slot="{ toggle }"
                      style="margin-bottom: 30px; height: 140px"
                    >
                      <v-card
                        class="flex-center flex-column justify-center"
                        dark
                        style="background: #eeeeee"
                        height="140"
                        width="180"
                        @click="toggle"
                      >
                        <div
                          class="flex-center flex-column"
                          style="
                            height: 90px;
                            width: 160px;
                            background: #fff;
                            border-radius: 0;
                          "
                        >
                          <v-img
                            width="24"
                            max-height="24"
                            src="@/assets/whiteboard_color.png"
                          />
                        </div>
                        <span
                          class="screen-share-item-title"
                          :style="{
                            color: currentShareCategoryIdx === 0 ? '#fff' : '#666'
                          }"
                          >{{ $vuetify.lang.t('$vuetify.meeting.whiteboard') }}</span
                        >
                      </v-card>
                    </v-item>
                  </div>
                  <div
                    v-for="(d, i) in displayList"
                    :key="i"
                    style="margin-bottom: 30px"
                    class="flex-center flex-column justify-center"
                  >
                    <v-item v-slot="{ toggle }" style="height: 140px">
                      <v-card
                        class="flex-center"
                        dark
                        style="background: #eeeeee"
                        height="140"
                        width="180"
                        @click="toggle"
                      >
                        <div class="flex-center" style="flex-direction: column">
                          <img
                            alt=""
                            :src="d.imgSrc"
                            style="max-height: 90px; width: 160px"
                          />
                          <span
                            class="screen-share-item-title"
                            :style="{
                              color: currentShareCategoryIdx === i + 1 ? '#fff' : '#666'
                            }"
                            >{{ $vuetify.lang.t('$vuetify.meeting.desktop') }}
                            {{ i + 1 }}</span
                          >
                        </div>
                      </v-card>
                    </v-item>
                  </div>
                </v-row>
              </v-item-group>
              <v-divider
                v-if="shareWindowList.length > 0"
                style="margin: 0 10px; padding-bottom: 30px"
              />
              <v-item-group
                v-if="shareWindowList.length > 0"
                v-model="currentShareWindowCategoryIdx"
                active-class="light-blue"
              >
                <v-row
                  class="ma-0"
                  style="display: grid; grid-template-columns: 1fr 1fr 1fr 1fr 1fr"
                >
                  <div
                    v-for="(w, i) in shareWindowList"
                    :key="i"
                    class="flex-center flex-column justify-center"
                    style="margin-bottom: 30px"
                  >
                    <v-item v-slot="{ toggle }">
                      <v-card
                        style="background: #eeeeee"
                        class="flex-center"
                        dark
                        height="140"
                        width="180"
                        @click="toggle"
                      >
                        <div class="flex-center" style="flex-direction: column">
                          <img
                            alt=""
                            style="max-height: 90px; max-width: 160px"
                            :src="w.imgSrc"
                          />
                          <span
                            class="screen-share-item-title"
                            :style="{
                              color:
                                currentShareWindowCategoryIdx === i ? '#fff' : '#717171'
                            }"
                            >{{ w.name }}</span
                          >
                        </div>
                      </v-card>
                    </v-item>
                  </div>
                </v-row>
              </v-item-group>
            </div>
          </v-card-text>
        </div>
        <v-card-actions
          :class="[
            'pb-3',
            'pr-0',
            'share-confirm-btns',
            shareWindowList.length ? 'share-confirm-btns-fixed' : ''
          ]"
        >
          <v-spacer />
          <v-btn
            style="color: rgb(18, 123, 248); border: 1px solid rgb(18, 123, 248)"
            class="mr-5"
            color="#fff"
            min-width="80px"
            depressed
            light
            height="30px"
            outlined
            @click="onCancelShareDlg"
          >
            {{ $vuetify.lang.t('$vuetify.meeting.cancel') }}
          </v-btn>
          <v-btn
            style="font-size: 14px"
            class="white--text"
            color="#127BF8"
            :loading="shareLoading"
            min-width="80px"
            height="30px"
            :disabled="
              typeof currentShareCategoryIdx !== 'number' &&
              typeof currentShareWindowCategoryIdx !== 'number'
            "
            depressed
            @click="onSharing"
          >
            {{ $vuetify.lang.t('$vuetify.meeting.confirmShare') }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog
      v-model="showMeetingErrorDlg"
      max-width="400"
      persistent
      attach="#meetingMain"
      no-click-animation
    >
      <v-card class="pt-3">
        <v-card-title class="leave-title pb-2">
          <span>{{ $vuetify.lang.t('$vuetify.meeting.prompt') }}</span>
        </v-card-title>
        <v-card-text class="leave-text pb-5">
          <span>{{
            $vuetify.lang.t('$vuetify.meeting.someoneIsSharing', shareAttrName)
          }}</span>
        </v-card-text>
        <v-card-actions class="pl-10 pr-10 pb-5 d-flex justify-space-around">
          <v-btn
            color="#127BF8"
            height="30px"
            min-width="80px"
            depressed
            class="white--text"
            @click="showMeetingErrorDlg = false"
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
import { mapMutations, mapState } from 'vuex'
import { readImage } from '../../../utils'
import { IPCEvents, MeetingRole, ShareType } from '../../../common'
import { MeetingCoreRoomEvents } from '../../../common/renderCommon'

export default {
  name: 'BottomBarShareWidget',
  data() {
    return {
      shareLoading: false,
      showShareDlg: false,
      shareText: null,
      currentShareCategoryIdx: null,
      currentShareWindowCategoryIdx: null,
      displayList: [],
      shareWindowList: [],
      showMeetingErrorDlg: false,
      shareAttrName: null
    }
  },
  computed: {
    ...mapState('meeting', ['shareType', 'userList']),
    attendees() {
      return this.userList.filter(
        (u) => u.role !== MeetingRole.Share && u.role !== MeetingRole.Record
      )
    }
  },
  watch: {
    shareType(val) {
      if (val === 'window' || val === 'screen') {
        this.shareText = this.$vuetify.lang.t('$vuetify.meeting.stopScreen')
      } else if (val && val.indexOf('wb') !== -1) {
        this.shareText = this.$vuetify.lang.t('$vuetify.meeting.whiteboard')
      } else {
        this.shareText = this.$vuetify.lang.t('$vuetify.meeting.shareScreen')
      }
    },
    currentShareCategoryIdx(val) {
      if (val !== null) {
        this.currentShareWindowCategoryIdx = null
      }
    },
    currentShareWindowCategoryIdx(val) {
      if (val !== null) {
        this.currentShareCategoryIdx = null
      }
    },
    showShareDlg(val) {
      if (val) {
        this.handleWindowSharing()
        this.handleScreenSharing()
      } else {
        this.displayList = []
        this.shareWindowList = []
        this.currentShareCategoryIdx = null
        this.currentShareWindowCategoryIdx = null
      }
    }
  },
  mounted() {
    this.bindEvents()
  },
  methods: {
    ...mapMutations('meeting', ['setShareType']),
    bindEvents() {
      const that = this
      window.meetingRoomCore.on(MeetingCoreRoomEvents.SCREEN_SHARE_JOIN, (shareId) => {
        if (!window.rtcClient) return
        if (this.shareType === ShareType.Screen) {
          window.rtcClient.startShareScreen(this.shareObj.displayId)
        } else if (that.shareType === ShareType.Window) {
          window.rtcClient.startShareWindow(that.shareObj.windowId)
        }
      })
      window.meetingRoomCore.on(MeetingCoreRoomEvents.SCREEN_SHARE_LEAVE, (shareId) => {
        if (window.meetingRoomCore) {
          window.meetingRoomCore.stopShare()
        }
        window.ipc.send(IPCEvents.MEETING.CLOSE_SCREEN_MARKER)
      })
    },
    onClickShareBtn() {
      if (this.shareType === ShareType.None) {
        this.showShareDlg = true
      } else if (this.shareType === ShareType.WhiteBoardHide) {
        this.setShareType(ShareType.WhiteBoard)
      }
    },
    handleWindowSharing() {
      if (!window.meetingRoomCore) return
      let list = window.meetingRoomCore.getScreenWindowsInfo()
      Promise.all(list.map((item) => readImage(item.image))).then((imageList) => {
        this.shareWindowList = list.map((item, index) => {
          item.imgSrc = imageList[index]
          return item
        })
      })
    },
    handleScreenSharing() {
      if (!window.meetingRoomCore) return
      let list = window.meetingRoomCore.getScreenDisplaysInfo()
      // let ids = []
      Promise.all(list.map((item) => readImage(item.image))).then((imageList) => {
        this.displayList = list.map((item, index) => {
          item.imgSrc = imageList[index]
          // if (item.displayId.x === 0 && process.platform === 'win32') {
          //   ids.push(item.displayId.id)
          // }
          return item
        })
        if (process.platform === 'win32') {
          this.displayList = this.displayList.filter((info) => {
            return info.displayId.x === 0
          })
        }
        // window.ipc.send('set-current-screenIds', {
        //   ids
        // })
      })
    },
    onSharing() {
      let shareAttrFlag = false
      this.shareAttrName = ''
      this.attendees.map((val) => {
        let share = val.state?.share
        if (share === 'desktop' || share === 'application' || share === 'whiteboard') {
          shareAttrFlag = true
          this.shareAttrName =
            val.name || this.$vuetify.lang.t('$vuetify.meeting.attendee')
        }
      })
      if (shareAttrFlag) {
        this.showMeetingErrorDlg = true
        return
      }
      this.shareLoading = true
      if (typeof this.currentShareCategoryIdx === 'number') {
        if (this.currentShareCategoryIdx === 0) {
          window.meetingRoomCore
            .startShareWhiteboard()
            .then(() => {
              this.setShareType(ShareType.WhiteBoard)
              this.shareLoading = false
              this.showShareDlg = false
            })
            .catch((e) => {
              console.error(e)
              this.shareLoading = false
              this.showShareDlg = false
            })
        } else {
          this.displayList.forEach((item, index) => {
            if (index + 1 === +this.currentShareCategoryIdx) {
              this.$tmpStore.set('currentSharedScreenId', item.displayId?.id ?? index)
            }
          })
          window.meetingRoomCore
            .startShareDesktop()
            .then(() => {
              this.setShareType(ShareType.Screen)
              this.shareObj = this.displayList[this.currentShareCategoryIdx - 1]
              let obj = {
                type: 'screen'
              }
              let windId = this.shareObj.displayId.id
              // for windows platform
              if (!windId) {
                windId = this.currentShareCategoryIdx - 1
                obj.workArea = this.shareObj.displayId
              }
              obj.id = windId
              this.$tmpStore.set('currentSharedScreen', obj)
              window.ipc.send(IPCEvents.MEETING.OPEN_SCREEN_MARKER, obj)
              this.shareLoading = false
              this.showShareDlg = false
            })
            .catch((e) => {
              console.error(e)
              this.shareLoading = false
              this.showShareDlg = false
            })
        }
      } else if (typeof this.currentShareWindowCategoryIdx === 'number') {
        window.meetingRoomCore
          .startShareApplication()
          .then(() => {
            this.setShareType('window')
            this.shareObj = this.shareWindowList[this.currentShareWindowCategoryIdx]
            const obj = {
              type: 'window',
              id: this.shareObj.windowId
            }
            this.$tmpStore.set('currentSharedScreen', obj)
            window.ipc.send(IPCEvents.MEETING.OPEN_SCREEN_MARKER, obj)
            this.shareLoading = false
            this.showShareDlg = false
          })
          .catch((e) => {
            console.error(e)
            this.shareLoading = false
            this.showShareDlg = false
          })
      } else {
        this.shareLoading = false
      }
    },
    onCancelShareDlg() {
      if (!this.shareLoading) {
        this.showShareDlg = false
      }
    }
  }
}
</script>

<style lang="scss" scoped>
#meeting-bottom-bar-share {
  .share-dlg-box {
    overflow: hidden;
    flex: 1;
    .share-confirm-btns {
      background-color: #fff;
      padding-right: 20px !important;
      height: 56px;
      text-align: right;
    }
    .share-confirm-btns-fixed {
      width: calc(100% - 160px);
      position: fixed;
      bottom: 60px;
      left: 80px;
    }
  }
  .screen-share-item-title {
    width: 180px;
    padding: 0 10px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    text-align: center;
    height: 35px;
    font-size: 14px;
    line-height: 40px;
  }
}
</style>
