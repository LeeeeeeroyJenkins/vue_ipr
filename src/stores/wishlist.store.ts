import { defineStore } from "pinia";
import type { Wishlist, WishlistItem } from "../types/wishlist";
import { useLocalStorage } from "../composables/useLocalStorage";

const STORAGE_KEY = "wishlists";

export const useWishlistStore = defineStore("wishlist", {
  state: () => ({
    wishlists: useLocalStorage<Wishlist[]>(STORAGE_KEY, []),
    search: "",
  }),
  getters: {
    filteredWishlists(state) {
      const query = state.search.toLowerCase().trim();
      if (!query) return state.wishlists;

      return state.wishlists.filter((w) => {
        const inTitle = w.title.toLowerCase().includes(query);

        const inItems = w.items.some(
          (item) =>
            item.title.toLowerCase().includes(query) ||
            item.description?.toLowerCase().includes(query) ||
            item.link?.toLowerCase().includes(query)
        );

        return inTitle || inItems;
      });
    },
  },
  actions: {
    updateWishlistImmediate(id: string, patch: Partial<Wishlist>) {
      const wl = this.getWishlist(id);
      if (!wl) return;
      Object.assign(wl, patch);
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(this.wishlists));
      } catch (e) {
        // для прод версии
      }
    },
    updateWishlist(id: string, patch: Partial<Wishlist>) {
      const wl = this.getWishlist(id);
      if (!wl) return;
      Object.assign(wl, patch);
      this.wishlists = [...this.wishlists];
      if ("color" in patch || "cover" in patch) {
        this.updateWishlistImmediate(id, patch);
      }
    },
    deleteWishlist(id: string) {
      this.wishlists = this.wishlists.filter((w) => w.id !== id);
    },
    addItem(wishlistId: string, item: Omit<WishlistItem, "id" | "purchased">) {
      const wl = this.getWishlist(wishlistId);
      if (!wl) return;
      wl.items.push({
        id: crypto.randomUUID(),
        purchased: false,
        ...item,
      });
      this.wishlists = [...this.wishlists];
    },
    updateItem(
      wishlistId: string,
      itemId: string,
      patch: Partial<WishlistItem>
    ) {
      const wl = this.getWishlist(wishlistId);
      if (!wl) return;
      const item = wl.items.find((i) => i.id === itemId);
      if (!item) return;
      Object.assign(item, patch);
      this.wishlists = [...this.wishlists];
    },
    removeItem(wishlistId: string, itemId: string) {
      const wl = this.getWishlist(wishlistId);
      if (!wl) return;
      wl.items = wl.items.filter((i) => i.id !== itemId);
      this.wishlists = [...this.wishlists];
    },
    togglePurchased(wishlistId: string, itemId: string) {
      const wl = this.getWishlist(wishlistId);
      if (!wl) return;
      const item = wl.items.find((i) => i.id === itemId);
      if (!item) return;
      item.purchased = !item.purchased;
      wl.items.sort((a, b) => Number(a.purchased) - Number(b.purchased));
      this.wishlists = [...this.wishlists];
    },
    reorderItems(wishlistId: string, fromIndex: number, toIndex: number) {
      const wl = this.getWishlist(wishlistId);
      if (!wl || fromIndex === toIndex) return;
      const [item] = wl.items.splice(fromIndex, 1);
      if (item) {
        wl.items.splice(toIndex, 0, item);
      }
      this.wishlists = [...this.wishlists];
    },
    createWishlist(title: string, theme: Wishlist['theme'], icon: string) {
      const newWishlist: Wishlist = {
        id: crypto.randomUUID(),
        title,
        theme,
        color: "#ffffff",
        icon,
        cover: "",
        items: [],
      };
      this.wishlists.push(newWishlist);
    },
    getWishlist(id: string) {
      return this.wishlists.find((w) => w.id === id);
    },
  },
});