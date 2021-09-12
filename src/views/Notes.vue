<template>
  <div class="container">
      <h1 class="page-title">{{ $route.name }}</h1>
      <NotesList />
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, onMounted, reactive, ref, toRefs, watchEffect } from "vue";
import axios from "axios";
import NotesList from '@/components/NoteList.vue'
import { store } from "@/store";
export default defineComponent({
  name: "Notes",
  components: { NotesList },
  setup() {
    watchEffect(async () => {
      const userString = localStorage.getItem('user')
      
      if (userString) {
        const userData = JSON.parse(userString)
        store.commit('SET_USER_DATA', userData)
      }

      axios.interceptors.response.use(
        response => response,
        error => {
          if (error.response.status === 401) {
            store.dispatch('logout')
          }
          return Promise.reject(error)
        }
      )  

      await store.dispatch('GetNotes')
      
    })
  }
});

</script>
