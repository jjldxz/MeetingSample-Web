<template>
  <v-dialog v-model="showDlg" :width="width" :max-width="maxWidth" persistent>
    <v-card class="dialog-group">
      <div class="pr-5 pt-5 d-flex justify-end">
        <v-btn
          v-if="close"
          class="title-icon pa-0 white--text"
          height="10px"
          min-width="10px"
          text
          @click="onClose"
        >
          <img alt src="@/assets/close.svg" />
        </v-btn>
      </div>
      <v-card-title class="flex-h-center pa-0">
        <span style="font-size: 16px; font-weight: 500; color: #424242">
          {{ title }}
        </span>
      </v-card-title>
      <div
        class="pt-0 pt-4 pl-11 pr-11 flex-center flex-column"
        style="font-size: 14px; font-weight: 400; color: #a3a3a3"
      >
        <slot name="content" />
      </div>
      <v-card-actions
        name="actions"
        class="d-flex align-end pl-5 pr-5 pt-8 pb-5 justify-center"
      >
        <slot name="actions">
          <v-btn
            v-if="cancelText"
            height="30"
            color="#127BF8"
            :class="!confirmText ? 'white--text' : ''"
            :outlined="!!confirmText"
            :depressed="!confirmText"
            style="margin-left: 10px; margin-right: 10px"
            min-width="80"
            @click="onCancel"
            ><span class="normal-text">{{
              cancelText ? cancelText : $vuetify.lang.t('$vuetify.dxz.cancel')
            }}</span>
          </v-btn>
          <v-btn
            v-if="confirmText"
            class="white--text"
            depressed
            style="margin-left: 10px; margin-right: 10px"
            height="30"
            color="#127BF8"
            min-width="80"
            @click="onOk"
            ><span class="normal-text">{{
              confirmText ? confirmText : $vuetify.lang.t('$vuetify.dxz.ok')
            }}</span></v-btn
          >
        </slot>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { ref, toRefs, watch } from '@vue/composition-api'

export default {
  name: 'CommonDialogGroup',
  model: {
    prop: 'show',
    event: 'switch'
  },
  props: {
    cancelText: {
      type: String,
      default: ''
    },
    close: {
      type: Boolean,
      default: true
    },
    confirmText: {
      type: String,
      default: ''
    },
    show: {
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
    width: {
      type: Number,
      default: 400
    },
    maxWidth: {
      type: Number,
      default: 600
    }
  },
  setup(props, context) {
    const { show } = toRefs(props)
    let showDlg = ref(false)
    showDlg.value = show.value

    watch(show, (val) => {
      showDlg.value = val
    })
    return { showDlg }
  },
  data() {
    return {}
  },
  methods: {
    onClose() {
      this.$emit('cancelClick')
      this.$emit('switch', false)
    },
    onCancel() {
      this.$emit('cancelClick')
      this.$emit('switch', false)
    },
    onOk() {
      this.$emit('okClick')
      this.$emit('switch', false)
    }
  }
}
</script>

<style lang="scss" scoped></style>
