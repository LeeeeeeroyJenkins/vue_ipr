<script setup lang="ts">
import { ref } from 'vue'
import { useWishlistStore } from '../../stores/wishlist.store.ts'
import Modal from '../ui/Modal.vue'

const store = useWishlistStore()
const open = ref(false)
const title = ref('')
const theme = ref<'default' | 'birthday' | 'newyear'>('default')

const themeIcons: Record<typeof theme.value, string> = {
  default: '🎁',
  birthday: '🎂',
  newyear: '🎄',
}

function create() {
  const trimmedTitle = title.value.trim()
  if (!trimmedTitle) return

  const icon = themeIcons[theme.value] || '🎁'
  store.createWishlist(trimmedTitle, theme.value, icon)

  title.value = ''
  theme.value = 'default'
  open.value = false
}
</script>

<template>
  <button @click="open = true" class="create-btn">Создать вишлист</button>

  <Modal :open="open" @close="open = false">
    <h3>Новый вишлист</h3>
    <input v-model="title" placeholder="Название" class="modal-input" />
    <select v-model="theme" class="modal-select">
      <option value="default">Default</option>
      <option value="birthday">Birthday</option>
      <option value="newyear">New Year</option>
    </select>
    <button @click="create" class="modal-save-btn">Создать</button>
  </Modal>
</template>

<style scoped>
.create-btn {
  background: #3b82f6;
  color: white;
  border: none;
  padding: 8px 12px;
  border-radius: 6px;
  cursor: pointer;
}

.modal-input,
.modal-select {
  width: 100%;
  padding: 8px;
  margin-bottom: 12px;
  border-radius: 6px;
  border: 1px solid #d1d5db;
  box-sizing: border-box;
}

.modal-save-btn {
  background: #10b981;
  color: white;
  border: none;
  padding: 10px 16px;
  border-radius: 6px;
  cursor: pointer;
  width: 100%;
}

.modal-save-btn:hover {
  background: #059669;
}
</style>
