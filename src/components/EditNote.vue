<template>
 <div 
  :style="inlineStyle"
  class="edit-note-container">
  <form>
    <input 
      type="text"
      class="form-text"
      v-model="currentNote.title"
    >    
    <textarea 
      cols="30" 
      rows="4"
      v-model="currentNote.note"
      class="textarea"></textarea>
      <button type="button" class="btn btn-primary" @click="saveNote">Save</button>
      <button type="button" class="btn btn-secondary" @click="$store.commit('SET_MODAL', false)">Cancel</button>
  </form>
 </div>
</template>

<script lang="ts">
import { computed, defineComponent } from "vue";
import useDeriveKey from '@/use/deriveKey'
import useGetNoteKey from '@/use/getNoteKey'
import useBuffBase from '@/use/base64Convertion'
import useEncryption from '@/use/encryption'
import { store } from "@/store"
import { NoteState } from 'types'
export default defineComponent({
  name: "EditNote",

  setup() {
    const { deriveKey } =  useDeriveKey()
    const { getNoteKey } = useGetNoteKey()
    const { buff_to_base64 } = useBuffBase()
    const { encryptNote } = useEncryption(deriveKey, getNoteKey, buff_to_base64)

    const {     
      inlineStyle,
      currentNote,
      saveNote } = useUpdateNote(encryptNote)

    return {
      inlineStyle,
      currentNote,
      saveNote
    }
  }
})

function useUpdateNote(encryptNote: any) {

  const currentNote = computed(() : NoteState => {
    return store.state.note
  })

  const inlineStyle = computed(() : Record<string, unknown> => {
    return store.state.inlineStyle
  })

  const saveNote = async () : Promise<void> => {
    const { title, note, id } = currentNote.value
    if (title === '' && note === '') return
    
   const encryptedData = await encryptNote({ title, note }, store.state.user.uid)
   await store.dispatch('UpdateNote', { encryptedData, id })
  }

  return {
    inlineStyle,
    currentNote,
    saveNote
  }
}
</script>
