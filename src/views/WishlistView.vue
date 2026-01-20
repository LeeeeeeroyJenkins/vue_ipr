<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useWishlistStore } from '../stores/wishlist.store'
import WishlistCustomization from '../components/wishlist/WishlistCustomization.vue'
import WishlistItemList from '../components/wishlist/WishlistItemList.vue'
import WishlistItemCreateModal from '../components/wishlist/WishlistItemCreateModal.vue'

const route = useRoute()
const router = useRouter()
const store = useWishlistStore()

const wishlistId = route.params.id as string
const wishlist = computed(() => store.getWishlist(wishlistId))

onMounted(() => {
  if (!wishlist.value) {
    router.push('/')
  }
})
</script>

<template>
  <div v-if="wishlist" class="wishlist-page" :style="{
    background: `linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.4)), url(${wishlist.cover})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    color: wishlist.color === '#ffffff' ? '#333' : '#fff'
  }">
    <header class="header">
      <button @click="router.back()" class="back-btn" aria-label="Назад">← Назад</button>
      <h1 class="title">{{ wishlist.icon }} {{ wishlist.title }}</h1>
    </header>

    <main class="main-content">
      <WishlistCustomization :id="wishlist.id" />
      <WishlistItemCreateModal :wishlist-id="wishlist.id" />
      <WishlistItemList :wishlist="wishlist" />
    </main>

    <div v-if="!wishlist.items.length" class="empty-state">
      <p>Элементы вишлиста пусты. Добавьте первый!</p>
    </div>
  </div>
  <div v-else class="loading">Загрузка... или вишлист не найден</div>
</template>

<style scoped>
.wishlist-page {
  min-height: 100vh;
  padding: 16px;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
}

.header {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 24px;
}

.back-btn {
  background: rgba(255, 255, 255, 0.2);
  color: inherit;
  border: none;
  padding: 8px 12px;
  border-radius: 8px;
  cursor: pointer;
  transition: background 0.2s ease;
  backdrop-filter: blur(10px);
}

.back-btn:hover {
  background: rgba(255, 255, 255, 0.3);
}

.title {
  margin: 0;
  font-size: 2rem;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
  flex: 1;
}

.main-content {
  max-width: 800px;
  margin: 0 auto;
}

.empty-state {
  text-align: center;
  padding: 40px;
  color: inherit;
  opacity: 0.8;
}

.loading {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  font-size: 18px;
  font-family: inherit;
}

@media (max-width: 600px) {
  .header {
    flex-direction: column;
    align-items: flex-start;
  }

  .title {
    font-size: 1.5rem;
  }
}
</style>