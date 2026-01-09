<script setup lang="ts">
import type { Wishlist } from '../../types/wishlist'
import { useWishlistStore } from '../../stores/wishlist.store.ts'
import InlineEdit from '../ui/InlineEdit.vue'

const props = defineProps<{ wishlist: Wishlist }>()
const store = useWishlistStore()
</script>

<template>
  <h2>
    <InlineEdit :model-value="wishlist.title"
      @update:model-value="v => store.updateWishlist(wishlist.id, { title: v })" />
  </h2>
</template>
