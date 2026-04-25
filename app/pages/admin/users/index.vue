<script setup lang="ts">
import type { UsersListResponse } from "~/types/api";
import { UserStatus } from "~/types/enums";
import { toast } from 'vue-sonner';

definePageMeta({ layout: "admin", middleware: "sidebase-auth" });
useHead({ title: 'Manage Users | LC Admin' });

const api = useApi();
const route = useRoute();
const router = useRouter();

const page = ref(Number(route.query.page) || 1);
const search = ref((route.query.search as string) || "");
const statusFilter = ref((route.query.status as string) || "");

const { data: usersData, status, refetch: refresh } = useQuery({
    key: () => ["admin-users", page.value, search.value, statusFilter.value],
    query: () => api.get<UsersListResponse>("/users", {
        page: page.value,
        per_page: 15,
        search: search.value,
        status: statusFilter.value,
    }),
});
const pending = computed(() => status.value === 'pending');

let searchTimer: ReturnType<typeof setTimeout>;
const handleSearch = () => {
    clearTimeout(searchTimer);
    searchTimer = setTimeout(() => {
        page.value = 1;
        router.push({ query: { ...route.query, search: search.value || undefined, page: 1 } });
    }, 450);
};

const handleFilter = () => {
    page.value = 1;
    router.push({ query: { ...route.query, status: statusFilter.value || undefined, page: 1 } });
};

const goToPage = (n: number) => {
    page.value = n;
    router.push({ query: { ...route.query, page: n } });
};

const deletingId = ref<string | null>(null);
const deleteUser = async (id: string) => {
    if (!await useConfirmDialog().showConfirm("Delete this user? This cannot be undone.", "Delete User")) return;
    deletingId.value = id;
    try {
        await api.delete(`/users/${id}`);
        refresh();
    } catch (e: any) {
        toast.error(e.message || "Failed to delete user");
    } finally {
        deletingId.value = null;
    }
};

const statusClass = (s: string) =>
    s === UserStatus.ACTIVE ? "badge-green" :
        s === UserStatus.INACTIVE ? "badge-gray" : "badge-red";
</script>

<template>
    <div>
        <div class="page-header">
            <div>
                <h2 class="page-title">Users</h2>
                <p class="page-desc">Manage all registered users and their roles.</p>
            </div>
            <NuxtLink to="/admin/users/create" class="btn-primary">
                <Icon name="mdi:account-plus" /> New User
            </NuxtLink>
        </div>

        <div class="filter-card">
            <div class="filter-row">
                <div class="filter-item">
                    <label>Search</label>
                    <input v-model="search" @input="handleSearch" type="text" placeholder="Name or email…"
                        class="input" />
                </div>
                <div class="filter-item">
                    <label>Status</label>
                    <select v-model="statusFilter" @change="handleFilter" class="input">
                        <option value="">All Statuses</option>
                        <option :value="UserStatus.ACTIVE">Active</option>
                        <option :value="UserStatus.INACTIVE">Inactive</option>
                        <option :value="UserStatus.SUSPENDED">Suspended</option>
                    </select>
                </div>
            </div>
        </div>

        <div class="table-card">
            <div v-if="pending" class="table-loading">
                <div v-for="i in 6" :key="i" class="sk-row">
                    <div class="sk-cell w-8 h-8 rounded-full"></div>
                    <div class="sk-cell w-36 h-4"></div>
                    <div class="sk-cell w-48 h-4"></div>
                    <div class="sk-cell w-16 h-5 rounded-full"></div>
                    <div class="sk-cell w-24 h-4"></div>
                </div>
            </div>

            <table v-else-if="usersData?.data?.length" class="data-table">
                <thead>
                    <tr>
                        <th>User</th>
                        <th>Email</th>
                        <th>Status</th>
                        <th>Roles</th>
                        <th>Joined</th>
                        <th class="text-right">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="user in usersData.data" :key="user.id">
                        <td>
                            <div class="user-cell">
                                <div class="user-avatar">{{ (user.first_name?.[0] ?? "") + (user.last_name?.[0] ?? "")
                                }}</div>
                                <span>{{ user.first_name }} {{ user.last_name }}</span>
                            </div>
                        </td>
                        <td class="muted">{{ user.email }}</td>
                        <td><span class="badge" :class="statusClass(user.status)">{{ user.status }}</span></td>
                        <td class="muted">{{user.roles?.map(r => r.name).join(", ") || "—"}}</td>
                        <td class="muted">{{ new Date(user.created_at).toLocaleDateString() }}</td>
                        <td class="text-right">
                            <NuxtLink :to="`/admin/users/${user.id}`" class="action-link">Edit</NuxtLink>
                            <button @click="deleteUser(user.id)" 
                                :disabled="deletingId === user.id || user.roles?.some((r: any) => ['admin', 'super-admin'].includes(r.name))" 
                                class="action-del"
                                :title="user.roles?.some((r: any) => ['admin', 'super-admin'].includes(r.name)) ? 'Admins cannot be deleted' : ''">
                                {{ deletingId === user.id ? "…" : "Delete" }}
                            </button>
                        </td>
                    </tr>
                </tbody>
            </table>

            <div v-else class="empty-state">
                <Icon name="mdi:account-off" />
                <p>No users found</p>
            </div>

            <AdminPagination v-if="usersData?.pagination" :current-page="usersData.pagination.current_page"
                :total-pages="usersData.pagination.total_pages" :total="usersData.pagination.total_items"
                :from="usersData.pagination.from" :to="usersData.pagination.to" @change="goToPage" />
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
    border: none;
    cursor: pointer;
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
}

.filter-item {
    display: flex;
    flex-direction: column;
    gap: 0.35rem;
    flex: 1;
    min-width: 180px;
}

.filter-item label {
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

.table-card {
    background: #fff;
    border-radius: 12px;
    border: 1px solid #f4f4f5;
    overflow: hidden;
}

.table-loading {
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

.muted {
    color: #71717a !important;
}

.text-right {
    text-align: right !important;
}

.user-cell {
    display: flex;
    align-items: center;
    gap: 0.65rem;
    font-weight: 500;
}

.user-avatar {
    width: 32px;
    height: 32px;
    border-radius: 50%;
    background: #E05615;
    color: #fff;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 0.7rem;
    font-weight: 700;
    flex-shrink: 0;
    text-transform: uppercase;
}

.badge {
    padding: 0.2rem 0.6rem;
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

.badge-red {
    background: #fee2e2;
    color: #dc2626;
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

.action-del:hover {
    text-decoration: underline;
}

.action-del:disabled {
    opacity: 0.5;
    cursor: not-allowed;
}

.empty-state {
    padding: 4rem;
    text-align: center;
    color: #a1a1aa;
}
</style>
