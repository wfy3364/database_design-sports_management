<template>
  <div class="loginOuterPage">
    <div class="loginPage">
      <div class="loginLogoArea">
        <div>此处放场地管理系统Logo</div>
      </div>
      <div class="loginBox">
        <div class="loginTitle">登录</div>
        <form @submit.prevent="handleLogin">
          <div>
            <label for="username">用户名:</label>
            <el-input v-model="username" id="username" type="text" required />
          </div>
          <div>
            <label for="password">密码:</label>
            <el-input v-model="password" id="password" type="password" show-password required />
          </div>
          <div>没有账号? <router-link to="/UserRegister">点此注册</router-link></div>
          <button type="submit">登录</button>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { storeToRefs } from 'pinia';
import CryptoJS from 'crypto-js';
import { useUserStore } from '@/stores/userStore';

const username = ref('');
const password = ref('');
const router = useRouter();
const userStore = useUserStore();
const { isAuthenticated, userId, userName, adminType, adminPermission } = storeToRefs(userStore);

const handleLogin = () => {
  const encryptedPassword = CryptoJS.SHA256(password.value).toString();
  const loginData = {
    username: username.value,
    password: encryptedPassword,
  };

  const success = true; // 模拟后端响应成功

  if (success) {
    isAuthenticated.value = true;
    userId.value = 1;
    userName.value = 'testName';
    adminType.value = 'system';
    // 跳转到home页面
    router.push('/');
  } else {
    alert('用户名或密码错误');
  }
};
</script>

<script name="UserLogin">
export default {
  name: 'UserLogin',
};
</script>


<style scoped>

.loginOuterPage{
  display: flex;
  flex-direction: column;
  justify-content: center;
  height: 100vh;
}

.loginPage{
  display: flex;
  padding: 20px;
}

.loginLogoArea{
  padding: 1em;
  width: calc(100% - 300px);
  border: 1px solid black;
}

.loginBox {
  width: 300px;
  padding: 1em;
  border-radius: 5px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}

.loginTitle{
  display: flex;
  justify-content: center;
  font-size: 30px;
  font-weight: 700;
  margin-bottom: 10px;
}

div {
  margin-bottom: 1em;
}

label {
  margin-bottom: .5em;
  color: #333333;
  display: block;
}

input {
  border: 1px solid #CCCCCC;
  padding: .5em;
  font-size: 1em;
  width: 100%;
  box-sizing: border-box;
}

button {
  padding: 0.7em;
  color: #fff;
  background-color: #007BFF;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  width: 100%;
}

button:hover {
  background-color: #0056b3;
}
</style>