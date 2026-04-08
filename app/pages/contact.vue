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
                                <p>{{ appResourceInfoStore.address }}</p>
                            </div>
                        </div>
                        <div class="contact-item">
                            <span class="ci-icon">
                                <Icon name="mdi:phone" />
                            </span>
                            <div>
                                <h4>Phone</h4>
                                <p>{{ appResourceInfoStore.phone }}</p>
                            </div>
                        </div>
                        <div class="contact-item">
                            <span class="ci-icon">
                                <Icon name="mdi:email" />
                            </span>
                            <div>
                                <h4>Email</h4>
                                <p>{{ appResourceInfoStore.email }}</p>
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

                        <div v-if="successMessage" class="success-message">
                            <Icon name="mdi:check-circle" class="success-icon" />
                            <h4>Success!</h4>
                            <p>{{ successMessage }}</p>
                        </div>

                        <form v-else @submit.prevent="submitForm">
                            <div class="form-group">
                                <label>Your Name</label>
                                <input type="text" v-model="form.name" placeholder="John Doe"
                                    :class="{ 'input-error': touched.name && errors.name }"
                                    @blur="touched.name = true" />
                                <span class="error-msg" v-if="touched.name && errors.name">{{ errors.name }}</span>
                            </div>
                            <div class="form-row">
                                <div class="form-group">
                                    <label>Email</label>
                                    <input type="email" v-model="form.email" placeholder="john@example.com"
                                        :class="{ 'input-error': touched.email && errors.email }"
                                        @blur="touched.email = true" />
                                    <span class="error-msg" v-if="touched.email && errors.email">{{ errors.email
                                        }}</span>
                                </div>
                                <div class="form-group">
                                    <label>Phone (optional)</label>
                                    <input type="tel" v-model="form.phone" placeholder="+234 816 111 1111"
                                        :class="{ 'input-error': touched.phone && errors.phone }"
                                        @blur="touched.phone = true" />
                                    <span class="error-msg" v-if="touched.phone && errors.phone">{{ errors.phone
                                        }}</span>
                                </div>
                            </div>
                            <div class="form-group">
                                <label>Subject</label>
                                <select v-model="form.subject"
                                    :class="{ 'input-error': touched.subject && errors.subject }"
                                    @blur="touched.subject = true">
                                    <option value="">Select a subject</option>
                                    <option value="prayer_request">Prayer Request</option>
                                    <option value="general_inquiry">General Inquiry</option>
                                    <option value="new_member">New Member</option>
                                    <option value="partnership">Partnership</option>
                                </select>
                                <span class="error-msg" v-if="touched.subject && errors.subject">{{ errors.subject
                                    }}</span>
                            </div>
                            <div class="form-group">
                                <label>Your Message</label>
                                <textarea v-model="form.message" placeholder="How can we help you?" rows="5"
                                    :class="{ 'input-error': touched.message && errors.message }"
                                    @blur="touched.message = true"></textarea>
                                <span class="error-msg" v-if="touched.message && errors.message">{{ errors.message
                                    }}</span>
                            </div>

                            <div class="error-msg api-error" v-if="apiError">{{ apiError }}</div>

                            <button type="submit" class="btn-submit"
                                :disabled="!isFormValid || isSubmitting || !recaptchaReady">
                                <Icon v-if="isSubmitting" name="mdi:loading" class="spinner-icon" />
                                {{ isSubmitting ? 'Sending...' : (!recaptchaReady ? 'Loading...' : 'Send Message') }}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </section>

        <AppFooter />
    </div>
</template>
<script setup lang="ts">
import { useReCaptcha } from 'vue-recaptcha-v3';

useHead({
    title: 'Contact Us | Light City Evangelical Center',
    meta: [
        {
            name: 'description',
            content: 'Get in touch with Light City Evangelical Center Int\'l. Send us a message, visit us in Enugu, or call our office. We\'d love to hear from you.',
        },
    ],
});

const appResourceInfoStore = useAppResourceInfoStore();
const { post } = useApi();

const recaptchaInstance = useReCaptcha();
const recaptchaReady = ref(false);

onMounted(async () => {
    await recaptchaInstance?.recaptchaLoaded();
    recaptchaReady.value = true;
});

const form = reactive({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
});

const touched = reactive({
    name: false,
    email: false,
    phone: false,
    subject: false,
    message: false
});

const isSubmitting = ref(false);
const successMessage = ref('');
const apiError = ref('');

const errors = computed(() => {
    return {
        name: !form.name.trim() ? 'Name is required' : form.name.length > 255 ? 'Name is too long' : '',
        email: !form.email.trim() ? 'Email is required' : !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email) ? 'Enter a valid email address' : form.email.length > 255 ? 'Email is too long' : '',
        phone: form.phone && form.phone.length > 20 ? 'Phone number must be at most 20 characters' : '',
        subject: !form.subject ? 'Subject is required' : '',
        message: !form.message.trim() ? 'Message is required' : form.message.length < 10 ? 'Message must be at least 10 characters' : form.message.length > 2500 ? 'Message is too long' : ''
    };
});

const isFormValid = computed(() => {
    return !errors.value.name && !errors.value.email && !errors.value.phone && !errors.value.subject && !errors.value.message;
});

const submitForm = async () => {
    // Touch all fields to show any hidden errors
    Object.keys(touched).forEach(key => touched[key as keyof typeof touched] = true);

    if (!isFormValid.value) return;
    if (!recaptchaReady.value) return;

    isSubmitting.value = true;
    apiError.value = '';

    try {
        // Execute reCAPTCHA and get token
        await recaptchaInstance?.recaptchaLoaded();
        const token = await recaptchaInstance?.executeRecaptcha('contact_form');

        if (!token) {
            apiError.value = 'reCAPTCHA verification failed. Please try again.';
            return;
        }

        const response = await post<any>('/contacts', { ...form, recaptcha_token: token });
        if (response.status === 'success') {
            successMessage.value = response.message || 'Thank you for contacting us! We\'ll get back to you soon.';
        } else {
            apiError.value = response.message || 'Failed to send message. Please try again.';
        }
    } catch (e: any) {
        apiError.value = e.data?.message || 'An error occurred while sending your message. Please check your connection and try again.';
        console.error('Contact form error:', e);
    } finally {
        isSubmitting.value = false;
    }
};
</script>

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
    color: var(--lc-dark);
    margin-bottom: 2rem;
    padding-bottom: 0.75rem;
    border-bottom: 3px solid var(--lc-gold);
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
    background: var(--lc-dark);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--lc-gold);
    font-size: 1.1rem;
    flex-shrink: 0;
}

.contact-item h4 {
    font-weight: 700;
    color: var(--lc-dark);
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
    color: var(--lc-dark);
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
    border-color: var(--lc-gold);
}

.btn-submit {
    width: 100%;
    padding: 13px;
    background: var(--lc-dark);
    color: #fff;
    border: none;
    border-radius: 6px;
    font-size: 0.95rem;
    font-weight: 700;
    cursor: pointer;
    transition: background 0.25s, opacity 0.25s;
    font-family: inherit;
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 0.5rem;
}

.btn-submit:hover:not(:disabled) {
    background: var(--lc-gold);
}

.btn-submit:disabled {
    opacity: 0.6;
    cursor: not-allowed;
}

.input-error {
    border-color: #ef4444 !important;
}

.error-msg {
    display: block;
    color: #ef4444;
    font-size: 0.75rem;
    margin-top: 0.4rem;
    font-weight: 500;
}

.api-error {
    margin-bottom: 1.25rem;
    padding: 10px;
    background: #fef2f2;
    border: 1px solid #fee2e2;
    border-radius: 6px;
}

.spinner-icon {
    animation: spin 1s linear infinite;
}

@keyframes spin {
    from {
        transform: rotate(0deg);
    }

    to {
        transform: rotate(360deg);
    }
}

.success-message {
    text-align: center;
    padding: 3rem 1rem;
    background: #f0fdf4;
    border: 1px solid #dcfce3;
    border-radius: 8px;
}

.success-icon {
    font-size: 4rem;
    color: #22c55e;
    margin-bottom: 1rem;
}

.success-message h4 {
    font-size: 1.5rem;
    color: #166534;
    margin: 0 0 0.5rem;
}

.success-message p {
    color: #15803d;
    margin: 0;
    line-height: 1.5;
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