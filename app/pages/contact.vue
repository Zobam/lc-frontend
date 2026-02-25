<template>
    <div class="page-wrapper">
        <NavBar />

        <!-- Page Hero -->
        <section class="page-hero">
            <div class="ph-overlay"></div>
            <img src="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=1920&h=400&fit=crop" alt="Contact"
                class="ph-bg" />
            <div class="ph-content">
                <h1>Contact Us</h1>
                <p>We'd love to hear from you. Reach out anytime.</p>
            </div>
        </section>

        <!-- Contact Section -->
        <section class="contact">
            <div class="container">
                <div class="contact-grid">
                    <div class="contact-info">
                        <h2>Visit Us</h2>
                        <div class="contact-item">
                            <span class="ci-icon">
                                <Icon name="mdi:map-marker" />
                            </span>
                            <div>
                                <h4>Address</h4>
                                <p>123 Faith Street<br>Light City, LC 12345</p>
                            </div>
                        </div>
                        <div class="contact-item">
                            <span class="ci-icon">
                                <Icon name="mdi:phone" />
                            </span>
                            <div>
                                <h4>Phone</h4>
                                <p>(555) 123-4567</p>
                            </div>
                        </div>
                        <div class="contact-item">
                            <span class="ci-icon">
                                <Icon name="mdi:email" />
                            </span>
                            <div>
                                <h4>Email</h4>
                                <p>info@lightcity.org</p>
                            </div>
                        </div>
                        <div class="contact-item">
                            <span class="ci-icon">
                                <Icon name="mdi:clock-outline" />
                            </span>
                            <div>
                                <h4>Office Hours</h4>
                                <p>Monday – Friday: 9 AM – 5 PM<br>Saturday: 10 AM – 2 PM</p>
                            </div>
                        </div>
                    </div>
                    <div class="contact-form-card">
                        <h3>Get Connected</h3>
                        <form @submit.prevent>
                            <div class="form-group">
                                <label>Your Name</label>
                                <input type="text" placeholder="John Doe" required />
                            </div>
                            <div class="form-row">
                                <div class="form-group">
                                    <label>Email</label>
                                    <input type="email" placeholder="john@example.com" required />
                                </div>
                                <div class="form-group">
                                    <label>Phone (optional)</label>
                                    <input type="tel" placeholder="+1 (555) 000-0000" />
                                </div>
                            </div>
                            <div class="form-group">
                                <label>Subject</label>
                                <select>
                                    <option value="">Select a subject</option>
                                    <option>Prayer Request</option>
                                    <option>General Inquiry</option>
                                    <option>New Member</option>
                                    <option>Partnership</option>
                                </select>
                            </div>
                            <div class="form-group">
                                <label>Your Message</label>
                                <textarea placeholder="How can we help you?" rows="5" required></textarea>
                            </div>
                            <button type="submit" class="btn-submit">Send Message</button>
                        </form>
                    </div>
                </div>
            </div>
        </section>

        <AppFooter />
    </div>
</template>

<style scoped>
.page-wrapper {
    font-family: 'Segoe UI', system-ui, sans-serif;
}

/* Page Hero */
.page-hero {
    position: relative;
    height: 300px;
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
    background: rgba(15, 10, 40, 0.72);
    z-index: 1;
}

.ph-content {
    position: relative;
    z-index: 2;
    padding: 0 10%;
}

.ph-content h1 {
    font-size: 2.5rem;
    font-weight: 900;
    color: #fff;
    margin: 0 0 0.5rem;
}

.ph-content p {
    color: rgba(255, 255, 255, 0.75);
    font-size: 1rem;
    margin: 0;
}

/* Contact */
.container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 24px;
}

.contact {
    padding: 5rem 0;
    background: #f9f9fb;
}

.contact-grid {
    display: grid;
    grid-template-columns: 1fr 1.5fr;
    gap: 3rem;
    align-items: start;
}

.contact-info h2 {
    font-size: 1.75rem;
    font-weight: 800;
    color: #1a1a2e;
    margin-bottom: 2rem;
    padding-bottom: 0.75rem;
    border-bottom: 3px solid #c8a84b;
    display: inline-block;
}

.contact-item {
    display: flex;
    gap: 1rem;
    margin-bottom: 1.75rem;
    align-items: flex-start;
}

.ci-icon {
    width: 42px;
    height: 42px;
    background: #1a1a2e;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #c8a84b;
    font-size: 1.1rem;
    flex-shrink: 0;
}

.contact-item h4 {
    font-weight: 700;
    color: #1a1a2e;
    margin: 0 0 0.25rem;
}

.contact-item p {
    color: #666;
    line-height: 1.6;
    margin: 0;
    font-size: 0.9rem;
}

/* Form Card */
.contact-form-card {
    background: #fff;
    border-radius: 12px;
    padding: 2.5rem;
    box-shadow: 0 4px 24px rgba(0, 0, 0, 0.08);
}

.contact-form-card h3 {
    font-size: 1.4rem;
    font-weight: 800;
    color: #1a1a2e;
    margin-bottom: 1.75rem;
}

.form-group {
    margin-bottom: 1.25rem;
}

.form-row {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1rem;
}

.form-group label {
    display: block;
    font-size: 0.82rem;
    font-weight: 600;
    color: #444;
    margin-bottom: 0.4rem;
}

.form-group input,
.form-group textarea,
.form-group select {
    width: 100%;
    padding: 11px 14px;
    border: 1.5px solid #e0e0e0;
    border-radius: 6px;
    font-size: 0.9rem;
    font-family: inherit;
    color: #333;
    transition: border-color 0.2s;
    background: #fdfdfd;
}

.form-group input:focus,
.form-group textarea:focus,
.form-group select:focus {
    outline: none;
    border-color: #c8a84b;
}

.btn-submit {
    width: 100%;
    padding: 13px;
    background: #1a1a2e;
    color: #fff;
    border: none;
    border-radius: 6px;
    font-size: 0.95rem;
    font-weight: 700;
    cursor: pointer;
    transition: background 0.25s;
    font-family: inherit;
}

.btn-submit:hover {
    background: #c8a84b;
}

@media (max-width: 768px) {
    .contact-grid {
        grid-template-columns: 1fr;
    }

    .form-row {
        grid-template-columns: 1fr;
    }
}
</style>