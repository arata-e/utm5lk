<template>
    <b-modal id="modalVoluntarySuspension" ref="modalVoluntarySuspension" hide-footer hide-header centered @shown="shown">
        <div>
            <div class="title">{{ $t('Choose account') }}</div>
            <b-row align-h="center" align-v="center" style="margin-top:0.5rem">
            <b-col cols="12" md="4" lg="5" xl="5">
                <b-form-select v-model="account" :options="accounts" />
            </b-col>
          </b-row>
        </div>
        <div v-if="account != 0">
            <div v-if="vsSetting.can_block">
              <div class="title" style="margin-bottom:1rem;margin-top:1rem">{{ $t('Description') }}</div>
              <b-list-group flush >
                  <b-list-group-item>
                      <div class="d-flex w-100 justify-content-between text-align-vertical-middle">
                          <h5 class="no-margin-bottom"> {{ $t('Cost') }}:</h5>
                          <h5 class="no-margin-bottom active"> {{ parseFloat(vsSetting.service_cost).toFixed(2) }} </h5>
                      </div>
                  </b-list-group-item>
                  <b-list-group-item v-if="vsSetting.use_min_balance == 1">
                      <div class="d-flex w-100 justify-content-between text-align-vertical-middle">
                          <h5 class="no-margin-bottom"> {{ $t('Minimal balance for use') }}:</h5>
                          <h5 class="no-margin-bottom active"> {{ parseFloat(vsSetting.min_balance).toFixed(2) }} </h5>
                      </div>
                  </b-list-group-item>
                  <b-list-group-item v-if="vsSetting.use_free_balance == 1">
                      <div class="d-flex w-100 justify-content-between text-align-vertical-middle">
                          <h5 class="no-margin-bottom"> {{ $t('Free if balance more then') }}:</h5>
                          <h5 class="no-margin-bottom active"> {{ parseFloat(vsSetting.free_balance).toFixed(2) }} </h5>
                      </div>
                  </b-list-group-item>
                  <b-list-group-item>
                      <div class="d-flex w-100 justify-content-between text-align-vertical-middle">
                          <h5 class="no-margin-bottom"> {{ $t('Minimal duration') }}:</h5>
                          <h5 class="no-margin-bottom active"> {{ secondsToHuman(vsSetting.min_duration) }} </h5>
                      </div>
                  </b-list-group-item>
                  <b-list-group-item>
                      <div class="d-flex w-100 justify-content-between text-align-vertical-middle">
                          <h5 class="no-margin-bottom"> {{ $t('Maximum duration') }}:</h5>
                          <h5 class="no-margin-bottom active"> {{ secondsToHuman(vsSetting.max_duration) }} </h5>
                      </div>
                  </b-list-group-item>
                  <b-list-group-item>
                      <div class="d-flex w-100 justify-content-between text-align-vertical-middle">
                          <h5 class="no-margin-bottom"> {{ $t('Interval between use') }}:</h5>
                          <h5 class="no-margin-bottom active"> {{ secondsToHuman(vsSetting.interval_duration) }} </h5>
                      </div>
                  </b-list-group-item>
              </b-list-group>

              <div class="title" style="margin-bottom:1rem;margin-top:1rem">{{ $t('Date start') }}</div>
              <b-form-datepicker
                  v-model="blockStart"
                  locale="ru"
                  class="mb-2" :placeholder="$t('Choose a date')"
                ></b-form-datepicker>
              <div class="title" style="margin-bottom:1rem;margin-top:1rem">{{ $t('Date end') }}</div>
              <b-form-datepicker
                  v-model="blockEnd"
                  locale="ru"
                  class="mb-2" :placeholder="$t('Choose a date')"
                ></b-form-datepicker>
              <b-row  align-h="center" align-v="center" style="margin-top:0.5rem">
                  <b-col cols="12" md="6" lg="4" xl="4">
                      <b-button variant="info" @click="suspend" block> {{ $t('Suspend') }} </b-button>
                  </b-col>
              </b-row>
            </div>

            <div v-if="vsSetting.can_block">
            </div>

            <b-row v-if="vsSetting.can_unblock" align-h="center" align-v="center" style="margin-top:0.5rem">
                <b-col cols="12" md="8" lg="5" xl="5">
                    <b-button variant="info" @click="resume" block> {{ $t('Resume') }} </b-button>
                </b-col>
            </b-row>
        </div>
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
      blockStart: new Date(),
      blockEnd: new Date()
    }
  },
  methods: {
    shown () {
      this.account = this.accounts[0].value
    },
    async suspend () {
      let suspendData = {
        'start': Math.trunc(Number(new Date(this.blockStart)) / 1000 + (new Date().getTimezoneOffset() * 60)),
        'end': Math.trunc(Number(new Date(this.blockEnd)) / 1000 + (new Date().getTimezoneOffset() * 60)),
        'account_id': this.account
      }
      axiosInstance.post('auth/enablesuspend', suspendData).then(response => {
        if (response.data.error) {
          this.$bvToast.toast(this.$t(response.data.error), {
            title: this.$t('Error'),
            variant: `danger`,
            solid: true
          })
        } else {
          setTimeout(this.$store.dispatch, 500, 'GET_PROFILE')
          setTimeout(this.$store.dispatch, 500, 'GET_STATISTICS')
          this.$bvToast.toast(this.$t('Account suspended'), {
            title: this.$t('Success'),
            variant: `success`,
            solid: true
          })
          this.$refs.modalVoluntarySuspension.hide()
        }
      })
    },
    async resume () {
      let resumeData = {
        'account': this.account
      }
      axiosInstance.post('auth/disablesuspend', resumeData).then(response => {
        if (response.data.error) {
          this.$bvToast.toast(this.$t(response.data.error), {
            title: this.$t('Error'),
            variant: `danger`,
            solid: true
          })
        } else {
          setTimeout(this.$store.dispatch, 500, 'GET_PROFILE')
          setTimeout(this.$store.dispatch, 500, 'GET_STATISTICS')
          this.$bvToast.toast(this.$t('Account resumed'), {
            title: this.$t('Success'),
            variant: `success`,
            solid: true
          })
          this.$refs.modalVoluntarySuspension.hide()
        }
      })
    },
    secondsToHuman (seconds) {
      if (seconds >= 86400) {
        return (seconds / 86400).toFixed(0) + ' ' + this.$t('Days')
      }
      if (seconds >= 3600) {
        return (seconds / 3600).toFixed(0) + ' ' + this.$t('Hours')
      }
      if (seconds >= 60) {
        return (seconds / 60).toFixed(0) + ' ' + this.$t('Minutes')
      }
      return seconds + ' ' + this.$t('Seconds')
    }
  },
  computed: {
    vsSetting () {
      if (this.account !== 0) {
        for (let el of this.profile.accounts) {
          if (el.id === this.account && el.hasOwnProperty('vs_settings')) {
            if (!el.vs_settings.hasOwnProperty('error')) {
              return el.vs_settings
            }
          }
        }
      }
      return null
    },
    accounts () {
      let res = []
      if (this.profile) {
        for (let el of this.profile.accounts) {
          if (el.vs_settings.can_block || el.vs_settings.can_unblock) {
            let newEl = {}
            newEl.value = el.id
            newEl.text = '(' + el.id + ')' + el.balance.toFixed(2)
            res.push(newEl)
          }
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
