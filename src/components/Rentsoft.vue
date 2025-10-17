<template>
    <b-card>
        <iframe v-if="responseURL"
                id="rentsoft_ag_iframe"
                scrolling="no"
                :src="responseURL"
                style="border:0; padding:0; margin:0; overflow:hidden; height:300px; width:'100%'" frameborder="0"
                onload="var th=this; setTimeout(function() {
                    var h=null;
                    if (!h) if (location.hash.match(/^#h(\d+)/)) h=RegExp.$1;
                    if (!h) for (var i=0; i<10000; i+=30) if (top.frames[\'h\'+i]) { h=i; break; }
                    if (h) { th.style.height=parseInt(h)+200+\'px\'; th.style.width=\'100%\'; }
                }, 10)"
            />
    </b-card>
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
    this.responseURL = result.data
  }
}
</script>
