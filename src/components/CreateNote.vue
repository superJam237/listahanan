<template>
  <div class="note create-new-note">
    <div class="create-note">
      <form v-show="isAddNote" @submit.prevent="addNote">
        <ol class="form-elements">
          <li class="form-item">
            <label for="note-title">Title</label>
            <input 
              type="text"
              placeholder="Enter note title"
              class="form-text"
              :class="{error : isValid('title')}"
              v-model.trim="title"
            >
            <span v-if="isValid('title')" class="invalid-feedback">Field required</span>
          </li>
          <li class="form-item">
            <label for="note">Note</label>
              <textarea
                style="height: 120px;"
                class="form-textarea"
                :class="{error : isValid('note')}"
                v-model="note">
              </textarea>
              <span v-if="isValid('note')" class="invalid-feedback">Field required</span>
          </li>
        </ol>
        <div class="create-note-form-action-buttons">
          <button type="submit" class="btn btn-primary">Save</button>
          <button type="button" class="btn btn-secondary" @click="onCancel">Cancel</button>
        </div>
      </form>
      <a 
        v-show="isHideText"
        href="#" 
        class="add-note-link"
        @click="showForm"
      ><i class="fas fa-plus"></i> Add Note</a>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, reactive, ref, toRefs } from "vue";
import { store } from "@/store"
import useOnValidateFields from '@/use/validation'
import useDeriveKey from '@/use/deriveKey'
import useGetNoteKey from '@/use/getNoteKey'
import useBuffBase from '@/use/base64Convertion'
import useEncryption from '@/use/encryption'
export default defineComponent({
  name: 'CreateNote',
  setup() {
    const { getNoteKey } = useGetNoteKey()
    const { deriveKey } = useDeriveKey()
    const { buff_to_base64 } = useBuffBase()    
    const { encryptNote } = useEncryption(deriveKey, getNoteKey, buff_to_base64)

    const {
      isAddNote,
      isHideText,
      data,
      errors,
      showForm,
      onCancel,
      addNote
    } = useComposeNote(encryptNote)

    const { isValid } = useOnValidateFields(errors)

    return {
      isAddNote,
      isHideText,
      data,
      isValid,
      showForm,
      onCancel,
      addNote,
      ...toRefs(data)
    }
  }
})

function useComposeNote(encryptNote: any) {
  const isAddNote = ref<boolean>(false)
  const isHideText = ref<boolean>(true)
  const errors = ref<Array<string>>([])  
  const data = reactive({
    title: '',
    note: ''
  }) as any

  const showForm = () : void => {
    isAddNote.value = true
    isHideText.value = false
  }

  const onCancel = () : void => {
    isAddNote.value = false
    isHideText.value = true
    errors.value = []
  }

  const addNote = async() : Promise<void> => {
    errors.value = []

    Object.keys(data).map((field: string) => {
      try {
        if (data[field] === '') throw `${field}`
      } catch (error) {
        errors.value.push(error)
      }
    })

    const isValidated = !(errors.value.length > 0)

    if (isValidated) {
      const encryptedData = await encryptNote(data, store.state.user.uid)
      store.dispatch('CreateNote', encryptedData)
      data.title = ''
      data.note = ''
    }
  }


  return {
    isAddNote,
    isHideText,
    showForm,
    onCancel,
    addNote,
    data,
    errors
  }
}
</script>