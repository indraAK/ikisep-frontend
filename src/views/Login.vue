<script setup>
import { ref } from "vue";
import { RouterLink } from "vue-router"
import router from "../router";

const username = ref('')
const password = ref('')
const isLoading = ref(false)

const handleLogin = async () => {
  isLoading.value = true

  try {
    const res = await fetch(`${import.meta.env.VITE_API_URL}/login/${username.value}/${password.value}`)
    if (!res.ok) throw new Error('Login gagal')
    const json = await res.json();
    json?.data && router.push('/')
  } catch (error) {
    console.log(error.message)
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <section class="container mx-auto px-4 mt-12">
    <form @submit.prevent="handleLogin" class="bg-white px-6 py-8 shadow-lg rounded-lg max-w-md mx-auto">
      <h2 class="text-2xl text-slate-800 font-bold mb-4">Masuk</h2>
      <div class="form-control w-full">
        <label class="label">Email</label>
        <input v-model="username" type="text" placeholder="Masukkan username" class="input input-bordered w-full" />
      </div>
      <div class="form-control w-full mt-3">
        <label class="label">Password</label>
        <input v-model="password" type="password" placeholder="Masukkan password" class="input input-bordered w-full" />
      </div>
      <button :disabled="isLoading" class="btn btn-primary mt-6 w-full" type="submit">Login</button>
      <div class="text-center mt-6">
        <p class="text-sm">Belum punya akun? <RouterLink to="/register" class="text-green-primary font-medium">Daftar
            Sekarang</RouterLink>
        </p>
      </div>
    </form>
  </section>
</template>