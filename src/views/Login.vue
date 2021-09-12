<template>
  <div class="container">
    <h1 class="page-title">{{ $route.name }}</h1>

    <div class="login-container account-form">
      <form @submit.prevent="onLogin">
        <ul v-if="$store.state.serverError.length > 0" class="errorMsg">
          <li v-for="(error, index) in $store.state.serverError" :key="index">{{error}}</li>
        </ul>
        <ol class="form-elements">
          <li class="form-item">
            <label for="note">Email</label>
            <input 
              type="email"
              placeholder="Enter your email"
              class="form-text"
              :class="{error : isValid('email')}"
              v-model.trim="email"
            >
          <span v-if="isValid('email')" class="invalid-feedback">Field required</span>
          </li>
          <li class="form-item">
            <label for="note">Password</label>
            <input 
              type="password"
              placeholder="Enter your password"
              class="form-text"
              :class="{error : isValid('password')}"
              v-model.trim="password"
            >
          <span v-if="isValid('password')" class="invalid-feedback">Field required</span>
          </li>  
          <li class="form-item">
            <button type="submit" class="btn btn-primary block">Login</button>
            <p class="helper"> Don't have an account? <router-link to="/register">Register Account </router-link></p>
          </li>      
        </ol>
      </form>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, ref, toRefs } from "vue";
import { store } from "@/store";
import { useRouter } from 'vue-router'
import useOnValidateFields from '@/use/validation'
export default defineComponent({
  name: "Register",
  setup() {
    const {     
      user,
      errors,
      onLogin 
    } = useRegisterUser()
    
    const { isValid } = useOnValidateFields(errors)

    return {
      ...toRefs(user),
      isValid,
      onLogin
    }
  }
});

function useRegisterUser() {
  const router = useRouter()   
  const user = reactive({
    email: '',
    password: ''
  }) as any

  const errors = ref<Array<string>>([])  

  const onLogin = async ()  => {
    errors.value = []

    Object.keys(user).map((field: string) => {
      try {
        if (user[field] === '') throw `${field}`
      } catch (error) {
        errors.value.push(error)
      }
    })

    const isValidated = !(errors.value.length > 0)

    if (isValidated) {
      store.dispatch('LogInAccount', user).then(() => {
        router.push('/notes')  
      }).catch(error => console.log(error))
    }    
  }

  return {
    user,
    errors,
    onLogin
  }
}
</script>
