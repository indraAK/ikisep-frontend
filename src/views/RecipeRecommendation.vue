<script setup>
import { useFetch } from '@vueuse/core'
import Navbar from "@/components/Navbar.vue"
import Spinner from "@/components/Spinner.vue"
import RecipeCard from "@/components/RecipeCard.vue"

const { isFetching, data, error } = useFetch(`${import.meta.env.VITE_API_URL}/recipes/recommendation`).get().json();
</script>

<template>
  <Navbar />
  <main class="container mx-auto px-4 pt-6 pb-12">
    <h1 class="text-xl text-slate-800 font-semibold">Rekomendasi Resep dari ikiSep</h1>

    <Spinner v-if="isFetching" class="mt-6" />

    <p v-if="error" class="mt-6">{{ error }}</p>

    <div v-if="data" class="grid gap-5 md:grid-cols-2 xl:grid-cols-4 mt-6">
      <RecipeCard v-for="recipe in data.data" :key="recipe.id" :recipe="recipe" />
    </div>
  </main>
</template>