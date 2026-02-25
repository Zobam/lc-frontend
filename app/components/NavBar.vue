<template>
    <header class="site-header">
        <!-- Top utility bar -->
        <div class="topbar">
            <div class="topbar-inner">
                <div class="topbar-left">
                    <span>Follow us:</span>
                    <a href="#" aria-label="Facebook">
                        <Icon name="mdi:facebook" />
                    </a>
                    <a href="#" aria-label="YouTube">
                        <Icon name="mdi:youtube" />
                    </a>
                    <a href="#" aria-label="Instagram">
                        <Icon name="mdi:instagram" />
                    </a>
                    <a href="#" aria-label="Twitter">
                        <Icon name="mdi:twitter" />
                    </a>
                </div>
                <div class="topbar-right">
                    <span class="welcome-text">Welcome to Light City Evangelical Collective</span>
                </div>
            </div>
        </div>

        <!-- Main Navigation -->
        <nav class="navbar">
            <div class="nav-inner">
                <!-- Logo -->
                <NuxtLink to="/" class="nav-logo">
                    <div class="logo-circle">
                        <Icon name="mdi:church" class="logo-icon" />
                    </div>
                    <span class="logo-text">Light City</span>
                </NuxtLink>

                <!-- Desktop Nav Links -->
                <ul class="nav-links" :class="{ 'nav-open': menuOpen }">
                    <li>
                        <NuxtLink to="/" class="nav-link" @click="menuOpen = false">Home</NuxtLink>
                    </li>
                    <li>
                        <NuxtLink to="/about" class="nav-link" @click="menuOpen = false">About</NuxtLink>
                    </li>
                    <li>
                        <NuxtLink to="/events" class="nav-link" @click="menuOpen = false">Events</NuxtLink>
                    </li>
                    <li>
                        <NuxtLink to="/media" class="nav-link" @click="menuOpen = false">Media</NuxtLink>
                    </li>
                    <li>
                        <NuxtLink to="/give" class="nav-link nav-link-give" @click="menuOpen = false">Give</NuxtLink>
                    </li>
                    <li>
                        <NuxtLink to="/contact" class="nav-link" @click="menuOpen = false">Contact</NuxtLink>
                    </li>
                </ul>

                <!-- Hamburger -->
                <button class="hamburger" :class="{ 'is-open': menuOpen }" @click="menuOpen = !menuOpen"
                    aria-label="Toggle menu">
                    <span></span>
                    <span></span>
                    <span></span>
                </button>
            </div>
        </nav>
    </header>
</template>

<script setup lang="ts">
const menuOpen = ref(false);
</script>

<style scoped>
.site-header {
    position: sticky;
    top: 0;
    z-index: 1000;
    width: 100%;
}

/* Top Bar */
.topbar {
    background: #1a1a2e;
    padding: 6px 0;
}

.topbar-inner {
    max-width: 1280px;
    margin: 0 auto;
    padding: 0 24px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 1rem;
}

.topbar-left {
    display: flex;
    align-items: center;
    gap: 10px;
    color: #aaa;
    font-size: 0.75rem;
}

.topbar-left a {
    color: #aaa;
    text-decoration: none;
    font-size: 1rem;
    transition: color 0.2s;
}

.topbar-left a:hover {
    color: #c8a84b;
}

.topbar-right .welcome-text {
    color: #c8a84b;
    font-size: 0.75rem;
    font-weight: 500;
    font-style: italic;
}

/* Main Navbar */
.navbar {
    background: #ffffff;
    border-bottom: 3px solid #c8a84b;
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
}

.nav-inner {
    max-width: 1280px;
    margin: 0 auto;
    padding: 0 24px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 70px;
}

.nav-logo {
    display: flex;
    align-items: center;
    gap: 10px;
    text-decoration: none;
}

.logo-circle {
    width: 44px;
    height: 44px;
    border-radius: 50%;
    background: linear-gradient(135deg, #1a1a2e, #4a3f8f);
    display: flex;
    align-items: center;
    justify-content: center;
}

.logo-icon {
    color: #c8a84b;
    font-size: 1.5rem;
}

.logo-text {
    font-size: 1.3rem;
    font-weight: 800;
    color: #1a1a2e;
    letter-spacing: -0.5px;
}

.nav-links {
    list-style: none;
    display: flex;
    align-items: center;
    gap: 0.25rem;
    margin: 0;
    padding: 0;
}

.nav-link {
    display: inline-block;
    padding: 8px 14px;
    color: #333;
    text-decoration: none;
    font-weight: 600;
    font-size: 0.9rem;
    border-radius: 4px;
    transition: all 0.2s;
    position: relative;
}

.nav-link::after {
    content: '';
    position: absolute;
    bottom: 4px;
    left: 14px;
    right: 14px;
    height: 2px;
    background: #c8a84b;
    transform: scaleX(0);
    transition: transform 0.25s;
}

.nav-link:hover,
.nav-link.router-link-active {
    color: #c8a84b;
}

.nav-link:hover::after,
.nav-link.router-link-active::after {
    transform: scaleX(1);
}

.nav-link-give {
    background: #c8a84b;
    color: #fff !important;
    border-radius: 20px;
    padding: 8px 20px;
}

.nav-link-give::after {
    display: none;
}

.nav-link-give:hover {
    background: #a8883b;
    color: #fff !important;
    transform: translateY(-1px);
}

/* Hamburger */
.hamburger {
    display: none;
    flex-direction: column;
    gap: 5px;
    background: none;
    border: none;
    cursor: pointer;
    padding: 4px;
}

.hamburger span {
    display: block;
    width: 26px;
    height: 2px;
    background: #1a1a2e;
    border-radius: 2px;
    transition: all 0.3s;
}

.hamburger.is-open span:nth-child(1) {
    transform: translateY(7px) rotate(45deg);
}

.hamburger.is-open span:nth-child(2) {
    opacity: 0;
}

.hamburger.is-open span:nth-child(3) {
    transform: translateY(-7px) rotate(-45deg);
}

@media (max-width: 768px) {
    .topbar-right {
        display: none;
    }

    .hamburger {
        display: flex;
    }

    .nav-links {
        display: none;
        position: absolute;
        top: 100%;
        left: 0;
        right: 0;
        background: #fff;
        flex-direction: column;
        padding: 1rem;
        box-shadow: 0 8px 20px rgba(0, 0, 0, 0.12);
        border-top: 2px solid #c8a84b;
        gap: 0.25rem;
    }

    .nav-links.nav-open {
        display: flex;
    }

    .navbar {
        position: relative;
    }

    .nav-link {
        width: 100%;
        text-align: center;
        padding: 10px;
    }
}
</style>
