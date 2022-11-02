<script setup>
import { useRoute } from "vue-router"
import { useFetch } from "@vueuse/core"
import Spinner from "@/components/Spinner.vue"
import RecipeCard from "@/components/RecipeCard.vue"
import { ref } from "vue";
import router from "../router"
import Navbar from "@/components/Navbar.vue"

const name = ref(useRoute().query?.name)
const URL = ref(`${import.meta.env.VITE_API_URL}/recipes?name=${name.value}`)
const { isFetching, data, error, isFinished } = useFetch(URL, { refetch: true }).get().json()
const input = ref(null)

const handleSearch = () => {
  if (input.value?.value === "") return

  name.value = input.value?.value
  router.push({ name: 'searchResults', query: { name: name.value } })
  URL.value = `${import.meta.env.VITE_API_URL}/recipes?name=${name.value}`
}
</script>

<template>
  <div>
    <Navbar>
      <template #search-bar>
        <form @submit.prevent="handleSearch" class="flex-1 max-w-[500px]" data-testid="search-form">
          <div class="relative">
            <input :value="name" ref="input" type="text" placeholder="Cari resep..."
              class="w-full p-3 py-2 rounded border border-gray-300 text-slate-700 focus:outline-none focus:ring-2 focus:ring-gray-200 focus:ring-opacity-75"
              data-testid="keyword">
            <span class="block absolute top-1/2 right-3 -translate-y-1/2">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                stroke="currentColor" class="w-6 h-6 text-gray-400">
                <path stroke-linecap="round" stroke-linejoin="round"
                  d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
              </svg>
            </span>
          </div>
        </form>
      </template>
    </Navbar>

    <main class="container mx-auto px-4 py-6">
      <h1 class="text-lg font-medium">Hasil Pencarian Resep <span class="text-green-primary">"{{ name }}"</span></h1>
      <div class="mt-6">
        <div v-if="isFetching">
          <Spinner />
        </div>
        <div v-if="error">
          <p class="text-red-500 text-base"></p>
        </div>
        <div v-if="isFinished">
          <div v-if="data.data" class="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            <RecipeCard v-for="recipe in data.data" :key="recipe.id" :recipe="recipe" />
          </div>
          <div v-else>
            <p class="text-slate-700 font-medium text-lg">Maaf resep yang kamu cari tidak ditemukan!</p>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>