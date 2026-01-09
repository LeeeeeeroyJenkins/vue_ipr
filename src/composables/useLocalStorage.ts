import { watch } from "vue";
import type { Ref } from "vue";

export function useLocalStorage<T>(key: string, state: Ref<T>) {
  const raw = localStorage.getItem(key);
  if (raw) state.value = JSON.parse(raw);

  watch(state, (v) => localStorage.setItem(key, JSON.stringify(v)), {
    deep: true,
  });
}
