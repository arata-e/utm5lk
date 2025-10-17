<template>
    <b-modal id="modalMoveFunds" ref="modalMoveFunds" hide-footer hide-header centered @hidden="modalMoveFundsHidden" @show="modalMoveFundsShow" v-if="this.profile.accounts">
        <div>
            <div class="title">{{ $t('Account to be debited') }}</div>
            <b-row align-h="center" align-v="center" style="margin-top:0.5rem">
            <b-col cols="12" md="4" lg="5" xl="5">
                <b-form-select v-model="accountFrom" :options="accountsFrom" />
            </b-col>
          </b-row>
        </div>
        <div>
            <div class="title">{{ $t('Account to be credited') }}</div>
            <b-row align-h="center" align-v="center" style="margin-top:0.5rem">
            <b-col cols="12" md="4" lg="5" xl="5">
                <b-form-select v-model="accountTo" :options="accountsTo" />
            </b-col>
          </b-row>
        </div>
        <div class="title">{{ $t('Enter the amount') }}</div>
          <b-row align-h="center" align-v="center" style="margin-top:0.5rem">
            <b-col cols="12" md="4" lg="5" xl="5">
              <b-form-input type="number" v-model="amount"/>
            </b-col>
          </b-row>
          <b-row align-h="center" align-v="center" style="margin-top:0.5rem">
            <b-col cols="12" md="4" lg="4" xl="4">
              <b-button variant="info" @click="transfer" block> {{ $t('Transfer') }} </b-button>
            </b-col>
          </b-row>
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
  data () {
    return {
      amount: 0,
      accountFrom: 0,
      accountTo: 0
    }
  },
  methods: {
    async transfer () {
      let moveFundsData = {
        'amount': parseFloat(this.amount),
        'account_id_from': this.accountFrom,
        'account_id_to': this.accountTo
      }
      this.$store.dispatch('MOVE_FUNDS', moveFundsData).then(response => {
        if (response.data.error) {
          this.$bvToast.toast(this.$t(response.data.error), {
            title: this.$t('Error'),
            variant: `danger`,
            solid: true
          })
        } else {
          setTimeout(this.$store.dispatch, 500, 'GET_PROFILE')
          setTimeout(this.$store.dispatch, 500, 'GET_STATISTICS')
          this.$bvToast.toast(this.$t('Funds transfered'), {
            title: this.$t('Success'),
            variant: `success`,
            solid: true
          })
        }
      })
      this.modalMoveFundsHidden()
    },
    modalMoveFundsHidden () {
      this.$refs.modalMoveFunds.hide()
    },
    modalMoveFundsShow () {
      this.accountFrom = this.profile.accounts[0].id
      this.accountTo = this.profile.accounts[1].id
      this.amount = 0
    }
  },
  computed: {
    accountsFrom () {
      let res = []
      if (this.profile.accounts) {
        for (let el of this.profile.accounts) {
          let newEl = {}
          newEl.value = el.id
          newEl.text = '(' + el.id + ')' + el.balance.toFixed(2)
          res.push(newEl)
        }
      }
      return res
    },
    accountsTo () {
      let res = []
      if (this.profile.accounts) {
        for (let el of this.profile.accounts) {
          if (this.accountFrom === el.id) {
            continue
          }
          let newEl = {}
          newEl.value = el.id
          newEl.text = '(' + el.id + ')' + el.balance.toFixed(2)
          res.push(newEl)
        }
      }
      return res
    },
    profile () {
      return this.$store.getters.PROFILE
    }
  },
  watch: {
    accountsTo: function (val) {
      if (val.length) {
        this.accountTo = val[0].value
      }
    }
  }
}
</script>
