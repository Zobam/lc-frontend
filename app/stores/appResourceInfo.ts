import { defineStore } from "pinia";

export const useAppResourceInfoStore = defineStore("appResourceInfoStore", {
  state: () => ({
    address: 'Light City Evangelical Center Int\' Building, Ndiaga Amaechi, Enugu, Nigeria',
    phone: '+234 0901 414 9865',
    email: 'lightcityteam@gmail.com',
    toastMessage: null as string | null,
    loading: reactive<Record<string, boolean>>({}),
  }),
  getters: {},
  actions: {},
});
