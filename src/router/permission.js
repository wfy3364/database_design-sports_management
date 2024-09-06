import { defineStore } from 'pinia'; 

// 示例菜单数据
const menuData = [
  {
    path:'/',
    title: 'home',
  },
  {
    path:'/AdminInfo',
    title: 'AdminInfo',
  },
  {
    path:'/AdminDevice',
    title: 'AdminDevice',
  },
  {
    path:'/AdminNotifications',
    title: 'AdminNotifications',
  },
];

export const usePermissionStoreHook = defineStore('permission', {
  state: () => ({
    wholeMenus: menuData,
  }),
});
