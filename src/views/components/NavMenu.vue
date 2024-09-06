<script setup lang="ts">
import { useRoute, useRouter } from "vue-router";
import { ref, computed } from "vue";
import { storeToRefs } from "pinia";
import { useUserStore } from '@/stores/userStore'
import { usePermissionStoreHook } from "@/router/permission";
import LaySidebarItem from "./SidebarItem.vue";
import { ElScrollbar, ElMenu } from "element-plus";

const route = useRoute();
const router = useRouter();
const userStore = useUserStore();
const { adminType } = storeToRefs(userStore);

const menuData = computed(() => {
  console.log(adminType.value);
  if (adminType.value == "normal")
    return usePermissionStoreHook().userWholeMenus;
  else
    return usePermissionStoreHook().adminWholeMenus;
});

const defaultActive = computed(() => route.path);

function handleMenuSelect(path: string) {
  router.push(path);
}
</script>

<template>
  <div class="sidebar-container">
    <el-scrollbar wrap-class="scrollbar-wrapper">
      <el-menu
        unique-opened
        mode="vertical"
        class="outer-most select-none"
        :default-active="defaultActive"
        @select="handleMenuSelect"
      >
        <LaySidebarItem
          v-for="routes in menuData"
          :key="routes.path"
          :item="routes"
          :base-path="routes.path"
          class="outer-most select-none"
        />
      </el-menu>
    </el-scrollbar>
  </div>
</template>

<style scoped>
.sidebar-container {
  width: 250px;
  height: 100vh;
  overflow: hidden;
}

.scrollbar-wrapper {
  height: 100%;
}

.outer-most.select-none {
  user-select: none;
}
</style>
../../router/permission