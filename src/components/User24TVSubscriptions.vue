<template>
  <!-- <div class="d-none d-sm-block"> -->
    <div>
      <b-card>
        <div v-if="baseUserSubscriptions.length">
          <div class="title" style="margin-bottom:1rem"> {{ $t('My 24TV base packets') }} </div>
          <b-table hover small sticky-header striped
          head-variant="light"
          :items="baseUserSubscriptions"
          :fields="fields" stacked="sm" >
          <template v-slot:cell(is_paused)="row">
            {{ row.item.is_paused ? $t('Pause') : $t('Active') }}
          </template>

          </b-table>
        </div>
        <div v-if="additionalUserSubscriptions.length">
          <div class="title" style="margin-bottom:1rem"> {{ $t('My 24TV additional packets') }} </div>
          <b-table hover small sticky-header striped
          head-variant="light"
          :items="additionalUserSubscriptions"
          :fields="fields" stacked="sm" >
          <template v-slot:cell(is_paused)="row">
            {{ row.item.is_paused ? $t('Pause') : $t('Active') }}
          </template>

          </b-table>
        </div>
      </b-card>
  </div>
</template>

<script>
import moment from 'moment'

export default {
  data () {
    return {
      fields: [
        {key: 'packet.name', label: this.$t('Name'), sortable: true},
        {key: 'packet.price', label: this.$t('Cost'), sortable: true},
        {key: 'start_at', label: this.$t('Date start'), sortable: true, formatter: (val, key, item) => { return moment(val).format('MM-DD-YYYY HH:mm:ss') }},
        {key: 'end_at', label: this.$t('Date end'), sortable: true, formatter: (val, key, item) => { return moment(val).format('MM-DD-YYYY HH:mm:ss') }},
        {key: 'is_paused', label: this.$t('Status'), sortable: true}
      ]
    }
  },
  computed: {
    allSubscriptions () {
      return this.$store.getters['TV24_SUBSCRIPTIONS']
    },
    baseUserSubscriptions () {
      if (this.allSubscriptions) {
        return this.allSubscriptions.filter(el => {
          if (el.packet) {
            return el.packet.base
          }
          return false
        })
      }
      return []
    },
    additionalUserSubscriptions () {
      if (this.allSubscriptions) {
        return this.allSubscriptions.filter(el => {
          if (el.packet) {
            return !el.packet.base
          }
          return true
        })
      }
      return []
    }
  }
}
</script>
