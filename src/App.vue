<template>
  <v-app>
    <cs-nav-drawer :drawer="drawer"></cs-nav-drawer> 
    <cs-tool-bar :drawer="drawer"></cs-tool-bar>
    <v-content class="white">
      <v-container fluid class="white">
        <v-layout>
          <transition name="slide-x-transition" mode="out-in"> 
              <router-view></router-view>
          </transition>
        </v-layout>        
        
      </v-container>
    </v-content>
  </v-app>
</template>

<script>
import ToolBar from './components/navigation/ToolBar'
import NavigationDrawer from './components/navigation/NavigationDrawer'

export default {
  name: 'App',
  components: {    
    'cs-tool-bar':ToolBar,
    'cs-nav-drawer':NavigationDrawer
  },
  data () {
    return {
        drawer: null
    }
  }
}
</script>


<style>
  
</style>
