<template>
    <footer class="site-footer">
        <div class="footer-main">
            <div class="footer-inner">
                <!-- Brand -->
                <div class="footer-brand">
                    <div class="footer-logo">
                        <div class="logo-circle">
                            <Icon name="mdi:church" class="logo-icon" />
                        </div>
                        <span class="logo-text">Light City</span>
                    </div>
                    <p class="footer-tagline">Giving Your Life a Meaning.<br>A community of believers growing together
                        in faith, love, and purpose.</p>
                    <div class="footer-socials">
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
                </div>

                <!-- Nav -->
                <div class="footer-col">
                    <h4>Quick Links</h4>
                    <ul>
                        <li>
                            <NuxtLink to="/">Home</NuxtLink>
                        </li>
                        <li>
                            <NuxtLink to="/about">About Us</NuxtLink>
                        </li>
                        <li>
                            <NuxtLink to="/events">Events</NuxtLink>
                        </li>
                        <li>
                            <NuxtLink to="/media">Media</NuxtLink>
                        </li>
                        <li>
                            <NuxtLink to="/give">Give</NuxtLink>
                        </li>
                        <li>
                            <NuxtLink to="/contact">Contact</NuxtLink>
                        </li>
                    </ul>
                </div>

                <!-- Service Times -->
                <div class="footer-col">
                    <h4>Service Times</h4>
                    <ul>
                        <li>Sunday — 9:00 AM &amp; 11:00 AM</li>
                        <li>Wednesday — 7:00 PM</li>
                        <li>Friday Youth — 6:00 PM</li>
                    </ul>
                </div>

                <!-- Contact -->
                <div class="footer-col">
                    <h4>Contact Us</h4>
                    <ul>
                        <li>
                            <Icon name="mdi:map-marker" /> 123 Faith Street, Light City
                        </li>
                        <li>
                            <Icon name="mdi:phone" /> (555) 123-4567
                        </li>
                        <li>
                            <Icon name="mdi:email" /> info@lightcity.org
                        </li>
                    </ul>
                </div>
            </div>
        </div>

        <div class="footer-bottom">
            <div class="footer-bottom-inner">
                <p>&copy; {{ new Date().getFullYear() }} Light City Evangelical Collective. All rights reserved.</p>
                <p>Built with love &amp; faith.</p>
            </div>
        </div>
    </footer>
</template>

<style scoped>
.site-footer {
    background: var(--lc-dark);
    color: #ccc;
    font-size: 0.9rem;
}

.footer-main {
    padding: 4rem 0 2rem;
}

.footer-inner {
    max-width: 1280px;
    margin: 0 auto;
    padding: 0 24px;
    display: grid;
    grid-template-columns: 2fr 1fr 1fr 1fr;
    gap: 3rem;
}

.footer-logo {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-bottom: 1rem;
}

.logo-circle {
    width: 42px;
    height: 42px;
    border-radius: 50%;
    background: linear-gradient(135deg, #4a3f8f, var(--lc-gold));
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
}

.logo-icon {
    color: #fff;
    font-size: 1.4rem;
}

.logo-text {
    font-size: 1.25rem;
    font-weight: 800;
    color: #fff;
}

.footer-tagline {
    line-height: 1.7;
    color: #aaa;
    margin-bottom: 1.25rem;
    font-size: 0.85rem;
}

.footer-socials {
    display: flex;
    gap: 12px;
}

.footer-socials a {
    width: 36px;
    height: 36px;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.08);
    display: flex;
    align-items: center;
    justify-content: center;
    color: #ccc;
    text-decoration: none;
    font-size: 1.1rem;
    transition: all 0.2s;
}

.footer-socials a:hover {
    background: var(--lc-gold);
    color: #fff;
}

.footer-col h4 {
    color: #fff;
    font-size: 1rem;
    font-weight: 700;
    margin-bottom: 1.25rem;
    padding-bottom: 0.5rem;
    border-bottom: 2px solid var(--lc-gold);
    display: inline-block;
}

.footer-col ul {
    list-style: none;
    padding: 0;
    margin: 0;
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
}

.footer-col ul li {
    display: flex;
    align-items: center;
    gap: 6px;
    color: #aaa;
}

.footer-col ul li .iconify {
    color: var(--lc-gold);
    font-size: 1rem;
    flex-shrink: 0;
}

.footer-col a {
    color: #aaa;
    text-decoration: none;
    transition: color 0.2s;
}

.footer-col a:hover {
    color: var(--lc-gold);
}

.footer-bottom {
    border-top: 1px solid rgba(255, 255, 255, 0.08);
    padding: 1.25rem 0;
}

.footer-bottom-inner {
    max-width: 1280px;
    margin: 0 auto;
    padding: 0 24px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap;
    gap: 0.5rem;
}

.footer-bottom p {
    font-size: 0.8rem;
    color: #777;
    margin: 0;
}

@media (max-width: 900px) {
    .footer-inner {
        grid-template-columns: 1fr 1fr;
        gap: 2rem;
    }

    .footer-brand {
        grid-column: 1 / -1;
    }
}

@media (max-width: 540px) {
    .footer-inner {
        grid-template-columns: 1fr;
    }

    .footer-bottom-inner {
        flex-direction: column;
        text-align: center;
    }
}
</style>
