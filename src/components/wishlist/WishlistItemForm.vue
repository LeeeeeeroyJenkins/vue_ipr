<script setup lang="ts">
import { ref } from 'vue'
import { useWishlistStore } from '../../stores/wishlist.store.ts'

const props = defineProps<{ wishlistId: string }>()
const store = useWishlistStore()

const title = ref('')
const link = ref('')
const price = ref<number | null>(null)

function add() {
  if (!title.value.trim()) return
  store.addItem(props.wishlistId, {
    title: title.value,
    link: link.value,
    price: price.value ?? undefined
  })
  title.value = link.value = ''
  price.value = null
}
</script>

<template>
  <input v-model="title" placeholder="Название" />
  <input v-model="link" placeholder="Ссылка" />
  <input v-model.number="price" type="number" placeholder="Цена" />
  <button @click="add">+</button>
</template>
