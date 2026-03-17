<script setup lang="ts">
const { data: session, signOut } = useAuth();

const route = useRoute();

const adminUser = computed(() => session.value as any);
const fullName = computed(() => {
    const u = adminUser.value;
    if (!u) return "Admin";
    return `${u.first_name ?? ""} ${u.last_name ?? ""}`.trim() || u.email || "Admin";
});

const initials = computed(() => {
    const u = adminUser.value;
    if (!u) return "A";
    const f = u.first_name?.[0] ?? "";
    const l = u.last_name?.[0] ?? "";
    return (f + l).toUpperCase() || "A";
});

const handleLogout = async () => {
    await signOut({ callbackUrl: "/auth/login" });
};

const navItems = [
    { label: "Dashboard", icon: "mdi:view-dashboard", to: "/admin" },
    { label: "Users", icon: "mdi:account-group", to: "/admin/users" },
    { label: "Events", icon: "mdi:calendar-star", to: "/admin/events" },
    { label: "Posts", icon: "mdi:newspaper-variant-outline", to: "/admin/posts" },
    // { label: "Albums", icon: "mdi:image-album", to: "/admin/albums" },
    { label: "Videos", icon: "mdi:youtube", to: "/admin/video-links" },
    { label: "Comments", icon: "mdi:comment-text-multiple", to: "/admin/comments" },
    { label: "Donations", icon: "mdi:hand-heart", to: "/admin/donations" },
];

const sidebarOpen = ref(false);
const isActive = (to: string) => {
    if (to === "/admin") return route.path === "/admin";
    return route.path.startsWith(to);
};
</script>

<template>
    <div class="admin-shell">
        <!-- Mobile guard overlay -->
        <div class="mobile-guard">
            <div class="mobile-guard-card">
                <Icon name="mdi:monitor-dashboard" class="mobile-guard-icon" />
                <h2>Best Viewed on Larger Screens</h2>
                <p>
                    The admin panel is designed for tablets, laptops and desktop computers.
                    Please switch to a larger device for the best experience.
                </p>
            </div>
        </div>

        <!-- Sidebar -->
        <aside class="sidebar" :class="{ 'sidebar-open': sidebarOpen }">
            <div class="sidebar-logo">
                <div class="logo-icon">
                    <img src="/lc_logo.png" alt="Logo" class="logo-icon" />
                </div>
                <div class="logo-text">
                    <span class="logo-main">LightCity</span>
                    <span class="logo-sub">Admin Panel</span>
                </div>
            </div>

            <nav class="sidebar-nav">
                <NuxtLink v-for="item in navItems" :key="item.to" :to="item.to" class="nav-item"
                    :class="{ 'nav-active': isActive(item.to) }" @click="sidebarOpen = false">
                    <Icon :name="item.icon" class="nav-icon" />
                    <span>{{ item.label }}</span>
                </NuxtLink>
            </nav>

            <div class="sidebar-footer">
                <button class="logout-btn" @click="handleLogout">
                    <Icon name="mdi:logout" />
                    <span>Logout</span>
                </button>
            </div>
        </aside>

        <!-- Sidebar overlay (mobile) -->
        <div v-if="sidebarOpen" class="sidebar-overlay" @click="sidebarOpen = false" />

        <!-- Main content area -->
        <div class="main-area">
            <!-- Top header -->
            <header class="top-header">
                <button class="menu-toggle" @click="sidebarOpen = !sidebarOpen">
                    <Icon name="mdi:menu" />
                </button>

                <div class="header-title">
                    <h1 class="page-breadcrumb">
                        <NuxtLink to="/admin" class="breadcrumb-home">Admin</NuxtLink>
                        <template v-if="route.path !== '/admin'">
                            <span class="breadcrumb-sep">/</span>
                            <span class="breadcrumb-current">
                                {{ route.path.split("/").filter(Boolean).slice(1).join(" / ").replace(/-/g, " ") }}
                            </span>
                        </template>
                    </h1>
                </div>

                <div class="header-actions">
                    <NuxtLink to="/" target="_blank" class="view-site-btn" title="View public site">
                        <Icon name="mdi:open-in-new" />
                        <span>View Site</span>
                    </NuxtLink>

                    <div class="admin-avatar" :title="fullName">
                        {{ initials }}
                    </div>
                </div>
            </header>

            <!-- Page slot -->
            <main class="page-content">
                <slot />
            </main>
        </div>
    </div>
</template>

<style scoped>
/* ─── Shell ─── */
.admin-shell {
    display: flex;
    height: 100vh;
    overflow: hidden;
    background: #f4f4f5;
    font-family: 'Segoe UI', system-ui, sans-serif;
}

/* ─── Mobile Guard ─── */
.mobile-guard {
    display: none;
    position: fixed;
    inset: 0;
    background: #1A0E08;
    z-index: 9999;
    align-items: center;
    justify-content: center;
    padding: 2rem;
}

@media (max-width: 1023px) {
    .mobile-guard {
        display: flex;
    }
}

.mobile-guard-card {
    background: rgba(255, 255, 255, 0.06);
    border: 1px solid rgba(255, 255, 255, 0.12);
    border-radius: 16px;
    padding: 3rem 2.5rem;
    text-align: center;
    max-width: 480px;
}

.mobile-guard-icon {
    font-size: 4rem;
    color: #E05615;
    margin-bottom: 1.5rem;
    display: block;
}

.mobile-guard-card h2 {
    color: #fff;
    font-size: 1.4rem;
    font-weight: 700;
    margin-bottom: 1rem;
}

.mobile-guard-card p {
    color: rgba(255, 255, 255, 0.65);
    font-size: 0.95rem;
    line-height: 1.6;
}

/* ─── Sidebar ─── */
.sidebar {
    width: 258px;
    flex-shrink: 0;
    background: #1A0E08;
    display: flex;
    flex-direction: column;
    height: 100vh;
    overflow-y: auto;
    position: relative;
    z-index: 50;
    transition: transform 0.25s ease;
}

@media (max-width: 1279px) {
    .sidebar {
        position: fixed;
        top: 0;
        left: 0;
        bottom: 0;
        transform: translateX(-100%);
    }

    .sidebar.sidebar-open {
        transform: translateX(0);
        box-shadow: 8px 0 40px rgba(0, 0, 0, 0.4);
    }
}

.sidebar-overlay {
    display: none;
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.5);
    z-index: 49;
}

@media (max-width: 1279px) {
    .sidebar-overlay {
        display: block;
    }
}

/* Logo */
.sidebar-logo {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding: 1.5rem 1.25rem 1.25rem;
    border-bottom: 1px solid rgba(255, 255, 255, 0.08);
}

.logo-icon {
    width: 42px;
    height: 42px;
    background: #E05615;
    border-radius: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #fff;
    font-size: 1.35rem;
    flex-shrink: 0;
}

.logo-text {
    display: flex;
    flex-direction: column;
}

.logo-main {
    color: #fff;
    font-size: 1rem;
    font-weight: 800;
    line-height: 1.2;
    letter-spacing: -0.01em;
}

.logo-sub {
    color: rgba(255, 255, 255, 0.45);
    font-size: 0.7rem;
    font-weight: 500;
    letter-spacing: 0.04em;
    text-transform: uppercase;
}

/* Nav */
.sidebar-nav {
    flex: 1;
    padding: 1rem 0.75rem;
    display: flex;
    flex-direction: column;
    gap: 2px;
}

.nav-item {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding: 0.65rem 0.85rem;
    border-radius: 8px;
    color: rgba(255, 255, 255, 0.6);
    font-size: 0.875rem;
    font-weight: 500;
    text-decoration: none;
    transition: background 0.18s, color 0.18s;
}

.nav-item:hover {
    background: rgba(255, 255, 255, 0.07);
    color: rgba(255, 255, 255, 0.9);
}

.nav-active {
    background: rgba(224, 86, 21, 0.18) !important;
    color: #E05615 !important;
    font-weight: 600;
}

.nav-icon {
    font-size: 1.15rem;
    flex-shrink: 0;
}

/* Footer */
.sidebar-footer {
    padding: 1rem 0.75rem 1.5rem;
    border-top: 1px solid rgba(255, 255, 255, 0.08);
}

.logout-btn {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    width: 100%;
    padding: 0.65rem 0.85rem;
    border-radius: 8px;
    background: transparent;
    border: none;
    color: rgba(255, 255, 255, 0.5);
    font-size: 0.875rem;
    font-weight: 500;
    cursor: pointer;
    transition: background 0.18s, color 0.18s;
}

.logout-btn:hover {
    background: rgba(220, 38, 38, 0.15);
    color: #f87171;
}

/* ─── Main Area ─── */
.main-area {
    flex: 1;
    display: flex;
    flex-direction: column;
    overflow: hidden;
}

/* Header */
.top-header {
    height: 60px;
    background: #fff;
    border-bottom: 1px solid #e4e4e7;
    display: flex;
    align-items: center;
    padding: 0 1.5rem;
    gap: 1rem;
    flex-shrink: 0;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04);
}

.menu-toggle {
    display: none;
    background: transparent;
    border: none;
    font-size: 1.35rem;
    cursor: pointer;
    color: #52525b;
    padding: 0.25rem;
    border-radius: 6px;
    transition: background 0.15s;
}

.menu-toggle:hover {
    background: #f4f4f5;
}

@media (max-width: 1279px) {
    .menu-toggle {
        display: flex;
        align-items: center;
    }
}

.header-title {
    flex: 1;
}

.page-breadcrumb {
    font-size: 0.875rem;
    font-weight: 500;
    color: #71717a;
    display: flex;
    align-items: center;
    gap: 0.35rem;
}

.breadcrumb-home {
    color: #E05615;
    text-decoration: none;
    font-weight: 600;
}

.breadcrumb-home:hover {
    text-decoration: underline;
}

.breadcrumb-sep {
    color: #d4d4d8;
}

.breadcrumb-current {
    color: #27272a;
    font-weight: 600;
    text-transform: capitalize;
}

.header-actions {
    display: flex;
    align-items: center;
    gap: 0.75rem;
}

.view-site-btn {
    display: flex;
    align-items: center;
    gap: 0.4rem;
    padding: 0.4rem 0.85rem;
    border: 1px solid #e4e4e7;
    border-radius: 7px;
    font-size: 0.8rem;
    font-weight: 600;
    color: #52525b;
    text-decoration: none;
    transition: all 0.15s;
}

.view-site-btn:hover {
    border-color: #E05615;
    color: #E05615;
    background: rgba(224, 86, 21, 0.04);
}

.admin-avatar {
    width: 36px;
    height: 36px;
    border-radius: 50%;
    background: #E05615;
    color: #fff;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 0.8rem;
    font-weight: 700;
    cursor: pointer;
    flex-shrink: 0;
}

/* ─── Page Content ─── */
.page-content {
    flex: 1;
    overflow-y: auto;
    padding: 1.75rem 2rem;
}

/* Scrollbar */
.page-content::-webkit-scrollbar,
.sidebar::-webkit-scrollbar {
    width: 5px;
}

.page-content::-webkit-scrollbar-track,
.sidebar::-webkit-scrollbar-track {
    background: transparent;
}

.page-content::-webkit-scrollbar-thumb {
    background: #d4d4d8;
    border-radius: 99px;
}

.sidebar::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.1);
    border-radius: 99px;
}
</style>
