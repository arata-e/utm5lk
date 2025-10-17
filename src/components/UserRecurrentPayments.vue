<template>
    <div>
        <b-card>
            <div class="title" style="margin-bottom:1rem"> {{ $t('Recurrent payments') }} </div>
            <b-table hover small sticky-header striped
            head-variant="light"
            :items="recurrentPayments"
            :fields="fields" stacked="sm" >
            <template v-slot:cell(actions)>
                <b-button variant="warning" size="sm" @click="disableRecurrentPayments()">{{ $t('Turn off') }}</b-button>
            </template>
            </b-table>
        </b-card>
  </div>
</template>

<script>
export default {
  data () {
    return {
      fields: [
        { key: 'account_id', label: this.$i18n.t('Account ID') },
        { key: 'amount', label: this.$i18n.t('Payment') },
        { key: 'payment_system_name', label: this.$i18n.t('Payment system') },
        { key: 'actions', label: this.$i18n.t('Actions') }
      ]
    }
  },
  computed: {
    recurrentPayments () {
      return this.$store.getters['RECURRENT_PAYMENTS']
    }
  },
  methods: {
    disableRecurrentPayments () {
      this.$store.dispatch('REMOVE_RECURRENT_PAYMENTS').then(response => {
        if (response.data.error) {
          this.$bvToast.toast(this.$t(response.data.error), {
            title: this.$t('Error'),
            variant: `danger`,
            solid: true
          })
        } else {
          setTimeout(this.$store.dispatch, 500, 'GET_RECURRENT_PAYMENTS')
          this.$bvToast.toast(this.$t('Success'), {
            title: this.$t('Success'),
            variant: `success`,
            solid: true
          })
        }
      })
    }
  }
}
</script>
