<script setup>
import { RouterLink } from "vue-router"
</script>

<template>
  <main class="min-h-screen container mx-auto px-4 py-6 grid place-content-center">
    <div class="text-center">
      <img src="@/assets/not-found.svg" alt="Not Found Image" class="w-full max-w-xs select-none">
      <h1 class="font-bold text-2xl text-slate-800 mt-8 mb-6">Halaman Tidak Ditemukan!</h1>
      <RouterLink to="/" class="btn capitalize tracking-wider">Ke Halaman Awal</RouterLink>
    </div>
  </main>
</template>