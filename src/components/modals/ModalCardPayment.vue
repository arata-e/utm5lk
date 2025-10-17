<template>
    <b-modal id="modalCardPayment" ref="modalCardPayment" hide-footer hide-header centered @show="modalCardPaymentShow">
        <div v-if="this.accounts.length > 1">
            <div class="title">{{ $t("Choose account") }}</div>
            <b-row align-h="center" align-v="center" style="margin-top:0.5rem">
            <b-col cols="12" md="4" lg="5" xl="5">
                <b-form-select v-model="account" :options="accounts" />
            </b-col>
          </b-row>
        </div>
        <div class="title">{{ $t("Card number") }}</div>
        <b-row align-h="center" align-v="center" style="margin-top:0.5rem">
          <b-col cols="12" md="4" lg="5" xl="5">
              <b-form-input type="number" v-model="cardID"></b-form-input>
          </b-col>
        </b-row>
        <div class="title">{{ $t("Card PIN") }}</div>
        <b-row align-h="center" align-v="center" style="margin-top:0.5rem">
          <b-col cols="12" md="4" lg="5" xl="5">
              <b-form-input type="text" v-model="secret"></b-form-input>
          </b-col>
        </b-row>
        <b-row align-h="center" align-v="center" style="margin-top:0.5rem">
          <b-col cols="12" md="6" lg="4" xl="4">
            <b-button variant="info" @click="makePayment" block> {{ $t('Activate') }} </b-button>
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
      cardID: 0,
      secret: '',
      account: 0
    }
  },
  methods: {
    modalCardPaymentShow () {
      this.cardID = 0
      this.secret = ''
      this.account = this.accounts[0].value
    },
    async makePayment () {
      if (parseInt(this.account) <= 0) {
        this.$bvToast.toast(this.$t('Account is invalid'), {
          title: this.$t('Error'),
          variant: `danger`,
          solid: true
        })
        return
      }
      if (parseInt(this.cardID) <= 0) {
        this.$bvToast.toast(this.$t('Card number is invalid'), {
          title: this.$t('Error'),
          variant: `danger`,
          solid: true
        })
        return
      }
      if (this.secret.length === 0) {
        this.$bvToast.toast(this.$t('Secret length is invalid'), {
          title: this.$t('Error'),
          variant: `danger`,
          solid: true
        })
        return
      }
      let paymentData = {
        'card': parseInt(this.cardID),
        'secret': this.secret,
        'account_id': this.account
      }
      axiosInstance.post('auth/cardpayment', paymentData).then(response => {
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
          this.$refs.modalCardPayment.hide()
        }
      })
    }
  },
  computed: {
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
    }
  }
}
</script>
