<template>
  <v-fade-transition>
    <!-- eslint-disable-next-line vue/max-attributes-per-line -->
    <v-overlay
      v-show="show"
      absolute
      color="light-blue"
      class="flex-center"
      z-index="1000"
      :opacity="opacity"
    >
      <v-snackbar :timeout="-1" :value="true" centered>
        {{ message }}
        <template #action="{ attrs }">
          <!-- eslint-disable-next-line vue/max-attributes-per-line -->
          <v-btn class="light-blue" v-bind="attrs" text depressed @click="onClickBtn">
            {{ $vuetify.lang.t('$vuetify.meeting.close') }}
          </v-btn>
        </template>
      </v-snackbar>
    </v-overlay>
  </v-fade-transition>
</template>

<script>
export default {
  name: 'ErrorOverlay',
  model: {
    prop: 'show',
    event: 'close'
  },
  props: {
    show: {
      type: Boolean,
      default: false
    },
    message: {
      type: String,
      default() {
        return ''
      }
    },
    afterClosed: {
      type: Function,
      default() {}
    },
    opacity: {
      type: Number,
      default: 0.6
    }
  },
  methods: {
    onClickBtn() {
      this.$emit('close', false)
      this.afterClosed()
    }
  }
}
</script>

<style scoped></style>
