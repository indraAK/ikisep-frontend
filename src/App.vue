<script setup>
import { RouterLink, RouterView } from 'vue-router'
</script>

<template>
  <header class="py-3.5 bg-white shadow sticky top-0 z-[1000]">
    <nav class="container mx-auto px-4 flex items-center justify-between gap-3">
      <RouterLink to="/" class="flex items-center gap-1">
        <img alt="ikiSep Logo" src="@/assets/logo.svg" width="35" height="35" />
        <span class="text-gray-800 font-bold text-xl">ikiSep</span>
      </RouterLink>
      <div class="flex justify-end items-center gap-6">
        <ul class="flex items-center gap-6 [&>li>a:hover]:text-red-500 text-sm">
          <li>
            <RouterLink to="/" class="font-medium text-red-500">Home</RouterLink>
          </li>
          <li>
            <RouterLink to="/">Rekomendasi</RouterLink>
          </li>
          <li>
            <RouterLink to="/">Event</RouterLink>
          </li>
        </ul>
        <div class="flex gap-2 items-center">
          <RouterLink to="/login"
            class="inline-flex items-center justify-center align-middle whitespace-nowrap px-6 py-2 bg-gray-100 text-gray-900 font-medium text-base rounded hover:bg-gray-200">
            Masuk</RouterLink>
          <RouterLink to="/register"
            class="inline-flex items-center justify-center align-middle whitespace-nowrap px-6 py-2 bg-green-primary text-white font-medium text-base rounded hover:bg-green-primary/90">
            Daftar</RouterLink>
        </div>
      </div>
    </nav>
  </header>

  <RouterView />
</template>
