<template>
    <div class="homepage">
        <NavBar />

        <HomeHero />
        <HomeEvents />
        <HomeDevotionals />
        <HomeChooseLife />
        <HomeVideos />
        <HomePartnership />
        <HomeMinistries />
        <HomeFocusCards />
        <!-- <HomeGallery /> -->

        <AppFooter />
    </div>
</template>

<script setup lang="ts">
// All data fetching and static arrays have been moved to their respective
// section components in app/components/home/

useHead({
    title: "Welcome to Light City - a.k.a Onawork",
    meta: [
        {
            name: 'description',
            content: 'Light City Evangelical Center Int\'l — a vibrant community of believers in Enugu, Nigeria, committed to worship, discipleship, and spreading the Gospel to the ends of the earth.',
        },
    ],
});
</script>

<style>
/* ───── Globals for Homepage ───── */
*,
*::before,
*::after {
    box-sizing: border-box;
}

.homepage {
    font-family: 'Segoe UI', system-ui, sans-serif;
    background: #fff;
}

.container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 24px;
}

.section-title {
    font-size: 1.85rem;
    font-weight: 800;
    color: var(--lc-dark);
}

.section-header {
    display: flex;
    align-items: baseline;
    justify-content: space-between;
    margin-bottom: 2rem;
}

.view-all {
    color: var(--lc-gold);
    font-weight: 600;
    font-size: 0.9rem;
    text-decoration: none;
}

.view-all:hover {
    text-decoration: underline;
}

/* Buttons */
.btn {
    display: inline-block;
    padding: 12px 28px;
    border-radius: 4px;
    font-weight: 700;
    font-size: 0.9rem;
    text-decoration: none;
    cursor: pointer;
    border: 2px solid transparent;
    transition: all 0.25s;
}

.btn-gold {
    background: var(--lc-gold);
    color: #fff;
    border-color: var(--lc-gold);
}

.btn-gold:hover {
    background: var(--lc-gold-hover);
    border-color: var(--lc-gold-hover);
    transform: translateY(-2px);
}

.btn-outline-white {
    background: transparent;
    color: #fff;
    border-color: #fff;
}

.btn-outline-white:hover {
    background: rgba(255, 255, 255, 0.15);
}

.btn-gold-sm {
    display: inline-block;
    padding: 7px 18px;
    background: var(--lc-gold);
    color: #fff;
    border-radius: 4px;
    font-weight: 600;
    font-size: 0.8rem;
    text-decoration: none;
    transition: background 0.2s;
}

.btn-gold-sm:hover {
    background: var(--lc-gold-hover);
}

.btn-ghost {
    display: inline-block;
    margin-top: 0.75rem;
    color: var(--lc-gold);
    font-weight: 600;
    font-size: 0.85rem;
    text-decoration: none;
    border-bottom: 1px solid var(--lc-gold);
    padding-bottom: 1px;
    transition: opacity 0.2s;
}

.btn-ghost:hover {
    opacity: 0.7;
}
</style>