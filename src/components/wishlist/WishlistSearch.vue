<script setup lang="ts">
import { ref, watch } from 'vue'
import { useWishlistStore } from '../../stores/wishlist.store.ts'

const store = useWishlistStore()
const inputValue = ref(store.search)

let timeout: number | null = null

watch(inputValue, (v) => {
  if (timeout !== null) clearTimeout(timeout)
  timeout = window.setTimeout(() => {
    store.search = v
    timeout = null
  }, 300)
})
</script>

<template>
  <div class="search-wrapper">
    <input v-model="inputValue" placeholder="Поиск..." class="search-input" />
    <button v-if="inputValue" @click="inputValue = ''" class="reset-btn">×</button>
  </div>
</template>

<style scoped>
.search-wrapper {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 16px;
}

.search-input {
  flex: 1;
  padding: 8px 12px;
  border-radius: 8px;
  border: 1px solid #d1d5db;
  font-size: 1rem;
}

.reset-btn {
  background: #f5f6f8;
  border: none;
  border-radius: 50%;
  width: 28px;
  height: 28px;
  font-size: 1.2rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.2s;
}
</style>
