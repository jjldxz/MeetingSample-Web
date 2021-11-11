<template>
  <div id="meeting-bar">
    <div class="meeting-title">
      <div class="flex-h-center" />
      <div class="title-center">
        <span>{{ title }}</span>
      </div>
      <div class="flex-h-center">
        <v-btn
          class="title-icon pl-0 pr-0 white--text"
          height="14px"
          min-width="14px"
          text
          @click="onClose"
        >
          <img alt src="@/assets/close.svg" />
        </v-btn>
        <v-btn
          v-if="minus"
          class="title-icon pl-0 pr-0 white--text"
          height="14px"
          min-width="14px"
          text
          @click="onMinus"
        >
          <img alt src="@/assets/min.svg" />
        </v-btn>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'PollTitle',
  props: {
    title: {
      type: String,
      default() {
        return ''
      }
    },
    backFlag: {
      type: Boolean,
      default() {
        return true
      }
    },
    minus: {
      type: Boolean,
      default() {
        return true
      }
    }
  },
  methods: {
    onBackToPreviousPage() {
      this.$emit('onBackToPreviousPage')
    },
    onClose() {
      this.$emit('onClose')
    },
    onMinus() {
      this.$emit('onMinus')
    }
  }
}
</script>

<style lang="scss" scoped>
@import '../../../../styles/variables.scss';
#meeting-bar {
  width: 100%;
  background: #ffff;
  .meeting-title {
    height: 56px;
    padding: 0 10px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 1px solid #f8f8f8;
    .title-center {
      font-size: 16px;
      color: #3a3a3a;
    }
  }
  .back-content {
    flex: 1;
    display: flex;
    flex-direction: column;
    -webkit-app-region: no-drag;
    .back-btn {
      margin: 2px 0 0 5px;
    }
  }
  ::v-deep .v-btn:not(.v-btn--active) {
    background: #fff !important;
  }
  ::v-deep .v-btn:before {
    background-color: #fff !important;
  }
}
</style>
