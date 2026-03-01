<script setup lang="ts">
import type { AlbumsListResponse } from "~/types/api";
import { AlbumCategory, AlbumStatus } from "~/types/enums";

definePageMeta({ layout: "admin", middleware: "auth" });

const api = useApi();
const route = useRoute();
const router = useRouter();

const page = ref(Number(route.query.page) || 1);
const search = ref((route.query.search as string) || "");

const { data: albumsData, pending, refresh } = await useAsyncData(
    "admin-albums",
    () => api.get<AlbumsListResponse>("/albums", { page: page.value, per_page: 12, search: search.value }),
    { watch: [page, search], lazy: true }
);

let searchTimer: ReturnType<typeof setTimeout>;
const handleSearch = () => { clearTimeout(searchTimer); searchTimer = setTimeout(() => { page.value = 1; }, 450); };
const goToPage = (n: number) => { page.value = n; };

const deletingId = ref<string | null>(null);
const deleteAlbum = async (id: string) => {
    if (!confirm("Delete this album? All images will be removed.")) return;
    deletingId.value = id;
    try { await api.delete(`/albums/${id}`); refresh(); }
    catch (e: any) { alert(e.message); }
    finally { deletingId.value = null; }
};
</script>

<template>
    <div>
        <div class="page-header">
            <div>
                <h2 class="page-title">Photo Albums</h2>
                <p class="page-desc">Manage galleries and event photos.</p>
            </div>
            <NuxtLink to="/admin/albums/create" class="btn-primary">
                <Icon name="mdi:image-plus" /> New Album
            </NuxtLink>
        </div>

        <div class="filter-card">
            <div class="filter-row">
                <div class="filter-item">
                    <label>Search Albums</label>
                    <input v-model="search" @input="handleSearch" type="text" placeholder="Title or event..."
                        class="input" />
                </div>
            </div>
        </div>

        <div v-if="pending" class="albums-grid">
            <div v-for="i in 8" :key="i" class="album-card sk-card">
                <div class="sk-img"></div>
                <div class="sk-body">
                    <div class="sk-line wide"></div>
                    <div class="sk-line narrow"></div>
                </div>
            </div>
        </div>

        <div v-else-if="albumsData?.data?.length" class="albums-grid">
            <div v-for="album in albumsData.data" :key="album.id" class="album-card">
                <div class="album-img-wrap">
                    <img v-if="album.thumbnail_url" :src="album.thumbnail_url" class="album-img" />
                    <div v-else class="album-placeholder">
                        <Icon name="mdi:image-outline" />
                    </div>
                    <div class="album-badges">
                        <span class="badge" :class="album.status === 'published' ? 'badge-green' : 'badge-gray'">{{
                            album.status }}</span>
                        <span class="badge badge-blue">Photos: {{ album.images_count }}</span>
                    </div>
                </div>
                <div class="album-body">
                    <h3 class="album-title">{{ album.title }}</h3>
                    <p class="album-meta">{{ album.category }} &bull; {{ new Date(album.created_at).toLocaleDateString()
                        }}</p>
                    <div class="album-actions">
                        <NuxtLink :to="`/admin/albums/${album.id}`" class="action-link">Edit Images/Details</NuxtLink>
                        <button @click="deleteAlbum(album.id)" :disabled="deletingId === album.id"
                            class="action-del">Delete</button>
                    </div>
                </div>
            </div>
        </div>

        <div v-else class="empty-state">
            <Icon name="mdi:image-off-outline" />
            <p>No albums found.</p>
        </div>

        <div v-if="albumsData?.meta && albumsData.meta.last_page > 1" class="pagination">
            <span class="page-info">{{ albumsData.meta.from }}–{{ albumsData.meta.to }} of {{ albumsData.meta.total
                }}</span>
            <div class="page-btns">
                <button @click="goToPage(page - 1)" :disabled="page <= 1" class="page-btn">‹</button>
                <button v-for="n in albumsData.meta.last_page" :key="n" @click="goToPage(n)" class="page-btn"
                    :class="{ 'page-active': n === page }">{{ n }}</button>
                <button @click="goToPage(page + 1)" :disabled="page >= albumsData.meta.last_page"
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

.albums-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: 1.25rem;
    margin-bottom: 1.5rem;
}

.album-card {
    background: #fff;
    border-radius: 12px;
    border: 1px solid #f4f4f5;
    overflow: hidden;
    transition: transform 0.2s, box-shadow 0.2s;
}

.album-card:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.06);
}

.album-img-wrap {
    width: 100%;
    aspect-ratio: 4/3;
    position: relative;
    background: #f4f4f5;
}

.album-img {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.album-placeholder {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 3rem;
    color: #d4d4d8;
}

.album-badges {
    position: absolute;
    top: 0.75rem;
    left: 0.75rem;
    right: 0.75rem;
    display: flex;
    justify-content: space-between;
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

.badge-blue {
    background: rgba(37, 99, 235, 0.9);
    color: #fff;
}

.album-body {
    padding: 1.25rem;
}

.album-title {
    font-size: 1.05rem;
    font-weight: 700;
    color: #1A0E08;
    margin: 0 0 0.25rem;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

.album-meta {
    font-size: 0.8rem;
    color: #71717a;
    text-transform: capitalize;
    margin: 0 0 1rem;
}

.album-actions {
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
    aspect-ratio: 4/3;
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
