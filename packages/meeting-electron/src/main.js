import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import vuetify from './plugins/vuetify'
import ElectronStore from 'electron-store'
import log from 'electron-log'
import VueCompositionApi from '@vue/composition-api'
import unhandled from 'electron-unhandled'
import Notifications from './components/common/notification'
import './styles/common.scss'

unhandled()
Vue.config.productionTip = false
Vue.use(VueCompositionApi)

Object.assign(console, log.functions)
String.prototype.Trim = function () {
  return this.replace(/(^\s*)|(\s*$)/g, '')
}

const configStore = new ElectronStore({
  name: 'configStore',
  encryptionKey: process.env.VUE_APP_CONFIG_STORE_ENCRYPTION_KEY
})
const tmpDataStore = new ElectronStore({
  name: 'tmpDataStore',
  encryptionKey: process.env.VUE_APP_CONFIG_STORE_ENCRYPTION_KEY
})

Vue.prototype.$configStore = configStore
Vue.prototype.$tmpStore = tmpDataStore
Vue.prototype.$notify = Notifications
Vue.prototype.$eventBus = new Vue()

new Vue({
  router,
  store,
  vuetify,
  render: (h) => h(App)
}).$mount('#app')
