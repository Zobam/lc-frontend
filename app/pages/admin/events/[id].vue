<script setup lang="ts">
import type { EventResponse } from "~/types/api";
// import { toast } from "vue-sonner";

definePageMeta({ layout: "admin", middleware: "sidebase-auth" });
useHead({ title: 'Edit Event | LC Admin' });

const api = useApi();
const route = useRoute();
const router = useRouter();
const eventId = route.params.id as string;

const { data: eventRes, pending, refresh } = await useAsyncData(
    `event-${eventId}`,
    () => api.get<EventResponse>(`/events/${eventId}/admin`)
);

const form = ref({
    title: "", description: "", location: "",
    event_dates: [""] as string[],
    is_recurring: false, recurrence_pattern: "",
});

const loading = ref(false);
const activeImageTab = ref(false);

watch(eventRes, (r) => {
    if (r?.data) {
        form.value = {
            title: r.data.title, description: r.data.description,
            location: r.data.location,
            event_dates: r.data.event_dates?.length ? r.data.event_dates : [""],
            is_recurring: r.data.is_recurring,
            recurrence_pattern: r.data.recurrence_pattern ?? "",
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
    loading.value = true;
    try {
        await api.put<EventResponse>(`/events/${eventId}`, {
            ...form.value,
            event_dates: form.value.event_dates.filter(Boolean),
        });
        alert("Event updated successfully");
        refresh();
    } catch (e: any) {
        alert(e.message || "Failed to update event");
    } finally { loading.value = false; }
};

const deleteEvent = async () => {
    if (!confirm("Delete this event permanently?")) return;
    try {
        await api.delete(`/events/${eventId}`);
        router.push("/admin/events");
    } catch (e: any) { alert(e.message || "Failed to delete event"); }
};

const imageFiles = ref<File[]>([]);
const uploadingImages = ref(false);
const uploadImages = async () => {
    if (!imageFiles.value.length) return;
    uploadingImages.value = true;
    const fd = new FormData();
    imageFiles.value.forEach(f => fd.append("images[]", f));
    try {
        await api.post(`/events/${eventId}/images`, fd);
        alert("Images uploaded");
        refresh();
        imageFiles.value = [];
    } catch (e: any) { alert(e.message || "Upload failed"); }
    finally { uploadingImages.value = false; }
};

const setPrimary = async (imageId: string) => {
    try { await api.put(`/events/${eventId}/images/${imageId}/set-primary`); refresh(); }
    catch (e: any) { alert(e.message); }
};
const deleteImage = async (imageId: string) => {
    if (!confirm("Delete this image?")) return;
    try { await api.delete(`/events/${eventId}/images/${imageId}`); refresh(); }
    catch (e: any) { alert(e.message); }
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
                </div>
                <div class="field">
                    <label>Description</label>
                    <textarea v-model="form.description" class="input textarea" rows="4"></textarea>
                </div>
                <div class="field">
                    <label>Location</label>
                    <input v-model="form.location" type="text" class="input" />
                </div>
                <div class="field">
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
                </div>
                <label class="checkbox-item">
                    <input v-model="form.is_recurring" type="checkbox" />
                    <span>Recurring Event</span>
                </label>
                <div class="field" v-if="form.is_recurring">
                    <label>Recurrence Pattern</label>
                    <input v-model="form.recurrence_pattern" type="text" class="input" />
                </div>
                <div class="form-actions">
                    <button type="submit" :disabled="loading" class="btn-primary">
                        {{ loading ? "Saving…" : "Save Changes" }}
                    </button>
                </div>
            </form>

            <!-- Images -->
            <div v-if="activeImageTab" class="form-card">
                <h3 class="section-label">Upload New Images</h3>
                <input type="file" multiple accept="image/*"
                    @change="(e) => imageFiles = Array.from((e.target as HTMLInputElement).files ?? [])"
                    class="file-input" />
                <button @click="uploadImages" :disabled="!imageFiles.length || uploadingImages"
                    class="btn-primary mt-2">
                    {{ uploadingImages ? "Uploading…" : "Upload Images" }}
                </button>

                <div class="images-grid" v-if="eventRes.data.images?.length">
                    <div v-for="img in eventRes.data.images" :key="img.id" class="img-card">
                        <img :src="img.image_url" :alt="img.caption ?? 'Event image'" class="img-thumb" />
                        <div class="img-actions">
                            <span v-if="img.is_primary" class="badge-primary">Primary</span>
                            <button v-else @click="setPrimary(img.id)" class="img-btn">Set Primary</button>
                            <button @click="deleteImage(img.id)" class="img-btn danger">Delete</button>
                        </div>
                    </div>
                </div>
                <p v-else class="muted-text">No images yet.</p>
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
    font-size: 0.72rem;
    font-weight: 600;
    padding: 0.25rem 0.5rem;
    border-radius: 5px;
    border: 1px solid #e4e4e7;
    background: #fff;
    cursor: pointer;
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
