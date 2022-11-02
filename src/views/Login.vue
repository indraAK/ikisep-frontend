<script setup>
import { reactive, ref } from "vue";
import { RouterLink } from "vue-router"
import router from "../router";
import Navbar from "@/components/Navbar.vue"
import { useFetch } from "@vueuse/core"
import { useUserStore } from "@/stores/user"

const { setUser } = useUserStore()
const username = ref('')
const password = ref('')
const payload = reactive({ username: '', password: '' })
const { isFetching, data, execute: login } = useFetch(`${import.meta.env.VITE_API_URL}/auth/login`, { immediate: false }).post(payload, 'json').json()

const handleLogin = async () => {
  payload.username = username.value
  payload.password = password.value;

  await login()

  if (data.value?.data) {
    const { id, username } = data.value?.data
    localStorage.setItem('ikisepUser', JSON.stringify({ id, username }))
    setUser({ id, username })
    router.push('/')
  }
}

</script>

<template>
  <Navbar />
  <section class="container mx-auto px-4 mt-12 pb-6">
    <form @submit.prevent="handleLogin" class="card px-6 py-8 shadow-lg rounded-lg max-w-md mx-auto">
      <h2 class="text-2xl text-slate-800 font-bold mb-4" data-testid="form-title">Masuk</h2>
      <div class="form-control w-full">
        <label class="label">Username</label>
        <input v-model="username" type="text" placeholder="Masukkan username" class="input input-bordered w-full"
          data-testid="username" />
      </div>
      <div class="form-control w-full mt-3">
        <label class="label">Password</label>
        <input v-model="password" type="password" placeholder="Masukkan password" class="input input-bordered w-full"
          data-testid="password" />
      </div>
      <button :disabled="isFetching" class="btn btn-primary mt-6 w-full" type="submit"
        data-testid="login">Login</button>
      <div class="text-center mt-6">
        <p class="text-sm">Belum punya akun? <RouterLink to="/register" class="text-green-primary font-medium">Daftar
            Sekarang</RouterLink>
        </p>
      </div>
    </form>
  </section>
</template>