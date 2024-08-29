import { defineStore } from "pinia";
import { ref } from "vue";

export const useUserStore = defineStore('userStore', () => {
  const isAuthenticated = ref(false); // 是否登录
  const userId = ref('');
  const userName = ref('');
  const adminType = ref('');
  const adminPermission = ref({
    venue: [],
    device: [],
  })
  return { isAuthenticated, userId, userName, adminType, adminPermission }
},
  {
    persist: true
  });