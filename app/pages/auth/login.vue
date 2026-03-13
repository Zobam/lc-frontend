<script setup lang="ts">
import { validateLogin, hasErrors } from "~/utils/validation";

definePageMeta({
    layout: "default",
    auth: {
        unauthenticatedOnly: true,
        navigateAuthenticatedTo: '/admin'
    }
});

useHead({
    title: 'Admin Login | Light City Evangelical Center',
    meta: [
        { name: 'robots', content: 'noindex, nofollow' },
    ],
});

const { signIn } = useAuth();
const router = useRouter();

const form = ref({ email: "", password: "" });
const errors = ref<Record<string, string>>({});
const loading = ref(false);
const globalError = ref("");

const submit = async () => {
    errors.value = validateLogin(form.value);
    if (hasErrors(errors.value)) return;

    loading.value = true;
    globalError.value = "";

    try {
        await signIn(form.value, { callbackUrl: '/admin', redirect: false });
        router.push('/admin');
    } catch (e: any) {
        console.error("Login error", e);
        globalError.value = e?.response?._data?.message || e.message || "Incorrect credentials";
    } finally {
        loading.value = false;
    }
};
</script>

<template>
    <div class="auth-container">
        <div class="auth-card">
            <div class="auth-header">
                <h1 class="auth-title">Welcome Back</h1>
                <p class="auth-desc">Sign in to the LightCity Admin panel</p>
            </div>

            <div v-if="globalError" class="alert-error">
                <Icon name="mdi:alert-circle" />
                <span>{{ globalError }}</span>
            </div>

            <form @submit.prevent="submit" class="auth-form">
                <div class="field" :class="{ errored: errors.email }">
                    <label>Email Address</label>
                    <input v-model="form.email" type="email" class="input" placeholder="admin@example.com" />
                    <p v-if="errors.email" class="field-error">{{ errors.email }}</p>
                </div>

                <div class="field" :class="{ errored: errors.password }">
                    <label>Password</label>
                    <input v-model="form.password" type="password" class="input" placeholder="••••••••" />
                    <p v-if="errors.password" class="field-error">{{ errors.password }}</p>
                </div>

                <button type="submit" :disabled="loading" class="btn-primary">
                    <Icon v-if="loading" name="mdi:loading" class="spin" />
                    {{ loading ? "Signing in..." : "Sign In" }}
                </button>
            </form>

            <div class="auth-footer">
                <NuxtLink to="/" class="back-link">
                    <Icon name="mdi:arrow-left" /> Back to Home
                </NuxtLink>
            </div>
        </div>
    </div>
</template>

<style scoped>
.auth-container {
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    background: #f4f4f5;
    padding: 1.5rem;
}

.auth-card {
    background: #fff;
    border-radius: 16px;
    padding: 2.5rem;
    width: 100%;
    max-width: 420px;
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.05);
}

.auth-header {
    text-align: center;
    margin-bottom: 2rem;
}

.auth-title {
    font-size: 1.75rem;
    font-weight: 800;
    color: #1A0E08;
    margin: 0 0 0.5rem;
}

.auth-desc {
    font-size: 0.95rem;
    color: #71717a;
    margin: 0;
}

.alert-error {
    background: #fee2e2;
    color: #dc2626;
    padding: 0.85rem 1rem;
    border-radius: 8px;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-size: 0.875rem;
    font-weight: 500;
    margin-bottom: 1.5rem;
}

.alert-error icon {
    font-size: 1.25rem;
}

.auth-form {
    display: flex;
    flex-direction: column;
    gap: 1.25rem;
}

.field {
    display: flex;
    flex-direction: column;
    gap: 0.4rem;
}

.field label {
    font-size: 0.8rem;
    font-weight: 600;
    color: #52525b;
}

.input {
    padding: 0.75rem 1rem;
    border: 1px solid #e4e4e7;
    border-radius: 8px;
    font-size: 0.95rem;
    outline: none;
    background: #fafafa;
    transition: border 0.15s;
    width: 100%;
}

.input:focus {
    border-color: #E05615;
    background: #fff;
}

.errored .input {
    border-color: #dc2626;
}

.field-error {
    font-size: 0.8rem;
    color: #dc2626;
    margin: 0;
}

.btn-primary {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    padding: 0.85rem;
    background: #E05615;
    color: #fff;
    border-radius: 8px;
    font-size: 1rem;
    font-weight: 600;
    border: none;
    cursor: pointer;
    transition: background 0.15s;
    margin-top: 0.5rem;
}

.btn-primary:hover:not(:disabled) {
    background: #B84410;
}

.btn-primary:disabled {
    opacity: 0.7;
    cursor: not-allowed;
}

.spin {
    animation: spin 1s linear infinite;
}

@keyframes spin {
    100% {
        transform: rotate(360deg);
    }
}

.auth-footer {
    margin-top: 2rem;
    text-align: center;
}

.back-link {
    display: inline-flex;
    align-items: center;
    gap: 0.3rem;
    font-size: 0.85rem;
    font-weight: 600;
    color: #71717a;
    text-decoration: none;
    transition: color 0.15s;
}

.back-link:hover {
    color: #1A0E08;
}
</style>
