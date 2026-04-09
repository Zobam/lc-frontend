<script setup lang="ts">
import type { DonationsListResponse, DonationStatsResponse } from "~/types/api";
import { DonationType, DonationStatus } from "~/types/enums";
import { validateManualDonation, hasErrors } from "~/utils/validation";

definePageMeta({ layout: "admin", middleware: "sidebase-auth" });
useHead({ title: 'Donations | LC Admin' });

const api = useApi();
const route = useRoute();
const router = useRouter();

const page = ref(Number(route.query.page) || 1);
const search = ref((route.query.search as string) || "");
const typeFilter = ref((route.query.type as string) || "");

const { data: statsRes } = useQuery({
    key: ['admin-donations-stats'],
    query: () => api.get<DonationStatsResponse>("/donations/statistics")
});

const { data: donationsData, status, refetch: refresh } = useQuery({
    key: () => ["admin-donations-list", page.value, search.value, typeFilter.value],
    query: () => api.get<DonationsListResponse>("/donations/manage/all", { page: page.value, per_page: 15, search: search.value, type: typeFilter.value }),
});
const pending = computed(() => status.value === 'pending');

let searchTimer: ReturnType<typeof setTimeout>;
const handleSearch = () => { clearTimeout(searchTimer); searchTimer = setTimeout(() => { page.value = 1; }, 450); };
const goToPage = (n: number) => { page.value = n; };

// Manual Donation Modal (Simple inline implementation for brevity)
const showModal = ref(false);
const submitting = ref(false);
const form = ref({ email: "", amount: 0, type: DonationType.TITHE as string, notes: "" });
const formErrors = ref<Record<string, string>>({});

const validate = () => {
    formErrors.value = validateManualDonation(form.value);
    return !hasErrors(formErrors.value);
};

const submitManual = async () => {
    if (!validate()) return;
    submitting.value = true;
    try {
        await api.post("/donations/manual", form.value);
        showModal.value = false;
        refresh();
        alert("Manual donation recorded.");
    } catch (e: any) { alert(e.message); }
    finally { submitting.value = false; }
};

const types = Object.values(DonationType);
const formatMoney = (amount: number) => `₦${Number(amount).toLocaleString()}`;
</script>

<template>
    <div>
        <div class="page-header">
            <div>
                <h2 class="page-title">Donations</h2>
                <p class="page-desc">Track online giving and record manual offline donations.</p>
            </div>
            <button class="btn-primary" @click="showModal = true">
                <Icon name="mdi:plus" /> Record Manual
            </button>
        </div>

        <!-- Stats Overview -->
        <div class="stats-row" v-if="statsRes?.data">
            <div class="stat-box box-total">
                <Icon name="mdi:cash-multiple" class="stat-icon" />
                <div class="stat-content">
                    <p class="stat-label">Total Verified Volume</p>
                    <p class="stat-val">{{ formatMoney(statsRes.data.total_donations) }}</p>
                </div>
            </div>
            <div class="stat-box box-count">
                <Icon name="mdi:chart-line" class="stat-icon" />
                <div class="stat-content">
                    <p class="stat-label">Total Transactions</p>
                    <p class="stat-val">{{ statsRes.data.total_count }}</p>
                </div>
            </div>
            <!-- Dynamic stats for top types could be added here if needed -->
        </div>

        <div class="filter-card">
            <div class="filter-row">
                <div class="filter-item">
                    <label>Search Reference or Email</label>
                    <input v-model="search" @input="handleSearch" type="text" placeholder="Search..." class="input" />
                </div>
                <div class="filter-item">
                    <label>Donation Type</label>
                    <select v-model="typeFilter" @change="page = 1" class="input">
                        <option value="">All Types</option>
                        <option v-for="t in types" :key="t" :value="t">{{ t.replace('_', ' ').toUpperCase() }}</option>
                    </select>
                </div>
            </div>
        </div>

        <div class="table-card">
            <div v-if="pending" class="loading-rows">
                <div v-for="i in 5" :key="i" class="sk-row">
                    <div class="sk-cell w-full"></div>
                </div>
            </div>
            <table v-else-if="donationsData?.data?.donations?.length" class="data-table">
                <thead>
                    <tr>
                        <th>Reference</th>
                        <th>Donor Email</th>
                        <th>Amount</th>
                        <th>Type</th>
                        <th>Status</th>
                        <th>Date</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="tx in donationsData.data.donations" :key="tx.id">
                        <td class="font-mono text-sm muted">{{ tx.reference }}</td>
                        <td class="font-medium">{{ tx.email }}</td>
                        <td class="font-bold amount">{{ tx.formatted_amount || formatMoney(tx.amount) }}</td>
                        <td><span class="badge badge-gray">{{ tx.type_label || tx.type.replace('_', ' ') }}</span></td>
                        <td>
                            <span class="badge"
                                :style="{ backgroundColor: tx.status_color + '20', color: tx.status_color }">
                                {{ tx.status_label || tx.status }}
                            </span>
                        </td>
                        <td class="muted">{{ new Date(tx.created_at).toLocaleDateString() }}</td>
                    </tr>
                </tbody>
            </table>
            <div v-else class="empty-state">
                <Icon name="mdi:cash-remove" />
                <p>No donations match your search.</p>
            </div>
            <AdminPagination v-if="donationsData?.data?.pagination"
                :current-page="donationsData.data.pagination.current_page"
                :total-pages="donationsData.data.pagination.total_pages"
                :total="donationsData.data.pagination.total_items" :from="donationsData.data.pagination.from"
                :to="donationsData.data.pagination.to" @change="goToPage" />
        </div>

        <!-- Manual Modal -->
        <div v-if="showModal" class="modal-overlay" @click.self="showModal = false">
            <div class="modal-content">
                <h3 class="modal-title">Record Manual Donation</h3>
                <p class="modal-desc">Log a cash or direct bank transfer donation made offline.</p>
                <form @submit.prevent="submitManual" class="modal-form">
                    <div class="field" :class="{ errored: formErrors.email }">
                        <label>Donor Email</label>
                        <input v-model="form.email" type="email" class="input" />
                        <p v-if="formErrors.email" class="field-error">{{ formErrors.email }}</p>
                    </div>
                    <div class="field" :class="{ errored: formErrors.amount }">
                        <label>Amount (₦)</label>
                        <input v-model.number="form.amount" type="number" min="0" step="100" class="input" />
                        <p v-if="formErrors.amount" class="field-error">{{ formErrors.amount }}</p>
                    </div>
                    <div class="field" :class="{ errored: formErrors.type }">
                        <label>Donation Type</label>
                        <select v-model="form.type" class="input">
                            <option v-for="t in types" :key="t" :value="t">{{ t.replace('_', ' ').toUpperCase() }}
                            </option>
                        </select>
                    </div>
                    <div class="field">
                        <label>Admin Notes (Optional)</label>
                        <textarea v-model="form.notes" class="input" rows="2"
                            placeholder="e.g. Received via cash on Sunday service"></textarea>
                    </div>
                    <div class="modal-actions">
                        <button type="button" @click="showModal = false" class="btn-ghost">Cancel</button>
                        <button type="submit" :disabled="submitting" class="btn-primary">{{ submitting ? "Saving…" :
                            "Save Record" }}</button>
                    </div>
                </form>
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
    border: none;
    cursor: pointer;
    white-space: nowrap;
}

.btn-primary:hover {
    background: #B84410;
}

.btn-primary:disabled {
    opacity: 0.6;
    cursor: not-allowed;
}

.stats-row {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1.25rem;
    margin-bottom: 1.5rem;
}

@media (max-width: 768px) {
    .stats-row {
        grid-template-columns: 1fr;
    }
}

.stat-box {
    background: #fff;
    border-radius: 12px;
    padding: 1.5rem;
    border: 1px solid #f4f4f5;
    display: flex;
    align-items: center;
    gap: 1.25rem;
}

.stat-icon {
    font-size: 2.5rem;
    color: #E05615;
    opacity: 0.2;
}

.stat-label {
    font-size: 0.8rem;
    font-weight: 600;
    color: #71717a;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    margin: 0 0 0.2rem;
}

.stat-val {
    font-size: 1.8rem;
    font-weight: 800;
    color: #1A0E08;
    margin: 0;
    line-height: 1.1;
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
}

.filter-item {
    display: flex;
    flex-direction: column;
    gap: 0.35rem;
    flex: 1;
    max-width: 300px;
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
    padding: 1rem 1.25rem;
    font-size: 0.875rem;
    color: #27272a;
    border-bottom: 1px solid #f9f9f9;
}

.data-table tr:hover td {
    background: #fafafa;
}

.font-mono {
    font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
}

.font-medium {
    font-weight: 600;
}

.font-bold {
    font-weight: 700;
}

.amount {
    color: #16a34a;
}

.muted {
    color: #71717a !important;
}

.badge {
    padding: 0.2rem 0.6rem;
    border-radius: 99px;
    font-size: 0.72rem;
    font-weight: 700;
    text-transform: capitalize;
    display: inline-block;
}

.badge-gray {
    background: #f4f4f5;
    color: #52525b;
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
    height: 16px;
}

.w-full {
    width: 100%;
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

.empty-state {
    padding: 4rem;
    text-align: center;
    color: #a1a1aa;
}

.empty-state icon {
    font-size: 2.5rem;
    margin-bottom: 0.75rem;
    display: block;
}

.modal-overlay {
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 100;
    padding: 1rem;
}

.modal-content {
    background: #fff;
    border-radius: 12px;
    padding: 2rem;
    width: 100%;
    max-width: 450px;
    box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
}

.modal-title {
    font-size: 1.25rem;
    font-weight: 800;
    color: #1A0E08;
    margin: 0 0 0.2rem;
}

.modal-desc {
    font-size: 0.85rem;
    color: #71717a;
    margin: 0 0 1.5rem;
}

.modal-form {
    display: flex;
    flex-direction: column;
    gap: 1rem;
}

.field {
    display: flex;
    flex-direction: column;
    gap: 0.35rem;
}

.field label {
    font-size: 0.78rem;
    font-weight: 600;
    color: #52525b;
    text-transform: uppercase;
    letter-spacing: 0.04em;
}

.errored .input {
    border-color: #dc2626;
}

.field-error {
    font-size: 0.75rem;
    color: #dc2626;
    margin: 0;
}

.modal-actions {
    display: flex;
    justify-content: flex-end;
    gap: 0.75rem;
    margin-top: 1rem;
}

.btn-ghost {
    padding: 0.6rem 1.2rem;
    background: transparent;
    border: 1px solid #e4e4e7;
    border-radius: 8px;
    font-size: 0.875rem;
    font-weight: 600;
    color: #52525b;
    cursor: pointer;
}

.btn-ghost:hover {
    background: #f4f4f5;
}
</style>
