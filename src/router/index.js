import Vue from 'vue'
import Router from 'vue-router'
import Profile from '@/pages/Profile'
import ProfileEdit from '@/pages/ProfileEdit'
import Payments from '@/pages/Payments'
import Login from '@/pages/Login'
import Logout from '@/pages/Logout'
import Reports from '@/pages/Reports'
import Rentsoft from '@/pages/Rentsoft'
import Documents from '@/pages/Documents'
import Dashboard from '@/components/Dashboard'

Vue.use(Router)

const ifAuthenticated = (to, from, next) => {
  if (localStorage.getItem('sid_customer')) {
    if (to.name === 'Login') {
      next('/')
      return
    }
    next()
    return
  }
  next('login')
}

const ifAlreadyAuthenticated = (to, from, next) => {
  if (localStorage.getItem('sid_customer')) {
    next('/')
    return
  }
  next()
}

export default new Router({
  routes: [
    {
      path: '/login',
      name: 'Login',
      component: Login,
      beforeEnter: ifAlreadyAuthenticated
    },
    {
      path: '/logout',
      name: 'Logout',
      component: Logout
    },
    {
      path: '/',
      name: 'Dashboard',
      component: Dashboard,
      redirect: '/profile',
      beforeEnter: ifAuthenticated,
      children: [
        {
          path: 'profile',
          name: 'Profile',
          component: Profile,
          beforeEnter: ifAuthenticated
        },
        {
          path: 'ProfileEdit',
          name: 'ProfileEdit',
          component: ProfileEdit,
          beforeEnter: ifAuthenticated
        },
        {
          path: 'home',
          redirect: '/profile',
          beforeEnter: ifAuthenticated
        },
        {
          path: 'payments',
          name: 'Payments',
          component: Payments,
          beforeEnter: ifAuthenticated
        },
        {
          path: 'reports',
          name: 'Reports',
          component: Reports,
          beforeEnter: ifAuthenticated
        },
        {
          path: 'rentsoft',
          name: 'Rentsoft',
          component: Rentsoft,
          beforeEnter: ifAuthenticated
        },
        {
          path: 'documents',
          name: 'Documents',
          component: Documents,
          beforeEnter: ifAuthenticated
        }
      ]
    }
  ]
})
