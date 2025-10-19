import axiosInstance from '@/api.js'

var state = {
  paymentSystemSettings: [],
  switchTariffSettings: [],
  transferFundsSettings: [],
  promisedPaymentSettings: {},
  independentConnectServicesSettings: [],
  isAllowedEditProfile: {
    is_enabled: 0
  },
  AllowedReports: [],
  AllowedDocs: [],
  AllowedActivatingCard: [],
  isEnabledRentsoft: false,
  isEnabled24TV: false,
  isProhibitPenny: false,
  minPayment: 0,
  recurrentPayments: [],
  clickableServices: {}
}

var getters = {
  PAYMENT_SYSTEM_SETTINGS: (state) => {
    return state.paymentSystemSettings
  },
  SWITCH_TARIFF_SETTINGS: (state) => {
    return state.switchTariffSettings
  },
  TRANSFER_FUNDS_SETTINGS: (state) => {
    return state.transferFundsSettings
  },
  PROMISED_PAYMENT_SETTINGS: (state) => {
    return state.promisedPaymentSettings
  },
  INDEPENDENT_CONNECT_SERVICES_SETTINGS: (state) => {
    return state.independentConnectServicesSettings
  },
  IS_ALLOWED_EDIT_PROFILE: (state) => {
    return state.isAllowedEditProfile
  },
  ALLOWED_REPORTS: (state) => {
    return state.AllowedReports
  },
  ALLOWED_DOCS: (state) => {
    return state.AllowedDocs
  },
  ALLOWED_ACTIVATING_CARD: (state) => {
    return state.AllowedActivatingCard
  },
  IS_RENTSOFT_ENABLED: (state) => {
    return state.isEnabledRentsoft
  },
  IS_24TV_ENABLED: (state) => {
    return state.isEnabled24TV
  },
  IS_PROHIBIT_PENNY: (state) => {
    return state.isProhibitPenny
  },
  MIN_PAYMENT: (state) => {
    return state.minPayment
  },
  RECURRENT_PAYMENTS: (state) => {
    return state.recurrentPayments
  },
  CLICKABLE_SERVICES: (state) => {
    return state.clickableServices
  }
}

var mutations = {
  SET_PAYMENT_SYSTEM_SETTINGS: (state, payload) => {
    state.paymentSystemSettings = payload || []
  },
  SET_SWITCH_TARIFF_SETTINGS: (state, payload) => {
    state.switchTariffSettings = payload || []
  },
  SET_TRANSFER_FUNDS_SETTINGS: (state, payload) => {
    state.transferFundsSettings = payload || {}
  },
  SET_PROMISED_PAYMENT_SETTINGS: (state, payload) => {
    state.promisedPaymentSettings = payload || {}
  },
  SET_INDEPENDENT_CONNECT_SERVICES_SETTINGS: (state, payload) => {
    state.independentConnectServicesSettings = payload || []
  },
  SET_IS_ALLOWED_EDIT_PROFILE: (state, payload) => {
    state.isAllowedEditProfile = payload
  },
  SET_IS_ALLOWED_REPORTS: (state, payload) => {
    state.AllowedReports = payload
  },
  SET_IS_ALLOWED_DOCS: (state, payload) => {
    state.AllowedDocs = payload
  },
  SET_IS_ALLOWED_ACTIVATING_CARD: (state, payload) => {
    state.AllowedActivatingCard = payload
  },
  SET_IS_ENABLED_RENTSOFT: (state, payload) => {
    state.isEnabledRentsoft = payload === 1 || false
  },
  SET_IS_ALLOWED_24TV: (state, payload) => {
    state.isEnabled24TV = payload
  },
  SET_IS_PROHIBIT_PENNY: (state, payload) => {
    state.isProhibitPenny = payload
  },
  SET_MIN_PAYMENT: (state, payload) => {
    state.minPayment = payload
  },
  SET_RECURRENT_PAYMENTS: (state, payload) => {
    state.recurrentPayments = payload || []
  },
  SET_CLICKABLE_SERVICES: (state, payload) => {
    state.clickableServices = payload || {}
  }
}

var actions = {
  GET_IS_PROHIBIT_PENNY: async (context, payload) => {
    let paymentSystemSettings = await axiosInstance.get('auth/is_prohibit_penny')
    context.commit('SET_IS_PROHIBIT_PENNY', paymentSystemSettings.data)
  },
  GET_MIN_PAYMENT: async (context, payload) => {
    let paymentSystemSettings = await axiosInstance.get('auth/min_payment')
    context.commit('SET_MIN_PAYMENT', paymentSystemSettings.data)
  },
  GET_PAYMENT_SYSTEM_SETTINGS: async (context, payload) => {
    let paymentSystemSettings = await axiosInstance.get('auth/settings')
    context.commit('SET_PAYMENT_SYSTEM_SETTINGS', paymentSystemSettings.data)
  },
  GET_SWITCH_TARIFF_SETTINGS: async (context, payload) => {
    let switchTariffSettings = await axiosInstance.get('auth/switchtariffsettings')
    context.commit('SET_SWITCH_TARIFF_SETTINGS', switchTariffSettings.data)
  },
  GET_TRANSFER_FUNDS_SETTINGS: async (context, payload) => {
    let transferFundsSettings = await axiosInstance.get('auth/movefunds')
    context.commit('SET_TRANSFER_FUNDS_SETTINGS', transferFundsSettings.data)
  },
  GET_PROMISED_PAYMENT_SETTINGS: async (context, payload) => {
    let promisedPaymentSettings = await axiosInstance.get('auth/promisedpaymentsettings')
    context.commit('SET_PROMISED_PAYMENT_SETTINGS', promisedPaymentSettings.data)
  },
  GET_RECURRENT_PAYMENTS: async (context, payload) => {
    let resp = await axiosInstance.get('auth/get_recurrent_payments')
    context.commit('SET_RECURRENT_PAYMENTS', resp.data)
  },
  GET_INDEPENDENT_CONNECT_SERVICES_SETTINGS: async (context, payload) => {
    let independentConnectServicesSettings = await axiosInstance.get('auth/independent_connect_services')
    context.commit('SET_INDEPENDENT_CONNECT_SERVICES_SETTINGS', independentConnectServicesSettings.data)
  },
  GET_VOLUNTARY_SUSPENSION_SETTINGS: async (context, payload) => {
    return axiosInstance.get('auth/voluntarysuspensionsettings?account_id=' + payload)
  },
  GET_IS_ALLOWED_EDIT_PROFILE: async (context, payload) => {
    let setting = await axiosInstance.get('auth/is_allowed_edit_profile')
    context.commit('SET_IS_ALLOWED_EDIT_PROFILE', setting.data)
  },
  GET_ALLOWED_REPORTS: async (context, payload) => {
    let setting = await axiosInstance.get('auth/allowed_reports')
    context.commit('SET_IS_ALLOWED_REPORTS', setting.data)
  },
  GET_ALLOWED_DOCS: async (context, payload) => {
    let setting = await axiosInstance.get('auth/allowed_docs')
    context.commit('SET_IS_ALLOWED_DOCS', setting.data)
  },
  GET_ALLOWED_ACTIVATIG_CARD: async (context, payload) => {
    let setting = await axiosInstance.get('auth/allowed_activating_card')
    context.commit('SET_IS_ALLOWED_ACTIVATING_CARD', setting.data)
  },
  GET_IS_ENABLED_RENTSOFT: async (context, payload) => {
    let setting = await axiosInstance.get('auth/rentsoft_is_enabled')
    context.commit('SET_IS_ENABLED_RENTSOFT', setting.data)
  },
  GET_IS_ALLOWED_24TV: async (context, payload) => {
    let setting = await axiosInstance.get('auth/allowed_24tv')
    context.commit('SET_IS_ALLOWED_24TV', setting.data)
  },
  REMOVE_RECURRENT_PAYMENTS: async (context, payload) => {
    return axiosInstance.delete('auth/delete_recurrent_payments')
  },
  GET_CLICKABLE_SERVICES: async (context, payload) => {
    try {
      const login = payload.login
      if (!login) {
        context.commit('SET_CLICKABLE_SERVICES', {})
        return
      }
      const response = await axiosInstance.post('https://esb.ccs.ru/get', { login: login })
      if (response.data && typeof response.data === 'object' && !Array.isArray(response.data)) {
        context.commit('SET_CLICKABLE_SERVICES', response.data)
      } else if (response.data && Array.isArray(response.data)) {
        const dict = {}
        response.data.forEach(serviceName => {
          dict[serviceName] = 'https://moix.ccs.ru'
        })
        context.commit('SET_CLICKABLE_SERVICES', dict)
      } else {
        context.commit('SET_CLICKABLE_SERVICES', {})
      }
    } catch (error) {
      console.error('Failed to fetch clickable services:', error)
      context.commit('SET_CLICKABLE_SERVICES', {})
    }
  }
}

export default {
  state,
  getters,
  mutations,
  actions
}
