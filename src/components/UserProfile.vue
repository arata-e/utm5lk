<template>
    <b-card id="profile">
        <b-list-group flush  v-if="profile.is_active != null">
            <b-list-group-item>
                <b-row align-h="center">
                    <b-col align-self="left" md="9" xl="9" cols="9">
                        <div class="title"> {{ profile.full_name }}</div>
                    </b-col>
                    <b-col v-if="isAllowedEditProfile.is_enabled" align-self="center" md="3" xl="3" cols="3" id="tooltip">
                        <b-button size="sm" @click.stop="ClickOnEditButton" id="transparent">
                            <b-img :src='editImage'/>
                        </b-button>
                        <b-tooltip target="tooltip">
                          {{ $t('Editing personal data') }}
                        </b-tooltip>
                    </b-col>
                </b-row>
            </b-list-group-item>
            <b-list-group-item>
                <div class="d-flex w-100 justify-content-between text-align-vertical-middle">
                    <h5 class="no-margin-bottom"> {{ $t('Status') }}:</h5>
                    <h5 class="no-margin-bottom active"> {{ profile.is_active ? $t('Active') : $t('Disabled') }} </h5>
                </div>
            </b-list-group-item>
            <b-list-group-item>
                <div class="d-flex w-100 justify-content-between text-align-vertical-middle">
                    <h5 class="no-margin-bottom"> {{ $t('Balance') }}:</h5>
                    <h5 class="no-margin-bottom active"> {{ profile.balance.toFixed(2) }} </h5>
                </div>
            </b-list-group-item>
            <b-list-group-item v-if="totalBonus > 0 && isBonusEnabled">
                <div class="d-flex w-100 justify-content-between text-align-vertical-middle">
                    <h5 class="no-margin-bottom"> {{ $t('Bonus') }}:</h5>
                    <h5 class="no-margin-bottom active"> {{ totalBonus.toFixed(2) }} </h5>
                </div>
            </b-list-group-item>
            <b-list-group-item v-if="profile.credit.toFixed(2) > 0">
                <div class="d-flex w-100 justify-content-between text-align-vertical-middle">
                    <h5 class="no-margin-bottom"> {{ $t('Credit') }}:</h5>
                    <h5 class="no-margin-bottom active"> {{ profile.credit.toFixed(2) }} </h5>
                </div>
            </b-list-group-item>
            <b-list-group-item>
                <div class="d-flex w-100 justify-content-between text-align-vertical-middle">
                    <h5 class="no-margin-bottom"> {{ $t('Payment in month') }}:</h5>
                    <h5 class="no-margin-bottom active"> {{ profile.payment_in_month.toFixed(2) }} </h5>
                </div>
            </b-list-group-item>
            <b-list-group-item v-if="requiredPayment >= 0">
                <div class="d-flex w-100 justify-content-between text-align-vertical-middle">
                    <h5 class="no-margin-bottom"> {{ $t('Required payment') }}:</h5>
                    <h5 class="no-margin-bottom active"> {{ requiredPayment.toFixed(2) }} </h5>
                </div>
            </b-list-group-item>
            <b-row style="margin-top:0.5rem;">
                <b-col cols="1" md="2" xl="2">
                </b-col>
                <b-col cols="10" md="8" xl="8">
                    <b-button block href="./#/payments" variant="info">{{ $t('Payment') }}</b-button>
                </b-col>
                <b-col cols="1" md="2" xl="2">
                </b-col>
            </b-row>
            <b-row style="margin-top:0.5rem;" v-if="promisedPaymentSettings.is_enabled">
                <b-col cols="1" md="2" xl="2">
                </b-col>
                <b-col cols="10" md="8" xl="8">
                    <b-button block @click="() => { this.$root.$emit('bv::show::modal', 'modalPromisedPayment', '#btnShow') }" variant="info">{{ $t('Promised payment') }}</b-button>
                </b-col>
                <b-col cols="1" md="2" xl="2">
                </b-col>
            </b-row>
            <b-row style="margin-top:0.5rem;">
                <b-col cols="1" md="2" xl="2">
                </b-col>
                <b-col cols="10" md="8" xl="8">
                    <b-button v-if="activating_card.is_enabled" block @click="() => { this.$root.$emit('bv::show::modal', 'modalCardPayment', '#btnShow') }" variant="info">{{ $t('Activate card') }}</b-button>
                </b-col>
                <b-col cols="1" md="2" xl="2">
                </b-col>
            </b-row>
            <b-row style="margin-top:0.5rem;" v-if="isSIREnabled && !profile.is_active">
                <b-col cols="1" md="2" xl="2">
                </b-col>
                <b-col cols="10" md="8" xl="8">
                    <b-button block @click="ClickOnActivateSIR" variant="warning">{{ $t('Activate socially significant resources') }}</b-button>
                </b-col>
                <b-col cols="1" md="2" xl="2">
                </b-col>
            </b-row>
            <b-row style="margin-top:0.5rem;">
                <b-col cols="1" md="2" xl="2">
                </b-col>
                <b-col cols="10" md="8" xl="8">
                    <b-button block @click="ClickOnMoixLink" variant="primary">{{ $t('Open MOIX Portal') }}</b-button>
                </b-col>
                <b-col cols="1" md="2" xl="2">
                </b-col>
            </b-row>
        </b-list-group>
        <div v-if="profile.is_active == null" class="text-center text-info my-2">
            <b-spinner class="align-middle" variant="info"></b-spinner>
            <strong>{{ $t('Loading...') }}</strong>
        </div>
    </b-card>
</template>

<script>
export default {
  data () {
    return {

      editImage: require('@/assets/img/document_edit.png')
    }
  },
  methods: {
    ClickOnEditButton () {
      this.$router.push('profileedit')
    },
    ClickOnActivateSIR () {
      this.$store.dispatch('ACTIVATE_SIR').then(response => {
        if (response.data.error) {
          this.$bvToast.toast(this.$t('Error'), {
            title: this.$t('Error'),
            variant: `danger`,
            solid: true
          })
        } else {
          this.$bvToast.toast(this.$t('Success'), {
            title: this.$t('Success'),
            variant: `success`,
            solid: true
          })
        }

        this.$store.dispatch('GET_IS_SIR_ENABLED')
      })
    },
    ClickOnMoixLink () {
      const form = document.createElement('form')
      form.method = 'POST'
      form.action = 'https://moix.ccs.ru'
      form.target = '_blank'

      const loginInput = document.createElement('input')
      loginInput.type = 'hidden'
      loginInput.name = 'login'
      loginInput.value = this.profile.login || ''

      const tokenInput = document.createElement('input')
      tokenInput.type = 'hidden'
      tokenInput.name = 'token'
      tokenInput.value = localStorage.getItem('sid_customer') || ''

      form.appendChild(loginInput)
      form.appendChild(tokenInput)
      document.body.appendChild(form)
      form.submit()
      document.body.removeChild(form)
    }
  },
  computed: {
    activating_card () {
      return this.$store.getters.ALLOWED_ACTIVATING_CARD
    },
    profile () {
      return this.$store.getters.PROFILE
    },
    isAllowedEditProfile () {
      return this.$store.getters.IS_ALLOWED_EDIT_PROFILE
    },
    promisedPaymentSettings () {
      return this.$store.getters.PROMISED_PAYMENT_SETTINGS
    },
    requiredPayment () {
      return this.$store.getters.REQUIRED_PAYMENT
    },
    totalBonus () {
      return this.$store.getters.TOTAL_BONUS
    },
    isBonusEnabled () {
      return this.$store.getters.IS_BONUS_ENABLED
    },
    isSIREnabled () {
      return this.$store.getters.IS_SIR_ENABLED
    }
  },
  watch: {
    profile: function (val) {
      if (val.basic_account) {
        this.$store.dispatch('GET_REQUIRED_PAYMENT', val.basic_account)
      }
    }
  }
}
</script>
