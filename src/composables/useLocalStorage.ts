import { ref, watch, type Ref } from "vue";

export function useLocalStorage<T>(
  key: string,
  initialValue: T,
  debounceDelay = 300,
): Ref<T> {
  const state = ref<T>(initialValue) as Ref<T>;

  const raw = localStorage.getItem(key);
  if (raw) {
    try {
      state.value = JSON.parse(raw) as T;
    } catch (e) {
      console.warn(`Failed to parse localStorage for key "${key}"`);
    }
  }

  let timeout: number | null = null;
  watch(
    () => state.value,
    (newValue) => {
      if (timeout !== null) clearTimeout(timeout);
      timeout = window.setTimeout(() => {
        try {
          localStorage.setItem(key, JSON.stringify(newValue));
        } catch (e) {
          console.warn(`Failed to save to localStorage for key "${key}"`);
        }
        timeout = null;
      }, debounceDelay);
    },
    { deep: true },
  );

  return state;
}
