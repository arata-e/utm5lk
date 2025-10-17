<template>
  <div class="profile-container">
    <b-row align-h="center">
      <b-col cols="12" md="8" lg="6" xl="4">
        <b-card-group deck>
            <UserProfileEdit/>
        </b-card-group>
      </b-col>
    </b-row>
  </div>
</template>

<style>
</style>

<script>
import UserProfileEdit from '@/components/UserProfileEdit'

export default {
  components: {
    UserProfileEdit
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
    }
  },
  mounted () {
    this.$store.dispatch('GET_PROFILE')
    this.$store.dispatch('GET_STATISTICS')
    this.$store.dispatch('GET_TRANSFER_FUNDS_SETTINGS')
    this.$store.dispatch('GET_PROMISED_PAYMENT_SETTINGS')
    this.$store.dispatch('GET_INDEPENDENT_CONNECT_SERVICES_SETTINGS')
  }
}
</script>
