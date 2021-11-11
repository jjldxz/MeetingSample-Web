<template>
  <div v-if="showWrap" class="wrap" :class="showContent ? 'fadein' : 'fadeout'">
    <div class="content">{{ text }}</div>
  </div>
</template>

<style lang="scss" scoped>
.wrap {
  z-index: 9999;
  position: fixed;
  left: 50%;
  top: 50%;
  max-width: 600px;
  transform: translate(-50%, -50%);
  display: flex;
  justify-content: center;
  align-content: center;
  .content {
    padding: 14px 16px;
    background-color: rgba(0, 0, 0, 0.8);
    border-color: rgba(0, 0, 0, 0.8);
    border-radius: 4px;
    color: #fff;
    font-size: 14px;
    font-weight: 400;
    letter-spacing: 0.0178571429em;
    line-height: 1.55rem;
    min-width: 30%;
    max-width: 100%;
  }
}
.fadein {
  animation: animate_in 0.25s;
}
.fadeout {
  animation: animate_out 2.25s;
  opacity: 0;
}
@keyframes animate_in {
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}
@keyframes animate_out {
  0% {
    opacity: 1;
  }
  100% {
    opacity: 0;
  }
}
</style>
