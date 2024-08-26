import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'
import AdminHome from '@/views/AdminHome.vue'
import AdminVenue from '@/views/AdminVenue.vue'
import AdminVenueDetail from '@/views/AdminVenueDetail.vue'
import AdminDeviceDetail from '@/views/AdminDeviceDetail.vue'
import AdminDeviceRepair from '@/views/AdminDeviceRepair.vue'
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



const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
      children: [
        {
          path: '/AdminHome',
          component: AdminHome,
        },
        {
          path: '/AdminVenue',
          component: AdminVenue,
        },
        {
          path: '/AdminVenueDetail',
          component: AdminVenueDetail,
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
      ]
    },
    {
      path: '/login',
      name: 'login',
      component: Login,
    },
    {
      path: '/UserRegister',
      component: UserRegister,
    },
  ]
})

export default router
