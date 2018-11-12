<template>
        
            

                   <v-toolbar app absolute clipped-left class="white elevation-0">
                       
                                <v-toolbar-side-icon @click.stop="toggleDrawer"></v-toolbar-side-icon>
                                <v-toolbar-title class="hidden-xs-only" style="margin-top:10px;margin-left:0px;width:150px;">
                                    <img src="../../assets/logo.png" @click="gotoHome" tag="span" style="cursor: pointer;width:150px;" />
                                </v-toolbar-title> 
                                <v-toolbar-title class="hidden-md-and-up" style="margin-top:10px;margin-left:0px;width:70px;">
                                    <img  src="../../assets/logo-small.png" @click="gotoHome" tag="span" style="cursor: pointer;width:60px;" />

                                </v-toolbar-title>                                                  
                                <v-spacer></v-spacer>
                                <div id="toolbarSearch" class="">
                                
                                <template v-if="user">
                                    <v-text-field    
                                                @keyup="filterSnippetsByVal"
                                                @keyup.enter="showSearch"
                                                @click:clear="clearFilter"
                                                v-model="searchParams"                                        
                                                style="border: thin solid #ddd;"
                                                solo
                                                hide-details
                                                flat
                                                label="Search by title or tag"
                                                prepend-inner-icon="search"
                                                clearable
                                    ></v-text-field>                                 
                                </template>
                                <!-- <template v-else>
                                    <div class="text-xs-center">
                                    <h1>Welcome!!</h1>
                                    </div>
                                </template> -->

                                </div>

                                <v-spacer></v-spacer>

                                <v-toolbar-items>                    
                                        

                                        <v-menu bottom left v-if="user">
                                        <v-btn
                                        slot="activator"                        
                                        icon
                                        >
                                        <v-icon size="30px">account_circle</v-icon>
                                        </v-btn>

                                        <v-list>
                                        <v-list-tile
                                            v-for="(item, i) in menuItems"
                                            :key="i"     
                                            :to="item.link"           
                                        >
                                            <v-list-tile-title>{{ item.title }}</v-list-tile-title>
                                            <v-icon style="margin-left: 20px;">{{ item.icon }}</v-icon>
                                        </v-list-tile>

                                        <v-list-tile v-if="user" @click="logOut">
                                            <v-list-tile-title>Log Out</v-list-tile-title>
                                            <v-icon style="margin-left: 20px;">exit_to_app</v-icon>
                                        </v-list-tile>
                                        </v-list>
                                    </v-menu>
                                </v-toolbar-items>
                            
                    </v-toolbar>        
            
     
            
    
     
</template>
<script>
  import {EventBus} from '@/helpers/event-bus.js'

  export default {    
    data: () => ({
           searchParams: ''
    }),
    computed: {
        user() {
            return this.$store.getters.user
        },
        menuItems() {
            let menuItems = [
                // { title: 'Profile' ,icon: 'person', link: ''},
                // { title: 'Logout' ,icon: 'exit_to_app', link: ''},
                { title: 'Sign up' ,icon: 'face', link: '/signup'},
                { title: 'Sign in' ,icon: 'lock_open', link: '/signin'}
            ]
            
            if(this.user) {
                menuItems = [
                    { title: 'Profile' ,icon: 'person', link: '/profile'},                    
                ]   
            }

            return menuItems
        } 
    },    
    methods: {        
        showSearch() {
            this.$router.push('/snippets')
        },
        clearFilter() {
                this.$store.dispatch('resetFilteredSnippets')    
        },

        gotoHome() {
            if(this.user) {
                this.$router.push('/snippets')
            }else{
                this.$router.push('/')
            }
        },

        toggleDrawer() {
                EventBus.$emit('toggleDrawer')
        },

        logOut() {
            
            this.$store.dispatch('logout')
            this.$router.push('/')
        },

        filterSnippetsByVal() {
       
            if(this.searchParams !== '') {
                this.$store.dispatch('filterSnippets', this.searchParams)
            }else{
                this.$store.dispatch('resetFilteredSnippets')                
            }
        }
    },

    created() {
        EventBus.$on("filterCLeared", () => {
            this.searchParams = ''
        })
    }
  }
</script>


<style>
.v-toolbar__content {
    border-bottom: 1px solid #ddd
}

#toolbarSearch {
    width: 500px;    
}

@media only screen and (max-width: 600px) {
    #toolbarSearch {
        width: 250px;
        margin-left:10px
    }   
}

</style>
