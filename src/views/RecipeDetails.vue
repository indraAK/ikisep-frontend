<script setup>
import { useRoute } from 'vue-router'
import { useFetch } from '@vueuse/core'
import Navbar from "@/components/Navbar.vue"
import Spinner from "@/components/Spinner.vue"

const { params: { id } } = useRoute()
const { isFetching, error, data } = useFetch(`${import.meta.env.VITE_API_URL}/recipes/${id}`).get().json()
</script>

<template>
  <Navbar />
  <main class="container max-w-5xl mx-auto px-4 mt-10 mb-12">
    <div v-if="isFetching">
      <Spinner />
    </div>

    <div v-if="error" class="text-red-500 text-base">{{error}}</div>

    <section v-if="data">
      <img :src="data.data.image_url" alt=""
        class="w-full aspect-video rounded-lg drop-shadow-md object-cover md:aspect-[16/8]">
      <h1 class="mt-6 text-2xl font-bold">{{data.data.nama_resep}}</h1>
      <time class="text-slate-400 mt-2 inline-block text-sm">{{new Intl.DateTimeFormat('id', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
      }).format(new Date(data.data.created_at))}}</time>
      <!-- <p class="text-sm text-slate-500 mt-4">Oleh Monica Milanisti</p> -->
      <div class="mt-8 flex flex-col sm:flex-row gap-4">
        <div class="flex items-center gap-2 text-slate-600 bg-slate-100 px-6 py-3 rounded-md">
          <span>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
              <path fill="none" d="M0 0h24v24H0z" />
              <path
                d="M12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10zm0-2a8 8 0 1 0 0-16 8 8 0 0 0 0 16zm1-8h4v2h-6V7h2v5z"
                fill="currentColor" />
            </svg>
          </span>
          <p>{{data.data.waktu_pembuatan}}</p>
        </div>
        <div class="flex items-center gap-2 text-slate-600 bg-slate-100 px-6 py-3 rounded-md">
          <span>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
              <path fill="none" d="M0 0h24v24H0z" />
              <path d="M2 13h6v8H2v-8zm14-5h6v13h-6V8zM9 3h6v18H9V3zM4 15v4h2v-4H4zm7-10v14h2V5h-2zm7 5v9h2v-9h-2z"
                fill="currentColor" />
            </svg>
          </span>
          <p>{{data.data.tingkat_kesulitan}}</p>
        </div>
        <div class="flex items-center gap-2 text-slate-600 bg-slate-100 px-6 py-3 rounded-md">
          <span>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
              <path fill="none" d="M0 0h24v24H0z" />
              <path
                d="M4.342 1.408L22.373 19.44a1.5 1.5 0 0 1-2.121 2.122l-4.596-4.597L12.12 20.5l-7.778-7.778a8 8 0 0 1-.174-11.135l.174-.179zm.241 3.07l-.051.11a6.005 6.005 0 0 0 1.047 6.535l.177.185 6.363 6.363 2.829-2.828L4.583 4.478z"
                fill="currentColor" />
            </svg>
          </span>
          <p>{{data.data.porsi}}</p>
        </div>
      </div>

      <!-- Bahan yg dibutuhkan -->
      <h2 class="mt-8 text-xl font-bold text-slate-900">Bahan yang Dibutuhkan</h2>
      <ul class="mt-3">
        <li v-for="item in data.data.bahan.split(/[\r\n]+/)" class="mt-1">{{item}}</li>
      </ul>

      <!-- Cara memasak -->
      <h2 class="mt-8 text-xl font-bold text-slate-900">Cara Memasak</h2>
      <ul class="mt-3">
        <li v-for="item in data.data.cara_masak.split(/[\r\n]+/)" class="mt-1">{{item}}</li>
      </ul>
    </section>
  </main>
</template>