<template>
    <b-card id="tariffs">
        <div v-if="userTariffs">
            <b-list-group flush>
                <b-list-group-item>
                    <b-row align-h="center">
                        <b-col align-self="center">
                            <div class="title">{{ $t('Tariffs') }}</div>
                        </b-col>
                    </b-row>
                </b-list-group-item>
                <b-list-group-item :variant="item.variant || ''" v-for="item in userTariffs" v-bind:key="item.id" @click="selectTariff(item)" style="cursor:pointer" >
                    <div class="d-flex w-100 justify-content-between">
                        <b-row>
                            <b-col>
                                <h5 class="no-margin-bottom" > {{ item.name }}
                                  <div v-if="item.next_tariff_name != item.name">
                                    ({{ $t('Next tariff') }} {{ item.next_tariff_name }})
                                  </div>
                                </h5>
                            </b-col>
                        </b-row>
                        <h5 class="no-margin-bottom active"> {{ parseFloat(item.cost).toFixed(2) }} </h5>
                    </div>

                    <div v-if="selectedTariff == item">
                        <p class="no-margin-bottom" style="margin-top:0.5rem;">
                        {{ item.comments }}
                        </p>
                        <b-button v-if="isChangeTariffAvaible(item)" style="margin-top:0.5rem" variant="info" size="sm" @click.stop="showModalChangeTariff(item)"> {{ $t('Change') }} </b-button>
                    </div>
                </b-list-group-item>
                <b-list-group-item v-if="independentConnectServicesSettings.length > 0">
                  <b-row>
                    <b-col cols="1" md="2" xl="2">
                    </b-col>
                    <b-col cols="10" md="8" xl="8">
                        <b-button block @click="() => { this.$root.$emit('bv::show::modal', 'modalAdditionalTariffs', '#btnShow') }" variant="info">{{ $t('Additional tariffs') }}</b-button>
                    </b-col>
                    <b-col cols="1" md="2" xl="2">
                    </b-col>
                  </b-row>
                </b-list-group-item>
            </b-list-group>
        </div>
        <div v-if="!userTariffs">
            <b-spinner class="align-middle"></b-spinner>
        </div>

        <ModalChangeTariff :curTariff="selectedTariff"/>
        <ModalAdditionalTariffs/>
    </b-card>
</template>

<script>
import ModalChangeTariff from '@/components/modals/ModalChangeTariff'
import ModalAdditionalTariffs from '@/components/modals/ModalAdditionalTariffs'

export default {
  data () {
    return {
      selectedTariff: null
    }
  },
  components: {
    ModalChangeTariff,
    ModalAdditionalTariffs
  },
  methods: {
    selectTariff (item) {
      if (this.selectedTariff === item) {
        this.selectedTariff.variant = null
        this.selectedTariff = null
        return
      }

      if (this.selectedTariff) {
        this.selectedTariff.variant = null
      }
      this.selectedTariff = item
      this.selectedTariff.variant = 'secondary'
    },
    showModalChangeTariff (item) {
      this.$root.$emit('bv::show::modal', 'modalChangeTariff', '#btnShow')
    },
    isChangeTariffAvaible (item) {
      for (let setting of this.switchTariffSettings) {
        if (setting.is_enabled && (setting.group_id === 0 || this.profile.groups.includes(setting.group_id))) {
          for (let sts of setting.data) {
            if (sts.tariff_id === item.id) {
              return true
            }
          }
        }
      }

      return false
    }
  },
  computed: {
    userTariffs () {
      let tmp = []
      for (let userTariff of this.profile.tariffs) {
        let tmpTariff = {name: userTariff.name, id: userTariff.id, next_tariff_name: userTariff.next_tariff_name}
        tmpTariff.cost = 0
        for (let userService of this.services) {
          if (userService.tariff_link_id === userTariff.tariff_link_id) {
            tmpTariff.cost += userService.cost
          }
        }
        tmp.push(tmpTariff)
      }
      return tmp
    },
    tariffs () {
      return this.$store.getters.TARIFFS
    },
    profile () {
      return this.$store.getters.PROFILE
    },
    switchTariffSettings () {
      return this.$store.getters.SWITCH_TARIFF_SETTINGS
    },
    independentConnectServicesSettings () {
      let tmp = []
      for (let el of this.$store.getters.INDEPENDENT_CONNECT_SERVICES_SETTINGS) {
        if (el.service_id > 0) {
          continue
        }

        if (el.multiple_linking === 1) {
          tmp.push(el)
        } else {
          let isExists = false
          if (el.tariff_id > 0) {
            for (let elTariff of this.profile.tariffs) {
              if (elTariff.id === el.tariff_id) {
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
    },
    services () {
      return this.$store.getters.SERVICES
    }
  },
  mounted () {
    this.$store.dispatch('GET_TARIFFS')
  }
}
</script>
