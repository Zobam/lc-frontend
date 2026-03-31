<template>
    <div class="font-[Segoe_UI,system-ui,sans-serif]">
        <NavBar />

        <!-- Loading State -->
        <div v-if="pending" class="max-w-[1000px] mx-auto px-6 py-20">
            <div class="skeleton-hero mb-8"></div>
            <div class="skeleton-line long mb-4"></div>
            <div class="skeleton-line medium mb-4"></div>
            <div class="skeleton-line long mb-4"></div>
        </div>

        <!-- Error State -->
        <div v-else-if="error" class="max-w-[1000px] mx-auto px-6 py-20 text-center">
            <Icon name="mdi:calendar-alert" class="text-6xl text-red-500 mb-4" />
            <h2 class="text-2xl font-bold mb-2">Event Not Found</h2>
            <p class="text-gray-600 mb-6">The event you're looking for doesn't exist or has been removed.</p>
            <NuxtLink to="/events"
                class="inline-block px-6 py-3 bg-[var(--lc-gold)] text-white rounded-lg hover:opacity-90">
                View All Events
            </NuxtLink>
        </div>

        <!-- Event Content -->
        <article v-else-if="event" class="event-article">
            <!-- Hero Image -->
            <div class="event-hero">
                <img :src="event.primary_image?.image_url || 'https://images.unsplash.com/photo-1429962714451-bb934ecdc4ec?w=1200&h=500&fit=crop'"
                    :alt="event.primary_image?.alt_text || event.title" />
                <div class="event-status-badge" :class="eventStatus">
                    {{ eventStatus }}
                </div>
            </div>

            <div class="event-container">
                <!-- Title & Subtitle -->
                <h1 class="event-title">{{ event.title }}</h1>
                <p v-if="event.subtitle" class="event-subtitle">{{ event.subtitle }}</p>

                <!-- Event Info Grid -->
                <div class="event-info-grid">
                    <!-- Dates -->
                    <div class="info-card">
                        <div class="info-icon">
                            <Icon name="mdi:calendar" />
                        </div>
                        <div>
                            <p class="info-label">Event Date{{ event.event_dates?.length > 1 ? 's' : '' }}</p>
                            <p class="info-value" v-for="(date, idx) in event.event_dates" :key="idx">
                                {{ formatFullDate(date) }}
                            </p>
                        </div>
                    </div>

                    <!-- Location -->
                    <div class="info-card" v-if="event.location">
                        <div class="info-icon">
                            <Icon name="mdi:map-marker" />
                        </div>
                        <div>
                            <p class="info-label">Location</p>
                            <p class="info-value">{{ event.location }}</p>
                        </div>
                    </div>

                    <!-- Organizer -->
                    <div class="info-card" v-if="event.creator">
                        <div class="info-icon">
                            <Icon name="mdi:account" />
                        </div>
                        <div>
                            <p class="info-label">Organized By</p>
                            <!-- <p class="info-value">{{ event.creator.first_name }} {{ event.creator.last_name }}</p> -->
                            <p class="info-value">Light City Int'l</p>
                        </div>
                    </div>
                </div>

                <!-- Description -->
                <div class="event-description">
                    <h2 class="section-heading">About This Event</h2>
                    <div class="description-content">
                        <p v-for="(paragraph, idx) in descriptionParagraphs" :key="idx">{{ paragraph }}</p>
                    </div>
                </div>

                <!-- Event Gallery -->
                <div v-if="event.images?.length > 1" class="event-gallery">
                    <h2 class="section-heading">Event Gallery</h2>
                    <div class="gallery-grid">
                        <div v-for="image in event.images" :key="image.id" class="gallery-item">
                            <img :src="image.image_url" :alt="image.alt_text || event.title" />
                        </div>
                    </div>
                </div>

                <!-- CTA Section -->
                <div class="event-cta">
                    <div class="cta-content">
                        <h3>Interested in Attending?</h3>
                        <p>Join us for this amazing event. We'd love to see you there!</p>
                    </div>
                    <NuxtLink to="/contact" class="cta-button">
                        Contact Us
                    </NuxtLink>
                </div>
            </div>
        </article>

        <AppFooter />
    </div>
</template>

<script setup lang="ts">
import type { Event } from '~/types/models';

const route = useRoute();
const { get } = useApi();

const id = route.params.id as string;

const { data: eventData, pending, error } = await useAsyncData(
    `event-${id}`,
    () => get<{ status: string; data: Event }>(`/events/${id}`)
);

const event = computed(() => eventData.value?.data);

useHead({
    title: event.value ? `${event.value.title} | Light City Events` : 'Event | Light City',
    meta: [
        {
            name: 'description',
            content: event.value?.subtitle || event.value?.description || '',
        },
    ],
});

const descriptionParagraphs = computed(() => {
    if (!event.value?.description) return [];
    return event.value.description.split('\n').filter(p => p.trim().length > 0);
});

const eventStatus = computed((): 'upcoming' | 'ongoing' | 'finished' => {
    if (!event.value?.event_dates || event.value.event_dates.length === 0) return 'upcoming';

    const dates = event.value.event_dates.map(d => new Date(d));
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
});

const formatFullDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });
};
</script>

<style scoped>
.event-article {
    background: #fff;
}

.event-hero {
    position: relative;
    width: 100%;
    height: 450px;
    overflow: hidden;
    background: #f4f4f5;
}

.event-hero img {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.event-status-badge {
    position: absolute;
    top: 2rem;
    right: 2rem;
    padding: 0.65rem 1.5rem;
    font-size: 0.85rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    border-radius: 6px;
    backdrop-filter: blur(8px);
}

.event-status-badge.upcoming {
    background: rgba(37, 99, 235, 0.9);
    color: #fff;
}

.event-status-badge.ongoing {
    background: rgba(22, 163, 74, 0.9);
    color: #fff;
}

.event-status-badge.finished {
    background: rgba(113, 113, 122, 0.9);
    color: #fff;
}

.event-container {
    max-width: 1000px;
    margin: 0 auto;
    padding: 3rem 1.5rem;
}

.event-title {
    font-size: 2.75rem;
    font-weight: 900;
    color: var(--lc-dark);
    line-height: 1.2;
    margin: 0 0 1rem;
}

.event-subtitle {
    font-size: 1.35rem;
    color: #52525b;
    line-height: 1.5;
    margin: 0 0 3rem;
}

.event-info-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
    gap: 1.25rem;
    margin-bottom: 3rem;
}

.info-card {
    display: flex;
    gap: 1rem;
    padding: 1.5rem;
    background: #f9f9fb;
    border-radius: 10px;
    border-left: 4px solid var(--lc-gold);
}

.info-icon {
    font-size: 2rem;
    color: var(--lc-gold);
    flex-shrink: 0;
}

.info-label {
    font-size: 0.75rem;
    font-weight: 700;
    color: #71717a;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    margin: 0 0 0.35rem;
}

.info-value {
    font-size: 0.95rem;
    font-weight: 600;
    color: var(--lc-dark);
    margin: 0;
    line-height: 1.5;
}

.section-heading {
    font-size: 1.75rem;
    font-weight: 800;
    color: var(--lc-dark);
    margin: 0 0 1.5rem;
    padding-bottom: 0.75rem;
    border-bottom: 3px solid var(--lc-gold);
}

.event-description {
    margin-bottom: 3rem;
}

.description-content p {
    font-size: 1.05rem;
    line-height: 1.8;
    color: #3f3f46;
    margin-bottom: 1.25rem;
}

.description-content p:last-child {
    margin-bottom: 0;
}

.event-gallery {
    margin-bottom: 3rem;
}

.gallery-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: 1.25rem;
}

.gallery-item {
    aspect-ratio: 4/3;
    border-radius: 10px;
    overflow: hidden;
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
    transition: transform 0.3s, box-shadow 0.3s;
}

.gallery-item:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
}

.gallery-item img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
}

.event-cta {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 2rem;
    padding: 2.5rem;
    background: linear-gradient(135deg, var(--lc-dark) 0%, #2d1810 100%);
    border-radius: 12px;
    margin-top: 3rem;
}

.cta-content h3 {
    font-size: 1.5rem;
    font-weight: 800;
    color: #fff;
    margin: 0 0 0.5rem;
}

.cta-content p {
    font-size: 0.95rem;
    color: rgba(255, 255, 255, 0.8);
    margin: 0;
}

.cta-button {
    display: inline-block;
    padding: 0.85rem 2rem;
    background: var(--lc-gold);
    color: #fff;
    font-size: 0.95rem;
    font-weight: 700;
    text-decoration: none;
    border-radius: 8px;
    white-space: nowrap;
    transition: all 0.3s;
}

.cta-button:hover {
    background: #c94a0f;
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(224, 86, 21, 0.4);
}

/* Skeleton Loaders */
@keyframes shimmer {
    0% {
        background-position: -400px 0;
    }

    100% {
        background-position: 400px 0;
    }
}

.skeleton-hero {
    width: 100%;
    height: 350px;
    background: linear-gradient(90deg, #e8e8e8 25%, #f5f5f5 50%, #e8e8e8 75%);
    background-size: 800px 100%;
    animation: shimmer 1.4s infinite;
    border-radius: 8px;
}

.skeleton-line {
    height: 16px;
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

@media (max-width: 768px) {
    .event-hero {
        height: 280px;
    }

    .event-status-badge {
        top: 1rem;
        right: 1rem;
        padding: 0.5rem 1rem;
        font-size: 0.75rem;
    }

    .event-title {
        font-size: 2rem;
    }

    .event-subtitle {
        font-size: 1.1rem;
    }

    .event-info-grid {
        grid-template-columns: 1fr;
    }

    .event-cta {
        flex-direction: column;
        text-align: center;
    }

    .cta-button {
        width: 100%;
        text-align: center;
    }

    .gallery-grid {
        grid-template-columns: 1fr;
    }
}
</style>
