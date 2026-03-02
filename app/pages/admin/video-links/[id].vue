<script setup lang="ts">
import type { VideoLinkResponse } from "~/types/api";
import { VideoCategory, VideoStatus } from "~/types/enums";
import { validateVideoLink, hasErrors } from "~/utils/validation";

definePageMeta({ layout: "admin", middleware: "sidebase-auth" });

const api = useApi();
const route = useRoute();
const router = useRouter();
const videoId = route.params.id as string;

const { data: videoRes, pending, refresh } = await useAsyncData(
    `video-${videoId}`,
    () => api.get<VideoLinkResponse>(`/videos/${videoId}`)
);

const form = ref({
    title: "", url: "", description: "",
    category: "", status: "",
    is_featured: false,
});

const errors = ref<Record<string, string>>({});
const loading = ref(false);

watch(videoRes, (r) => {
    if (r?.data) {
        form.value = {
            title: r.data.title, url: r.data.url,
            description: r.data.description ?? "",
            category: r.data.category, status: r.data.status,
            is_featured: r.data.is_featured,
        };
    }
}, { immediate: true });

const validate = () => {
    errors.value = validateVideoLink({ title: form.value.title, url: form.value.url, category: form.value.category });
    return !hasErrors(errors.value);
};

const updateVideo = async () => {
    if (!validate()) return;
    loading.value = true;
    try {
        await api.put(`/videos/${videoId}`, form.value);
        alert("Video updated successfully");
        refresh();
    } catch (e: any) { alert(e.message); }
    finally { loading.value = false; }
};

const deleteVideo = async () => {
    if (!confirm("Delete this video permanently?")) return;
    try { await api.delete(`/videos/${videoId}`); router.push("/admin/video-links"); }
    catch (e: any) { alert(e.message); }
};

const categories = Object.values(VideoCategory);
</script>

<template>
    <div>
        <div class="page-header">
            <NuxtLink to="/admin/video-links" class="back-link">
                <Icon name="mdi:arrow-left" /> Back to Videos
            </NuxtLink>
            <button @click="deleteVideo" class="btn-danger">
                <Icon name="mdi:trash-can" /> Delete Video
            </button>
        </div>
        <h2 class="page-title">Edit Video Link</h2>

        <div v-if="pending && !videoRes" class="sk-block"></div>
        <div v-else-if="videoRes?.data" class="content-layout">
            <!-- Form -->
            <form @submit.prevent="updateVideo" class="form-card">
                <div class="field" :class="{ errored: errors.url }">
                    <label>YouTube URL</label>
                    <input v-model="form.url" type="url" class="input" />
                    <p v-if="errors.url" class="field-error">{{ errors.url }}</p>
                </div>
                <div class="field" :class="{ errored: errors.title }">
                    <label>Title</label>
                    <input v-model="form.title" type="text" class="input" />
                    <p v-if="errors.title" class="field-error">{{ errors.title }}</p>
                </div>
                <div class="field">
                    <label>Description</label>
                    <textarea v-model="form.description" class="input textarea" rows="3"></textarea>
                </div>
                <div class="form-grid-2">
                    <div class="field" :class="{ errored: errors.category }">
                        <label>Category</label>
                        <select v-model="form.category" class="input">
                            <option v-for="c in categories" :key="c" :value="c">{{ c.charAt(0).toUpperCase() +
                                c.slice(1) }}</option>
                        </select>
                    </div>
                    <div class="field">
                        <label>Status</label>
                        <select v-model="form.status" class="input">
                            <option :value="VideoStatus.ACTIVE">Active</option>
                            <option :value="VideoStatus.INACTIVE">Inactive</option>
                        </select>
                    </div>
                </div>
                <div class="field">
                    <label class="checkbox-item mt-2">
                        <input v-model="form.is_featured" type="checkbox" />
                        <span>Featured Video (Shows on homepage/hero sections)</span>
                    </label>
                </div>
                <div class="form-actions">
                    <button type="submit" :disabled="loading" class="btn-primary">
                        {{ loading ? "Saving…" : "Save Changes" }}
                    </button>
                </div>
            </form>

            <!-- Preview -->
            <div class="preview-card">
                <h3 class="preview-title">Video Preview</h3>
                <div class="video-container" v-if="videoRes.data.embed_url">
                    <iframe :src="videoRes.data.embed_url" frameborder="0"
                        allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
                        allowfullscreen></iframe>
                </div>
                <div v-else class="preview-placeholder">No preview available</div>

                <div class="meta-data mt-4">
                    <div class="meta-row"><span>Video ID:</span> <strong>{{ videoRes.data.video_id }}</strong></div>
                    <div class="meta-row" v-if="videoRes.data.formatted_duration"><span>Duration:</span> <strong>{{
                        videoRes.data.formatted_duration }}</strong></div>
                    <div class="meta-row"><span>Views (Local tracking):</span> <strong>{{ videoRes.data.view_count
                    }}</strong></div>
                </div>
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

.page-title {
    font-size: 1.5rem;
    font-weight: 800;
    color: #1A0E08;
    margin: 0 0 1.5rem;
}

.content-layout {
    display: grid;
    grid-template-columns: minmax(0, 1.3fr) minmax(0, 1fr);
    gap: 1.5rem;
    align-items: start;
}

@media (max-width: 1024px) {
    .content-layout {
        grid-template-columns: 1fr;
    }
}

.form-card {
    background: #fff;
    border-radius: 12px;
    padding: 2rem;
    border: 1px solid #f4f4f5;
    display: flex;
    flex-direction: column;
    gap: 1.25rem;
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

.mt-2 {
    margin-top: 0.5rem;
}

.mt-4 {
    margin-top: 1.5rem;
}

.form-actions {
    display: flex;
    justify-content: flex-end;
    padding-top: 1rem;
    border-top: 1px solid #f4f4f5;
    margin-top: 0.5rem;
}

.btn-primary {
    padding: 0.65rem 1.5rem;
    background: #E05615;
    color: #fff;
    border-radius: 8px;
    font-size: 0.875rem;
    font-weight: 600;
    border: none;
    cursor: pointer;
}

.btn-primary:hover {
    background: #B84410;
}

.btn-primary:disabled {
    opacity: 0.6;
    cursor: not-allowed;
}

.preview-card {
    background: #fff;
    border-radius: 12px;
    padding: 1.5rem;
    border: 1px solid #f4f4f5;
}

.preview-title {
    font-size: 1.1rem;
    font-weight: 700;
    color: #1A0E08;
    margin: 0 0 1rem;
}

.video-container {
    width: 100%;
    aspect-ratio: 16/9;
    background: #000;
    border-radius: 8px;
    overflow: hidden;
}

.video-container iframe {
    width: 100%;
    height: 100%;
}

.preview-placeholder {
    width: 100%;
    aspect-ratio: 16/9;
    background: #f4f4f5;
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #a1a1aa;
    font-size: 0.875rem;
}

.meta-data {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    background: #fafafa;
    padding: 1rem;
    border-radius: 8px;
    font-size: 0.85rem;
}

.meta-row {
    display: flex;
    justify-content: space-between;
    border-bottom: 1px solid #e4e4e7;
    padding-bottom: 0.4rem;
}

.meta-row:last-child {
    border-bottom: none;
    padding-bottom: 0;
}

.meta-row span {
    color: #71717a;
}

.meta-row strong {
    color: #27272a;
}

.sk-block {
    height: 300px;
    background: #f4f4f5;
    border-radius: 12px;
    animation: pulse 1.5s ease-in-out infinite;
}

@keyframes pulse {

    0%,
    100% {
        opacity: 1;
    }

    50% {
        opacity: 0.5;
    }
}
</style>
