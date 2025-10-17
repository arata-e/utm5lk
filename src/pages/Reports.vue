<template>
  <div class="reports-container">
    <b-row align-h="center">
      <b-col cols="12" md="10" lg="10" xl="8">
        <b-card no-body>
            <b-tabs card>
                <b-tab :title="$t('Statistics')" lazy active v-if="ALLOWED_REPORTS.available_reports & 1">
                    <FullUserStats/>
                </b-tab>
                <b-tab :title="$t('Blocks')" lazy v-if="ALLOWED_REPORTS.available_reports & 2" >
                    <BlockStatisctics/>
                </b-tab>
                <b-tab :title="$t('Sessions')" lazy v-if="ALLOWED_REPORTS.available_reports & 4">
                    <Sessions/>
                </b-tab>
                <b-tab :title="$t('Traffic')" lazy v-if="ALLOWED_REPORTS.available_reports & 8">
                    <Traffic/>
                </b-tab>
                <b-tab :title="$t('Telephony')" lazy v-if="ALLOWED_REPORTS.available_reports & 16">
                    <Telephony/>
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
import FullUserStats from '@/components/reports/FullUserStatistics'
import BlockStatisctics from '@/components/reports/BlockStatisctics'
import Sessions from '@/components/reports/Sessions'
import Traffic from '@/components/reports/Traffic'
import Telephony from '../components/reports/Telephony.vue'
export default {
  components: {
    FullUserStats,
    BlockStatisctics,
    Sessions,
    Traffic,
    Telephony
  },
  computed: mapGetters(['ALLOWED_REPORTS'])
}

</script>
