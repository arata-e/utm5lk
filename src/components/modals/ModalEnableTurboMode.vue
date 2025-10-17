<template>
    <b-modal id="modalEnableTurboMode" ref="modalEnableTurboMode" hide-footer hide-header centered>
        <div v-if="item">
            <div class="title" style="margin-bottom:1rem">{{ item.turbo_name.String }}</div>
            <b-list-group flush  v-if="item">
                <b-list-group-item>
                    <div class="d-flex w-100 justify-content-between text-align-vertical-middle">
                        <h5 class="no-margin-bottom"> {{ $t('Cost') }}:</h5>
                        <h5 class="no-margin-bottom active"> {{ parseFloat(item.turbo_cost.Float64).toFixed(2) }} </h5>
                    </div>
                </b-list-group-item>
                <b-list-group-item>
                    <div v-if="item.turbo_incoming_limit.Int64 != 0" class="d-flex w-100 justify-content-between text-align-vertical-middle">
                        <h5 class="no-margin-bottom"> {{ $t('Incoming limit') }}:</h5>
                        <h5 class="no-margin-bottom active"> {{ bytesNormalize(item.turbo_incoming_limit.Int64) }} </h5>
                    </div>
                    <div v-if="item.turbo_incoming_limit.Int64 != 0" class="d-flex w-100 justify-content-between text-align-vertical-middle">
                        <h5 class="no-margin-bottom"> {{ $t('Outgoing limit') }}:</h5>
                        <h5 class="no-margin-bottom active"> {{ bytesNormalize(item.turbo_outgoing_limit.Int64) }} </h5>
                    </div>

                    <div v-if="item.turbo_incoming_limit.Int64 == 0" class="d-flex w-100 justify-content-between text-align-vertical-middle">
                        <h5 class="no-margin-bottom"> {{ $t('Duration') }}:</h5>
                        <h5 v-if="item.turbo_duration.Int64 == 0" class="no-margin-bottom active"> {{ $t('Until next accouting period') }}</h5>
                        <h5 v-if="item.turbo_duration.Int64 < 60 && item.turbo_duration.Int64 > 0" class="no-margin-bottom active"> {{ parseInt(item.turbo_duration.Int64) }} {{ $t('Seconds') }}</h5>
                        <h5 v-if="item.turbo_duration.Int64 < 3600 && item.turbo_duration.Int64 >= 60" class="no-margin-bottom active"> {{ (parseInt(item.turbo_duration.Int64)/60).toFixed(0) }} {{ $t('Minutes') }}</h5>
                        <h5 v-if="item.turbo_duration.Int64 >= 3600 && item.turbo_duration.Int64 < 86400" class="no-margin-bottom active"> {{ (parseInt(item.turbo_duration.Int64)/3600).toFixed(0) }} {{ $t('Hours') }}</h5>
                        <h5 v-if="item.turbo_duration.Int64 >= 86400 " class="no-margin-bottom active"> {{ (parseInt(item.turbo_duration.Int64)/86400).toFixed(0) }} {{ $t('Days') }}</h5>
                    </div>
                </b-list-group-item>
                <b-list-group-item>
                    <div class="d-flex w-100 justify-content-between text-align-vertical-middle">
                        <h5 class="no-margin-bottom"> {{ $t('Incoming speed') }}:</h5>
                        <h5 class="no-margin-bottom active"> {{ bytesNormalize(item.turbo_incoming_rate.Int64) }} </h5>
                    </div>
                    <div class="d-flex w-100 justify-content-between text-align-vertical-middle">
                        <h5 class="no-margin-bottom"> {{ $t('Outgoing speed') }}:</h5>
                        <h5 class="no-margin-bottom active"> {{ bytesNormalize(item.turbo_outgoing_rate.Int64) }} </h5>
                    </div>
                </b-list-group-item>
            </b-list-group>
            <b-row align-h="center" align-v="center" style="margin-top:0.5rem">
                <b-col cols="12" md="6" lg="4" xl="4">
                    <b-button variant="info" @click="enableTurboMode" block> {{ $t('Get') }} </b-button>
                </b-col>
            </b-row>
        </div>
    </b-modal>
</template>

<style>
input.number {
  text-align: right;
  box-shadow: 0px 3px 1px -2px rgba(0,0,0,0.2),0px 2px 2px 0px rgba(0,0,0,0.14),0px 1px 5px 0px rgba(0,0,0,0.12);
}
</style>

<script>
export default {
  props: {
    item: null
  },
  data () {
    return {
      amount: 0,
      account: 0
    }
  },
  methods: {
    bytesNormalize (bytes) {
      const bytesInKb = 1024
      const Kb = bytesInKb
      const Mb = Kb * bytesInKb
      const Gb = Mb * bytesInKb
      const Tb = Gb * bytesInKb
      if (bytes === -1) {
        return this.$t('Unlimited')
      }
      if (bytes < Kb) {
        return bytes + 'b'
      }
      if (bytes >= Kb && bytes < Mb) {
        return parseInt(bytes / Kb) + 'Kb'
      }
      if (bytes >= Mb && bytes < Gb) {
        return parseInt(bytes / Mb) + 'Mb'
      }
      if (bytes >= Gb && bytes < Tb) {
        return parseInt(bytes / Gb) + 'Gb'
      }
      if (bytes >= Tb) {
        return parseInt(bytes / Tb) + 'Tb'
      }
    },
    enableTurboMode () {
      let turboModeData = {
        tms_id: this.item.turbo_id.Int64,
        slink_id: this.item.id
      }
      this.$store.dispatch('ENABLE_TURBO_MODE', turboModeData).then(response => {
        if (response.data.error) {
          this.$bvToast.toast(this.$t(response.data.error), {
            title: this.$t('Error'),
            variant: `danger`,
            solid: true
          })
        } else {
          this.$bvToast.toast(this.$t('Turbo mode enabled'), {
            title: this.$t('Success'),
            variant: `success`,
            solid: true
          })
        }
      })
      setTimeout(this.$store.dispatch, 800, 'GET_PROFILE')
      setTimeout(this.$store.dispatch, 800, 'GET_STATISTICS')
      setTimeout(this.$store.dispatch, 800, 'GET_SERVICES')
      this.$refs.modalEnableTurboMode.hide()
    },
    show () {
      this.$refs.modalEnableTurboMode.show()
    }
  },
  mounted () {
    this.$root.$on('showModalEnableTurboMode', this.show)
  }
}
</script>
