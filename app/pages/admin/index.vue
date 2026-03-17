<script setup lang="ts">
import type { DashboardStatsResponse } from "~/types/api";

definePageMeta({ layout: "admin", middleware: "sidebase-auth" });

useHead({ title: 'Dashboard | LC Admin' });

const api = useApi();

const { data: statsRes, pending, error, refresh } = await useAsyncData(
    "dashboard-stats",
    () => api.get<DashboardStatsResponse>("/admin/stats"),
    { lazy: true }
);

const stats = computed(() => statsRes.value?.data);

const statCards = computed(() => [
    { label: "Total Users", value: stats.value?.users_count ?? 0, icon: "mdi:account-group", color: "blue", link: "/admin/users" },
    { label: "Total Events", value: stats.value?.events_count ?? 0, icon: "mdi:calendar-star", color: "green", link: "/admin/events" },
    { label: "Total Posts", value: stats.value?.posts_count ?? 0, icon: "mdi:newspaper-variant-outline", color: "purple", link: "/admin/posts" },
    // { label: "Total Albums", value: stats.value?.albums_count ?? 0, icon: "mdi:image-album", color: "pink", link: "/admin/albums" },
    { label: "Total Videos", value: stats.value?.videos_count ?? 0, icon: "mdi:youtube", color: "red", link: "/admin/video-links" },
    { label: "Pending Comments", value: stats.value?.comments_pending ?? 0, icon: "mdi:comment-alert", color: "yellow", link: "/admin/comments" },
    { label: "Donations (This Month)", value: stats.value?.donations_this_month ?? 0, icon: "mdi:hand-heart", color: "emerald", link: "/admin/donations", currency: true },
    { label: "Total Donations", value: stats.value?.donations_total ?? 0, icon: "mdi:cash-multiple", color: "teal", link: "/admin/donations", currency: true },
]);

const formatValue = (card: any) =>
    card.currency ? `₦${Number(card.value).toLocaleString()}` : card.value.toLocaleString();
</script>

<template>
    <div>
        <div class="page-header">
            <div>
                <h2 class="page-title">Dashboard</h2>
                <p class="page-desc">Overview of all LightCity content and activity.</p>
            </div>
            <button class="refresh-btn" @click="refresh()" :disabled="pending">
                <Icon name="mdi:refresh" :class="{ spinning: pending }" />
                Refresh
            </button>
        </div>

        <!-- Stats Grid -->
        <div v-if="pending" class="stats-grid">
            <div v-for="i in 8" :key="i" class="stat-card skeleton-card">
                <div class="sk-line short"></div>
                <div class="sk-line tall"></div>
            </div>
        </div>

        <div v-else-if="stats" class="stats-grid">
            <NuxtLink v-for="card in statCards" :key="card.label" :to="card.link" class="stat-card"
                :class="`stat-${card.color}`">
                <div class="stat-body">
                    <p class="stat-label">{{ card.label }}</p>
                    <p class="stat-value">{{ formatValue(card) }}</p>
                </div>
                <div class="stat-icon-wrap">
                    <Icon :name="card.icon" class="stat-icon" />
                </div>
            </NuxtLink>
        </div>

        <div v-else class="error-state">
            <Icon name="mdi:alert-circle-outline" />
            <p>Failed to load dashboard statistics.</p>
            <button @click="refresh()">Try Again</button>
        </div>

        <!-- Quick Links -->
        <div class="quick-section">
            <h3 class="quick-title">Quick Actions</h3>
            <div class="quick-grid">
                <NuxtLink to="/admin/events/create" class="quick-btn">
                    <Icon name="mdi:calendar-plus" /> New Event
                </NuxtLink>
                <NuxtLink to="/admin/posts/create" class="quick-btn">
                    <Icon name="mdi:pencil-plus" /> New Post
                </NuxtLink>
                <!-- <NuxtLink to="/admin/albums/create" class="quick-btn">
                    <Icon name="mdi:image-plus" /> New Album
                </NuxtLink> -->
                <NuxtLink to="/admin/video-links/create" class="quick-btn">
                    <Icon name="mdi:video-plus" /> Add Video
                </NuxtLink>
                <NuxtLink to="/admin/users/create" class="quick-btn">
                    <Icon name="mdi:account-plus" /> New User
                </NuxtLink>
                <NuxtLink to="/admin/comments" class="quick-btn">
                    <Icon name="mdi:comment-check" /> Moderate Comments
                </NuxtLink>
            </div>
        </div>
    </div>
</template>

<style scoped>
.page-header {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    margin-bottom: 1.75rem;
    gap: 1rem;
}

.page-title {
    font-size: 1.6rem;
    font-weight: 800;
    color: #1A0E08;
    margin: 0 0 0.25rem;
}

.page-desc {
    font-size: 0.875rem;
    color: #71717a;
    margin: 0;
}

.refresh-btn {
    display: flex;
    align-items: center;
    gap: 0.4rem;
    padding: 0.5rem 1rem;
    background: #fff;
    border: 1px solid #e4e4e7;
    border-radius: 8px;
    font-size: 0.85rem;
    font-weight: 600;
    color: #52525b;
    cursor: pointer;
    transition: all 0.15s;
    flex-shrink: 0;
}

.refresh-btn:hover {
    border-color: #E05615;
    color: #E05615;
}

.refresh-btn:disabled {
    opacity: 0.6;
    cursor: not-allowed;
}

.spinning {
    animation: spin 1s linear infinite;
}

@keyframes spin {
    to {
        transform: rotate(360deg);
    }
}

.stats-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 1.125rem;
    margin-bottom: 2rem;
}

@media (max-width: 1400px) {
    .stats-grid {
        grid-template-columns: repeat(3, 1fr);
    }
}

@media (max-width: 1100px) {
    .stats-grid {
        grid-template-columns: repeat(2, 1fr);
    }
}

.stat-card {
    background: #fff;
    border-radius: 12px;
    padding: 1.375rem 1.25rem;
    display: flex;
    align-items: center;
    justify-content: space-between;
    text-decoration: none;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.06), 0 1px 2px rgba(0, 0, 0, 0.04);
    border: 1px solid #f4f4f5;
    transition: all 0.2s;
}

.stat-card:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.10);
    border-color: transparent;
}

.stat-label {
    font-size: 0.8rem;
    color: #71717a;
    font-weight: 500;
    margin: 0 0 0.35rem;
}

.stat-value {
    font-size: 1.75rem;
    font-weight: 800;
    color: #1A0E08;
    margin: 0;
    line-height: 1.1;
}

.stat-icon-wrap {
    width: 46px;
    height: 46px;
    border-radius: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
}

.stat-icon {
    font-size: 1.35rem;
}

/* Color variants for icon backgrounds */
.stat-blue .stat-icon-wrap {
    background: #dbeafe;
}

.stat-blue .stat-icon {
    color: #2563eb;
}

.stat-green .stat-icon-wrap {
    background: #dcfce7;
}

.stat-green .stat-icon {
    color: #16a34a;
}

.stat-purple .stat-icon-wrap {
    background: #f3e8ff;
}

.stat-purple .stat-icon {
    color: #9333ea;
}

.stat-pink .stat-icon-wrap {
    background: #fce7f3;
}

.stat-pink .stat-icon {
    color: #db2777;
}

.stat-red .stat-icon-wrap {
    background: #fee2e2;
}

.stat-red .stat-icon {
    color: #dc2626;
}

.stat-yellow .stat-icon-wrap {
    background: #fef9c3;
}

.stat-yellow .stat-icon {
    color: #ca8a04;
}

.stat-emerald .stat-icon-wrap {
    background: #d1fae5;
}

.stat-emerald .stat-icon {
    color: #059669;
}

.stat-teal .stat-icon-wrap {
    background: #ccfbf1;
}

.stat-teal .stat-icon {
    color: #0d9488;
}

/* Skeleton */
.skeleton-card {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.75rem;
}

.sk-line {
    background: #f4f4f5;
    border-radius: 6px;
    animation: pulse 1.5s ease-in-out infinite;
}

.sk-line.short {
    width: 50%;
    height: 12px;
}

.sk-line.tall {
    width: 40%;
    height: 28px;
}

@keyframes pulse {

    0%,
    100% {
        opacity: 1;
    }

    50% {
        opacity: 0.5;
    }
}

.error-state {
    background: #fff;
    border-radius: 12px;
    padding: 3rem;
    text-align: center;
    color: #71717a;
    margin-bottom: 2rem;
}

.error-state .icon {
    font-size: 2.5rem;
    margin-bottom: 0.75rem;
}

.error-state button {
    margin-top: 1rem;
    padding: 0.5rem 1.5rem;
    background: #E05615;
    color: #fff;
    border: none;
    border-radius: 8px;
    cursor: pointer;
}

.quick-section {
    margin-top: 0.5rem;
}

.quick-title {
    font-size: 1rem;
    font-weight: 700;
    color: #27272a;
    margin: 0 0 1rem;
}

.quick-grid {
    display: flex;
    flex-wrap: wrap;
    gap: 0.75rem;
}

.quick-btn {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.55rem 1.1rem;
    background: #fff;
    border: 1px solid #e4e4e7;
    border-radius: 8px;
    font-size: 0.85rem;
    font-weight: 600;
    color: #27272a;
    text-decoration: none;
    transition: all 0.15s;
}

.quick-btn:hover {
    background: #E05615;
    border-color: #E05615;
    color: #fff;
}
</style>
