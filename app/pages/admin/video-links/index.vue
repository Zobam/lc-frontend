<script setup lang="ts">
import type { VideoLinksListResponse } from "~/types/api";

definePageMeta({ layout: "admin", middleware: "sidebase-auth" });
useHead({ title: 'Manage Videos | LC Admin' });

const api = useApi();
const route = useRoute();
const router = useRouter();

const page = ref(Number(route.query.page) || 1);
const search = ref((route.query.search as string) || "");

const { data: videosData, pending, refresh } = await useAsyncData(
    "admin-videos",
    () => api.get<VideoLinksListResponse>("/videos", { page: page.value, per_page: 15, search: search.value }),
    { watch: [page, search], lazy: true }
);

let searchTimer: ReturnType<typeof setTimeout>;
const handleSearch = () => { clearTimeout(searchTimer); searchTimer = setTimeout(() => { page.value = 1; }, 450); };
const goToPage = (n: number) => { page.value = n; };

const deletingId = ref<string | null>(null);
const deleteVideo = async (id: string) => {
    if (!confirm("Delete this video link?")) return;
    deletingId.value = id;
    try { await api.delete(`/video-links/${id}`); refresh(); }
    catch (e: any) { alert(e.message); }
    finally { deletingId.value = null; }
};
</script>

<template>
    <div>
        <div class="page-header">
            <div>
                <h2 class="page-title">Video Links</h2>
                <p class="page-desc">Manage external video links (YouTube).</p>
            </div>
            <NuxtLink to="/admin/video-links/create" class="btn-primary">
                <Icon name="mdi:video-plus" /> Add Video
            </NuxtLink>
        </div>

        <div class="filter-card">
            <div class="filter-row">
                <div class="filter-item">
                    <label>Search Videos</label>
                    <input v-model="search" @input="handleSearch" type="text" placeholder="Title or category..."
                        class="input" />
                </div>
            </div>
        </div>

        <div v-if="pending" class="videos-grid">
            <div v-for="i in 8" :key="i" class="video-card sk-card">
                <div class="sk-img"></div>
                <div class="sk-body">
                    <div class="sk-line wide"></div>
                    <div class="sk-line narrow"></div>
                </div>
            </div>
        </div>

        <div v-else-if="videosData?.data?.data?.length" class="videos-grid">
            <div v-for="video in videosData.data.data" :key="video.id" class="video-card">
                <div class="video-thumb-wrap">
                    <img v-if="video.hq_thumbnail_url || video.thumbnail_url"
                        :src="video.hq_thumbnail_url || video.thumbnail_url" class="video-thumb" />
                    <div v-else class="video-placeholder">
                        <Icon name="mdi:youtube" />
                    </div>
                    <div class="video-duration" v-if="video.formatted_duration">{{ video.formatted_duration }}</div>
                    <div class="video-badges">
                        <span class="badge" :class="video.status === 'active' ? 'badge-green' : 'badge-gray'">{{
                            video.status }}</span>
                    </div>
                </div>
                <div class="video-body">
                    <h3 class="video-title">{{ video.title }}</h3>
                    <p class="video-meta">{{ video.category }} &bull; {{ new Date(video.created_at).toLocaleDateString()
                    }}</p>
                    <div class="video-actions">
                        <NuxtLink :to="`/admin/video-links/${video.id}`" class="action-link">Edit</NuxtLink>
                        <button @click="deleteVideo(video.id)" :disabled="deletingId === video.id"
                            class="action-del">Delete</button>
                    </div>
                </div>
            </div>
        </div>

        <div v-else class="empty-state">
            <Icon name="mdi:video-off-outline" />
            <p>No videos found.</p>
        </div>

        <div v-if="videosData?.meta && videosData.meta.last_page > 1" class="pagination">
            <span class="page-info">{{ videosData.meta.from }}–{{ videosData.meta.to }} of {{ videosData.meta.total
            }}</span>
            <div class="page-btns">
                <button @click="goToPage(page - 1)" :disabled="page <= 1" class="page-btn">‹</button>
                <button v-for="n in videosData.meta.last_page" :key="n" @click="goToPage(n)" class="page-btn"
                    :class="{ 'page-active': n === page }">{{ n }}</button>
                <button @click="goToPage(page + 1)" :disabled="page >= videosData.meta.last_page"
                    class="page-btn">›</button>
            </div>
        </div>
    </div>
</template>

<style scoped>
.page-header {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    margin-bottom: 1.5rem;
    gap: 1rem;
}

.page-title {
    font-size: 1.5rem;
    font-weight: 800;
    color: #1A0E08;
    margin: 0 0 0.2rem;
}

.page-desc {
    font-size: 0.85rem;
    color: #71717a;
    margin: 0;
}

.btn-primary {
    display: flex;
    align-items: center;
    gap: 0.4rem;
    padding: 0.55rem 1.2rem;
    background: #E05615;
    color: #fff;
    border-radius: 8px;
    font-size: 0.875rem;
    font-weight: 600;
    text-decoration: none;
    white-space: nowrap;
}

.btn-primary:hover {
    background: #B84410;
}

.filter-card {
    background: #fff;
    border-radius: 12px;
    padding: 1.25rem 1.5rem;
    margin-bottom: 1.25rem;
    border: 1px solid #f4f4f5;
}

.filter-row {
    display: flex;
    gap: 1rem;
    max-width: 400px;
}

.filter-item {
    display: flex;
    flex-direction: column;
    gap: 0.35rem;
    flex: 1;
}

.filter-item label {
    font-size: 0.78rem;
    font-weight: 600;
    color: #52525b;
    text-transform: uppercase;
    letter-spacing: 0.04em;
}

.input {
    padding: 0.5rem 0.75rem;
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

.videos-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 1.25rem;
    margin-bottom: 1.5rem;
}

.video-card {
    background: #fff;
    border-radius: 12px;
    border: 1px solid #f4f4f5;
    overflow: hidden;
    transition: transform 0.2s, box-shadow 0.2s;
}

.video-card:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.06);
}

.video-thumb-wrap {
    width: 100%;
    aspect-ratio: 16/9;
    position: relative;
    background: #1A0E08;
}

.video-thumb {
    width: 100%;
    height: 100%;
    object-fit: cover;
    opacity: 0.9;
}

.video-placeholder {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 3.5rem;
    color: #3f3f46;
}

.video-duration {
    position: absolute;
    bottom: 0.5rem;
    right: 0.5rem;
    background: rgba(0, 0, 0, 0.8);
    color: #fff;
    font-size: 0.75rem;
    font-weight: 600;
    padding: 0.15rem 0.4rem;
    border-radius: 4px;
}

.video-badges {
    position: absolute;
    top: 0.5rem;
    left: 0.5rem;
    pointer-events: none;
}

.badge {
    padding: 0.25rem 0.6rem;
    border-radius: 99px;
    font-size: 0.7rem;
    font-weight: 700;
    text-transform: capitalize;
    backdrop-filter: blur(4px);
}

.badge-green {
    background: rgba(22, 163, 74, 0.9);
    color: #fff;
}

.badge-gray {
    background: rgba(82, 82, 91, 0.9);
    color: #fff;
}

.video-body {
    padding: 1.25rem;
}

.video-title {
    font-size: 1.05rem;
    font-weight: 700;
    color: #1A0E08;
    margin: 0 0 0.25rem;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
    line-height: 1.3;
}

.video-meta {
    font-size: 0.8rem;
    color: #71717a;
    text-transform: capitalize;
    margin: 0 0 1rem;
}

.video-actions {
    display: flex;
    align-items: center;
    justify-content: space-between;
    border-top: 1px solid #f4f4f5;
    padding-top: 0.85rem;
}

.action-link {
    font-size: 0.8rem;
    font-weight: 600;
    color: #E05615;
    text-decoration: none;
}

.action-link:hover {
    text-decoration: underline;
}

.action-del {
    font-size: 0.8rem;
    font-weight: 600;
    color: #dc2626;
    background: none;
    border: none;
    cursor: pointer;
}

.action-del:hover {
    text-decoration: underline;
}

.sk-card {
    display: flex;
    flex-direction: column;
}

.sk-img {
    width: 100%;
    aspect-ratio: 16/9;
    background: #f4f4f5;
    padding: 0;
    animation: pulse 1.5s ease-in-out infinite;
}

.sk-body {
    padding: 1.25rem;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
}

.sk-line {
    background: #f4f4f5;
    border-radius: 6px;
    height: 14px;
    animation: pulse 1.5s ease-in-out infinite;
}

.sk-line.wide {
    width: 80%;
}

.sk-line.narrow {
    width: 50%;
    opacity: 0.7;
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

.empty-state {
    padding: 4rem;
    text-align: center;
    color: #a1a1aa;
    background: #fff;
    border-radius: 12px;
    border: 1px solid #f4f4f5;
}

.empty-state icon {
    font-size: 2.5rem;
    margin-bottom: 0.75rem;
    display: block;
}

.pagination {
    padding: 1rem 1.25rem;
    background: #fff;
    border-radius: 12px;
    border: 1px solid #f4f4f5;
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-wrap: wrap;
    gap: 0.5rem;
}

.page-info {
    font-size: 0.8rem;
    color: #71717a;
}

.page-btns {
    display: flex;
    gap: 0.25rem;
}

.page-btn {
    padding: 0.35rem 0.65rem;
    border: 1px solid #e4e4e7;
    border-radius: 6px;
    font-size: 0.8rem;
    font-weight: 500;
    background: #fff;
    color: #27272a;
    cursor: pointer;
}

.page-btn:hover:not(:disabled) {
    border-color: #E05615;
    color: #E05615;
}

.page-btn:disabled {
    opacity: 0.4;
    cursor: not-allowed;
}

.page-active {
    background: #E05615 !important;
    border-color: #E05615 !important;
    color: #fff !important;
}
</style>
