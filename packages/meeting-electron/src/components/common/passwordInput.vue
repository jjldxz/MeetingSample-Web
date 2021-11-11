<template>
  <v-text-field
    v-model="innerPassword"
    :placeholder="innerPlaceholder"
    oninput="value = value.replace(/[\u4E00-\u9FA5]/g,'')"
    :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
    :type="showPassword ? 'text' : 'password'"
    :rules="rules"
    clearable
    persistent-placeholder
    flat
    :dense="dense"
    @click:append="showPassword = !showPassword"
  >
    <template slot="label" class="mb-2">
      <span class="title">{{ innerTitle }}</span>
    </template>
  </v-text-field>
</template>

<script>
import { ref, toRefs, reactive } from '@vue/composition-api'

export default {
  name: 'PasswordInput',
  model: {
    prop: 'password',
    event: 'change'
  },
  props: {
    password: {
      type: String,
      default() {
        return ''
      }
    },
    confirm: {
      type: Boolean,
      default() {
        return false
      }
    },
    confirmPassword: {
      type: String
    },
    title: {
      type: String,
      default() {
        return ''
      }
    },
    placeholder: {
      type: String,
      default() {
        return ''
      }
    },
    dense: {
      type: Boolean,
      default() {
        return false
      }
    }
  },
  setup(props, context) {
    let innerPassword = ref(null)
    const { root } = context
    let { confirm, confirmPassword, title, placeholder } = toRefs(props)
    let innerTitle = ref(root.$vuetify.lang.t('$vuetify.meeting.password'))
    let innerPlaceholder = ref(root.$vuetify.lang.t('$vuetify.meeting.enterPassword'))
    let rules = reactive([
      (v) => !!v || root.$vuetify.lang.t('$vuetify.meeting.required')
    ])
    if (confirm.value) {
      innerTitle.value = root.$vuetify.lang.t('$vuetify.meeting.repeatPassword')
      innerPlaceholder.value = root.$vuetify.lang.t(
        '$vuetify.meeting.enterRepeatPassword'
      )
      rules.push(
        (v) =>
          confirmPassword.value === v ||
          root.$vuetify.lang.t('$vuetify.meeting.passwordNotMatch')
      )
    }
    if (title.value) {
      innerTitle.value = title.value
    }
    if (placeholder.value) {
      innerPlaceholder.value = placeholder.value
    }
    return { innerPassword, rules, innerPlaceholder, innerTitle }
  },
  data() {
    return {
      showPassword: false
    }
  },
  watch: {
    innerPassword(val, oldVal) {
      if (!val || val === oldVal) return
      this.$emit('change', val)
    }
  }
}
</script>

<style lang="scss" scoped>
.title {
  font-size: 1.5rem !important;
  line-height: inherit;
  padding-bottom: 5px;
}
</style>
