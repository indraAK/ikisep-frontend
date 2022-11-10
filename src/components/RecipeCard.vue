<script setup>
defineProps(['recipe'])
</script>

<template>
  <div class="px-3 pt-3 pb-6 bg-white shadow-md rounded border border-slate-100 relative">
    <img :src="recipe.image_url" :alt="recipe.nama_resep"
      class="w-full rounded drop-shadow aspect-video md:h-[250px] xl:h-[220px] object-cover">
    <div class="px-2 mt-3">
      <RouterLink :to="{ name: 'recipeDetail', params: { id: recipe.id } }"
        class="text-xl text-slate-800 font-bold hover:text-green-primary" :data-recipe-id="recipe.id">{{
            recipe.nama_resep
        }}</RouterLink>
      <!-- <p class="text-slate-500 text-[13px] mt-2"></p> -->
      <div class="flex items-center gap-3 mt-6">
        <div class="flex items-center gap-1.5 text-slate-500">
          <span>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
              stroke="currentColor" class="w-5 h-5">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </span>
          <p class="text-sm">{{ recipe.waktu_pembuatan }}</p>
        </div>
        <div class="flex items-center gap-1.5 text-slate-500">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
            stroke="currentColor" class="w-5 h-5">
            <path stroke-linecap="round" stroke-linejoin="round"
              d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
          </svg>
          <p class="text-sm">{{ recipe.tingkat_kesulitan }}</p>
        </div>
      </div>
    </div>
    <slot name="action-menu"></slot>
  </div>
</template>