<template>
    <section class="ministries">
        <div class="container">
            <div class="section-header">
                <h2 class="section-title">Our Ministries</h2>
                <NuxtLink to="/ministries" class="view-all">Explore All →</NuxtLink>
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
</template>

<script setup lang="ts">
const ministries = [
    { title: 'Worship Ministry', desc: 'Leading hearts to God through music and praise.', img: 'https://images.unsplash.com/photo-1415201364774-f6f0bb35f28f?w=400&h=280&fit=crop' },
    { title: 'Children\'s Church', desc: 'Nurturing young hearts in the ways of God.', img: 'https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=400&h=280&fit=crop' },
    { title: 'Media Team', desc: 'Capturing and broadcasting the move of God to the world.', img: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=400&h=280&fit=crop' },
    { title: 'Prayer Ministry', desc: 'Interceding for individuals, families and nations.', img: 'https://images.unsplash.com/photo-1545987796-200677ee1011?w=400&h=280&fit=crop' },
    { title: 'Medical Team', desc: 'Bringing healing and free medical care to communities in need.', img: 'https://images.unsplash.com/photo-1584820927498-cfe5211fd8bf?w=400&h=280&fit=crop' },
    { title: 'Ushering Ministry', desc: 'Creating a warm and welcoming atmosphere for every worshipper.', img: 'https://images.unsplash.com/photo-1511578314322-379afb476865?w=400&h=280&fit=crop' },
];
</script>

<style scoped>
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

@media (max-width: 1024px) {
    .ministries-grid {
        grid-template-columns: repeat(2, 1fr);
    }
}

@media (max-width: 768px) {
    .ministries-grid {
        grid-template-columns: repeat(2, 1fr);
    }
}

@media (max-width: 480px) {
    .ministries-grid {
        grid-template-columns: 1fr;
    }
}
</style>
