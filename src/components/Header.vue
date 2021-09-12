<template>
  <header class="header-bar">
    <div class="header-bar-title app-title">
     <h1>Listahanan</h1>
    </div>
    <div class="header-bar-nav" v-if="$store.state.isLogedIn">
      <div class="orientation">
        <span @click="layout('grid')" class="fa fa-th fa-md"></span>
        <span @click="layout('stackable')" class="fa fa-th-list fa-md"></span>
      </div>
      <div class="profile">
        <span class="user">Hello, {{profile.name}}</span>
        <div class="avatar">
          <span v-text="profile.name ? acronym : ''"></span>
          <div class="dropdown">
            <a href="" @click="$store.dispatch('LogOut')">Logout</a>
          </div>
        </div>
      </div>
    </div>
  </header>
</template>

<script lang="ts">
import {  computed, defineComponent, ref } from "vue";
import { store } from "@/store"
import { NoteState, UserState } from 'types'
export default defineComponent({
  name: "Header",
  setup() {

    const layout = (mode: string) : void => {
     const display = (mode === 'stackable' ? 'stack' : '')
     store.commit('SET_LAYOUT', display)
    }

    const { profile, acronym } = useCurrentUser()

    return {
      layout,
      profile, 
      acronym
    }
  }
})

function useCurrentUser() {
  const profile = computed((): UserState => {
    return store.state.user
  })

  const acronym = computed((): any => {
    const matches = profile.value.name?.match(/\b(\w)/g)
    return matches?.join('')
  })

  return {
    profile,
    acronym
  }
}
</script>
