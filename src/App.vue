<template>
  <Header />
  <Nav />
  <Main />
  <teleport to="#modal-container">
    <Modal />
  </teleport>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import Header from '@/components/Header.vue'
import Nav from '@/components/Nav.vue'
import Main from '@/components/Main.vue'
import Modal from '@/components/Modal.vue'
import { store } from "./store";
import axios from "axios";
export default defineComponent({
  components: {
    Header,
    Nav,
    Main,
    Modal
  },
})

</script>
