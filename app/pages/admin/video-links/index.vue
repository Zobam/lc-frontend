<script setup lang="ts">
import { useQuery } from '@pinia/colada';
import type { VideoLinksListResponse } from "~/types/api";

definePageMeta({ layout: "admin", middleware: "sidebase-auth" });
useHead({ title: 'Manage Videos | LC Admin' });

const api = useApi();
const route = useRoute();

const page = ref(Number(route.query.page) || 1);
const search = ref((route.query.search as string) || "");

// ── View mode ────────────────────────────────────────────────────────────────
const viewMode = ref<'grid' | 'table'>('grid');

// ── Data ─────────────────────────────────────────────────────────────────────
const { data: videosData, status, refetch: refresh } = useQuery({
    key: () => ["admin-videos", page.value, search.value],
    query: () => api.get<any>("/videos/manage/all", { page: page.value, per_page: 15, search: search.value }),
});
const pending = computed(() => status.value === 'pending');

let searchTimer: ReturnType<typeof setTimeout>;
const handleSearch = () => { clearTimeout(searchTimer); searchTimer = setTimeout(() => { page.value = 1; }, 450); };
const goToPage = (n: number) => { page.value = n; };

// ── Delete ───────────────────────────────────────────────────────────────────
const deletingId = ref<string | null>(null);
const deleteVideo = async (id: string) => {
    if (!confirm("Delete this video link?")) return;
    deletingId.value = id;
    try { await api.delete(`/videos/${id}`); alert("Video deleted."); refresh(); }
    catch (e: any) { alert(e.message); }
    finally { deletingId.value = null; }
};

// ── Table drag-and-drop reorder ───────────────────────────────────────────────
// Local ordered copy used only in table view; reset whenever server data changes.
const tableRows = ref<any[]>([]);
watch(
    () => videosData.value?.data,
    (rows) => { tableRows.value = rows ? [...rows] : []; },
    { immediate: true }
);

const dragSrcIndex = ref<number | null>(null);

const onDragStart = (index: number) => { dragSrcIndex.value = index; };
const onDragOver = (e: DragEvent, index: number) => {
    e.preventDefault();
    if (dragSrcIndex.value === null || dragSrcIndex.value === index) return;
    const moved = tableRows.value.splice(dragSrcIndex.value, 1)[0];
    tableRows.value.splice(index, 0, moved);
    dragSrcIndex.value = index;
};
const onDragEnd = () => { dragSrcIndex.value = null; };

// ── Persist reorder ───────────────────────────────────────────────────────────
const savingOrder = ref(false);
const orderDirty = ref(false);

// Track whether user has actually dragged something
watch(tableRows, () => { orderDirty.value = true; }, { deep: false });

const saveOrder = async () => {
    savingOrder.value = true;
    const payload = {
        videos: tableRows.value.map((v, i) => ({ id: v.id, order: i })),
    };
    try {
        await api.put('/videos/reorder', payload);
        alert("Video order saved.");
        orderDirty.value = false;
        refresh();
    } catch (e: any) { alert(e.message); }
    finally { savingOrder.value = false; }
};
</script>

<template>
    <div>
        <!-- Page Header -->
        <div class="page-header">
            <div>
                <h2 class="page-title">Video Links</h2>
                <p class="page-desc">Manage external video links (YouTube).</p>
            </div>
            <div class="header-right">
                <!-- View toggle -->
                <div class="view-toggle">
                    <button class="toggle-btn" :class="{ active: viewMode === 'grid' }" @click="viewMode = 'grid'"
                        title="Grid view">
                        <Icon name="mdi:view-grid-outline" />
                    </button>
                    <button class="toggle-btn" :class="{ active: viewMode === 'table' }" @click="viewMode = 'table'"
                        title="Table view">
                        <Icon name="mdi:table" />
                    </button>
                </div>
                <NuxtLink to="/admin/video-links/create" class="btn-primary">
                    <Icon name="mdi:video-plus" /> Add Video
                </NuxtLink>
            </div>
        </div>

        <!-- Filters -->
        <div class="filter-card">
            <div class="filter-row">
                <div class="filter-item">
                    <label>Search Videos</label>
                    <input v-model="search" @input="handleSearch" type="text" placeholder="Title or category..."
                        class="input" />
                </div>
            </div>
        </div>

        <!-- ── GRID VIEW ─────────────────────────────────────────────────── -->
        <template v-if="viewMode === 'grid'">
            <div v-if="pending" class="videos-grid">
                <div v-for="i in 8" :key="i" class="video-card sk-card">
                    <div class="sk-img"></div>
                    <div class="sk-body">
                        <div class="sk-line wide"></div>
                        <div class="sk-line narrow"></div>
                    </div>
                </div>
            </div>

            <div v-else-if="videosData?.data?.length" class="videos-grid">
                <div v-for="video in videosData.data" :key="video.id" class="video-card">
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
                        <p class="video-meta">{{ video.category }} &bull; {{ new
                            Date(video.created_at).toLocaleDateString() }}</p>
                        <div class="video-actions">
                            <NuxtLink :to="`/admin/video-links/${video.id}`" class="action-link">Edit</NuxtLink>
                            <button @click="deleteVideo(video.id)" :disabled="deletingId === video.id"
                                class="action-del">
                                <Icon v-if="deletingId === video.id" name="mdi:loading" class="spin" />
                                <span v-else>Delete</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div v-else class="empty-state">
                <Icon name="mdi:video-off-outline" />
                <p>No videos found.</p>
            </div>
        </template>

        <!-- ── TABLE VIEW ────────────────────────────────────────────────── -->
        <template v-else>
            <!-- Save order bar -->
            <div v-if="orderDirty" class="reorder-bar">
                <span>
                    <Icon name="mdi:information-outline" /> Drag rows to reorder. Save when done.
                </span>
                <button class="btn-save-order" :disabled="savingOrder" @click="saveOrder">
                    <Icon v-if="savingOrder" name="mdi:loading" class="spin" />
                    <span v-else>Save Order</span>
                </button>
            </div>
            <div v-else class="reorder-hint">
                <Icon name="mdi:drag" /> Drag rows in the table to reorder videos.
            </div>

            <div class="table-card">
                <div v-if="pending" class="loading-rows">
                    <div v-for="i in 6" :key="i" class="sk-row">
                        <div class="sk-cell narrow"></div>
                        <div class="sk-cell mid"></div>
                        <div class="sk-cell wide"></div>
                        <div class="sk-cell narrow"></div>
                    </div>
                </div>

                <table v-else-if="tableRows.length" class="data-table">
                    <thead>
                        <tr>
                            <th class="col-handle" title="Drag to reorder"></th>
                            <th>Thumbnail</th>
                            <th>Title</th>
                            <th>Category</th>
                            <th>Status</th>
                            <th>Added</th>
                            <th class="text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(video, index) in tableRows" :key="video.id" draggable="true"
                            @dragstart="onDragStart(index)" @dragover="onDragOver($event, index)" @dragend="onDragEnd"
                            :class="{ 'dragging': dragSrcIndex === index }">
                            <!-- Drag handle column -->
                            <td class="col-handle">
                                <Icon name="mdi:drag-vertical" class="drag-icon" />
                            </td>
                            <td>
                                <div class="thumb-cell">
                                    <img v-if="video.hq_thumbnail_url || video.thumbnail_url"
                                        :src="video.hq_thumbnail_url || video.thumbnail_url" class="table-thumb" />
                                    <div v-else class="thumb-placeholder">
                                        <Icon name="mdi:youtube" />
                                    </div>
                                </div>
                            </td>
                            <td class="font-medium">{{ video.title }}</td>
                            <td class="muted capitalize">{{ video.category }}</td>
                            <td>
                                <span class="status-pill"
                                    :class="video.status === 'active' ? 'pill-green' : 'pill-gray'">
                                    {{ video.status }}
                                </span>
                            </td>
                            <td class="muted">{{ new Date(video.created_at).toLocaleDateString() }}</td>
                            <td class="text-right">
                                <NuxtLink :to="`/admin/video-links/${video.id}`" class="action-link">Edit</NuxtLink>
                                <button @click="deleteVideo(video.id)" :disabled="deletingId === video.id"
                                    class="action-del">
                                    <Icon v-if="deletingId === video.id" name="mdi:loading" class="spin" />
                                    <span v-else>Delete</span>
                                </button>
                            </td>
                        </tr>
                    </tbody>
                </table>

                <div v-else class="empty-state">
                    <Icon name="mdi:video-off-outline" />
                    <p>No videos found.</p>
                </div>
            </div>
        </template>

        <AdminPagination v-if="videosData?.data?.last_page" :current-page="videosData.data.current_page"
            :total-pages="videosData.data.last_page" :total="videosData.data.total" :from="videosData.data.from"
            :to="videosData.data.to" @change="goToPage" />
    </div>
</template>

<style scoped>
/* ── Layout ── */
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

.header-right {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    flex-shrink: 0;
}

/* ── View toggle ── */
.view-toggle {
    display: flex;
    gap: 2px;
    background: #f4f4f5;
    border-radius: 8px;
    padding: 3px;
}

.toggle-btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 32px;
    height: 32px;
    border: none;
    background: transparent;
    border-radius: 6px;
    cursor: pointer;
    color: #71717a;
    font-size: 1.1rem;
    transition: background 0.15s, color 0.15s;
}

.toggle-btn:hover {
    color: #1A0E08;
}

.toggle-btn.active {
    background: #fff;
    color: #E05615;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

/* ── Primary button ── */
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

/* ── Filters ── */
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

/* ── Reorder bar / hint ── */
.reorder-bar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 1rem;
    background: #fef9ec;
    border: 1px solid #F5C842;
    border-radius: 10px;
    padding: 0.65rem 1rem;
    margin-bottom: 1rem;
    font-size: 0.85rem;
    color: #92400e;
}

.reorder-hint {
    display: flex;
    align-items: center;
    gap: 0.35rem;
    font-size: 0.82rem;
    color: #a1a1aa;
    margin-bottom: 0.75rem;
}

.btn-save-order {
    display: inline-flex;
    align-items: center;
    gap: 0.35rem;
    padding: 0.4rem 1rem;
    background: #E05615;
    color: #fff;
    border: none;
    border-radius: 7px;
    font-size: 0.82rem;
    font-weight: 600;
    cursor: pointer;
    white-space: nowrap;
}

.btn-save-order:disabled {
    opacity: 0.6;
    cursor: not-allowed;
}

/* ── Table card ── */
.table-card {
    background: #fff;
    border-radius: 12px;
    border: 1px solid #f4f4f5;
    overflow: hidden;
    margin-bottom: 1.5rem;
}

.loading-rows {
    padding: 1.25rem 1.5rem;
    display: flex;
    flex-direction: column;
    gap: 1rem;
}

.sk-row {
    display: flex;
    align-items: center;
    gap: 1rem;
}

.sk-cell {
    background: #f4f4f5;
    border-radius: 6px;
    animation: pulse 1.5s ease-in-out infinite;
    height: 14px;
    flex-shrink: 0;
}

.sk-cell.wide {
    width: 200px;
}

.sk-cell.mid {
    width: 120px;
}

.sk-cell.narrow {
    width: 60px;
}

/* ── Data table ── */
.data-table {
    width: 100%;
    border-collapse: collapse;
}

.data-table th {
    padding: 0.75rem 1rem;
    text-align: left;
    font-size: 0.72rem;
    font-weight: 700;
    color: #71717a;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    background: #fafafa;
    border-bottom: 1px solid #f4f4f5;
}

.data-table td {
    padding: 0.75rem 1rem;
    font-size: 0.875rem;
    color: #27272a;
    border-bottom: 1px solid #f9f9f9;
    vertical-align: middle;
}

.data-table tr:last-child td {
    border-bottom: none;
}

.data-table tr:hover td {
    background: #fafafa;
}

.data-table tr.dragging td {
    background: #fff7f4;
    opacity: 0.75;
}

/* Drag handle column */
.col-handle {
    width: 36px;
    text-align: center !important;
    padding: 0 0.5rem !important;
    cursor: grab;
}

.drag-icon {
    font-size: 1.2rem;
    color: #a1a1aa;
    display: block;
}

/* Thumbnail in table */
.thumb-cell {
    width: 72px;
}

.table-thumb {
    width: 72px;
    height: 42px;
    object-fit: cover;
    border-radius: 5px;
    display: block;
}

.thumb-placeholder {
    width: 72px;
    height: 42px;
    border-radius: 5px;
    background: #1A0E08;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.4rem;
    color: #3f3f46;
}

.font-medium {
    font-weight: 600;
}

.muted {
    color: #71717a !important;
}

.capitalize {
    text-transform: capitalize;
}

.text-right {
    text-align: right !important;
}

/* Status pill */
.status-pill {
    display: inline-block;
    padding: 0.2rem 0.6rem;
    border-radius: 99px;
    font-size: 0.72rem;
    font-weight: 700;
    text-transform: capitalize;
}

.pill-green {
    background: #dcfce7;
    color: #16a34a;
}

.pill-gray {
    background: #f4f4f5;
    color: #52525b;
}

/* Action buttons in table */
.action-link {
    font-size: 0.8rem;
    font-weight: 600;
    color: #E05615;
    text-decoration: none;
    margin-right: 0.75rem;
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
    display: inline-flex;
    align-items: center;
}

.action-del:disabled {
    opacity: 0.5;
}

/* ── Grid view ── */
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

/* ── Skeletons ── */
.sk-card {
    display: flex;
    flex-direction: column;
}

.sk-img {
    width: 100%;
    aspect-ratio: 16/9;
    background: #f4f4f5;
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

/* ── Spinner ── */
.spin {
    animation: spin 0.7s linear infinite;
}

@keyframes spin {
    to {
        transform: rotate(360deg);
    }
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

/* ── Empty state ── */
.empty-state {
    padding: 4rem;
    text-align: center;
    color: #a1a1aa;
    background: #fff;
    border-radius: 12px;
    border: 1px solid #f4f4f5;
}
</style>
