<template>
    <div>
        <vue-navigation-bar v-if="isShowDashboard" :options="navbarData" >
        </vue-navigation-bar>
        <router-view></router-view>
        <div class="footer-content" style="text-align:left;">
          {{ info }}
        </div>
        <beautiful-chat
          v-if="isChatActive"
          :participants="participants"
          :titleImageUrl="titleImageUrl"
          :onMessageWasSent="onMessageWasSent"
          :messageList="messageList"
          :newMessagesCount="newMessagesCount"
          :isOpen="isChatOpen"
          :close="closeChat"
          :icons="icons"
          :open="openChat"
          :showEmoji="false"
          :showFile="false"
          :showEdition="false"
          :showDeletion="false"
          :showTypingIndicator="''"
          :showLauncher="true"
          :showCloseButton="true"
          :colors="colors"
          :alwaysScrollToBottom="alwaysScrollToBottom"
          :messageStyling="messageStyling" >
          <template v-slot:header>
            <div style="padding:1rem;font-size:1rem">
                {{ $t('Support') }}
            </div>
          </template>
          <template v-slot:system-message-body="{ message }">
            {{ $t('Announcement') }}: {{message.text}}
          </template>
        </beautiful-chat>
    </div>
</template>

<style>
.sc-user-input {
  text-align: left !important;
}
</style>

<script>
import CloseIcon from '@/assets/img/close-icon.png'
import OpenIcon from '@/assets/img/logo-no-bg.svg'
import FileIcon from '@/assets/img/file.svg'
import CloseIconSvg from '@/assets/img/close.svg'
export default {
  data () {
    return {
      SendKeepAliveTimerID: null,
      isSendKeepAliveStarted: false,
      messageList: [],
      conn: null,
      WS: null,
      isShowDashboard: false,
      navbarData: {
        elementId: 'main-navbar',
        isUsingVueRouter: true,
        mobileBreakpoint: 992,
        brandImagePath: '/',
        brandImage: require('@/assets/img/favicon.png'),
        brandImageAltText: 'vue-navigation-bar',
        collapseButtonStyle: 'dark',
        ariaLabelMainNav: 'Main Navigation',
        menuOptionsLeft: [
          {
            type: 'link',
            text: this.$i18n.t('Profile'),
            path: '/profile'
          },
          {
            type: 'link',
            text: this.$i18n.t('Payments'),
            path: '/payments'
          }
        ],
        menuOptionsRight: [
          {
            type: 'button',
            text: this.$i18n.t('Logout'),
            path: '/logout',
            class: 'button-red'
          }
        ]
      },
      AllowedReports: null,
      AllowedDocs: null,
      isRentsoftEnabled: false,
      icons: {
        open: {
          img: OpenIcon,
          name: 'default'
        },
        close: {
          img: CloseIcon,
          name: 'default'
        },
        file: {
          img: FileIcon,
          name: 'default'
        },
        closeSvg: {
          img: CloseIconSvg,
          name: 'default'
        }
      },
      participants: [],
      titleImageUrl: '',
      newMessagesCount: 0,
      isChatOpen: false,
      colors: {
        header: {
          bg: '#117a8b',
          text: '#ffffff'
        },
        launcher: {
          bg: '#138496'
        },
        messageList: {
          bg: '#ffffff'
        },
        sentMessage: {
          bg: '#117a8b',
          text: '#ffffff'
        },
        receivedMessage: {
          bg: '#eaeaea',
          text: '#222222'
        },
        userInput: {
          bg: '#f4f7f9',
          text: '#565867'
        }
      },
      alwaysScrollToBottom: true,
      messageStyling: false
    }
  },
  methods: {
    async webSocket (thisRef) {
      await this.$store.dispatch('GET_CHAT_MSGS').then(response => {
        for (let el of this.$store.getters.CHAT_MSGS) {
          let elType = 'text'
          if (el.is_system) {
            elType = 'system'
          }
          let newEl = {
            type: elType,
            author: ``,
            data: { text: `` }
          }
          newEl.author = el.is_admin_origin ? 'Support' : 'me'
          newEl.data.text = el.message
          this.messageList.push(newEl)
        }
      })
      let sessionId = window.localStorage.sid_customer
      let loc = window.location
      let newUri = ''
      if (loc.protocol === 'https:') {
        newUri = 'wss:'
      } else {
        newUri = 'ws:'
      }
      newUri += '//' + loc.host
      newUri += loc.pathname + 'customer_api/auth/chat'
      this.WS = new WebSocket(newUri, sessionId)
      this.WS.onclose = function (evt) {
        if (evt.code === 1009) {
          thisRef.$bvToast.toast('Msg too big ; Tech Chat closed , reload this page', {
            title: thisRef.$t('Error'),
            variant: `danger`,
            solid: true
          })
        }
      }
      this.WS.onmessage = async (evt) => {
        let jsonData = JSON.parse(evt.data)
        let elType = 'text'
        if (jsonData.is_system === 'true') {
          elType = 'system'
        }
        let newEl = {
          type: elType,
          author: jsonData.is_admin_origin === 'true' ? 'Support' : 'me',
          data: { text: `` }
        }
        newEl.data.text = jsonData.message
        this.messageList.push(newEl)
      }
    },
    onMessageWasSent (message) {
      let msg = {
        message: message.data.text
      }
      this.WS.send(JSON.stringify(msg))
    },
    openChat () {
      this.isChatOpen = true
      this.newMessagesCount = 0
    },
    closeChat () {
      this.isChatOpen = false
    },
    handleScrollToTop () {
    },
    addDocs () {
      if (this.$store.getters.ALLOWED_DOCS.is_enabled) {
        this.navbarData.menuOptionsLeft = this.navbarData.menuOptionsLeft.filter(item => item.path !== '/documents')
        this.navbarData.menuOptionsLeft.push(
          {
            type: 'link',
            text: this.$i18n.t('Documents'),
            path: '/documents'
          })
      }
    },
    addReports () {
      if (this.$store.getters.ALLOWED_REPORTS.global_enabled &&
      this.$store.getters.ALLOWED_REPORTS.is_enabled) {
        this.navbarData.menuOptionsLeft = this.navbarData.menuOptionsLeft.filter(item => item.path !== '/reports')
        this.navbarData.menuOptionsLeft.push(
          {
            type: 'link',
            text: this.$i18n.t('Reports'),
            path: '/reports'
          })
      }
    },
    addRentsoft () {
      if (this.$store.getters.IS_RENTSOFT_ENABLED) {
        this.navbarData.menuOptionsLeft = this.navbarData.menuOptionsLeft.filter(item => item.path !== '/rentsoft')
        this.navbarData.menuOptionsLeft.push(
          {
            type: 'link',
            text: this.$i18n.t('Subscriptions'),
            path: '/rentsoft'
          })
      }
    }
  },
  async mounted () {
    this.isSendKeepAliveStarted = false
    this.$store.dispatch('GET_ALLOWED_ACTIVATIG_CARD')
    this.$store.dispatch('GET_ALLOWED_REPORTS')
    this.$store.dispatch('GET_ALLOWED_DOCS')
    this.$store.dispatch('GET_IS_ENABLED_RENTSOFT')
    this.isShowDashboard = true
    this.addDocs()
    this.addReports()
    this.addRentsoft()
  },
  destroyed () {
    if (this.SendKeepAliveTimerID) {
      clearTimeout(this.SendKeepAliveTimerID)
    }
  },
  watch: {
    profile: function (val) {
      if (!this.isSendKeepAliveStarted && val.is_send_keep_alive) {
        this.isSendKeepAliveStarted = true
        this.SendKeepAliveTimerID = setInterval(this.$store.dispatch, 3000, 'GET_KEEP_ALIVE_SESSION')
      }
    },
    allowedReports () {
      this.addReports()
    },
    allowedDocs () {
      this.addDocs()
    },
    allowedRentsoft () {
      this.addRentsoft()
    },
    keep_alive_response (val) {
      if ('error' in val) {
        this.$bvToast.toast(val.error, {
          variant: 'danger',
          title: 'Error',
          solid: true,
          autoHideDelay: 3000
        })
      }
    }
  },
  computed: {
    keep_alive_response () {
      return this.$store.getters.KEEP_ALIVE_SESSION
    },
    allowedRentsoft () {
      return this.$store.getters.IS_RENTSOFT_ENABLED
    },
    allowedReports () {
      return this.$store.getters.ALLOWED_REPORTS.global_enabled
    },
    allowedDocs () {
      return this.$store.getters.ALLOWED_DOCS.is_enabled
    },
    isChatActive () {
      if (this.$store.getters.CHAT_SETTINGS.is_enabled) {
        this.webSocket(this)
      }
      return this.$store.getters.CHAT_SETTINGS.is_enabled
    },
    profile () {
      return this.$store.getters.PROFILE
    },
    info () {
      return process.env.VERSION
    }
  }
}
</script>
