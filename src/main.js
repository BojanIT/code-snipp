import Vue from 'vue'
import './plugins/vuetify'
import App from './App.vue'
import router from './router'
import {store} from './store'

import VueCodemirror from 'vue-codemirror'
import 'codemirror/lib/codemirror.css'
import './assets/custom.css'
import AlertComponent from './components/Shared/Alert'

import DateFilter from './filters/date'
import LanguageFilter from './filters/formatLanguage'
import SnippetColor from './filters/colorAccent'


import * as firebase from 'firebase'

Vue.config.productionTip = false

export const EventBus = new Vue();

Vue.use(VueCodemirror)


Vue.filter('date', DateFilter)
Vue.filter('languageFormat', LanguageFilter)
Vue.filter('snippetColor', SnippetColor)

Vue.component('app-alert', AlertComponent)


new Vue({
  router,
  store,
  render: h => h(App),
  created() {
    firebase.initializeApp({
      apiKey: "your secret key",
      authDomain: "code-snipp.firebaseapp.com",
      databaseURL: "https://code-snipp.firebaseio.com",
      projectId: "code-snipp",
      storageBucket: "code-snipp.appspot.com"
    })

    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        this.$store.dispatch('autoSignin', user)
      }
    })
    
    this.$store.dispatch('loadSnippets')

  }
}).$mount('#app')

