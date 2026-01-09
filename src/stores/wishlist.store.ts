import { defineStore } from "pinia";
import type { Wishlist, WishlistItem } from "../types/wishlist";

const STORAGE_KEY = "wishlists";

let saveTimeout: number | null = null;
const debouncedSave = (wishlists: Wishlist[]) => {
  if (saveTimeout !== null) clearTimeout(saveTimeout);
  saveTimeout = setTimeout(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(wishlists));
    } catch (e) {
      // для прод версии
    }
    saveTimeout = null;
  }, 300);
};

export const useWishlistStore = defineStore("wishlist", {
  state: () => ({
    wishlists: [] as Wishlist[],
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
    init() {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        try {
          const parsed = JSON.parse(raw) || [];
          this.wishlists = parsed.map((w: any) => ({
            id: w.id || crypto.randomUUID(),
            title: w.title || "Untitled",
            theme: w.theme || "default",
            color: w.color || "#ffffff",
            icon: w.icon || "🎁",
            cover: w.cover || "",
            items: (w.items || []).map(
              (i: any): WishlistItem => ({
                id: i.id || crypto.randomUUID(),
                title: i.title || i.name || "Untitled Item",
                link: i.link || i.url || "",
                description: i.description || i.notes || "",
                price:
                  typeof i.price === "number"
                    ? i.price
                    : parseFloat(i.price) || 0,
                image: i.image || "",
                purchased: !!i.purchased,
              })
            ),
          })) as Wishlist[];
        } catch (e) {
          this.wishlists = [];
        }
      } else {
        this.wishlists = [];
      }
    },
    saveLocalStorage() {
      debouncedSave(this.wishlists);
    },
    createWishlist(title: string, theme: Wishlist["theme"], icon?: string) {
      const themeIcons: Record<Wishlist["theme"], string> = {
        default: "🎁",
        birthday: "🎂",
        newyear: "🎄",
      };

      const finalIcon = icon || themeIcons[theme] || "🎁";

      this.wishlists.push({
        id: crypto.randomUUID(),
        title,
        theme,
        color: "#ffffff",
        icon: finalIcon,
        cover: "",
        items: [],
      });

      this.saveLocalStorage();
    },
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
      if (!("color" in patch) && !("cover" in patch)) {
        this.saveLocalStorage();
      }
    },
    deleteWishlist(id: string) {
      this.wishlists = this.wishlists.filter((w) => w.id !== id);
      this.saveLocalStorage();
    },
    addItem(wishlistId: string, item: Omit<WishlistItem, "id" | "purchased">) {
      const wl = this.getWishlist(wishlistId);
      if (!wl) return;
      wl.items.push({
        id: crypto.randomUUID(),
        purchased: false,
        ...item,
      });
      this.saveLocalStorage();
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
      this.saveLocalStorage();
    },
    removeItem(wishlistId: string, itemId: string) {
      const wl = this.getWishlist(wishlistId);
      if (!wl) return;
      wl.items = wl.items.filter((i) => i.id !== itemId);
      this.saveLocalStorage();
    },
    togglePurchased(wishlistId: string, itemId: string) {
      const wl = this.getWishlist(wishlistId);
      if (!wl) return;
      const item = wl.items.find((i) => i.id === itemId);
      if (!item) return;
      item.purchased = !item.purchased;
      wl.items.sort((a, b) => Number(a.purchased) - Number(b.purchased));
      this.saveLocalStorage();
    },
    reorderItems(wishlistId: string, fromIndex: number, toIndex: number) {
      const wl = this.getWishlist(wishlistId);
      if (!wl || fromIndex === toIndex) return;
      const [item] = wl.items.splice(fromIndex, 1);
      if (item) {
        wl.items.splice(toIndex, 0, item);
      }
      this.saveLocalStorage();
    },
    getWishlist(id: string) {
      return this.wishlists.find((w) => w.id === id);
    },
  },
});
