<template>
    <section class="media-section">
        <div class="container">
            <div class="section-header">
                <h2 class="section-title">Latest Sermons</h2>
                <NuxtLink to="/media" class="view-all">Watch More →</NuxtLink>
            </div>

            <!-- Full empty state when no videos at all -->
            <EmptyState
                v-if="!videosLoading && !mainVideo"
                icon="mdi:video-off-outline"
                title="No Sermons Available"
                message="New messages will be posted soon. Stay tuned!"
                link-to="/media"
                link-label="Visit Media →"
            />

            <div class="media-layout" v-else :class="{ 'single-col': !videosLoading && sideVideos.length === 0 }">
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
                    <template v-else-if="sideVideos.length > 0">
                        <div class="sidebar-item" :class="{ active: mainVideo?.id === v.id }" v-for="v in sideVideos"
                            :key="v.id" @click="selectVideo(v)">
                            <img :src="v.thumbnail_url || 'https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?w=120&h=80&fit=crop'"
                                :alt="v.title" />
                            <div>
                                <h4>{{ v.title }}</h4>
                                <p>{{ v.user ? `${v.user.first_name} ${v.user.last_name}` : '' }} · {{
                                    formatVideoDate(v.published_at) }}</p>
                            </div>
                        </div>
                    </template>
                    <EmptyState
                        v-else
                        icon="mdi:playlist-check"
                        title="You're all caught up"
                        message="No other videos right now."
                    />
                </div>
            </div>
        </div>
    </section>
</template>

<script setup lang="ts">
import { useAppResourceInfoStore } from '~/stores/appResourceInfo';
import type { VideoListResponse } from '~/types/api';
import type { VideoLink } from '~/types/models';

const { get } = useApi();
const store = useAppResourceInfoStore();

const videosLoading = ref(true);
const mainVideo = ref<VideoLink | null>(null);
const sideVideos = ref<VideoLink[]>([]);
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

const formatVideoDate = (dateStr?: string | null): string => {
    if (!dateStr) return '';
    return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
};

onMounted(async () => {
    try {
        const response = await get<VideoListResponse>('/videos', { per_page: 5 });
        const videos = response.data?.data ?? [];
        mainVideo.value = videos[0] ?? null;
        sideVideos.value = videos.slice(1);
        store.videos = videos;
    } catch (e) {
        console.error('Failed to load videos:', e);
    } finally {
        videosLoading.value = false;
        store.videosLoading = false;
    }
});
</script>

<style scoped>
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

.media-layout.single-col {
    grid-template-columns: 1fr;
    max-width: 760px;
    margin: 0 auto;
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

@media (max-width: 768px) {
    .media-layout {
        grid-template-columns: 1fr;
    }
}
</style>
