<template>
    <section class="partnership">
        <div class="partnership-overlay"></div>
        <img src="https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=1920&h=600&fit=crop" alt="Partnership"
            class="partnership-bg" />
        <div class="container partnership-content">
            <div class="partnership-text">
                <h2>Partnership Impact</h2>
                <p>
                    The InnerCity Mission for Children envisions a world in which orphaned, deprived, and
                    vulnerable children in the inner cities live free of poverty and fulfill their God-given
                    potential, becoming responsible and self-reliant adults.
                </p>
                <div class="impact-stats">
                    <div class="stat">
                        <h3>500+</h3>
                        <p>Children Supported</p>
                    </div>
                    <div class="stat">
                        <h3>25</h3>
                        <p>Communities Reached</p>
                    </div>
                    <div class="stat">
                        <h3>10</h3>
                        <p>Years of Service</p>
                    </div>
                </div>
                <NuxtLink to="/give" class="btn btn-gold">Get Involved</NuxtLink>
            </div>
        </div>
    </section>
</template>

<style scoped>
/* ───── Partnership ───── */
.partnership {
    position: relative;
    padding: 5rem 0;
    overflow: hidden;
}

.partnership-bg {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
    z-index: 0;
}

.partnership-overlay {
    position: absolute;
    inset: 0;
    background: rgba(10, 10, 30, 0.82);
    z-index: 1;
}

.partnership-content {
    position: relative;
    z-index: 2;
    max-width: 620px;
}

.partnership-text h2 {
    font-size: 2rem;
    font-weight: 800;
    color: #fff;
    margin-bottom: 1rem;
}

.partnership-text>p {
    color: rgba(255, 255, 255, 0.78);
    font-size: 0.95rem;
    line-height: 1.8;
    margin-bottom: 2rem;
}

.impact-stats {
    display: flex;
    gap: 2.5rem;
    margin-bottom: 2.5rem;
}

.stat h3 {
    font-size: 2.5rem;
    font-weight: 900;
    color: var(--lc-gold);
    margin: 0;
}

.stat p {
    font-size: 0.8rem;
    color: rgba(255, 255, 255, 0.65);
    margin: 0.25rem 0 0;
}

@media (max-width: 768px) {
    .impact-stats {
        gap: 1.5rem;
        flex-wrap: wrap;
    }
}
</style>
