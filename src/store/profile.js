import axiosInstance from '@/api.js'

var state = {
  profile: {
    tariffs: [],
    accounts: [],
    groups: []
  },
  services: [],
  tariffs: [],
  statistics: [],
  blockStatistics: [],
  blockStatisticsError: [],
  fullStatistics: [],
  fullStatisticsStatus: [],
  sessionsStatistics: [],
  sessionsStatisticsError: [],
  trafficStat: [],
  trafficStatError: [],
  telephonyStat: [],
  telephonyStatError: [],
  invoice_docs: [],
  invoice_VAT_docs: [],
  acceptance_docs: [],
  invoice_detail_docs: [],
  tv24_subscriptions: [],
  required_payment: 0,
  allowed_oauth: [],
  isSIREnabled: false,
  loginSettings: {
    is_login_via_login: false,
    is_login_via_phone: false,
    is_login_via_hotspot: false,
    login_type: ''
  },
  contracts: []
}

var getters = {
  CONTRACTS: (state) => {
    return state.contracts
  },
  PROFILE: (state) => {
    return state.profile
  },
  SERVICES: (state) => {
    return state.services
  },
  TARIFFS: (state) => {
    return state.tariffs
  },
  STATISTICS: (state) => {
    return state.statistics
  },
  FULL_STATISTICS: (state) => {
    return state.fullStatistics
  },
  FULL_STATISTICS_ERROR: (state) => {
    return state.fullStatisticsStatus
  },
  BLOCK_STATISTICS: (state) => {
    return state.blockStatistics
  },
  BLOCK_STATISTICS_ERROR: (state) => {
    return state.blockStatisticsError
  },
  SESSIONS: (state) => {
    return state.sessionsStatistics
  },
  SESSIONS_ERROR: (state) => {
    return state.sessionsStatisticsError
  },
  TRAFFIC: (state) => {
    return state.trafficStat
  },
  TRAFFIC_ERROR: (state) => {
    return state.trafficStatError
  },
  TELEPHONY: (state) => {
    return state.telephonyStat
  },
  TELEPHONY_ERROR: (state) => {
    return state.telephonyStatError
  },
  INVOICES: (state) => {
    return state.invoice_docs
  },
  INVOICES_VAT: (state) => {
    return state.invoice_VAT_docs
  },
  ACCEPTANCE_DOCS: (state) => {
    return state.acceptance_docs
  },
  INVOICE_DETAIL: (state) => {
    return state.invoice_detail_docs
  },
  TV24_SUBSCRIPTIONS: (state) => {
    return state.tv24_subscriptions
  },
  REQUIRED_PAYMENT: (state) => {
    return state.required_payment
  },
  ALLOWED_OAUTH: (state) => {
    return state.allowed_oauth
  },
  IS_SIR_ENABLED: (state) => {
    return state.isSIREnabled
  },
  LOGIN_SETTINGS: (state) => {
    return state.loginSettings
  }
}

var mutations = {
  SET_PROFILE: (state, payload) => {
    if (payload) {
      payload.tariffs = payload.tariffs || []
      payload.groups = payload.groups || []
    }
    state.profile = payload || {
      tariffs: [],
      accounts: [],
      groups: []
    }
  },
  SET_SERVICES: (state, payload) => {
    state.services = payload || []
  },
  SET_TARIFFS: (state, payload) => {
    state.tariffs = payload || []
  },
  SET_STATISTICS: (state, payload) => {
    state.statistics = payload || []
  },
  SET_FULL_STATISTICS: (state, payload) => {
    state.fullStatistics = payload || []
  },
  SET_FULL_STATISTICS_ERROR: (state, payload) => {
    state.fullStatisticsStatus = payload || []
  },
  SET_BLOCK_STATISTICS: (state, payload) => {
    state.blockStatistics = payload || []
  },
  SET_BLOCK_STATISTICS_ERROR: (state, payload) => {
    state.blockStatisticsError = payload || []
  },
  SET_SESSIONS: (state, payload) => {
    state.sessionsStatistics = payload || []
  },
  SET_SESSIONS_ERROR: (state, payload) => {
    state.sessionsStatisticsError = payload || []
  },
  SET_TRAFFIC: (state, payload) => {
    state.trafficStat = payload || []
  },
  SET_TRAFFIC_ERROR: (state, payload) => {
    state.trafficStatError = payload || []
  },
  SET_TELEPHONY: (state, payload) => {
    state.telephonyStat = payload || []
  },
  SET_TELEPHONY_ERROR: (state, payload) => {
    state.telephonyStatError = payload || []
  },
  SET_INVOICES: (state, payload) => {
    state.invoice_docs = payload || []
  },
  SET_INVOICES_VAT: (state, payload) => {
    state.invoice_VAT_docs = payload || []
  },
  SET_ACCEPTANCES: (state, payload) => {
    state.acceptance_docs = payload || []
  },
  SET_INVOICE_DATAIL: (state, payload) => {
    state.invoice_detail_docs = payload || []
  },
  SET_24TV_SUBSCRIPTIONS: (state, payload) => {
    state.tv24_subscriptions = payload || []
  },
  SET_CONTRACTS: (state, payload) => {
    state.contracts = payload || []
  },
  SET_REQUIRED_PAYMENT: (state, payload) => {
    state.required_payment = payload.required_payment || 0
  },
  SET_ALLOWED_OAUTH: (state, payload) => {
    state.allowed_oauth = payload || []
  },
  SET_IS_SIR_ENABLED: (state, payload) => {
    state.isSIREnabled = payload === 1
  },
  SET_LOGIN_SETTINGS: (state, payload) => {
    state.loginSettings = payload || {
      is_login_via_login: false,
      is_login_via_phone: false,
      is_login_via_hotspot: false,
      login_type: ''
    }
  }
}

var actions = {
  GET_PROFILE: async (context, payload) => {
    let profile = await axiosInstance.get('auth/profile')
    if (profile.status === 200) {
      for (let el of profile.data.accounts) {
        let response = await axiosInstance.get('auth/voluntarysuspensionsettings?account_id=' + el.id)
        el.vs_settings = response.data
      }
      context.commit('SET_PROFILE', profile.data)
    }
  },
  GET_SERVICES: async (context, payload) => {
    axiosInstance.get('auth/services').then(newServices => {
      if (newServices.status === 200) {
        context.commit('SET_SERVICES', newServices.data)
      }
    })
  },
  GET_TARIFFS: async (context, payload) => {
    let tariffs = await axiosInstance.get('auth/switch_tariffs', {timeout: 150000})
    if (tariffs.status === 200) {
      context.commit('SET_TARIFFS', tariffs.data)
    }
  },
  GET_STATISTICS: async (context, payload) => {
    let statistics = await axiosInstance.get('auth/statistics', {timeout: 150000})
    if (statistics.status === 200) {
      if (statistics.data) {
        statistics.data.sort(function (a, b) {
          if (a.actual_date > b.actual_date) {
            return -1
          }
          if (a.actual_date < b.actual_date) {
            return 1
          }
          return 0
        })
        context.commit('SET_STATISTICS', statistics.data)
      }
    }
  },
  GET_FULL_STATISTICS: async (context, payload) => {
    let statistics = await axiosInstance.get('auth/full_statistics?start_date=' + payload.start_date + '&end_date=' + payload.end_date, {timeout: 150000})
    if (statistics.status === 200) {
      if (statistics.data) {
        statistics.data.sort(function (a, b) {
          if (a.actual_date > b.actual_date) {
            return -1
          }
          if (a.actual_date < b.actual_date) {
            return 1
          }
          return 0
        })
        context.commit('SET_FULL_STATISTICS', statistics.data)
      }
    } else {
      context.commit('SET_FULL_STATISTICS_ERROR', statistics.data)
    }
  },
  GET_BLOCK_STATISTICS: async (context, payload) => {
    let statistics = await axiosInstance.get('auth/block_statistics?start_date=' + payload.start_date + '&end_date=' + payload.end_date, {timeout: 150000})
    if (statistics.status === 200) {
      if (statistics.data) {
        statistics.data.sort(function (a, b) {
          if (a.start_date > b.start_date) {
            return -1
          }
          if (a.start_date < b.start_date) {
            return 1
          }
          return 0
        })
        context.commit('SET_BLOCK_STATISTICS', statistics.data)
      }
    } else {
      context.commit('SET_BLOCK_STATISTICS_ERROR', statistics.data)
    }
  },
  GET_SESSIONS: async (context, payload) => {
    let statistics = await axiosInstance.get('auth/sessions?start_date=' + payload.start_date + '&end_date=' + payload.end_date, {timeout: 150000})
    if (statistics.status === 200) {
      if (statistics.data) {
        statistics.data.sort(function (a, b) {
          if (a.last_update_date > b.last_update_date) {
            return -1
          }
          if (a.last_update_date < b.last_update_date) {
            return 1
          }
          return 0
        })
        context.commit('SET_SESSIONS', statistics.data)
      }
    } else {
      context.commit('SET_SESSIONS_ERROR', statistics.data)
    }
  },
  GET_TRAFFIC: async (context, payload) => {
    let statistics = await axiosInstance.get('auth/traffic?start_date=' + payload.start_date + '&end_date=' + payload.end_date, {timeout: 150000})
    if (statistics.status === 200) {
      context.commit('SET_TRAFFIC', statistics.data)
    } else {
      context.commit('SET_TRAFFIC_ERROR', statistics.data)
    }
  },
  GET_TELEPHONY_REPORTS: async (context, payload) => {
    let statistics = await axiosInstance.get('auth/telephony?start_date=' + payload.start_date + '&end_date=' + payload.end_date, {timeout: 150000})
    if (statistics.status === 200) {
      context.commit('SET_TELEPHONY', statistics.data)
    } else {
      context.commit('SET_TELEPHONY_ERROR', statistics.data)
    }
  },
  GET_DOCS: async (context, payload) => {
    let statistics = await axiosInstance.get('auth/docs')
    if (statistics.status === 200) {
      context.commit('SET_INVOICES', statistics.data.invoices)
      context.commit('SET_INVOICES_VAT', statistics.data.invoices_VAT)
      context.commit('SET_ACCEPTANCES', statistics.data.acceptances)
      context.commit('SET_INVOICE_DATAIL', statistics.data.invoices_detail)
    }
  },
  GET_CONTRACTS: async (context, payload) => {
    let subs = await axiosInstance.get('auth/contracts')
    if (subs.status === 200) {
      context.commit('SET_CONTRACTS', subs.data)
    }
  },
  EDIT_PROFILE: async (context, payload) => {
    return axiosInstance.put('auth/profile', payload)
  },
  CHANGE_TARIFF: async (context, payload) => {
    return axiosInstance.post('auth/tariffs', payload)
  },
  MOVE_FUNDS: async (context, payload) => {
    return axiosInstance.post('auth/movefunds', payload)
  },
  ENABLE_TURBO_MODE: async (context, payload) => {
    return axiosInstance.post('auth/turbomode', payload)
  },
  CHANGE_ACCOUNT_INT_STATUS: async (context, payload) => {
    return axiosInstance.post('auth/changeaccountintstatus', payload)
  },
  CONNECT_SERVICE: async (context, payload) => {
    return axiosInstance.post('auth/independent_connect_services', payload)
  },
  DOWNLOAD_CONTRACT: async (context, urlParams) => {
    return axiosInstance.get('auth/download_contract?contract_id=' + urlParams.id +
    '&is_conv=' + urlParams.isConvToODT, {responseType: 'blob'})
  },
  DOWNLOAD_USER_INFO: async (context, urlParams) => {
    return axiosInstance.get('auth/download_doc?doc_type=' + urlParams.docType +
    '&invoice_id=' + urlParams.invoiceID +
    '&user_id=' + urlParams.user_id +
    '&base_id=' + urlParams.user_id +
    '&file_type=' + urlParams.fileType, {responseType: 'blob'})
  },
  DOWNLOAD_DOC: async (context, urlParams) => {
    return axiosInstance.get('auth/download_doc?doc_type=' + urlParams.docType +
    '&invoice_id=' + urlParams.invoiceID +
    '&file_type=' + urlParams.fileType, {responseType: 'blob'})
  },
  CLEAR_STORE: (context, payload) => {
    localStorage.removeItem('statistics')
    localStorage.removeItem('tariffs')
    localStorage.removeItem('services')
    localStorage.removeItem('profile')
  },
  GET_24TV_SUBSCRIPTIONS: async (context, payload) => {
    let subs = await axiosInstance.get('auth/24tv_subscriptions')
    if (subs.status === 200) {
      context.commit('SET_24TV_SUBSCRIPTIONS', subs.data)
    }
  },
  DELETE_24TV_SUBSCRIPTION: (context, payload) => {
    return axiosInstance.delete('/auth/24tv_subscriptions?subscription_id=' + payload)
  },
  CHANGE_24TV_SUBSCRIPTION_STATUS: (context, payload) => {
    if (payload.pause_id) {
      return axiosInstance.put('/auth/24tv_subscriptions?subscription_id=' + payload.subscription_id + '&pause_id=' + payload.pause_id)
    } else {
      return axiosInstance.put('/auth/24tv_subscriptions?subscription_id=' + payload.subscription_id)
    }
  },
  GET_REQUIRED_PAYMENT: async (context, payload) => {
    let resp = await axiosInstance.get('auth/requiredpayment?account_id=' + payload)
    if (resp.status === 200) {
      context.commit('SET_REQUIRED_PAYMENT', resp.data)
    }
  },
  GET_ALLOWED_OAUTH: async (context, payload) => {
    axiosInstance.get('allowed_oauth').then(resp => {
      if (resp.status === 200) {
        context.commit('SET_ALLOWED_OAUTH', resp.data)
      }
    })
  },
  GET_LOGIN_SETTINGS: async (context, payload) => {
    axiosInstance.get('login_settings').then(resp => {
      if (resp.status === 200) {
        context.commit('SET_LOGIN_SETTINGS', resp.data)
      }
    })
  },
  REMOVE_SERVICE_LINK: async (context, payload) => {
    return axiosInstance.delete('auth/independent_connect_services?slink_id=' + payload)
  },
  ACTIVATE_SIR: async (context, payload) => {
    return axiosInstance.post('auth/sir_connect_service', payload)
  },
  GET_IS_SIR_ENABLED: async (context, payload) => {
    let result = await axiosInstance.get('auth/is_allowed_sir_connect_service')
    context.commit('SET_IS_SIR_ENABLED', result.data)
  }
}

export default {
  state,
  getters,
  mutations,
  actions
}
