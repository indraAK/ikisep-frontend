<script setup>
import { RouterLink } from 'vue-router'
import { useUserStore } from "@/stores/user"
import router from '../router';

const { user, setUser } = useUserStore();

const handleLogout = () => {
  localStorage.removeItem('ikisepUser')
  setUser(null)
  router.push('/login')
}
</script>

<template>
  <header class="py-3.5 bg-white shadow sticky top-0 z-[1000]">
    <nav class="container mx-auto px-4 flex items-center gap-x-4">
      <RouterLink to="/" class="flex items-center gap-1">
        <img alt="ikiSep Logo" src="@/assets/logo.svg" width="35" height="35" />
        <span class="text-gray-800 font-bold text-xl">ikiSep</span>
      </RouterLink>

      <!-- Slot Content Form Pencarian Resep -->
      <slot name="search-bar" />

      <div class="flex justify-end items-center gap-6 ml-auto">
        <ul class="flex items-center gap-6 [&>li>a:hover]:text-red-500 text-sm">
          <li>
            <RouterLink to="/" exact-active-class="font-medium text-red-500" active-class="font-medium text-red-500">
              Home</RouterLink>
          </li>
          <li>
            <RouterLink :to="{ name: 'recipeRecommendation' }" active-class="font-medium text-red-500">Rekomendasi
            </RouterLink>
          </li>
          <li>
            <RouterLink to="/events" active-class="font-medium text-red-500">Event</RouterLink>
          </li>
        </ul>
        <!-- Jika user sudah login -->
        <div v-if="user">
          <div class="dropdown dropdown-end">
            <label tabindex="0" class="cursor-pointer text-slate-700 flex items-center gap-1">
              Hello, <span class="text-slate-800 font-semibold">{{ user.username }}</span> <span><svg
                  xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                  stroke="currentColor" class="w-4 h-4">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                </svg></span>
            </label>
            <ul tabindex="0" class="mt-3 p-2 shadow menu menu-compact dropdown-content bg-base-100 rounded-box w-52">
              <li>
                <RouterLink to="/my-recipes">Resep Saya</RouterLink>
              </li>
              <li>
                <RouterLink to="/recipes/new">Buat Resep</RouterLink>
              </li>
              <li><a @click.prevent="handleLogout">Keluar</a></li>
            </ul>
          </div>
        </div>
        <!-- user belum login -->
        <div v-else class="flex gap-2 items-center">
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
</template>