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
    title: "", subtitle: "", body: "", excerpt: "",
    category: PostCategory.SERMON as string,
    tags: [] as string[],
    meta_description: "",
});
const tagInput = ref("");
const errors = ref<Record<string, string>>({});
const loading = ref(false);

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
        await api.post<PostResponse>("/posts", form.value);
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
                        <textarea v-model="form.excerpt" class="input textarea" rows="3"
                            placeholder="Short summary shown on the post listing…"></textarea>
                    </div>
                    <div class="field">
                        <label>Meta Description (SEO)</label>
                        <input v-model="form.meta_description" type="text" class="input" />
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
</style>
