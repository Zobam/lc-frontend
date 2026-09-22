<script setup lang="ts">
import { useQuery } from '@pinia/colada';
import type { EventResponse } from "~/types/api";
import { toast } from 'vue-sonner';

definePageMeta({ layout: "admin", middleware: "sidebase-auth" });
useHead({ title: 'Edit Event | LC Admin' });

const api = useApi();
const route = useRoute();
const router = useRouter();
const eventId = route.params.id as string;

const { data: eventRes, status, refetch: refresh } = useQuery({
    key: ['event', eventId],
    query: () => api.get<EventResponse>(`/events/${eventId}/admin`)
});
const pending = computed(() => status.value === 'pending');

const form = ref({
    title: "", description: "", location: "",
    event_dates: [""] as string[],
    is_recurring: false, recurring_frequency: "",
});

const loading = ref(false);
const activeImageTab = ref(false);

const eventFrequencies = [
    { value: "daily", label: "Daily" },
    { value: "weekly", label: "Weekly" },
    { value: "monthly", label: "Monthly" },
    { value: "monthly_first_friday", label: "Monthly - First Friday" },
];

const errors = ref<Record<string, string>>({});

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
    const validDates = form.value.event_dates.filter(d => d.trim());
    if (validDates.length < 2) {
        newErrors.event_dates = "At least 2 dates (start and end) are required";
    }

    // Recurring frequency validation
    if (form.value.is_recurring && !form.value.recurring_frequency) {
        newErrors.recurring_frequency = "Frequency is required for recurring events";
    }

    errors.value = newErrors;
    return Object.keys(newErrors).length === 0;
};

const isFormValid = computed(() => {
    const validDates = form.value.event_dates.filter(d => d.trim());
    const titleValid = form.value.title.length >= 3 && form.value.title.length <= 150;
    const descriptionValid = form.value.description.length >= 10 && form.value.description.length <= 1500;
    const locationValid = form.value.location.length >= 3 && form.value.location.length <= 150;
    const datesValid = validDates.length >= 2;
    const frequencyValid = !form.value.is_recurring || form.value.recurring_frequency;

    return titleValid && descriptionValid && locationValid && datesValid && frequencyValid;
});

watch(eventRes, (r) => {
    if (r?.data) {
        form.value = {
            title: r.data.title, description: r.data.description,
            location: r.data.location,
            event_dates: r.data.event_dates?.length ? r.data.event_dates : [""],
            is_recurring: r.data.is_recurring,
            recurring_frequency: r.data.recurring_event?.frequency ?? "",
        };
    }
}, { immediate: true });

const addDate = () => form.value.event_dates.push("");
const removeDate = (i: number) => { if (form.value.event_dates.length > 1) form.value.event_dates.splice(i, 1); };

const updatingStatus = ref<string | null>(null);
const updateStatus = async (status: 'draft' | 'published' | 'cancelled') => {
    updatingStatus.value = status;
    try {
        let endpoint = `/events/${eventId}/`;
        if (status === 'draft') endpoint += 'unpublish';
        else if (status === 'published') endpoint += 'publish';
        else if (status === 'cancelled') endpoint += 'cancel';

        await api.put(endpoint);
        toast.success(`Event status updated to ${status}`);
        refresh();
    } catch (e: any) {
        toast.error(e.message || "Failed to update event status");
    } finally {
        updatingStatus.value = null;
    }
};

const updateEvent = async () => {
    if (!validateForm()) return;
    loading.value = true;
    try {
        await api.put<EventResponse>(`/events/${eventId}`, {
            ...form.value,
            event_dates: form.value.event_dates.filter(Boolean),
        });
        toast.success("Event updated successfully");
        refresh();
    } catch (e: any) {
        toast.error(e.message || "Failed to update event");
    } finally { loading.value = false; }
};

const deleteEvent = async () => {
    if (!await useConfirmDialog().showConfirm("Delete this event permanently?", "Delete Event")) return;
    try {
        await api.delete(`/events/${eventId}`);
        router.push("/admin/events");
    } catch (e: any) { toast.error(e.message || "Failed to delete event"); }
};

const imageFiles = ref<File[]>([]);
const imagePreview = ref<string>("");
const fileInputRef = ref<HTMLInputElement>();
const uploadingImages = ref(false);

const handleFileSelect = (e: Event) => {
    const files = Array.from((e.target as HTMLInputElement).files ?? []);
    if (files.length) {
        imageFiles.value = files.slice(0, 1); // Only take the first file
        const reader = new FileReader();
        reader.onload = (event) => {
            imagePreview.value = event.target?.result as string;
        };
        reader.readAsDataURL(files[0]);
    }
};

const clearImage = () => {
    imageFiles.value = [];
    imagePreview.value = "";
    if (fileInputRef.value) {
        fileInputRef.value.value = "";
    }
};

const uploadImages = async () => {
    if (!imageFiles.value.length) return;
    uploadingImages.value = true;
    const fd = new FormData();
    fd.append("image", imageFiles.value[0]);
    try {
        await api.post(`/events/${eventId}/images`, fd);
        toast.success(eventRes.value?.data?.images?.length ? "Event image replaced" : "Image uploaded");
        refresh();
        clearImage();
    } catch (e: any) { toast.error(e.message || "Upload failed"); }
    finally { uploadingImages.value = false; }
};

const setPrimary = async (imageId: string) => {
    try { await api.put(`/events/${eventId}/images/${imageId}/set-primary`); refresh(); }
    catch (e: any) { toast.error(e.message); }
};
const deleteImage = async (imageId: string) => {
    if (!await useConfirmDialog().showConfirm("Delete this image?", "Delete Image")) return;
    try { await api.delete(`/events/${eventId}/images/${imageId}`); refresh(); }
    catch (e: any) { toast.error(e.message); }
};
</script>

<template>
    <div>
        <div class="page-header">
            <NuxtLink to="/admin/events" class="back-link">
                <Icon name="mdi:arrow-left" /> Back to Events
            </NuxtLink>
            <button @click="deleteEvent" class="btn-danger">
                <Icon name="mdi:trash-can" /> Delete Event
            </button>
        </div>
        <h2 class="page-title">Edit Event</h2>

        <div v-if="pending" class="form-card">
            <div class="sk-block"></div>
        </div>
        <div v-else-if="eventRes?.data">
            <!-- Tabs -->
            <div class="tabs-bar">
                <button class="tab" :class="{ 'tab-active': !activeImageTab }"
                    @click="activeImageTab = false">Details</button>
                <button class="tab" :class="{ 'tab-active': activeImageTab }" @click="activeImageTab = true">
                    Images ({{ eventRes.data.images?.length ?? 0 }})
                </button>
            </div>

            <!-- Details -->
            <form v-if="!activeImageTab" @submit.prevent="updateEvent" class="form-card">
                <div class="status-actions">
                    <button type="button" class="status-btn" :class="{ active: eventRes.data.status === 'draft' }"
                        :disabled="eventRes.data.status === 'draft' || updatingStatus === 'draft'"
                        @click="updateStatus('draft')">
                        <Icon v-if="updatingStatus === 'draft'" name="mdi:loading" class="spin" /> Draft
                    </button>
                    <button type="button" class="status-btn" :class="{ active: eventRes.data.status === 'published' }"
                        :disabled="eventRes.data.status === 'published' || updatingStatus === 'published'"
                        @click="updateStatus('published')">
                        <Icon v-if="updatingStatus === 'published'" name="mdi:loading" class="spin" /> Published
                    </button>
                    <button type="button" class="status-btn" :class="{ active: eventRes.data.status === 'cancelled' }"
                        :disabled="eventRes.data.status === 'cancelled' || updatingStatus === 'cancelled'"
                        @click="updateStatus('cancelled')">
                        <Icon v-if="updatingStatus === 'cancelled'" name="mdi:loading" class="spin" /> Cancelled
                    </button>
                </div>

                <div class="field">
                    <label>Title</label>
                    <input v-model="form.title" type="text" class="input" />
                    <p v-if="errors.title" class="field-error">{{ errors.title }}</p>
                </div>
                <div class="field">
                    <label>Description</label>
                    <textarea v-model="form.description" class="input textarea" rows="4"></textarea>
                    <p v-if="errors.description" class="field-error">{{ errors.description }}</p>
                </div>
                <div class="field">
                    <label>Location</label>
                    <input v-model="form.location" type="text" class="input" />
                    <p v-if="errors.location" class="field-error">{{ errors.location }}</p>
                </div>
                <div class="field" :class="{ errored: errors.event_dates }">
                    <label>Event Dates</label>
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
                        <Icon name="mdi:plus" /> Add Date
                    </button>
                    <p v-if="errors.event_dates" class="field-error">{{ errors.event_dates }}</p>
                </div>
                <label class="checkbox-item">
                    <input v-model="form.is_recurring" type="checkbox" />
                    <span>Recurring Event</span>
                </label>
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
                <div class="form-actions">
                    <button type="submit" :disabled="!isFormValid || loading" class="btn-primary">
                        {{ loading ? "Saving…" : "Save Changes" }}
                    </button>
                </div>
            </form>

            <!-- Images -->
            <div v-if="activeImageTab" class="form-card">
                <h3 class="section-label">Upload Image</h3>

                <!-- Image Upload Area -->
                <div class="upload-area">
                    <input ref="fileInputRef" type="file" accept="image/*" style="display: none"
                        @change="handleFileSelect" />

                    <!-- Upload Icon or Preview -->
                    <div v-if="!imageFiles.length" @click="$refs.fileInputRef?.click()" class="upload-trigger">
                        <Icon name="mdi:plus" class="upload-icon" />
                        <p class="upload-text">Click to select image</p>
                    </div>

                    <div v-else class="preview-container">
                        <img :src="imagePreview" :alt="imageFiles[0].name" class="preview-image" />
                        <button type="button" @click="clearImage" class="clear-btn" title="Remove image">
                            <Icon name="mdi:close" />
                        </button>
                    </div>
                </div>

                <!-- Upload Button -->
                <button type="button" @click="uploadImages" :disabled="!imageFiles.length || uploadingImages"
                    class="btn-primary">
                    {{
                        uploadingImages ? "Uploading…" : (eventRes.data.images?.length ?
                            "Replace event image" : "Upload image") }}
                </button>

                <!-- Current Images -->
                <div v-if="eventRes.data.images?.length" class="current-images">
                    <h4 class="current-images-title">Current image</h4>
                    <div class="current-image-item">
                        <img :src="eventRes.data.images[0].image_url"
                            :alt="eventRes.data.images[0].caption ?? 'Event image'" class="current-image" />
                        <div class="current-image-actions">
                            <button @click="deleteImage(eventRes.data.images[0].id)" class="img-btn danger">
                                <Icon name="mdi:trash-can-outline" /> Delete
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.page-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
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
    margin: 0 0 1.25rem;
}

.btn-danger {
    display: flex;
    align-items: center;
    gap: 0.4rem;
    padding: 0.5rem 1rem;
    background: #fee2e2;
    color: #dc2626;
    border: 1px solid #fca5a5;
    border-radius: 8px;
    font-size: 0.8rem;
    font-weight: 600;
    cursor: pointer;
}

.btn-danger:hover {
    background: #dc2626;
    color: #fff;
}

.tabs-bar {
    display: flex;
    gap: 0.25rem;
    border-bottom: 1px solid #e4e4e7;
    margin-bottom: 1.25rem;
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
}

.tab-active {
    color: #E05615;
    border-bottom-color: #E05615;
}

.status-actions {
    display: flex;
    justify-content: flex-end;
    gap: 0.5rem;
}

.status-btn {
    display: flex;
    align-items: center;
    gap: 0.3rem;
    padding: 0.4rem 0.8rem;
    font-size: 0.8rem;
    font-weight: 600;
    border-radius: 6px;
    border: 1px solid #e4e4e7;
    background: #fff;
    color: #52525b;
    cursor: pointer;
    transition: all 0.2s;
}

.status-btn:not(:disabled):hover {
    background: #f4f4f5;
}

.status-btn.active {
    background: #E05615;
    color: #fff;
    border-color: #E05615;
}

.status-btn:disabled {
    opacity: 0.8;
    cursor: not-allowed;
}

.spin {
    animation: spin 1s linear infinite;
}

@keyframes spin {
    100% {
        transform: rotate(360deg);
    }
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

.field-error {
    font-size: 0.78rem;
    color: #dc2626;
    margin: 0;
}

.errored .input {
    border-color: #dc2626;
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
    width: 32px;
    height: 32px;
    border: 1px solid #e4e4e7;
    border-radius: 6px;
    background: #fff;
    color: #dc2626;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
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

.mt-2 {
    margin-top: 0.5rem;
}

.section-label {
    font-size: 0.9rem;
    font-weight: 700;
    color: #27272a;
    margin: 0;
}

.upload-area {
    margin-bottom: 1rem;
}

.upload-trigger {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 2rem;
    border: 2px dashed #e4e4e7;
    border-radius: 12px;
    cursor: pointer;
    transition: all 0.15s;
    background: #fafafa;
}

.upload-trigger:hover {
    border-color: #E05615;
    background: #fff9f5;
}

.upload-icon {
    font-size: 2.5rem;
    color: #E05615;
    margin-bottom: 0.5rem;
}

.upload-text {
    font-size: 0.875rem;
    color: #71717a;
    margin: 0;
    font-weight: 500;
}

.preview-container {
    position: relative;
    display: inline-block;
    margin-bottom: 1rem;
}

.preview-image {
    max-width: 200px;
    max-height: 200px;
    border-radius: 8px;
    border: 1px solid #e4e4e7;
    display: block;
    object-fit: cover;
}

.clear-btn {
    position: absolute;
    top: -8px;
    right: -8px;
    width: 32px;
    height: 32px;
    border-radius: 50%;
    background: #dc2626;
    color: #fff;
    border: none;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    font-size: 1.2rem;
    transition: background 0.15s;
}

.clear-btn:hover {
    background: #991b1b;
}

.current-images {
    margin-top: 2rem;
    padding-top: 2rem;
    border-top: 1px solid #e4e4e7;
}

.current-images-title {
    font-size: 0.9rem;
    font-weight: 700;
    color: #27272a;
    margin: 0 0 1rem;
}

.current-image-item {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
}

.current-image {
    max-width: 200px;
    max-height: 200px;
    border-radius: 8px;
    border: 1px solid #e4e4e7;
    object-fit: cover;
}

.current-image-actions {
    display: flex;
    gap: 0.5rem;
}

.file-input {
    font-size: 0.85rem;
}

.images-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
    gap: 1rem;
    margin-top: 1rem;
}

.img-card {
    border-radius: 8px;
    overflow: hidden;
    border: 1px solid #f4f4f5;
}

.img-thumb {
    width: 100%;
    aspect-ratio: 4/3;
    object-fit: cover;
    display: block;
}

.img-actions {
    padding: 0.5rem;
    display: flex;
    gap: 0.35rem;
    flex-wrap: wrap;
}

.img-btn {
    display: inline-flex;
    align-items: center;
    gap: 0.35rem;
    font-size: 0.72rem;
    font-weight: 600;
    padding: 0.35rem 0.75rem;
    border-radius: 5px;
    border: 1px solid #e4e4e7;
    background: #fff;
    cursor: pointer;
    transition: all 0.15s;
}

.img-btn:hover {
    border-color: #E05615;
    color: #E05615;
}

.img-btn.danger {
    color: #dc2626;
}

.img-btn.danger:hover {
    background: #dc2626;
    color: #fff;
    border-color: #dc2626;
}

.badge-primary {
    font-size: 0.72rem;
    font-weight: 700;
    background: #dcfce7;
    color: #16a34a;
    padding: 0.2rem 0.5rem;
    border-radius: 99px;
}

.muted-text {
    color: #a1a1aa;
    font-size: 0.875rem;
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
