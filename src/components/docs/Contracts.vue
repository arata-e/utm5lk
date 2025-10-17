<template>
  <div >
        <div v-if="CONTRACTS">
          <b-table hover small v-if="CONTRACTS" sticky-header striped id="tableStatistics"
          head-variant="light"
          :items="CONTRACTS"
          :fields="fields"
          :tbody-tr-class="rowClass" stacked="sm">

          <template v-slot:cell(invoice_date)="data">
            {{ intToDate(data) }}
          </template>
          <template v-slot:cell(expire_date)="data">
            {{ intToDate(data) }}
          </template>
          <template v-slot:cell(download)="row">
            <b-button size="sm" @click.stop="DownloadPDF(row)" variant="outline-info">
                <div>{{$i18n.t('PDF')}}</div>
            </b-button>
            <b-button size="sm" @click.stop="DownloadODT(row)" variant="outline-info" >
                <div>{{$i18n.t('ODT')}}</div>
            </b-button>
          </template>

          </b-table>
        </div>
        <div v-if="!CONTRACTS">
          <b-spinner class="align-middle"></b-spinner>
        </div>
  </div>
</template>

<script>

import {mapGetters} from 'vuex'
import download from 'downloadjs'

export default {
  data () {
    return {
      fields: [
        { key: 'contract_id', label: this.$i18n.t('ID'), sortable: true, sortDirection: 'desc' },
        { key: 'created',
          label: this.$i18n.t('Created date'),
          sortable: true,
          sortDirection: 'desc',
          formatter: (val, key, item) => {
            return this.$moment(val * 1000).format('DD.MM.YYYY HH:mm')
          } },
        { key: 'name', label: this.$i18n.t('Name'), sortable: true, sortDirection: 'desc' },
        { key: 'download', label: this.$i18n.t('Download'), sortable: true, sortDirection: 'desc' }
      ]
    }
  },
  methods: {
    DownloadPDF (row) {
      let params = {id: row.item.contract_id, isConvToODT: 0}
      let response = this.$store.dispatch('DOWNLOAD_CONTRACT', params)
      response.then(response => {
        download(response.data, 'contract.pdf', 'application/pdf')
      })
    },
    DownloadODT (row) {
      let params = {id: row.item.contract_id, isConvToODT: 1}
      let response = this.$store.dispatch('DOWNLOAD_CONTRACT', params)
      response.then(response => {
        download(response.data, 'contract.odt', 'application/vnd.oasis.opendocument.text')
      })
    },
    rowClass (item, type) {
      if (!item) return
      if (item.expire_date > (Date.now() / 1000)) return 'table-danger'
      else return 'table-success'
    },
    intToDate (val) {
      return this.$moment(val.value * 1000).format('DD.MM.YYYY HH:mm')
    }
  },
  computed: mapGetters(['CONTRACTS'])

}
</script>
