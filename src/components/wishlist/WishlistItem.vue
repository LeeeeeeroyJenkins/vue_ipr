<script setup lang="ts">
import { ref } from "vue";
import InlineEdit from "../../components/ui/InlineEdit.vue";
import { useWishlistStore } from "../../stores/wishlist.store";
import type { WishlistItem } from "../../types/wishlist";

const props = defineProps<{ item: WishlistItem; wishlistId: string }>();
const store = useWishlistStore();
const expanded = ref(false);
</script>

<template>
    <div class="item" :class="{ purchased: item.purchased }">
        <div class="item-header">
            <InlineEdit :model-value="item.title" @update:model-value="v =>
                store.updateItem(props.wishlistId, item.id, { title: v.trim() || 'Untitled' })
            " placeholder="Название" />
            <div class="actions">
                <button @click="store.togglePurchased(props.wishlistId, item.id)">✓</button>
                <button @click="expanded = !expanded">✎</button>
                <button @click="store.removeItem(props.wishlistId, item.id)">×</button>
            </div>
        </div>

        <div v-if="expanded" class="item-edit">
            <label class="edit-label">Описание</label>
            <InlineEdit :model-value="item.description || ''" @update:model-value="v =>
                store.updateItem(props.wishlistId, item.id, { description: v.trim() || undefined })
            " />

            <label class="edit-label">Ссылка</label>
            <InlineEdit :model-value="item.link || ''" @update:model-value="v =>
                store.updateItem(props.wishlistId, item.id, { link: v.trim() || undefined })
            " />

            <label class="edit-label">Цена</label>
            <InlineEdit :model-value="item.price?.toString() || ''" @update:model-value="v =>
                store.updateItem(props.wishlistId, item.id, { price: Number(v) || undefined })
            " />

            <div v-if="item.image" class="item-image">
                <img :src="item.image" :alt="item.title" />
            </div>
        </div>

        <div v-else-if="item.image" class="item-image">
            <img :src="item.image" :alt="item.title" />
        </div>
    </div>
</template>

<style scoped>
.item {
    background-color: #f9fafb;
    padding: 16px;
    border-radius: 12px;
    margin-bottom: 12px;
    border: 1px solid #e5e7eb;
    color: #333;
    transition: opacity 0.2s ease;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.item-image img {
    max-width: 200px;
    max-height: 150px;
    object-fit: cover;
    border-radius: 8px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.item-edit :deep(input) {
    width: 100%;
}

.item-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 12px;
}

.actions button {
    margin-left: 8px;
    padding: 6px 10px;
    border: none;
    border-radius: 6px;
    background: #e5e7eb;
    color: #374151;
    cursor: pointer;
    transition: background 0.2s ease, transform 0.1s ease;
}

.actions button:hover {
    background: #d1d5db;
    transform: scale(1.05);
}

.item-edit {
    display: grid;
    gap: 12px;
    padding-top: 12px;
    border-top: 1px solid #e5e7eb;
}

.edit-label {
    font-size: 0.9rem;
    font-weight: bold;
    color: #374151;
    margin: 0 0 4px 0;
    align-self: start;
}

.item-edit :deep(input),
.item-edit :deep(span) {
    background: #ffffff;
    color: #333;
    border: 1px solid #d1d5db;
    padding: 8px;
    border-radius: 6px;
    width: 100%;
    box-sizing: border-box;
}

.item-image {
    display: flex;
    justify-content: center;
    margin-top: 8px;
}

.item-image img {
    max-width: 200px;
    max-height: 150px;
    width: auto;
    height: auto;
    object-fit: cover;
    border-radius: 8px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    border: 1px solid #e5e7eb;
}

.purchased {
    opacity: 0.7;
    text-decoration: line-through;
}

.purchased .item-edit :deep(input),
.purchased .item-edit :deep(span) {
    background: #f3f4f6;
    opacity: 0.9;
}

.item-image img {
    max-width: 200px;
    max-height: 150px;
    object-fit: cover;
    border-radius: 8px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

@media (max-width: 600px) {
    .item {
        padding: 12px;
    }

    .item-image img {
        max-width: 100%;
        max-height: 120px;
    }
}
</style>