<template>
    <section class="broadcasts">
        <div class="container">
            <div class="section-header">
                <h2 class="section-title">Upcoming Events</h2>
                <NuxtLink to="/events" class="view-all">View All →</NuxtLink>
            </div>
            <div class="broadcasts-grid">
                <!-- Featured Event -->
                <div class="broadcast-card featured" v-if="featuredEvent">
                    <img :src="featuredEvent.primary_image?.image_url || 'https://images.unsplash.com/photo-1429962714451-bb934ecdc4ec?w=600&h=340&fit=crop'"
                        :alt="featuredEvent.title" />
                    <div class="bc-label">{{ formatEventDate(featuredEvent.event_dates[0]) }}</div>
                    <div class="bc-info">
                        <span class="bc-tag">Live Event</span>
                        <h3>{{ featuredEvent.title }}</h3>
                        <p>{{ featuredEvent.subtitle || featuredEvent.description.slice(0, 100) }}...</p>
                        <NuxtLink to="/events" class="btn btn-gold-sm">See more</NuxtLink>
                    </div>
                </div>
                <!-- Featured Event Skeleton -->
                <div class="broadcast-card featured skeleton-card" v-else-if="eventsLoading">
                    <div class="skeleton-img"></div>
                    <div class="bc-info">
                        <div class="skeleton-line short"></div>
                        <div class="skeleton-line long"></div>
                        <div class="skeleton-line medium"></div>
                    </div>
                </div>

                <!-- Side Events -->
                <div class="broadcasts-side">
                    <template v-if="eventsLoading">
                        <div class="broadcast-card mini skeleton-card" v-for="n in 4" :key="n">
                            <div class="skeleton-img mini-img"></div>
                            <div class="bc-info-mini">
                                <div class="skeleton-line short"></div>
                                <div class="skeleton-line long"></div>
                            </div>
                        </div>
                    </template>
                    <template v-else>
                        <div class="broadcast-card mini" v-for="event in sideEvents" :key="event.id">
                            <img :src="event.primary_image?.image_url || 'https://images.unsplash.com/photo-1517457373958-b7bdd4587205?w=300&h=160&fit=crop'"
                                :alt="event.title" />
                            <div class="bc-info-mini">
                                <span class="bc-date">{{ formatEventDate(event.event_dates[0]) }}</span>
                                <h4>{{ event.title }}</h4>
                                <p>{{ event.subtitle || event.description.slice(0, 80) }}...</p>
                            </div>
                        </div>
                    </template>
                </div>
            </div>
        </div>
    </section>
</template>

<script setup lang="ts">
import { useAppResourceInfoStore } from '~/stores/appResourceInfo';
import type { EventsListResponse } from '~/types/api';
import type { Event } from '~/types/models';

const { get } = useApi();
const store = useAppResourceInfoStore();

const eventsLoading = ref(true);
const featuredEvent = ref<Event | null>(null);
const sideEvents = ref<Event[]>([]);

onMounted(async () => {
    try {
        const response = await get<EventsListResponse>('/events', { per_page: 5 });
        const events = response.data ?? [];
        featuredEvent.value = events[0] ?? null;
        sideEvents.value = events.slice(1);
        store.events = events;
    } catch (e) {
        console.error('Failed to load events:', e);
    } finally {
        eventsLoading.value = false;
        store.eventsLoading = false;
    }
});

const formatEventDate = (dateStr?: string): string => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { month: 'short', day: '2-digit' }).toUpperCase();
};
</script>

<style scoped>
/* ───── Broadcasts ───── */
.broadcasts {
    padding: 4rem 0;
    background: #f9f9f9;
}

.broadcasts-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1.5rem;
}

.broadcast-card {
    background: #fff;
    border-radius: 10px;
    overflow: hidden;
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.07);
    transition: transform 0.25s, box-shadow 0.25s;
}

.broadcast-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
}

.broadcast-card img {
    width: 100%;
    object-fit: cover;
    display: block;
}

.broadcast-card.featured img {
    height: 240px;
}

.bc-label {
    display: inline-block;
    background: var(--lc-gold);
    color: #fff;
    font-size: 0.75rem;
    font-weight: 700;
    padding: 3px 10px;
    border-radius: 0 0 6px 0;
    margin-top: -28px;
    position: relative;
    z-index: 1;
}

.bc-info {
    padding: 1rem 1.25rem 1.5rem;
}

.bc-info .bc-tag {
    font-size: 0.7rem;
    font-weight: 700;
    color: var(--lc-gold);
    text-transform: uppercase;
    letter-spacing: 0.1em;
}

.bc-info h3 {
    font-size: 1.2rem;
    font-weight: 700;
    color: var(--lc-dark);
    margin: 0.4rem 0;
}

.bc-info p {
    color: #777;
    font-size: 0.85rem;
    margin-bottom: 0.75rem;
}

.broadcasts-side {
    display: flex;
    flex-direction: column;
    gap: 1rem;
}

.broadcast-card.mini {
    display: flex;
    gap: 0;
}

.broadcast-card.mini img {
    width: 130px;
    height: 100px;
    object-fit: cover;
    flex-shrink: 0;
    border-radius: 0;
}

.bc-info-mini {
    padding: 0.75rem 1rem;
    display: flex;
    flex-direction: column;
    justify-content: center;
}

.bc-date {
    font-size: 0.7rem;
    font-weight: 700;
    color: var(--lc-gold);
}

.bc-info-mini h4 {
    font-size: 0.9rem;
    font-weight: 700;
    color: var(--lc-dark);
    margin: 0.25rem 0;
}

.bc-info-mini p {
    font-size: 0.8rem;
    color: #888;
    line-height: 1.4;
    margin: 0;
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
    height: 240px;
    background: linear-gradient(90deg, #e8e8e8 25%, #f5f5f5 50%, #e8e8e8 75%);
    background-size: 800px 100%;
    animation: shimmer 1.4s infinite;
}

.skeleton-img.mini-img {
    width: 130px;
    height: 100px;
    flex-shrink: 0;
}

.skeleton-line {
    height: 14px;
    border-radius: 4px;
    background: linear-gradient(90deg, #e8e8e8 25%, #f5f5f5 50%, #e8e8e8 75%);
    background-size: 800px 100%;
    animation: shimmer 1.4s infinite;
    margin-bottom: 0.6rem;
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

@media (max-width: 768px) {
    .broadcasts-grid {
        grid-template-columns: 1fr;
    }

    .broadcasts-side {
        display: none;
    }
}
</style>
