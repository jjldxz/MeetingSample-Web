<template>
  <div class="volume-container">
    <img
      alt
      width="14px"
      height="20px"
      :src="require('@/assets/mute.png')"
      class="mr-2"
    />
    <div class="volume-slider">
      <span
        v-for="n in totalCnt"
        :key="n"
        :class="{ normal: volume > n && volume >= 60, small: volume > n && volume < 60 }"
      />
    </div>
  </div>
</template>

<script>
export default {
  name: 'VolumeLevel',
  props: {
    volume: {
      type: Number,
      default() {
        return 0
      }
    }
  },
  data() {
    return {
      totalCnt: 100
    }
  },
  watch: {
    volume: {
      handler() {},
      deep: true
    }
  }
}
</script>

<style lang="scss" scoped>
.volume-container {
  width: 100%;
  display: flex;
  flex-direction: row;
  .volume-slider {
    display: flex;
    align-items: center;
    width: 100%;
    span {
      margin: 1px;
      flex: 1;
      min-height: 20px;
      background-color: #cccccc;
      &.small {
        background-color: #fed35f;
      }
      &.normal {
        background-color: #127bf8;
      }
    }
  }
}
</style>
