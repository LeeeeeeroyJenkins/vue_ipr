<script setup lang="ts">
import type { Wishlist } from "../../types/wishlist";
import WishlistItem from "./WishlistItem.vue";
import { useDragAndDrop } from "../../composables/useDragAndDrop";

const props = defineProps<{ wishlist: Wishlist }>();
const { dragStart, drop, dragEnd, dragging, touchStart, touchEnd } = useDragAndDrop(props.wishlist.id);

function handleDragStart(e: DragEvent) {
  const target = e.target as HTMLElement;
  if (target.classList.contains('item-wrapper')) {
    const index = parseInt(target.dataset.index || '-1');
    if (index >= 0) {
      dragStart(index);
    }
  }
}

function handleDragEnd() {
  dragEnd();
}

function handleDrop(e: DragEvent) {
  e.preventDefault();
  const target = e.target as HTMLElement;
  let index = -1;
  if (target.classList.contains('item-wrapper')) {
    index = parseInt(target.dataset.index || '-1');
  } else {
    const wrapper = target.closest('.item-wrapper');
    if (wrapper) {
      const wrapperEl = wrapper as HTMLElement;
      index = parseInt(wrapperEl.dataset.index || '-1');
    }
  }
  if (index >= 0) {
    drop(index);
  }
}
</script>

<template>
  <TransitionGroup name="list" class="item-list" @dragstart="handleDragStart" @dragend="handleDragEnd"
    @drop="handleDrop" @dragover.prevent @dragenter.prevent>
    <div v-for="(item, index) in wishlist.items" :key="item.id" class="item-wrapper" :class="{ dragging: dragging }"
      :data-index="index" draggable="true" tabindex="0" aria-label="Перетащите элемент"
      @touchstart="touchStart($event, index)" @touchend="touchEnd($event, index)">
      <WishlistItem :item="item" :wishlist-id="wishlist.id" />
    </div>
  </TransitionGroup>
</template>

<style scoped>
.item-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
  transition: all 0.2s ease;
}

.item-wrapper {
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  cursor: grab;
}

.item-wrapper:active,
.item-wrapper.dragging {
  cursor: grabbing;
  transform: rotate(2deg);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  opacity: 0.8;
}

.item-wrapper:hover:not(.dragging) {
  transform: translateY(-2px);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.list-enter-active,
.list-leave-active {
  transition: all 0.3s ease;
}

.list-enter-from,
.list-leave-to {
  opacity: 0;
  transform: translateX(20px);
}

@media (max-width: 600px) {
  .item-wrapper {
    cursor: pointer;
  }
}
</style>