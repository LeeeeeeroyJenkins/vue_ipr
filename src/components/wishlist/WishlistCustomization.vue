<script setup lang="ts">
import { useWishlistStore } from '../../stores/wishlist.store'

const props = defineProps<{ id: string }>()
const store = useWishlistStore()

const updateCover = (e: Event) => {
  const target = e.target as HTMLInputElement;
  store.updateWishlistImmediate(props.id, { cover: target.value });
}

</script>

<template>
  <div class="customization-panel">
    <label>Обложка (URL)</label>
    <input placeholder="Cover URL" @change="updateCover" :value="store.getWishlist(id)?.cover || ''" />
  </div>
</template>

<style scoped>
.customization-panel {
  background: rgba(255, 255, 255, 0.1);
  padding: 16px;
  border-radius: 12px;
  margin-bottom: 24px;
  display: grid;
  gap: 12px;
}

label {
  font-weight: bold;
  color: inherit;
}

input,
select {
  padding: 8px;
  border-radius: 4px;
  border: 1px solid rgba(255, 255, 255, 0.3);
  background: rgba(255, 255, 255, 0.9);
  color: #333;
}
</style>