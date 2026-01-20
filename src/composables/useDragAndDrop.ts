import { ref } from "vue";
import { useWishlistStore } from "../stores/wishlist.store";

export function useDragAndDrop(wishlistId: string) {
  const store = useWishlistStore();
  const dragging = ref(false);
  const from = ref<number | null>(null);

  function dragStart(index: number) {
    from.value = index;
    dragging.value = true;
  }

  function dragEnd() {
    from.value = null;
    dragging.value = false;
  }

  function drop(to: number) {
    if (from.value === null) return;
    store.reorderItems(wishlistId, from.value, to);
    dragEnd();
  }

  function touchStart(e: TouchEvent, index: number) {
    e.preventDefault();
    dragStart(index);
  }

  function touchEnd(e: TouchEvent, to: number) {
    e.preventDefault();
    drop(to);
  }

  return { dragStart, drop, dragEnd, dragging, touchStart, touchEnd };
}