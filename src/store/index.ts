import { InjectionKey } from 'vue'
import { createStore, useStore as baseUseStore, Store } from 'vuex'
import { NoteState, UserState } from 'types'
import axios from 'axios'
import router from '@/router'
export interface State {
  isLoading: boolean,
  isLogedIn: boolean,
  isShowModal: boolean,
  notes: Array<NoteState>,
  inlineStyle: any,
  note: any,
  layout: string,
  formattedNotes: Array<NoteState>,
  user: UserState,
  serverError: Array<string>
}

export const key: InjectionKey<Store<State>> = Symbol()

export const store = createStore<State>({
  state: {
    isLoading: false,
    isLogedIn: false,
    isShowModal: false,
    notes: [],
    inlineStyle: {},
    note: {},
    layout: '',
    formattedNotes: [],
    user: {},
    serverError: []
  },
  mutations: {
    SET_LOADING: (state, payload) => (state.isLoading = payload),
    SET_MODAL: (state, payload) => (state.isShowModal = payload),
    SET_NOTES: (state, payload) => (state.notes = payload),
    SET_STYLE: (state, payload) => (state.inlineStyle = payload),
    SET_NOTE: (state, payload) => (state.note = payload),
    SET_LAYOUT: (state, payload) => (state.layout = payload),
    SET_INVOKE: (state, payload) => (state.formattedNotes = payload),
    SET_USER: (state, userData) => {
      const { data } = userData
      state.user = data
      state.isLogedIn = true
      localStorage.setItem('user', JSON.stringify(data))
      axios.defaults.headers.common['Authorization'] = `Bearer ${data.token}`
    },
    SET_USER_DATA: (state, userData) => {
      state.user = userData
      state.isLogedIn = true
      localStorage.setItem('user', JSON.stringify(userData))
      axios.defaults.headers.common['Authorization'] = `Bearer ${userData.token}`
    },
    CLEAR_USER_DATA (state) {
      state.notes = []
      localStorage.removeItem('user')
      location.reload()
      router.push('/login')
    },
    SET_ERROR: (state, payload) => state.serverError.push(payload)
  },
  actions: {
    async CreateAccount({ commit }, credentials) {
      credentials.createdAt = new Date()

      try {
        const data = await axios.post('//localhost:3002/register', credentials)
        commit('SET_USER', data)
      } catch (error: any) {
        if (error.response) {
          commit('SET_ERROR', error.response.data.error)
        }
      }
    },
    async LogInAccount({ commit }, credentials) {
      try {
        const response = await axios.post('//localhost:3002/login', credentials)
        commit('SET_USER', response)
      } catch (error: any) {
        if (error.response) {
          commit('SET_ERROR', error.response.data.error)
        }
      }
    },
    async CreateNote({ state, commit }, note) {
      commit('SET_LOADING', true)
      
      const formattedNotes = {
        encrypted: note,
        authorId: state.user.uid,
        createdAt: new Date(),
        isEdited: false
      }

      try {
        const notes = await axios.post('//localhost:3000/notes', formattedNotes)
        const newNotes = [...state.notes, notes.data]
        commit('SET_NOTES', newNotes)
      } catch (error) {
        console.log(error)
      }
    },
    async GetNotes({ state, commit }) {
      try {
       const response = await axios.get('//localhost:3000/notes?authorId=' + state.user.uid)    
       commit('SET_NOTES', response.data)
      } catch (error) {
        console.log(error)
      }
    },
    async UpdateNote({ commit }, payload)  {
      commit('SET_LOADING', true)

      const { encryptedData, id } = payload

      const newData = {
        encrypted: encryptedData,
        isEdited: true,
        updatedAt: new Date()
      }
      
      try {
        await axios.patch('//localhost:3000/notes/' + id, newData)
        commit('SET_MODAL', false)
      } catch (error) {
        console.error(error)
      }
    },
    LogOut({ commit }) {
      commit('CLEAR_USER_DATA')
    },    
  }
})


// define your own `useStore` composition function
export function useStore () {
  return baseUseStore(key)
}