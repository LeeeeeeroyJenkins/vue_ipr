import { ref } from "vue";

export function useInlineEdit(value: string) {
  const editing = ref(false);
  const local = ref(value);

  function start() {
    editing.value = true;
  }

  function stop() {
    editing.value = false;
  }

  return { editing, local, start, stop };
}
