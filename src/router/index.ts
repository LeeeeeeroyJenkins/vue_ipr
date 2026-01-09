import { createRouter, createWebHistory } from "vue-router";
import HomeView from "../views/HomeView.vue";
import WishlistView from "../views/WishlistView.vue";

export default createRouter({
  history: createWebHistory(),
  routes: [
    { path: "/", component: HomeView },
    { path: "/wishlist/:id", component: WishlistView },
  ],
});
