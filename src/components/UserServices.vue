<template>
    <b-card id="user-services">
        <div v-if="services">
            <b-list-group flush >
                <b-list-group-item>
                    <b-row align-h="center">
                        <b-col align-self="center">
                            <div class="title">{{ $t('Services') }}</div>
                        </b-col>
                    </b-row>
                </b-list-group-item>
                <b-list-group-item v-for="item in services" v-bind:key="item.id">
                    <b-row v-if="item.cost > 0">
                        <b-col>
                            <h5 v-if="!isClickableService(item.name)" class="no-margin-bottom"> {{ item.name }}</h5>
                            <a v-if="isClickableService(item.name)" href="#" @click.prevent="openMoixPortal(item.name)" class="no-margin-bottom" style="font-size: 1.25rem; font-weight: 500;"> {{ item.name }}</a>
                        </b-col>
                        <b-col>
                            <b-row>
                              <b-col>
                                <h5 class="no-margin-bottom active"> {{ item.cost.toFixed(2) }} </h5>
                              </b-col>
                            </b-row>
                        </b-col>
                        <b-col v-if="isCanBeDisabled(item)" align-self="end">
                          <b-button variant="danger" size="sm" @click.stop="deleteServiceLink(item.id)">{{$t('Disable')}}</b-button>
                        </b-col>
                    </b-row>
                    <b-row v-if="item.cost_with_taxes.toFixed(2) !== item.cost.toFixed(2)">
                        <b-col>
                            <h5 class="no-margin-bottom active"> {{ $t('with taxes: ') + item.cost_with_taxes.toFixed(2) }} </h5>
                        </b-col>
                    </b-row>
                    <div v-if="item.turbo_name.Valid" style="margin:0.5rem;">
                        <div class="d-flex w-100 justify-content-between">
                            <b-row>
                                <b-col>
                                    <h6 class="no-margin-bottom" >{{ item.turbo_name.String }}</h6>
                                </b-col>
                            </b-row>
                            <h6 v-if="!item.turbo_link_setting_id.Valid" class="no-margin-bottom active"> {{ parseFloat(item.turbo_cost.Float64).toFixed(2) }} </h6>
                            <h6 v-if="item.turbo_link_setting_id.Valid" class="no-margin-bottom active"> {{ $t('Active') }} </h6>
                        </div>
                        <b-button style="margin-top:0.5rem" v-if="!item.turbo_link_setting_id.Valid" variant="info" size="sm" @click.stop="showModalTurnOnTurbo(item)"><h6 class="no-margin-bottom"> {{ $t('Get') }} </h6></b-button>
                    </div>
                </b-list-group-item>
                <b-list-group-item v-if="independentConnectServicesSettings.length > 0">
                  <b-row>
                    <b-col cols="1" md="2" xl="2">
                    </b-col>
                    <b-col cols="10" md="8" xl="8">
                        <b-button block @click="() => { this.$root.$emit('bv::show::modal', 'modalAdditionalServices', '#btnShow') }" variant="info">{{ $t('Additional services') }}</b-button>
                    </b-col>
                    <b-col cols="1" md="2" xl="2">
                    </b-col>
                  </b-row>
                </b-list-group-item>
            </b-list-group>
        </div>
        <div v-if="!services">
            <b-spinner class="align-middle"></b-spinner>
        </div>
        <ModalEnableTurboMode :item="curItem"/>
    </b-card>
</template>

<script>
import ModalEnableTurboMode from './modals/ModalEnableTurboMode'

export default {
  data () {
    return {
      curItem: null,
      clickableServices: ['Service 1', 'Service 2']
    }
  },
  components: {
    ModalEnableTurboMode
  },
  methods: {
    showModalTurnOnTurbo (item) {
      this.curItem = item
      this.$root.$emit('showModalEnableTurboMode')
    },
    isCanBeDisabled (item) {
      for (let elICSS of this.$store.getters.INDEPENDENT_CONNECT_SERVICES_SETTINGS) {
        if (item.service_id === elICSS.service_id) {
          return elICSS.is_can_be_disabled
        }
      }
      return false
    },
    deleteServiceLink (slinkID) {
      this.$store.dispatch('REMOVE_SERVICE_LINK', slinkID).then(response => {
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
        setTimeout(this.$store.dispatch, 500, 'GET_SERVICES')
        setTimeout(this.$store.dispatch, 500, 'GET_INDEPENDENT_CONNECT_SERVICES_SETTINGS')
      })
    },
    isClickableService (serviceName) {
      return this.clickableServices.includes(serviceName)
    },
    openMoixPortal (serviceName) {
      const form = document.createElement('form')
      form.method = 'POST'
      form.action = 'https://moix.ccs.ru'
      form.target = '_blank'

      const loginInput = document.createElement('input')
      loginInput.type = 'hidden'
      loginInput.name = 'login'
      loginInput.value = this.$store.getters.PROFILE.login || ''

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
    services () {
      let tmp = this.$store.getters.SERVICES
      for (let el of tmp) {
        el.cost = el.cost * el.cost_coef
        el.cost_with_taxes = el.cost_with_taxes * el.cost_coef
      }
      return tmp
    },
    tariffs () {
      return this.$store.getters.TARIFFS
    },
    independentConnectServicesSettings () {
      let tmp = []
      for (let el of this.$store.getters.INDEPENDENT_CONNECT_SERVICES_SETTINGS) {
        if (el.tariff_id > 0) {
          continue
        }

        if (el.multiple_linking === 1) {
          tmp.push(el)
        } else {
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
          } else {
            tmp.push(el)
          }
        }
      }

      return tmp
    }
  },
  mounted () {
    this.$store.dispatch('GET_SERVICES')
  }
}
</script>
