<template>
    <div class="font-[Segoe_UI,system-ui,sans-serif]">
        <NavBar />

        <!-- Loading State -->
        <div v-if="pending" class="max-w-[900px] mx-auto px-6 py-20">
            <div class="skeleton-hero mb-8"></div>
            <div class="skeleton-line long mb-4"></div>
            <div class="skeleton-line medium mb-4"></div>
            <div class="skeleton-line long mb-4"></div>
            <div class="skeleton-line medium"></div>
        </div>

        <!-- Error State -->
        <div v-else-if="error" class="max-w-[900px] mx-auto px-6 py-20 text-center">
            <Icon name="mdi:alert-circle-outline" class="text-6xl text-red-500 mb-4" />
            <h2 class="text-2xl font-bold mb-2">Post Not Found</h2>
            <p class="text-gray-600 mb-6">The post you're looking for doesn't exist or has been removed.</p>
            <NuxtLink to="/" class="inline-block px-6 py-3 bg-[var(--lc-gold)] text-white rounded-lg hover:opacity-90">
                Go Home
            </NuxtLink>
        </div>

        <!-- Post Content -->
        <article v-else-if="post" class="post-article">
            <!-- Hero Image -->
            <div class="post-hero">
                <img :src="post.featured_image?.image_url || 'https://images.unsplash.com/photo-1507692049790-de58290a4334?w=1200&h=600&fit=crop'"
                    :alt="post.featured_image?.alt_text || post.title" />
            </div>

            <div class="post-container">
                <!-- Category Badge -->
                <div class="post-meta-top">
                    <span class="post-category">{{ post.category }}</span>
                    <span class="post-reading-time">{{ post.reading_time }}</span>
                </div>

                <!-- Title & Subtitle -->
                <h1 class="post-title">{{ post.title }}</h1>
                <p v-if="post.subtitle" class="post-subtitle">{{ post.subtitle }}</p>

                <!-- Author & Date -->
                <div class="post-author-bar">
                    <div class="author-info">
                        <div class="author-avatar">
                            <Icon name="mdi:account-circle" />
                        </div>
                        <div>
                            <p class="author-name">{{ post.author?.first_name }} {{ post.author?.last_name }}</p>
                            <p class="post-date">{{ formatDate(post.published_at || post.created_at) }}</p>
                        </div>
                    </div>
                    <div class="post-stats">
                        <span>
                            <Icon name="mdi:eye-outline" /> {{ post.views }} views
                        </span>
                        <span>
                            <Icon name="mdi:comment-outline" /> {{ post.comments_count }} comments
                        </span>
                    </div>
                </div>

                <!-- Post Body -->
                <div class="post-body" v-html="post.body"></div>

                <!-- Tags -->
                <div v-if="post.tags?.length" class="post-tags">
                    <Icon name="mdi:tag-outline" />
                    <span v-for="tag in post.tags" :key="tag" class="tag">{{ tag }}</span>
                </div>

                <!-- Comments Section -->
                <div class="comments-section">
                    <h3 class="comments-title">Comments ({{ post.comments_count }})</h3>

                    <div v-if="post.approved_comments?.length" class="comments-list">
                        <div v-for="comment in post.approved_comments" :key="comment.id" class="comment-card">
                            <div class="comment-avatar">
                                <Icon name="mdi:account-circle" />
                            </div>
                            <div class="comment-content">
                                <p class="comment-author">{{ comment.user?.first_name }} {{ comment.user?.last_name }}
                                </p>
                                <p class="comment-date">{{ formatDate(comment.created_at) }}</p>
                                <p class="comment-text">{{ comment.content }}</p>
                            </div>
                        </div>
                    </div>

                    <div v-else class="no-comments">
                        <Icon name="mdi:comment-off-outline" />
                        <p>No comments yet. Be the first to comment!</p>
                    </div>
                </div>
            </div>
        </article>

        <AppFooter />
    </div>
</template>

<script setup lang="ts">
import type { Post } from '~/types/models';

const route = useRoute();
const { get } = useApi();

const slug = route.params.slug as string;

const { data: postData, pending, error } = await useAsyncData(
    `post-${slug}`,
    () => get<{ status: string; data: Post }>(`/posts/${slug}`)
);

const post = computed(() => postData.value?.data);

useHead({
    title: post.value ? `${post.value.title} | Light City` : 'Post | Light City',
    meta: [
        {
            name: 'description',
            content: post.value?.meta_description || post.value?.excerpt || '',
        },
    ],
});

const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });
};
</script>

<style scoped>
.post-article {
    background: #fff;
}

.post-hero {
    width: 100%;
    height: 400px;
    overflow: hidden;
    background: #f4f4f5;
}

.post-hero img {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.post-container {
    max-width: 800px;
    margin: 0 auto;
    padding: 3rem 1.5rem;
}

.post-meta-top {
    display: flex;
    align-items: center;
    gap: 1rem;
    margin-bottom: 1.5rem;
}

.post-category {
    display: inline-block;
    padding: 0.35rem 0.85rem;
    background: var(--lc-gold);
    color: #fff;
    font-size: 0.75rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    border-radius: 4px;
}

.post-reading-time {
    font-size: 0.85rem;
    color: #71717a;
    display: flex;
    align-items: center;
    gap: 0.25rem;
}

.post-title {
    font-size: 2.5rem;
    font-weight: 900;
    color: var(--lc-dark);
    line-height: 1.2;
    margin: 0 0 1rem;
}

.post-subtitle {
    font-size: 1.25rem;
    color: #52525b;
    line-height: 1.6;
    margin: 0 0 2rem;
}

.post-author-bar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 1.5rem 0;
    border-top: 1px solid #e4e4e7;
    border-bottom: 1px solid #e4e4e7;
    margin-bottom: 2.5rem;
}

.author-info {
    display: flex;
    align-items: center;
    gap: 0.75rem;
}

.author-avatar {
    font-size: 2.5rem;
    color: #a1a1aa;
}

.author-name {
    font-size: 0.95rem;
    font-weight: 700;
    color: var(--lc-dark);
    margin: 0;
}

.post-date {
    font-size: 0.8rem;
    color: #71717a;
    margin: 0;
}

.post-stats {
    display: flex;
    gap: 1.5rem;
    font-size: 0.85rem;
    color: #71717a;
}

.post-stats span {
    display: flex;
    align-items: center;
    gap: 0.35rem;
}

.post-body {
    font-size: 1.05rem;
    line-height: 1.8;
    color: #3f3f46;
    margin-bottom: 3rem;
}

.post-body :deep(p) {
    margin-bottom: 1.5rem;
}

.post-body :deep(h2) {
    font-size: 1.75rem;
    font-weight: 800;
    color: var(--lc-dark);
    margin: 2.5rem 0 1rem;
}

.post-body :deep(h3) {
    font-size: 1.4rem;
    font-weight: 700;
    color: var(--lc-dark);
    margin: 2rem 0 1rem;
}

.post-body :deep(ul),
.post-body :deep(ol) {
    margin: 1.5rem 0;
    padding-left: 2rem;
}

.post-body :deep(li) {
    margin-bottom: 0.5rem;
}

.post-body :deep(blockquote) {
    border-left: 4px solid var(--lc-gold);
    padding-left: 1.5rem;
    margin: 2rem 0;
    font-style: italic;
    color: #52525b;
}

.post-tags {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding: 1.5rem 0;
    border-top: 1px solid #e4e4e7;
    margin-bottom: 3rem;
    flex-wrap: wrap;
}

.post-tags> :first-child {
    font-size: 1.25rem;
    color: #a1a1aa;
}

.tag {
    padding: 0.35rem 0.75rem;
    background: #f4f4f5;
    color: #52525b;
    font-size: 0.8rem;
    font-weight: 600;
    border-radius: 4px;
}

.comments-section {
    padding-top: 2rem;
    border-top: 2px solid #e4e4e7;
}

.comments-title {
    font-size: 1.5rem;
    font-weight: 800;
    color: var(--lc-dark);
    margin: 0 0 2rem;
}

.comments-list {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
}

.comment-card {
    display: flex;
    gap: 1rem;
    padding: 1.25rem;
    background: #f9f9fb;
    border-radius: 8px;
}

.comment-avatar {
    font-size: 2.5rem;
    color: #a1a1aa;
    flex-shrink: 0;
}

.comment-content {
    flex: 1;
}

.comment-author {
    font-size: 0.95rem;
    font-weight: 700;
    color: var(--lc-dark);
    margin: 0 0 0.25rem;
}

.comment-date {
    font-size: 0.75rem;
    color: #71717a;
    margin: 0 0 0.75rem;
}

.comment-text {
    font-size: 0.95rem;
    line-height: 1.6;
    color: #52525b;
    margin: 0;
}

.no-comments {
    text-align: center;
    padding: 3rem;
    color: #a1a1aa;
}

.no-comments :first-child {
    font-size: 3rem;
    margin-bottom: 1rem;
}

.no-comments p {
    font-size: 0.95rem;
    margin: 0;
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
    height: 300px;
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
    .post-hero {
        height: 250px;
    }

    .post-title {
        font-size: 1.75rem;
    }

    .post-subtitle {
        font-size: 1rem;
    }

    .post-author-bar {
        flex-direction: column;
        align-items: flex-start;
        gap: 1rem;
    }

    .post-stats {
        width: 100%;
        justify-content: space-between;
    }

    .post-body {
        font-size: 1rem;
    }
}
</style>
