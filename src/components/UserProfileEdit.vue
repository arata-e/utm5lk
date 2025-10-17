<template>
    <b-card id="profile">
        <b-list-group flush  v-if="profile.is_active != null">
            <b-list-group-item>
                <b-row align-h="center">
                    <b-col align-self="center">
                        <div class="title"> {{ $t('Editing personal data') }}</div>
                    </b-col>
                </b-row>
            </b-list-group-item>
            <b-list-group-item v-if="isAllowedEditProfile.available_fields & 2">
                <b-form-group label-align="left" :label="$t('Name')" label-cols="4" label-cols-xl="4" label-cols-md="4" >
                    <b-form-input type="text"  v-model="profile.full_name"/>
                </b-form-group>
            </b-list-group-item>
            <b-list-group-item v-if="isAllowedEditProfile.available_fields & 4">
                <b-form-group label-align="left" :label="$t('Email')" label-cols="4" label-cols-xl="4" label-cols-md="4" >
                    <b-form-input type="text"  v-model="profile.email"/>
                </b-form-group>
            </b-list-group-item>
            <b-list-group-item v-if="isAllowedEditProfile.available_fields & 1">
                <b-form-group label-align="left" :label="$t('Password')" label-cols="4" label-cols-xl="4" label-cols-md="4" >
                    <b-form-input type="text" v-model="profile.password"/>
                </b-form-group>
                <b-form-group label-align="left" :label="$t('Verify Password')" label-cols="4" label-cols-xl="4" label-cols-md="4" >
                    <b-form-input type="text" v-model="profile.approved_password"/>
                </b-form-group>
            </b-list-group-item>
            <b-list-group-item v-if="isAllowedEditProfile.available_fields & 8">
                <b-form-group label-align="left" :label="$t('Telephone')" label-cols="4" label-cols-xl="4" label-cols-md="4" >
                    <masked-input v-if="phoneFormat.length" class="form-control" type="text" v-model="profile.mobile_telephone" :mask="phoneFormat" />
                    <b-form-input v-if="!phoneFormat.length" type="text"  v-model="profile.mobile_telephone"/>
                </b-form-group>
            </b-list-group-item>
            <b-row style="margin-top:0.5rem;">
                <b-col cols="2" md="2" xl="2">
                </b-col>
                <b-col cols="4" md="4" xl="4">
                    <b-button block @click="editProfile" variant="info">{{ $t('Save') }}</b-button>
                </b-col>
                <b-col cols="4" md="4" xl="4">
                    <b-button block @click="() => { this.$router.push('profile') }" >{{ $t('Back') }}</b-button>
                </b-col>
            </b-row>
        </b-list-group>
        <div v-if="profile.is_active == null" class="text-center text-info my-2">
            <b-spinner class="align-middle" variant="info"></b-spinner>
            <strong>{{ $t('Loading...') }}</strong>
        </div>
    </b-card>
</template>

<script>
export default {
  data () {
    return {

      editImage: require('@/assets/img/document_edit.png')
    }
  },
  methods: {
    editProfile () {
      if (this.profile.password.length === 0) {
        this.$bvToast.toast(this.$t('Empty password'), {
          title: this.$t('Error'),
          variant: 'danger',
          solid: true
        })
        return
      }
      if (this.profile.password !== this.profile.approved_password) {
        this.$bvToast.toast(this.$t('Password is not verified'), {
          title: this.$t('Error'),
          variant: 'danger',
          solid: true
        })
        return
      }
      if (this.profile.mobile_telephone.includes('_')) {
        this.$bvToast.toast(this.$t('Phone number is not fit to format'), {
          title: this.$t('Error'),
          variant: `danger`,
          solid: true
        })
        return
      }
      let tmp = {
        full_name: this.profile.full_name,
        email: this.profile.email,
        password: this.profile.password,
        mobile_telephone: this.profile.mobile_telephone
      }
      this.$store.dispatch('EDIT_PROFILE', tmp).then(response => {
        if (response.data.error) {
          this.$bvToast.toast(this.$t(response.data.error), {
            title: this.$t('Error'),
            variant: `danger`,
            solid: true
          })
        } else {
          setTimeout(this.$store.dispatch, 500, 'GET_PROFILE')
          this.$bvToast.toast(this.$t('Profile changed'), {
            title: this.$t('Success'),
            variant: `success`,
            solid: true
          })
          this.$router.push('profile')
        }
      })
    }
  },
  watch: {
    profile () {
      this.profile.approved_password = this.profile.password
    }
  },
  computed: {
    profile () {
      return this.$store.getters.PROFILE
    },
    isAllowedEditProfile () {
      return this.$store.getters.IS_ALLOWED_EDIT_PROFILE
    },
    phoneFormat () {
      return this.$store.getters.PHONE_FORMAT
    }
  },
  mounted () {
    this.$store.dispatch('GET_PHONE_FORMAT')
    this.$store.dispatch('GET_IS_ALLOWED_EDIT_PROFILE')
  }
}
</script>
