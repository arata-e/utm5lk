<template>
  <div class="profile-container">
    <b-row align-h="center">
      <b-col cols="12" md="12" lg="12" xl="10">
        <b-card-group deck>
          <UserProfile/>
          <UserServices/>
          <UserTariffs/>
        </b-card-group>
      </b-col>
    </b-row>

    <b-row v-if="isAllowed24TV && allSubscriptions.length > 0" align-h="center" style="margin-top: 0.8rem;">
      <b-col cols="0" md="12" lg="12" xl="10">
        <User24TVSubscriptions/>
      </b-col>
    </b-row>

    <b-row v-if="recurrentPayments.length > 0" align-h="center" style="margin-top: 0.8rem;">
      <b-col cols="0" md="12" lg="12" xl="10">
        <UserRecurrentPayments/>
      </b-col>
    </b-row>

    <b-row v-if="profile.accounts.length" align-h="center" style="margin-top: 0.8rem;">
      <b-col cols="0" md="12" lg="12" xl="10">
        <UserAccounts/>
      </b-col>
    </b-row>

    <b-row v-if="statistics.length" align-h="center" style="margin-top: 0.8rem;">
      <b-col cols="0" md="12" lg="12" xl="10">
        <UserStatistics/>
      </b-col>
    </b-row>
    <ModalMoveFunds/>
    <ModalPromisedPayment/>
    <ModalVoluntarySuspension/>
    <ModalAdditionalServices/>
    <ModalCardPayment/>
  </div>
</template>

<style>
</style>

<script>
import UserProfile from '@/components/UserProfile'
import UserServices from '@/components/UserServices'
import UserTariffs from '@/components/UserTariffs'
import UserStatistics from '@/components/UserStatistics'
import UserAccounts from '@/components/UserAccounts'
import User24TVSubscriptions from '@/components/User24TVSubscriptions'
import UserRecurrentPayments from '@/components/UserRecurrentPayments'

import ModalMoveFunds from '@/components/modals/ModalMoveFunds'
import ModalPromisedPayment from '@/components/modals/ModalPromisedPayment'
import ModalVoluntarySuspension from '@/components/modals/ModalVoluntarySuspension'
import ModalAdditionalServices from '@/components/modals/ModalAdditionalServices'
import ModalCardPayment from '@/components/modals/ModalCardPayment'

export default {
  components: {
    UserProfile,
    UserTariffs,
    UserServices,
    UserStatistics,
    UserAccounts,
    User24TVSubscriptions,
    UserRecurrentPayments,
    ModalMoveFunds,
    ModalPromisedPayment,
    ModalVoluntarySuspension,
    ModalAdditionalServices,
    ModalCardPayment
  },
  data () {
    return {
      paymentValue: 0
    }
  },
  computed: {
    profile () {
      return this.$store.getters.PROFILE
    },
    statistics () {
      return this.$store.getters.STATISTICS
    },
    isAllowed24TV () {
      return this.$store.getters.IS_24TV_ENABLED
    },
    allSubscriptions () {
      return this.$store.getters['TV24_SUBSCRIPTIONS']
    },
    recurrentPayments () {
      return this.$store.getters['RECURRENT_PAYMENTS']
    }
  },
  mounted () {
    this.$store.dispatch('GET_PROFILE')
    this.$store.dispatch('GET_STATISTICS')
    this.$store.dispatch('GET_TRANSFER_FUNDS_SETTINGS')
    this.$store.dispatch('GET_PROMISED_PAYMENT_SETTINGS')
    this.$store.dispatch('GET_INDEPENDENT_CONNECT_SERVICES_SETTINGS')
    this.$store.dispatch('GET_IS_ALLOWED_EDIT_PROFILE')
    this.$store.dispatch('GET_CHAT_SETTINGS')
    this.$store.dispatch('GET_IS_ALLOWED_24TV')
    this.$store.dispatch('GET_24TV_SUBSCRIPTIONS')
    this.$store.dispatch('GET_TOTAL_BONUS')
    this.$store.dispatch('GET_IS_BONUS_ENABLED')
    this.$store.dispatch('GET_IS_SIR_ENABLED')
    this.$store.dispatch('GET_RECURRENT_PAYMENTS')
  }
}
</script>
