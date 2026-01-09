<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useWishlistStore } from '../../stores/wishlist.store'
import type { Wishlist } from '../../types/wishlist'

const props = defineProps<{ wishlist: Wishlist }>()
const store = useWishlistStore()
const router = useRouter()

const editTitle = ref(props.wishlist.title)
const editing = ref(false)

const icons = ['🎁', '🎂', '🎄', '🛍️']

const saveTitle = () => {
  if (!editTitle.value.trim()) return
  store.updateWishlist(props.wishlist.id, { title: editTitle.value.trim() })
  editing.value = false
}

const updateColor = (e: Event) => {
  const target = e.target as HTMLInputElement
  store.updateWishlistImmediate(props.wishlist.id, { color: target.value })
}

const updateIcon = (e: Event) => {
  const target = e.target as HTMLSelectElement
  store.updateWishlist(props.wishlist.id, { icon: target.value })
}
</script>

<template>
  <div class="card">
    <button @click="router.push(`/wishlist/${wishlist.id}`)" class="card-content">
      <div class="icon" :style="{ backgroundColor: wishlist.color }">{{ wishlist.icon }}</div>
      <div class="title-wrapper">
        <template v-if="editing">
          <input v-model="editTitle" @blur="saveTitle" @keyup.enter="saveTitle" class="title-input" />
        </template>
        <template v-else>
          <h3 class="title" @dblclick="editing = true">{{ wishlist.title }}</h3>
        </template>
      </div>
      <p class="items-count">{{ wishlist.items.length }} элементов</p>
    </button>

    <div class="customization-panel">
      <label>Цвет</label>
      <input type="color" :value="wishlist.color" @change="updateColor" />

      <label>Иконка</label>
      <select :value="wishlist.icon" @change="updateIcon">
        <option v-for="i in icons" :key="i" :value="i">{{ i }}</option>
      </select>
    </div>

    <button @click="store.deleteWishlist(wishlist.id)" class="delete-btn" aria-label="Удалить">×</button>
  </div>
</template>

<style scoped>
.card {
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  display: flex;
  flex-direction: column;
  position: relative;
}

.card:hover {
  transform: translateY(-4px);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
}

.card-content {
  flex: 1;
  padding: 16px;
  border: none;
  background: none;
  text-align: left;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.icon {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  color: white;
  margin-bottom: 8px;
}

.title-wrapper {
  display: flex;
  align-items: center;
}

.title {
  margin: 0;
  font-size: 1.2rem;
  color: #333;
}

.title-input {
  font-size: 1.2rem;
  padding: 4px 8px;
  border-radius: 6px;
  border: 1px solid #d1d5db;
  width: 100%;
}

.items-count {
  margin: 0;
  font-size: 0.9rem;
  color: #666;
}

.customization-panel {
  display: flex;
  justify-content: space-between;
  padding: 8px 16px;
  border-top: 1px solid #e5e7eb;
  gap: 8px;
  flex-wrap: wrap;
}

.customization-panel label {
  font-size: 0.8rem;
  font-weight: bold;
  color: #374151;
}

.customization-panel input,
.customization-panel select {
  padding: 4px 6px;
  border-radius: 6px;
  border: 1px solid #d1d5db;
  font-size: 0.9rem;
}

.delete-btn {
  position: absolute;
  top: 12px;
  right: 12px;
  background: #ef4444;
  color: white;
  border: none;
  padding: 6px 10px;
  border-radius: 6px;
  cursor: pointer;
  transition: background 0.2s ease;
}

.delete-btn:hover {
  background: #dc2626;
}
</style>
