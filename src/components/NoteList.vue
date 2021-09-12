<template>
  <div 
    :class="'notes ' + $store.state.layout">
    <div
      v-for="(note, index) in notes"
      :key="index"
      class="note"
    >
      <div class="note-title">
        <h3 class="name">{{note.title}}</h3>
        <span class="date">{{note.formattedDate}}</span>
        <div class="card panel-description">
          <p>{{note.note}}</p>
          <span class="icon-edit fas fa-pen" @click="editNote($event, note)"></span>
        </div>
      </div>
    </div>
    <CreateNote />    
    <!-- <pre>{{newNotes}}</pre>   -->
  </div>
</template>

<script lang="ts">
import { defineComponent, watchEffect, ref, onMounted, computed, onUpdated } from "vue";
import useDeriveKey from '@/use/deriveKey'
import useGetNoteKey from '@/use/getNoteKey'
import CreateNote from '@/components/CreateNote.vue'
import { NoteState } from 'types'
import { store } from "@/store"
import moment from 'moment'
export default defineComponent({
  name: "NoteList",
  components: { CreateNote },
  setup() {
    const { deriveKey } = useDeriveKey()
    const { getNoteKey } = useGetNoteKey()
    const { notes, newNotes } = useFetchNotes(deriveKey, getNoteKey, moment)
    const { editNote, isShow } = useEditNote()

    return {
      notes,
      newNotes,
      editNote,
      isShow
    }
  }
});

function useFetchNotes(deriveKey: any, getNoteKey: any, moment: any) {
  const notes = ref<Array<NoteState>>([])
  
  const newNotes = computed(() => {
    return store.state.notes
  })

  const base64_to_buf = (b64: any) => Uint8Array.from(atob(b64), (c: any) => c.charCodeAt(null))

  const decryptData = async () => {
    try {   
      return newNotes.value.map(async (note: NoteState) => {
        const { id, createdAt, encrypted, isEdited, authorId } = note
        const encryptedDataBuff = base64_to_buf(encrypted)
        const salt = encryptedDataBuff.slice(0, 16)
        const iv = encryptedDataBuff.slice(16, 16 + 12)
        const data = encryptedDataBuff.slice(16 + 12)
        const passwordKey = await getNoteKey(store.state.user.uid);
        const aesKey = await deriveKey(passwordKey, salt, ["decrypt"]);
        const decryptedContent = await window.crypto.subtle.decrypt(
          {
            name: "AES-GCM",
            iv,
          },
          aesKey,
          data
        )

        const decoded = new TextDecoder().decode(decryptedContent)
        const notesObj = JSON.parse(decoded)
        const formattedDate = moment(createdAt).fromNow()
        notes.value.push({...notesObj, id, formattedDate, isEdited, authorId })
      })

    } catch (error) {
      console.log(`Error - ${error}`);
    }
  }



  const stop = watchEffect(async() => {
    await decryptData()
  })

  // onUpdated(() => stop())

  return {
    notes,
    newNotes
  }
}

function useEditNote() {
  const isShow = ref<any>(null)

  const editNote = (e: any, note: NoteState )  => {
    store.commit('SET_MODAL', true)
    const { x, y } = e.target.getBoundingClientRect()
    const offsetLeft = e.srcElement.offsetLeft
    const offsetWidth = e.srcElement.offsetWidth

    const style = {
      left: (x - offsetLeft) + 'px',
      top: Math.floor(y) + 'px',
      width: (offsetLeft + offsetWidth) + 'px',
      position: 'absolute'
    }

    store.commit('SET_STYLE', style)
    store.commit('SET_NOTE', note)
  }

  return {
    editNote,
    isShow
  }
}
</script>
