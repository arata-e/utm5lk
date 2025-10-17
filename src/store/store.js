import Vue from 'vue'
import Vuex from 'vuex'
import profile from './profile'
import settings from './settings'
import reqPhone from './reqPhone'
import webSocket from './webSocket'
import chatSettings from './chat_settings'
import bonus from './bonus'

Vue.use(Vuex)

export const store = new Vuex.Store({
  state: { },
  getters: { },
  mutations: { },
  actions: { },
  modules: {
    profile,
    settings,
    reqPhone,
    webSocket,
    chatSettings,
    bonus
  }

})
