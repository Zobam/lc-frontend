<script setup lang="ts">
import type { UserResponse, RolesListResponse } from "~/types/api";
import { UserStatus } from "~/types/enums";
import { validateCreateUser, hasErrors } from "~/utils/validation";

definePageMeta({ layout: "admin", middleware: "sidebase-auth" });
useHead({ title: 'Create User | LC Admin' });

const api = useApi();
const router = useRouter();

const form = ref({
    first_name: "",
    last_name: "",
    email: "",
    password: "",
    phone_number: "",
    status: UserStatus.ACTIVE,
    role_ids: [] as string[],
});

const errors = ref<Record<string, string>>({});
const loading = ref(false);

const { data: rolesRes } = await useAsyncData("roles", () => api.get<RolesListResponse>("/roles"), { lazy: true });

const validate = () => {
    errors.value = validateCreateUser(form.value);
    return !hasErrors(errors.value);
};

const submit = async () => {
    if (!validate()) return;
    loading.value = true;
    try {
        await api.post<UserResponse>("/users", form.value);
        router.push("/admin/users");
    } catch (e: any) {
        alert(e.message || "Failed to create user");
    } finally {
        loading.value = false;
    }
};
</script>

<template>
    <div>
        <div class="page-header">
            <NuxtLink to="/admin/users" class="back-link">
                <Icon name="mdi:arrow-left" /> Back to Users
            </NuxtLink>
        </div>
        <h2 class="page-title">Create User</h2>

        <form @submit.prevent="submit" class="form-card">
            <div class="form-grid-2">
                <div class="field" :class="{ errored: errors.first_name }">
                    <label>First Name <span class="req">*</span></label>
                    <input v-model="form.first_name" type="text" class="input" />
                    <p v-if="errors.first_name" class="field-error">{{ errors.first_name }}</p>
                </div>
                <div class="field" :class="{ errored: errors.last_name }">
                    <label>Last Name <span class="req">*</span></label>
                    <input v-model="form.last_name" type="text" class="input" />
                    <p v-if="errors.last_name" class="field-error">{{ errors.last_name }}</p>
                </div>
                <div class="field" :class="{ errored: errors.email }">
                    <label>Email <span class="req">*</span></label>
                    <input v-model="form.email" type="email" class="input" />
                    <p v-if="errors.email" class="field-error">{{ errors.email }}</p>
                </div>
                <div class="field" :class="{ errored: errors.password }">
                    <label>Password <span class="req">*</span></label>
                    <input v-model="form.password" type="password" class="input" />
                    <p v-if="errors.password" class="field-error">{{ errors.password }}</p>
                </div>
                <div class="field">
                    <label>Phone Number</label>
                    <input v-model="form.phone_number" type="tel" class="input" placeholder="e.g. 08012345678" />
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

            <div class="field mt-4">
                <label>Assign Roles</label>
                <div v-if="rolesRes?.data" class="checkbox-group">
                    <label v-for="role in rolesRes.data.data" :key="role.id" class="checkbox-item">
                        <input v-model="form.role_ids" type="checkbox" :value="role.id" />
                        <span>{{ role.name }}</span>
                    </label>
                </div>
                <p v-else class="muted-text">Loading roles…</p>
            </div>

            <div class="form-actions">
                <NuxtLink to="/admin/users" class="btn-ghost">Cancel</NuxtLink>
                <button type="submit" :disabled="loading" class="btn-primary">
                    {{ loading ? "Creating…" : "Create User" }}
                </button>
            </div>
        </form>
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

.form-grid-2 {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1.25rem;
}

@media (max-width: 640px) {
    .form-grid-2 {
        grid-template-columns: 1fr;
    }
}

.mt-4 {
    margin-top: 1.25rem;
}

.field {
    display: flex;
    flex-direction: column;
    gap: 0.4rem;
}

.field label {
    font-size: 0.8rem;
    font-weight: 600;
    color: #52525b;
    text-transform: uppercase;
    letter-spacing: 0.04em;
}

.req {
    color: #E05615;
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

.errored .input {
    border-color: #dc2626;
}

.field-error {
    font-size: 0.78rem;
    color: #dc2626;
    margin: 0;
}

.muted-text {
    font-size: 0.85rem;
    color: #a1a1aa;
}

.checkbox-group {
    display: flex;
    flex-wrap: wrap;
    gap: 0.65rem;
    margin-top: 0.25rem;
}

.checkbox-item {
    display: flex;
    align-items: center;
    gap: 0.4rem;
    font-size: 0.875rem;
    color: #27272a;
    cursor: pointer;
}

.checkbox-item input {
    accent-color: #E05615;
}

.form-actions {
    display: flex;
    justify-content: flex-end;
    gap: 0.75rem;
    margin-top: 2rem;
    padding-top: 1.5rem;
    border-top: 1px solid #f4f4f5;
}

.btn-primary {
    display: flex;
    align-items: center;
    gap: 0.4rem;
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

.btn-ghost {
    display: flex;
    align-items: center;
    padding: 0.6rem 1.5rem;
    background: transparent;
    border: 1px solid #e4e4e7;
    border-radius: 8px;
    font-size: 0.875rem;
    font-weight: 600;
    color: #52525b;
    text-decoration: none;
    cursor: pointer;
    transition: all 0.15s;
}

.btn-ghost:hover {
    border-color: #27272a;
    color: #27272a;
}
</style>
