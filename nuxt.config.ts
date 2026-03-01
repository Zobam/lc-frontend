// https://nuxt.com/docs/api/configuration/nuxt-config
import tailwindcss from "@tailwindcss/vite";

export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  devServer: {
    port: 3007,
  },
  devtools: { enabled: true },
  css: ["~/assets/css/tailwind.css"],
  vite: {
    plugins: [tailwindcss()],
  },

  runtimeConfig: {
    public: {
      devApiUrl: process.env.DEV_API_URL,
    },
  },
  modules: [
    "@nuxt/eslint",
    "@nuxt/fonts",
    "@nuxt/icon",
    "@nuxt/image",
    "@nuxt/scripts",
    "shadcn-nuxt",
    "@sidebase/nuxt-auth",
    "@pinia/nuxt",
  ],
  auth: {
    baseURL: process.env.DEV_API_URL,
    globalAppMiddleware: false,
    provider: {
      type: "local",
      endpoints: {
        signIn: { path: "auth/sign-in", method: "post" },
        signOut: { path: "auth/sign-out", method: "post" },
        signUp: { path: "auth/signup", method: "post" },
        getSession: {
          path: "auth/user",
          method: "get",
        },
      },
      session: {
        dataResponsePointer: "/data",
      },
      token: {
        signInResponseTokenPointer: "data/token",
        maxAgeInSeconds: 2592000,
      },
      pages: {
        login: "/auth/login",
      },
    },
  },
  shadcn: { componentDir: "@/components/ui" },
});