<template>
    <div class="page-wrapper">
        <NavBar />

        <!-- Page Hero -->
        <section class="page-hero">
            <div class="ph-overlay"></div>
            <img src="https://images.unsplash.com/photo-1579621970795-87facc2f976d?w=1920&h=400&fit=crop" alt="Give"
                class="ph-bg" />
            <div class="ph-content">
                <p class="ph-label">Support the Work</p>
                <h1>Give Generously</h1>
                <p class="ph-sub">"Each of you should give what you have decided in your heart to give." — 2 Cor 9:7</p>
            </div>
        </section>

        <!-- Why Give -->
        <section class="why-give">
            <div class="container">
                <div class="wg-grid">
                    <div class="wg-text">
                        <span class="section-label">Our Stewardship</span>
                        <h2>Your Giving Makes a Difference</h2>
                        <p>
                            Everything we do — from Sunday services to community outreach, youth programs to media
                            ministry — is made possible through the generous giving of our church family.
                        </p>
                        <p>
                            When you give to Light City, you are investing directly in changed lives, transformed
                            communities, and the spread of the Gospel.
                        </p>
                        <div class="giving-stats">
                            <div class="gs"><strong>₦50M+</strong><span>Given This Year</span></div>
                            <div class="gs"><strong>5,000+</strong><span>Lives Impacted</span></div>
                            <div class="gs"><strong>25+</strong><span>Projects Funded</span></div>
                        </div>
                    </div>
                    <div class="wg-image">
                        <img src="https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=600&h=420&fit=crop"
                            alt="Community impact" />
                    </div>
                </div>
            </div>
        </section>

        <!-- Giving Options -->
        <section class="giving-options">
            <div class="container">
                <h2 class="section-title">Ways to Give</h2>
                <div class="giving-grid">
                    <div class="giving-card" v-for="option in givingOptions" :key="option.title">
                        <div class="giving-icon">
                            <Icon :name="option.icon" />
                        </div>
                        <h3>{{ option.title }}</h3>
                        <p>{{ option.desc }}</p>
                        <div v-if="option.details" class="bank-details">
                            <div v-for="d in option.details" :key="d.label" class="bd-row">
                                <span class="bd-label">{{ d.label }}</span>
                                <span class="bd-value">{{ d.value }}</span>
                            </div>
                        </div>
                        <a v-if="option.cta" href="#" class="btn-give">{{ option.cta }}</a>
                    </div>
                </div>
            </div>
        </section>

        <!-- Online Giving Form -->
        <section class="give-form-section">
            <div class="container">
                <div class="give-form-card">
                    <h2>Give Online</h2>
                    <p class="give-form-sub">Securely give to the church using your debit card or bank transfer.</p>
                    <div class="give-amounts">
                        <button v-for="amt in amounts" :key="amt" class="amt-btn"
                            :class="{ active: selectedAmount === amt }"
                            @click="selectedAmount = amt; customAmount = ''">₦{{ amt.toLocaleString() }}</button>
                        <button class="amt-btn" :class="{ active: selectedAmount === 0 }"
                            @click="selectedAmount = 0">Custom</button>
                    </div>
                    <input v-if="selectedAmount === 0" v-model="customAmount" type="number"
                        placeholder="Enter amount in ₦" class="custom-input" />
                    <div class="give-type">
                        <label v-for="t in giveTypes" :key="t">
                            <input type="radio" :value="t" v-model="selectedType" />
                            {{ t }}
                        </label>
                    </div>
                    <button class="btn-give-main">Proceed to Payment &nbsp;→</button>
                    <p class="give-secure">
                        <Icon name="mdi:shield-check" /> Secured by 256-bit encryption. Your giving is safe.
                    </p>
                </div>
            </div>
        </section>

        <AppFooter />
    </div>
</template>

<script setup lang="ts">
const amounts = [1000, 5000, 10000, 20000, 50000];
const selectedAmount = ref(5000);
const customAmount = ref('');
const giveTypes = ['Tithe', 'Offering', 'Partnership', 'Building Fund', 'Missions'];
const selectedType = ref('Tithe');

const givingOptions = [
    {
        title: 'Bank Transfer',
        icon: 'mdi:bank',
        desc: 'Give directly to our church bank account. Use your name as reference.',
        details: [
            { label: 'Bank', value: 'First Bank' },
            { label: 'Account Name', value: 'Light City Evangelical Center Int\'l' },
            { label: 'Account Number', value: '**********' },
        ],
    },
    {
        title: 'Online Giving',
        icon: 'mdi:credit-card',
        desc: 'Give securely online with your debit card via our secure Paystack payment gateway.',
        cta: 'Give Online Now',
    },
    {
        title: 'Partner With Us',
        icon: 'mdi:handshake',
        desc: 'Become a monthly partner and commit to supporting our vision with a recurring gift.',
        cta: 'Start a Partnership',
    },
];
</script>

<style scoped>
.page-wrapper {
    font-family: 'Segoe UI', system-ui, sans-serif;
}

.container {
    max-width: 1100px;
    margin: 0 auto;
    padding: 0 24px;
}

.section-title {
    font-size: 1.75rem;
    font-weight: 800;
    color: var(--lc-dark);
    text-align: center;
    margin-bottom: 2.5rem;
}

.section-label {
    font-size: 0.78rem;
    font-weight: 700;
    letter-spacing: 0.15em;
    text-transform: uppercase;
    color: var(--lc-gold);
}

/* Hero */
.page-hero {
    position: relative;
    height: 340px;
    display: flex;
    align-items: center;
    overflow: hidden;
}

.ph-bg {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
    z-index: 0;
}

.ph-overlay {
    position: absolute;
    inset: 0;
    background: rgba(15, 10, 40, 0.75);
    z-index: 1;
}

.ph-content {
    position: relative;
    z-index: 2;
    padding: 0 10%;
    text-align: center;
    width: 100%;
}

.ph-label {
    color: var(--lc-gold);
    font-size: 0.78rem;
    font-weight: 700;
    letter-spacing: 0.15em;
    text-transform: uppercase;
}

.ph-content h1 {
    font-size: 2.8rem;
    font-weight: 900;
    color: #fff;
    margin: 0.4rem 0;
}

.ph-sub {
    color: rgba(255, 255, 255, 0.75);
    font-size: 1rem;
    margin: 0;
    font-style: italic;
}

/* Why Give */
.why-give {
    padding: 5rem 0;
    background: #fff;
}

.wg-grid {
    display: grid;
    grid-template-columns: 1.2fr 1fr;
    gap: 4rem;
    align-items: center;
}

.wg-text h2 {
    font-size: 2rem;
    font-weight: 800;
    color: var(--lc-dark);
    margin: 0.5rem 0 1.25rem;
}

.wg-text p {
    color: #666;
    line-height: 1.8;
    font-size: 0.95rem;
    margin-bottom: 1rem;
}

.giving-stats {
    display: flex;
    gap: 2rem;
    margin-top: 2rem;
    padding-top: 2rem;
    border-top: 1px solid #eee;
}

.gs {
    text-align: center;
}

.gs strong {
    display: block;
    font-size: 1.75rem;
    font-weight: 900;
    color: var(--lc-gold);
}

.gs span {
    font-size: 0.78rem;
    color: #999;
    font-weight: 600;
    text-transform: uppercase;
}

.wg-image img {
    width: 100%;
    border-radius: 12px;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12);
}

/* Giving Options */
.giving-options {
    padding: 4rem 0;
    background: #f9f9fb;
}

.giving-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 1.5rem;
}

.giving-card {
    background: #fff;
    border-radius: 12px;
    padding: 2rem;
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
    border-top: 3px solid var(--lc-gold);
    text-align: center;
}

.giving-icon {
    font-size: 2.5rem;
    color: var(--lc-gold);
    margin-bottom: 1rem;
}

.giving-card h3 {
    font-size: 1.1rem;
    font-weight: 800;
    color: var(--lc-dark);
    margin-bottom: 0.75rem;
}

.giving-card>p {
    color: #666;
    font-size: 0.88rem;
    line-height: 1.6;
    margin-bottom: 1.25rem;
}

.bank-details {
    background: #f9f9fb;
    border-radius: 8px;
    padding: 1rem;
    text-align: left;
}

.bd-row {
    display: flex;
    justify-content: space-between;
    padding: 0.4rem 0;
    border-bottom: 1px solid #eee;
    font-size: 0.82rem;
}

.bd-row:last-child {
    border-bottom: none;
}

.bd-label {
    color: #999;
    font-weight: 600;
}

.bd-value {
    color: var(--lc-dark);
    font-weight: 700;
}

.btn-give {
    display: inline-block;
    margin-top: 1rem;
    padding: 10px 24px;
    background: var(--lc-dark);
    color: #fff;
    border-radius: 6px;
    font-weight: 700;
    font-size: 0.85rem;
    text-decoration: none;
    transition: background 0.2s;
}

.btn-give:hover {
    background: var(--lc-gold);
}

/* Give Form */
.give-form-section {
    padding: 4rem 0 5rem;
    background: var(--lc-dark);
}

.give-form-card {
    max-width: 600px;
    margin: 0 auto;
    background: rgba(255, 255, 255, 0.05);
    border: 1px solid rgba(200, 168, 75, 0.35);
    border-radius: 16px;
    padding: 3rem;
    text-align: center;
}

.give-form-card h2 {
    color: #fff;
    font-size: 1.75rem;
    font-weight: 800;
    margin-bottom: 0.5rem;
}

.give-form-sub {
    color: #aaa;
    font-size: 0.9rem;
    margin-bottom: 2rem;
}

.give-amounts {
    display: flex;
    flex-wrap: wrap;
    gap: 0.75rem;
    justify-content: center;
    margin-bottom: 1.25rem;
}

.amt-btn {
    padding: 10px 20px;
    border-radius: 8px;
    border: 1.5px solid rgba(200, 168, 75, 0.4);
    background: transparent;
    color: #ccc;
    font-weight: 700;
    font-size: 0.9rem;
    cursor: pointer;
    font-family: inherit;
    transition: all 0.2s;
}

.amt-btn.active,
.amt-btn:hover {
    background: var(--lc-gold);
    color: #fff;
    border-color: var(--lc-gold);
}

.custom-input {
    width: 100%;
    max-width: 300px;
    padding: 11px 16px;
    border-radius: 8px;
    border: 1.5px solid rgba(200, 168, 75, 0.4);
    background: rgba(255, 255, 255, 0.07);
    color: #fff;
    font-size: 1rem;
    text-align: center;
    font-family: inherit;
    margin-bottom: 1.25rem;
}

.give-type {
    display: flex;
    gap: 1.25rem;
    flex-wrap: wrap;
    justify-content: center;
    margin-bottom: 2rem;
}

.give-type label {
    color: #ccc;
    font-size: 0.85rem;
    display: flex;
    align-items: center;
    gap: 6px;
    cursor: pointer;
}

.btn-give-main {
    display: block;
    width: 100%;
    padding: 14px;
    background: var(--lc-gold);
    color: #fff;
    border: none;
    border-radius: 8px;
    font-size: 1rem;
    font-weight: 700;
    cursor: pointer;
    font-family: inherit;
    transition: background 0.2s;
    margin-bottom: 1.25rem;
}

.btn-give-main:hover {
    background: var(--lc-gold-hover);
}

.give-secure {
    color: #777;
    font-size: 0.8rem;
    display: flex;
    align-items: center;
    gap: 6px;
    justify-content: center;
    margin: 0;
}

.give-secure .iconify {
    color: #4caf50;
}

@media (max-width: 900px) {
    .wg-grid {
        grid-template-columns: 1fr;
    }

    .giving-grid {
        grid-template-columns: 1fr;
    }
}
</style>
