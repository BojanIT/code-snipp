<template>
    <v-container>
        <!-- <v-layout row>
            <v-flex xs12 class="text-xs-center">
                <h2>Your Snippets</h2>
            </v-flex>
        </v-layout> -->


            <v-layout xs12 class="text-xs-center">
                <v-flex xs12 class="text-xs-center">
                    <v-progress-circular
                        v-if="loading"
                        :size="70"
                        :width="7"
                        color="primary"
                        indeterminate
                        ></v-progress-circular>
                </v-flex>
            </v-layout>


        <v-layout row wrap v-if="snippetsList.length > 0">
            <v-flex xs12 md6 lg4 pa-2 v-for="snippet in snippetsList" :key="snippet.id">
                <v-card :style="accentBorder(snippet.colorTags)">                    
                    <v-card-title primary-title>
                    <div style="overflow:hidden;height:200px;">
                        <h3 class="headline mb-1">{{ snippet.title }}</h3>
                        
                        <div style="overflow: auto;">
                            <codemirror v-model="snippet.code" :options="snippet.cmOptions"></codemirror>              
                        </div>
                    </div>
                    </v-card-title>                    
                    <v-divider light></v-divider>
                    <v-card-actions :class="accentColor(snippet.colorTags)">
                        <span class="caption font-italic">{{ snippet.date | date }}</span>

                        <v-chip outline color="primary ml-3" class="">{{ snippet.languageCode | languageFormat}}</v-chip>
                        
                    <v-spacer></v-spacer>
                    <v-btn flat color="primary" :to="'/snippet/'+snippet.id">Expand</v-btn>
                    </v-card-actions>
                </v-card>
            </v-flex>            
        </v-layout>
        <v-layout align-center justify-center row fill-heigh v-if="mainSnippetsList.length == 0 && !loading" mt-5>
            <v-flex xs12 class="text-xs-center">
                    <h3>No snippets yet :/</h3>
                    <p>Go ahead and create your first:</p>
                    <v-btn color="primary" to="/create-snippet">Create Snippet</v-btn>
            </v-flex>
        </v-layout>

        <v-layout align-center justify-center row fill-heigh v-if="snippetsList.length == 0 && !loading && snippetsAreFiltered" mt-5>
            <v-flex xs12 class="text-xs-center">
                    <h3>No matching snippets found</h3>                    
                    <v-btn color="primary" @click="clearFilters">CLEAR FILTERS</v-btn>
            </v-flex>
        </v-layout>

        <v-tooltip top v-if="showAddBtn && snippetsList.length > 0">
          <v-btn fab dark color="primary" slot="activator" style="position:fixed;bottom:10px;right:10px;" to="/create-snippet">
            <v-icon dark>add</v-icon>
          </v-btn>
          <span>Create new snippet</span>
        </v-tooltip>

    </v-container>
</template>
<script>
import 'codemirror/mode/javascript/javascript.js'

import {cmDefaultOptions} from '../../helpers/codemirrorOptions.js'
import {suportedLanguages} from '../../helpers/suported-languages.js'
export default {    
    data() {
        return {
            showAddBtn: false
        }
    },
    computed: {
        snippetsAreFiltered() {
            return this.$store.getters.snippetsAreFiltered
        },
        mainSnippetsList() {
            return this.$store.getters.loadedSnippets
        },
        snippetsList() {           
            

             this.$store.getters.filteredSnippets.forEach(element => {
                element.cmOptions = {
                    ...cmDefaultOptions,
                    mode: element.languageCode
                }                           
            
            });                                                                       
            return this.$store.getters.filteredSnippets
        },

        loading() {
            return this.$store.getters.loading
        }
    },
    methods: {
        clearFilters() {
            this.$store.dispatch("resetFilteredSnippets")
        },
        accentColor(arr) {                        
            if(arr.length > 1) {
                return 'grey lighten-3'
            } else if (arr.length == 1){
                return `${arr[0]} lighten-3`
            }else{
                return 'white'
            }
        },

        accentBorder(arr) {
                let colors = {
                    'red' : '#F44336',
                    'success': '#4CAF50',
                    'primary' : '#2196F3',
                    'warning' : '#FFEB3B'
                }

                if(arr.length > 1) {
                    return 'border: 1px solid #9E9E9E'
                } else if (arr.length == 1){
                    return 'border: 1px solid ' + colors[arr[0]]
                }else{
                    return 'border: 1px solid #efefef'
                }            
        }
    },

    created() {
            setTimeout(()=> {
                this.showAddBtn = true
            },400)
    }
}
</script>


