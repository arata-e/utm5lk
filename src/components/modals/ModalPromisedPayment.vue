<template>
    <b-modal id="modalPromisedPayment" ref="modalPromisedPayment" hide-footer hide-header centered @show="modalPromisedPaymentShow">
        <div v-if="this.accounts.length > 1">
            <div class="title">{{ $t('Choose account') }}</div>
            <b-row align-h="center" align-v="center" style="margin-top:0.5rem">
            <b-col cols="12" md="4" lg="5" xl="5">
                <b-form-select v-model="account" :options="accounts" />
            </b-col>
          </b-row>
        </div>
        <div class="title">{{ $t('Enter the amount') }}</div>
        <b-row align-h="center" align-v="center" style="margin-top:0.5rem">
          <b-col cols="12" md="4" lg="5" xl="5">
              <b-form-input type="number" v-model="amount" aria-describedby="input-live-help input-live-feedback" :state="amount <= promisedPaymentSettings.max_value && amount > 0"></b-form-input>
          </b-col>
        </b-row>
        <b-form-text id="input-live-help" style="text-align:center">{{ $t('Avaible value more then 0 and less')}} {{ this.promisedPaymentSettings.max_value }}</b-form-text>
        <div v-if="!isFree" style="margin-top:0.5rem">
          <div class="title">{{ $t('Service cost') }} : {{ this.promisedPaymentSettings.cost }}</div>
        </div>
        <b-row align-h="center" align-v="center" style="margin-top:0.5rem">
          <b-col cols="12" md="4" lg="3" xl="3">
            <b-button :disabled="disableButton" variant="info" @click="makePayment" block> {{ $t('Payment') }} </b-button>
          </b-col>
        </b-row>
    </b-modal>
</template>

<style>
input.number {
  text-align: right;
  box-shadow: 0px 3px 1px -2px rgba(0,0,0,0.2),0px 2px 2px 0px rgba(0,0,0,0.14),0px 1px 5px 0px rgba(0,0,0,0.12);
}
</style>

<script>
import axiosInstance from '@/api.js'

export default {
  data () {
    return {
      amount: 0,
      account: 0,
      disableButton: false
    }
  },
  methods: {
    modalPromisedPaymentShow () {
      this.amount = JSON.parse(JSON.stringify(this.promisedPaymentSettings.max_value))
      this.account = this.accounts[0].value
    },
    async makePayment () {
      let paymentData = {
        'value': parseFloat(this.amount),
        'account': this.account
      }
      axiosInstance.post('auth/promisedpayment', paymentData).then(response => {
        this.disableButton = true
        if (response.data.error) {
          this.$bvToast.toast(this.$t(response.data.error), {
            title: this.$t('Error'),
            variant: `danger`,
            solid: true
          })
        } else {
          setTimeout(this.$store.dispatch, 500, 'GET_PROFILE')
          setTimeout(this.$store.dispatch, 500, 'GET_STATISTICS')
          this.$bvToast.toast(this.$t('The payment went success'), {
            title: this.$t('Success'),
            variant: `success`,
            solid: true
          })

          this.$refs.modalPromisedPayment.hide()
        }
        setTimeout(() => { this.disableButton = false }, 1500)
      })
    }
  },
  computed: {
    isFree () {
      if (this.promisedPaymentSettings.cost === 0) {
        return true
      }
      if (!this.promisedPaymentSettings.use_free_balance) {
        return false
      }
      for (let el of this.profile.accounts) {
        if (el.id === this.account) {
          return el.balance > this.promisedPaymentSettings.free_balance
        }
      }
      return false
    },
    accounts () {
      let res = []
      if (this.profile) {
        for (let el of this.profile.accounts) {
          let newEl = {}
          newEl.value = el.id
          newEl.text = '(' + el.id + ')' + el.balance.toFixed(2)
          res.push(newEl)
        }
      }
      return res
    },
    profile () {
      return this.$store.getters.PROFILE
    },
    promisedPaymentSettings () {
      return this.$store.getters.PROMISED_PAYMENT_SETTINGS
    }
  }
}
</script>
