<template>
    <div>
        <!-- Hero Section -->
        <section class="hero">
            <div class="hero-overlay"></div>
            <img src="https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=1920&h=900&fit=crop"
                alt="Church worship service" class="hero-bg" />
            <div class="hero-content">
                <p class="hero-label">Light City Evangelical Center Int'l</p>
                <h1 class="hero-title">Giving Your Life<br>a Meaning</h1>
                <p class="hero-subtitle">
                    Join us in worship, fellowship, and service as we grow together in faith and love.
                </p>
                <div class="hero-buttons">
                    <NuxtLink to="/about" class="btn btn-gold">Join Our Community</NuxtLink>
                    <NuxtLink to="/media" class="btn btn-outline-white">Watch Online</NuxtLink>
                </div>
            </div>
        </section>

        <!-- Latest Broadcast / Featured Events Ticker -->
        <div class="broadcast-bar">
            <span class="bar-label">Latest:</span>
            <span class="bar-text">{{ latestTickerText }}</span>
        </div>
    </div>
</template>

<script setup lang="ts">
import { useAppResourceInfoStore } from '~/stores/appResourceInfo';

const store = useAppResourceInfoStore();

const latestTickerText = computed(() => {
    if (store.eventsLoading || store.videosLoading) {
        return 'Loading...';
    }

    const sortedItems = [...store.events, ...store.videos].sort((a, b) => {
        const dateA = new Date(a.created_at || a.event_dates?.[0] || a.published_at || 0).getTime();
        const dateB = new Date(b.created_at || b.event_dates?.[0] || b.published_at || 0).getTime();
        return dateB - dateA;
    });

    const titles = sortedItems.map(item => item.title);

    let result = '';
    for (let i = 0; i < titles.length; i++) {
        const separator = result.length > 0 ? ' \u00A0|\u00A0 ' : '';
        const addition = separator + titles[i];

        if ((result + addition).length > 80) {
            break;
        }
        result += addition;
    }

    return result || '';
});
</script>

<style scoped>
/* ───── Hero ───── */
.hero {
    position: relative;
    height: 88vh;
    min-height: 560px;
    display: flex;
    align-items: center;
    overflow: hidden;
}

.hero-bg {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
    z-index: 0;
}

.hero-overlay {
    position: absolute;
    inset: 0;
    background: linear-gradient(to right, rgba(10, 10, 30, 0.85) 40%, rgba(10, 10, 30, 0.4));
    z-index: 1;
}

.hero-content {
    position: relative;
    z-index: 2;
    padding: 0 5%;
    max-width: 680px;
}

.hero-label {
    color: var(--lc-gold);
    font-weight: 600;
    font-size: 0.85rem;
    letter-spacing: 0.15em;
    text-transform: uppercase;
    margin-bottom: 1rem;
}

.hero-title {
    font-size: clamp(2.5rem, 5vw, 4rem);
    font-weight: 900;
    color: #fff;
    line-height: 1.1;
    margin-bottom: 1.25rem;
}

.hero-subtitle {
    color: rgba(255, 255, 255, 0.8);
    font-size: 1.1rem;
    line-height: 1.7;
    margin-bottom: 2rem;
    max-width: 480px;
}

.hero-buttons {
    display: flex;
    gap: 1rem;
    flex-wrap: wrap;
}

/* ───── Broadcast Bar ───── */
.broadcast-bar {
    background: var(--lc-dark);
    color: #ccc;
    padding: 10px 24px;
    display: flex;
    align-items: center;
    gap: 12px;
    font-size: 0.85rem;
    overflow: hidden;
}

.bar-label {
    color: var(--lc-gold);
    font-weight: 700;
    flex-shrink: 0;
}

.bar-text {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

@media (max-width: 768px) {
    .hero-content {
        padding: 0 5%;
    }
}
</style>
