import { defineStore } from 'pinia'; 
import { useUserStore } from '@/stores/userStore';
// 示例菜单数据
const userMenuData = [
  {
    path:'/',
    title: '主界面',
  },
  {
    path:'/TeamManagement',
    title:'团队管理',
  },
  {
    path:'/TeamCreate',
    title:'团队创建',
  },
  {
    path:'/VenueBrowser',
    title:'场地浏览',
  },
  {
    path:'/UserInfo',
    title:'个人信息',
  },
];
const adminMenuData = [
  {
    path:'/',
    title: '主界面',
  },
  {
    path:'/TeamManagement',
    title:'团队管理',
  },
  {
    path:'/TeamCreate',
    title:'团队创建',
  },
  {
    path:'/VenueBrowser',
    title:'场地浏览',
  },
  {
    path:'/VenueReservation',
    title:'场地预约',
  },
  {
    path:'/AdminDevice',
    title:'管理员设备',
  },
  {
    path:'/UserInfo',
    title:'个人信息',
  },
];

//const type = userMenuData.adminType;

export const usePermissionStoreHook = defineStore('permission', {
  
  state: () => ({
    userWholeMenus: userMenuData,
    adminWholeMenus: adminMenuData,
  }),
});
