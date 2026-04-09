<template>
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
                <template v-else-if="wordsOfTheSpirit.length > 0">
                    <NuxtLink :to="`/posts/${w.slug}`" class="wos-card" v-for="w in wordsOfTheSpirit" :key="w.id">
                        <div class="wos-img">
                            <img :src="w.featured_image?.image_url || 'https://images.unsplash.com/photo-1507692049790-de58290a4334?w=400&h=260&fit=crop'"
                                :alt="w.featured_image?.alt_text || w.title" />
                        </div>
                        <div class="wos-body">
                            <h3>{{ w.title }}</h3>
                            <p>{{ w.excerpt || w.subtitle || '' }}</p>
                        </div>
                    </NuxtLink>
                </template>
                <EmptyState v-else icon="mdi:book-open-outline" title="No Devotionals Yet"
                    message="Devotional posts will appear here when published." style="grid-column: 1 / -1;" />
            </div>
        </div>
    </section>
</template>

<script setup lang="ts">
import type { PostCategoryListResponse } from '~/types/api';
import type { Post } from '~/types/models';

const { get } = useApi();

const { data: wosRes, status } = useQuery({
    key: ['home-devotionals'],
    query: () => get<PostCategoryListResponse>('/posts/category/devotional', { per_page: 8 }),
});

const wosLoading = computed(() => status.value === 'pending');
const wordsOfTheSpirit = computed(() => wosRes.value?.data.data ?? []);
</script>

<style scoped>
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
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.05);
    text-decoration: none;
    display: block;
    color: inherit;
}

.wos-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 10px 28px rgba(0, 0, 0, 0.15);
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

@media (max-width: 1024px) {
    .wos-grid {
        grid-template-columns: repeat(2, 1fr);
    }
}

@media (max-width: 768px) {
    .wos-grid {
        grid-template-columns: 1fr;
    }
}
</style>
