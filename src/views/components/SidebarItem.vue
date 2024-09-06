<template>
  <div class="sidebar-item">
    <!-- <el-sub-menu v-if="hasChildren" :index="basePath">
      <template #title>
        <i class="el-icon-menu"></i>
        <span>{{ item.title }}</span>
      </template>
      <LaySidebarItem
        v-for="child in item.children"
        :key="child.path"
        :item="child"
        :base-path="combinePath(basePath, child.path)"
      />
    </el-sub-menu> -->
    <el-menu-item
      :index="basePath"
      class="menu-item"
      @mouseover="hover = true"
      @mouseleave="hover = false"
      :class="{ hover, active: isActive }"
      @click="handleClick"
    >
      <i class="el-icon-menu"></i>
      <span>{{ item.title }}</span>
    </el-menu-item>
  </div>
</template>

<script setup lang="ts">
import { defineComponent, computed, ref, PropType } from 'vue';
import { useRoute, useRouter } from 'vue-router'; // 导入 Vue Router 组合函数
import { ElSubMenu, ElMenu, ElMenuItem, ElIcon } from 'element-plus';

interface MenuItem {
  path: string;
  title: string;
  children?: MenuItem[];
}

defineComponent({
  props: {
    item: {
      type: Object as PropType<MenuItem>,
      required: true,
    },
    basePath: {
      type: String,
      required: true,
    },
  },
});

const props = defineProps<{ item: MenuItem; basePath: string }>();
const route = useRoute(); // 使用 useRoute 获取当前路由
const router = useRouter(); // 使用 useRouter 进行路由跳转

const hover = ref(false);

const hasChildren = computed(() => !!props.item.children && props.item.children.length > 0);
const isActive = computed(() => props.basePath === route.path); // 根据当前路由决定是否激活

function combinePath(base: string, path: string) {
  return `${base}/${path}`.replace(/\/+/g, '/'); // 防止路径中有多余的斜杠
}

function handleClick() {
  if (props.basePath !== route.path) {
    router.push(props.basePath);
  }
}
</script>

<style scoped>
.sidebar-item {
  margin-bottom: 2px; /* 每个项之间的间隔 */
  position: relative;
  left: -40px;
  width: 180px;
}

.menu-item {
  display: block;
  padding: 8px 10px;
  border: 1px solid transparent; /* 初始边框为透明 */
  transition: background-color 0.3s, border-color 0.3s; /* 过渡效果 */
  border-radius: 4px; /* 圆角效果 */
  margin: 0; /* 取消外边距 */
}

.menu-item.hover {
  background-color: #aaaaaa; /* 浅灰色 */
  border-color: #dcdcdc; /* 灰色边框 */
}

.menu-item.active {
  background-color: #1e90ff; /* 深蓝色 */
  color: white; /* 文字颜色 */
}

.menu-item span {
  transition: color 0.3s;
}

.menu-item.active span, .menu-item.hover span {
  color: white; /* 文字颜色变化 */
}


</style>
