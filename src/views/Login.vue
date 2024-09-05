<template>
  <div class="loginOuterPage">
    <div class="loginPage">
      <div class="loginLogoArea">
        <div>此处放场地管理系统Logo</div>
      </div>
      <div class="loginBox" v-loading="isLogging">
        <div class="loginTitle">登录</div>
        <form @submit.prevent="handleLogin">
          <div>
            <label for="username">用户名:</label>
            <el-input v-model="username" id="username" type="text" />
          </div>
          <div>
            <label for="password">密码:</label>
            <el-input v-model="password" id="password" type="password" show-password />
          </div>
          <!-- 新增的隐私协议多选框 -->
          <div>
            <el-checkbox v-model="agreePrivacy">
              已阅读并同意
              <router-link to="/Privacypolicy">隐私协议</router-link>
            </el-checkbox>
          </div>
          <div class="errDisplay">{{ errMsg }}</div>
          <div>没有账号? <router-link to="/UserRegister">点此注册</router-link></div>
          <button type="submit" :disabled="!agreePrivacy">登录</button>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
// import { storeToRefs } from 'pinia';
import CryptoJS from 'crypto-js';
// import { useUserStore } from '@/stores/userStore';
import { getAdminPermission, userLogin } from '@/apis/requests';
import { useUserStore } from '@/stores/userStore';
import { storeToRefs } from 'pinia';

const username = ref('');
const password = ref('');
const isLogging = ref(false);
const errMsg = ref('');
const agreePrivacy = ref(false); // 新增的ref，用于跟踪用户是否同意隐私协议
const userStore = useUserStore();
const { isAuthenticated, userId, userName, adminType } = storeToRefs(userStore);
const router = useRouter();

const handleLogin = async () => {
  if (!username.value) {
    errMsg.value = '用户名不能为空';
    return;
  }

  if (!password.value) {
    errMsg.value = '密码不能为空';
    return;
  }

  if (!agreePrivacy.value) { // 检查用户是否同意隐私协议
    errMsg.value = '请阅读并同意隐私协议';
    return;
  }

  isLogging.value = true;
  errMsg.value = '';
  const encryptedPassword = CryptoJS.SHA256(password.value).toString();
  const loginData = {
    Username: '',
    UserId: '',
    Password: encryptedPassword,
  };

  if (isNaN(+username.value)) {
    loginData.Username = username.value;
  } else {
    loginData.UserId = username.value;
  }

  await userLogin(loginData, adminLoginHandler, LoginErr);
};

const adminLoginHandler = async (res) => {
  const LoginSuccess = () => {
    isAuthenticated.value = true;
    userId.value = res.userId;
    userName.value = res.userName;
    userStore.token = res.token;
    isLogging.value = false;
    // 跳转到home页面
    router.push('/');
    ElMessage.success('登录成功');
  }

  adminType.value = res.userType;
  if(res.userType !== 'normal' && res.userType !== 'system'){
    await getAdminPermission(LoginSuccess, LoginErr);
  }
  else{
    LoginSuccess();
  }
}

const LoginErr = (msg) => {
  isLogging.value = false;
  errMsg.value = '登录失败：' + msg;
}

</script>

<script name="UserLogin">
export default {
  name: 'UserLogin',
};
</script>

<style scoped>
.loginOuterPage {
  display: flex;
  flex-direction: column;
  justify-content: center;
  height: 100vh;
}

.loginPage {
  display: flex;
  padding: 20px;
}

.loginLogoArea {
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

.loginTitle {
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

button:disabled {
  background-color: #CCCCCC;
  cursor: not-allowed;
}

button:hover:not(:disabled) {
  background-color: #0056b3;
}

.errDisplay {
  color: red;
  height: 2em;
}

a, a:visited {
  color: #007BFF; 
  text-decoration: none; 
}

a:hover {
  color: #0056b3; /* 悬停时颜色稍微变深 */
  text-decoration: underline; 
}
</style>
