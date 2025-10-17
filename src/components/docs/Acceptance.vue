<template>
  <div >
        <div v-if="ACCEPTANCE_DOCS">
          <b-table hover small v-if="ACCEPTANCE_DOCS" sticky-header striped id="tableStatistics"
          head-variant="light"
          :items="ACCEPTANCE_DOCS"
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
        <div v-if="!ACCEPTANCE_DOCS">
          <b-spinner class="align-middle"></b-spinner>
        </div>
  </div>
</template>

<script>
import {mapGetters} from 'vuex'
import download from 'downloadjs'
//   "uid": 575,
//   "alt_id": 0,
//   "account_id": 575,
//   "expire_date": 0,
//   "ext_num": 0,
//   "full_name": "test",
//   "id": 909,
//   "invoice_date": 1611060862,
//   "is_odt_mailed": false,
//   "is_payed": false,
//   "is_pdf_mailed": false,
//   "is_printed": false,
//   "kpp": "",
//   "odt_created": false,
//   "odt_modified": false,
//   "odt_status": -1,
//   "payment_transaction_id": 0,
//   "pdf_created": false,
//   "pdf_modified": false,
//   "pdf_status": -1,
//   "tax": "",
//   "total_sum": 5,
//   "total_sum_with_tax": 5,
//   "total_tax": 0
export default {
  data () {
    return {
      fields: [
        { key: 'id', label: this.$i18n.t('ID'), sortable: true, sortDirection: 'desc' },
        { key: 'invoice_date', label: this.$i18n.t('Invoice date'), sortable: true, sortDirection: 'desc' },
        { key: 'total_sum_with_tax', label: this.$i18n.t('Charge with tax'), sortable: true, sortDirection: 'desc' },
        { key: 'is_payed', label: this.$i18n.t('Payed'), sortable: true, formatter: (val, key, item) => { return val ? this.$i18n.t('Yes') : this.$i18n.t('No') } },
        { key: 'download', label: this.$i18n.t('Download'), sortable: true, sortDirection: 'desc' }

      ]
    }
  },
  methods: {
    DownloadPDF (row) {
      let params = {docType: 4, invoiceID: row.item.id, fileType: 1}
      let response = this.$store.dispatch('DOWNLOAD_DOC', params)
      response.then(response => {
        download(response.data, 'acceptance.pdf', 'application/pdf')
      })
    },
    DownloadODT (row) {
      let params = {docType: 4, invoiceID: row.item.id, fileType: 0}
      let response = this.$store.dispatch('DOWNLOAD_DOC', params)
      response.then(response => {
        download(response.data, 'acceptance.odt', 'application/vnd.oasis.opendocument.text')
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
  computed: mapGetters(['ACCEPTANCE_DOCS'])

}
</script>
