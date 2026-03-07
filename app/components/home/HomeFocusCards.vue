<template>
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
</template>

<script setup lang="ts">
const focusCards = [
    { title: 'Prayer Request', desc: 'Submit your prayer requests and our team will pray with you.', icon: 'mdi:hands-pray', link: '/contact', cta: 'Submit a Request' },
    { title: 'New Members', desc: 'Begin your journey with us. We\'d love to welcome you home.', icon: 'mdi:account-heart', link: '/about', cta: 'Get Started' },
    { title: 'Give Online', desc: 'Support the work of God\'s kingdom through your generous giving.', icon: 'mdi:hand-heart', link: '/give', cta: 'Give Now' },
];
</script>

<style scoped>
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

@media (max-width: 768px) {
    .focus-grid {
        grid-template-columns: 1fr;
    }
}
</style>
