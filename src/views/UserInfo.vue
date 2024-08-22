<template>
    <div class="container">
      <h1>用户账号信息</h1>
      <div class="user-info">
        <div class="info-item">
          <label>用户 ID:</label>
          <span>{{ userInfo.id }}</span>
        </div>
        <div class="info-item">
          <label>用户昵称:</label>
          <span>{{ userInfo.nickname }}</span>
        </div>
        <div class="info-item">
          <label>用户姓名:</label>
          <span>{{ userInfo.name }}</span>
        </div>
        <div class="info-item">
          <label>联系电话:</label>
          <span>{{ userInfo.phone }}</span>
        </div>
        <div class="info-item">
          <label>VIP 等级:</label>
          <span>{{ userInfo.vipLevel }}</span>
        </div>
        <div class="info-item">
          <label>预约权限:</label>
          <span>{{ userInfo.appointmentPermission }}</span>
        </div>
        <div class="info-item">
          <label>违约次数:</label>
          <span>{{ userInfo.violationCount }}</span>
        </div>
        <div class="info-item">
          <label>注册时间:</label>
          <span>{{ userInfo.registrationTime }}</span>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue';
  
  const userInfo = ref({});
  
  // 从后端获取用户信息
  onMounted(async () => {
    try {
      const response = await fetch('/api/user-info');
      userInfo.value = await response.json();
      console.error('成功');
    } catch (error) {
      console.error('获取用户信息失败:', error);
      console.log('失败');
    }
  });
  </script>
  
  <style scoped>
  .container {
    max-width: 800px;
    margin: 0 auto;
    padding: 20px;
  }
  
  .user-info {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    grid-gap: 20px;
  }
  
  .info-item {
    display: flex;
    align-items: center;
  }
  
  .info-item label {
    font-weight: bold;
    margin-right: 10px;
  }

  .info-item span {
  color: red;
  }
  </style>