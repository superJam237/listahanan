<template>
  <div class="overlay" v-if="isShow">
    <EditNote v-if="isShow" />
  </div>
</template>

<script lang="ts">
import { computed, defineComponent } from "vue";
import useDeriveKey from '@/use/deriveKey'
import useGetNoteKey from '@/use/getNoteKey'
import EditNote from '@/components/EditNote.vue'
import { NoteState } from 'types'
import { store } from "@/store"
export default defineComponent({
  name: "Modal",
  components: { EditNote },
  setup() {
    const { deriveKey } = useDeriveKey()
    const { getNoteKey } = useGetNoteKey()
    const { isShow } = useShowModal()

    return {
      isShow
    }
  }
})
function useShowModal() {
  const isShow = computed(() : boolean => {
    return store.state.isShowModal
  })

  return {
    isShow
  }
}
</script>