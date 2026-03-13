<script setup lang="ts">
import type { EventResponse } from "~/types/api";
import { validateEvent, hasErrors } from "~/utils/validation";

definePageMeta({ layout: "admin", middleware: "sidebase-auth" });
useHead({ title: 'Create Event | LC Admin' });

const api = useApi();
const router = useRouter();

const form = ref({
    title: "",
    description: "",
    location: "",
    event_dates: [""] as string[],
    is_recurring: false,
    recurrence_pattern: "",
});

const errors = ref<Record<string, string>>({});
const loading = ref(false);

const addDate = () => form.value.event_dates.push("");
const removeDate = (i: number) => form.value.event_dates.splice(i, 1);

const validate = () => {
    errors.value = validateEvent({
        title: form.value.title,
        description: form.value.description,
        location: form.value.location,
        event_dates: form.value.event_dates.filter(Boolean),
    });
    return !hasErrors(errors.value);
};

const submit = async () => {
    if (!validate()) return;
    loading.value = true;
    try {
        const payload = { ...form.value, event_dates: form.value.event_dates.filter(Boolean) };
        await api.post<EventResponse>("/events", payload);
        router.push("/admin/events");
    } catch (e: any) {
        alert(e.message || "Failed to create event");
    } finally { loading.value = false; }
};
</script>

<template>
    <div>
        <div class="page-header">
            <NuxtLink to="/admin/events" class="back-link">
                <Icon name="mdi:arrow-left" /> Back to Events
            </NuxtLink>
        </div>
        <h2 class="page-title">Create Event</h2>
        <form @submit.prevent="submit" class="form-card">
            <div class="field" :class="{ errored: errors.title }">
                <label>Title <span class="req">*</span></label>
                <input v-model="form.title" type="text" class="input" />
                <p v-if="errors.title" class="field-error">{{ errors.title }}</p>
            </div>
            <div class="field" :class="{ errored: errors.description }">
                <label>Description <span class="req">*</span></label>
                <textarea v-model="form.description" class="input textarea" rows="4"></textarea>
                <p v-if="errors.description" class="field-error">{{ errors.description }}</p>
            </div>
            <div class="field" :class="{ errored: errors.location }">
                <label>Location <span class="req">*</span></label>
                <input v-model="form.location" type="text" class="input" />
                <p v-if="errors.location" class="field-error">{{ errors.location }}</p>
            </div>

            <div class="field" :class="{ errored: errors.event_dates }">
                <label>Event Dates <span class="req">*</span></label>
                <div class="dates-list">
                    <div v-for="(_, i) in form.event_dates" :key="i" class="date-row">
                        <input v-model="form.event_dates[i]" type="datetime-local" class="input date-input" />
                        <button type="button" @click="removeDate(i)" v-if="form.event_dates.length > 1"
                            class="remove-btn">
                            <Icon name="mdi:close" />
                        </button>
                    </div>
                </div>
                <button type="button" @click="addDate" class="add-date-btn">
                    <Icon name="mdi:plus" /> Add Another Date
                </button>
                <p v-if="errors.event_dates" class="field-error">{{ errors.event_dates }}</p>
            </div>

            <div class="form-grid-2">
                <div class="field">
                    <label class="checkbox-item">
                        <input v-model="form.is_recurring" type="checkbox" />
                        <span>Recurring Event</span>
                    </label>
                </div>
                <div class="field" v-if="form.is_recurring">
                    <label>Recurrence Pattern</label>
                    <input v-model="form.recurrence_pattern" type="text" class="input"
                        placeholder="e.g. Every Sunday" />
                </div>
            </div>

            <div class="form-actions">
                <NuxtLink to="/admin/events" class="btn-ghost">Cancel</NuxtLink>
                <button type="submit" :disabled="loading" class="btn-primary">{{ loading ? "Creating…" : "Create Event"
                    }}</button>
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
    min-height: 100px;
}

.errored .input {
    border-color: #dc2626;
}

.field-error {
    font-size: 0.78rem;
    color: #dc2626;
    margin: 0;
}

.dates-list {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
}

.date-row {
    display: flex;
    align-items: center;
    gap: 0.5rem;
}

.date-input {
    flex: 1;
}

.remove-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 32px;
    height: 32px;
    border: 1px solid #e4e4e7;
    border-radius: 6px;
    background: #fff;
    color: #dc2626;
    cursor: pointer;
    flex-shrink: 0;
}

.add-date-btn {
    display: inline-flex;
    align-items: center;
    gap: 0.3rem;
    font-size: 0.8rem;
    font-weight: 600;
    color: #E05615;
    background: transparent;
    border: 1px dashed #E05615;
    border-radius: 8px;
    padding: 0.4rem 0.85rem;
    cursor: pointer;
    width: fit-content;
}

.checkbox-item {
    display: flex !important;
    flex-direction: row !important;
    align-items: center;
    gap: 0.4rem;
    font-size: 0.875rem;
    cursor: pointer;
    text-transform: none !important;
    letter-spacing: 0 !important;
}

.checkbox-item input {
    accent-color: #E05615;
}

.form-actions {
    display: flex;
    justify-content: flex-end;
    gap: 0.75rem;
    padding-top: 1rem;
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
}

.btn-ghost:hover {
    border-color: #27272a;
    color: #27272a;
}
</style>
