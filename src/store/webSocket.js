import axiosInstance from '@/api.js'

var state = {
  chatMsgs: []
}

var getters = {
  CHAT_MSGS: (state) => {
    return state.chatMsgs
  }
}

var mutations = {
  SET_CHAT_MSGS: (state, payload) => {
    state.chatMsgs = payload
  }
}

var actions = {
  GET_CHAT_MSGS: async (context, payload) => {
    let result = await axiosInstance.get('auth/chat_msgs')
    context.commit('SET_CHAT_MSGS', result.data)
  }
}

export default {
  state,
  getters,
  mutations,
  actions
}
