<script setup lang="ts">
import type { PostResponse } from "~/types/api";
import { PostCategory } from "~/types/enums";

definePageMeta({ layout: "admin", middleware: "auth" });

const api = useApi();
const route = useRoute();
const router = useRouter();
const postId = route.params.id as string;

const { data: postRes, pending, refresh } = await useAsyncData(
    `post-${postId}`,
    () => api.get<PostResponse>(`/posts/${postId}`)
);

const form = ref({
    title: "", subtitle: "", body: "", excerpt: "",
    category: "", tags: [] as string[],
    is_published: false, meta_description: "",
});
const tagInput = ref("");
const loading = ref(false);
const activeImageTab = ref(false);

watch(postRes, (r) => {
    if (r?.data) {
        form.value = {
            title: r.data.title, subtitle: r.data.subtitle ?? "",
            body: r.data.body, excerpt: r.data.excerpt ?? "",
            category: r.data.category, tags: r.data.tags ?? [],
            is_published: r.data.is_published, meta_description: r.data.meta_description ?? "",
        };
    }
}, { immediate: true });

const addTag = () => { const t = tagInput.value.trim(); if (t && !form.value.tags.includes(t)) form.value.tags.push(t); tagInput.value = ""; };
const removeTag = (i: number) => form.value.tags.splice(i, 1);

const updatePost = async () => {
    loading.value = true;
    try {
        await api.put<PostResponse>(`/posts/${postId}`, form.value);
        alert("Post updated successfully");
        refresh();
    } catch (e: any) { alert(e.message); }
    finally { loading.value = false; }
};

const deletePost = async () => {
    if (!confirm("Delete this post permanently?")) return;
    try { await api.delete(`/posts/${postId}`); router.push("/admin/posts"); }
    catch (e: any) { alert(e.message); }
};

const imageFiles = ref<File[]>([]);
const uploadingImages = ref(false);
const uploadImages = async () => {
    if (!imageFiles.value.length) return;
    uploadingImages.value = true;
    const fd = new FormData();
    imageFiles.value.forEach(f => fd.append("images[]", f));
    try {
        await api.post(`/posts/${postId}/images`, fd);
        alert("Images uploaded");
        refresh();
        imageFiles.value = [];
    } catch (e: any) { alert(e.message); }
    finally { uploadingImages.value = false; }
};

const setFeatured = async (imageId: string) => {
    try { await api.put(`/posts/${postId}/images/${imageId}/set-featured`); refresh(); }
    catch (e: any) { alert(e.message); }
};
const deleteImage = async (imageId: string) => {
    if (!confirm("Delete this image?")) return;
    try { await api.delete(`/posts/${postId}/images/${imageId}`); refresh(); }
    catch (e: any) { alert(e.message); }
};

const categories = Object.values(PostCategory);
</script>

<template>
    <div>
        <div class="page-header">
            <NuxtLink to="/admin/posts" class="back-link">
                <Icon name="mdi:arrow-left" /> Back to Posts
            </NuxtLink>
            <button @click="deletePost" class="btn-danger">
                <Icon name="mdi:trash-can" /> Delete Post
            </button>
        </div>
        <h2 class="page-title">Edit Post</h2>

        <div v-if="pending" class="form-card">
            <div class="sk-block"></div>
        </div>
        <div v-else-if="postRes?.data">
            <div class="tabs-bar">
                <button class="tab" :class="{ 'tab-active': !activeImageTab }"
                    @click="activeImageTab = false">Content</button>
                <button class="tab" :class="{ 'tab-active': activeImageTab }" @click="activeImageTab = true">Images ({{
                    postRes.data.images?.length ?? 0 }})</button>
            </div>

            <form v-if="!activeImageTab" @submit.prevent="updatePost" class="form-layout">
                <div class="form-main">
                    <div class="form-card">
                        <div class="field">
                            <label>Title</label>
                            <input v-model="form.title" type="text" class="input" />
                        </div>
                        <div class="field">
                            <label>Subtitle</label>
                            <input v-model="form.subtitle" type="text" class="input" />
                        </div>
                        <div class="field">
                            <label>Body</label>
                            <textarea v-model="form.body" class="input textarea" rows="12"></textarea>
                        </div>
                        <div class="field">
                            <label>Excerpt</label>
                            <textarea v-model="form.excerpt" class="input textarea" rows="3"></textarea>
                        </div>
                        <div class="field">
                            <label>Meta Description</label>
                            <input v-model="form.meta_description" type="text" class="input" />
                        </div>
                    </div>
                </div>
                <div class="form-sidebar">
                    <div class="form-card">
                        <div class="field">
                            <label>Category</label>
                            <select v-model="form.category" class="input">
                                <option v-for="c in categories" :key="c" :value="c">{{ c.charAt(0).toUpperCase() +
                                    c.slice(1) }}</option>
                            </select>
                        </div>
                        <div class="field">
                            <label>Tags</label>
                            <div class="tags-input">
                                <input v-model="tagInput" @keydown.enter.prevent="addTag" type="text" class="input"
                                    placeholder="Add tag + Enter" />
                                <div class="tags-list">
                                    <span v-for="(tag, i) in form.tags" :key="i" class="tag">{{ tag }} <button
                                            type="button" @click="removeTag(i)" class="tag-remove">×</button></span>
                                </div>
                            </div>
                        </div>
                        <label class="checkbox-item">
                            <input v-model="form.is_published" type="checkbox" />
                            <span>{{ form.is_published ? "Published" : "Draft" }}</span>
                        </label>
                        <div class="form-actions">
                            <button type="submit" :disabled="loading" class="btn-primary w-full">{{ loading ? "Saving…"
                                : "Save Changes" }}</button>
                        </div>
                    </div>
                </div>
            </form>

            <div v-if="activeImageTab" class="form-card">
                <h3 class="section-label">Upload Images</h3>
                <input type="file" multiple accept="image/*"
                    @change="(e) => imageFiles = Array.from((e.target as HTMLInputElement).files ?? [])"
                    class="file-input" />
                <button @click="uploadImages" :disabled="!imageFiles.length || uploadingImages"
                    class="btn-primary mt-2">{{ uploadingImages ? "Uploading…" : "Upload Images" }}</button>

                <div class="images-grid" v-if="postRes.data.images?.length">
                    <div v-for="img in postRes.data.images" :key="img.id" class="img-card">
                        <img :src="img.image_url" class="img-thumb" />
                        <div class="img-actions">
                            <span v-if="img.is_featured" class="badge-primary">Featured</span>
                            <button v-else @click="setFeatured(img.id)" class="img-btn">Set Featured</button>
                            <button @click="deleteImage(img.id)" class="img-btn danger">Delete</button>
                        </div>
                    </div>
                </div>
                <p v-else class="muted-text">No images attached.</p>
            </div>
        </div>
    </div>
</template>

<style scoped>
.page-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
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
    margin: 0 0 1.25rem;
}

.btn-danger {
    display: flex;
    align-items: center;
    gap: 0.4rem;
    padding: 0.5rem 1rem;
    background: #fee2e2;
    color: #dc2626;
    border: 1px solid #fca5a5;
    border-radius: 8px;
    font-size: 0.8rem;
    font-weight: 600;
    cursor: pointer;
}

.btn-danger:hover {
    background: #dc2626;
    color: #fff;
}

.tabs-bar {
    display: flex;
    gap: 0.25rem;
    border-bottom: 1px solid #e4e4e7;
    margin-bottom: 1.25rem;
}

.tab {
    padding: 0.6rem 1.2rem;
    background: transparent;
    border: none;
    border-bottom: 2px solid transparent;
    font-size: 0.875rem;
    font-weight: 600;
    color: #71717a;
    cursor: pointer;
    margin-bottom: -1px;
}

.tab-active {
    color: #E05615;
    border-bottom-color: #E05615;
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
    margin-top: 0.5rem;
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

.section-label {
    font-size: 0.9rem;
    font-weight: 700;
    color: #27272a;
    margin: 0;
}

.images-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
    gap: 1rem;
    margin-top: 1rem;
}

.img-card {
    border-radius: 8px;
    overflow: hidden;
    border: 1px solid #f4f4f5;
}

.img-thumb {
    width: 100%;
    aspect-ratio: 16/9;
    object-fit: cover;
    display: block;
}

.img-actions {
    padding: 0.5rem;
    display: flex;
    gap: 0.35rem;
    flex-wrap: wrap;
}

.img-btn {
    font-size: 0.72rem;
    font-weight: 600;
    padding: 0.25rem 0.5rem;
    border-radius: 5px;
    border: 1px solid #e4e4e7;
    background: #fff;
    cursor: pointer;
}

.img-btn:hover {
    border-color: #E05615;
    color: #E05615;
}

.img-btn.danger {
    color: #dc2626;
}

.img-btn.danger:hover {
    background: #dc2626;
    color: #fff;
    border-color: #dc2626;
}

.badge-primary {
    font-size: 0.72rem;
    font-weight: 700;
    background: #dcfce7;
    color: #16a34a;
    padding: 0.2rem 0.5rem;
    border-radius: 99px;
}

.muted-text {
    color: #a1a1aa;
    font-size: 0.875rem;
}

.sk-block {
    height: 200px;
    background: #f4f4f5;
    border-radius: 8px;
    animation: pulse 1.5s ease-in-out infinite;
}

@keyframes pulse {

    0%,
    100% {
        opacity: 1;
    }

    50% {
        opacity: 0.4;
    }
}
</style>
