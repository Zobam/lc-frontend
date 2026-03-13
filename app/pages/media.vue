<template>
    <div class="page-wrapper">
        <NavBar />

        <!-- Page Hero -->
        <section class="page-hero">
            <div class="ph-overlay"></div>
            <img src="https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?w=1920&h=400&fit=crop" alt="Media"
                class="ph-bg" />
            <div class="ph-content">
                <p class="ph-label">Watch & Listen</p>
                <h1>Media Library</h1>
                <p class="ph-sub">Access sermons, worship sets, and our latest broadcasts.</p>
            </div>
        </section>

        <!-- Featured Sermon -->
        <section class="featured-sermon">
            <div class="container">
                <h2 class="section-title">Latest Videos</h2>
                <div class="featured-grid">
                    <!-- Main Video -->
                    <div class="featured-video">
                        <template v-if="videosLoading">
                            <div class="video-wrap skeleton-card">
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
                                <div v-else class="video-wrap no-embed">
                                    <img :src="mainVideo.thumbnail_url || 'https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?w=800&h=450&fit=crop'"
                                        :alt="mainVideo.title" />
                                    <a :href="mainVideo.url" target="_blank" rel="noopener" class="play-btn"
                                        aria-label="Play video">
                                        <Icon name="mdi:play-circle" />
                                    </a>
                                </div>
                            </div>
                            <h3>{{ mainVideo.title }}</h3>
                            <p class="sermon-meta">
                                {{ mainVideo.user ? `${mainVideo.user.first_name} ${mainVideo.user.last_name}` : '' }}
                                <template v-if="mainVideo.published_at">
                                    &nbsp;·&nbsp; {{ formatVideoDate(mainVideo.published_at) }}
                                </template>
                            </p>
                        </template>
                    </div>

                    <!-- Side Videos (Up Next) -->
                    <div class="featured-aside">
                        <h4>Up Next</h4>
                        <template v-if="videosLoading">
                            <div class="mini-sermon skeleton-card" v-for="n in 3" :key="n">
                                <div class="skeleton-img"
                                    style="width:100px;height:65px;flex-shrink:0;border-radius:6px"></div>
                                <div style="flex:1">
                                    <div class="skeleton-line long" style="margin-bottom:0.4rem"></div>
                                    <div class="skeleton-line short"></div>
                                </div>
                            </div>
                        </template>
                        <template v-else>
                            <div class="mini-sermon" :class="{ active: mainVideo?.id === s.id }" v-for="s in sideVideos"
                                :key="s.id" @click="selectVideo(s)">
                                <img :src="s.thumbnail_url || 'https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?w=120&h=80&fit=crop'"
                                    :alt="s.title" />
                                <div>
                                    <h5>{{ s.title }}</h5>
                                    <p>{{ s.user ? `${s.user.first_name} ${s.user.last_name}` : '' }} · {{
                                        formatVideoDate(s.published_at) }}</p>
                                </div>
                            </div>
                        </template>
                    </div>
                </div>
            </div>
        </section>

        <!-- Sermon Archive -->
        <section class="archive-section">
            <div class="container">
                <div class="archive-header">
                    <h2 class="section-title">Sermon Archive</h2>
                    <!-- <div class="archive-filters">
                        <select class="filter-select" v-model="selectedSeries">
                            <option value="">All Series</option>
                            <option>Faith Foundations</option>
                            <option>The Grace Life</option>
                            <option>Kingdom Purpose</option>
                        </select>
                    </div> -->
                </div>
                <div class="archive-grid">
                    <template v-if="videosLoading">
                        <div class="sermon-card skeleton-card" v-for="n in 6" :key="n">
                            <div class="skeleton-img" style="height: 160px;"></div>
                            <div class="sc-info">
                                <div class="skeleton-line short" style="margin-bottom:0.5rem"></div>
                                <div class="skeleton-line long" style="margin-bottom:0.4rem"></div>
                                <div class="skeleton-line medium"></div>
                            </div>
                        </div>
                    </template>
                    <template v-else>
                        <div class="sermon-card" v-for="s in archiveVideos" :key="s.id"
                            @click="selectVideo(s); scrollToTop()">
                            <div class="sc-thumb">
                                <img :src="s.thumbnail_url || 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=220&fit=crop'"
                                    :alt="s.title" />
                                <div class="sc-play">
                                    <Icon name="mdi:play" />
                                </div>
                            </div>
                            <div class="sc-info">
                                <span class="sc-series">Message</span>
                                <h4>{{ s.title }}</h4>
                                <p>{{ s.user ? `${s.user.first_name} ${s.user.last_name}` : '' }} · {{
                                    formatVideoDate(s.published_at) }}</p>
                            </div>
                        </div>
                    </template>
                </div>
            </div>
        </section>

        <!-- Worship Playlist
        <section class="worship-section">
            <div class="container">
                <h2 class="section-title wlight">Worship Playlist</h2>
                <div class="worship-grid">
                    <div class="worship-card" v-for="w in worship" :key="w.title">
                        <div class="wc-thumb">
                            <img :src="w.img" :alt="w.title" />
                            <div class="wc-play">
                                <Icon name="mdi:music" />
                            </div>
                        </div>
                        <p>{{ w.title }}</p>
                    </div>
                </div>
            </div>
        </section> -->

        <AppFooter />
    </div>
</template>

<script setup lang="ts">
import type { VideoListResponse } from '~/types/api';
import type { VideoLink } from '~/types/models';

useHead({
    title: 'Media Library | Light City Evangelical Center',
    meta: [
        {
            name: 'description',
            content: 'Watch sermons, worship sets, and the latest broadcasts from Light City Evangelical Center. Access our full media library and be inspired anytime, anywhere.',
        },
    ],
});

const { get } = useApi();

const selectedSeries = ref('');

const videosLoading = ref(true);
const mainVideo = ref<VideoLink | null>(null);
const sideVideos = ref<VideoLink[]>([]);
const archiveVideos = ref<VideoLink[]>([]);
const autoplay = ref(false);

const getYouTubeId = (video: VideoLink): string | null => {
    if (video.video_id && video.video_id.length === 11) return video.video_id;
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

const scrollToTop = () => {
    const featuredSection = document.querySelector('.featured-sermon');
    if (featuredSection) {
        featuredSection.scrollIntoView({ behavior: 'smooth' });
    } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
};

const formatVideoDate = (dateStr?: string | null): string => {
    if (!dateStr) return '';
    return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
};

onMounted(async () => {
    try {
        const response = await get<VideoListResponse>('/videos', { per_page: 11 });
        const videos = response.data?.data ?? [];
        mainVideo.value = videos[0] ?? null;
        sideVideos.value = videos.slice(1, 5);
        archiveVideos.value = videos.slice(5);
    } catch (e) {
        console.error('Failed to load videos:', e);
    } finally {
        videosLoading.value = false;
    }
});

const worship = [
    { title: 'Praise Medley — Feb 2026', img: 'https://images.unsplash.com/photo-1415201364774-f6f0bb35f28f?w=300&h=200&fit=crop' },
    { title: 'Sunday Worship Set 1', img: 'https://images.unsplash.com/photo-1429962714451-bb934ecdc4ec?w=300&h=200&fit=crop' },
    { title: 'Holy Ghost Night Worship', img: 'https://images.unsplash.com/photo-1508997449629-303059a039c0?w=300&h=200&fit=crop' },
    { title: 'Youth Praise Session', img: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=300&h=200&fit=crop' },
];
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

.section-title {
    font-size: 1.75rem;
    font-weight: 800;
    color: var(--lc-dark);
    margin-bottom: 2rem;
}

.section-title.wlight {
    color: #fff;
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

/* Featured Sermon */
.featured-sermon {
    padding: 4rem 0;
    background: #fff;
}

.featured-grid {
    display: grid;
    grid-template-columns: 1.6fr 1fr;
    gap: 2rem;
}

.video-wrap {
    position: relative;
    border-radius: 10px;
    overflow: hidden;
    aspect-ratio: 16/9;
    background: #000;
}

.video-wrap img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
    opacity: 0.85;
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

.video-wrap.no-embed img {
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

.featured-video h3 {
    font-size: 1.1rem;
    font-weight: 700;
    color: var(--lc-dark);
    margin: 1rem 0 0.25rem;
}

.sermon-meta {
    color: #999;
    font-size: 0.82rem;
}

.featured-aside h4 {
    font-size: 1rem;
    font-weight: 700;
    color: var(--lc-dark);
    margin-bottom: 1.25rem;
}

.mini-sermon {
    display: flex;
    gap: 1rem;
    margin-bottom: 1rem;
    padding-bottom: 1rem;
    border-bottom: 1px solid #f0f0f0;
    cursor: pointer;
    transition: all 0.2s;
}

.mini-sermon.active {
    border-left: 3px solid var(--lc-gold);
    padding-left: 1rem;
    background: #fdfdfd;
}

.mini-sermon:hover {
    background: #fafafa;
}

.mini-sermon img {
    width: 100px;
    height: 65px;
    object-fit: cover;
    border-radius: 6px;
    flex-shrink: 0;
}

.mini-sermon h5 {
    font-size: 0.85rem;
    font-weight: 700;
    color: var(--lc-dark);
    margin: 0 0 0.25rem;
}

.mini-sermon p {
    font-size: 0.75rem;
    color: #999;
    margin: 0;
}

/* Archive */
.archive-section {
    padding: 4rem 0;
    background: #f9f9fb;
}

.archive-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 2rem;
}

.archive-header .section-title {
    margin-bottom: 0;
}

.filter-select {
    padding: 8px 14px;
    border: 1.5px solid #ddd;
    border-radius: 6px;
    font-family: inherit;
    font-size: 0.85rem;
    color: #555;
    cursor: pointer;
}

.archive-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 1.25rem;
}

.sermon-card {
    background: #fff;
    border-radius: 10px;
    overflow: hidden;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.06);
    cursor: pointer;
    transition: transform 0.25s;
}

.sermon-card:hover {
    transform: translateY(-4px);
}

.sc-thumb {
    position: relative;
    overflow: hidden;
}

.sc-thumb img {
    width: 100%;
    height: 160px;
    object-fit: cover;
    display: block;
    transition: transform 0.4s;
}

.sermon-card:hover .sc-thumb img {
    transform: scale(1.05);
}

.sc-play {
    position: absolute;
    inset: 0;
    background: rgba(10, 10, 30, 0.4);
    display: flex;
    align-items: center;
    justify-content: center;
    color: #fff;
    font-size: 2rem;
    opacity: 0;
    transition: opacity 0.25s;
}

.sermon-card:hover .sc-play {
    opacity: 1;
}

.sc-info {
    padding: 1rem 1.1rem;
}

.sc-series {
    font-size: 0.68rem;
    font-weight: 700;
    color: var(--lc-gold);
    text-transform: uppercase;
    letter-spacing: 0.08em;
}

.sc-info h4 {
    font-size: 0.95rem;
    font-weight: 700;
    color: var(--lc-dark);
    margin: 0.3rem 0 0.25rem;
}

.sc-info p {
    font-size: 0.78rem;
    color: #999;
    margin: 0;
}

/* Worship */
.worship-section {
    padding: 4rem 0 5rem;
    background: var(--lc-dark);
}

.worship-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 1.25rem;
}

.worship-card {
    cursor: pointer;
}

.wc-thumb {
    position: relative;
    border-radius: 8px;
    overflow: hidden;
    aspect-ratio: 3/2;
    margin-bottom: 0.75rem;
}

.wc-thumb img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    opacity: 0.7;
    transition: opacity 0.3s, transform 0.4s;
}

.worship-card:hover .wc-thumb img {
    opacity: 1;
    transform: scale(1.06);
}

.wc-play {
    position: absolute;
    inset: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--lc-gold);
    font-size: 2rem;
}

.worship-card p {
    color: #ccc;
    font-size: 0.85rem;
    font-weight: 600;
    margin: 0;
}

@media (max-width: 900px) {
    .featured-grid {
        grid-template-columns: 1fr;
    }

    .archive-grid {
        grid-template-columns: repeat(2, 1fr);
    }

    .worship-grid {
        grid-template-columns: repeat(2, 1fr);
    }
}

@media (max-width: 540px) {
    .archive-grid {
        grid-template-columns: 1fr;
    }
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
    height: 100%;
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
</style>
