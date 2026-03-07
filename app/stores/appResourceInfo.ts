import { defineStore } from "pinia";

export const useAppResourceInfoStore = defineStore("appResourceInfoStore", {
  state: () => ({
    address: 'Ndiaga Amaechi, Enugu, Nigeria',
    phone: '+234 816 111 1111',
    email: 'info@lightcitymission.org',
    toastMessage: null as string | null,
    loading: reactive<Record<string, boolean>>({}),
  }),
  getters: {},
  actions: {},
});
