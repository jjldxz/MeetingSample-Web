<template>
  <div v-if="showPollTip" class="poll-start-pop">
    <div class="start-title">
      <span>{{ title }}</span>
      <img src="@/assets/close.svg" alt="" @click="onClose" />
    </div>
    <p>{{ content }}</p>
    <div class="detail-button">
      <v-btn
        color="#127BF8"
        min-width="80px"
        min-height="30px"
        class="white--text"
        @click="onCheck"
        ><span class="normal-text">{{
          $vuetify.lang.t('$vuetify.meeting.viewNow')
        }}</span>
      </v-btn>
    </div>
  </div>
</template>

<script>
export default {
  name: 'PopTip',
  model: {
    prop: 'showPollTip',
    event: 'close'
  },
  props: {
    showPollTip: {
      type: Boolean,
      default: false
    },
    title: {
      type: String,
      default: ''
    },
    content: {
      type: String,
      default: ''
    },
    timeout: {
      type: Number,
      default: 10000
    }
  },
  data() {
    return {
      timer: null
    }
  },
  watch: {
    showPollTip(val) {
      if (!val) {
        if (this.timer) {
          clearTimeout(this.timer)
          this.timer = null
        }
      }
    }
  },
  mounted() {
    if (this.timeout > 0)
      this.timer = setTimeout(() => {
        this.onClose()
      }, this.timeout)
  },
  methods: {
    onClose() {
      this.$emit('close', false)
    },
    onCheck() {
      this.$emit('check')
    }
  }
}
</script>

<style lang="scss" scoped>
.poll-start-pop {
  width: 330px;
  height: 150px;
  background: #ffffff;
  box-shadow: 0 4px 20px 0 rgba(0, 0, 0, 0.1);
  border-radius: 4px;
  position: absolute;
  top: 85px;
  right: 290px;
  .start-title {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin: 20px 20px 0 20px;
    span {
      font-size: 14px;
      color: #424242;
    }
  }
  p {
    margin: 10px 0 0 20px;
    font-size: 14px;
    color: #a3a3a3;
  }
  .detail-button {
    margin: 30px 20px 0 0;
    display: flex;
    justify-content: flex-end;
  }
}
</style>
