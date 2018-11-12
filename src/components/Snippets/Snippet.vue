<template>
    <v-container>
        <v-layout row wrap>
            <v-flex xs12 md10 offset-md1>
                <form @submit.prevent="onSaveSnippet">
                    <v-layout row class="mb-3">
                        <v-flex xs7>
                                <div v-if="!editMode">
                                    <span class="caption primary--text">Title:</span><br>
                                    <span class="title">{{editedTitle}}</span>
                                </div>
                                <template v-if="editMode">
                                    <v-text-field
                                        :disabled="!editMode"
                                        @keydown.enter.prevent
                                        v-model="editedTitle"                                               
                                        label="Snippet Title"
                                        maxlength=50                                        
                                        required
                                    ></v-text-field>
                                </template>
                        </v-flex>  
                        <v-flex xs4 offset-xs1>
                                <div v-if="!editMode">
                                <span class="caption primary--text">Langauge:</span><br>
                                <span class="title">{{editedLanguage|languageFormat}}</span>
                                </div>
                                <template v-if="editMode">
                                 <v-select                                         
                                    :disabled="!editMode"                  
                                    :items="languages"
                                    label="Select language"
                                    v-model="editedLanguage"
                                    @change="setLanguage"
                                    required
                                    ></v-select>

                                </template>
                        </v-flex>                        
                        
                    </v-layout>
                    <v-layout row>
                        <v-flex xs12>
                            <codemirror v-model="editedCode" :options="cmOptions"></codemirror>
                        </v-flex>
                    </v-layout>                                   
                    <v-layout row>
                        <v-flex xs12 class="text-xs-center" mb-4 :style="{'cursor': editMode == false ? 'not-allowed' : 'auto'}">
                            <span :class="{'primary--text':editMode == true}" style="display: inline-block;margin-right:10px;">Label by color:</span>
                            <v-switch
                                style="display: inline-block;margin-right:10px;"
                                v-model="colorLabels"
                                label="red"
                                color="red"
                                value="red"
                                hide-details
                                :class="{'disabledSwitch' : editMode == false}"
                            ></v-switch>
                            <v-switch
                                style="display: inline-block;margin-right:10px;"
                                v-model="colorLabels"
                                label="green"
                                color="success"
                                value="success"
                                hide-details
                                :class="{'disabledSwitch' : editMode == false}"
                            ></v-switch>
                            <v-switch
                                style="display: inline-block;margin-right:10px;"
                                v-model="colorLabels"
                                label="blue"
                                color="primary"
                                value="primary"
                                hide-details
                                :class="{'disabledSwitch' : editMode == false}"
                            ></v-switch>
                            <v-switch
                                style="display: inline-block;margin-right:10px;"
                                v-model="colorLabels"
                                label="yellow"
                                color="warning"
                                value="warning"
                                hide-details
                                :class="{'disabledSwitch' : editMode == false}"                                
                            ></v-switch>                            
                        </v-flex>
                    </v-layout>

                    <v-layout row mt-2>
                            <v-flex xs4 v-if="editMode">
                              <v-text-field    
                                    @keydown.enter.prevent
                                    v-model='tempLabel'
                                    label="Add label"     
                                    append-outer-icon="add_box"
                                    @click:append-outer="addLabel"
                                ></v-text-field>
                        </v-flex>
                        <v-flex xs8 style="overflow:hidden;" pl-2>
                            <span :class="{'primary--text': editMode == true}">Labels: </span>
                              <v-chip
                                v-for="(label, index) in textTags"
                                :key="index"
                                style="display: inline-block"      
                                v-model="textTags[index].show"     
                                @input="removeLabel(label.title)"                    
                                :close="editMode"
                                >{{ label.title }}</v-chip>
                                
                        </v-flex>
                    </v-layout>


                    <v-layout row mt-2 v-if="editMode">
                        <v-flex xs12 class='text-xs-center'>

                                <v-btn                                 
                                color="grey"
                                @click="cancelChanges"
                                >
                                    Cancel                                    
                                </v-btn>

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


    <template v-if="showControlBtns">
        <v-tooltip top v-if="!editMode">
          <v-btn fab dark color="primary" slot="activator" style="position:fixed;bottom:10px;right:10px;" @click="editMode=true">
            <v-icon dark>edit</v-icon>
          </v-btn>
          <span>Edit Snippet</span>
        </v-tooltip>


        <v-tooltip top v-if="editMode">
          <v-btn fab dark color="red" slot="activator" style="position:fixed;bottom:10px;right:10px;"
            @click.prevent="deleteSnippet">
            <v-icon dark>delete</v-icon>
          </v-btn>
          <span>Delete Snippet</span>
        </v-tooltip>     
    </template>
    </v-container>
</template>
<script>
import {suportedLanguages} from '../../helpers/suported-languages.js'
import {EventBus} from '@/helpers/event-bus'


export default {
    props:['id'],
    data() {
        return {

            showControlBtns: false,

            editMode: false,


            editedTitle: '',
            editedCode:'',
            editedLanguage:'',

            colorLabels: [],
            tempLabel: '',
            cleanTextTags: [],
            textTags: [],
            cmOptions : {                
                tabSize: 4,
                mode: '',
                theme: 'default',
                lineNumbers: this.editMode,
                line: true,           
                readOnly:!this.editMode                     
            }
        }
    },
    computed: {        
        loading() {
            return this.$store.getters.loading
        },
        snippet() {
            if(this.$store.getters.loadedSnippet(this.id)) {
            
                let tempObj = JSON.parse(JSON.stringify(this.$store.getters.loadedSnippet(this.id)))                 
                return tempObj
            }else{
                return {}
            }
            
        },
        formIsValid() {                    
            return this.snippet.title !== '' && this.snippet.languageCode !== '' && this.snippet.code !== ''
        },
        languages() {
            return suportedLanguages
        },

        snippetToSave() {
            let snippObj = {
                id: this.snippet.id,
                userId: this.snippet.userId,
                title: this.editedTitle,                
                code: this.editedCode,            
                textTags: this.cleanTextTags,    
                languageCode: this.editedLanguage,
                colorTags: this.colorLabels,
                date: this.snippet.date
            }

            return snippObj
        }
    },
    methods: {
        deleteSnippet() {
            var r = confirm('are you sure')

            if(r) {                
                
                this.$store.dispatch('deleteSnippet', this.id)
                
            }
        },

        onSaveSnippet() {
            // console.log(this.snippetToSave);
            // return
            if(this.formIsValid) {
                this.$store.dispatch('changeSnippet', this.snippetToSave)
                EventBus.$on('snippetAdded', ()=>{
                    // this.$router.push('/')
                    this.editMode = false
                })                
            }
        },

        cancelChanges() {
            // this.$router.push('/')
            this.updateData()
            this.editMode = false
        },

        setLanguage(selected) {             
            this.cmOptions.mode = selected                                   
            this.editedLanguage = selected                            
        },

        addLabel() {
            if(this.tempLabel == '') {
                        return
                    }
                    let flag = false
                    this.textTags.forEach(elem => {
                        if(elem.title == this.tempLabel) {
                            flag = true
                        }
                    })

                    if(!flag) {
                        this.textTags.push({title:this.tempLabel, show:true})
                        this.cleanTextTags.push(this.tempLabel)
                        this.tempLabel = '';    
                    }                                 
                    
        },
        removeLabel(label) {
            this.textTags = this.textTags.filter((elem) => {
                if(elem.title != label) {
                    return elem
                }
            })
            this.cleanTextTags.splice(this.cleanTextTags.indexOf(label),1)
        },

        updateData() {
                if(!this.snippet.id) {
                    this.$router.push('/snippets')
                    return
                }
                
             this.editedTitle=this.snippet.title
            this.editedCode=this.snippet.code
            this.editedLanguage= this.snippet.languageCode 


            this.cmOptions.mode = this.snippet.languageCode     
            this.colorLabels = this.snippet.colorTags      
            
            this.textTags = []

            this.snippet.textTags.forEach((tag) => {
                this.textTags.push({
                    title: tag,
                    show: true
                })

                this.cleanTextTags.push(tag)
            })      



        }
    },
    watch: {
        editMode(val) {
            this.cmOptions.lineNumbers = val
            this.cmOptions.readOnly = !val
        },

        snippet(val) {
            if (Object.values(val).length == 0) {
                this.$router.push('/snippets')
            }
            
            
        }
    },

    created() {
         this.updateData()

        EventBus.$on('snippetAdded', (val)=>{
                    if(val == undefined)
                    this.$router.push('/snippets')
        })    


        setTimeout(()=> {
            this.showControlBtns = true
        },400)  
    }
}
</script>


<style scoped>    

    .disabledSwitch {        
        pointer-events:none;
    }
</style>
