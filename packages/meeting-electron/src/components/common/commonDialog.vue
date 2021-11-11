<template>
  <v-dialog v-model="showDlg" :width="width" :max-width="maxWidth" persistent>
    <v-card>
      <v-card-title v-show="title" class="flex-h-center">{{ title }}</v-card-title>
      <div class="pt-5 pb-5 pl-11 pr-11 big-text flex-center">
        <slot name="content">
          <span>{{ content }}</span>
        </slot>
      </div>
      <v-divider />
      <v-card-actions
        name="actions"
        class="d-flex align-end pl-0 pr-0 pt-0 pb-0 justify-space-between"
      >
        <slot name="actions">
          <v-btn
            class="btn-left mr-0"
            depressed
            height="38"
            color="#ffff"
            :width="width / 2"
            tile
            @click="onCancel"
            >{{
              cancelBtnLabel ? cancelBtnLabel : $vuetify.lang.t('$vuetify.meeting.cancel')
            }}
          </v-btn>
          <v-divider vertical />
          <v-btn
            class="mr-0"
            depressed
            height="38"
            color="#fff"
            :width="width / 2 - 1"
            @click="onOk"
            ><span class="pt-0 mb-0" style="color: #127bf8">{{
              confirmBtnLabel ? confirmBtnLabel : $vuetify.lang.t('$vuetify.meeting.ok')
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
  name: 'CommonDialog',
  model: {
    prop: 'show',
    event: 'switch'
  },
  props: {
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
    },
    cancelBtnLabel: {
      type: String,
      default: ''
    },
    confirmBtnLabel: {
      type: String,
      default: ''
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
  methods: {
    onCancel() {
      this.$emit('cancelClick')
      this.$emit('switch', false)
    },
    onOk() {
      this.$emit('confirmClick')
      this.$emit('switch', false)
    }
  }
}
</script>

<style scoped></style>
