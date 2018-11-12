<template>
    <v-navigation-drawer
    class="grey lighten-5"
    v-model="drawer"
    fixed
    clipped
    app
    >
         
            <template v-if="!user">
                <v-list dense>
                    <!-- <v-list-tile>                        
                        <v-list-tile-content>
                        <v-list-tile-title class="dark text-xs-center headline">
                            Welcome
                        </v-list-tile-title>
                        </v-list-tile-content>
                    </v-list-tile> -->


                    <v-list-tile >
                        <v-list-tile-action>
                        <v-icon>face</v-icon>
                        </v-list-tile-action>
                        <v-list-tile-content>
                        <v-list-tile-title class="grey--text">
                            <router-link to="/signup" tag="span" style="cursor:pointer;">Sign up</router-link>
                        </v-list-tile-title>
                        </v-list-tile-content>
                    </v-list-tile>

                    <v-list-tile>
                        <v-list-tile-action>
                        <v-icon>lock_open</v-icon>
                        </v-list-tile-action>
                        <v-list-tile-content>
                        <v-list-tile-title class="grey--text">
                            <router-link to="/signin" tag="span" style="cursor:pointer;">Sign in</router-link>
                        </v-list-tile-title>
                        </v-list-tile-content>
                    </v-list-tile>
                    
                </v-list>
                    
                </template>

                <template v-else>
                   <v-list subheader three-line>
                    
                    <v-list-tile>                        
                        <v-list-tile-content>
                        <v-list-tile-title class="dark--text mb-2">
                            Filter your snippets by color: {{activeColorFilter}}
                        </v-list-tile-title>                        
                        <v-list-tile-sub-title class="text-xs-center"> 
                            <div class="filterColorBtn" :class="{'filterColorBtnSelected' : activeColorFilter == 'red'}" style="background:#F44336" @click="filterSnippetsByColor('red')"></div>
                            <div class="filterColorBtn" :class="{'filterColorBtnSelected' : activeColorFilter == 'success'}" style="background:#4CAF50" @click="filterSnippetsByColor('success')"></div>
                            <div class="filterColorBtn" :class="{'filterColorBtnSelected' : activeColorFilter == 'primary'}" style="background:#2196F3" @click="filterSnippetsByColor('primary')"></div>
                            <div class="filterColorBtn" :class="{'filterColorBtnSelected' : activeColorFilter == 'warning'}" style="background:#FFEB3B" @click="filterSnippetsByColor('warning')"></div>
                            
                        </v-list-tile-sub-title>
                        </v-list-tile-content>
                    </v-list-tile>
                    <v-divider class="my-3"></v-divider>

                    <v-list-tile >                        
                        <v-list-tile-content> 
                        <v-list-tile-title class="dark--text">
                            Filter by language: {{selectedLanguage}}
                        </v-list-tile-title>                        
                        <v-list-tile-sub-title class="text-xs-center"> 
                            <v-select    
                                    v-model='selectedLanguage'
                                    @change="filterSnippetsByLanguage"
                                    :items="languages"
                                    label="Select language"                                    
                                    solo
                                    ></v-select>
                        </v-list-tile-sub-title>
                        </v-list-tile-content>
                    </v-list-tile>
                    <v-divider class="my-3"></v-divider>
                    

                    <v-list-tile style="height:70px;">                        
                        
                        <v-list-tile-title class="dark--text">
                            Most used tags:
                        </v-list-tile-title>                                               
                        
                    </v-list-tile>
                    <v-layout row>
                        <v-flex xs12 pl-3>
                                <v-chip v-for="(chip, i) in mostUsedTags" :key="i" @click="filterSnippetsByTag(chip)">{{chip}}</v-chip>                            
                        </v-flex>
                    </v-layout>
                    <v-divider class="my-3"></v-divider>

                    <v-list-tile>
                        <v-layout row>
                            <v-flex xs12 class="text-xs-center">
                                <v-btn class="grey lighten-4" @click="clearFilters">Clear Filters</v-btn>
                            </v-flex>
                        </v-layout>
                    </v-list-tile>

                    <v-list-tile @click="logOut">
                        <v-list-tile-action>
                        <v-icon>exit_to_app</v-icon>
                        </v-list-tile-action>
                        <v-list-tile-content>
                        <v-list-tile-title class="dark--text">
                            Log out
                        </v-list-tile-title>
                        </v-list-tile-content>
                    </v-list-tile>

                   </v-list>
                </template>
 
    </v-navigation-drawer>
</template>

<script>
import {EventBus} from '@/helpers/event-bus.js'
import {suportedLanguages} from '@/helpers/suported-languages.js'


export default {
    data() {
        return {
            activeColorFilter: null,
            selectedLanguage: '',
            filterObject: {
                color: '',
                language:'',
                textTag:''
            },            

            languages: suportedLanguages,
            drawer: false        
        }
    },

    computed: {



            user() {
                return this.$store.getters.user
            },
            
            mostUsedTags() {

                    let tagsObj = []                    
                    this.$store.getters.loadedSnippets.forEach(snippet => {
                        snippet.textTags.forEach(tag => {                                                        
                            tagsObj.push(tag)
                        })
                    })
              
                    function uniqueCountPreserve(inputArray){                                                
                        var arrayItemCounts = {};
                        for (var i in inputArray){
                            if (!(arrayItemCounts.hasOwnProperty(inputArray[i]))){
                                arrayItemCounts[inputArray[i]] = 1
                            } else {
                                arrayItemCounts[inputArray[i]] += 1
                            }
                        }

                        var keysByCount = Object.keys(arrayItemCounts).sort(function(a, b){
                            return arrayItemCounts[a]-arrayItemCounts[b];
                        });

                        return(keysByCount.reverse())
                    }
                    
                    return uniqueCountPreserve(tagsObj).splice(0,7)

            }
    },

    watch: {
        user(value) {            
            if(value !== null && value !== undefined) {
                this.drawer = true
            }else{
                this.drawer = false
            }
        }
    },

    created() {
        EventBus.$on('toggleDrawer', () => {
            this.drawer = !this.drawer
        })


        EventBus.$on('filterCLeared', () => {
            this.activeColorFilter = null
            this.selectedLanguage = ''
            this.filterObject.color = ''
            this.filterObject.language = '',
            this.filterObject.textTag = ''
        })
    },

    methods: {
        clearFilters() {
            this.$store.dispatch("resetFilteredSnippets")
        },

         logOut() {
             
            this.$store.dispatch('logout')
            this.$router.push('/')
        },

        filterSnippetsByColor(val) {
                this.activeColorFilter = val                            
                this.filterObject.color = val                                        
                this.$store.dispatch('filterSnippetsStrict', this.filterObject)
        },

        filterSnippetsByLanguage(val) {            
            this.filterObject.language = val
            this.$store.dispatch('filterSnippetsStrict', this.filterObject)            
        },

        filterSnippetsByTag(val) {
            this.filterObject.textTag = val            
            this.$store.dispatch('filterSnippetsStrict', this.filterObject)
        }
    }
}
</script>


<style scoped>
        .filterColorBtn { 
            width:30px;
            height:30px;
            display: inline-block;            
            border-radius: 100%;
            margin-right:20px;            
            cursor: pointer;
        }

        .filterColorBtn:hover {
            border: 2px solid #444;
         }

         .filterColorBtnSelected {
             border: 2px solid #444;
         }
</style>
