<template>
    <div class="page-wrapper">
        <NavBar />

        <!-- Page Hero -->
        <section class="page-hero">
            <div class="ph-overlay"></div>
            <img src="https://images.unsplash.com/photo-1511578314322-379afb476865?w=1920&h=400&fit=crop"
                alt="Our Ministries" class="ph-bg" />
            <div class="ph-content">
                <p class="ph-label">Serving Together</p>
                <h1>Our Ministries</h1>
                <p class="ph-sub">Every member has a place to serve. Find where you belong.</p>
            </div>
        </section>

        <!-- Intro -->
        <section class="min-intro-section">
            <div class="container">
                <p>Light City Evangelical Center is built on the strength of its teams — dedicated men and women who
                    give their time, gifts, and passion to ensure that every service, outreach, and program runs
                    effectively. Each ministry plays a vital role in fulfilling our mission to reach the unreached and
                    build up the Body of Christ.</p>
            </div>
        </section>

        <!-- Ministry Grid -->
        <section class="min-grid-section">
            <div class="container">
                <div class="min-grid">
                    <div class="min-card" v-for="m in ministries" :key="m.title">
                        <img :src="m.img" :alt="m.title" loading="lazy" />
                        <div class="min-overlay">
                            <Icon :name="m.icon" class="min-icon" />
                            <h3>{{ m.title }}</h3>
                            <p>{{ m.desc }}</p>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <!-- CTA -->
        <section class="min-cta-section">
            <div class="container">
                <div class="min-cta-box">
                    <h2>Ready to Serve?</h2>
                    <p>We'd love to have you join one of our ministry teams. Reach out to us and let's find the perfect
                        place for your gifts.</p>
                    <NuxtLink to="/contact" class="btn-cta">Get In Touch →</NuxtLink>
                </div>
            </div>
        </section>

        <AppFooter />
    </div>
</template>

<script setup lang="ts">
useHead({
    title: 'Our Ministries | Light City Evangelical Center',
    meta: [
        {
            name: 'description',
            content: 'Discover the ministry teams of Light City Evangelical Center — from Worship to Medical, Media to Evangelism. Find your place to serve God and community.',
        },
    ],
});

const ministries = [
    {
        title: 'Worship Ministry',
        desc: 'Leading hearts to God through music, praise, and Spirit-filled worship experiences.',
        icon: 'mdi:music-note',
        img: 'https://images.unsplash.com/photo-1415201364774-f6f0bb35f28f?w=500&h=360&fit=crop',
    },
    {
        title: "Children's Church",
        desc: "Nurturing young hearts in the ways of God through fun, engaging, and bible-centred programs.",
        icon: 'mdi:baby-face-outline',
        img: 'https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=500&h=360&fit=crop',
    },
    {
        title: 'Media Team',
        desc: 'Capturing and broadcasting the move of God to audiences near and far through visual storytelling.',
        icon: 'mdi:camera',
        img: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=500&h=360&fit=crop',
    },
    {
        title: 'Prayer Ministry',
        desc: 'Standing in the gap through intercession, warfare prayer, and Spirit-led prophetic sessions.',
        icon: 'mdi:hands-pray',
        img: 'https://images.unsplash.com/photo-1545987796-200677ee1011?w=500&h=360&fit=crop',
    },
    {
        title: 'Medical Team',
        desc: 'Bringing healing and free medical care to communities in need during outreaches and programs.',
        icon: 'mdi:medical-bag',
        img: 'https://images.unsplash.com/photo-1584820927498-cfe5211fd8bf?w=500&h=360&fit=crop',
    },
    {
        title: 'Ushering Ministry',
        desc: 'Creating a warm, orderly, and welcoming atmosphere for every worshipper who walks through our doors.',
        icon: 'mdi:human-greeting',
        img: 'https://images.unsplash.com/photo-1511578314322-379afb476865?w=500&h=360&fit=crop',
    },
    {
        title: 'Evangelical Ministry',
        desc: 'Taking the true and unadulterated gospel into streets, villages, schools, and forgotten communities.',
        icon: 'mdi:bullhorn',
        img: 'https://images.unsplash.com/photo-1504052434569-70ad5836ab65?w=500&h=360&fit=crop',
    },
    {
        title: 'Protocol Team',
        desc: 'Ensuring excellence and order in hosting guests, dignitaries, and leadership with professionalism.',
        icon: 'mdi:badge-account-horizontal',
        img: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=500&h=360&fit=crop',
    },
    {
        title: 'Security Team',
        desc: 'Safeguarding lives and property during services and events to ensure a secure environment for all.',
        icon: 'mdi:shield-account',
        img: 'https://images.unsplash.com/photo-1590402494756-1fc0b18b6c09?w=500&h=360&fit=crop',
    },
    {
        title: 'Welfare Team',
        desc: 'Caring for the physical, emotional, and social needs of members and visitors with compassion.',
        icon: 'mdi:hand-heart',
        img: 'https://images.unsplash.com/photo-1593113598332-cd59a0c3a9a1?w=500&h=360&fit=crop',
    },
    {
        title: 'Accounting Team',
        desc: 'Maintaining financial integrity, transparency, and stewardship of every resource entrusted to us.',
        icon: 'mdi:calculator-variant',
        img: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=500&h=360&fit=crop',
    },
    {
        title: 'Electrical Team',
        desc: 'Powering the house of God — managing lighting, electrical systems, and technical infrastructure.',
        icon: 'mdi:lightning-bolt',
        img: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=500&h=360&fit=crop',
    },
    {
        title: 'Sound Team',
        desc: 'Delivering crystal-clear audio for worship, preaching, and events so every word and note is heard.',
        icon: 'mdi:equalizer',
        img: 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=500&h=360&fit=crop',
    },
];
</script>

<style scoped>
/* ── Hero (reuses page-wide classes) ── */
.page-hero {
    position: relative;
    height: 340px;
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
}

.ph-overlay {
    position: absolute;
    inset: 0;
    background: linear-gradient(135deg, rgba(26, 14, 8, 0.82) 0%, rgba(224, 86, 21, 0.55) 100%);
    z-index: 1;
}

.ph-bg {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.ph-content {
    position: relative;
    z-index: 2;
    text-align: center;
    color: #fff;
    padding: 0 1.5rem;
}

.ph-label {
    font-size: 0.8rem;
    font-weight: 700;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: var(--lc-gold);
    margin: 0 0 0.5rem;
}

.ph-content h1 {
    font-size: clamp(2rem, 5vw, 3rem);
    font-weight: 900;
    margin: 0 0 0.75rem;
    line-height: 1.1;
}

.ph-sub {
    font-size: 1rem;
    color: rgba(255, 255, 255, 0.82);
    margin: 0;
}

/* ── Intro ── */
.min-intro-section {
    padding: 3rem 0 0;
    background: #fff;
}

.min-intro-section p {
    max-width: 760px;
    margin: 0 auto;
    text-align: center;
    color: #555;
    font-size: 1rem;
    line-height: 1.85;
}

/* ── Grid ── */
.min-grid-section {
    padding: 3rem 0 5rem;
    background: #fff;
}

.min-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 1.25rem;
}

.min-card {
    position: relative;
    border-radius: 10px;
    overflow: hidden;
    aspect-ratio: 4/3;
    cursor: default;
}

.min-card img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.4s;
    display: block;
}

.min-card:hover img {
    transform: scale(1.07);
}

.min-overlay {
    position: absolute;
    inset: 0;
    background: linear-gradient(to top, rgba(10, 10, 30, 0.88) 50%, transparent);
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    padding: 1.1rem;
    transition: background 0.3s;
}

.min-card:hover .min-overlay {
    background: linear-gradient(to top, rgba(10, 10, 30, 0.95) 70%, transparent);
}

.min-icon {
    font-size: 1.4rem;
    color: var(--lc-gold);
    margin-bottom: 0.35rem;
}

.min-overlay h3 {
    color: #fff;
    font-size: 0.95rem;
    font-weight: 700;
    margin: 0 0 0.3rem;
}

.min-overlay p {
    color: rgba(255, 255, 255, 0.72);
    font-size: 0.78rem;
    line-height: 1.45;
    margin: 0;
}

/* ── CTA ── */
.min-cta-section {
    padding: 4rem 0;
    background: #f9f9fb;
}

.min-cta-box {
    max-width: 620px;
    margin: 0 auto;
    text-align: center;
}

.min-cta-box h2 {
    font-size: 1.75rem;
    font-weight: 900;
    color: var(--lc-dark);
    margin: 0 0 0.75rem;
}

.min-cta-box p {
    color: #666;
    font-size: 0.95rem;
    line-height: 1.7;
    margin: 0 0 1.75rem;
}

.btn-cta {
    display: inline-block;
    padding: 0.8rem 2.25rem;
    background: var(--lc-gold);
    color: #fff;
    font-weight: 700;
    font-size: 0.9rem;
    border-radius: 8px;
    text-decoration: none;
    transition: background 0.2s;
}

.btn-cta:hover {
    background: var(--lc-gold-hover, #B84410);
}

/* ── Responsive ── */
@media (max-width: 1200px) {
    .min-grid {
        grid-template-columns: repeat(3, 1fr);
    }
}

@media (max-width: 768px) {
    .min-grid {
        grid-template-columns: repeat(2, 1fr);
    }
}

@media (max-width: 480px) {
    .min-grid {
        grid-template-columns: 1fr;
    }
}
</style>
