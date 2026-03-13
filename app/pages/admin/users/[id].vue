<script setup lang="ts">
import type { UserResponse, RolesListResponse } from "~/types/api";
import { UserStatus } from "~/types/enums";

definePageMeta({ layout: "admin", middleware: "sidebase-auth" });
useHead({ title: 'Edit User | LC Admin' });

const api = useApi();
const route = useRoute();
const router = useRouter();
const userId = route.params.id as string;

const { data: userRes, pending, refresh } = await useAsyncData(
    `user-${userId}`,
    () => api.get<UserResponse>(`/users/${userId}`)
);

const { data: rolesRes } = await useAsyncData("roles-edit", () => api.get<RolesListResponse>("/roles"), { lazy: true });

const form = ref({
    first_name: "",
    last_name: "",
    email: "",
    phone_number: "",
    status: UserStatus.ACTIVE,
});

const roleIds = ref<string[]>([]);
const loading = ref(false);
const tab = ref<"details" | "roles">("details");

// Hydrate form when data arrives
watch(userRes, (r) => {
    if (r?.data) {
        form.value = {
            first_name: r.data.first_name,
            last_name: r.data.last_name,
            email: r.data.email,
            phone_number: r.data.phone_number ?? "",
            status: r.data.status,
        };
        roleIds.value = r.data.roles?.map(r => r.id) ?? [];
    }
}, { immediate: true });

const updateUser = async () => {
    loading.value = true;
    try {
        await api.put<UserResponse>(`/users/${userId}`, form.value);
        refresh();
        alert("User updated successfully");
    } catch (e: any) {
        alert(e.message || "Failed to update user");
    } finally { loading.value = false; }
};

const assignRoles = async () => {
    loading.value = true;
    try {
        await api.post(`/users/${userId}/assign-roles`, { role_ids: roleIds.value });
        refresh();
        alert("Roles updated successfully");
    } catch (e: any) {
        alert(e.message || "Failed to update roles");
    } finally { loading.value = false; }
};
</script>

<template>
    <div>
        <div class="page-header">
            <NuxtLink to="/admin/users" class="back-link">
                <Icon name="mdi:arrow-left" /> Back to Users
            </NuxtLink>
        </div>
        <h2 class="page-title">Edit User</h2>

        <div v-if="pending" class="form-card">
            <div class="sk-block"></div>
        </div>

        <div v-else-if="userRes?.data" class="form-card">
            <div class="user-meta">
                <div class="user-avatar-lg">{{ (userRes.data.first_name?.[0] ?? "") + (userRes.data.last_name?.[0] ??
                    "") }}</div>
                <div>
                    <p class="user-fullname">{{ userRes.data.first_name }} {{ userRes.data.last_name }}</p>
                    <p class="user-email">{{ userRes.data.email }}</p>
                </div>
            </div>

            <!-- Tabs -->
            <div class="tabs">
                <button class="tab" :class="{ 'tab-active': tab === 'details' }"
                    @click="tab = 'details'">Details</button>
                <button class="tab" :class="{ 'tab-active': tab === 'roles' }" @click="tab = 'roles'">Roles</button>
            </div>

            <!-- Details Tab -->
            <form v-if="tab === 'details'" @submit.prevent="updateUser">
                <div class="form-grid-2">
                    <div class="field">
                        <label>First Name</label>
                        <input v-model="form.first_name" type="text" class="input" />
                    </div>
                    <div class="field">
                        <label>Last Name</label>
                        <input v-model="form.last_name" type="text" class="input" />
                    </div>
                    <div class="field">
                        <label>Email</label>
                        <input v-model="form.email" type="email" class="input" />
                    </div>
                    <div class="field">
                        <label>Phone Number</label>
                        <input v-model="form.phone_number" type="tel" class="input" />
                    </div>
                    <div class="field">
                        <label>Status</label>
                        <select v-model="form.status" class="input">
                            <option :value="UserStatus.ACTIVE">Active</option>
                            <option :value="UserStatus.INACTIVE">Inactive</option>
                            <option :value="UserStatus.SUSPENDED">Suspended</option>
                        </select>
                    </div>
                </div>
                <div class="form-actions">
                    <button type="submit" :disabled="loading" class="btn-primary">
                        {{ loading ? "Saving…" : "Save Changes" }}
                    </button>
                </div>
            </form>

            <!-- Roles Tab -->
            <div v-if="tab === 'roles'">
                <div v-if="rolesRes?.data" class="checkbox-group">
                    <label v-for="role in rolesRes.data" :key="role.id" class="checkbox-item">
                        <input v-model="roleIds" type="checkbox" :value="role.id" />
                        <span>{{ role.name }}</span>
                    </label>
                </div>
                <div class="form-actions">
                    <button @click="assignRoles" :disabled="loading" class="btn-primary">
                        {{ loading ? "Saving…" : "Update Roles" }}
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.page-header {
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

.page-title {
    font-size: 1.5rem;
    font-weight: 800;
    color: #1A0E08;
    margin: 0 0 1.5rem;
}

.form-card {
    background: #fff;
    border-radius: 12px;
    padding: 2rem;
    border: 1px solid #f4f4f5;
    max-width: 800px;
}

.user-meta {
    display: flex;
    align-items: center;
    gap: 1rem;
    margin-bottom: 1.75rem;
    padding-bottom: 1.5rem;
    border-bottom: 1px solid #f4f4f5;
}

.user-avatar-lg {
    width: 54px;
    height: 54px;
    border-radius: 50%;
    background: #E05615;
    color: #fff;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.2rem;
    font-weight: 700;
    text-transform: uppercase;
    flex-shrink: 0;
}

.user-fullname {
    font-size: 1.1rem;
    font-weight: 700;
    color: #1A0E08;
    margin: 0 0 0.2rem;
}

.user-email {
    font-size: 0.85rem;
    color: #71717a;
    margin: 0;
}

.tabs {
    display: flex;
    gap: 0.25rem;
    margin-bottom: 1.5rem;
    border-bottom: 1px solid #f4f4f5;
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
    transition: all 0.15s;
}

.tab-active {
    color: #E05615;
    border-bottom-color: #E05615;
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
}

.input:focus {
    border-color: #E05615;
    background: #fff;
}

.checkbox-group {
    display: flex;
    flex-wrap: wrap;
    gap: 0.75rem;
    padding: 0.5rem 0;
}

.checkbox-item {
    display: flex;
    align-items: center;
    gap: 0.4rem;
    font-size: 0.875rem;
    cursor: pointer;
}

.checkbox-item input {
    accent-color: #E05615;
}

.form-actions {
    display: flex;
    justify-content: flex-end;
    margin-top: 1.5rem;
    padding-top: 1.25rem;
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
    transition: background 0.15s;
}

.btn-primary:hover {
    background: #B84410;
}

.btn-primary:disabled {
    opacity: 0.6;
    cursor: not-allowed;
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
        opacity: 0.4;
    }
}
</style>
