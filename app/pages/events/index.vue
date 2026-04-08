<template>
    <div class="page-wrapper">
        <NavBar />

        <!-- Page Hero -->
        <section class="page-hero">
            <div class="ph-overlay"></div>
            <img src="https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1920&h=400&fit=crop" alt="Events"
                class="ph-bg" />
            <div class="ph-content">
                <p class="ph-label">Join Us</p>
                <h1>Events & Programs</h1>
                <p class="ph-sub">Stay connected with everything happening at Light City.</p>
            </div>
        </section>

        <!-- Events Filter -->
        <section class="events-section">
            <div class="container">
                <!-- <div class="filter-bar">
                    <button v-for="cat in categories" :key="cat" class="filter-btn"
                        :class="{ active: activeFilter === cat }" @click="activeFilter = cat">{{ cat }}</button>
                </div> -->

                <!-- Empty State -->
                <EmptyState
                    v-if="!eventsLoading && events.length === 0"
                    icon="mdi:calendar-remove-outline"
                    title="No Events Found"
                    message="There are no upcoming events at this time. Check back later."
                    link-to="/"
                    link-label="Go Home →"
                />

                <div class="events-grid" v-else>
                    <template v-if="eventsLoading">
                        <div class="event-card skeleton-card" v-for="n in 6" :key="n">
                            <div class="skeleton-img" style="height: 180px;"></div>
                            <div class="event-body">
                                <div style="width: 54px; height: 65px; border-radius: 8px; flex-shrink: 0;"
                                    class="skeleton-img"></div>
                                <div class="event-info" style="width: 100%;">
                                    <div class="skeleton-line long" style="margin-bottom: 0.5rem;"></div>
                                    <div class="skeleton-line medium" style="margin-bottom: 0.5rem;"></div>
                                    <div class="skeleton-line short" style="margin-bottom: 1rem;"></div>
                                    <div class="skeleton-line" style="width: 100px; height: 30px;"></div>
                                </div>
                            </div>
                        </div>
                    </template>
                    <template v-else>
                        <NuxtLink :to="`/events/${event.id}`" class="event-card" v-for="event in events"
                            :key="event.id">
                            <div class="event-img">
                                <img :src="event.primary_image?.image_url || 'https://images.unsplash.com/photo-1429962714451-bb934ecdc4ec?w=500&h=280&fit=crop'"
                                    :alt="event.title" />
                                <!-- <span class="event-category">Live Event</span> -->
                            </div>
                            <div class="event-body">
                                <div class="event-date-badge">
                                    <strong>{{ getEventDay(event.event_dates?.[0]) }}</strong>
                                    <span>{{ getEventMonth(event.event_dates?.[0]) }}</span>
                                </div>
                                <div class="event-info">
                                    <h3>{{ event.title }}</h3>
                                    <!-- Only show start date formatting if need be, else skip the icon -->
                                    <p class="event-meta" v-if="event.location">
                                        <Icon name="mdi:map-marker" /> {{ event.location }}
                                    </p>
                                    <p class="event-desc">{{ event.subtitle || event.description.slice(0, 100) + '...'
                                    }}</p>
                                    <span class="btn-register" :class="getEventStatus(event)">{{ getEventStatus(event)
                                    }}</span>
                                </div>
                            </div>
                        </NuxtLink>
                    </template>
                </div>
            </div>
        </section>

        <AppFooter />
    </div>
</template>

<script setup lang="ts">
import type { EventsListResponse } from '~/types/api';
import type { Event } from '~/types/models';

useHead({
    title: 'Events & Programs | Light City Evangelical Center',
    meta: [
        {
            name: 'description',
            content: 'Stay connected with upcoming events, programs, and special services at Light City Evangelical Center. Find an event and join us in worship and fellowship.',
        },
    ],
});

const { get } = useApi();

const eventsLoading = ref(true);
const events = ref<Event[]>([]);

onMounted(async () => {
    try {
        const response = await get<EventsListResponse>('/events', { per_page: 6 });
        events.value = response.data ?? [];
    } catch (e) {
        console.error('Failed to load events:', e);
    } finally {
        eventsLoading.value = false;
    }
});

const getEventDay = (dateStr?: string): string => {
    if (!dateStr) return '';
    return new Date(dateStr).toLocaleDateString('en-US', { day: '2-digit' });
};

const getEventMonth = (dateStr?: string): string => {
    if (!dateStr) return '';
    return new Date(dateStr).toLocaleDateString('en-US', { month: 'short' }).toUpperCase();
};

const getEventStatus = (event: Event): 'upcoming' | 'ongoing' | 'finished' => {
    if (!event.event_dates || event.event_dates.length === 0) return 'upcoming';

    const dates = event.event_dates.map(d => new Date(d));
    const start = Math.min(...dates.map(d => d.getTime()));
    const end = Math.max(...dates.map(d => d.getTime()));

    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();

    const startObj = new Date(start);
    const startDate = new Date(startObj.getFullYear(), startObj.getMonth(), startObj.getDate()).getTime();

    const endObj = new Date(end);
    const endDate = new Date(endObj.getFullYear(), endObj.getMonth(), endObj.getDate()).getTime();

    if (endDate < today) return 'finished';
    if (startDate > today) return 'upcoming';
    return 'ongoing';
};
</script>

<style scoped>
.page-wrapper {
    font-family: 'Segoe UI', system-ui, sans-serif;
}

.container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 24px;
}

/* Hero */
.page-hero {
    position: relative;
    height: 320px;
    display: flex;
    align-items: center;
    overflow: hidden;
}

.ph-bg {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
    z-index: 0;
}

.ph-overlay {
    position: absolute;
    inset: 0;
    background: rgba(15, 10, 40, 0.72);
    z-index: 1;
}

.ph-content {
    position: relative;
    z-index: 2;
    padding: 0 10%;
}

.ph-label {
    color: var(--lc-gold);
    font-size: 0.78rem;
    font-weight: 700;
    letter-spacing: 0.15em;
    text-transform: uppercase;
}

.ph-content h1 {
    font-size: 2.8rem;
    font-weight: 900;
    color: #fff;
    margin: 0.4rem 0;
}

.ph-sub {
    color: rgba(255, 255, 255, 0.75);
    font-size: 1rem;
    margin: 0;
}

/* Events */
.events-section {
    padding: 4rem 0 5rem;
    background: #f9f9fb;
}

.filter-bar {
    display: flex;
    gap: 0.75rem;
    margin-bottom: 2.5rem;
    flex-wrap: wrap;
}

.filter-btn {
    padding: 8px 20px;
    border-radius: 20px;
    border: 1.5px solid #ddd;
    background: #fff;
    color: #555;
    font-weight: 600;
    font-size: 0.85rem;
    cursor: pointer;
    transition: all 0.2s;
    font-family: inherit;
}

.filter-btn.active,
.filter-btn:hover {
    background: var(--lc-dark);
    color: #fff;
    border-color: var(--lc-dark);
}

.events-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 1.5rem;
}

.event-card {
    background: #fff;
    border-radius: 12px;
    overflow: hidden;
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.07);
    transition: transform 0.25s, box-shadow 0.25s;
    text-decoration: none;
    display: block;
    color: inherit;
}

.event-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 28px rgba(0, 0, 0, 0.12);
}

.event-img {
    position: relative;
}

.event-img img {
    width: 100%;
    height: 180px;
    object-fit: cover;
    display: block;
}

.event-category {
    position: absolute;
    top: 12px;
    right: 12px;
    background: var(--lc-gold);
    color: #fff;
    font-size: 0.7rem;
    font-weight: 700;
    padding: 3px 10px;
    border-radius: 20px;
    text-transform: uppercase;
}

.event-body {
    padding: 1.25rem;
    display: flex;
    gap: 1rem;
}

.event-date-badge {
    display: flex;
    flex-direction: column;
    align-items: center;
    background: var(--lc-dark);
    color: #fff;
    border-radius: 8px;
    padding: 0.75rem;
    min-width: 54px;
    height: fit-content;
    flex-shrink: 0;
}

.event-date-badge strong {
    font-size: 1.6rem;
    font-weight: 900;
    line-height: 1;
}

.event-date-badge span {
    font-size: 0.65rem;
    font-weight: 700;
    opacity: 0.75;
}

.event-info h3 {
    font-size: 1rem;
    font-weight: 700;
    color: var(--lc-dark);
    margin: 0 0 0.5rem;
}

.event-meta {
    color: #888;
    font-size: 0.78rem;
    margin: 0.2rem 0;
    display: flex;
    align-items: center;
    gap: 4px;
}

.event-desc {
    color: #666;
    font-size: 0.82rem;
    line-height: 1.5;
    margin: 0.6rem 0;
}

.btn-register {
    display: inline-block;
    padding: 7px 18px;
    background: var(--lc-gold);
    color: #fff;
    border-radius: 4px;
    font-size: 0.78rem;
    font-weight: 700;
    text-decoration: none;
    transition: all 0.2s;
    border: 1px solid transparent;
    text-transform: capitalize;
    cursor: default;
}

.btn-register.ongoing {
    background: #fff;
    color: var(--lc-gold);
    border-color: #000;
}

.btn-register.finished {
    opacity: 0.5;
}

/* ───── Skeleton Loaders ───── */
@keyframes shimmer {
    0% {
        background-position: -400px 0;
    }

    100% {
        background-position: 400px 0;
    }
}

.skeleton-card {
    pointer-events: none;
}

.skeleton-img {
    width: 100%;
    background: linear-gradient(90deg, #e8e8e8 25%, #f5f5f5 50%, #e8e8e8 75%);
    background-size: 800px 100%;
    animation: shimmer 1.4s infinite;
}

.skeleton-line {
    height: 14px;
    border-radius: 4px;
    background: linear-gradient(90deg, #e8e8e8 25%, #f5f5f5 50%, #e8e8e8 75%);
    background-size: 800px 100%;
    animation: shimmer 1.4s infinite;
}

.skeleton-line.short {
    width: 35%;
}

.skeleton-line.medium {
    width: 60%;
}

.skeleton-line.long {
    width: 85%;
}

@media (max-width: 900px) {
    .events-grid {
        grid-template-columns: repeat(2, 1fr);
    }
}

@media (max-width: 580px) {
    .events-grid {
        grid-template-columns: 1fr;
    }
}
</style>
