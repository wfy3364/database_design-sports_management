<template>
    <div class="container">
      <div class="userInfoTitle">用户账号信息</div>
      <!-- <div class="user-info">
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
      </div> -->
      <el-descriptions column="2" border>
        <!-- <el-descriptions-item label="用户ID" label-class-name="itemLabel">
          <div class="itemContent">{{ userInfo.id }}</div>
        </el-descriptions-item> -->
        <el-descriptions-item min-width="">
          <template #label>
            <div class="itemLabel">用户ID</div>
          </template>
          {{ userData.userId }}
        </el-descriptions-item>
        <el-descriptions-item min-width="">
          <template #label>
            <div class="itemLabel">用户昵称</div>
          </template>
          {{ userData.username }}
        </el-descriptions-item>
        <el-descriptions-item width="">
          <template #label>
            <div class="itemLabel">用户姓名</div>
          </template>
          {{ userData.realName }}
        </el-descriptions-item>
        <el-descriptions-item width="">
          <template #label>
            <div class="itemLabel">联系电话</div>
          </template>
          {{ userData.contactNumber }}
        </el-descriptions-item>
        <el-descriptions-item width="">
          <template #label>
            <div class="itemLabel">是否是VIP</div>
          </template>
          <div v-if="+userData.isVip">是</div>
          <div v-else>否</div>
        </el-descriptions-item>
        <el-descriptions-item width="">
          <template #label>
            <div class="itemLabel">预约权限</div>
          </template>
          <div v-if="userData.reservationPermission === 'y'">有</div>
          <div v-else>无</div>
        </el-descriptions-item>
        <el-descriptions-item width="">
          <template #label>
            <div class="itemLabel">违约次数</div>
          </template>
          {{ userData.violationCount }}
        </el-descriptions-item>
        <el-descriptions-item width="">
          <template #label>
            <div class="itemLabel">注册时间</div>
          </template>
          {{ convertTime(userData.registrationDate) }}
        </el-descriptions-item>
      </el-descriptions>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue';
  import { getUserInfo } from '@/apis/requests'
  import { convertTime } from '@/apis/utils'
  //真实数据
  // const userInfo = ref({

  // });
  
  //测试数据
  // const userInfo = {
  //   id: 'U001',
  //   nickname: '小明',
  //   name: '王明',
  //   phone: '13800138000',
  //   vipLevel: '普通会员',
  //   appointmentPermission: '允许',
  //   violationCount: 0,
  //   registrationTime: '2024-03-15 10:00:00'
  // }
  const userData = ref({
    userId: '',
    username: '',
    realName: '',
    contactNumber: '',
    isVip: '',
    reservationPermission: '',
    registrationDate: '',
    violationCount: 0,
  });
  
  // 从后端获取用户信息
  // onMounted(async () => {
  //   try {
  //     const response = await fetch('/api/user-info');
  //     userInfo.value = await response.json();
  //     console.error('成功');
  //   } catch (error) {
  //     console.error('获取用户信息失败:', error);
  //     console.log('失败');
  //   }
  // });
  onMounted(async () => {
    await getUserInfo(userData);
  });
  </script>
  
  <style scoped>
  .container {
    display: flex;
    flex-direction: column;
    margin: 10px;
    background-color: white;
    border-radius: 5px;
    border: 1px solid lightgray;
    /* padding: 20px; */
  }
  
  .userInfoTitle{
    display: flex;
    justify-content: center;
    font-size: 25px;
    font-weight: 700;
    padding: 10px;
    border-bottom: 1px solid black;
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

  .itemLabel{
    font-weight: 700;
    /* width: 100px; */
  }

  </style>