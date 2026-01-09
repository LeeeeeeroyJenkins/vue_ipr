<script setup lang="ts">
import { ref, watch } from "vue";

const props = defineProps<{ modelValue: string }>();
const emit = defineEmits<{ "update:modelValue": [string] }>();

const editing = ref(false);
const value = ref(props.modelValue);

watch(() => props.modelValue, (v) => (value.value = v));

function save() {
  emit("update:modelValue", value.value.trim());
  editing.value = false;
}
</script>

<template>
  <span v-if="!editing" @click="editing = true">{{ modelValue }}</span>
  <input v-else v-model="value" @keyup.enter="save" @blur="save" autofocus />
</template>
