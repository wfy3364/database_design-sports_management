<template>
    <div class="register">
      <h1>注册</h1>
      <form @submit.prevent="handleRegister">
        <div>
          <label for="fullName">真实姓名:</label>
          <input v-model="fullName" id="fullName" type="text" required />
        </div>
        <div>
          <label for="nickname">用户名:</label>
          <input v-model="nickname" id="nickname" type="text" required />
        </div>
        <div>
          <label for="password">密码:</label>
          <input v-model="password" id="password" type="password" required />
        </div>
        <div>
          <label for="confirmPassword">确认密码:</label>
          <input v-model="confirmPassword" id="confirmPassword" type="password" required />
        </div>
        <div>
          <label for="phone">电话号码:</label>
          <input v-model="phone" id="phone" type="text" required />
        </div>
        <button type="submit">注册</button>
      </form>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue';
  import { useRouter } from 'vue-router';
  
  const fullName = ref('');
  const nickname = ref('');
  const password = ref('');
  const confirmPassword = ref('');
  const phone = ref('');
  const router = useRouter();
  
  const handleRegister = () => {
    if (!validateInputs()) {
      alert('请确保所有字段填写正确。');
      return;
    }
    // 模拟生成用户ID
  const userId = Math.floor(Math.random() * 1000000);

    // 创建注册数据对象
  const registerData = {
    id: userId,
    fullName: fullName.value,
    nickname: nickname.value,
    password: password.value, // 这里可以加密密码后再传输
    phone: phone.value,
  };

  console.log('Register Data:', registerData); // 调试时查看注册数据
  // 模拟后端延迟响应
  setTimeout(() => {
    const success = true; // 模拟后端响应成功
    if (success) {
      alert('注册成功');
      router.push('/login'); // 跳转到登录页面
    } else {
      alert('注册失败');
    }
  },); 
};
  
  const validateInputs = () => {
    // 检查所有字段是否已填写
    if (!fullName.value || !nickname.value || !password.value || !confirmPassword.value || !phone.value) {
      return false;
    }
    // 检查密码和确认密码是否匹配
    if (password.value !== confirmPassword.value) {
      alert('密码不匹配.');
      return false;
    }
    return true;
  };
  </script>
  
  <style scoped>
  .register {
    max-width: 400px;
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
  