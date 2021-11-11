<template>
  <v-overlay :value="loading" :opacity="opacity">
    <v-progress-circular color="#127bf8" indeterminate size="48" />
  </v-overlay>
</template>

<script>
export default {
  name: 'OverlayWithLoading',
  model: {
    prop: 'loading',
    event: 'switch'
  },
  props: {
    loading: {
      type: Boolean,
      default() {
        return false
      }
    },
    opacity: {
      type: Number,
      default() {
        return 0.5
      }
    }
  }
}
</script>

<style scoped></style>
