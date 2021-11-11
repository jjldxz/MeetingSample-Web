<template>
  <!-- eslint-disable-next-line vue/max-attributes-per-line -->
  <v-dialog v-model="showDlg" hide-overlay max-width="330" class="box-border" persistent>
    <v-card max-width="330" class="box-warp mx-auto">
      <div class="transcribe-title">
        <v-card-title class="justify-center box-title">
          {{ $vuetify.lang.t('$vuetify.meeting.RecordingFinished') }}
        </v-card-title>
        <v-img
          max-width="12"
          width="10"
          height="10"
          max-height="12"
          src="@/assets/close-message@2x.png"
          class="close-btn"
          @click="closePop"
        />
      </div>
      <v-card-text class="text-size text-bottom">
        {{ $vuetify.lang.t('$vuetify.meeting.RecordingMessage') }}
      </v-card-text>
      <div class="message-box">
        <v-checkbox
          v-model="isNoMessage"
          class="attendee-look"
          color="#127BF8"
          hide-details
          :label="$vuetify.lang.t('$vuetify.meeting.noMessage')"
        />
        <v-card-actions id="yes-ok" class="pl-10 pr-10 pb-5 d-flex justify-center">
          <v-btn
            color="#127BF8"
            class="white--text box-btn"
            height="30px"
            min-width="80px"
            depressed
            @click="closePop"
          >
            >
            {{ $vuetify.lang.t('$vuetify.meeting.iOk') }}
          </v-btn>
        </v-card-actions>
      </div>
    </v-card>
  </v-dialog>
</template>
<script>
import { mapMutations } from 'vuex'

export default {
  model: {
    prop: 'show',
    event: 'close'
  },
  props: {
    show: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      isNoMessage: false,
      showDlg: false
    }
  },
  watch: {
    show(val) {
      this.showDlg = val
    },
    isNoMessage(val) {
      if (val) {
        setTimeout(() => {
          this.closePop()
        }, 5000)
      }
    }
  },
  mounted() {
    this.showDlg = this.show
  },
  methods: {
    ...mapMutations('meeting', ['setNoMessage']),
    closePop() {
      this.$emit('close', false)
    },
    handleMessage() {
      this.setNoMessage(this.isNoMessage)
    }
  }
}
</script>
<style lang="scss" scoped>
::v-deep .v-dialog {
  position: absolute;
  top: 9%;
  right: 20.5%;
  border-radius: 2px !important;
}
.transcribe-title {
  display: flex;
  justify-content: space-between;
}
.box-border {
  box-shadow: 0 4px 20px 0 rgba(0, 0, 0, 0.1) !important;
}
.box-warp {
  padding: 20px;
}
.attendee-look {
  width: 160px;
  margin-top: 0 !important;
  padding-top: 0 !important;
  ::v-deep .v-input__control {
    .v-input__slot {
      margin-bottom: 0 !important;
      .v-label {
        font-size: 12px !important;
      }
      .v-input__append-inner {
        margin-top: 9px !important;
      }
      .v-input--selection-controls__input {
        i {
          font-size: 19px !important;
        }
      }
    }
    .v-messages {
      height: 4px !important;
    }
    .v-messages::-webkit-scrollbar {
      width: 0 !important;
    }
  }
}
#yes-ok {
  padding: 0 !important;
}
.message-box {
  display: flex;
  justify-content: space-between;
  margin-top: 10px;
}
.text-size {
  font-size: 14px;
}
.box-title {
  font-weight: 600;
  font-size: 14px;
  margin-bottom: 5px;
  padding: 0;
}
.text-bottom {
  padding: 0 !important;
}
.box-btn {
  padding-top: 0 !important;
}
</style>
