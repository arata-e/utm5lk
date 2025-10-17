<template>
  <div>
      <b-card id="statistics">
        <div v-if="statistics">
          <div class="title" style="margin-bottom:1rem"> {{ $t('Statistics') }} </div>
          <b-table hover small v-if="statistics" sticky-header striped stacked="sm"
          head-variant="light"
          :items="statistics"
          :fields="fields" :tbody-tr-class="rowClass">

          <template v-slot:cell(actual_date)="data">
            {{ intToDate(data) }}
          </template>

          <template v-slot:cell(event_name)="data">
            {{ eventNameParser(data) }}
          </template>

          <template v-slot:cell(payment_incurrency)="data">
            <div style="text-align:right"> {{ data.value }} </div>
          </template>

          </b-table>
        </div>
        <div v-if="!statistics">
          <b-spinner class="align-middle"></b-spinner>
        </div>
      </b-card>
  </div>
</template>

<script>
export default {
  data () {
    return {
      fields: [
        { key: 'account_id', label: this.$i18n.t('Account ID'), sortable: true, sortDirection: 'desc' },
        { key: 'actual_date', label: this.$i18n.t('Date'), sortable: true, sortDirection: 'desc' },
        { key: 'payment_incurrency', label: this.$i18n.t('Volume'), sortable: true, formatter: (val, key, item) => { return parseFloat(val).toFixed(2) } },
        { key: 'event_name', label: this.$i18n.t('Event name'), sortable: true, sortDirection: 'desc' }
      ]
    }
  },
  methods: {
    rowClass (item, type) {
      if (!item) return
      if (item.payment_incurrency[0] === '+') return 'table-info'
      else return 'table-default'
    },
    intToDate (val) {
      return this.$moment((val.value) * 1000).format('DD.MM.YYYY HH:mm')
    },
    eventNameParser (val) {
      switch (val.value) {
        case 'Payment':
          return this.$i18n.t('Payment')
        case 'Cash payment':
          return this.$i18n.t('Cash payment')
        case 'Wire transfer':
          return this.$i18n.t('Wire transfer')
        case 'Card payment':
          return this.$i18n.t('Card payment')
        case 'Credit':
          return this.$i18n.t('Credit')
        case 'Payment revoke':
          return this.$i18n.t('Payment revoke')
        default:
          return val.value
      }
    }
  },
  computed: {
    statistics () {
      return this.$store.getters.STATISTICS
    }
  }
}
</script>
