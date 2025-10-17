<template>
    <b-modal id="modalMakePayment" hide-footer hide-header centered @hidden="modalMakePaymentHidden"  @show="modalMakePaymentShow">
      <div v-if="this.accounts.length > 1">
          <div class="title">Выберите счет</div>
          <b-row align-h="center" align-v="center" style="margin-top:0.5rem">
          <b-col cols="12" md="4" lg="5" xl="5">
              <b-form-select v-model="account" :options="accounts" @change="ChangedAccount" />
          </b-col>
        </b-row>
      </div>
      <div class="title">Введите сумму</div>
      <b-row align-h="center" align-v="center" style="margin-top:0.5rem">
        <b-col cols="7" md="auto" lg="5" xl="5">
          <b-form-input id="input-amount" type="number" v-model="amount" aria-describedby="input-live-feedback" :state="amountState"/>
        </b-col>
        <b-form-invalid-feedback id="input-live-feedback">
          {{$t('Payment should be more than') + ' ' + this.minPayment}}
        </b-form-invalid-feedback>
        <b-col cols="2" v-if="paymentFee>0">
            <label>{{ $t('Included fee:') }}</label>
        </b-col>
        <b-col cols="3" v-if="paymentFee>0">
          <b-form-input disabled type="number" v-model="paymentFee"></b-form-input>
        </b-col>
      </b-row>
      <div v-if="selectedPaymentSystem">
        <div v-if="selectedPaymentSystem.is_recurrent_available" class="title">{{$t('Set recurrent payment')}}</div>
        <b-row v-if="selectedPaymentSystem.is_recurrent_available" align-h="center" align-v="center" style="margin-top:0.5rem">
          <b-form-checkbox switch size="lg" v-model="isRecurrent"/>
        </b-row>
      </div>
      <b-row align-h="center" align-v="center" style="margin-top:0.5rem">
        <b-col cols="12" md="4" lg="3" xl="3">
          <b-button variant="info" @click="payment" block> {{ $t('Payment') }} </b-button>
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
      paymentFee: 0,
      account: 0,
      isRecurrent: false
    }
  },
  props: {
    profile: null,
    selectedPaymentSystem: null
  },
  methods: {
    async ChangedAccount () {
      if (this.account > 0) {
        let requiredPayment = await axiosInstance.get('auth/requiredpayment?account_id=' + this.account)
        this.paymentFee = (requiredPayment.data.required_payment / 100) * this.selectedPaymentSystem.paymentFee
        this.paymentFee = Math.ceil(this.paymentFee * 100) / 100
        this.amount = requiredPayment.data.required_payment + this.paymentFee
        this.amount = Math.ceil(this.amount * 100) / 100
      } else {
        this.amount = 0
      }
    },
    modalMakePaymentShow () {
      this.account = this.profile.accounts[0].id
      this.ChangedAccount()
    },
    async payment () {
      if (this.amount < this.minPayment) {
        this.$bvToast.toast(this.$t('Payment should be more than') + ' ' + this.minPayment, {
          title: `Warning`,
          variant: `warning`,
          solid: true
        })
        return
      }
      if (this.isProhibitPenny) {
        this.amount = Math.ceil(this.amount)
      }
      if (this.selectedPaymentSystem.id > 0) {
        this.makePayment()
      } else {
        this.$bvToast.toast('Choose payment system', {
          title: `Warning`,
          variant: `warning`,
          solid: true
        })
      }
    },
    async makePayment () {
      let paymentData = {
        'amount': parseFloat(this.amount),
        'account': this.account,
        'payment_system': this.selectedPaymentSystem.name,
        'is_recurrent': this.isRecurrent
      }

      paymentData = await axiosInstance.post('auth/makepayment', paymentData)
      if (paymentData.data.formUrl) {
        if (paymentData.data.formData.length > 0) {
          let params = paymentData.data.formData.split('&')

          let form = document.createElement('form')
          form.action = paymentData.data.formUrl
          form.method = 'POST'

          for (let i = 0; i < params.length; i++) {
            let splittedParam = params[i].split('=')
            let element = document.createElement('input')
            element.name = splittedParam[0]
            element.value = params[i].substr(splittedParam[0].length + 1)
            element.setAttribute('type', 'hidden')
            form.appendChild(element)
          }

          document.body.appendChild(form)
          form.submit()
        } else {
          window.location = paymentData.data.formUrl
        }
      }
    },
    modalMakePaymentHidden () {
      this.$emit('hidden')
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
    isProhibitPenny () {
      return this.$store.getters.IS_PROHIBIT_PENNY
    },
    minPayment () {
      return this.$store.getters.MIN_PAYMENT
    },
    amountState () {
      return this.amount >= this.minPayment
    }
  },
  watch: {
    amount (val) {
      let fee = (val / 100) * this.selectedPaymentSystem.paymentFee
      this.paymentFee = Math.ceil(fee * 100) / 100
    }
  }
}
</script>
