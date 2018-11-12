import Vue from 'vue'
import Router from 'vue-router'

import Home from '../components/Home'
import SnippetList from '../components/Snippets/SnippetList'
import Snippet from '../components/Snippets/Snippet'
import CreateSnippet from '../components/Snippets/CreateSnippet'
import SignUp from '../components/User/SignUp'
import SignIn from '../components/User/SignIn'
import Profile from '../components/User/Profile'

import AuthGuard from './auth-guard'


Vue.use(Router)

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'Home',
      component: Home
    },
    {
      path: '/snippets',
      name: 'Snippets',
      component: SnippetList,
      beforeEnter: AuthGuard
    },
    {
      path: '/snippet/:id',
      name: 'Snippet',
      props: true,
      component: Snippet
    },
    {
      path: '/create-snippet',
      name: 'CreateSnippet',
      component: CreateSnippet,
      beforeEnter: AuthGuard
    },
    {
      path: '/signup',
      name: 'Signup',
      component: SignUp
    },
    {
      path:'/signin',
      name:'Signin',
      component: SignIn
    },
    {
      path:'/profile',
      name:'Profile',
      component: Profile
    }
  ]
})
