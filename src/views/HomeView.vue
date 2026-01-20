<script setup lang="ts">
import { useWishlistStore } from '../stores/wishlist.store'
import WishlistCard from '../components/wishlist/WishlistCard.vue'
import WishlistCreateModal from '../components/wishlist/WishlistCreateModal.vue'
import WishlistSearch from '../components/wishlist/WishlistSearch.vue'

const store = useWishlistStore()

</script>

<template>
  <div class="home-page">
    <header class="header">
      <h1 class="title">Мои Вишлисты</h1>
      <WishlistCreateModal />
    </header>

    <WishlistSearch />

    <TransitionGroup name="list" tag="div" class="cards-grid">
      <WishlistCard v-for="w in store.filteredWishlists" :key="w.id" :wishlist="w" class="card-wrapper" />
    </TransitionGroup>

    <div v-if="!store.filteredWishlists.length" class="empty-state">
      <p v-if="!store.search.trim()">Нет вишлистов. Создайте первый!</p>
      <p v-else>Ничего не найдено по запросу "{{ store.search }}". Попробуйте другой поиск.</p>
    </div>
  </div>
</template>

<style scoped>
.home-page {
  max-width: 1200px;
  margin: 0 auto;
  padding: 16px;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.title {
  font-size: 2.5rem;
  margin: 0;
  color: #333;
}

.cards-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 16px;
  margin-top: 16px;
}

.empty-state {
  text-align: center;
  padding: 40px;
  color: #666;
  font-size: 1.1rem;
}

.list-enter-active,
.list-leave-active {
  transition: all 0.3s ease;
}

.list-enter-from,
.list-leave-to {
  opacity: 0;
  transform: translateY(20px) scale(0.95);
}

@media (max-width: 768px) {
  .header {
    flex-direction: column;
    gap: 12px;
    align-items: stretch;
  }

  .cards-grid {
    grid-template-columns: 1fr;
  }
}
</style>