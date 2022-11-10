<script setup>
import Navbar from "@/components/Navbar.vue"
import { ref } from "vue";
import { useFetch } from "@vueuse/core"
import { useUserStore } from "@/stores/user"
import { supabase } from "@/supabase";

const { user } = useUserStore()
const imageFile = ref(null)
const blobImageurl = ref(null)
const formData = ref({
  nama_resep: '',
  image_url: null,
  waktu_pembuatan: '',
  tingkat_kesulitan: '',
  porsi: '',
  bahan: '',
  cara_masak: ''
});

const { isFetching, data, execute: addNewRecipe } = useFetch(`${import.meta.env.VITE_API_URL}/recipes`, { immediate: false }).post(formData.value, 'json').json()

const handleFileChange = (event) => {
  if (event.target.files.length === 0) return;

  imageFile.value = event.target.files[0]
  URL.revokeObjectURL(imageFile.value)
  blobImageurl.value = URL.createObjectURL(imageFile.value)
}

const handleSubmit = async () => {
  isFetching.value = true;

  const { data } = await supabase.storage
    .from('img')
    .upload(`recipe/${Date.now()}-${imageFile.value?.name}`, imageFile.value);

  const { data: { publicUrl } } = await supabase.storage.from('img').getPublicUrl(data.path)

  formData.value.image_url = publicUrl
  formData.value.user_id = user.id;

  await addNewRecipe()
  imageFile.value = null;
  formData.value.nama_resep = ''
  formData.value.image_url = null
  formData.value.waktu_pembuatan = ''
  formData.value.tingkat_kesulitan = ''
  formData.value.porsi = ''
  formData.value.bahan = ''
  formData.value.cara_masak = ''
}
</script>

<template>
  <Navbar />
  <main class="container mx-auto px-4 pt-6 pb-8">
    <h1 class="text-2xl font-bold text-center text-slate-700 mt-3">Buat Resep Versi Kamu</h1>
    <form @submit.prevent="handleSubmit" class="w-full max-w-lg mx-auto mt-6">
      <div class="text-center">
        <div class="bg-slate-100 h-[250px] flex items-center justify-center">
          <label for="image_url" v-if="!imageFile" class="btn capitalize font-medium text-sm h-[40px] min-h-[40px]">
            <input @change="handleFileChange" type="file" name="image_url" id="image_url" class="hidden">
            Upload Foto
          </label>
          <img v-if="imageFile" :src="blobImageurl" alt="Foto Makanan" class="object-cover h-full w-full block" />
        </div>

        <button v-if="imageFile" @click="imageFile = null" class="mt-3" title="Hapus Foto">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
            stroke="currentColor" class="w-6 h-6">
            <path stroke-linecap="round" stroke-linejoin="round"
              d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
          </svg>
        </button>
      </div>

      <div class="mt-4">
        <label for="nama_resep" class="text-slate-700 font-medium text-sm">Nama resep</label>
        <input v-model="formData['nama_resep']" id="nama_resep" type="text" placeholder="Resep apa?"
          class="input input-bordered w-full h-auto py-2.5 block mt-2" />
      </div>

      <div class="mt-4 grid sm:grid-cols-3 gap-3">
        <div>
          <label for="waktu_pembuatan" class="text-slate-700 font-medium text-sm">Waktu pembuatan</label>
          <input v-model="formData['waktu_pembuatan']" id="waktu_pembuatan" type="text" placeholder="Waktu pembuatan"
            class="input input-bordered w-full h-auto py-2.5 block mt-2" />
        </div>
        <div>
          <label for="tingkat_kesulitan" class="text-slate-700 font-medium text-sm">Tingkat kesulitan</label>
          <select v-model="formData['tingkat_kesulitan']"
            class="select select-bordered w-full h-auto py-2.5 block mt-2">
            <option value="Mudah">Mudah</option>
            <option value="Sedang">Sedang</option>
            <option value="Sulit">Sulit</option>
          </select>
        </div>
        <div>
          <label for="porsi" class="text-slate-700 font-medium text-sm">Porsi</label>
          <input v-model="formData['porsi']" id="porsi" type="text" placeholder="Porsi"
            class="input input-bordered w-full h-auto py-2.5 block mt-2" />
        </div>
      </div>

      <div class="mt-4">
        <label for="bahan" class="text-slate-700 font-medium text-sm">Bahan-bahan</label>
        <textarea v-model="formData['bahan']" id="bahan"
          class="textarea textarea-bordered resize-none block w-full mt-2 min-h-[150px]"
          placeholder="Bahan-bahannya apa saja?"></textarea>
      </div>

      <div class="mt-4">
        <label for="cara_masak" class="text-slate-700 font-medium text-sm">Cara masak</label>
        <textarea v-model="formData['cara_masak']" id="cara_masak"
          class="textarea textarea-bordered resize-none block w-full mt-2 min-h-[150px]"
          placeholder="Cara masak"></textarea>
      </div>

      <button :disabled="isFetching" type="submit" class="btn btn-primary btn-block mt-5 capitalize leading-normal">Buat
        Resep</button>
    </form>
  </main>

  <div v-if="data" class="toast toast-top toast-center min-w-max z-[1001]">
    <div class="alert alert-success min-w-max">
      <div>
        <span>Resep berhasil dibuat.</span>
        <RouterLink :to="{ name: 'recipeDetail', params: { id: data.data.id } }" class="underline font-medium">
          Lihat Resep</RouterLink>
      </div>
    </div>
  </div>
</template>

<style scoped>

</style>