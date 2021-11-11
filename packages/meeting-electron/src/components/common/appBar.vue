<template>
  <v-system-bar color="white" class="pt-4 pb-4">
    <v-icon v-if="minusBtn" size="16" color="black" @click="onMinApp">
      mdi-window-minimize</v-icon
    >
    <v-icon v-if="closeBtn" size="16" color="black" @click="onCloseApp">mdi-close</v-icon>
    <v-spacer />
    <span class="app-title" v-text="title" />
    <v-spacer />
  </v-system-bar>
</template>

<script>
export default {
  name: 'AppBar',
  props: {
    title: {
      type: String,
      default() {
        return ''
      }
    },
    closeBtn: {
      type: Boolean,
      default() {
        return true
      }
    },
    minusBtn: {
      type: Boolean,
      default() {
        return true
      }
    },
    onClose: {
      type: Function,
      default() {
        window.close()
      }
    },
    onMinimize: {
      type: Function,
      default() {}
    }
  },
  setup(props) {},
  data() {
    return {}
  },
  methods: {
    onMinApp() {
      this.onMinimize()
    },
    onCloseApp() {
      this.onClose()
    }
  }
}
</script>

<style lang="scss" scoped>
.app-title {
  color: black;
  font-size: 14px;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
