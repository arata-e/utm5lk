<template>
  <div class="payments-container">
    <b-row align-h="center" align-v="center">
      <b-col cols="12" md="10" lg="10" xl="5">
        <b-card id="payments">
          <div>
            <div class="title">{{ $t('Choose payment system') }}</div>
            <b-list-group style="padding-top:15px">
              <b-list-group-item
                v-for="item in enabledPaymentSystems"
                v-bind:key="item.id"
                @click="selectPaymentSystem(item)"
                v-bind:class="{ active: (item.id == paymentSystemID), inactive: (item.id != paymentSystemID)}" style="cursor:pointer;">

                <b-img-lazy center id="paymentSystem" :src="item.img" ></b-img-lazy>
              </b-list-group-item>
            </b-list-group>
          </div>
        </b-card>
      </b-col>
    </b-row>

    <ModalMakePayment v-if="profile.accounts" :profile="profile" :selectedPaymentSystem="selectedPaymentSystem" @hidden="makePaymentHidden"/>
  </div>
</template>

<style>
@media only screen and (min-width: 500px) {
  img#paymentSystem {
    height:80px;
  }
}
@media only screen and (max-width: 500px) {
  img#paymentSystem {
    height:40px;
  }
}
</style>

<script>
import ModalMakePayment from '@/components/modals/ModalMakePayment'

export default {
  components: {
    ModalMakePayment
  },
  data () {
    return {
      amount: 0,
      selectedPaymentSystem: null,
      items: [
        {
          'id': 1,
          'name': 'Sberbank',
          'img': require('@/assets/img/sberbank.png')
        },
        {
          'id': 3,
          'name': 'Yandex',
          'img': require('@/assets/img/yandex.png')
        },
        {
          'id': 4,
          'name': 'PayPal',
          'img': require('@/assets/img/paypal.png')
        },
        {
          'id': 5,
          'name': 'Robokassa',
          'img': require('@/assets/img/robokassa.png')
        },
        {
          'id': 6,
          'name': 'Tinkoff',
          'img': require('@/assets/img/tinkoff.png')
        },
        {
          'id': 7,
          'name': 'Alfabank',
          'img': require('@/assets/img/alfabank.png')
        },
        {
          'id': 8,
          'name': 'Webmoney',
          'img': require('@/assets/img/webmoney.png')
        },
        {
          'id': 9,
          'name': 'RFI',
          'img': require('@/assets/img/rfi.png')
        },
        {
          'id': 10,
          'name': 'YooKassaV3',
          'img': require('@/assets/img/yookassav3.png')
        },
        {
          'id': 11,
          'name': 'PSCB Acquiring',
          'img': require('@/assets/img/pscb.png')
        },
        {
          'id': 12,
          'name': 'PSBank',
          'img': require('@/assets/img/psbank.png')
        },
        {
          'id': 13,
          'name': 'BSPB',
          'img': require('@/assets/img/bspb.png')
        },
        {
          'id': 14,
          'name': 'CKassa Acquiring',
          'img': require('@/assets/img/ckassa.png')
        },
        {
          'id': 15,
          'name': 'ChronoPay',
          'img': require('@/assets/img/chronopay.png')
        },
        {
          'id': 16,
          'name': 'PayKeeper',
          'img': require('@/assets/img/PayKeeper.png')
        },
        {
          'id': 17,
          'name': 'IntellectMoney',
          'img': require('@/assets/img/IntellectMoney_Logo.png')
        },
        {
          'id': 19,
          'name': 'Gazprombank',
          'img': require('@/assets/img/Gazprombank.png')
        },
        {
          'id': 20,
          'name': 'BankOfMaldives',
          'img': require('@/assets/img/BankOfMaldives.png')
        },
        {
          'id': 21,
          'name': 'SberQrSBP',
          'img': require('@/assets/img/sberbankSBP.png')
        }
      ],
      paymentSystemID: 0
    }
  },
  computed: {
    profile () {
      return this.$store.getters.PROFILE
    },
    paymentSystemsSettings () {
      return this.$store.getters.PAYMENT_SYSTEM_SETTINGS
    },
    enabledPaymentSystems () {
      return this.items.filter(item => this.ifEnabled(item))
    }
  },
  methods: {
    selectPaymentSystem (item) {
      this.paymentSystemID = item.id
      this.selectedPaymentSystem = item
      this.paymentSystemsSettings.forEach(ps => {
        if (ps.name === item.name) {
          this.selectedPaymentSystem.paymentFee = ps.paymentFee
          this.selectedPaymentSystem.is_recurrent_available = ps.is_recurrent_available
        }
      })
      this.$root.$emit('bv::show::modal', 'modalMakePayment', '#btnShow')
    },
    ifEnabled (ps) {
      for (let psSetting of this.paymentSystemsSettings) {
        if (psSetting.name === ps.name) {
          return psSetting.enabled
        }
      }
      return false
    },
    makePaymentHidden () {
      this.selectedPaymentSystem = null
      this.paymentSystemID = 0
    }
  },
  mounted () {
    this.$store.dispatch('GET_PROFILE')
    this.$store.dispatch('GET_IS_PROHIBIT_PENNY')
    this.$store.dispatch('GET_MIN_PAYMENT')
    this.$store.dispatch('GET_PAYMENT_SYSTEM_SETTINGS')
  }
}
</script>
