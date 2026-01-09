import { ref, watch } from "vue";

export function useDebounce<T>(source: () => T, delay = 300) {
  const debounced = ref(source()) as any;
  let timer: number;

  watch(source, (v) => {
    clearTimeout(timer);
    timer = window.setTimeout(() => (debounced.value = v), delay);
  });

  return debounced;
}
