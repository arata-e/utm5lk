import axiosInstance from '@/api.js'

var state = {
  totalBonus: 0,
  isBonusEnabled: false
}

var getters = {
  TOTAL_BONUS: (state) => {
    return state.totalBonus
  },
  IS_BONUS_ENABLED: (state) => {
    return state.isBonusEnabled
  }
}

var mutations = {
  SET_TOTAL_BONUS: (state, payload) => {
    state.totalBonus = payload.total
  },
  SET_IS_BONUS_ENABLED: (state, payload) => {
    state.isBonusEnabled = payload.is_enabled === 1
  }
}

var actions = {
  GET_TOTAL_BONUS: async (context, payload) => {
    let result = await axiosInstance.get('auth/total_bonus')
    context.commit('SET_TOTAL_BONUS', result.data)
  },
  GET_IS_BONUS_ENABLED: async (context, payload) => {
    let result = await axiosInstance.get('auth/is_bonus_enabled')
    context.commit('SET_IS_BONUS_ENABLED', result.data)
  }
}

export default {
  state,
  getters,
  mutations,
  actions
}
