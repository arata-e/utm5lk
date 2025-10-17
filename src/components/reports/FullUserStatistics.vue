<template>
  <div>
        <b-form-group :label="$t('Type of statistics')" style="text-align:left;color:black">
        <b-row align-h="center" align-v="center" style="margin-top:0.5rem">
          <b-col>
            <b-form-checkbox-group v-model="selectedStat">
                <b-form-checkbox value="Payments">{{ $t('Payments') }}</b-form-checkbox>
                <b-form-checkbox value="Write-off">{{ $t('Write-offs') }}</b-form-checkbox>
            </b-form-checkbox-group>
          </b-col>
          <b-col>
            <label >{{ $t('Since') }}</label>
              <b-form-datepicker :size="'sm'" v-model="startDate" class="mb-2" locale="ru" :label-no-date-selected="$t('No date selected')"
                :label-help="$t('Use cursor keys to navigate calendar dates')"></b-form-datepicker>
              </b-col>

          <b-col>
            <label >{{ $t('Until') }}</label>
            <b-form-datepicker :size="'sm'" v-model="endDate" class="mb-2" locale="ru" :label-no-date-selected="$t('No date selected')"
            :label-help="$t('Use cursor keys to navigate calendar dates')"></b-form-datepicker>
          </b-col>
          <b-col>
            <b-spinner v-if="isDisabledShow" variant="primary" label="Spinning"></b-spinner>
            <b-button style="margin-top:8%" variant="info" v-if="!isDisabledShow" @click="generate">{{ $t('Show') }} </b-button>
          </b-col>
        </b-row>
        </b-form-group>
        <div v-if="statistics">

          <b-table hover small v-if="statistics" sticky-header striped id="tableStatistics"
          head-variant="light"
          :items="statistics"
          :fields="fields" :tbody-tr-class="rowClass" stacked="sm">

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
  </div>
</template>

<script>
export default {
  data () {
    return {
      sm: 'sm',
      isDisabledShow: false,
      startDate: null,
      endDate: null,
      selectedStat: ['Payments', 'Write-off'],
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
    },
    generate () {
      this.isDisabledShow = true
      const d = new Date()
      let secInMin = 60
      let timeOffsetSec = d.getTimezoneOffset() * secInMin
      let sDate = new Date(this.startDate ? this.startDate : parseInt(Date.now() - 2629800000)) // sec in month
      let eDate = new Date(this.endDate ? this.endDate : parseInt(Date.now()))
      this.$store.dispatch('GET_FULL_STATISTICS', {start_date: parseInt(sDate / 1000) + timeOffsetSec, end_date: parseInt(eDate / 1000) + timeOffsetSec})
    }
  },
  watch: {
    statistics (val) {
      this.isDisabledShow = false
    },
    report_status (val) {
      this.isDisabledShow = false
      if ('error' in val) {
        this.$bvToast.toast(val.error, {
          title: this.$t('Error'),
          variant: `danger`,
          solid: true
        })
      }
    }
  },
  computed: {
    report_status () {
      return this.$store.getters.FULL_STATISTICS_ERROR
    },
    statistics () {
      if (this.selectedStat.length === 2) {
        return this.$store.getters.FULL_STATISTICS
      }
      if (this.selectedStat.includes('Payments')) {
        return this.$store.getters.FULL_STATISTICS.filter(val => {
          return val.payment_incurrency >= 0
        })
      }
      if (this.selectedStat.includes('Write-off')) {
        return this.$store.getters.FULL_STATISTICS.filter(val => {
          return val.payment_incurrency <= 0
        })
      }
      return []
    }
  }
}
</script>
