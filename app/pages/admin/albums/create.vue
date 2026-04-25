<script setup lang="ts">
import { useQuery } from '@pinia/colada';
import type { AlbumResponse, EventsListResponse } from "~/types/api";
import { AlbumCategory } from "~/types/enums";
import { validateAlbum, hasErrors } from "~/utils/validation";
import { toast } from 'vue-sonner';

definePageMeta({ layout: "admin", middleware: "sidebase-auth" });
useHead({ title: 'Create Album | LC Admin' });

const api = useApi();
const router = useRouter();

const form = ref({
    title: "", description: "",
    category: AlbumCategory.EVENT as string,
    event_id: "" as string | null,
});

const errors = ref<Record<string, string>>({});
const loading = ref(false);

const { data: eventsData } = useQuery({
    key: ['events-list'],
    query: () => api.get<EventsListResponse>("/events", { per_page: 50 })
});

const validate = () => {
    errors.value = validateAlbum({ title: form.value.title, category: form.value.category });
    return !hasErrors(errors.value);
};

const submit = async () => {
    if (!validate()) return;
    loading.value = true;
    try {
        const payload = { ...form.value, event_id: form.value.event_id || undefined };
        const res = await api.post<AlbumResponse>("/albums", payload);
        router.push(`/admin/albums/${res.data?.id}`); // Redirect to edit so they can upload images
    } catch (e: any) { toast.error(e.message || "Failed to create album"); }
    finally { loading.value = false; }
};

const categories = Object.values(AlbumCategory);
</script>

<template>
    <div>
        <div class="page-header">
            <NuxtLink to="/admin/albums" class="back-link">
                <Icon name="mdi:arrow-left" /> Back to Albums
            </NuxtLink>
        </div>
        <h2 class="page-title">Create Album</h2>

        <form @submit.prevent="submit" class="form-card">
            <div class="alert-info">
                <Icon name="mdi:information-outline" />
                <p>You can upload images to this album after creating the album details.</p>
            </div>

            <div class="field" :class="{ errored: errors.title }">
                <label>Album Title <span class="req">*</span></label>
                <input v-model="form.title" type="text" class="input" />
                <p v-if="errors.title" class="field-error">{{ errors.title }}</p>
            </div>

            <div class="field">
                <label>Description (Optional)</label>
                <textarea v-model="form.description" class="input textarea" rows="3"></textarea>
            </div>

            <div class="form-grid-2">
                <div class="field" :class="{ errored: errors.category }">
                    <label>Category <span class="req">*</span></label>
                    <select v-model="form.category" class="input">
                        <option v-for="c in categories" :key="c" :value="c">{{ c.charAt(0).toUpperCase() + c.slice(1) }}
                        </option>
                    </select>
                </div>
                <div class="field">
                    <label>Link to Event (Optional)</label>
                    <select v-model="form.event_id" class="input">
                        <option value="">No associated event</option>
                        <option v-for="ev in eventsData?.data" :key="ev.id" :value="ev.id">{{ ev.title }} ({{ new
                            Date(ev.start_date).toLocaleDateString() }})</option>
                    </select>
                </div>
            </div>

            <div class="form-actions">
                <NuxtLink to="/admin/albums" class="btn-ghost">Cancel</NuxtLink>
                <button type="submit" :disabled="loading" class="btn-primary">
                    {{ loading ? "Creating…" : "Create & Next" }}
                    <Icon name="mdi:arrow-right" v-if="!loading" />
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
    display: flex;
    flex-direction: column;
    gap: 1.25rem;
}

.alert-info {
    background: #e0f2fe;
    color: #0369a1;
    padding: 1rem 1.25rem;
    border-radius: 8px;
    display: flex;
    align-items: flex-start;
    gap: 0.6rem;
    font-size: 0.875rem;
    font-weight: 500;
}

.alert-info icon {
    font-size: 1.25rem;
    flex-shrink: 0;
}

.alert-info p {
    margin: 0;
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
    width: 100%;
}

.input:focus {
    border-color: #E05615;
    background: #fff;
}

.textarea {
    resize: vertical;
}

.errored .input {
    border-color: #dc2626;
}

.field-error {
    font-size: 0.78rem;
    color: #dc2626;
    margin: 0;
}

.form-actions {
    display: flex;
    justify-content: flex-end;
    gap: 0.75rem;
    padding-top: 1rem;
    border-top: 1px solid #f4f4f5;
    margin-top: 0.5rem;
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
    transition: all 0.15s;
}

.btn-ghost:hover {
    border-color: #27272a;
    color: #27272a;
}
</style>
