<template>
    <section class="gallery-strip">
        <div class="container gallery-inner">
            <div class="gallery-featured">
                <Transition name="gallery-fade">
                    <img :key="activeGalleryImg.src" :src="activeGalleryImg.src" :alt="activeGalleryImg.alt"
                        class="gallery-featured-img" />
                </Transition>
                <div class="gallery-featured-caption">{{ activeGalleryImg.alt }}</div>
            </div>
            <div class="gallery-grid">
                <div v-for="img in galleryImages" :key="img.src" class="gallery-item"
                    :class="{ active: activeGalleryImg.src === img.src }" @click="activeGalleryImg = img">
                    <img :src="img.src" :alt="img.alt" />
                </div>
            </div>
        </div>
    </section>
</template>

<script setup lang="ts">
const galleryImages = [
    { src: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=1200&h=600&fit=crop', alt: 'Sunday Worship Service' },
    { src: 'https://images.unsplash.com/photo-1438032005730-c779502df39b?w=1200&h=600&fit=crop', alt: 'Community Fellowship' },
    { src: 'https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?w=1200&h=600&fit=crop', alt: 'Midweek Bible Study' },
    { src: 'https://images.unsplash.com/photo-1494522855154-9297ac14b55f?w=1200&h=600&fit=crop', alt: 'Prayer Night' },
    { src: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=1200&h=600&fit=crop', alt: 'Youth Summit' },
    { src: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=1200&h=600&fit=crop', alt: 'Women\'s Ministry' },
];

const activeGalleryImg = ref(galleryImages[0]!);
</script>

<style scoped>
/* ───── Gallery Strip ───── */
.gallery-strip {
    background: #0f0f1e;
}

/* Featured preview */
.gallery-featured {
    position: relative;
    width: 100%;
    height: 480px;
    overflow: hidden;
}

.gallery-featured-img {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
}

.gallery-featured-caption {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    padding: 1rem 1.5rem;
    background: linear-gradient(to top, rgba(0, 0, 0, 0.75) 80%, transparent);
    color: #fff;
    font-size: 0.9rem;
    font-weight: 600;
    letter-spacing: 0.04em;
    text-transform: uppercase;
}

/* Fade transition for featured image */
.gallery-fade-enter-active,
.gallery-fade-leave-active {
    transition: opacity 0.4s ease;
    position: absolute;
    inset: 0;
}

.gallery-fade-enter-from,
.gallery-fade-leave-to {
    opacity: 0;
}

/* Thumbnail grid */
.gallery-grid {
    display: grid;
    grid-template-columns: repeat(6, 1fr);
}

.gallery-item {
    overflow: hidden;
    aspect-ratio: 4/3;
    cursor: pointer;
    position: relative;
}

.gallery-item::after {
    content: '';
    position: absolute;
    inset: 0;
    border: 3px solid transparent;
    transition: border-color 0.2s, background 0.2s;
    pointer-events: none;
}

.gallery-item.active::after {
    border-color: var(--lc-gold);
    background: rgba(224, 86, 21, 0.15);
}

.gallery-item img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.4s, opacity 0.3s;
    opacity: 0.65;
}

.gallery-item:hover img,
.gallery-item.active img {
    transform: scale(1.08);
    opacity: 1;
}

@media (max-width: 1024px) {
    .gallery-grid {
        grid-template-columns: repeat(3, 1fr);
    }
}

@media (max-width: 768px) {
    .gallery-grid {
        grid-template-columns: repeat(2, 1fr);
    }

    .gallery-inner {
        max-width: 100%;
        padding: 0;
    }
}
</style>
