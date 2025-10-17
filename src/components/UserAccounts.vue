<template>
  <!-- <div class="d-none d-sm-block"> -->
    <div>
      <b-card id="accounts">
        <div v-if="profile.accounts">
          <div class="title" style="margin-bottom:1rem"> {{ $t('My accounts') }} </div>
          <b-table hover small v-if="profile" sticky-header striped
          head-variant="light"
          :items="profile.accounts"
          :fields="fields" stacked="sm" >

          <template v-slot:cell(balance)="data">
            <div style="text-align:right"> {{ data.value }} </div>
          </template>

          <template v-slot:cell(credit)="data">
            <div style="text-align:right"> {{ data.value }} </div>
          </template>

          <template v-slot:cell(vat_rate)="data">
            <div style="text-align:right"> {{ data.value }} </div>
          </template>

          <template v-slot:cell(int_status)="data">
            {{ data.value }}
          </template>

          </b-table>
          <div class="title">
            <b-button v-if="profile.accounts.length > 1 && isTransferFundsSettingsEnabled" variant="info" @click="openModalMoveFunds"> {{ $t('Transfer funds') }} </b-button>
            <b-button v-if="isBlockButtonActive" variant="info" @click="openModalVoluntarySuspension">{{ $t('Voluntary suspension') }}</b-button>
          </div>
        </div>
        <div v-if="!profile.accounts">
          <b-spinner class="align-middle"></b-spinner>
        </div>
      </b-card>
  </div>
</template>

<script>
export default {
  data () {
    return {
      currentInetStatus: null,
      fields: [
        { key: 'id', label: this.$i18n.t('Account ID'), sortable: true, sortDirection: 'desc' },
        { key: 'balance', label: this.$i18n.t('Balance'), sortable: true, sortDirection: 'desc', formatter: (val, key, item) => { return Math.floor(val * 100) / 100 } },
        { key: 'credit', label: this.$i18n.t('Credit'), sortable: true, formatter: (val, key, item) => { return val.toFixed(2) } },
        { key: 'vat_rate', label: this.$i18n.t('VAT rate'), sortable: true, formatter: (val, key, item) => { return (0.05 * 100).toFixed(0) } },
        { key: 'external_id', label: this.$i18n.t('External ID'), sortable: true },
        { key: 'int_status', label: this.$i18n.t('Internet'), sortable: true, sortDirection: 'desc', formatter: (val, key, item) => { return val === 1 ? this.$t('Active') : this.$t('Disabled') } },
        { key: 'block_id',
          label: this.$i18n.t('Status'),
          sortable: true,
          sortDirection: 'desc',
          formatter: (val, key, item) => {
            return val > 0 ? this.$t('Disabled') : this.$t('Active')
          } }
      ]
    }
  },
  methods: {
    openModalMoveFunds () {
      this.$root.$emit('bv::show::modal', 'modalMoveFunds', '#btnShow')
    },
    openModalVoluntarySuspension () {
      this.$root.$emit('bv::show::modal', 'modalVoluntarySuspension', '#btnShow')
    },
    changeAccountIntStatus (item) {
      let newIntStatus = item.int_status === 1 ? 0 : 1
      this.currentInetStatus = newIntStatus
      let data = {
        'account_id': item.id,
        'int_status': newIntStatus
      }
      this.$store.dispatch('CHANGE_ACCOUNT_INT_STATUS', data).then(response => {
        if (response.data.error) {
          this.$bvToast.toast(this.$t(response.data.error), {
            title: this.$t('Error'),
            variant: `danger`,
            solid: true
          })
        } else {
          setTimeout(this.$store.dispatch, 500, 'GET_PROFILE')
          setTimeout(this.$store.dispatch, 500, 'GET_STATISTICS')
          if (this.currentInetStatus === 1) {
            this.$bvToast.toast(this.$t('Account internet turned on'), {
              title: this.$t('Success'),
              variant: `success`,
              solid: true
            })
          } else {
            this.$bvToast.toast(this.$t('Account internet turned off'), {
              title: this.$t('Success'),
              variant: `success`,
              solid: true
            })
          }
        }
      })
    }
  },
  computed: {
    isBlockButtonActive () {
      for (let el of this.profile.accounts) {
        if (el.hasOwnProperty('vs_settings')) {
          if (!el.vs_settings.hasOwnProperty('error')) {
            if (el.vs_settings.can_block || el.vs_settings.can_unblock) {
              return true
            }
          }
        }
      }
      return false
    },
    profile () {
      return this.$store.getters.PROFILE
    },
    isTransferFundsSettingsEnabled () {
      return this.$store.getters.TRANSFER_FUNDS_SETTINGS.group_id === 0 || this.profile.groups.includes(this.$store.getters.TRANSFER_FUNDS_SETTINGS.group_id)
    }
  }
}
</script>
