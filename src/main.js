// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import BootstrapVue from 'bootstrap-vue'
import i18n from './i18n'
import VueNavigationBar from 'vue-navigation-bar'
import api from './api.js'
import VueMoment from 'vue-moment'
import moment from 'moment-timezone'
import {store} from './store/store'
import VueCookie from 'vue-cookie'
import MaskedInput from 'vue-masked-input'
import VueCryptojs from 'vue-cryptojs'
import VueFriendlyIframe from 'vue-friendly-iframe'
import SupportChat from 'vue-beautiful-chat'

import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
import 'vue-navigation-bar/dist/vue-navigation-bar.css'

import './common.css'

Vue.use(VueMoment, { moment })
Vue.use(BootstrapVue)
Vue.config.productionTip = false
Vue.component('vue-navigation-bar', VueNavigationBar)
Vue.component('masked-input', MaskedInput)
Vue.use(api)
Vue.use(VueCookie)
Vue.use(VueCryptojs)
Vue.use(VueFriendlyIframe)
Vue.use(SupportChat)

export const cookie = VueCookie
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  i18n,
  store,
  cookie,
  template: '<App/>',
  components: { App }
})
