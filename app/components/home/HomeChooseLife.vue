<template>
    <section class="choose-life">
        <div class="cl-overlay"></div>
        <img src="https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=1920&h=500&fit=crop" alt="Choose Life"
            class="cl-bg" />
        <div class="cl-content">
            <h2>CHOOSE LIFE</h2>
            <div class="cl-cross">✝</div>
            <p>
                For God so loved the world that he gave his one and only Son, that whoever believes in him shall not
                perish but have eternal life. We invite you to make that choice today — a choice that will change
                your life forever and give it new meaning, purpose and direction.
            </p>
            <NuxtLink to="/about" class="btn btn-gold">Make A Decision Today</NuxtLink>
        </div>
    </section>
</template>

<style scoped>
/* ───── Choose Life ───── */
.choose-life {
    position: relative;
    padding: 6rem 24px;
    display: flex;
    align-items: center;
    justify-content: center;
    text-align: center;
    overflow: hidden;
    min-height: 420px;
}

.cl-bg {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
    z-index: 0;
}

.cl-overlay {
    position: absolute;
    inset: 0;
    background: rgba(15, 10, 40, 0.78);
    z-index: 1;
}

.cl-content {
    position: relative;
    z-index: 2;
    max-width: 720px;
}

.cl-content h2 {
    font-size: clamp(2.5rem, 5vw, 3.5rem);
    font-weight: 900;
    color: #fff;
    letter-spacing: 0.12em;
    margin-bottom: 0.5rem;
}

.cl-cross {
    font-size: 3rem;
    color: var(--lc-gold);
    margin: 0.5rem 0 1.5rem;
}

.cl-content p {
    color: rgba(255, 255, 255, 0.8);
    font-size: 1rem;
    line-height: 1.8;
    margin-bottom: 2rem;
}
</style>
