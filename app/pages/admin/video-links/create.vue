<script setup lang="ts">
import { VideoCategory } from "~/types/enums";
import { validateVideoLink, hasErrors } from "~/utils/validation";

definePageMeta({ layout: "admin", middleware: "sidebase-auth" });
useHead({ title: 'Add Video | LC Admin' });

const api = useApi();
const router = useRouter();

const form = ref({
    title: "", url: "", description: "",
    category: VideoCategory.SERMON as string,
    is_featured: false,
});

const errors = ref<Record<string, string>>({});
const loading = ref(false);

const validate = () => {
    errors.value = validateVideoLink({ title: form.value.title, url: form.value.url, category: form.value.category });
    return !hasErrors(errors.value);
};

const submit = async () => {
    if (!validate()) return;
    loading.value = true;
    try {
        await api.post("/videos", form.value);
        router.push("/admin/video-links");
    } catch (e: any) { alert(e.message || "Failed to add video"); }
    finally { loading.value = false; }
};

const categories = Object.values(VideoCategory);
</script>

<template>
    <div>
        <div class="page-header">
            <NuxtLink to="/admin/video-links" class="back-link">
                <Icon name="mdi:arrow-left" /> Back to Videos
            </NuxtLink>
        </div>
        <h2 class="page-title">Add Video Link</h2>

        <form @submit.prevent="submit" class="form-card">
            <div class="alert-info">
                <Icon name="mdi:youtube" class="text-red-600" />
                <p>Currently, only YouTube links are fully supported. The backend will automatically fetch the video ID,
                    duration, and high-quality thumbnails.</p>
            </div>

            <div class="field" :class="{ errored: errors.url }">
                <label>YouTube URL <span class="req">*</span></label>
                <input v-model="form.url" type="url" class="input" placeholder="https://www.youtube.com/watch?v=..." />
                <p v-if="errors.url" class="field-error">{{ errors.url }}</p>
            </div>

            <div class="field" :class="{ errored: errors.title }">
                <label>Title <span class="req">*</span></label>
                <input v-model="form.title" type="text" class="input" />
                <p v-if="errors.title" class="field-error">{{ errors.title }}</p>
            </div>

            <div class="field">
                <label>Description (Optional)</label>
                <textarea v-model="form.description" class="input textarea" rows="3"></textarea>
            </div>

            <div class="form-grid-2">
                <div class="field" :class="{ errored: errors.category }">
                    <label>Category <span class="req">*</span></label>
                    <select v-model="form.category" class="input">
                        <option v-for="c in categories" :key="c" :value="c">{{ c.charAt(0).toUpperCase() + c.slice(1) }}
                        </option>
                    </select>
                </div>
                <div class="field" style="justify-content: center;">
                    <label class="checkbox-item mt-4">
                        <input v-model="form.is_featured" type="checkbox" />
                        <span>Featured Video (Shows on homepage/hero sections)</span>
                    </label>
                </div>
            </div>

            <div class="form-actions">
                <NuxtLink to="/admin/video-links" class="btn-ghost">Cancel</NuxtLink>
                <button type="submit" :disabled="loading" class="btn-primary">
                    {{ loading ? "Processing…" : "Add Video" }}
                </button>
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

.form-card {
    background: #fff;
    border-radius: 12px;
    padding: 2rem;
    border: 1px solid #f4f4f5;
    max-width: 800px;
    display: flex;
    flex-direction: column;
    gap: 1.25rem;
}

.alert-info {
    background: #fee2e2;
    color: #991b1b;
    padding: 1rem 1.25rem;
    border-radius: 8px;
    display: flex;
    align-items: flex-start;
    gap: 0.6rem;
    font-size: 0.875rem;
    font-weight: 500;
    border: 1px solid #fca5a5;
}

.alert-info icon {
    font-size: 1.25rem;
    flex-shrink: 0;
}

.alert-info p {
    margin: 0;
}

.form-grid-2 {
    display: grid;
    grid-template-columns: 1fr 1fr;
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
}

.errored .input {
    border-color: #dc2626;
}

.field-error {
    font-size: 0.78rem;
    color: #dc2626;
    margin: 0;
}

.checkbox-item {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-size: 0.875rem;
    cursor: pointer;
    color: #27272a;
    font-weight: 500;
    text-transform: none !important;
    letter-spacing: 0 !important;
}

.checkbox-item input {
    accent-color: #E05615;
    width: 16px;
    height: 16px;
}

.mt-4 {
    margin-top: 1rem;
}

.form-actions {
    display: flex;
    justify-content: flex-end;
    gap: 0.75rem;
    padding-top: 1rem;
    border-top: 1px solid #f4f4f5;
    margin-top: 0.5rem;
}

.btn-primary {
    padding: 0.6rem 1.5rem;
    background: #E05615;
    color: #fff;
    border-radius: 8px;
    font-size: 0.875rem;
    font-weight: 600;
    border: none;
    cursor: pointer;
    transition: background 0.15s;
}

.btn-primary:hover {
    background: #B84410;
}

.btn-primary:disabled {
    opacity: 0.6;
    cursor: not-allowed;
}

.btn-ghost {
    display: flex;
    align-items: center;
    padding: 0.6rem 1.5rem;
    background: transparent;
    border: 1px solid #e4e4e7;
    border-radius: 8px;
    font-size: 0.875rem;
    font-weight: 600;
    color: #52525b;
    text-decoration: none;
    transition: all 0.15s;
}

.btn-ghost:hover {
    border-color: #27272a;
    color: #27272a;
}
</style>
