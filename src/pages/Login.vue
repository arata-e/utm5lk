<template>
    <div class="wrapper fadeInDown">
        <div id="formContent">
            <b-button v-if="allowedOAUTH.includes('google')" size="sm" @click.stop="loginOAUTH('google')" id="transparent">
              <b-img id="imghover" :src='googleLogin'/>
            </b-button>
            <b-tabs align="center" card>
              <b-tab :title="loginPlaceHolder" v-if="loginSettings.is_login_via_login" active>
                <div v-on:keyup.enter="login">
                  <b-row align-h="center">
                    <input type="text" id="login" class="fadeIn second" :placeholder="loginPlaceHolder" v-model="loginData.login" required>
                    <input type="password" id="password" class="fadeIn third" :placeholder="$t('Password')" v-model="loginData.password" required>
                    <input type="submit" @click="login" class="fadeIn fourth" :value="$t('Log In')" tag="input" variant="info"/>
                  </b-row>
                </div>
              </b-tab>
              <b-tab :title="this.$t('Phone')" v-if="loginSettings.is_login_via_phone">
                <div v-on:keyup.enter="reqByPhone">
                  <b-row align-h="center">
                    <masked-input v-if="phoneFormat.length" id="login" type="text" v-model="loginData.mobile_telephone" :mask="phoneFormat" />
                    <input v-if="!phoneFormat.length" type="text" id="login" class="fadeIn second" v-model="loginData.mobile_telephone" required>
                    <input type="password" id="password" :placeholder="$t('Password')" v-model="loginData.password" required>
                    <input type="submit" @click="reqByPhone" class="fadeIn fourth" :value="$t('Log In')" tag="input" variant="info"/>
                  </b-row>
                </div>
              </b-tab>
              <b-tab :title="this.$t('Hotspot')" v-if="loginSettings.is_login_via_hotspot">
                <div v-on:keyup.enter="loginHotspot" >
                  <b-row align-h="center">
                    <input type="text" id="login" class="fadeIn second" :placeholder="$t('Username')" v-model="loginData.login" required>
                    <input type="password" id="password" class="fadeIn third" :placeholder="$t('Password')" v-model="loginData.password" required>
                    <input type="submit" @click="loginHotspot" class="fadeIn fourth" :value="$t('Log In')" tag="input" variant="info"/>
                  </b-row>
                </div>
              </b-tab>
            </b-tabs>
        </div>
    </div>
</template>

<style>
@import url('https://fonts.googleapis.com/css?family=Poppins');

/* BASIC */

#imghover:hover {
  opacity: 0.8;
}

body {
  font-family: "Poppins", sans-serif;
  height: 100vh;
}

a {
  color: #92badd;
  display:inline-block;
  text-decoration: none;
  font-weight: 400;
}

h2 {
  text-align: center;
  font-size: 16px;
  font-weight: 600;
  text-transform: uppercase;
  display:inline-block;
  margin: 40px 8px 10px 8px;
  color: #cccccc;
}

/* STRUCTURE */

.wrapper {
  display: flex;
  align-items: center;
  flex-direction: column;
  justify-content: center;
  width: 100%;
  min-height: 100%;
  padding: 20px;
}

#formContent {
  -webkit-border-radius: 10px 10px 10px 10px;
  border-radius: 10px 10px 10px 10px;
  background: #fff;
  padding: 30px;
  width: 90%;
  max-width: 450px;
  position: relative;
  padding: 0px;
  -webkit-box-shadow: 0 30px 60px 0 rgba(0,0,0,0.3);
  box-shadow: 0 30px 60px 0 rgba(0,0,0,0.3);
  text-align: center;
}

#formFooter {
  background-color: #f6f6f6;
  border-top: 1px solid #dce8f1;
  padding: 25px;
  text-align: center;
  -webkit-border-radius: 0 0 10px 10px;
  border-radius: 0 0 10px 10px;
}

/* TABS */

h2.inactive {
  color: #cccccc;
}

h2.active {
  color: #0d0d0d;
  border-bottom: 2px solid #5fbae9;
}

@media (max-width: 480px) {
  input[type=submit][variant=success]  {
    max-width: 100%;
    padding: 15px 10px !important;
  }
}

/* FORM TYPOGRAPHY*/
input[type=submit][variant=success]  {
  background-color: #0ad48b;
  border: none;
  color: white;
  padding: 15px 80px;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  text-transform: uppercase;
  font-size: 13px;
  -webkit-box-shadow: 0 10px 30px 0 rgba(95,186,233,0.4);
  box-shadow: 0 10px 30px 0 rgba(95,186,233,0.4);
  -webkit-border-radius: 5px 5px 5px 5px;
  border-radius: 5px 5px 5px 5px;
  margin: 5px 20px 15px 20px;
  -webkit-transition: all 0.3s ease-in-out;
  -moz-transition: all 0.3s ease-in-out;
  -ms-transition: all 0.3s ease-in-out;
  -o-transition: all 0.3s ease-in-out;
  transition: all 0.3s ease-in-out;
}

input[type=submit][variant=success]:hover  {
  background-color: #05ac72;
}

input[type=submit][variant=success]:active  {
  -moz-transform: scale(0.95);
  -webkit-transform: scale(0.95);
  -o-transform: scale(0.95);
  -ms-transform: scale(0.95);
  transform: scale(0.95);
}

input[type=button], input[type=submit], input[type=reset], input[role=button]  {
  background-color: #56baed;
  border: none;
  color: white;
  padding: 15px 80px;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  text-transform: uppercase;
  font-size: 13px;
  -webkit-box-shadow: 0 10px 30px 0 rgba(95,186,233,0.4);
  box-shadow: 0 10px 30px 0 rgba(95,186,233,0.4);
  -webkit-border-radius: 5px 5px 5px 5px;
  border-radius: 5px 5px 5px 5px;
  margin: 5px 20px 15px 20px;
  -webkit-transition: all 0.3s ease-in-out;
  -moz-transition: all 0.3s ease-in-out;
  -ms-transition: all 0.3s ease-in-out;
  -o-transition: all 0.3s ease-in-out;
  transition: all 0.3s ease-in-out;
}

input[type=button]:hover, input[type=submit]:hover, input[type=reset]:hover, input[role=button]:hover  {
  background-color: #39ace7;
}

input[type=button]:active, input[type=submit]:active, input[type=reset]:active, input[role=button]:active  {
  -moz-transform: scale(0.95);
  -webkit-transform: scale(0.95);
  -o-transform: scale(0.95);
  -ms-transform: scale(0.95);
  transform: scale(0.95);
}

input[type=text],input[type=password] {
  background-color: #f6f6f6;
  border: none;
  color: #0d0d0d;
  padding: 15px 32px;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  font-size: 16px;
  margin: 5px;
  width: 85%;
  border: 2px solid #f6f6f6;
  -webkit-transition: all 0.5s ease-in-out;
  -moz-transition: all 0.5s ease-in-out;
  -ms-transition: all 0.5s ease-in-out;
  -o-transition: all 0.5s ease-in-out;
  transition: all 0.5s ease-in-out;
  -webkit-border-radius: 5px 5px 5px 5px;
  border-radius: 5px 5px 5px 5px;
}

input[type=text],input[type=password]:focus {
  background-color: #fff;
  border-bottom: 2px solid #5fbae9;
}

input[type=text],input[type=password]:placeholder {
  color: #cccccc;
}

/* ANIMATIONS */

/* Simple CSS3 Fade-in-down Animation */
.fadeInDown {
  -webkit-animation-name: fadeInDown;
  animation-name: fadeInDown;
  -webkit-animation-duration: 1s;
  animation-duration: 1s;
  -webkit-animation-fill-mode: both;
  animation-fill-mode: both;
}

@-webkit-keyframes fadeInDown {
  0% {
    opacity: 0;
    -webkit-transform: translate3d(0, -100%, 0);
    transform: translate3d(0, -100%, 0);
  }
  100% {
    opacity: 1;
    -webkit-transform: none;
    transform: none;
  }
}

@keyframes fadeInDown {
  0% {
    opacity: 0;
    -webkit-transform: translate3d(0, -100%, 0);
    transform: translate3d(0, -100%, 0);
  }
  100% {
    opacity: 1;
    -webkit-transform: none;
    transform: none;
  }
}

/* Simple CSS3 Fade-in Animation */
@-webkit-keyframes fadeIn { from { opacity:0; } to { opacity:1; } }
@-moz-keyframes fadeIn { from { opacity:0; } to { opacity:1; } }
@keyframes fadeIn { from { opacity:0; } to { opacity:1; } }

.fadeIn {
  opacity:0;
  -webkit-animation:fadeIn ease-in 1;
  -moz-animation:fadeIn ease-in 1;
  animation:fadeIn ease-in 1;

  -webkit-animation-fill-mode:forwards;
  -moz-animation-fill-mode:forwards;
  animation-fill-mode:forwards;

  -webkit-animation-duration:1s;
  -moz-animation-duration:1s;
  animation-duration:1s;
}

.fadeIn.first {
  -webkit-animation-delay: 0.1s;
  -moz-animation-delay: 0.1s;
  animation-delay: 0.1s;
}

.fadeIn.second {
  -webkit-animation-delay: 0.2s;
  -moz-animation-delay: 0.2s;
  animation-delay: 0.2s;
}

.fadeIn.third {
  -webkit-animation-delay: 0.3s;
  -moz-animation-delay: 0.3s;
  animation-delay: 0.3s;
}

.fadeIn.fourth {
  -webkit-animation-delay: 0.3s;
  -moz-animation-delay: 0.3s;
  animation-delay: 0.3s;
  margin-bottom: 0rem;
}

/* Simple CSS3 Fade-in Animation */
.underlineHover:after {
  display: block;
  left: 0;
  bottom: -10px;
  width: 0;
  height: 2px;
  background-color: #56baed;
  content: "";
  transition: width 0.2s;
}

.underlineHover:hover {
  color: #0d0d0d;
}

.underlineHover:hover:after{
  width: 100%;
}

/* OTHERS */

*:focus {
    outline: none;
}

#icon {
  width:60%;
}

* {
  box-sizing: border-box;
}
</style>

<script>
import api from '@/api.js'

export default {
  data () {
    return {
      isLogin: true,
      isPhone: false,
      loginData: {
        login: '',
        password: ''
      },
      optionsLoginType: [
        { text: this.$t('Username'), value: 'username' },
        { text: this.$t('Phone'), value: 'phone' },
        { text: this.$t('Hotspot'), value: 'hotspot' }],
      logoIcon: require('@/assets/img/favicon.png'),
      googleLogin: require('@/assets/img/btn_google_signin_dark_normal_web.png')
    }
  },
  methods: {
    loginOAUTH (provider) {
      window.location = '/customer_api/oauth/' + provider
    },
    phoneLogIn () {
      this.loginData = {
        mobile_telephone: '',
        password: ''
      }
    },
    userLogIn () {
      this.loginData = {
        login: '',
        password: ''
      }
    },
    reqByPhone () {
      let loginData = {
        login: '',
        password: ''
      }
      loginData.login = this.loginData.mobile_telephone
      loginData.password = this.loginData.password
      this.$store.dispatch('CREATE_USERS_BY_PHONE', JSON.stringify(loginData)).then(response => {
        api.post('/login_phone', this.loginData).then(response => {
          if (response.status === 200) {
            let data = response.data
            if (data.hasOwnProperty('sid_customer')) {
              this.$cookie.set('sid_customer', data.sid_customer, {expires: 1, path: '/customer_api'})
              localStorage.setItem('sid_customer', data.sid_customer)
              this.$router.push('profile')
            }
          } else {
            this.$bvToast.toast(this.$t('Invalid username or password'), {
              title: this.$t('Error'),
              variant: 'danger',
              solid: true
            })
          }
        })
      })
    },
    login () {
      api.post('/login', this.loginData).then(response => {
        if (response.status === 200) {
          let data = response.data
          if (data.hasOwnProperty('sid_customer')) {
            this.$cookie.set('sid_customer', data.sid_customer, {expires: 1, path: '/customer_api'})
            localStorage.setItem('sid_customer', data.sid_customer)
            this.$router.push('profile')
          }
        } else {
          this.$bvToast.toast(this.$t('Invalid username or password'), {
            title: this.$t('Error'),
            variant: 'danger',
            solid: true
          })
        }
      })
    },
    loginHotspot () {
      api.post('/login_hotspot', this.loginData).then(response => {
        if (response.status === 200) {
          let data = response.data
          if (data.hasOwnProperty('sid_customer')) {
            this.$cookie.set('sid_customer', data.sid_customer, {expires: 1, path: '/customer_api'})
            localStorage.setItem('sid_customer', data.sid_customer)
            this.$router.push('profile')
          }
        } else {
          this.$bvToast.toast(this.$t('Invalid username or password'), {
            title: this.$t('Error'),
            variant: 'danger',
            solid: true
          })
        }
      })
    }
  },
  mounted () {
    this.$store.dispatch('CLEAR_STORE')
    this.$store.dispatch('GET_PHONE_FORMAT')
    this.$store.dispatch('GET_ALLOWED_OAUTH')
    this.$store.dispatch('GET_LOGIN_SETTINGS')
    if (this.$route.query.sid_customer) {
      let sidCustomer = this.$route.query.sid_customer
      if (sidCustomer.length > 0) {
        this.$cookie.set('sid_customer', sidCustomer, {expires: 1, path: '/customer_api'})
        localStorage.setItem('sid_customer', sidCustomer)
        this.$router.push('profile')
      }
    }
  },
  computed: {
    loginPlaceHolder () {
      if (this.loginSettings.login_type === 'basic_acc_id') {
        return this.$t('Account ID')
      }
      if (this.loginSettings.login_type === 'user_id') {
        return this.$t('User ID')
      }
      return this.$t('Username')
    },
    phoneFormat () {
      return this.$store.getters.PHONE_FORMAT
    },
    allowedOAUTH () {
      return this.$store.getters.ALLOWED_OAUTH
    },
    loginSettings () {
      return this.$store.getters.LOGIN_SETTINGS
    }
  }
}
</script>
