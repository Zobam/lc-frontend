<script setup lang="ts">
import type { EventsListResponse } from "~/types/api";

definePageMeta({ layout: "admin", middleware: "sidebase-auth" });

const api = useApi();
const route = useRoute();
const router = useRouter();

const page = ref(Number(route.query.page) || 1);
const search = ref((route.query.search as string) || "");
const upcomingOnly = ref(route.query.upcoming === "true");

const { data: eventsData, pending, refresh } = await useAsyncData(
    "admin-events",
    () => api.get<EventsListResponse>("/events", {
        page: page.value, per_page: 15,
        search: search.value,
        upcoming: upcomingOnly.value || undefined,
    }),
    { watch: [page, search, upcomingOnly], lazy: true }
);

let searchTimer: ReturnType<typeof setTimeout>;
const handleSearch = () => {
    clearTimeout(searchTimer);
    searchTimer = setTimeout(() => { page.value = 1; }, 450);
};

const goToPage = (n: number) => { page.value = n; };

const deletingId = ref<string | null>(null);
const deleteEvent = async (id: string) => {
    if (!confirm("Delete this event?")) return;
    deletingId.value = id;
    try { await api.delete(`/events/${id}`); refresh(); }
    catch (e: any) { alert(e.message || "Failed to delete event"); }
    finally { deletingId.value = null; }
};

const formatDate = (d: string) => new Date(d).toLocaleDateString("en-NG", { year: "numeric", month: "short", day: "numeric" });
</script>

<template>
    <div>
        <div class="page-header">
            <div>
                <h2 class="page-title">Events</h2>
                <p class="page-desc">Manage church events and their schedules.</p>
            </div>
            <NuxtLink to="/admin/events/create" class="btn-primary">
                <Icon name="mdi:calendar-plus" /> New Event
            </NuxtLink>
        </div>

        <div class="filter-card">
            <div class="filter-row">
                <div class="filter-item">
                    <label>Search</label>
                    <input v-model="search" @input="handleSearch" type="text" placeholder="Search events…"
                        class="input" />
                </div>
                <div class="filter-item fitcontent">
                    <label>&nbsp;</label>
                    <label class="checkbox-item">
                        <input v-model="upcomingOnly" type="checkbox" />
                        <span>Upcoming only</span>
                    </label>
                </div>
            </div>
        </div>

        <div class="table-card">
            <div v-if="pending" class="loading-rows">
                <div v-for="i in 5" :key="i" class="sk-row">
                    <div class="sk-cell w-48 h-4"></div>
                    <div class="sk-cell w-32 h-4"></div>
                    <div class="sk-cell w-40 h-4"></div>
                    <div class="sk-cell w-16 h-5 rounded-full"></div>
                </div>
            </div>
            <table v-else-if="eventsData?.data?.length" class="data-table">
                <thead>
                    <tr>
                        <th>Title</th>
                        <th>Location</th>
                        <th>Start Date</th>
                        <th>Recurring</th>
                        <th>Images</th>
                        <th class="text-right">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="event in eventsData.data" :key="event.id">
                        <td class="font-medium">{{ event.title }}</td>
                        <td class="muted">{{ event.location }}</td>
                        <td class="muted">{{ formatDate(event.start_date) }}</td>
                        <td>
                            <span class="badge" :class="event.is_recurring ? 'badge-green' : 'badge-gray'">
                                {{ event.is_recurring ? "Yes" : "No" }}
                            </span>
                        </td>
                        <td class="muted">{{ event.images_count ?? 0 }}</td>
                        <td class="text-right">
                            <NuxtLink :to="`/admin/events/${event.id}`" class="action-link">Edit</NuxtLink>
                            <button @click="deleteEvent(event.id)" :disabled="deletingId === event.id"
                                class="action-del">
                                {{ deletingId === event.id ? "…" : "Delete" }}
                            </button>
                        </td>
                    </tr>
                </tbody>
            </table>
            <div v-else class="empty-state">
                <Icon name="mdi:calendar-blank" />
                <p>No events found</p>
            </div>
            <div v-if="eventsData?.meta && eventsData.meta.last_page > 1" class="pagination">
                <span class="page-info">{{ eventsData.meta.from }}–{{ eventsData.meta.to }} of {{ eventsData.meta.total
                    }}</span>
                <div class="page-btns">
                    <button @click="goToPage(page - 1)" :disabled="page <= 1" class="page-btn">‹ Prev</button>
                    <button v-for="n in eventsData.meta.last_page" :key="n" @click="goToPage(n)" class="page-btn"
                        :class="{ 'page-active': n === page }">{{ n }}</button>
                    <button @click="goToPage(page + 1)" :disabled="page >= eventsData.meta.last_page"
                        class="page-btn">Next ›</button>
                </div>
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
    transition: background 0.15s;
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
    flex-wrap: wrap;
    align-items: flex-end;
}

.filter-item {
    display: flex;
    flex-direction: column;
    gap: 0.35rem;
    flex: 1;
    min-width: 180px;
}

.filter-item.fitcontent {
    flex: 0;
    min-width: auto;
}

.filter-item label:first-child {
    font-size: 0.78rem;
    font-weight: 600;
    color: #52525b;
    text-transform: uppercase;
    letter-spacing: 0.04em;
}

.input {
    width: 100%;
    padding: 0.5rem 0.75rem;
    border: 1px solid #e4e4e7;
    border-radius: 8px;
    font-size: 0.875rem;
    outline: none;
    background: #fafafa;
    transition: border 0.15s;
}

.input:focus {
    border-color: #E05615;
    background: #fff;
}

.checkbox-item {
    display: flex;
    align-items: center;
    gap: 0.4rem;
    font-size: 0.875rem;
    cursor: pointer;
    padding: 0.55rem 0;
}

.checkbox-item input {
    accent-color: #E05615;
}

.table-card {
    background: #fff;
    border-radius: 12px;
    border: 1px solid #f4f4f5;
    overflow: hidden;
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
    flex-shrink: 0;
    height: 14px;
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

.data-table {
    width: 100%;
    border-collapse: collapse;
}

.data-table th {
    padding: 0.75rem 1.25rem;
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
    padding: 0.9rem 1.25rem;
    font-size: 0.875rem;
    color: #27272a;
    border-bottom: 1px solid #f9f9f9;
}

.data-table tr:last-child td {
    border-bottom: none;
}

.data-table tr:hover td {
    background: #fafafa;
}

.font-medium {
    font-weight: 600;
}

.muted {
    color: #71717a !important;
}

.text-right {
    text-align: right !important;
}

.badge {
    padding: 0.2rem 0.6rem;
    border-radius: 99px;
    font-size: 0.72rem;
    font-weight: 700;
}

.badge-green {
    background: #dcfce7;
    color: #16a34a;
}

.badge-gray {
    background: #f4f4f5;
    color: #52525b;
}

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
}

.action-del:disabled {
    opacity: 0.5;
}

.empty-state {
    padding: 4rem;
    text-align: center;
    color: #a1a1aa;
}

.pagination {
    padding: 1rem 1.25rem;
    border-top: 1px solid #f4f4f5;
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
