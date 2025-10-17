import axiosInstance from '@/api.js'

var state = {
  chatSettings: []
}

var getters = {
  CHAT_SETTINGS: (state) => {
    return state.chatSettings
  }
}

var mutations = {
  SET_CHAT_SETTINGS: (state, payload) => {
    state.chatSettings = payload
  }
}

var actions = {
  GET_CHAT_SETTINGS: async (context, payload) => {
    let result = await axiosInstance.get('auth/chat_settings')
    context.commit('SET_CHAT_SETTINGS', result.data)
  }
}

export default {
  state,
  getters,
  mutations,
  actions
}
