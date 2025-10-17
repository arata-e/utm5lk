<template>
    <div>
        <b-modal
            id="modalAdditionalServices"
            @ok="connectSerivce"
            @shown="clearParams"
            v-if="independentConnectServicesSettings"
            scrollable
            centered
            :title="$t('Available services')"
            header-text-variant="info">

            <template v-slot:modal-ok>
              {{ $t('Connect') }}
            </template>

            <template v-slot:modal-cancel>
              {{ $t('Cancel') }}
            </template>

          <b-list-group flush>
            <b-list-group-item class="align-items-start" v-for="item in independentConnectServicesSettings" :variant="getItemVariant(item.id)" v-bind:key="item.id" @click="selectNewService(item)" style="cursor: pointer;">
                <div class="d-flex w-100 justify-content-between">
                    <h5 class="mb-1"> {{ item.name }}</h5>
                    <h6 class="no-margin-bottom active"> {{ parseFloat(item.cost).toFixed(2) }} </h6>
                </div>
            </b-list-group-item>
          </b-list-group>

          <div v-if="this.accounts.length > 1" style="margin-top:1rem">
              <div class="title">{{ $t('Choose account') }}</div>
              <b-row align-h="center" align-v="center" style="margin-top:0.5rem">
                  <b-col cols="12" md="4" lg="5" xl="5">
                      <b-form-select v-model="account" :options="accounts" />
                  </b-col>
              </b-row>
          </div>

          <div v-if="newService && newService.is_bonus_enabled && isBonusEnabled && totalBonus > 0">
            <b-form-group label-align="right" :label="$t('Use bonus')" label-cols="7" label-cols-xl="7" label-cols-md="7" style="margin-bottom:0rem">
              <b-form-checkbox switch size="lg" v-model.number="isUseBonus" value="1" unchecked-value="0" style="margin-top:0.2rem" />
            </b-form-group>
          </div>
        </b-modal>
    </div>
</template>

<script>
export default {
  data () {
    return {
      newService: null,
      account: 0,
      isUseBonus: 0
    }
  },
  methods: {
    clearParams () {
      this.account = this.accounts[0].value
      this.newService = null
    },
    async connectSerivce () {
      if (!this.newService) {
        this.$bvToast.toast('New service have not choosen', {
          title: `Warning`,
          variant: `warning`,
          solid: true
        })
        return
      }
      let connectSeriveData = {
        account_id: this.account,
        setting_id: this.newService.id,
        is_use_bonus: this.isUseBonus
      }
      this.$store.dispatch('CONNECT_SERVICE', connectSeriveData).then(response => {
        if (response.data.error) {
          this.$bvToast.toast(this.$t(response.data.error), {
            title: this.$t('Error'),
            variant: `danger`,
            solid: true
          })
        } else {
          setTimeout(this.$store.dispatch, 500, 'GET_TARIFFS')
          setTimeout(this.$store.dispatch, 500, 'GET_PROFILE')
          setTimeout(this.$store.dispatch, 500, 'GET_STATISTICS')
          setTimeout(this.$store.dispatch, 500, 'GET_SERVICES')
          setTimeout(this.$store.dispatch, 500, 'GET_TOTAL_BONUS')
          setTimeout(this.$store.dispatch, 500, 'GET_IS_BONUS_ENABLED')
          this.$bvToast.toast(this.$t('Connected'), {
            title: this.$t('Success'),
            variant: `success`,
            solid: true
          })
        }
      })
    },
    selectNewService (item) {
      if (item === this.newService) {
        this.newService = null
        return
      }
      this.isUseBonus = 0
      this.newService = item
    },
    isUserHas (name) {
      for (let tariff of this.profile.tariffs) {
        if (tariff.name === name) {
          return true
        }
      }
      return false
    },
    getItemVariant (id) {
      if (this.newService) {
        if (id === this.newService.id) {
          return 'info'
        }
      }
      return 'default'
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
    userAvaibleTariffs () {
      return this.tariffs.filter(item => this.isTariffAvaibleForUser(item))
    },
    tariffs () {
      return this.$store.getters.TARIFFS
    },
    profile () {
      return this.$store.getters.PROFILE
    },
    services () {
      return this.$store.getters.SERVICES
    },
    independentConnectServicesSettings () {
      let tmp = []
      for (let el of this.$store.getters.INDEPENDENT_CONNECT_SERVICES_SETTINGS) {
        if (el.tariff_id > 0) {
          continue
        }

        if (el.multiple_linking === 0) {
          let isExists = false
          if (el.service_id > 0) {
            for (let elService of this.services) {
              if (elService.service_id === el.service_id) {
                isExists = true
                break
              }
            }
          } else {
            continue
          }
          if (isExists) {
            continue
          }
        }
        tmp.push(el)
      }

      return tmp
    },
    isBonusEnabled () {
      return this.$store.getters.IS_BONUS_ENABLED
    },
    totalBonus () {
      return this.$store.getters.TOTAL_BONUS
    }
  },
  mounted () {
    this.$store.dispatch('GET_SERVICES')
  }
}
</script>
