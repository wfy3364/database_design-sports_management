<template>
    <div class="reservation-page">
      <h1>场地预约</h1>
  
      <!-- 检查用户是否登录 -->
      <div v-if="!isLoggedIn">
        <p>您尚未登录，请先登录。</p>
        <router-link to="/login">前往登录页面</router-link>
      </div>
  
      <!-- 用户已登录且有预约权限时显示预约表单 -->
      <div v-else>
        <div v-if="!hasPermission">
          <p>您没有预约权限。</p>
        </div>
        <div v-else>
          <form @submit.prevent="handleReservation">
            
            <!-- 选择预约类型 -->
            <div class="field">
              <label>预约类型：</label>
              <select v-model="reservationType" @change="handleReservationTypeChange">
                <option value="individual">个人</option>
                <option v-if="userGroups.length > 0" value="group">团体</option>
              </select>
            </div>
  
            <!-- 显示团体列表（仅当选择团体时） -->
            <div v-if="reservationType === 'group'" class="field">
              <label>选择团体：</label>
              <select v-model="selectedGroup">
                <option v-for="group in userGroups" :key="group.id" :value="group.id">{{ group.name }}</option>
              </select>
            </div>
  
            <!-- 用户信息或团体信息 -->
            <div class="field">
              <h3>预约信息</h3>
              <p><strong>用户：</strong> {{ user.name }}</p>
              <p v-if="reservationType === 'group'"><strong>团体：</strong> {{ selectedGroupName }}</p>
              <p><strong>场地：</strong> {{ venueName }}</p>
              <p><strong>时间段：</strong> {{ selectedTimeslot }}</p>
            </div>
  
            <!-- 违约处理办法 -->
            <div class="field">
              <label>
                <input type="checkbox" v-model="agreedToTerms" />
                我已阅读并同意违约处理办法
              </label>
            </div>
  
            <!-- 预约和取消按钮 -->
            <div class="buttons">
              <button type="submit" :disabled="!agreedToTerms">预约</button>
              <button type="button" @click="cancelReservation">取消</button>
            </div>
  
          </form>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, computed, onMounted } from 'vue';
  import { useRouter, useRoute } from 'vue-router';
  
  // 模拟用户和团体数据
  const user = ref({
    id: 1,
    name: '张三',
    hasPermission: true, // 模拟用户有预约权限
  });
  
  const userGroups = ref([
    { id: 1, name: '足球俱乐部' },
    { id: 2, name: '篮球俱乐部' },
  ]);
  
  const isLoggedIn = ref(true); // 假设用户已经登录
  const hasPermission = ref(user.value.hasPermission);
  const reservationType = ref('individual'); // 预约类型，默认为个人预约
  const selectedGroup = ref(null); 
  const selectedTimeslot = ref(''); 
  const venueName = ref(''); 
  const agreedToTerms = ref(false); 
  
  const router = useRouter(); 
  const route = useRoute();   
  
  onMounted(() => {
    // 检查是否从场地信息界面跳转，并获取场地名称和时间段
    const { venue, timeslot } = route.query;
    if (venue && timeslot) {
      venueName.value = venue;
      selectedTimeslot.value = timeslot;
    } else {
      // 如果没有传递参数，则设置默认值
      venueName.value = '请选择场地';
      selectedTimeslot.value = '请选择时间段';
    }
  });
  
  // 根据选中的团体ID计算团体名称
  const selectedGroupName = computed(() => {
    const group = userGroups.value.find(group => group.id === selectedGroup.value);
    return group ? group.name : '';
  });
  
  // 处理预约类型变化的函数
  const handleReservationTypeChange = () => {
    if (reservationType.value === 'individual') {
      selectedGroup.value = null; // 如果选择个人预约，清空选中的团体
    } else if (userGroups.value.length > 0) {
      selectedGroup.value = userGroups.value[0].id; // 如果选择团体预约，默认选中第一个团体
    }
  };
  
  // 处理预约提交的函数
  const handleReservation = () => {
    if (!agreedToTerms.value) {
      alert('请先阅读并同意违约处理办法');
      return;
    }
    alert('预约成功！');
  };
  
  // 处理取消预约的函数
  const cancelReservation = () => {
    router.push('/venues'); // 跳转回场地信息页面
  };
  </script>
  
  <style scoped>
  .reservation-page {
    max-width: 600px;
    margin: auto;
    padding: 2em;
    background-color: #f9f9f9;
    border-radius: 8px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  }
  
  .field {
    margin-bottom: 1.5em;
  }
  
  .buttons {
    display: flex;
    gap: 1em;
  }
  
  button {
    padding: 10px 20px;
    background-color: #007BFF;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
  }
  
  button:disabled {
    background-color: #cccccc;
    cursor: not-allowed;
  }
  
  button:hover:not(:disabled) {
    background-color: #0056b3;
  }
  </style>
  