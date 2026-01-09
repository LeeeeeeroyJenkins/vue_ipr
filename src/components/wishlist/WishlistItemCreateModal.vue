<script setup lang="ts">
import { ref } from "vue";
import Modal from "../../components/ui/Modal.vue";
import { useWishlistStore } from "../../stores/wishlist.store";
import type { WishlistItem } from "../../types/wishlist";

const props = defineProps<{ wishlistId: string }>();
const store = useWishlistStore();

const open = ref(false);
const title = ref("");
const description = ref("");
const link = ref("");
const price = ref<number | null>(null);
const selectedFile = ref<File | null>(null);
const fileName = ref("");

function onFileChange(e: Event) {
    const target = e.target as HTMLInputElement;
    const file = target.files?.[0] || null;
    selectedFile.value = file;
    fileName.value = file?.name || "";
}

function save() {
    if (!title.value.trim()) return;

    const newItem: Omit<WishlistItem, "id" | "purchased"> = {
        title: title.value,
        description: description.value || undefined,
        link: link.value || undefined,
        price: price.value || undefined,
    };

    if (selectedFile.value) {
        const reader = new FileReader();
        reader.onload = (e) => {
            newItem.image = e.target?.result as string;
            store.addItem(props.wishlistId, newItem);
            resetForm();
        };
        reader.readAsDataURL(selectedFile.value);
    } else {
        store.addItem(props.wishlistId, newItem);
        resetForm();
    }
}

function resetForm() {
    title.value = description.value = link.value = "";
    price.value = null;
    selectedFile.value = null;
    fileName.value = "";
    open.value = false;
}
</script>

<template>
    <button @click="open = true" class="add-btn">+ Добавить элемент</button>

    <Modal :open="open" @close="resetForm">
        <div class="modal-wrapper">
            <button class="modal-close" @click="resetForm">×</button>

            <h3 class="modal-title">Добавить элемент</h3>

            <label class="form-label">Название</label>
            <input v-model="title" placeholder="Название" class="form-input" />

            <label class="form-label">Описание</label>
            <textarea v-model="description" placeholder="Описание" class="form-textarea"></textarea>

            <label class="form-label">Ссылка</label>
            <input v-model="link" placeholder="Ссылка" class="form-input" />

            <label class="form-label">Цена</label>
            <input v-model.number="price" type="number" placeholder="Цена" class="form-input" />

            <label class="form-label">Изображение</label>
            <input type="file" accept="image/*" @change="onFileChange" class="form-input" />
            <div v-if="fileName" class="file-preview">
                {{ fileName }}
                <button @click="onFileChange({ target: { files: [] } } as any)" class="remove-file">×</button>
            </div>

            <button @click="save" class="save-btn">Добавить</button>
        </div>
    </Modal>
</template>

<style scoped>
.add-btn {
    background: linear-gradient(135deg, #3b82f6, #2563eb);
    color: white;
    border: none;
    padding: 10px 16px;
    border-radius: 8px;
    cursor: pointer;
    font-size: 1.1rem;
    font-weight: bold;
    transition: transform 0.2s ease, background 0.3s ease;
}

.add-btn:hover {
    transform: translateY(-2px);
    background: linear-gradient(135deg, #2563eb, #1e40af);
}

.modal-wrapper {
    position: relative;
    display: flex;
    flex-direction: column;
    gap: 12px;
}

.modal-title {
    font-size: 1.5rem;
    font-weight: 700;
    text-align: center;
    color: #1f2937;
    margin-bottom: 12px;
}

.modal-close {
    position: absolute;
    top: 12px;
    right: 12px;
    background: white;
    border: none;
    border-radius: 50%;
    width: 28px;
    height: 28px;
    font-size: 1.2rem;
    font-weight: bold;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: background 0.2s;
}

.form-label {
    font-weight: 600;
    color: #374151;
    margin-bottom: 4px;
}

.form-input,
.form-textarea {
    width: 100%;
    padding: 10px 12px;
    border-radius: 8px;
    border: 1px solid #d1d5db;
    font-size: 1rem;
    color: #111827;
    transition: border-color 0.2s;
}

.form-input:focus,
.form-textarea:focus {
    border-color: #3b82f6;
    outline: none;
    box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.2);
}

.form-textarea {
    resize: vertical;
    min-height: 60px;
}

.file-preview {
    background: #f3f4f6;
    padding: 8px 12px;
    border-radius: 6px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 0.9rem;
    color: #374151;
    margin-bottom: 12px;
}

.remove-file {
    background: #ef4444;
    color: white;
    border: none;
    padding: 4px 8px;
    border-radius: 6px;
    cursor: pointer;
    font-size: 0.8rem;
    transition: background 0.2s;
}

.remove-file:hover {
    background: #dc2626;
}

.save-btn {
    background: linear-gradient(135deg, #10b981, #059669);
    color: white;
    border: none;
    padding: 10px;
    border-radius: 8px;
    cursor: pointer;
    font-weight: bold;
    font-size: 1rem;
    transition: transform 0.2s, background 0.3s;
}

.save-btn:hover {
    transform: translateY(-1px);
    background: linear-gradient(135deg, #059669, #047857);
}

@media (max-width: 480px) {
    .modal-wrapper {
        gap: 10px;
    }

    .form-input,
    .form-textarea {
        padding: 8px;
    }
}
</style>
