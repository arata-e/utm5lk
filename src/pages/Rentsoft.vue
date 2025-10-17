<template>
  <div class="rentsoft-container">
    <b-row align-h="center">
      <b-col cols="12" md="10" lg="10" xl="8">
        <b-card>
            <b-embed
                type="iframe"
                aspect="1by1"
                :src="responseURL"
                allowfullscreen
                style="height:100%;width:100%"
            >

            </b-embed>
        </b-card>
      </b-col>
    </b-row>
  </div>
</template>

<script>
import axiosInstance from '@/api.js'

export default {
  data () {
    return {
      responseURL: null
    }
  },
  async mounted () {
    let result = await axiosInstance.get('auth/rentsoft_url')
    let url = result.data
    let index = url.indexOf('?ag_uuid')
    if (index > -1) {
      url = url.substring(0, index) + this.$route.fullPath.replace(this.$route.path, '') + '&' + url.substr(index + 1)
    }
    this.responseURL = url
  }
}
</script>
