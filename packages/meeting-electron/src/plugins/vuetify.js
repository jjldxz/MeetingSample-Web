import Vue from 'vue'
import Vuetify from 'vuetify/lib/framework'
import '@mdi/font/css/materialdesignicons.css'
import en from '../i18n/en'
import zhHans from '../i18n/zhHans'

Vue.use(Vuetify)

export default new Vuetify({
  lang: {
    locales: { en, zhHans },
    current: 'en'
  }
})
