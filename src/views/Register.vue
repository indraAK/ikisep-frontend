<script setup>
import { ref } from "vue";
import { RouterLink } from "vue-router"
import router from "../router";
import Navbar from "@/components/Navbar.vue"

const username = ref('')
const email = ref('')
const password = ref('')
const confirm_password = ref('')

const handleSubmit = async () => {
  if (password.value.trim() === "") {
    alert('Password tidak boleh kosong')
    return
  }

  if (confirm_password.value !== password.value) {
    alert('password konfirmasi tidak sama')
    return
  }

  try {
    const res = await fetch(`${import.meta.env.VITE_API_URL}/users`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json;charset=UTF-8'
      },
      body: JSON.stringify({
        username: username.value,
        email: email.value,
        password: password.value,
        role: 'user'
      })
    })

    if (!res.ok) throw new Error(res.statusText)

    router.push('/')
  } catch (err) {
    console.log(err.message)
  }
}
</script>

<template>
  <Navbar />
  <section class="container mx-auto px-4 mt-12 pb-6">
    <form @submit.prevent="handleSubmit" class="card px-6 py-8 shadow-lg rounded-lg max-w-md mx-auto">
      <h2 class="text-2xl text-slate-800 font-bold mb-4" data-testid="form-title">Daftar</h2>
      <div class="form-control w-full">
        <label class="label">Username</label>
        <input v-model="username" type="text" placeholder="Masukkan Username" class="input input-bordered w-full"
          data-testid="username" />
      </div>
      <div class="form-control w-full">
        <label class="label">Email</label>
        <input v-model="email" type="email" placeholder="Masukkan email" class="input input-bordered w-full"
          data-testid="email" />
      </div>
      <div class="form-control w-full mt-3">
        <label class="label">Password</label>
        <input v-model="password" type="password" placeholder="Masukkan password" class="input input-bordered w-full"
          data-testid="password" />
      </div>
      <div class="form-control w-full mt-3">
        <label class="label">Konfirmasi Password</label>
        <input v-model="confirm_password" type="password" placeholder="Masukkan ulang password"
          class="input input-bordered w-full" data-testid="confirm-password" />
      </div>
      <button class="btn btn-primary mt-6 w-full" type="submit" data-testid="daftar">Daftar</button>
      <div class="text-center mt-6">
        <p class="text-sm">Sudah punya akun? <RouterLink to="/login" class="text-green-primary font-medium">Masuk
          </RouterLink>
        </p>
      </div>
    </form>
  </section>
</template>