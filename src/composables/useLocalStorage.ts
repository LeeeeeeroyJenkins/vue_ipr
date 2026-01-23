import { ref, watch, type Ref } from "vue";

export function useLocalStorage<T>(
  key: string,
  initialValue: T,
  debounceDelay = 300,
): {
  state: Ref<T>;
  set: (value: T) => void;
  mutate: (updater: (value: T) => void) => void;
} {
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
  const saveToStorage = (newValue: T) => {
    if (timeout !== null) clearTimeout(timeout);
    timeout = window.setTimeout(() => {
      try {
        localStorage.setItem(key, JSON.stringify(newValue));
      } catch (e) {
        console.warn(`Failed to save to localStorage for key "${key}"`);
      }
      timeout = null;
    }, debounceDelay);
  };

  watch(
    () => state.value,
    (newValue) => {
      saveToStorage(newValue as T);
    },
    { deep: true },
  );

  const mutate = (updater: (value: T) => void) => {
    updater(state.value as T);
    saveToStorage(state.value as T);
  };

  const set = (value: T) => {
    state.value = value;
  };

  return { state, set, mutate };
}