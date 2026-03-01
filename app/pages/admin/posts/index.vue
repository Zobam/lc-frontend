<script setup lang="ts">
import type { PostsListResponse } from "~/types/api";
import { PostCategory } from "~/types/enums";

definePageMeta({ layout: "admin", middleware: "sidebase-auth" });

const api = useApi();
const route = useRoute();
const router = useRouter();

const page = ref(Number(route.query.page) || 1);
const search = ref((route.query.search as string) || "");
const categoryFilter = ref((route.query.category as string) || "");
const statusFilter = ref((route.query.status as string) || "");

const { data: postsData, pending, refresh } = await useAsyncData(
    "admin-posts",
    () => api.get<PostsListResponse>("/posts", {
        page: page.value, per_page: 15,
        search: search.value,
        category: categoryFilter.value,
        status: statusFilter.value,
    }),
    { watch: [page, search, categoryFilter, statusFilter], lazy: true }
);

let searchTimer: ReturnType<typeof setTimeout>;
const handleSearch = () => { clearTimeout(searchTimer); searchTimer = setTimeout(() => { page.value = 1; }, 450); };
const goToPage = (n: number) => { page.value = n; };

const deletingId = ref<string | null>(null);
const deletePost = async (id: string) => {
    if (!confirm("Delete this post?")) return;
    deletingId.value = id;
    try { await api.delete(`/posts/${id}`); refresh(); }
    catch (e: any) { alert(e.message); }
    finally { deletingId.value = null; }
};

const toggling = ref<string | null>(null);
const togglePublish = async (post: any) => {
    toggling.value = post.id;
    try {
        await api.post(`/posts/${post.id}/${post.is_published ? "unpublish" : "publish"}`);
        refresh();
    } catch (e: any) { alert(e.message); }
    finally { toggling.value = null; }
};

const categories = Object.values(PostCategory);
</script>

<template>
    <div>
        <div class="page-header">
            <div>
                <h2 class="page-title">Posts</h2>
                <p class="page-desc">Manage blog posts and articles.</p>
            </div>
            <NuxtLink to="/admin/posts/create" class="btn-primary">
                <Icon name="mdi:pencil-plus" /> New Post
            </NuxtLink>
        </div>
        <div class="filter-card">
            <div class="filter-row">
                <div class="filter-item">
                    <label>Search</label>
                    <input v-model="search" @input="handleSearch" type="text" placeholder="Search posts…"
                        class="input" />
                </div>
                <div class="filter-item">
                    <label>Category</label>
                    <select v-model="categoryFilter" @change="page = 1" class="input">
                        <option value="">All Categories</option>
                        <option v-for="c in categories" :key="c" :value="c">{{ c.charAt(0).toUpperCase() + c.slice(1) }}
                        </option>
                    </select>
                </div>
                <div class="filter-item">
                    <label>Status</label>
                    <select v-model="statusFilter" @change="page = 1" class="input">
                        <option value="">All</option>
                        <option value="published">Published</option>
                        <option value="draft">Draft</option>
                    </select>
                </div>
            </div>
        </div>
        <div class="table-card">
            <div v-if="pending" class="loading-rows">
                <div v-for="i in 6" :key="i" class="sk-row">
                    <div class="sk-cell wide"></div>
                    <div class="sk-cell mid"></div>
                    <div class="sk-cell narrow rounded-full"></div>
                </div>
            </div>
            <table v-else-if="postsData?.data?.length" class="data-table">
                <thead>
                    <tr>
                        <th>Title</th>
                        <th>Category</th>
                        <th>Author</th>
                        <th>Status</th>
                        <th>Views</th>
                        <th class="text-right">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="post in postsData.data" :key="post.id">
                        <td class="font-medium">{{ post.title }}</td>
                        <td><span class="badge badge-blue">{{ post.category }}</span></td>
                        <td class="muted">{{ post.author ? `${post.author.first_name} ${post.author.last_name}` : "—" }}
                        </td>
                        <td>
                            <button @click="togglePublish(post)" :disabled="toggling === post.id" class="status-toggle"
                                :class="post.is_published ? 'published' : 'draft'">
                                {{ toggling === post.id ? "…" : post.is_published ? "Published" : "Draft" }}
                            </button>
                        </td>
                        <td class="muted">{{ post.views ?? 0 }}</td>
                        <td class="text-right">
                            <NuxtLink :to="`/admin/posts/${post.id}`" class="action-link">Edit</NuxtLink>
                            <button @click="deletePost(post.id)" :disabled="deletingId === post.id"
                                class="action-del">{{ deletingId === post.id ? "…" : "Delete" }}</button>
                        </td>
                    </tr>
                </tbody>
            </table>
            <div v-else class="empty-state">
                <Icon name="mdi:newspaper-remove" />
                <p>No posts found</p>
            </div>
            <div v-if="postsData?.meta && postsData.meta.last_page > 1" class="pagination">
                <span class="page-info">{{ postsData.meta.from }}–{{ postsData.meta.to }} of {{ postsData.meta.total
                    }}</span>
                <div class="page-btns">
                    <button @click="goToPage(page - 1)" :disabled="page <= 1" class="page-btn">‹</button>
                    <button v-for="n in postsData.meta.last_page" :key="n" @click="goToPage(n)" class="page-btn"
                        :class="{ 'page-active': n === page }">{{ n }}</button>
                    <button @click="goToPage(page + 1)" :disabled="page >= postsData.meta.last_page"
                        class="page-btn">›</button>
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
}

.filter-item {
    display: flex;
    flex-direction: column;
    gap: 0.35rem;
    flex: 1;
    min-width: 160px;
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
    text-transform: capitalize;
}

.badge-blue {
    background: #dbeafe;
    color: #2563eb;
}

.status-toggle {
    padding: 0.2rem 0.65rem;
    border-radius: 99px;
    font-size: 0.72rem;
    font-weight: 700;
    border: none;
    cursor: pointer;
}

.status-toggle.published {
    background: #dcfce7;
    color: #16a34a;
}

.status-toggle.draft {
    background: #f4f4f5;
    color: #52525b;
}

.status-toggle:disabled {
    opacity: 0.5;
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
