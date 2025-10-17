<template>
    <div>
        <b-modal
            id="modalChangeTariff"
            @ok="changeTariff"
            @shown="clearParams"
            v-if="profile.tariffs"
            scrollable
            centered
            :title="$t('Avaible tariffs')"
            header-text-variant="info">

            <template v-slot:modal-ok>
              {{ $t('Change') }}
            </template>

            <template v-slot:modal-cancel>
              {{ $t('Cancel') }}
            </template>

          <b-list-group flush>
            <b-list-group-item class="align-items-start" :variant="getTariffVariant(item.name)" v-for="item in userAvaibleTariffs" v-bind:key="item.id" @click="selectNewTariff(item)" style="cursor: pointer;">
                <div class="d-flex w-100 justify-content-between">
                    <h5 class="mb-1"> {{ item.name }}</h5>
                    <h6 class="no-margin-bottom active"> {{ parseFloat(item.cost).toFixed(2) }} </h6>
                </div>

                <p class="mb-1" style="margin-top:0.5rem">
                {{ item.comments }}
                </p>
            </b-list-group-item>
          </b-list-group>
        </b-modal>
    </div>
</template>

<script>
export default {
  props: {
    curTariff: null
  },
  data () {
    return {
      newTariff: null,
      newTariffSettings: null
    }
  },
  methods: {
    show () {
      this.$root.$emit('bv::show::modal', 'modalChangeTariff', '#btnShow')
    },
    clearParams () {
      this.newTariff = null
    },
    async changeTariff () {
      if (!this.newTariff) {
        this.$bvToast.toast('New tariff have not choosen', {
          title: `Warning`,
          variant: `warning`,
          solid: true
        })
        return
      }
      let tariffLinkId = 0
      if (this.profile.tariffs.length > 1) {
        for (let tariff of this.profile.tariffs) {
          if (tariff.name === this.curTariff.name) {
            tariffLinkId = tariff.tariff_link_id
          }
        }
      } else {
        if (this.profile.tariffs.length === 1) {
          tariffLinkId = this.profile.tariffs[0].tariff_link_id
        }
      }
      let changeTariffData = {
        account_id: this.profile.accounts[0].id,
        next_tariff_id: this.newTariff.id,
        tariff_link_id: tariffLinkId
      }
      this.$store.dispatch('CHANGE_TARIFF', changeTariffData).then(response => {
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
          this.$bvToast.toast(this.$t('Tariff changed'), {
            title: this.$t('Success'),
            variant: `success`,
            solid: true
          })
        }
      })
    },
    selectNewTariff (item) {
      if (item === this.newTariff) {
        this.newTariff = null
        this.newTariffSettings = null
        return
      }
      this.newTariff = item
      this.newTariffSettings = this.findTariffSettings(this.newTariff)
    },
    getTariffVariant (name) {
      if (this.newTariff) {
        if (name === this.newTariff.name) {
          return 'info'
        }
      }
      return 'default'
    },
    isUserHas (name) {
      for (let tariff of this.profile.tariffs) {
        if (tariff.name === name) {
          return true
        }
      }
      return false
    },
    findTariffSettings (item) {
      for (let setting of this.switchTariffSettings) {
        if (setting.is_enabled && (setting.group_id === 0 || this.profile.groups.includes(setting.group_id))) {
          for (let sts of setting.data) {
            if (sts.tariff_id === item.id) {
              return setting
            }
          }
        }
      }
      return null
    },
    isTariffAvaibleForUser (item) {
      if (this.isUserHas(item.name) || !this.curTariff) {
        return false
      }

      for (let setting of this.switchTariffSettings) {
        if (setting.is_enabled && (setting.group_id === 0 || this.profile.groups.includes(setting.group_id))) {
          let isFoundItem = false
          let isFoundCurTarrif = false
          for (let sts of setting.data) {
            isFoundItem = sts.tariff_id === item.id ? true : isFoundItem
            isFoundCurTarrif = sts.tariff_id === this.curTariff.id ? true : isFoundCurTarrif
          }
          if (isFoundItem && isFoundCurTarrif) {
            return true
          }
        }
      }

      return false
    }
  },
  computed: {
    userAvaibleTariffs () {
      return this.tariffs.filter(item => this.isTariffAvaibleForUser(item))
    },
    tariffs () {
      return this.$store.getters.TARIFFS
    },
    profile () {
      return this.$store.getters.PROFILE
    },
    switchTariffSettings () {
      return this.$store.getters.SWITCH_TARIFF_SETTINGS
    }
  },
  mounted () {
    this.$store.dispatch('GET_SWITCH_TARIFF_SETTINGS')
  }
}
</script>
