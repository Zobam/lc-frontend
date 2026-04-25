<script setup lang="ts">
import { useQuery } from '@pinia/colada';
import type { CommentsListResponse } from "~/types/api";
import { toast } from 'vue-sonner';

definePageMeta({ layout: "admin", middleware: "sidebase-auth" });
useHead({ title: 'Moderate Comments | LC Admin' });

const api = useApi();
const route = useRoute();
const router = useRouter();

const page = ref(Number(route.query.page) || 1);
const search = ref((route.query.search as string) || "");
const statusFilter = ref((route.query.status as string) || "all");

const { data: commentsData, status, refetch: refresh } = useQuery({
    key: () => ["admin-comments", page.value, search.value, statusFilter.value],
    query: () => api.get<CommentsListResponse>("/comments/manage/pending", { page: page.value, per_page: 20, search: search.value, status: statusFilter.value }),
});
const pending = computed(() => status.value === 'pending');

let searchTimer: ReturnType<typeof setTimeout>;
const handleSearch = () => { clearTimeout(searchTimer); searchTimer = setTimeout(() => { page.value = 1; }, 450); };
const handleFilter = () => { page.value = 1; };
const goToPage = (n: number) => { page.value = n; };

const togglingId = ref<string | null>(null);
const toggleApproval = async (comment: any) => {
    togglingId.value = comment.id;
    try {
        await api.put(`/comments/${comment.id}/${comment.is_approved ? "reject" : "approve"}`);
        refresh();
    } catch (e: any) { toast.error(e.message); }
    finally { togglingId.value = null; }
};

const deletingId = ref<string | null>(null);
const deleteComment = async (id: string) => {
    if (!confirm("Delete this comment permanently?")) return;
    deletingId.value = id;
    try { await api.delete(`/comments/${id}`); refresh(); }
    catch (e: any) { toast.error(e.message); }
    finally { deletingId.value = null; }
};
</script>

<template>
    <div>
        <div class="page-header">
            <div>
                <h2 class="page-title">Comments Moderation</h2>
                <p class="page-desc">Approve or reject user comments on blog posts.</p>
            </div>
        </div>

        <div class="filter-card">
            <div class="filter-row">
                <div class="filter-item">
                    <label>Search Content or Author</label>
                    <input v-model="search" @input="handleSearch" type="text" placeholder="Search..." class="input" />
                </div>
                <div class="filter-item status-filter">
                    <label>Status</label>
                    <select v-model="statusFilter" @change="handleFilter" class="input">
                        <option value="all">All Comments</option>
                        <option value="pending">Pending Approval</option>
                        <option value="approved">Approved</option>
                        <option value="rejected">Rejected</option>
                    </select>
                </div>
            </div>
        </div>

        <div class="table-card">
            <div v-if="pending" class="loading-rows">
                <div v-for="i in 6" :key="i" class="sk-row">
                    <div class="sk-cell w-full"></div>
                </div>
            </div>

            <table v-else-if="commentsData?.data?.length" class="data-table">
                <thead>
                    <tr>
                        <th>Comment</th>
                        <th>User</th>
                        <th>Status</th>
                        <th>Date</th>
                        <th class="text-right">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="comment in commentsData.data" :key="comment.id"
                        :class="{ 'row-unapproved': !comment.is_approved }">
                        <td class="col-content">
                            <div class="comment-content">{{ comment.content }}</div>
                            <div class="comment-post-title" v-if="comment.post?.title">
                                On: <NuxtLink :to="`/admin/posts/${comment.post.id}`" class="post-link" target="_blank">
                                    {{ comment.post.title }}</NuxtLink>
                            </div>
                        </td>
                        <td class="col-user muted">{{ comment.user ? `${comment.user.first_name}
                            ${comment.user.last_name}` : 'Unknown' }}</td>
                        <td class="col-status">
                            <span class="badge" :class="comment.is_approved ? 'badge-green' : 'badge-yellow'">
                                {{ comment.is_approved ? 'Approved' : 'Pending' }}
                            </span>
                        </td>
                        <td class="col-date muted">{{ new Date(comment.created_at).toLocaleDateString() }}</td>
                        <td class="col-actions text-right">
                            <button @click="toggleApproval(comment)" :disabled="togglingId === comment.id"
                                class="action-btn" :class="comment.is_approved ? 'btn-warn' : 'btn-ok'">
                                {{ togglingId === comment.id ? "…" : (comment.is_approved ? "Reject" : "Approve") }}
                            </button>
                            <button @click="deleteComment(comment.id)" :disabled="deletingId === comment.id"
                                class="action-del">Delete</button>
                        </td>
                    </tr>
                </tbody>
            </table>

            <div v-else class="empty-state">
                <Icon name="mdi:comment-check-outline" />
                <p>No comments found.</p>
            </div>

            <AdminPagination v-if="commentsData?.pagination" :current-page="commentsData.pagination.current_page"
                :total-pages="commentsData.pagination.total_pages" :total="commentsData.pagination.total_items"
                :from="commentsData.pagination.from" :to="commentsData.pagination.to" @change="goToPage" />
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
}

.filter-item {
    display: flex;
    flex-direction: column;
    gap: 0.35rem;
    flex: 1;
}

.status-filter {
    max-width: 250px;
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

.table-card {
    background: #fff;
    border-radius: 12px;
    border: 1px solid #f4f4f5;
    overflow: hidden;
}

.data-table {
    width: 100%;
    border-collapse: collapse;
    table-layout: fixed;
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
    padding: 1rem 1.25rem;
    font-size: 0.875rem;
    color: #27272a;
    border-bottom: 1px solid #f9f9f9;
    vertical-align: top;
}

.data-table tr:hover td {
    background: #fafafa;
}

.data-table tr.row-unapproved td {
    background: #fefce8;
}

.data-table tr.row-unapproved:hover td {
    background: #fef9c3;
}

.col-content {
    width: 45%;
}

.col-user {
    width: 15%;
}

.col-status {
    width: 10%;
}

.col-date {
    width: 10%;
}

.col-actions {
    width: 20%;
}

.muted {
    color: #71717a !important;
}

.text-right {
    text-align: right !important;
}

.comment-content {
    font-size: 0.9rem;
    margin-bottom: 0.4rem;
    line-height: 1.4;
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
    overflow: hidden;
}

.comment-post-title {
    font-size: 0.75rem;
    color: #a1a1aa;
    display: flex;
    align-items: center;
    gap: 0.25rem;
}

.post-link {
    color: #E05615;
    text-decoration: none;
    max-width: 250px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    display: inline-block;
    vertical-align: bottom;
}

.post-link:hover {
    text-decoration: underline;
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

.badge-yellow {
    background: #fef3c7;
    color: #d97706;
}

.action-btn {
    font-size: 0.8rem;
    font-weight: 600;
    padding: 0.3rem 0.6rem;
    border-radius: 6px;
    border: 1px solid transparent;
    cursor: pointer;
    margin-right: 0.75rem;
    transition: all 0.15s;
}

.action-btn:disabled {
    opacity: 0.5;
}

.btn-ok {
    background: #dcfce7;
    color: #16a34a;
    border-color: transparent;
}

.btn-ok:hover {
    background: #16a34a;
    color: #fff;
}

.btn-warn {
    background: #fee2e2;
    color: #dc2626;
    border-color: transparent;
}

.btn-warn:hover {
    background: #dc2626;
    color: #fff;
}

.action-del {
    font-size: 0.8rem;
    font-weight: 600;
    color: #71717a;
    background: none;
    border: none;
    cursor: pointer;
}

.action-del:hover {
    color: #dc2626;
    text-decoration: underline;
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
    height: 16px;
}

.w-full {
    width: 100%;
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

.empty-state {
    padding: 4rem;
    text-align: center;
    color: #a1a1aa;
}

.empty-state icon {
    font-size: 2.5rem;
    margin-bottom: 0.75rem;
    display: block;
}
</style>
