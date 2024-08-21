<template>
  <div class="login">
    <h1>登入</h1>
    <form @submit.prevent="handleLogin">
      <div>
        <label for="username">用户名:</label>
        <input v-model="username" id="username" type="text" required />
      </div>
      <div>
        <label for="password">密码:</label>
        <input v-model="password" id="password" type="password" required />
      </div>
      <button type="submit">登入</button>
    </form>
    <p>是否没有账号? <router-link to="/register">注册</router-link></p>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const username = ref('');
const password = ref('');
const router = useRouter(); 

const handleLogin = () => {
  const encryptedPassword = CryptoJS.SHA256(password.value).toString();
  const loginData = {
    username: username.value,
    password: encryptedPassword,
  };

  const success = true; // 模拟后端响应成功

  if (success) {
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
.login {
  max-width: 300px;
  margin: auto;
  padding: 1em;
  border-radius: 5px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
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