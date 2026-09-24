<script setup lang="ts">
import type { EventResponse } from "~/types/api";
import { validateEvent, hasErrors } from "~/utils/validation";
import { toast } from 'vue-sonner';
import {
    Switch,
} from '@/components/ui/switch'

definePageMeta({ layout: "admin", middleware: "sidebase-auth" });
useHead({ title: 'Create Event | LC Admin' });

const api = useApi();
const router = useRouter();

const form = ref({
    title: "",
    description: "",
    location: "",
    event_dates: [{ start: "", end: "" }] as Array<{ start: string; end: string }>,
    is_recurring: false,
    recurring_frequency: "",
    is_multi_day: false,
});

const errors = ref<Record<string, string>>({});
const loading = ref(false);

const eventFrequencies = [
    { value: "daily", label: "Daily" },
    { value: "weekly", label: "Weekly" },
    { value: "monthly", label: "Monthly" },
    { value: "monthly_first_friday", label: "Monthly - First Friday" },
];

const validateForm = () => {
    const newErrors: Record<string, string> = {};

    // Title validation
    if (form.value.title.length < 3) {
        newErrors.title = "Title must be at least 3 characters";
    } else if (form.value.title.length > 150) {
        newErrors.title = "Title must not exceed 150 characters";
    }

    // Description validation
    if (form.value.description.length < 10) {
        newErrors.description = "Description must be at least 10 characters";
    } else if (form.value.description.length > 1500) {
        newErrors.description = "Description must not exceed 1500 characters";
    }

    // Location validation
    if (form.value.location.length < 3) {
        newErrors.location = "Location must be at least 3 characters";
    } else if (form.value.location.length > 150) {
        newErrors.location = "Location must not exceed 150 characters";
    }

    // Event dates validation
    const validDates = form.value.event_dates.filter(d => d.start && d.end);
    if (validDates.length < 1) {
        newErrors.event_dates = "At least one event date with start and end time is required";
    }

    // Recurring frequency validation
    if (form.value.is_recurring && !form.value.recurring_frequency) {
        newErrors.recurring_frequency = "Frequency is required for recurring events";
    }

    errors.value = newErrors;
    return Object.keys(newErrors).length === 0;
};

const isFormValid = computed(() => {
    const validDates = form.value.event_dates.filter(d => d.start && d.end);
    const titleValid = form.value.title.length >= 3 && form.value.title.length <= 150;
    const descriptionValid = form.value.description.length >= 10 && form.value.description.length <= 1500;
    const locationValid = form.value.location.length >= 3 && form.value.location.length <= 150;
    const datesValid = validDates.length >= 1;
    const frequencyValid = !form.value.is_recurring || form.value.recurring_frequency;

    return titleValid && descriptionValid && locationValid && datesValid && frequencyValid;
});

const addDate = () => form.value.event_dates.push({ start: "", end: "" });
const removeDate = (i: number) => form.value.event_dates.splice(i, 1);

// Watch for multi_day toggle to remove extra dates when toggled off
watch(() => form.value.is_multi_day, (isMultiDay) => {
    if (!isMultiDay && form.value.event_dates.length > 1) {
        // Keep only the first date when toggling off
        form.value.event_dates = [form.value.event_dates[0]];
    }
});

const updateStartDate = (index: number, value: string) => {
    form.value.event_dates[index].start = value;

    // Auto-fill end date if single-day event and end date is empty
    if (!form.value.is_multi_day && !form.value.event_dates[index].end && value) {
        const startDate = new Date(value);
        const endDate = new Date(startDate.getTime() + 2 * 60 * 60 * 1000); // Add 2 hours
        form.value.event_dates[index].end = endDate.toISOString().slice(0, 16);
    }
};

const submit = async () => {
    if (!validateForm()) return;
    loading.value = true;
    try {
        const payload = {
            ...form.value,
            event_dates: form.value.event_dates.filter(d => d.start && d.end)
        };
        await api.post<EventResponse>("/events", payload);
        router.push("/admin/events");
    } catch (e: any) {
        toast.error(e.message || "Failed to create event");
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
                <div class="dates-header">
                    <label>Event Dates <span class="req">*</span></label>
                    <div class="multi-day-switch">
                        <label class="switch-label">Is Multi-day</label>
                        <Switch v-model="form.is_multi_day" />
                    </div>
                </div>
                <div class="dates-list">
                    <div v-for="(_, i) in form.event_dates" :key="i" class="date-pair">
                        <div class="date-input-group">
                            <label class="date-label">Start <span v-if="!form.is_multi_day" class="date-sublabel">(auto
                                    fills end)</span></label>
                            <input :value="form.event_dates[i].start"
                                @input="(e: any) => updateStartDate(i, e.target.value)" type="datetime-local"
                                class="input date-input" />
                        </div>
                        <div class="date-input-group">
                            <label class="date-label">End</label>
                            <input v-model="form.event_dates[i].end" type="datetime-local" class="input date-input" />
                        </div>
                        <button type="button" @click="removeDate(i)" v-if="form.event_dates.length > 1"
                            class="remove-btn">
                            <Icon name="mdi:close" />
                        </button>
                    </div>
                </div>
                <button v-if="form.is_multi_day" type="button" @click="addDate" class="add-date-btn">
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
                <div class="field" :class="{ errored: errors.recurring_frequency }" v-if="form.is_recurring">
                    <label>Recurring Frequency</label>
                    <select v-model="form.recurring_frequency" class="input">
                        <option value="">Select frequency</option>
                        <option v-for="freq in eventFrequencies" :key="freq.value" :value="freq.value">
                            {{ freq.label }}
                        </option>
                    </select>
                    <p v-if="errors.recurring_frequency" class="field-error">{{ errors.recurring_frequency }}</p>
                </div>
            </div>

            <div class="form-actions">
                <NuxtLink to="/admin/events" class="btn-ghost">Cancel</NuxtLink>
                <button type="submit" :disabled="!isFormValid || loading" class="btn-primary">{{ loading ? "Creating…" :
                    "Create Event"
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
    gap: 0.75rem;
}

.dates-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 1rem;
}

.dates-header label {
    margin: 0;
}

.multi-day-switch {
    display: flex;
    align-items: center;
    gap: 0.4rem;
}

.switch-label {
    font-size: 0.75rem;
    font-weight: 600;
    color: #52525b;
    text-transform: uppercase;
    letter-spacing: 0.04em;
    margin: 0;
}

.date-pair {
    display: grid;
    grid-template-columns: 1fr 1fr auto;
    gap: 0.5rem;
    align-items: flex-end;
    padding: 0.75rem;
    background: #f9fafb;
    border-radius: 8px;
    border: 1px solid #e5e7eb;
}

.date-input-group {
    display: flex;
    flex-direction: column;
    gap: 0.3rem;
}

.date-label {
    font-size: 0.7rem;
    font-weight: 600;
    color: #6b7280;
    text-transform: uppercase;
    letter-spacing: 0.03em;
}

.date-sublabel {
    font-size: 0.65rem;
    color: #9ca3af;
    font-weight: 400;
    text-transform: none;
    letter-spacing: 0;
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
