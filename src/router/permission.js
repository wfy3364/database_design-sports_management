import { defineStore } from 'pinia';
import { useUserStore } from '@/stores/userStore';
// 示例菜单数据
const userMenuData = [
  {
    path: '/',
    title: '主界面',
  },
  // {
  //   path:'/TeamCreate',
  //   title:'团队创建',
  // },
  {
    path: '/PublicNotice',
    title: '公告列表',
  },
  {
    path: '/VenueBrowser',
    title: '场地浏览',
  },
  {
    path: '/VenueReservation',
    title: '场地预约',
  },
  {
    path: '/ReservationList',
    title: '预约记录'
  },
  {
    path: '/TeamManagement',
    title: '团队管理',
  },
  {
    path: '/NotificationList',
    title: '个人通知',
  },
  {
    path: '/UserInfo',
    title: '个人信息',
  },
];
const adminMenuData = [
  {
    path: '/',
    title: '主界面',
  },
  // {
  //   path: '/TeamManagement',
  //   title: '团队管理',
  // },
  // {
  //   path: '/TeamCreate',
  //   title: '团队创建',
  // },
  {
    path: '/VenueBrowser',
    title: '场地浏览',
  },
  // {
  //   path: '/VenueReservation',
  //   title: '场地预约',
  // },
  {
    path: '/AdminVenueMaintenance',
    title: '场地保养',
  },
  {
    path: '/AdminDevice',
    title: '管理员设备',
  },
  {
    path: '/ReservationList',
    title: '预约记录',
  },
  {
    path: '/AdminDeviceRepair',
    title: '设备维修'
  },
  {
    path: '/AdminStatistics',
    title: '数据统计',
  },
  {
    path: '/AdminNotifications',
    title: '管理员通知'
  },
  {
    path: '/UserInfo',
    title: '个人信息',
  },
];

//const type = userMenuData.adminType;

export const usePermissionStoreHook = defineStore('permission', {

  state: () => ({
    userWholeMenus: userMenuData,
    adminWholeMenus: adminMenuData,
  }),
});
