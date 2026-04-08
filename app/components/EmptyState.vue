<template>
    <div class="empty-state">
        <div class="es-icon">
            <Icon :name="icon" />
        </div>
        <h3 class="es-title">{{ title }}</h3>
        <p class="es-message">{{ message }}</p>
        <NuxtLink v-if="linkTo && linkLabel" :to="linkTo" class="es-cta">
            {{ linkLabel }}
        </NuxtLink>
    </div>
</template>

<script setup lang="ts">
defineProps<{
    icon: string;
    title: string;
    message: string;
    linkTo?: string;
    linkLabel?: string;
}>();
</script>

<style scoped>
.empty-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-align: center;
    padding: 3rem 1.5rem;
    width: 100%;
}

.es-icon {
    font-size: 3.5rem;
    color: var(--lc-gold);
    opacity: 0.6;
    margin-bottom: 1rem;
    line-height: 1;
}

.es-title {
    font-size: 1.1rem;
    font-weight: 700;
    color: var(--lc-dark);
    margin: 0 0 0.5rem;
}

.es-message {
    font-size: 0.875rem;
    color: #999;
    max-width: 280px;
    line-height: 1.6;
    margin: 0 0 1.25rem;
}

.es-cta {
    display: inline-block;
    padding: 8px 20px;
    background: var(--lc-dark);
    color: #fff;
    border-radius: 6px;
    font-size: 0.82rem;
    font-weight: 700;
    text-decoration: none;
    transition: background 0.2s;
}

.es-cta:hover {
    background: var(--lc-gold);
}
</style>
