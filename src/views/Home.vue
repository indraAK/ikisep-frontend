<script setup>
import { ref } from 'vue';
import { onClickOutside, useFetch } from '@vueuse/core'
import Spinner from "@/components/Spinner.vue"
import RecipeCard from "@/components/RecipeCard.vue"
import Navbar from "@/components/Navbar.vue"
import router from '../router';

const { isFetching, data } = useFetch(`${import.meta.env.VITE_API_URL}/recipes`).get().json()
const dropdownRef = ref(null)
const isMenuFilterOpen = ref(false)
const dropdownMenus = ref(['Terbaru', 'Banyak Disukai', 'Mudah', 'Sedang', 'Sulit'])
const selectedMenu = ref(dropdownMenus.value[0])
const query = ref('')
const page = ref(1)

onClickOutside(dropdownRef, () => isMenuFilterOpen.value = false)

const handleClickDropdownItem = (menu) => {
  selectedMenu.value = menu
  isMenuFilterOpen.value = false
}

const handleSearch = () => {
  router.push({ name: 'searchResults', query: { name: query.value } })
}

const loadMore = async () => {
  isFetching.value = true
  page.value += 1

  try {
    const res = await fetch(`${import.meta.env.VITE_API_URL}/recipes?page=${page.value}`)
    if (!res.ok) throw new Error(res.statusText)
    const json = await res.json()
    data.value.data = [...data.value?.data, ...json.data]
    data.value.meta = { ...json.meta }
    console.log(data)
  } catch (error) {
    console.log(error.message)
  } finally {
    isFetching.value = false
  }
}

</script>

<template>
  <Navbar />
  <!-- Hero -->
  <section
    class="hero-section p-4 min-h-[75vh] bg-[url('@/assets/bg-hero.jpg')] bg-cover bg-center relative isolate text-white grid content-center justify-center text-center">
    <h1 class="text-4xl font-bold shadow">Masak Jadi Lebih Mudah dan Menyenangkan</h1>
    <p class="text-lg mt-4 max-w-lg mx-auto font-medium">
      Mau masak ini itu tapi belum tau resep dan cara masaknya? tenang, disini ada berbagai macam resep masakan yang
      menarik
      untuk kamu
    </p>
  </section>

  <!-- Form Search Recipe -->
  <section class="p-4 max-w-xl mx-auto -translate-y-1/2">
    <form @submit.prevent="handleSearch" class="bg-white p-8 shadow-md rounded-xl">
      <label for="keyword" class=" text-slate-700 font-medium">Mau masak apa hari ini?</label>
      <div class="flex gap-2 mt-3">
        <div class="relative flex-1">
          <input v-model="query" type="text" placeholder="Cari resep..."
            class="w-full p-3 py-2.5 rounded border border-gray-300 text-slate-700 focus:outline-none focus:ring-2 focus:ring-gray-200 focus:ring-opacity-75"
            data-testid="keyword">
          <span class="block absolute top-1/2 right-3 -translate-y-1/2">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
              stroke="currentColor" class="w-6 h-6 text-gray-400">
              <path stroke-linecap="round" stroke-linejoin="round"
                d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
            </svg>
          </span>
        </div>
        <button
          class="inline-flex items-center justify-center align-middle whitespace-nowrap px-6 py-2 bg-green-primary text-white font-medium text-base rounded hover:bg-green-primary/90"
          data-testid="search-btn">Cari</button>
      </div>
    </form>
  </section>

  <section class="container mx-auto px-4 flex items-center justify-between gap-3">
    <h2 class="text-xl font-semibold text-slate-800">Berbagai Resep dan Menu Andalan dari ikiSep</h2>
    <div class="relative">
      <button id="menuFilterBtn" @click="isMenuFilterOpen = !isMenuFilterOpen"
        class="inline-flex items-center justify-center align-middle gap-2 whitespace-nowrap px-4 py-2 bg-gray-100 text-gray-600 text-base rounded hover:bg-gray-200/70">
        {{ selectedMenu }}
        <span>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
            stroke="currentColor" class="w-5 h-5">
            <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
          </svg>
        </span>
      </button>
      <!-- Dropdown Filter -->
      <ul v-if="isMenuFilterOpen" ref="dropdownRef"
        class="absolute top-full right-0 w-auto mt-2 bg-white shadow-lg rounded z-50">
        <li v-for="menu in dropdownMenus" :key="menu">
          <button @click="handleClickDropdownItem(menu)"
            class="inline-flex w-full items-center align-middle px-4 py-2.5 whitespace-nowrap text-sm hover:bg-slate-100 text-slate-700">{{
                menu
            }}</button>
        </li>
      </ul>
    </div>
  </section>

  <!-- Grid Recipe Card -->
  <section class="container mx-auto px-4 mt-8">
    <div v-if="isFetching">
      <Spinner />
    </div>

    <div v-if="data" class="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
      <RecipeCard v-for="recipe in data.data" :key="recipe.id" :recipe="recipe" />
    </div>

    <button v-if="data && data?.meta.page < data?.meta.total_page" @click="loadMore" :disabled="isFetching"
      class="flex mx-auto mt-12 items-center justify-center align-middle whitespace-nowrap px-6 py-3 bg-green-primary/5 text-green-primary font-medium text-base rounded-full hover:bg-green-primary/10 disabled:opacity-70">Lihat
      Lainnya</button>
  </section>

  <footer class="mt-28 pt-12 pb-8 bg-[#E52535] text-white">
    <div class="container mx-auto px-4 md:flex md:justify-between md:items-end">
      <div>
        <a href="#" class="flex items-center gap-1">
          <span class="text-white"><svg width="39" height="40" viewBox="0 0 49 50" fill="none"
              xmlns="http://www.w3.org/2000/svg">
              <path
                d="M6.125 4.58334H10.2083V45.4167H6.125V4.58334ZM20.4167 12.75H34.7083V16.8333H20.4167V12.75ZM20.4167 20.9167H34.7083V25H20.4167V20.9167Z"
                fill="currentColor" />
              <path
                d="M38.7917 4.58334H12.25V45.4167H38.7917C41.0436 45.4167 42.875 43.5853 42.875 41.3333V8.66668C42.875 6.41472 41.0436 4.58334 38.7917 4.58334ZM38.7917 41.3333H16.3333V8.66668H38.7917V41.3333Z"
                fill="currentColor" />
            </svg>
          </span>
          <span class="font-bold text-xl">ikiSep</span>
        </a>
        <h3 class="font-semibold text-lg mt-8">Media Sosial</h3>
        <p class="text-sm max-w-sm mt-2">Ikuti kami di media sosial untuk mengetahui pembaruan terbaru tentang kemajuan
          kami
        </p>
        <div class="mt-4 flex items-center gap-x-6">
          <a href="#">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path fill-rule="evenodd" clip-rule="evenodd"
                d="M7.465 1.066C8.638 1.012 9.012 1 12 1C14.988 1 15.362 1.013 16.534 1.066C17.706 1.119 18.506 1.306 19.206 1.577C19.939 1.854 20.604 2.287 21.154 2.847C21.714 3.396 22.146 4.06 22.422 4.794C22.694 5.494 22.88 6.294 22.934 7.464C22.988 8.639 23 9.013 23 12C23 14.988 22.987 15.362 22.934 16.535C22.881 17.705 22.694 18.505 22.422 19.205C22.146 19.9391 21.7133 20.6042 21.154 21.154C20.604 21.714 19.939 22.146 19.206 22.422C18.506 22.694 17.706 22.88 16.536 22.934C15.362 22.988 14.988 23 12 23C9.012 23 8.638 22.987 7.465 22.934C6.295 22.881 5.495 22.694 4.795 22.422C4.06092 22.146 3.39582 21.7133 2.846 21.154C2.28638 20.6047 1.85331 19.9399 1.577 19.206C1.306 18.506 1.12 17.706 1.066 16.536C1.012 15.361 1 14.987 1 12C1 9.012 1.013 8.638 1.066 7.466C1.119 6.294 1.306 5.494 1.577 4.794C1.85372 4.06008 2.28712 3.39531 2.847 2.846C3.39604 2.2865 4.06047 1.85344 4.794 1.577C5.494 1.306 6.294 1.12 7.464 1.066H7.465ZM16.445 3.046C15.285 2.993 14.937 2.982 12 2.982C9.063 2.982 8.715 2.993 7.555 3.046C6.482 3.095 5.9 3.274 5.512 3.425C4.999 3.625 4.632 3.862 4.247 4.247C3.88205 4.60205 3.60118 5.03428 3.425 5.512C3.274 5.9 3.095 6.482 3.046 7.555C2.993 8.715 2.982 9.063 2.982 12C2.982 14.937 2.993 15.285 3.046 16.445C3.095 17.518 3.274 18.1 3.425 18.488C3.601 18.965 3.882 19.398 4.247 19.753C4.602 20.118 5.035 20.399 5.512 20.575C5.9 20.726 6.482 20.905 7.555 20.954C8.715 21.007 9.062 21.018 12 21.018C14.938 21.018 15.285 21.007 16.445 20.954C17.518 20.905 18.1 20.726 18.488 20.575C19.001 20.375 19.368 20.138 19.753 19.753C20.118 19.398 20.399 18.965 20.575 18.488C20.726 18.1 20.905 17.518 20.954 16.445C21.007 15.285 21.018 14.937 21.018 12C21.018 9.063 21.007 8.715 20.954 7.555C20.905 6.482 20.726 5.9 20.575 5.512C20.375 4.999 20.138 4.632 19.753 4.247C19.3979 3.88207 18.9657 3.60121 18.488 3.425C18.1 3.274 17.518 3.095 16.445 3.046V3.046ZM10.595 15.391C11.3797 15.7176 12.2534 15.7617 13.0669 15.5157C13.8805 15.2697 14.5834 14.7489 15.0556 14.0422C15.5278 13.3356 15.7401 12.4869 15.656 11.6411C15.572 10.7953 15.197 10.005 14.595 9.405C14.2112 9.02148 13.7472 8.72781 13.2363 8.54515C12.7255 8.36248 12.1804 8.29536 11.6405 8.34862C11.1006 8.40187 10.5792 8.57418 10.1138 8.85313C9.64846 9.13208 9.25074 9.51074 8.9493 9.96185C8.64786 10.413 8.45019 10.9253 8.37052 11.462C8.29084 11.9986 8.33115 12.5463 8.48854 13.0655C8.64593 13.5847 8.91648 14.0626 9.28072 14.4647C9.64496 14.8668 10.0938 15.1832 10.595 15.391ZM8.002 8.002C8.52702 7.47698 9.15032 7.0605 9.8363 6.77636C10.5223 6.49222 11.2575 6.34597 12 6.34597C12.7425 6.34597 13.4777 6.49222 14.1637 6.77636C14.8497 7.0605 15.473 7.47698 15.998 8.002C16.523 8.52702 16.9395 9.15032 17.2236 9.8363C17.5078 10.5223 17.654 11.2575 17.654 12C17.654 12.7425 17.5078 13.4777 17.2236 14.1637C16.9395 14.8497 16.523 15.473 15.998 15.998C14.9377 17.0583 13.4995 17.654 12 17.654C10.5005 17.654 9.06234 17.0583 8.002 15.998C6.94166 14.9377 6.34597 13.4995 6.34597 12C6.34597 10.5005 6.94166 9.06234 8.002 8.002V8.002ZM18.908 7.188C19.0381 7.06527 19.1423 6.91768 19.2143 6.75397C19.2863 6.59027 19.3248 6.41377 19.3274 6.23493C19.33 6.05609 19.2967 5.87855 19.2295 5.71281C19.1622 5.54707 19.0624 5.39651 18.936 5.27004C18.8095 5.14357 18.6589 5.04376 18.4932 4.97652C18.3275 4.90928 18.1499 4.87598 17.9711 4.87858C17.7922 4.88119 17.6157 4.91965 17.452 4.9917C17.2883 5.06374 17.1407 5.1679 17.018 5.298C16.7793 5.55103 16.6486 5.88712 16.6537 6.23493C16.6588 6.58274 16.7992 6.91488 17.0452 7.16084C17.2911 7.40681 17.6233 7.54723 17.9711 7.5523C18.3189 7.55737 18.655 7.42669 18.908 7.188V7.188Z"
                fill="white" />
            </svg>
          </a>
          <a href="#">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <g clip-path="url(#clip0_65_18)">
                <path fill-rule="evenodd" clip-rule="evenodd"
                  d="M0 12.067C0 18.033 4.333 22.994 10 24V15.333H7V12H10V9.333C10 6.333 11.933 4.667 14.667 4.667C15.533 4.667 16.467 4.8 17.333 4.933V8H15.8C14.333 8 14 8.733 14 9.667V12H17.2L16.667 15.333H14V24C19.667 22.994 24 18.034 24 12.067C24 5.43 18.6 0 12 0C5.4 0 0 5.43 0 12.067Z"
                  fill="white" />
              </g>
              <defs>
                <clipPath id="clip0_65_18">
                  <rect width="24" height="24" fill="white" />
                </clipPath>
              </defs>
            </svg>
          </a>
          <a href="#">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M23.643 4.93695C22.808 5.30695 21.911 5.55696 20.968 5.66996C21.941 5.08775 22.669 4.17142 23.016 3.09195C22.1019 3.63494 21.1014 4.01715 20.058 4.22196C19.3564 3.47282 18.4271 2.97628 17.4143 2.80943C16.4016 2.64258 15.3621 2.81475 14.4572 3.29921C13.5524 3.78367 12.8328 4.55332 12.4102 5.48866C11.9875 6.424 11.8855 7.4727 12.12 8.47195C10.2677 8.37895 8.45564 7.8975 6.80144 7.05886C5.14723 6.22022 3.68785 5.04312 2.51801 3.60396C2.11801 4.29396 1.88801 5.09396 1.88801 5.94596C1.88757 6.71295 2.07644 7.4682 2.43789 8.14469C2.79934 8.82118 3.32217 9.39799 3.96001 9.82396C3.22029 9.80042 2.49688 9.60054 1.85001 9.24095V9.30095C1.84994 10.3767 2.22204 11.4193 2.90319 12.252C3.58434 13.0846 4.53258 13.6559 5.58701 13.869C4.9008 14.0547 4.18135 14.082 3.48301 13.949C3.78051 14.8746 4.36001 15.684 5.14038 16.2639C5.92075 16.8438 6.86293 17.1651 7.83501 17.183C6.18485 18.4784 4.1469 19.181 2.04901 19.178C1.67739 19.1781 1.30609 19.1564 0.937012 19.113C3.06649 20.4821 5.54535 21.2088 8.07701 21.206C16.647 21.206 21.332 14.108 21.332 7.95195C21.332 7.75195 21.327 7.54995 21.318 7.34995C22.2293 6.69093 23.0159 5.87485 23.641 4.93995L23.643 4.93695V4.93695Z"
                fill="white" />
            </svg>
          </a>
        </div>
      </div>

      <p class="text-sm">&copy; 2022 ikiSep. All rights reserved.</p>
    </div>
  </footer>
</template>

<style>
.hero-section::before {
  content: '';
  display: block;
  position: absolute;
  inset: 0;
  background-color: rgba(0, 0, 0, .75);
  z-index: -1;
}
</style>
