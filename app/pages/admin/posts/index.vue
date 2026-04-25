<script setup lang="ts">
import type { PostsListResponse } from "~/types/api";
import { PostCategory } from "~/types/enums";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { toast } from 'vue-sonner';

definePageMeta({ layout: "admin", middleware: "sidebase-auth" });
useHead({ title: 'Manage Posts | LC Admin' });

const api = useApi();
const route = useRoute();
const router = useRouter();

const page = ref(Number(route.query.page) || 1);
const search = ref((route.query.search as string) || "");
const categoryFilter = ref((route.query.category as string) || "");
const statusFilter = ref((route.query.status as string) || "");

const { data: postsData, status, refetch: refresh } = useQuery({
    key: () => ["admin-posts", page.value, search.value, categoryFilter.value, statusFilter.value],
    query: () => api.get<PostsListResponse>("/posts/manage/all", {
        page: page.value, per_page: 15,
        search: search.value,
        category: categoryFilter.value,
        status: statusFilter.value,
    }),
});
const pending = computed(() => status.value === 'pending');

let searchTimer: ReturnType<typeof setTimeout>;
const handleSearch = () => { clearTimeout(searchTimer); searchTimer = setTimeout(() => { page.value = 1; }, 450); };
const goToPage = (n: number) => { page.value = n; };

// Single busy-id covers delete, publish AND unpublish
const busyId = ref<string | null>(null);

const deletePost = async (id: string) => {
    if (!await useConfirmDialog().showConfirm("Delete this post?", "Delete Post")) return;
    busyId.value = id;
    try { await api.delete(`/posts/${id}`); toast.success("Post deleted."); refresh(); }
    catch (e: any) { toast.error(e.message); }
    finally { busyId.value = null; }
};

const publishPost = async (id: string) => {
    busyId.value = id;
    try { await api.put(`/posts/${id}/approve`); toast.success("Post published."); refresh(); }
    catch (e: any) { toast.error(e.message); }
    finally { busyId.value = null; }
};

const unpublishPost = async (id: string) => {
    busyId.value = id;
    try { await api.put(`/posts/${id}/unpublish`); toast.success("Post unpublished."); refresh(); }
    catch (e: any) { toast.error(e.message); }
    finally { busyId.value = null; }
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
                            <span class="status-pill" :class="post.is_published ? 'published' : 'draft'">
                                {{ post.is_published ? "Published" : "Draft" }}
                            </span>
                        </td>
                        <td class="muted">{{ post.views ?? 0 }}</td>
                        <td class="text-right">
                            <DropdownMenu>
                                <DropdownMenuTrigger as-child>
                                    <button class="action-trigger" :disabled="busyId === post.id">
                                        <Icon v-if="busyId === post.id" name="mdi:loading" class="spin" />
                                        <Icon v-else name="mdi:dots-horizontal" />
                                    </button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" class="w-40">
                                    <DropdownMenuItem as-child>
                                        <NuxtLink :to="`/admin/posts/${post.id}_${post.slug}`" class="menu-item-link">
                                            <Icon name="mdi:pencil-outline" /> Edit
                                        </NuxtLink>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem
                                        @click="post.is_published ? unpublishPost(post.id) : publishPost(post.id)"
                                        :class="post.is_published ? 'text-amber-600' : 'text-green-600'">
                                        <Icon :name="post.is_published ? 'mdi:eye-off-outline' : 'mdi:eye-outline'" />
                                        {{ post.is_published ? 'Unpublish' : 'Publish' }}
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem @click="deletePost(post.id)" class="text-red-600">
                                        <Icon name="mdi:trash-can-outline" /> Delete
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </td>
                    </tr>
                </tbody>
            </table>
            <div v-else class="empty-state">
                <Icon name="mdi:newspaper-remove" />
                <p>No posts found</p>
            </div>
            <AdminPagination v-if="postsData?.data?.last_page" :current-page="postsData.data.current_page"
                :total-pages="postsData.data.last_page" :total="postsData.data.total" :from="postsData.data.from"
                :to="postsData.data.to" @change="goToPage" />
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

/* Status pill (read-only badge, no longer a button) */
.status-pill {
    display: inline-block;
    padding: 0.2rem 0.65rem;
    border-radius: 99px;
    font-size: 0.72rem;
    font-weight: 700;
}

.status-pill.published {
    background: #dcfce7;
    color: #16a34a;
}

.status-pill.draft {
    background: #f4f4f5;
    color: #52525b;
}

/* Dropdown trigger button */
.action-trigger {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 30px;
    height: 30px;
    border-radius: 6px;
    border: 1px solid #e4e4e7;
    background: #fff;
    cursor: pointer;
    color: #52525b;
    transition: background 0.15s, border-color 0.15s;
}

.action-trigger:hover:not(:disabled) {
    background: #f4f4f5;
    border-color: #d4d4d8;
}

.action-trigger:disabled {
    opacity: 0.5;
    cursor: not-allowed;
}

/* Inline link inside a DropdownMenuItem */
.menu-item-link {
    display: flex;
    align-items: center;
    gap: 0.4rem;
    width: 100%;
    text-decoration: none;
    color: inherit;
}

/* Spinner animation */
.spin {
    animation: spin 0.7s linear infinite;
}

@keyframes spin {
    to {
        transform: rotate(360deg);
    }
}

.empty-state {
    padding: 4rem;
    text-align: center;
    color: #a1a1aa;
}
</style>
