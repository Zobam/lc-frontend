<template>
    <div class="page-wrapper">
        <NavBar />

        <!-- Page Hero -->
        <section class="page-hero">
            <div class="ph-overlay"></div>
            <img src="https://images.unsplash.com/photo-1438032005730-c779502df39b?w=1920&h=400&fit=crop" alt="About Us"
                class="ph-bg" />
            <div class="ph-content">
                <p class="ph-label">Who We Are</p>
                <h1>About Light City</h1>
                <p class="ph-sub">A community of believers committed to loving God and making disciples.</p>
            </div>
        </section>

        <!-- Mission & Vision -->
        <section class="mv-section">
            <div class="container">
                <div class="mv-grid">
                    <div class="mv-card mission">
                        <div class="mv-icon">
                            <Icon name="mdi:target" />
                        </div>
                        <h3>Our Mission</h3>
                        <p>To create an environment where people can have a life-changing experience with God — where
                            every person is valued, loved, and equipped to fulfill their God-given purpose.</p>
                    </div>
                    <div class="mv-card vision">
                        <div class="mv-icon">
                            <Icon name="mdi:eye-outline" />
                        </div>
                        <h3>Our Vision</h3>
                        <p>A world transformed by the love of God — where communities are healed, families are restored,
                            and individuals walk in the fullness of God's plan for their lives.</p>
                    </div>
                    <div class="mv-card values">
                        <div class="mv-icon">
                            <Icon name="mdi:heart-outline" />
                        </div>
                        <h3>Our Values</h3>
                        <p>We are guided by Faith, Love, Integrity, Community, and Excellence in everything we do — from
                            worship to outreach, from leadership to service.</p>
                    </div>
                </div>
            </div>
        </section>

        <!-- Our Story -->
        <section class="story-section">
            <div class="container">
                <div class="story-grid">
                    <div class="story-img">
                        <img src="https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?w=600&h=450&fit=crop"
                            alt="Our Story" />
                    </div>
                    <div class="story-text">
                        <span class="section-label">Our Story</span>
                        <h2>How It All Began</h2>
                        <p>Light City Evangelical Collective was founded in 2014 with a small group of 12 believers who
                            gathered weekly in a living room, passionate about experiencing God's presence and sharing
                            His love with their community.</p>
                        <p>Over the years, God's grace has grown this fellowship into a vibrant, multi-generational
                            church family reaching thousands each week through our services, outreaches, and digital
                            platforms.</p>
                        <p>Today, we believe our best days are still ahead as we continue to build people, build
                            community, and build God's kingdom — one life at a time.</p>
                        <div class="story-stats">
                            <div class="ss">
                                <strong>10+</strong><span>Years</span>
                            </div>
                            <div class="ss">
                                <strong>5,000+</strong><span>Members</span>
                            </div>
                            <div class="ss">
                                <strong>3</strong><span>Locations</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <!-- Leadership -->
        <section class="leadership-section">
            <div class="container">
                <h2 class="section-title">Our Leadership</h2>
                <div class="leaders-grid">
                    <div class="leader-card" v-for="leader in leaders" :key="leader.name">
                        <div class="leader-img">
                            <img :src="leader.img" :alt="leader.name" />
                        </div>
                        <h4>{{ leader.name }}</h4>
                        <p>{{ leader.role }}</p>
                    </div>
                </div>
            </div>
        </section>

        <AppFooter />
    </div>
</template>

<script setup lang="ts">
const leaders = [
    { name: 'Pastor John Adeyemi', role: 'Senior Pastor', img: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop&facepad=2&faces=1' },
    { name: 'Pastor Sarah Adeyemi', role: 'Co-Pastor & Women\'s Lead', img: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=300&h=300&fit=crop' },
    { name: 'Bro James Mensah', role: 'Director of Worship', img: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&h=300&fit=crop' },
    { name: 'Sis Grace Okafor', role: 'Children\'s Ministry Lead', img: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=300&h=300&fit=crop' },
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
    font-size: 2rem;
    font-weight: 800;
    color: #1a1a2e;
    text-align: center;
    margin-bottom: 2.5rem;
}

.section-label {
    font-size: 0.78rem;
    font-weight: 700;
    letter-spacing: 0.15em;
    text-transform: uppercase;
    color: #c8a84b;
}

/* Page Hero */
.page-hero {
    position: relative;
    height: 340px;
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
    color: #c8a84b;
    font-size: 0.8rem;
    font-weight: 700;
    letter-spacing: 0.15em;
    text-transform: uppercase;
    margin-bottom: 0.5rem;
}

.ph-content h1 {
    font-size: 2.8rem;
    font-weight: 900;
    color: #fff;
    margin: 0 0 0.5rem;
}

.ph-sub {
    color: rgba(255, 255, 255, 0.75);
    font-size: 1rem;
    margin: 0;
}

/* Mission / Vision */
.mv-section {
    padding: 5rem 0;
    background: #f9f9fb;
}

.mv-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 1.75rem;
}

.mv-card {
    background: #fff;
    border-radius: 12px;
    padding: 2.25rem;
    box-shadow: 0 2px 16px rgba(0, 0, 0, 0.06);
    border-top: 4px solid #c8a84b;
    transition: transform 0.25s;
}

.mv-card:hover {
    transform: translateY(-4px);
}

.mv-icon {
    font-size: 2rem;
    color: #c8a84b;
    margin-bottom: 1rem;
}

.mv-card h3 {
    font-size: 1.1rem;
    font-weight: 800;
    color: #1a1a2e;
    margin-bottom: 0.75rem;
}

.mv-card p {
    color: #666;
    font-size: 0.9rem;
    line-height: 1.7;
    margin: 0;
}

/* Story */
.story-section {
    padding: 5rem 0;
    background: #fff;
}

.story-grid {
    display: grid;
    grid-template-columns: 1fr 1.2fr;
    gap: 4rem;
    align-items: center;
}

.story-img img {
    width: 100%;
    border-radius: 12px;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12);
}

.story-text h2 {
    font-size: 2rem;
    font-weight: 800;
    color: #1a1a2e;
    margin: 0.5rem 0 1.25rem;
}

.story-text p {
    color: #666;
    line-height: 1.8;
    font-size: 0.95rem;
    margin-bottom: 1rem;
}

.story-stats {
    display: flex;
    gap: 2rem;
    margin-top: 2rem;
    padding-top: 2rem;
    border-top: 1px solid #eee;
}

.ss {
    text-align: center;
}

.ss strong {
    display: block;
    font-size: 2rem;
    font-weight: 900;
    color: #c8a84b;
}

.ss span {
    font-size: 0.8rem;
    color: #999;
    font-weight: 600;
    text-transform: uppercase;
}

/* Leadership */
.leadership-section {
    padding: 5rem 0;
    background: #1a1a2e;
}

.leadership-section .section-title {
    color: #fff;
}

.leaders-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 1.5rem;
}

.leader-card {
    text-align: center;
}

.leader-img {
    width: 130px;
    height: 130px;
    border-radius: 50%;
    overflow: hidden;
    margin: 0 auto 1rem;
    border: 3px solid #c8a84b;
}

.leader-img img {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.leader-card h4 {
    color: #fff;
    font-weight: 700;
    margin-bottom: 0.25rem;
    font-size: 0.95rem;
}

.leader-card p {
    color: #c8a84b;
    font-size: 0.8rem;
    margin: 0;
}

@media (max-width: 900px) {
    .mv-grid {
        grid-template-columns: 1fr;
    }

    .story-grid {
        grid-template-columns: 1fr;
    }

    .leaders-grid {
        grid-template-columns: repeat(2, 1fr);
    }
}

@media (max-width: 560px) {
    .leaders-grid {
        grid-template-columns: repeat(2, 1fr);
    }
}
</style>
