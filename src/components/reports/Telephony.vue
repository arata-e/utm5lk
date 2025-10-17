<template>
  <div >
        <div v-if="TELEPHONY">
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
          <b-table hover small v-if="TELEPHONY" sticky-header striped id="tableStatistics"
          head-variant="light"
          :items="TELEPHONY"
          :fields="fields"
          :tbody-tr-class="rowClass" stacked="sm">

          <template v-slot:cell(last_update_date)="data">
            {{ intToDate(data) }}
          </template>

          </b-table>
        </div>
        <div v-if="!TELEPHONY">
          <b-spinner class="align-middle"></b-spinner>
        </div>
  </div>
</template>

<script>
// session_start_date
// session_time
// called_id
// calling_id
// user_name
// status_type
// cost
// disconnect_cause
export default {
  data () {
    return {
      isDisabledShow: false,
      startDate: null,
      endDate: null,
      statusTypeMap: new Map([
        [1, 'Start'],
        [2, 'Stop'],
        [3, 'Interim - Update'],
        [7, 'Accounting - On'],
        [8, 'Accounting - Off']]),
      fields: [
        {key: 'called_id', label: this.$i18n.t('Called ID'), sortable: true, sortDirection: 'desc'},
        {key: 'calling_id', label: this.$i18n.t('Calling ID'), sortable: true, sortDirection: 'desc'},
        {key: 'zone_id', label: this.$i18n.t('Zone ID'), sortable: true},
        {key: 'dir_id', label: this.$i18n.t('Direction ID'), sortable: true},
        {key: 'user_name', label: this.$i18n.t('Login'), sortable: true, sortDirection: 'desc'},
        {key: 'session_start_date', label: this.$i18n.t('Start date'), sortable: true, sortDirection: 'desc', formatter: (val, key, item) => { return this.$moment(val * 1000).format('DD.MM.YYYY HH:mm') }},
        {key: 'session_time', label: this.$i18n.t('Session time'), sortable: true, sortDirection: 'desc'},
        {key: 'cost', label: this.$i18n.t('Cost'), sortable: true, sortDirection: 'desc'},
        {key: 'status_type', label: this.$i18n.t('Status'), sortable: true, sortDirection: 'desc', formatter: (val, key, item) => { return this.statusTypeMap.get(val) }}
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
      this.$store.dispatch('GET_TELEPHONY_REPORTS', {start_date: parseInt(sDate / 1000) + timeOffsetSec, end_date: parseInt(eDate / 1000) + timeOffsetSec})
    }
  },
  watch: {
    TELEPHONY () {
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
      return this.$store.getters.TELEPHONY_ERROR
    },
    TELEPHONY () {
      return this.$store.getters.TELEPHONY
    }}
}
</script>
