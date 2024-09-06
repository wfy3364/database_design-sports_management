<script setup lang="ts">
import { useRoute, useRouter } from "vue-router";
import { ref, computed } from "vue";
import { usePermissionStoreHook } from "@/router/permission";
import LaySidebarItem from "./SidebarItem.vue";
import { ElScrollbar, ElMenu } from "element-plus";

const route = useRoute();
const router = useRouter();

const menuData = computed(() => {
  return usePermissionStoreHook().wholeMenus;
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