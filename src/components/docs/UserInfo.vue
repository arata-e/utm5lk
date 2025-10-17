<template>
  <div >
        <div>
          <b-table hover small sticky-header striped id="tableStatistics"
          head-variant="light"
          :items="items"
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
  </div>
</template>

<script>
import download from 'downloadjs'

export default {
  data () {
    return {
      items: [{name: this.$i18n.t('Customer user info')}],
      fields: [
        { key: 'name', label: this.$i18n.t('Name'), sortable: true, sortDirection: 'desc' },
        { key: 'download', label: this.$i18n.t('Download'), sortable: true, sortDirection: 'desc' }
      ]
    }
  },
  methods: {
    DownloadPDF (row) {
      let params = {docType: 3, invoiceID: this.profile.id, fileType: 1}
      let response = this.$store.dispatch('DOWNLOAD_DOC', params)
      response.then(response => {
        download(response.data, 'user_info.pdf', 'application/pdf')
      })
    },
    DownloadODT (row) {
      let params = {docType: 3, invoiceID: this.profile.id, fileType: 0}
      let response = this.$store.dispatch('DOWNLOAD_DOC', params)
      response.then(response => {
        download(response.data, 'user_info.odt', 'application/vnd.oasis.opendocument.text')
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
  computed: {
    profile () {
      return this.$store.getters.PROFILE
    }
  }

}
</script>
