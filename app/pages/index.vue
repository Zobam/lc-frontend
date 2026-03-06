<template>
    <div class="homepage">
        <NavBar />

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
            <span class="bar-text">Praise Carnival 2026 &nbsp;|&nbsp; Holy Ghost Night &nbsp;|&nbsp; Annual Convention
                &nbsp;|&nbsp; Youth Summit 2026</span>
        </div>

        <!-- Featured Events / Broadcast Grid -->
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
                            <NuxtLink to="/events" class="btn btn-gold-sm">Register</NuxtLink>
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

        <!-- Words of the Spirit -->
        <section class="wos-section">
            <div class="container">
                <h2 class="wos-label">Words of the Spirit</h2>
                <div class="wos-grid">
                    <!-- Skeleton loaders while loading -->
                    <template v-if="wosLoading">
                        <div class="wos-card skeleton-card" v-for="n in 8" :key="n">
                            <div class="wos-img">
                                <div class="skeleton-img" style="height:100%"></div>
                            </div>
                            <div class="wos-body">
                                <div class="skeleton-line long" style="margin-bottom:0.5rem"></div>
                                <div class="skeleton-line medium"></div>
                            </div>
                        </div>
                    </template>
                    <template v-else>
                        <div class="wos-card" v-for="w in wordsOfTheSpirit" :key="w.id">
                            <div class="wos-img">
                                <img :src="w.featured_image?.image_url || 'https://images.unsplash.com/photo-1507692049790-de58290a4334?w=400&h=260&fit=crop'"
                                    :alt="w.featured_image?.alt_text || w.title" />
                            </div>
                            <div class="wos-body">
                                <h3>{{ w.title }}</h3>
                                <p>{{ w.excerpt || w.subtitle || '' }}</p>
                            </div>
                        </div>
                    </template>
                </div>
            </div>
        </section>

        <!-- Choose Life Banner -->
        <section class="choose-life">
            <div class="cl-overlay"></div>
            <img src="https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=1920&h=500&fit=crop" alt="Choose Life"
                class="cl-bg" />
            <div class="cl-content">
                <h2>CHOOSE LIFE</h2>
                <div class="cl-cross">✝</div>
                <p>
                    For God so loved the world that he gave his one and only Son, that whoever believes in him shall not
                    perish but have eternal life. We invite you to make that choice today — a choice that will change
                    your life forever and give it new meaning, purpose and direction.
                </p>
                <NuxtLink to="/about" class="btn btn-gold">Make A Decision Today</NuxtLink>
            </div>
        </section>

        <!-- Media / Video Section -->
        <section class="media-section">
            <div class="container">
                <div class="section-header">
                    <h2 class="section-title">Latest Sermons</h2>
                    <NuxtLink to="/media" class="view-all">Watch More →</NuxtLink>
                </div>
                <div class="media-layout">
                    <!-- Main Video -->
                    <div class="video-main">
                        <template v-if="videosLoading">
                            <div class="video-thumb">
                                <div class="skeleton-img" style="height:100%"></div>
                            </div>
                            <div class="skeleton-line long" style="margin-top:1rem;margin-bottom:0.4rem"></div>
                            <div class="skeleton-line medium"></div>
                        </template>
                        <template v-else-if="mainVideo">
                            <div class="video-embed-wrap">
                                <iframe v-if="mainVideoEmbedUrl" :src="mainVideoEmbedUrl" :title="mainVideo.title"
                                    frameborder="0"
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                    allowfullscreen class="video-iframe"></iframe>
                                <div v-else class="video-thumb no-embed">
                                    <img :src="mainVideo.thumbnail_url || 'https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?w=700&h=400&fit=crop'"
                                        :alt="mainVideo.title" />
                                    <a :href="mainVideo.url" target="_blank" rel="noopener" class="play-btn"
                                        aria-label="Play video">
                                        <Icon name="mdi:play-circle" />
                                    </a>
                                </div>
                            </div>
                            <h3 class="video-title">{{ mainVideo.title }}</h3>
                            <p class="video-meta">
                                {{ mainVideo.user ? `${mainVideo.user.first_name} ${mainVideo.user.last_name}` : '' }}
                                <template v-if="mainVideo.published_at">
                                    &nbsp;·&nbsp; {{ formatVideoDate(mainVideo.published_at) }}
                                </template>
                            </p>
                        </template>
                    </div>
                    <!-- Side Videos -->
                    <div class="video-sidebar">
                        <template v-if="videosLoading">
                            <div class="sidebar-item skeleton-card" v-for="n in 4" :key="n">
                                <div class="skeleton-img" style="width:120px;height:80px;flex-shrink:0"></div>
                                <div style="flex:1">
                                    <div class="skeleton-line long" style="margin-bottom:0.4rem"></div>
                                    <div class="skeleton-line short"></div>
                                </div>
                            </div>
                        </template>
                        <template v-else>
                            <div class="sidebar-item" :class="{ active: mainVideo?.id === v.id }"
                                v-for="v in sideVideos" :key="v.id" @click="selectVideo(v)">
                                <img :src="v.thumbnail_url || 'https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?w=120&h=80&fit=crop'"
                                    :alt="v.title" />
                                <div>
                                    <h4>{{ v.title }}</h4>
                                    <p>{{ v.user ? `${v.user.first_name} ${v.user.last_name}` : '' }} · {{
                                        formatVideoDate(v.published_at) }}</p>
                                </div>
                            </div>
                        </template>
                    </div>
                </div>
            </div>
        </section>

        <!-- Partnership Impact -->
        <section class="partnership">
            <div class="partnership-overlay"></div>
            <img src="https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=1920&h=600&fit=crop"
                alt="Partnership" class="partnership-bg" />
            <div class="container partnership-content">
                <div class="partnership-text">
                    <h2>Partnership Impact</h2>
                    <p>
                        The InnerCity Mission for Children envisions a world in which orphaned, deprived, and
                        vulnerable children in the inner cities live free of poverty and fulfill their God-given
                        potential, becoming responsible and self-reliant adults.
                    </p>
                    <div class="impact-stats">
                        <div class="stat">
                            <h3>500+</h3>
                            <p>Children Supported</p>
                        </div>
                        <div class="stat">
                            <h3>25</h3>
                            <p>Communities Reached</p>
                        </div>
                        <div class="stat">
                            <h3>10</h3>
                            <p>Years of Service</p>
                        </div>
                    </div>
                    <NuxtLink to="/give" class="btn btn-gold">Get Involved</NuxtLink>
                </div>
            </div>
        </section>

        <!-- Ministries Grid -->
        <section class="ministries">
            <div class="container">
                <div class="section-header">
                    <h2 class="section-title">Our Ministries</h2>
                    <NuxtLink to="/about" class="view-all">Explore All →</NuxtLink>
                </div>
                <div class="ministries-grid">
                    <div class="ministry-card" v-for="m in ministries" :key="m.title">
                        <img :src="m.img" :alt="m.title" />
                        <div class="ministry-overlay">
                            <h3>{{ m.title }}</h3>
                            <p>{{ m.desc }}</p>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <!-- Ministry Focus Cards -->
        <section class="focus-cards">
            <div class="container">
                <h2 class="section-title">Connect With Us</h2>
                <div class="focus-grid">
                    <div v-for="card in focusCards" :key="card.title" class="focus-card">
                        <div class="focus-icon">
                            <Icon :name="card.icon" />
                        </div>
                        <h3>{{ card.title }}</h3>
                        <p>{{ card.desc }}</p>
                        <NuxtLink :to="card.link" class="btn-ghost">{{ card.cta }}</NuxtLink>
                    </div>
                </div>
            </div>
        </section>

        <!-- Gallery Strip -->
        <section class="gallery-strip">
            <div class="container gallery-inner">
                <div class="gallery-featured">
                    <Transition name="gallery-fade">
                        <img :key="activeGalleryImg.src" :src="activeGalleryImg.src" :alt="activeGalleryImg.alt"
                            class="gallery-featured-img" />
                    </Transition>
                    <div class="gallery-featured-caption">{{ activeGalleryImg.alt }}</div>
                </div>
                <div class="gallery-grid">
                    <div v-for="img in galleryImages" :key="img.src" class="gallery-item"
                        :class="{ active: activeGalleryImg.src === img.src }" @click="activeGalleryImg = img">
                        <img :src="img.src" :alt="img.alt" />
                    </div>
                </div>
            </div>
        </section>

        <AppFooter />
    </div>
</template>

<script setup lang="ts">
import type { EventsListResponse, PostCategoryListResponse, VideoListResponse } from '~/types/api';
import type { Event, Post, VideoLink } from '~/types/models';

const { get } = useApi();

// ── Events ──────────────────────────────────────────────────────────
const eventsLoading = ref(true);
const featuredEvent = ref<Event | null>(null);
const sideEvents = ref<Event[]>([]);

// ── Words of the Spirit ─────────────────────────────────────────────
const wosLoading = ref(true);
const wordsOfTheSpirit = ref<Post[]>([]);

// ── Videos ──────────────────────────────────────────────────────────
const videosLoading = ref(true);
const mainVideo = ref<VideoLink | null>(null);
const sideVideos = ref<VideoLink[]>([]);
const autoplay = ref(false); // true only when user clicks a side video

const getYouTubeId = (video: VideoLink): string | null => {
    // Prefer stored video_id if it looks valid (11 chars)
    if (video.video_id && video.video_id.length === 11) return video.video_id;
    // Parse from URL
    const match = video.url?.match(/(?:v=|youtu\.be\/)([A-Za-z0-9_-]{11})/);
    return match ? match[1]! : null;
};

const mainVideoEmbedUrl = computed(() => {
    if (!mainVideo.value) return null;
    const id = getYouTubeId(mainVideo.value);
    if (!id) return null;
    const params = new URLSearchParams({ rel: '0', modestbranding: '1' });
    if (autoplay.value) params.set('autoplay', '1');
    return `https://www.youtube.com/embed/${id}?${params.toString()}`;
});

const selectVideo = (video: VideoLink) => {
    autoplay.value = true;
    mainVideo.value = video;
};

const formatVideoDate = (dateStr?: string | null): string => {
    if (!dateStr) return '';
    return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
};

onMounted(async () => {
    // Fetch events
    try {
        const response = await get<EventsListResponse>('/events', { per_page: 5 });
        const events = response.data ?? [];
        featuredEvent.value = events[0] ?? null;
        sideEvents.value = events.slice(1);
    } catch (e) {
        console.error('Failed to load events:', e);
    } finally {
        eventsLoading.value = false;
    }

    // Fetch words of the spirit
    try {
        const response = await get<PostCategoryListResponse>('/posts/category/devotional', { per_page: 8 });
        wordsOfTheSpirit.value = response.data?.data ?? [];
    } catch (e) {
        console.error('Failed to load devotionals:', e);
    } finally {
        wosLoading.value = false;
    }

    // Fetch videos
    try {
        const response = await get<VideoListResponse>('/videos', { per_page: 5 });
        const videos = response.data?.data ?? [];
        mainVideo.value = videos[0] ?? null;
        sideVideos.value = videos.slice(1);
    } catch (e) {
        console.error('Failed to load videos:', e);
    } finally {
        videosLoading.value = false;
    }
});

const formatEventDate = (dateStr?: string): string => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { month: 'short', day: '2-digit' }).toUpperCase();
};

const ministries = [
    { title: 'Worship Ministry', desc: 'Leading hearts to God through music and praise.', img: 'https://images.unsplash.com/photo-1415201364774-f6f0bb35f28f?w=400&h=280&fit=crop' },
    { title: 'Children\'s Church', desc: 'Nurturing young hearts in the ways of God.', img: 'https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=400&h=280&fit=crop' },
    { title: 'Youth Ministry', desc: 'Equipping young people for greatness.', img: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=400&h=280&fit=crop' },
    { title: 'Prayer Ministry', desc: 'Interceding for individuals, families and nations.', img: 'https://images.unsplash.com/photo-1545987796-200677ee1011?w=400&h=280&fit=crop' },
    { title: 'Women\'s Ministry', desc: 'Empowering women to walk in their God-given purpose.', img: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=400&h=280&fit=crop' },
    { title: 'Men\'s Fellowship', desc: 'Building men of integrity, faith, and family.', img: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=400&h=280&fit=crop' },
];


const focusCards = [
    { title: 'Prayer Request', desc: 'Submit your prayer requests and our team will pray with you.', icon: 'mdi:hands-pray', link: '/contact', cta: 'Submit a Request' },
    { title: 'New Members', desc: 'Begin your journey with us. We\'d love to welcome you home.', icon: 'mdi:account-heart', link: '/about', cta: 'Get Started' },
    { title: 'Give Online', desc: 'Support the work of God\'s kingdom through your generous giving.', icon: 'mdi:hand-heart', link: '/give', cta: 'Give Now' },
];

const galleryImages = [
    { src: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=1200&h=600&fit=crop', alt: 'Sunday Worship Service' },
    { src: 'https://images.unsplash.com/photo-1438032005730-c779502df39b?w=1200&h=600&fit=crop', alt: 'Community Fellowship' },
    { src: 'https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?w=1200&h=600&fit=crop', alt: 'Midweek Bible Study' },
    { src: 'https://images.unsplash.com/photo-1494522855154-9297ac14b55f?w=1200&h=600&fit=crop', alt: 'Prayer Night' },
    { src: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=1200&h=600&fit=crop', alt: 'Youth Summit' },
    { src: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=1200&h=600&fit=crop', alt: 'Women\'s Ministry' },
];

const activeGalleryImg = ref(galleryImages[0]!);
</script>

<style scoped>
/* ───── Globals ───── */
*,
*::before,
*::after {
    box-sizing: border-box;
}

.homepage {
    font-family: 'Segoe UI', system-ui, sans-serif;
    background: #fff;
}

.container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 24px;
}

.section-title {
    font-size: 1.85rem;
    font-weight: 800;
    color: var(--lc-dark);
}

.section-header {
    display: flex;
    align-items: baseline;
    justify-content: space-between;
    margin-bottom: 2rem;
}

.view-all {
    color: var(--lc-gold);
    font-weight: 600;
    font-size: 0.9rem;
    text-decoration: none;
}

.view-all:hover {
    text-decoration: underline;
}

/* Buttons */
.btn {
    display: inline-block;
    padding: 12px 28px;
    border-radius: 4px;
    font-weight: 700;
    font-size: 0.9rem;
    text-decoration: none;
    cursor: pointer;
    border: 2px solid transparent;
    transition: all 0.25s;
}

.btn-gold {
    background: var(--lc-gold);
    color: #fff;
    border-color: var(--lc-gold);
}

.btn-gold:hover {
    background: var(--lc-gold-hover);
    border-color: var(--lc-gold-hover);
    transform: translateY(-2px);
}

.btn-outline-white {
    background: transparent;
    color: #fff;
    border-color: #fff;
}

.btn-outline-white:hover {
    background: rgba(255, 255, 255, 0.15);
}

.btn-gold-sm {
    display: inline-block;
    padding: 7px 18px;
    background: var(--lc-gold);
    color: #fff;
    border-radius: 4px;
    font-weight: 600;
    font-size: 0.8rem;
    text-decoration: none;
    transition: background 0.2s;
}

.btn-gold-sm:hover {
    background: var(--lc-gold-hover);
}

.btn-ghost {
    display: inline-block;
    margin-top: 0.75rem;
    color: var(--lc-gold);
    font-weight: 600;
    font-size: 0.85rem;
    text-decoration: none;
    border-bottom: 1px solid var(--lc-gold);
    padding-bottom: 1px;
    transition: opacity 0.2s;
}

.btn-ghost:hover {
    opacity: 0.7;
}

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
    padding: 0 10%;
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

/* ───── Words of the Spirit ───── */
.wos-section {
    padding: 3rem 0 4rem;
    /* background: #111; */
}

.wos-label {
    font-size: 0.82rem;
    font-weight: 700;
    color: #ccc;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    margin-bottom: 1.25rem;
    border: 1px solid #333;
    display: inline-block;
    padding: 4px 12px;
    border-radius: 3px;
}

.wos-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 1.25rem;
}

.wos-card {
    background: #fff;
    border-radius: 6px;
    overflow: hidden;
    cursor: pointer;
    transition: transform 0.25s, box-shadow 0.25s;
}

.wos-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 10px 28px rgba(0, 0, 0, 0.4);
}

.wos-img {
    width: 100%;
    aspect-ratio: 4/3;
    overflow: hidden;
}

.wos-img img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
    transition: transform 0.4s;
}

.wos-card:hover .wos-img img {
    transform: scale(1.06);
}

.wos-body {
    padding: 1rem 1.1rem 1.25rem;
}

.wos-body h3 {
    font-size: 0.95rem;
    font-weight: 800;
    color: var(--lc-dark);
    margin: 0 0 0.5rem;
    line-height: 1.3;
}

.wos-body p {
    font-size: 0.78rem;
    color: #666;
    line-height: 1.55;
    margin: 0;
}

/* ───── Ministries ───── */
.ministries {
    padding: 4rem 0;
    background: #fff;
}

.ministries-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 1.25rem;
}

.ministry-card {
    position: relative;
    border-radius: 10px;
    overflow: hidden;
    aspect-ratio: 4/3;
    cursor: pointer;
}

.ministry-card img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.4s;
}

.ministry-card:hover img {
    transform: scale(1.08);
}

.ministry-overlay {
    position: absolute;
    inset: 0;
    background: linear-gradient(to top, rgba(10, 10, 30, 0.85) 40%, transparent);
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    padding: 1.25rem;
    transition: background 0.3s;
}

.ministry-card:hover .ministry-overlay {
    background: linear-gradient(to top, rgba(10, 10, 30, 0.92) 60%, transparent);
}

.ministry-overlay h3 {
    color: #fff;
    font-size: 1rem;
    font-weight: 700;
    margin: 0 0 0.35rem;
}

.ministry-overlay p {
    color: rgba(255, 255, 255, 0.75);
    font-size: 0.8rem;
    line-height: 1.4;
    margin: 0;
}

/* ───── Choose Life ───── */
.choose-life {
    position: relative;
    padding: 6rem 24px;
    display: flex;
    align-items: center;
    justify-content: center;
    text-align: center;
    overflow: hidden;
    min-height: 420px;
}

.cl-bg {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
    z-index: 0;
}

.cl-overlay {
    position: absolute;
    inset: 0;
    background: rgba(15, 10, 40, 0.78);
    z-index: 1;
}

.cl-content {
    position: relative;
    z-index: 2;
    max-width: 720px;
}

.cl-content h2 {
    font-size: clamp(2.5rem, 5vw, 3.5rem);
    font-weight: 900;
    color: #fff;
    letter-spacing: 0.12em;
    margin-bottom: 0.5rem;
}

.cl-cross {
    font-size: 3rem;
    color: var(--lc-gold);
    margin: 0.5rem 0 1.5rem;
}

.cl-content p {
    color: rgba(255, 255, 255, 0.8);
    font-size: 1rem;
    line-height: 1.8;
    margin-bottom: 2rem;
}

/* ───── Media Section ───── */
.media-section {
    padding: 4rem 0;
    background: #f4f4f8;
}

.media-layout {
    display: grid;
    grid-template-columns: 1.6fr 1fr;
    gap: 2rem;
    align-items: start;
}

.video-thumb {
    position: relative;
    border-radius: 10px;
    overflow: hidden;
    aspect-ratio: 16/9;
    background: #000;
}

.video-thumb img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    opacity: 0.85;
    display: block;
}

.play-btn {
    position: absolute;
    inset: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 5rem;
    color: rgba(255, 255, 255, 0.9);
    text-decoration: none;
    transition: color 0.2s;
}

.play-btn:hover {
    color: var(--lc-gold);
}

.video-title {
    font-size: 1.1rem;
    font-weight: 700;
    color: var(--lc-dark);
    margin: 1rem 0 0.25rem;
}

.video-meta {
    color: #999;
    font-size: 0.82rem;
}

.video-sidebar {
    display: flex;
    flex-direction: column;
    gap: 1rem;
}

.sidebar-item {
    display: flex;
    gap: 1rem;
    background: #fff;
    border-radius: 8px;
    padding: 0.75rem;
    box-shadow: 0 1px 6px rgba(0, 0, 0, 0.06);
    transition: box-shadow 0.2s;
    cursor: pointer;
}

.sidebar-item:hover {
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
}

.sidebar-item img {
    width: 100px;
    height: 65px;
    object-fit: cover;
    border-radius: 6px;
    flex-shrink: 0;
}

.sidebar-item h4 {
    font-size: 0.85rem;
    font-weight: 700;
    color: var(--lc-dark);
    margin: 0 0 0.25rem;
    line-height: 1.3;
}

.sidebar-item p {
    font-size: 0.75rem;
    color: #999;
    margin: 0;
}

.sidebar-item.active {
    border: 2px solid var(--lc-gold);
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.12);
}

.video-embed-wrap {
    position: relative;
    border-radius: 10px;
    overflow: hidden;
    aspect-ratio: 16/9;
    background: #000;
}

.video-iframe {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    border: none;
    display: block;
}

.video-thumb.no-embed {
    position: relative;
    border-radius: 10px;
    overflow: hidden;
    aspect-ratio: 16/9;
    background: #000;
}

.video-thumb.no-embed img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    opacity: 0.85;
    display: block;
}

/* ───── Partnership ───── */
.partnership {
    position: relative;
    padding: 5rem 0;
    overflow: hidden;
}

.partnership-bg {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
    z-index: 0;
}

.partnership-overlay {
    position: absolute;
    inset: 0;
    background: rgba(10, 10, 30, 0.82);
    z-index: 1;
}

.partnership-content {
    position: relative;
    z-index: 2;
    max-width: 620px;
}

.partnership-text h2 {
    font-size: 2rem;
    font-weight: 800;
    color: #fff;
    margin-bottom: 1rem;
}

.partnership-text>p {
    color: rgba(255, 255, 255, 0.78);
    font-size: 0.95rem;
    line-height: 1.8;
    margin-bottom: 2rem;
}

.impact-stats {
    display: flex;
    gap: 2.5rem;
    margin-bottom: 2.5rem;
}

.stat h3 {
    font-size: 2.5rem;
    font-weight: 900;
    color: var(--lc-gold);
    margin: 0;
}

.stat p {
    font-size: 0.8rem;
    color: rgba(255, 255, 255, 0.65);
    margin: 0.25rem 0 0;
}

/* ───── Focus Cards ───── */
.focus-cards {
    padding: 4rem 0;
    background: var(--lc-dark);
}

.focus-cards .section-title {
    color: #fff;
    margin-bottom: 2rem;
}

.focus-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 1.5rem;
}

.focus-card {
    background: rgba(255, 255, 255, 0.06);
    border: 1px solid rgba(200, 168, 75, 0.25);
    border-radius: 12px;
    padding: 2rem;
    text-align: center;
    transition: background 0.25s, border-color 0.25s;
}

.focus-card:hover {
    background: rgba(200, 168, 75, 0.12);
    border-color: var(--lc-gold);
}

.focus-icon {
    font-size: 2.5rem;
    color: var(--lc-gold);
    margin-bottom: 1rem;
}

.focus-card h3 {
    color: #fff;
    font-size: 1.1rem;
    font-weight: 700;
    margin-bottom: 0.6rem;
}

.focus-card p {
    color: #aaa;
    font-size: 0.85rem;
    line-height: 1.6;
    margin: 0;
}

/* ───── Gallery Strip ───── */
.gallery-strip {
    background: #0f0f1e;
}

/* Featured preview */
.gallery-featured {
    position: relative;
    width: 100%;
    height: 480px;
    overflow: hidden;
}

.gallery-featured-img {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
}

.gallery-featured-caption {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    padding: 1rem 1.5rem;
    background: linear-gradient(to top, rgba(0, 0, 0, 0.75) 80%, transparent);
    color: #fff;
    font-size: 0.9rem;
    font-weight: 600;
    letter-spacing: 0.04em;
    text-transform: uppercase;
}

/* Fade transition for featured image */
.gallery-fade-enter-active,
.gallery-fade-leave-active {
    transition: opacity 0.4s ease;
    position: absolute;
    inset: 0;
}

.gallery-fade-enter-from,
.gallery-fade-leave-to {
    opacity: 0;
}

/* Thumbnail grid */
.gallery-grid {
    display: grid;
    grid-template-columns: repeat(6, 1fr);
}

.gallery-item {
    overflow: hidden;
    aspect-ratio: 4/3;
    cursor: pointer;
    position: relative;
}

.gallery-item::after {
    content: '';
    position: absolute;
    inset: 0;
    border: 3px solid transparent;
    transition: border-color 0.2s, background 0.2s;
    pointer-events: none;
}

.gallery-item.active::after {
    border-color: var(--lc-gold);
    background: rgba(224, 86, 21, 0.15);
}

.gallery-item img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.4s, opacity 0.3s;
    opacity: 0.65;
}

.gallery-item:hover img,
.gallery-item.active img {
    transform: scale(1.08);
    opacity: 1;
}

/* ───── Responsive ───── */
@media (max-width: 1024px) {
    .ministries-grid {
        grid-template-columns: repeat(2, 1fr);
    }

    .gallery-grid {
        grid-template-columns: repeat(3, 1fr);
    }
}

@media (max-width: 768px) {
    .broadcasts-grid {
        grid-template-columns: 1fr;
    }

    .broadcasts-side {
        display: none;
    }

    .ministries-grid {
        grid-template-columns: repeat(2, 1fr);
    }

    .media-layout {
        grid-template-columns: 1fr;
    }

    .focus-grid {
        grid-template-columns: 1fr;
    }

    .impact-stats {
        gap: 1.5rem;
        flex-wrap: wrap;
    }

    .gallery-grid {
        grid-template-columns: repeat(2, 1fr);
    }

    .gallery-inner {
        max-width: 100%;
        padding: 0;
    }

    .hero-content {
        padding: 0 5%;
    }
}

@media (max-width: 480px) {
    .ministries-grid {
        grid-template-columns: 1fr;
    }
}
</style>