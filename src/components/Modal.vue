<script setup>
const props = defineProps({
  title: {
    type: String,
    default: 'Modal Title'
  }
})
</script>

<template>
  <div class="fixed inset-0 w-screen h-full bg-black/60 z-[1003] px-6 py-8">
    <div class="w-full max-w-lg m-auto bg-white py-4 rounded-lg shadow-lg overscroll-contain">
      <!-- Modal Header -->
      <div class="flex items-center justify-between px-5 gap-3">
        <h1 class="text-xl text-slate-800 font-semibold">{{ props.title }}</h1>
        <button @click="$emit('close')" aria-label="Close"
          class="w-8 h-8 rounded-full flex items-center justify-center text-slate-600 hover:bg-slate-100">
          <svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
            stroke="currentColor" class="w-6 h-6">
            <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
      <!-- Slot for Modal Content -->
      <slot name="modal-content"></slot>
      <slot></slot>
      <!-- Slot for Modal Action -->
    </div>
  </div>
</template>
