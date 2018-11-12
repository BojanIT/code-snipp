import Vue from 'vue'
import Vuex from 'vuex'
import { EventBus } from '@/helpers/event-bus'

import * as firebase from 'firebase'
import { stat } from 'fs';

Vue.use(Vuex)

export const store = new Vuex.Store({
  state: {
    loadedSnippets: [
      // {
      //   id: '531as3d51',
      //   userId: '325sad5q',
      //   title: 'Some title 1',
      //   code: 'function boki(val) //sadsadasd asd as asdad  {\n console.log(val)\n}',
      //   languageCode: 'text/x-php',          
      //   colorTags: ['red'],
      //   textTags: ['random integer', 'something'],
      //   date: new Date().toISOString().toLocaleString(['en-US'], { month: 'short', day: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' }),

      // }
    ],
    filteredSnippets: [],
    snippetsAreFiltered: false,
    loading: false,
    error: null,
    user: null
  },
  mutations: {
    clearSnippets(state) {
      state.loadedSnippets = []

      console.log(state.loadedSnippets)

    },

    createSnippet(state, payload) {
      state.loadedSnippets.push(payload)
    },
    setLoading(state, payload) {
      state.loading = payload
    },
    setError(state, payload) {
      state.error = payload
    },
    clearError(state) {
      state.error = null
    },
    changeSnippet(state, payload) {

      let tempArray = []
      state.loadedSnippets.forEach(snippet => {
        if (snippet.id != payload.id) {
          tempArray.push(snippet)
        } else {
          tempArray.push(payload)
        }
      })

      state.loadedSnippets = tempArray

    },

    setUser(state, payload) {
      state.user = payload
      state.loadedSnippets = []
      state.filteredSnippets = []
    },

    setLoadedSnippets(state, payload) {
      state.loadedSnippets = payload
      state.filteredSnippets = payload
    },

    deleteSnippet(state, payload) {

      let id = payload + ''


      firebase.database().ref('snippets').child(id).remove()
        .then((data) => {
          console.log('data deleted');

          let delIndex = -1
          state.loadedSnippets.forEach((snippet, i) => {
            if (snippet.id == payload) {
              delIndex = i
              return
            }
          })

          state.loadedSnippets.splice(delIndex, 1)
        })
        .catch(err => {
          console.log('data deletion error');
          console.log(err);

        })
    },

    resetFilteredSnippets(state) {
      state.filteredSnippets = state.loadedSnippets
      state.snippetsAreFiltered = false      
      EventBus.$emit('filterCLeared')
    },

    filterSnippets(state, payload) { 
      
      let params = payload.split(",") //ex 'red, SomeTitle, someTextTag, PHP'        

      for (let i = 0; i < params.length; i++) {
        if (params[i].toLowerCase() == 'green') {
          params.push('success')
        } else if (params[i].toLowerCase() == 'blue') {
          params.push('primary')
        } else if (params[i].toLowerCase() == 'yellow') {
          params.push('warning')
        }
      }

      let tempSnippets = state.loadedSnippets
      if(state.snippetsAreFiltered) {
        tempSnippets = state.filteredSnippets
      }
      
      

      if (params.length > 0) {

        let filteredSnippets = []
        for (let i = 0; i < params.length; i++) {

          let trimedParam = params[i].trim()

          tempSnippets.forEach(snippet => {
            if (snippet.title.toLowerCase().includes(trimedParam.toLowerCase()) ||
                // || 
                // snippet.colorTags.includes(trimedParam.toLowerCase()) || 
                snippet.textTags.includes(trimedParam.toLowerCase()) 
                // || 
                // snippet.languageCode.includes(trimedParam)
                ) {
              if (!filteredSnippets.includes(snippet)) {
                filteredSnippets.push(snippet)
              }
            }

          })
        }
        state.filteredSnippets = filteredSnippets

      } else {
        state.filteredSnippets = state.loadedSnippets
      }


    },

    filterSnippetsStrict(state, payload) {
      state.snippetsAreFiltered = true

      let cleanPayload = {}
      for (let obj in payload) {
        if (payload[obj] != "") {
          cleanPayload[obj] = payload[obj]
        }
      }      

      let filteredSnippets = []

      state.loadedSnippets.forEach(snippet => {
        if (cleanPayload.language && !cleanPayload.color && !cleanPayload.textTag) {
          if (cleanPayload.language == snippet.languageCode) {
            if (!filteredSnippets.includes(snippet)) {
              filteredSnippets.push(snippet)
            }
          }
        } else if(cleanPayload.language && cleanPayload.color && !cleanPayload.textTag){
          if (cleanPayload.language == snippet.languageCode && snippet.colorTags.includes(cleanPayload.color)) {
            if (!filteredSnippets.includes(snippet)) {
              filteredSnippets.push(snippet)
            }
          }
        }else if(cleanPayload.language && !cleanPayload.color && cleanPayload.textTag) {
          if (cleanPayload.language == snippet.languageCode && snippet.textTags.includes(cleanPayload.textTag)) {
            if (!filteredSnippets.includes(snippet)) {
              filteredSnippets.push(snippet)
            }
          }
        }else if(cleanPayload.color && !cleanPayload.textTag && !cleanPayload.language) {
          if (snippet.colorTags.includes(cleanPayload.color)) {
            if (!filteredSnippets.includes(snippet)) {
              filteredSnippets.push(snippet)
            }
          }
        }else if(cleanPayload.color && cleanPayload.textTag && !cleanPayload.language) {
          if (snippet.colorTags.includes(cleanPayload.color) && snippet.textTags.includes(cleanPayload.textTag)) {
            if (!filteredSnippets.includes(snippet)) {
              filteredSnippets.push(snippet)
            }
          } 
        } else if(cleanPayload.textTag && !cleanPayload.language && !cleanPayload.color) {
          if (snippet.textTags.includes(cleanPayload.textTag)) {
            if (!filteredSnippets.includes(snippet)) {
              filteredSnippets.push(snippet)
            }
          }
        }

      })

      if(filteredSnippets.length > 0) {
        state.filteredSnippets = filteredSnippets
      }else{
        state.filteredSnippets = []
      }
      
    }

  },
  actions: {
    resetFilteredSnippets({ commit }) {
      commit('resetFilteredSnippets')
    },

    filterSnippetsStrict({ commit }, payload) {


      commit('filterSnippetsStrict', payload)
    },

    filterSnippets({ commit }, payload) {


      let params = payload || ''

      commit('filterSnippets', params)
    },

    deleteSnippet({ commit }, payload) {
      commit('deleteSnippet', payload)
      commit('resetFilteredSnippets')
    },

    logout({ commit }) {
      commit('setUser', null)
      firebase.auth().signOut()
    },

    createSnippet({ commit, getters }, payload) {
      commit('setLoading', true);
      payload.userId = getters.user.uid




      firebase.database().ref('snippets').push(payload)
        .then(data => {
          console.log(data);
          
          let snipp = payload
          snipp.id = data.key

          commit('createSnippet', snipp)
          commit('setLoading', false);

          EventBus.$emit('snippetAdded')


          commit('resetFilteredSnippets')
          // commit('createSnippet',payload)

        })
        .catch(error => {
          console.log(error);

        })

    },

    changeSnippet({ commit, getters }, payload) {
      commit('setLoading', true);
      commit('clearError');


      firebase.database().ref('snippets').child(payload.id).update(payload)
        .then(() => {

          console.log('snippet changed');

          commit('changeSnippet', payload)
          commit('setLoading', false);
          commit('resetFilteredSnippets')
          EventBus.$emit('snippetAdded', 1)
        })
        .catch(error => {
          commit('setLoading', false);
          console.log(error)
        })
    },

    setLoading({ commit }, payload) {
      commit('setLoading', payload)
    },

    setError({ commit }, payload) {
      commit('setError', payload)
    },

    clearError({ commit }) {
      commit('clearError')
    },

    signUserUp({ commit }, payload) {
      commit('setLoading', true);
      commit('clearError');
      firebase.auth().createUserWithEmailAndPassword(payload.email, payload.password)
        .then(
          data => {
            console.log(data);
            
            commit('setLoading', false)

            const userData = {
              uid: data.user.uid,
              email: data.user.email,
              registeredAt: data.user.metadata.creationTime,
              lastSignInAt: data.user.metadata.lastSignInTime
            }
            
            commit('setUser', userData)
          }
        )
        .catch(
          error => {
            commit('setLoading', false)
            commit('setError', error);
          }
        )
    },

    signUserIn({ commit }, payload) {
      commit('setLoading', true);
      firebase.auth().signInWithEmailAndPassword(payload.email, payload.password)
        .then(
          data => {
            console.log(data);
            // uid: data.user.uid,   email: data.user.email,  registered date:data.user.metadata.creationTime, lastSignin: data.user.metadata.lastSignInTime


            commit('setLoading', false);
            commit('clearError');
            const userData = {
              uid: data.user.uid,
              email: data.user.email,
              registeredAt: data.user.metadata.creationTime,
              lastSignInAt: data.user.metadata.lastSignInTime
            }
            
            commit('setUser', userData)
          }
        )
        .catch(error => {
          commit('setLoading', false)
          commit('setError', error);
          console.log(error);

        })
    },

    loadSnippets({ commit, getters }) {
      commit('setLoading', true)
      firebase.database().ref('snippets').once('value')
        .then(
          data => {
            const snippets = []
            const obj = data.val()
            for (let key in obj) {
              let tempKey = key
              if (obj[key].userId == getters.user.uid) {
                let tempSnippet = {
                  id: tempKey,
                  userId: obj[key].userId,
                  title: obj[key].title,
                  code: obj[key].code,
                  languageCode: obj[key].languageCode,
                  date: obj[key].date
                }

                if (obj[key].colorTags) {
                  tempSnippet.colorTags = obj[key].colorTags
                } else {
                  tempSnippet.colorTags = []
                }

                if (obj[key].textTags) {
                  tempSnippet.textTags = obj[key].textTags
                } else {
                  tempSnippet.textTags = []
                }

                snippets.push(tempSnippet)
              }
            }

            commit('setLoadedSnippets', snippets)
            commit('setLoading', false)
          })
        .catch(
          error => {
            console.log(error);
            commit('setLoading', false)
          }
        )
    },
    autoSignin({ commit }, payload) {
      let data = payload
      
      
      const userData = {
        uid: data.uid,
        email: data.email,
        registeredAt: data.metadata.creationTime,
        lastSignInAt: data.metadata.lastSignInTime
      }
      commit('setUser', userData)
    },

    clearSnippets({ commit }) {
      commit('clearSnippets')
    }
  },
  getters: {
    snippetsAreFiltered(state) {
        return state.snippetsAreFiltered
    },

    loadedSnippets(state) {
      return state.loadedSnippets.sort((snippetA, snippetB) => {
        return snippetA.date < snippetB.date
      })
    },

    loadedSnippet(state) {
      return (snippetId) => {
        return state.loadedSnippets.find(snippet => {
          return snippet.id == snippetId
        })
      }
    },

    loading(state) {
      return state.loading
    },

    error(state) {
      return state.error
    },

    user(state) {
      return state.user
    },

    filteredSnippets(state) {

      return state.filteredSnippets

    }
  }
})
