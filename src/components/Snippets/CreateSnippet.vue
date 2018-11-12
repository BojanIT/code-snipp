<template>
    <v-container>
        <v-layout row wrap>
            <v-flex xs12 md10 offset-md1>
                <form @submit.prevent="onCreateSnippet">
                    <v-layout row>
                        <v-flex xs7>
                                <v-text-field
                                    @keydown.enter.prevent
                                    v-model="title"                                               
                                    label="Snippet Title"
                                    maxlength=50
                                    required
                                ></v-text-field>
                        </v-flex>  
                        <v-flex xs4 offset-xs1>
                                 <v-select                                 
                                    :items="languages"
                                    label="Select language"
                                    @change="setLanguage"
                                    required
                                    ></v-select>
                        </v-flex>                        
                        
                    </v-layout>
                    <v-layout row>
                        <v-flex xs12>
                            <codemirror v-model="code" :options="cmOptions"></codemirror>
                        </v-flex>
                    </v-layout>                                   

                    <v-layout row>
                        <v-flex xs12 class="text-xs-center" mb-4>
                            <span :class="{'primary--text':colorLabels.length > 0}" style="display: inline-block;margin-right:10px;">Label by color:</span>
                            <v-switch
                                style="display: inline-block;margin-right:10px;"
                                v-model="colorLabels"
                                label="red"
                                color="red"
                                value="red"
                                hide-details
                                
                            ></v-switch>
                            <v-switch
                                style="display: inline-block;margin-right:10px;"
                                v-model="colorLabels"
                                label="green"
                                color="success"
                                value="success"
                                hide-details
                            ></v-switch>
                            <v-switch
                                style="display: inline-block;margin-right:10px;"
                                v-model="colorLabels"
                                label="blue"
                                color="primary"
                                value="primary"
                                hide-details
                            ></v-switch>
                            <v-switch
                                style="display: inline-block;margin-right:10px;"
                                v-model="colorLabels"
                                label="yellow"
                                color="warning"
                                value="warning"
                                hide-details
                            ></v-switch>                            
                        </v-flex>
                    </v-layout> 

                    <v-layout row>
                        <v-flex xs4>
                              <v-text-field    
                                    @keydown.enter.prevent
                                    v-model='tempLabel'
                                    label="Add label"     
                                    append-outer-icon="add_box"
                                    @click:append-outer="addLabel"
                                ></v-text-field>
                        </v-flex>
                        <v-flex xs8 style="overflow:hidden;" pl-2>
                            <span :class="{'primary--text':textLabels.length > 0}">Labels: </span>
                              <v-chip
                                v-for="(label, index) in textLabels"
                                :key="index"
                                style="display: inline-block"      
                                v-model="textLabels[index].show"     
                                @input="removeLabel(label.title)"                    
                                close
                                >{{ label.title }}</v-chip>
                                
                        </v-flex>
                    </v-layout>

                    <v-layout row mt-2>
                        <v-flex xs12 class='text-xs-center'>
                                <v-btn color="grey lighten-2" @click="cancelSave">Cancel</v-btn>
                                <v-btn 
                                :disabled="!formIsValid || loading"                                 
                                type="submit" 
                                color="primary"
                                :loading="loading"                                
                                    >
                                    Save
                                    <span slot="loader">Loading...</span>    
                                </v-btn>
                        </v-flex>
                    </v-layout>
                </form> 
            </v-flex>      
        </v-layout>        
    </v-container>
    
</template>
<script>
import 'codemirror/mode/php/php.js'
import 'codemirror/mode/swift/swift.js'
import 'codemirror/mode/javascript/javascript.js'
import 'codemirror/mode/python/python.js'
import 'codemirror/mode/clike/clike.js'
import 'codemirror/mode/css/css.js'
import 'codemirror/mode/sass/sass.js'
import 'codemirror/mode/shell/shell.js'
import 'codemirror/mode/vue/vue.js'


import {suportedLanguages} from '../../helpers/suported-languages.js'
import {EventBus} from '@/helpers/event-bus'
export default {
    data() {
        return {            
            title: '',
            languages: suportedLanguages,
            selectedLanguage: null,
            code: '',

            textLabels: [],
            cleanTextTags: [],

            colorLabels: [],
            tempLabel: '',

            cmOptions: {                
                tabSize: 4,
                mode: null,
                theme: 'default',
                lineNumbers: true,
                line: true,           
                readOnly:false                     
            }
        }
    },
    computed: {
        loading() {
            return this.$store.getters.loading
        },

        user() {
            return this.$store.getters.user
        },

        snippetObj() {
            let snippObj = {                
                userId: this.user.uid,
                title: this.title,                
                code: this.code,            
                textTags: this.cleanTextTags,    
                languageCode: this.selectedLanguage,
                colorTags: this.colorLabels,
                date: new Date().toString()
            }

            return snippObj
        },

        formIsValid() {
            return this.snippetObj.title !== '' && this.selectedLanguage && this.snippetObj.code !== ''
        },
    },
    methods: {
        cancelSave() {
            this.$router.push('/snippets')
        },

        setLanguage(selected) {                        
            this.selectedLanguage = selected
            this.cmOptions.mode = selected
        },

        addLabel() {
                    if(this.tempLabel == '') {
                        return
                    }
                    let flag = false
                    this.textLabels.forEach(elem => {
                        if(elem.title == this.tempLabel) {
                            flag = true
                        }
                    })

                    if(!flag) {
                        this.textLabels.push({title:this.tempLabel, show:true})                    
                        this.cleanTextTags.push(this.tempLabel)
                        this.tempLabel = '';    
                    }     
                    
                                                      
        },

        removeLabel(label) {
            this.textLabels = this.textLabels.filter((elem) => {
                if(elem.title != label) {
                    return elem
                }
            })
  
            this.cleanTextTags.splice(this.cleanTextTags.indexOf(label),1)            
        },

        

        onCreateSnippet() {                        
            if(this.formIsValid) {
                this.$store.dispatch('createSnippet', this.snippetObj)
                EventBus.$on('snippetAdded', (val)=>{
                    if(val == undefined)
                    this.$router.push('/snippets')
                })                
            }
            
            
        }
    }
}
</script>

<style scoped>
    .v-chip {
        display: inline-block;
    }
</style>
