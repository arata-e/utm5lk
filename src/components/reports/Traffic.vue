<template>
  <div >
        <div v-if="TRAFFIC">
        <b-row align-h="center" align-v="center" style="margin-top:0.5rem">
         <b-col>
        <label style="margin-right: 100%;color: black;">{{ $t('Since') }}</label>
        <b-form-datepicker :size="'sm'"   v-model="startDate" class="mb-2" locale="ru" :label-no-date-selected="$t('No date selected')"
            :label-help="$t('Use cursor keys to navigate calendar dates')"></b-form-datepicker>
      </b-col>
      <b-col>
        <label style="margin-right: 100%;color: black;">{{ $t('Until') }}</label>
        <b-form-datepicker :size="'sm'"    v-model="endDate" class="mb-2" locale="ru" :label-no-date-selected="$t('No date selected')"
            :label-help="$t('Use cursor keys to navigate calendar dates')"></b-form-datepicker>
      </b-col>
          <b-col>
            <b-spinner v-if="isDisabledShow" variant="primary" label="Spinning"></b-spinner>
            <b-button style="margin-top:10%" variant="info" v-if="!isDisabledShow" @click="generate">{{ $t('Show') }} </b-button>
          </b-col>
        </b-row>
          <b-table hover small v-if="TRAFFIC" sticky-header striped id="tableStatistics"
          head-variant="light"
          :items="TRAFFIC"
          :fields="fields"
          :tbody-tr-class="rowClass" stacked="sm">

          <template v-slot:cell(last_update_date)="data">
            {{ intToDate(data) }}
          </template>

          </b-table>
        </div>
        <div v-if="!TRAFFIC">
          <b-spinner class="align-middle"></b-spinner>
        </div>
  </div>
</template>

<script>
// "TclassName": "Outgoing",
// "AccID": 575,
// "Bytes": 666,
// "BaseCost": 321,
// "Charge": 11.23,
// "ChargeWithTax": 14.24
export default {
  data () {
    return {
      isDisabledShow: false,
      startDate: null,
      endDate: null,
      fields: [
        { key: 'AccID', label: this.$i18n.t('Account ID'), sortable: true, sortDirection: 'desc' },
        { key: 'TclassName', label: this.$i18n.t('Traffic class'), sortable: true, sortDirection: 'desc' },
        { key: 'BaseCost', label: this.$i18n.t('Base Cost'), sortable: true, sortDirection: 'desc', formatter: (val, key, item) => { return (val).toFixed(2) } },
        { key: 'Charge', label: this.$i18n.t('Charge'), sortable: true, sortDirection: 'desc', formatter: (val, key, item) => { return (val).toFixed(2) } },
        { key: 'ChargeWithTax', label: this.$i18n.t('Charge with tax'), sortable: true, sortDirection: 'desc', formatter: (val, key, item) => { return (val).toFixed(2) } },
        { key: 'Bytes',
          label: this.$i18n.t('MBytes'),
          sortable: true,
          sortDirection: 'desc',
          formatter: (val, key, item) => {
            return (val / 1024 / 1024).toFixed(3)
          }}
      ]
    }
  },
  methods: {
    rowClass (item, type) {
      if (!item) return
      if (item.expire_date > (Date.now() / 1000)) return 'table-danger'
      else return 'table-success'
    },
    intToDate (val) {
      return this.$moment(val.value * 1000).format('DD.MM.YYYY HH:mm')
    },
    generate () {
      this.isDisabledShow = true
      const d = new Date()
      let secInMin = 60
      let timeOffsetSec = d.getTimezoneOffset() * secInMin
      let sDate = new Date(this.startDate ? this.startDate : parseInt(Date.now() - 2629800000)) // sec in month
      let eDate = new Date(this.endDate ? this.endDate : parseInt(Date.now()))
      this.$store.dispatch('GET_TRAFFIC', {start_date: parseInt(sDate / 1000) + timeOffsetSec, end_date: parseInt(eDate / 1000) + timeOffsetSec})
    }
  },
  watch: {
    TRAFFIC () {
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
      return this.$store.getters.TRAFFIC_ERROR
    },
    TRAFFIC () {
      return this.$store.getters.TRAFFIC
    }}
}
</script>
