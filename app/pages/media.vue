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
                    <div class="featured-video">
                        <div class="video-wrap">
                            <img src="https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?w=800&h=450&fit=crop"
                                alt="Latest sermon" />
                            <a href="#" class="play-btn" aria-label="Play">
                                <Icon name="mdi:play-circle" />
                            </a>
                        </div>
                        <h3>The Power of Faith — Sunday Service</h3>
                        <p class="sermon-meta">Pastor John Adeyemi &nbsp;·&nbsp; Feb 23, 2026 &nbsp;·&nbsp; 58 min</p>
                    </div>
                    <div class="featured-aside">
                        <h4>Up Next</h4>
                        <div class="mini-sermon" v-for="s in upNext" :key="s.title">
                            <img :src="s.img" :alt="s.title" />
                            <div>
                                <h5>{{ s.title }}</h5>
                                <p>{{ s.speaker }} · {{ s.date }}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <!-- Sermon Archive -->
        <section class="archive-section">
            <div class="container">
                <div class="archive-header">
                    <h2 class="section-title">Sermon Archive</h2>
                    <div class="archive-filters">
                        <select class="filter-select" v-model="selectedSeries">
                            <option value="">All Series</option>
                            <option>Faith Foundations</option>
                            <option>The Grace Life</option>
                            <option>Kingdom Purpose</option>
                        </select>
                    </div>
                </div>
                <div class="archive-grid">
                    <div class="sermon-card" v-for="s in sermons" :key="s.title">
                        <div class="sc-thumb">
                            <img :src="s.img" :alt="s.title" />
                            <div class="sc-play">
                                <Icon name="mdi:play" />
                            </div>
                        </div>
                        <div class="sc-info">
                            <span class="sc-series">{{ s.series }}</span>
                            <h4>{{ s.title }}</h4>
                            <p>{{ s.speaker }} · {{ s.date }}</p>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <!-- Worship Playlist -->
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
        </section>

        <AppFooter />
    </div>
</template>

<script setup lang="ts">
const selectedSeries = ref('');

const upNext = [
    { title: 'Walking in God\'s Purpose', speaker: 'Bro James', date: 'Feb 16', img: 'https://images.unsplash.com/photo-1491438590914-bc09fcaaf77a?w=120&h=80&fit=crop' },
    { title: 'Unshakeable Faith', speaker: 'Sis Grace', date: 'Feb 9', img: 'https://images.unsplash.com/photo-1527525443983-6e60c75fff46?w=120&h=80&fit=crop' },
    { title: 'The Grace of God', speaker: 'Ptr John', date: 'Feb 2', img: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&h=80&fit=crop' },
];

const sermons = [
    { title: 'Strength in Weakness', speaker: 'Ptr Sarah', date: 'Jan 26', series: 'Faith Foundations', img: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=220&fit=crop' },
    { title: 'Living by Grace', speaker: 'Ptr John', date: 'Jan 19', series: 'The Grace Life', img: 'https://images.unsplash.com/photo-1545987796-200677ee1011?w=400&h=220&fit=crop' },
    { title: 'Finding Your Purpose', speaker: 'Bro James', date: 'Jan 12', series: 'Kingdom Purpose', img: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=220&fit=crop' },
    { title: 'The Power of Prayer', speaker: 'Sis Grace', date: 'Jan 5', series: 'Faith Foundations', img: 'https://images.unsplash.com/photo-1494522855154-9297ac14b55f?w=400&h=220&fit=crop' },
    { title: 'Unity in the Spirit', speaker: 'Ptr John', date: 'Dec 29', series: 'Kingdom Purpose', img: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=400&h=220&fit=crop' },
    { title: 'God\'s Unfailing Love', speaker: 'Ptr Sarah', date: 'Dec 22', series: 'The Grace Life', img: 'https://images.unsplash.com/photo-1508997449629-303059a039c0?w=400&h=220&fit=crop' },
];

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
</style>
