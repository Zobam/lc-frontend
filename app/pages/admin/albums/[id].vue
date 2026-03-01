<script setup lang="ts">
import type { AlbumResponse, EventsListResponse } from "~/types/api";
import { AlbumCategory, AlbumStatus } from "~/types/enums";

definePageMeta({ layout: "admin", middleware: "auth" });

const api = useApi();
const route = useRoute();
const router = useRouter();
const albumId = route.params.id as string;

const { data: albumRes, pending, refresh } = await useAsyncData(
    `album-${albumId}`,
    () => api.get<AlbumResponse>(`/albums/${albumId}`)
);

const { data: eventsData } = await useAsyncData(
    "events-list-edit",
    () => api.get<EventsListResponse>("/events", { per_page: 50 }),
    { lazy: true }
);

const form = ref({
    title: "", description: "",
    category: "", status: "",
    event_id: "" as string | null,
});

const loading = ref(false);
const activeTab = ref<"images" | "details">("images");

watch(albumRes, (r) => {
    if (r?.data) {
        form.value = {
            title: r.data.title, description: r.data.description ?? "",
            category: r.data.category, status: r.data.status,
            event_id: r.data.event_id,
        };
    }
}, { immediate: true });

const updateAlbum = async () => {
    loading.value = true;
    try {
        const payload = { ...form.value, event_id: form.value.event_id || undefined };
        await api.put<AlbumResponse>(`/albums/${albumId}`, payload);
        alert("Album updated successfully");
        refresh();
    } catch (e: any) { alert(e.message || "Failed to update album"); }
    finally { loading.value = false; }
};

const deleteAlbum = async () => {
    if (!confirm("Delete this album? All images will be removed.")) return;
    try { await api.delete(`/albums/${albumId}`); router.push("/admin/albums"); }
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
        await api.post(`/albums/${albumId}/images`, fd);
        alert("Images uploaded successfully");
        refresh();
        imageFiles.value = [];
    } catch (e: any) { alert(e.message || "Failed to upload images"); }
    finally { uploadingImages.value = false; }
};

const setCover = async (imageId: string) => {
    try { await api.put(`/albums/${albumId}/images/${imageId}/set-cover`); refresh(); }
    catch (e: any) { alert(e.message); }
};
const toggleVisibility = async (imageId: string, currentStatus: string) => {
    try {
        const newStatus = currentStatus === "visible" ? "hidden" : "visible";
        await api.put(`/albums/${albumId}/images/${imageId}/status`, { status: newStatus });
        refresh();
    } catch (e: any) { alert(e.message); }
};
const deleteImage = async (imageId: string) => {
    if (!confirm("Delete this image permanently?")) return;
    try { await api.delete(`/albums/${albumId}/images/${imageId}`); refresh(); }
    catch (e: any) { alert(e.message); }
};

const categories = Object.values(AlbumCategory);
</script>

<template>
    <div>
        <div class="page-header">
            <NuxtLink to="/admin/albums" class="back-link">
                <Icon name="mdi:arrow-left" /> Back to Albums
            </NuxtLink>
            <button @click="deleteAlbum" class="btn-danger">
                <Icon name="mdi:trash-can" /> Delete Album
            </button>
        </div>

        <div v-if="pending && !albumRes" class="sk-block"></div>
        <div v-else-if="albumRes?.data">
            <div class="album-meta">
                <h2 class="page-title">{{ albumRes.data.title }}</h2>
                <div class="badges">
                    <span class="badge" :class="albumRes.data.status === 'published' ? 'badge-green' : 'badge-gray'">{{
                        albumRes.data.status }}</span>
                    <span class="badge badge-blue">Photos: {{ albumRes.data.images_count }}</span>
                </div>
            </div>

            <div class="tabs-bar">
                <button class="tab" :class="{ 'tab-active': activeTab === 'images' }"
                    @click="activeTab = 'images'">Images</button>
                <button class="tab" :class="{ 'tab-active': activeTab === 'details' }"
                    @click="activeTab = 'details'">Album Details</button>
            </div>

            <!-- Details Tab -->
            <form v-if="activeTab === 'details'" @submit.prevent="updateAlbum" class="form-card">
                <div class="field">
                    <label>Album Title</label>
                    <input v-model="form.title" type="text" class="input" />
                </div>
                <div class="field">
                    <label>Description</label>
                    <textarea v-model="form.description" class="input textarea" rows="3"></textarea>
                </div>
                <div class="form-grid-2">
                    <div class="field">
                        <label>Category</label>
                        <select v-model="form.category" class="input">
                            <option v-for="c in categories" :key="c" :value="c">{{ c.charAt(0).toUpperCase() +
                                c.slice(1) }}</option>
                        </select>
                    </div>
                    <div class="field">
                        <label>Status</label>
                        <select v-model="form.status" class="input">
                            <option :value="AlbumStatus.DRAFT">Draft</option>
                            <option :value="AlbumStatus.PUBLISHED">Published</option>
                            <option :value="AlbumStatus.HIDDEN">Hidden</option>
                        </select>
                    </div>
                    <div class="field">
                        <label>Linked Event</label>
                        <select v-model="form.event_id" class="input">
                            <option value="">No associated event</option>
                            <option v-for="ev in eventsData?.data" :key="ev.id" :value="ev.id">{{ ev.title }}</option>
                        </select>
                    </div>
                </div>
                <div class="form-actions">
                    <button type="submit" :disabled="loading" class="btn-primary">
                        {{ loading ? "Saving…" : "Save Details" }}
                    </button>
                </div>
            </form>

            <!-- Images Tab -->
            <div v-if="activeTab === 'images'" class="form-card">
                <div class="upload-section">
                    <h3 class="section-label">Upload Photos</h3>
                    <div class="upload-controls">
                        <input type="file" multiple accept="image/*"
                            @change="(e) => imageFiles = Array.from((e.target as HTMLInputElement).files ?? [])"
                            class="file-input" />
                        <button @click="uploadImages" :disabled="!imageFiles.length || uploadingImages"
                            class="btn-primary">
                            {{ uploadingImages ? "Uploading…" : "Upload Now" }}
                        </button>
                    </div>
                </div>

                <div class="images-grid" v-if="albumRes.data.images?.length">
                    <div v-for="img in albumRes.data.images" :key="img.id" class="img-card"
                        :class="{ 'is-hidden': img.status === 'hidden' }">
                        <div class="img-wrap">
                            <img :src="img.thumbnail_medium_url || img.image_url" class="img-thumb" loading="lazy" />
                            <div class="img-overlay-badges">
                                <span v-if="img.id === albumRes.data.cover_image_id" class="badge cover-badge">
                                    <Icon name="mdi:star" /> Cover
                                </span>
                                <span v-if="img.status === 'hidden'" class="badge hidden-badge">
                                    <Icon name="mdi:eye-off" /> Hidden
                                </span>
                            </div>
                        </div>
                        <div class="img-actions">
                            <button v-if="img.id !== albumRes.data.cover_image_id" @click="setCover(img.id)"
                                class="action-btn" title="Set as Cover">
                                <Icon name="mdi:image-frame" />
                            </button>
                            <button @click="toggleVisibility(img.id, img.status)" class="action-btn"
                                :title="img.status === 'visible' ? 'Hide' : 'Show'">
                                <Icon :name="img.status === 'visible' ? 'mdi:eye-off' : 'mdi:eye'" />
                            </button>
                            <button @click="deleteImage(img.id)" class="action-btn danger" title="Delete">
                                <Icon name="mdi:trash-can" />
                            </button>
                        </div>
                    </div>
                </div>
                <div v-else class="empty-state">
                    <Icon name="mdi:image-off-outline" />
                    <p>No photos uploaded yet.</p>
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
    margin-bottom: 0.5rem;
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

.album-meta {
    display: flex;
    align-items: center;
    gap: 1rem;
    margin-bottom: 1.5rem;
    flex-wrap: wrap;
}

.page-title {
    font-size: 1.6rem;
    font-weight: 800;
    color: #1A0E08;
    margin: 0;
}

.badges {
    display: flex;
    gap: 0.5rem;
}

.badge {
    padding: 0.25rem 0.6rem;
    border-radius: 99px;
    font-size: 0.72rem;
    font-weight: 700;
    text-transform: capitalize;
}

.badge-green {
    background: #dcfce7;
    color: #16a34a;
}

.badge-gray {
    background: #f4f4f5;
    color: #52525b;
}

.badge-blue {
    background: #dbeafe;
    color: #2563eb;
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

.form-card {
    background: #fff;
    border-radius: 12px;
    padding: 2rem;
    border: 1px solid #f4f4f5;
    max-width: 900px;
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

.form-actions {
    display: flex;
    justify-content: flex-end;
    padding-top: 1rem;
    border-top: 1px solid #f4f4f5;
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
    display: inline-flex;
    align-items: center;
    justify-content: center;
}

.btn-primary:hover {
    background: #B84410;
}

.btn-primary:disabled {
    opacity: 0.6;
    cursor: not-allowed;
}

.upload-section {
    margin-bottom: 1rem;
    padding-bottom: 1.5rem;
    border-bottom: 1px solid #f4f4f5;
}

.section-label {
    font-size: 1rem;
    font-weight: 700;
    color: #1A0E08;
    margin: 0 0 0.75rem;
}

.upload-controls {
    display: flex;
    align-items: center;
    gap: 1rem;
    flex-wrap: wrap;
}

.file-input {
    font-size: 0.85rem;
}

.images-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
    gap: 1.25rem;
}

.img-card {
    border-radius: 8px;
    overflow: hidden;
    border: 1px solid #f4f4f5;
    display: flex;
    flex-direction: column;
    background: #fff;
    transition: opacity 0.2s;
}

.img-card.is-hidden {
    opacity: 0.6;
}

.img-wrap {
    width: 100%;
    aspect-ratio: 1;
    position: relative;
    background: #fafafa;
    border-bottom: 1px solid #f4f4f5;
}

.img-thumb {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
}

.img-overlay-badges {
    position: absolute;
    top: 0.5rem;
    left: 0.5rem;
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
    pointer-events: none;
}

.cover-badge {
    background: #E05615;
    color: #fff;
    display: flex;
    align-items: center;
    gap: 0.2rem;
}

.hidden-badge {
    background: #52525b;
    color: #fff;
    display: flex;
    align-items: center;
    gap: 0.2rem;
}

.img-actions {
    padding: 0.5rem;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    background: #fafafa;
}

.action-btn {
    width: 32px;
    height: 32px;
    border-radius: 6px;
    border: 1px solid #e4e4e7;
    background: #fff;
    color: #52525b;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all 0.15s;
    font-size: 1rem;
}

.action-btn:hover {
    border-color: #E05615;
    color: #E05615;
}

.action-btn.danger {
    color: #dc2626;
}

.action-btn.danger:hover {
    border-color: #dc2626;
    background: #fee2e2;
}

.empty-state {
    padding: 3rem;
    text-align: center;
    color: #a1a1aa;
    background: #fafafa;
    border-radius: 8px;
    border: 1px dashed #e4e4e7;
}

.empty-state icon {
    font-size: 2.5rem;
    margin-bottom: 0.75rem;
    display: block;
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
        opacity: 0.5;
    }
}
</style>
