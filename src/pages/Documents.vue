<template>
  <div class="reports-container">
    <b-row align-h="center">
      <b-col cols="12" md="10" lg="10" xl="8">
        <b-card no-body>
            <b-tabs card>
                <b-tab :title="$t('Invoice')" v-if="ALLOWED_DOCS.available_docs & 1" active>
                    <Invoice/>
                </b-tab>
                <b-tab :title="$t('Invoice VAT')" v-if="ALLOWED_DOCS.available_docs & 2">
                    <InvoiceVAT/>
                </b-tab>
                <b-tab :title="$t('Acceptance report')" v-if="ALLOWED_DOCS.available_docs & 4">
                    <Acceptance/>
                </b-tab>
                <b-tab :title="$t('Telephony')" v-if="ALLOWED_DOCS.available_docs & 8">
                    <InvoiceDetail/>
                </b-tab>
                <b-tab :title="$t('Contracts')" v-if="ALLOWED_DOCS.available_docs & 16">
                    <Contracts/>
                </b-tab>
                <b-tab :title="$t('User info')" v-if="ALLOWED_DOCS.is_userinfo_enabled">
                    <UserInfo/>
                </b-tab>
            </b-tabs>
        </b-card>
      </b-col>
    </b-row>
  </div>
</template>

<style>
</style>

<script>
import { mapGetters } from 'vuex'
import Invoice from '@/components/docs/Invoice'
import Contracts from '@/components/docs/Contracts'
import UserInfo from '@/components/docs/UserInfo'
import InvoiceVAT from '@/components/docs/InvoiceVAT'
import Acceptance from '@/components/docs/Acceptance'
import InvoiceDetail from '@/components/docs/InvoiceDetail'
export default {
  components: {
    Invoice,
    InvoiceVAT,
    Acceptance,
    InvoiceDetail,
    Contracts,
    UserInfo
  },
  computed: mapGetters(['ALLOWED_DOCS']),
  mounted () {
    this.$store.dispatch('GET_DOCS')
    this.$store.dispatch('GET_CONTRACTS')
    this.$store.dispatch('GET_PROFILE')
  }
}
</script>
