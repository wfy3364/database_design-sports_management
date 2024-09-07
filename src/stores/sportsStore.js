import { defineStore } from "pinia";
import { ref } from "vue";

export const useSportsStore = defineStore('sportsStore', () => {
  const sports = ref([
    '羽毛球',
    '乒乓球',
    '网球',
    '健身',
    '田径',
    '足球',
    '篮球',
    '排球',
  ]);
  return { sports };
});