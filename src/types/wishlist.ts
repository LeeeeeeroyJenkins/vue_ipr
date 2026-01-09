export interface WishlistItem {
  id: string;
  title: string;
  link?: string;
  description?: string;
  price?: number;
  image?: string;
  purchased: boolean;
}

export interface Wishlist {
  id: string;
  title: string;
  theme: "default" | "birthday" | "newyear";
  color: string;
  icon: string;
  cover?: string;
  items: WishlistItem[];
}
