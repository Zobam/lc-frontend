<template>
    <div class="page-wrapper">
        <NavBar />

        <!-- Page Hero -->
        <section class="page-hero">
            <div class="ph-overlay"></div>
            <img src="https://images.unsplash.com/photo-1501386761578-eaa54b9b3b28?w=1920&h=400&fit=crop" alt="Events"
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
                <div class="filter-bar">
                    <button v-for="cat in categories" :key="cat" class="filter-btn"
                        :class="{ active: activeFilter === cat }" @click="activeFilter = cat">{{ cat }}</button>
                </div>

                <div class="events-grid">
                    <div class="event-card" v-for="event in filteredEvents" :key="event.title">
                        <div class="event-img">
                            <img :src="event.img" :alt="event.title" />
                            <span class="event-category">{{ event.category }}</span>
                        </div>
                        <div class="event-body">
                            <div class="event-date-badge">
                                <strong>{{ event.day }}</strong>
                                <span>{{ event.month }}</span>
                            </div>
                            <div class="event-info">
                                <h3>{{ event.title }}</h3>
                                <p class="event-meta">
                                    <Icon name="mdi:clock-outline" /> {{ event.time }}
                                </p>
                                <p class="event-meta">
                                    <Icon name="mdi:map-marker" /> {{ event.location }}
                                </p>
                                <p class="event-desc">{{ event.desc }}</p>
                                <a href="#" class="btn-register">Register Free</a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <AppFooter />
    </div>
</template>

<script setup lang="ts">
const categories = ['All', 'Worship', 'Youth', 'Outreach', 'Conference'];
const activeFilter = ref('All');

const events = [
    { title: 'Praise Carnival 2026', day: '15', month: 'FEB', time: 'Saturday, 6:00 PM', location: 'Main Auditorium', category: 'Worship', desc: 'A grand night of music, worship, and thanksgiving to God.', img: 'https://images.unsplash.com/photo-1429962714451-bb934ecdc4ec?w=500&h=280&fit=crop' },
    { title: 'Holy Ghost Night', day: '28', month: 'FEB', time: 'Friday, 9:00 PM – Dawn', location: 'Main Auditorium', category: 'Worship', desc: 'An all-night prayer and worship experience.', img: 'https://images.unsplash.com/photo-1508997449629-303059a039c0?w=500&h=280&fit=crop' },
    { title: 'Youth Summit 2026', day: '15', month: 'MAR', time: 'Sat. & Sun., 10:00 AM', location: 'Youth Hall', category: 'Youth', desc: 'Empowering the next generation for kingdom assignment.', img: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=500&h=280&fit=crop' },
    { title: 'Community Outreach', day: '07', month: 'MAR', time: 'Saturday, 9:00 AM', location: 'City Centre', category: 'Outreach', desc: 'Join us as we serve our local community with food and prayer.', img: 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=500&h=280&fit=crop' },
    { title: 'Annual Convention', day: '20', month: 'MAR', time: 'Fri–Sun, All Day', location: 'Convention Centre', category: 'Conference', desc: 'Three days of intensive teaching, worship, and networking.', img: 'https://images.unsplash.com/photo-1517457373958-b7bdd4587205?w=500&h=280&fit=crop' },
    { title: 'Marriage Enrichment', day: '29', month: 'MAR', time: 'Saturday, 2:00 PM', location: 'Family Hall', category: 'Conference', desc: 'Strengthen your marriage with biblical principles and practical tools.', img: 'https://images.unsplash.com/photo-1606788075761-a6a9f8f51bd2?w=500&h=280&fit=crop' },
];

const filteredEvents = computed(() =>
    activeFilter.value === 'All' ? events : events.filter(e => e.category === activeFilter.value)
);
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
    transition: background 0.2s;
}

.btn-register:hover {
    background: var(--lc-gold-hover);
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
