<script setup lang="ts">
import type { PostResponse } from "~/types/api";
import { PostCategory } from "~/types/enums";
import { validatePost, hasErrors } from "~/utils/validation";
import { toast } from 'vue-sonner';

definePageMeta({ layout: "admin", middleware: "sidebase-auth" });
useHead({ title: 'Create Post | LC Admin' });

const api = useApi();
const router = useRouter();

const form = ref({
    title: "",
    subtitle: "",
    body: "",
    excerpt: "",
    category: PostCategory.DEVOTIONAL as string,
    tags: [] as string[],
    meta_description: "",
});
const tagInput = ref("");
const errors = ref<Record<string, string>>({});
const loading = ref(false);

const MAX_EXCERPT_LENGTH = 500;
const excerptLength = computed(() => form.value.excerpt.length);

const imageFile = ref<File | null>(null);
const imagePreview = ref<string>("");
const fileInputRef = ref<HTMLInputElement>();

const handleFileSelect = (e: Event) => {
    const files = Array.from((e.target as HTMLInputElement).files ?? []);
    if (files.length) {
        imageFile.value = files[0];
        const reader = new FileReader();
        reader.onload = (event) => {
            imagePreview.value = event.target?.result as string;
        };
        reader.readAsDataURL(files[0]);
    }
};

const clearImage = () => {
    imageFile.value = null;
    imagePreview.value = "";
    if (fileInputRef.value) {
        fileInputRef.value.value = "";
    }
};

const addTag = () => {
    const t = tagInput.value.trim();
    if (t && !form.value.tags.includes(t)) form.value.tags.push(t);
    tagInput.value = "";
};
const removeTag = (i: number) => form.value.tags.splice(i, 1);

const validate = () => {
    errors.value = validatePost({ title: form.value.title, body: form.value.body, category: form.value.category });
    return !hasErrors(errors.value);
};
const submit = async () => {
    if (!validate()) return;
    loading.value = true;
    try {
        const formData = new FormData();
        // Add form fields
        Object.entries(form.value).forEach(([key, value]) => {
            if (Array.isArray(value)) {
                value.forEach((item, index) => {
                    formData.append(`${key}[${index}]`, item);
                });
            } else {
                formData.append(key, value as string);
            }
        });
        // Add image if selected
        if (imageFile.value) {
            formData.append("image", imageFile.value);
        }
        await api.post<PostResponse>("/posts", formData);
        router.push("/admin/posts");
    } catch (e: any) { toast.error(e.message || "Failed to create post"); }
    finally { loading.value = false; }
};

const categories = Object.values(PostCategory);
</script>

<template>
    <div>
        <div class="page-header">
            <NuxtLink to="/admin/posts" class="back-link">
                <Icon name="mdi:arrow-left" /> Back to Posts
            </NuxtLink>
        </div>
        <h2 class="page-title">Create Post</h2>
        <form @submit.prevent="submit" class="form-layout">
            <!-- Main content -->
            <div class="form-main">
                <div class="form-card">
                    <div class="field" :class="{ errored: errors.title }">
                        <label>Title <span class="req">*</span></label>
                        <input v-model="form.title" type="text" class="input" />
                        <p v-if="errors.title" class="field-error">{{ errors.title }}</p>
                    </div>
                    <div class="field">
                        <label>Subtitle</label>
                        <input v-model="form.subtitle" type="text" class="input" />
                    </div>
                    <div class="field" :class="{ errored: errors.body }">
                        <label>Body <span class="req">*</span></label>
                        <AdminTiptapEditor v-model="form.body" :has-error="!!errors.body" />
                        <p v-if="errors.body" class="field-error">{{ errors.body }}</p>
                    </div>
                    <div class="field">
                        <label>Excerpt</label>
                        <textarea v-model="form.excerpt" class="input textarea" rows="3" :maxlength="MAX_EXCERPT_LENGTH"
                            placeholder="Short summary shown on the post listing…"></textarea>
                        <p class="char-counter" :class="{ 'char-limit-near': excerptLength > 450 }">
                            {{ excerptLength }} / {{ MAX_EXCERPT_LENGTH }}
                        </p>
                    </div>
                    <div class="field">
                        <label>Meta Description (SEO)</label>
                        <input v-model="form.meta_description" type="text" class="input" />
                    </div>

                    <!-- Image Upload -->
                    <div class="field">
                        <label>Post Image</label>
                        <div class="upload-area">
                            <input ref="fileInputRef" type="file" accept="image/*" style="display: none"
                                @change="handleFileSelect" />

                            <!-- Upload Icon or Preview -->
                            <div v-if="!imageFile" @click="$refs.fileInputRef?.click()" class="upload-trigger">
                                <Icon name="mdi:plus" class="upload-icon" />
                                <p class="upload-text">Click to select image</p>
                            </div>

                            <div v-else class="preview-container">
                                <img :src="imagePreview" :alt="imageFile.name" class="preview-image" />
                                <button type="button" @click="clearImage" class="clear-btn" title="Remove image">
                                    <Icon name="mdi:close" />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <!-- Sidebar -->
            <div class="form-sidebar">
                <div class="form-card">
                    <div class="field" :class="{ errored: errors.category }">
                        <label>Category <span class="req">*</span></label>
                        <select v-model="form.category" class="input">
                            <option v-for="c in categories" :key="c" :value="c">{{ c.charAt(0).toUpperCase() +
                                c.slice(1) }}</option>
                        </select>
                        <p v-if="errors.category" class="field-error">{{ errors.category }}</p>
                    </div>
                    <div class="field">
                        <label>Tags</label>
                        <div class="tags-input">
                            <input v-model="tagInput" @keydown.enter.prevent="addTag" type="text" class="input"
                                placeholder="Type and press Enter" />
                            <div class="tags-list">
                                <span v-for="(tag, i) in form.tags" :key="i" class="tag">
                                    {{ tag }} <button type="button" @click="removeTag(i)" class="tag-remove">×</button>
                                </span>
                            </div>
                        </div>
                    </div>
                    <div class="form-actions">
                        <button type="submit" :disabled="loading" class="btn-primary w-full">
                            {{ loading ? "Creating…" : "Create Post" }}
                        </button>
                    </div>
                </div>
            </div>
        </form>
    </div>
</template>

<style scoped>
.page-header {
    margin-bottom: 1rem;
}

.back-link {
    display: inline-flex;
    align-items: center;
    gap: 0.3rem;
    font-size: 0.85rem;
    font-weight: 600;
    color: #E05615;
    text-decoration: none;
}

.back-link:hover {
    text-decoration: underline;
}

.page-title {
    font-size: 1.5rem;
    font-weight: 800;
    color: #1A0E08;
    margin: 0 0 1.5rem;
}

.form-layout {
    display: grid;
    grid-template-columns: 1fr 320px;
    gap: 1.25rem;
    align-items: start;
}

@media (max-width: 1100px) {
    .form-layout {
        grid-template-columns: 1fr;
    }
}

.form-main,
.form-sidebar {
    display: flex;
    flex-direction: column;
    gap: 1.25rem;
}

.form-card {
    background: #fff;
    border-radius: 12px;
    padding: 1.75rem;
    border: 1px solid #f4f4f5;
    display: flex;
    flex-direction: column;
    gap: 1.25rem;
}

.field {
    display: flex;
    flex-direction: column;
    gap: 0.4rem;
}

.field label {
    font-size: 0.78rem;
    font-weight: 600;
    color: #52525b;
    text-transform: uppercase;
    letter-spacing: 0.04em;
}

.req {
    color: #E05615;
}

.input {
    padding: 0.55rem 0.85rem;
    border: 1px solid #e4e4e7;
    border-radius: 8px;
    font-size: 0.875rem;
    outline: none;
    background: #fafafa;
    transition: border 0.15s;
    width: 100%;
}

.input:focus {
    border-color: #E05615;
    background: #fff;
}

.textarea {
    resize: vertical;
    font-family: inherit;
}

.errored .input {
    border-color: #dc2626;
}

.field-error {
    font-size: 0.78rem;
    color: #dc2626;
    margin: 0;
}

.char-counter {
    font-size: 0.75rem;
    color: #71717a;
    text-align: right;
    margin: 0;
    font-weight: 500;
}

.char-counter.char-limit-near {
    color: #E05615;
    font-weight: 600;
}

.tags-input {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
}

.tags-list {
    display: flex;
    flex-wrap: wrap;
    gap: 0.35rem;
}

.tag {
    display: inline-flex;
    align-items: center;
    gap: 0.3rem;
    background: rgba(224, 86, 21, 0.1);
    color: #E05615;
    border-radius: 99px;
    padding: 0.2rem 0.6rem;
    font-size: 0.78rem;
    font-weight: 600;
}

.tag-remove {
    background: none;
    border: none;
    cursor: pointer;
    color: inherit;
    font-size: 0.9rem;
    line-height: 1;
    padding: 0;
}

.checkbox-item {
    display: flex;
    align-items: center;
    gap: 0.4rem;
    font-size: 0.875rem;
    cursor: pointer;
}

.checkbox-item input {
    accent-color: #E05615;
}

.form-actions {
    margin-top: 0.5rem;
}

.btn-primary {
    display: block;
    padding: 0.65rem 1.5rem;
    background: #E05615;
    color: #fff;
    border-radius: 8px;
    font-size: 0.875rem;
    font-weight: 600;
    border: none;
    cursor: pointer;
    text-align: center;
}

.btn-primary:hover {
    background: #B84410;
}

.btn-primary:disabled {
    opacity: 0.6;
    cursor: not-allowed;
}

.w-full {
    width: 100%;
}

.upload-area {
    margin-bottom: 0;
}

.upload-trigger {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 2rem;
    border: 2px dashed #e4e4e7;
    border-radius: 12px;
    cursor: pointer;
    transition: all 0.15s;
    background: #fafafa;
}

.upload-trigger:hover {
    border-color: #E05615;
    background: #fff9f5;
}

.upload-icon {
    font-size: 2.5rem;
    color: #E05615;
    margin-bottom: 0.5rem;
}

.upload-text {
    font-size: 0.875rem;
    color: #71717a;
    margin: 0;
    font-weight: 500;
}

.preview-container {
    position: relative;
    display: inline-block;
}

.preview-image {
    max-width: 200px;
    max-height: 200px;
    border-radius: 8px;
    border: 1px solid #e4e4e7;
    display: block;
    object-fit: cover;
}

.clear-btn {
    position: absolute;
    top: -8px;
    right: -8px;
    width: 32px;
    height: 32px;
    border-radius: 50%;
    background: #dc2626;
    color: #fff;
    border: none;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    font-size: 1.2rem;
    transition: background 0.15s;
}

.clear-btn:hover {
    background: #991b1b;
}
</style>
