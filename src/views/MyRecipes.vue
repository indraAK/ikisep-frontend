<script setup>
import { useFetch } from "@vueuse/core"
import { useUserStore } from "@/stores/user"
import Navbar from '@/components/Navbar.vue';
import Spinner from "@/components/Spinner.vue"
import RecipeCard from "@/components/RecipeCard.vue"
import Modal from "@/components/Modal.vue"
import { ref, onMounted } from "vue";
import { supabase } from "@/supabase"

const { user } = useUserStore();
const { isFetching, data, error, isFinished, execute: fetchRecipes } = useFetch(`${import.meta.env.VITE_API_URL}/${user.id}/recipes`, { immediate: false }).get().json()
const isOpen = ref(false)
const recipeToBeEdited = ref(null);
const recipeToBeDeleted = ref(null)
const activeModal = ref(null);
const statusMsg = ref(null)
const imageFile = ref(null)
const imageBlob = ref(null)

onMounted(() => fetchRecipes())

function handleClick(actionType, recipeId) {
  if (actionType === 'delete') {
    recipeToBeDeleted.value = data.value.data.find(recipe => recipe.id === recipeId)
    activeModal.value = 'delete'
  }
  if (actionType === 'edit') {
    recipeToBeEdited.value = Object.assign({}, data.value.data.find(recipe => recipe.id === recipeId))
    activeModal.value = 'edit';
  }
  isOpen.value = true;
}

function handleFileChange(event) {
  if (event.target.files.length === 0) return;
  imageFile.value = event.target.files[0]
  URL.revokeObjectURL(imageFile.value)
  imageBlob.value = URL.createObjectURL(imageFile.value)
}

// Hapus resep
async function deleteRecipe() {
  isFetching.value = true

  try {
    const res = await fetch(`${import.meta.env.VITE_API_URL}/recipes/${recipeToBeDeleted.value.id}`, {
      method: 'DELETE'
    });

    if (!res.ok) throw new Error(res.statusText)

    isOpen.value = false
    await fetchRecipes()
    statusMsg.value = 'Resep berhasil dihapus!'
    setTimeout(() => statusMsg.value = null, 5000)
  } catch (error) {
    console.log(error.message)
  }
}

// Edit resep
async function editRecipe() {
  isFetching.value = true;

  try {
    if (imageFile.value) {
      const { data: { path } } = await supabase.storage
        .from('img')
        .upload(`recipe/${Date.now()}-${imageFile.value.name}`, imageFile.value);

      const { data: { publicUrl } } = supabase
        .storage
        .from('img')
        .getPublicUrl(path)

      recipeToBeEdited.value.image_url = publicUrl
    }

    const res = await fetch(`${import.meta.env.VITE_API_URL}/recipes/${recipeToBeEdited.value.id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ ...recipeToBeEdited.value })
    });

    if (!res.ok) throw new Error(res.statusText)

    closeModalEdit()
    await fetchRecipes()
    statusMsg.value = 'Resep berhasil diedit!'
    setTimeout(() => statusMsg.value = null, 5000)
  } catch (error) {
    console.log(error.message)
  }
}

function closeModalEdit() {
  isOpen.value = false
  imageFile.value = null
  imageBlob.value = null
}

</script>
<template>
  <Navbar />
  <main class="container mx-auto px-4 pt-6 pb-12">
    <h1 class="text-xl text-slate-800 font-semibold">Resep yang saya buat</h1>
    <p v-if="error" class="mt-6">{{ error }}</p>
    <Spinner v-if="isFetching" class="mt-6" />
    <div v-if="isFinished">
      <div v-if="data.data" class="grid gap-5 md:grid-cols-2 xl:grid-cols-4 mt-6">
        <RecipeCard v-for="recipe in data.data" :key="recipe.id" :recipe="recipe">
          <template #action-menu>
            <div class="flex justify-end gap-2 mt-4">
              <button @click="handleClick('edit', recipe.id)"
                class="w-8 h-8 rounded-full flex items-center justify-center text-slate-600 hover:bg-slate-200"><svg
                  xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                  stroke="currentColor" class="w-5 h-5">
                  <path stroke-linecap="round" stroke-linejoin="round"
                    d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                </svg>
              </button>
              <button @click="handleClick('delete', recipe.id)"
                class="w-8 h-8 rounded-full flex items-center justify-center text-slate-600 hover:bg-slate-200"><svg
                  xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                  stroke="currentColor" class="w-5 h-5">
                  <path stroke-linecap="round" stroke-linejoin="round"
                    d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                </svg>
              </button>
            </div>
          </template>
        </RecipeCard>
      </div>
      <div v-else class="text-center py-20">
        <img src="@/assets/no-data.svg" class="max-w-[200px] mx-auto" alt="No Data">
        <h2 class="text-2xl text-slate-800 font-bold mt-6">Belum ada yang resep yang kamu buat!</h2>
        <p class="text-slate-600 text-lg mt-2">Yuk mulai buat resep pertamu</p>
        <RouterLink to="/create" class="btn btn-primary capitalize tracking-wider mt-4">Buat Resep</RouterLink>
      </div>
    </div>
  </main>

  <teleport to="body">
    <Modal v-if="isOpen && activeModal === 'edit'" title="Edit Resep" @close="closeModalEdit">
      <template #modal-content v-if="recipeToBeEdited">
        <form @submit.prevent="editRecipe" class="w-full mt-6">
          <div class="max-h-[70vh] overflow-y-auto px-5">
            <div class="bg-slate-100 h-[250px] flex items-center justify-center">
              <img :src="imageFile ? imageBlob : recipeToBeEdited.image_url" alt="Foto Makanan"
                class="object-cover h-full w-full block" />
            </div>
            <label for="image_url"
              class="btn btn-sm btn-outline capitalize font-medium text-sm flex mx-auto max-w-max mt-2">
              <input @change="handleFileChange" type="file" name="image_url" id="image_url" class="hidden">
              Ganti Foto
            </label>

            <div class="mt-4">
              <label for="nama_resep" class="text-slate-700 font-medium text-sm">Nama resep</label>
              <input v-model="recipeToBeEdited.nama_resep" id="nama_resep" type="text" placeholder="Resep apa?"
                class="input input-bordered w-full h-auto py-2.5 block mt-2" />
            </div>

            <div class="mt-4 grid sm:grid-cols-3 gap-3">
              <div>
                <label for="waktu_pembuatan" class="text-slate-700 font-medium text-sm">Waktu pembuatan</label>
                <input v-model="recipeToBeEdited.waktu_pembuatan" id="waktu_pembuatan" type="text"
                  placeholder="Waktu pembuatan" class="input input-bordered w-full h-auto py-2.5 block mt-2" />
              </div>
              <div>
                <label for="tingkat_kesulitan" class="text-slate-700 font-medium text-sm">Tingkat kesulitan</label>
                <select v-model="recipeToBeEdited.tingkat_kesulitan"
                  class="select select-bordered w-full h-auto py-2.5 block mt-2">
                  <option value="Mudah">Mudah</option>
                  <option value="Sedang">Sedang</option>
                  <option value="Sulit">Sulit</option>
                </select>
              </div>
              <div>
                <label for="porsi" class="text-slate-700 font-medium text-sm">Porsi</label>
                <input v-model="recipeToBeEdited.porsi" id="porsi" type="text" placeholder="Porsi"
                  class="input input-bordered w-full h-auto py-2.5 block mt-2" />
              </div>
            </div>

            <div class="mt-4">
              <label for="bahan" class="text-slate-700 font-medium text-sm">Bahan-bahan</label>
              <textarea v-model="recipeToBeEdited.bahan" id="bahan"
                class="textarea textarea-bordered resize-none block w-full mt-2 min-h-[150px]"
                placeholder="Bahan-bahannya apa saja?"></textarea>
            </div>

            <div class="mt-4">
              <label for="cara_masak" class="text-slate-700 font-medium text-sm">Cara masak</label>
              <textarea v-model="recipeToBeEdited.cara_masak" id="cara_masak"
                class="textarea textarea-bordered resize-none block w-full mt-2 min-h-[150px]"
                placeholder="Cara masak"></textarea>
            </div>
          </div>

          <div class="flex justify-end gap-2 mt-8 px-5">
            <button :disabled="isFetching" @click="closeModalEdit" class="btn capitalize tracking-wider">Batal</button>
            <button :disabled="isFetching" type="submit"
              class="btn btn-primary capitalize tracking-wider">Simpan</button>
          </div>
        </form>
      </template>
    </Modal>
  </teleport>

  <teleport to="body">
    <Modal v-if="isOpen && activeModal === 'delete'" @close="isOpen = false" title="Hapus Resep" ref="modalDeleteRef">
      <template #modal-content>
        <p class="px-5 mt-5 text-slate-600">Apakah kamu mau menghapusnya?</p>
        <div class="flex justify-end gap-2 mt-8 px-5">
          <button :disabled="isFetching" @click="isOpen = false" class="btn capitalize tracking-wider">Tidak</button>
          <button :disabled="isFetching" @click="deleteRecipe" class="btn btn-primary capitalize tracking-wider">Ya,
            Hapus</button>
        </div>
      </template>
    </Modal>
  </teleport>

  <div v-if="statusMsg" class="toast toast-top toast-center min-w-max z-[1001]">
    <div class="alert alert-success min-w-max py-3 px-4">
      <p class="text-base text-white font-medium">{{ statusMsg }}</p>
    </div>
  </div>
</template>