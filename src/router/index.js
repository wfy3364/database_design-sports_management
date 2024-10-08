import { createRouter, createWebHistory } from 'vue-router'
import HomeLayout from '@/views/HomeLayout.vue'
import Home from '@/views/Home.vue'
import AdminInfo from '@/views/AdminInfo.vue'
import AdminDevice from '@/views/AdminDevice.vue'
import AdminDeviceDetail from '@/views/AdminDeviceDetail.vue'
import AdminDeviceRepair from '@/views/AdminDeviceRepair.vue'
import AdminNotifications from '@/views/AdminNotifications.vue'
import AdminRegister from '@/views/AdminRegister.vue'
import AdminVenueDetail from '@/views/AdminVenueDetail.vue'
import AdminVenueMaintenance from '@/views/AdminVenueMaintenance.vue'
import AdminStatistics from '@/views/AdminStatistics.vue'
import PublicNotice from '@/views/PublicNotice.vue'
import NotificationList from '@/views/NotificationList.vue'
import ReservationList from '@/views/ReservationList.vue'
import TeamAdmin from '@/views/TeamAdmin.vue'
import TeamCreate from '@/views/TeamCreate.vue'
import TeamManagement from '@/views/TeamManagement.vue'
import UserRegister from '@/views/UserRegister.vue'
import UserInfo from '@/views/UserInfo.vue'
import VenueBrowser from '@/views/VenueBrowser.vue'
import VenueReservation from '@/views/VenueReservation.vue'
import Login from '@/views/Login.vue'
import Privacypolicy from '@/views/Privacypolicy.vue'
import Uploadphotos from '@/views/Uploadphotos.vue'
import { storeToRefs } from 'pinia'
import { useUserStore } from '@/stores/userStore'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeLayout,
      children: [
        {
          path: '/',
          component: Home,
        },
        {
          path: '/AdminDevice',
          component: AdminDevice,
        },
        {
          path: '/AdminDeviceDetail',
          component: AdminDeviceDetail,
        },
        {
          path: '/AdminDeviceRepair',
          component: AdminDeviceRepair,
        },
        {
          path:'/AdminInfo',
          component: AdminInfo,
        },
        {
          path:'/AdminNotifications',
          component: AdminNotifications,
        },
        {
          path: '/AdminVenueDetail',
          component: AdminVenueDetail,
        },
        {
          path: '/AdminVenueMaintenance',
          component: AdminVenueMaintenance
        },
        {
          path: '/AdminStatistics',
          component: AdminStatistics
        },
        {
          path: '/PublicNotice',
          component: PublicNotice
        },
        {
          path: '/NotificationList',
          component: NotificationList,
        },
        {
          path: '/VenueBrowser',
          component: VenueBrowser,
        },
        {
          path: '/VenueReservation',
          component: VenueReservation,
        },
        {
          path: '/ReservationList',
          component: ReservationList,
        },
        {
          path: '/TeamAdmin',
          component: TeamAdmin,
        },
        {
          path: '/TeamCreate',
          component: TeamCreate,
        },
        {
          path: '/TeamManagement',
          component: TeamManagement,
        },
        {
          path: '/UserInfo',
          component: UserInfo,
        },
        {
          path: '/Uploadphotos',
          component: Uploadphotos,
        },
      ]
    },
    {
      path: '/Login',
      name: 'login',
      component: Login,
    },
    {
      path: '/UserRegister',
      name: 'UserRegister',
      component: UserRegister,
    },
    {
      path: '/AdminRegister',
      name: 'AdminRegister',
      component: AdminRegister,
    },
    {
      path: '/Privacypolicy',
      name: 'Privacypolicy',
      component: Privacypolicy,
    },
  ]
})

router.beforeEach(async (to, from) => {
  const userStore = useUserStore();
  const { isAuthenticated } = storeToRefs(userStore);
  if (!isAuthenticated.value && to.name != 'login' && to.name != 'AdminRegister' && to.name != 'UserRegister' && to.name != 'Privacypolicy') {
    return { path: '/Login' };
  }
  return true;
})

export default router
