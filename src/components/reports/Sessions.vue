<template>
  <div >
    <b-row align-h="center" align-v="right" style="margin-top:0.5rem">
     <b-col>
        <label style="margin-right: 100%;color: black;">{{ $t('Since') }}</label>
        <b-form-datepicker :size="'sm'"   v-model="startDate" class="mb-2" locale="ru" :label-no-date-selected="$t('No date selected')"
            :label-help="$t('Use cursor keys to navigate calendar dates')"></b-form-datepicker>
      </b-col>
      <b-col>
        <label style="margin-right: 100%;color: black;">{{ $t('Until') }}</label>
        <b-form-datepicker :size="'sm'"   v-model="endDate" class="mb-2" locale="ru" :label-no-date-selected="$t('No date selected')"
            :label-help="$t('Use cursor keys to navigate calendar dates')"></b-form-datepicker>
      </b-col>
      <b-col>
        <b-spinner v-if="isDisabledShow" variant="primary" label="Spinning"></b-spinner>
        <b-button style="margin-top:10%" variant="info" v-if="!isDisabledShow" @click="generate">{{ $t('Show') }} </b-button>
      </b-col>
    </b-row>
    <div v-if="SESSIONS">
      <b-table hover small v-if="SESSIONS" sticky-header striped id="tableStatistics"
      head-variant="light"
      :items="SESSIONS"
      :fields="fields"
      :tbody-tr-class="rowClass" stacked="sm">

      <template v-slot:cell(last_update_date)="data">
        {{ intToDate(data) }}
      </template>

      <template v-slot:cell(recv_date)="data">
        {{ intToDate(data) }}
      </template>

      </b-table>
    </div>
    <div v-if="!SESSIONS">
      <b-spinner class="align-middle"></b-spinner>
    </div>
  </div>
</template>

<script>

export default {
  data () {
    return {
      isDisabledShow: false,
      startDate: null,
      endDate: null,
      fields: [
        { key: 'account_id', label: this.$i18n.t('Account ID'), sortable: true, sortDirection: 'desc' },
        { key: 'User_Name', label: this.$i18n.t('User-Name'), sortable: true, sortDirection: 'desc' },
        { key: 'recv_date', label: this.$i18n.t('Receive date'), sortable: true, sortDirection: 'desc' },
        { key: 'last_update_date', label: this.$i18n.t('Last update date'), sortable: true, sortDirection: 'desc' },
        { key: 'Acct_Session_Time', label: this.$i18n.t('Session duration,sec'), sortable: true, sortDirection: 'desc' },
        { key: 'in/out_gbytes', label: this.$i18n.t('Input/Output Gbyte'), sortable: true, sortDirection: 'desc' },
        { key: 'Total_cost', label: this.$i18n.t('Total cost'), sortable: true, sortDirection: 'desc' }
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
      this.$store.dispatch('GET_SESSIONS', {start_date: parseInt(sDate / 1000) + timeOffsetSec, end_date: parseInt(eDate / 1000) + timeOffsetSec})
    }
  },
  watch: {
    SESSIONS () {
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
    SESSIONS () {
      return this.$store.getters.SESSIONS
    },
    report_status () {
      return this.$store.getters.SESSIONS_ERROR
    }
  }
}
</script>
