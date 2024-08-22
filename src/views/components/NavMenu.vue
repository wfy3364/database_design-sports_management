<template>
<div class="NavMenu">
  <el-menu>
    <el-menu-item>菜单1</el-menu-item>
    <el-menu-item>菜单2</el-menu-item>
    <router-link :to="{ path: '/AdminDeviceDetail' }">
      <el-menu-item>维修列表</el-menu-item>
    </router-link>
  </el-menu>
</div>
</template>

<style scoped>
.NavMenu{
  width: 100%;
}

</style>