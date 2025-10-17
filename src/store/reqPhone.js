import axiosInstance from '@/api.js'

var state = {
  keepAliveSession: [],
  phoneFormat: '1(111)111-11-11'
}

var getters = {
  KEEP_ALIVE_SESSION: (state) => {
    return state.keepAliveSession
  },
  PHONE_FORMAT: (state, payload) => {
    return state.phoneFormat
  }
}

var mutations = {
  SET_KEEP_ALIVE_SESSION: (state, payload) => {
    state.keepAliveSession = payload
  },
  SET_PHONE_FORMAT: (state, payload) => {
    state.phoneFormat = payload.phone_format
  }
}

var actions = {
  GET_KEEP_ALIVE_SESSION: async (context, payload) => {
    let result = await axiosInstance.put('auth/keep_alive_hs_session', null)
    context.commit('SET_KEEP_ALIVE_SESSION', result.data)
  },
  LOGIN_BY_PHONE: (context, payload) => {
    return axiosInstance.post('captive_login', payload)
  },
  CREATE_USERS_BY_PHONE: (context, payload) => {
    return axiosInstance.put('captive_portal/client_login_action', payload)
  },
  GET_PHONE_FORMAT: async (context, payload) => {
    let result = await axiosInstance.get('phone_format')
    context.commit('SET_PHONE_FORMAT', result.data)
  }
}

export default {
  state,
  getters,
  mutations,
  actions
}
