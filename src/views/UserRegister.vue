<template>
  <div class="registerOuterPage">
    <div class="registerPage">
      <div class="registerLogoArea">
        <div>此处放场地管理系统Logo</div>
      </div>
      <div class="registerBox" v-loading="isRegistering">
        <div class="registerTitle">注册</div>
        <form>
          <div>
            <label for="fullName">真实姓名:</label>
            <el-input v-model="fullName" id="fullName" type="text" />
          </div>
          <div>
            <label for="nickname">用户名:</label>
            <el-input v-model="nickname" id="nickname" type="text" />
          </div>
          <div>
            <label for="password">密码:</label>
            <el-input v-model="password" id="password" type="password" show-password />
          </div>
          <div>
            <label for="confirmPassword">确认密码:</label>
            <el-input v-model="confirmPassword" id="confirmPassword" type="password" show-password />
          </div>
          <div>
            <label for="phone">电话号码:</label>
            <el-input v-model="phone" id="phone" type="text" />
          </div>
          <!-- 新增的隐私协议多选框 -->
          <div>
            <el-checkbox v-model="agreePrivacy">
              已阅读并同意
              <router-link to="/Privacypolicy">隐私协议</router-link>
            </el-checkbox>
          </div>
          <div class="errDisplay">{{ errMsg }}</div>
          <div>已有账号? <router-link to="/login">点此登录</router-link></div>
          <el-button class="registerButton" @click="validateInputs() && (registerConfirm = true)" 
          type="primary" size="large" :disabled="!agreePrivacy">注册</el-button>
        </form>
      </div>
    </div>
  </div>
  <el-dialog v-model="registerConfirm" title="注册确认">
    <div>请确认信息填写准确无误，真实姓名注册后无法修改！</div>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="registerConfirm = false">取消</el-button>
        <el-button type="primary" @click="handleRegister">
          确认
        </el-button>
      </div>
    </template>
  </el-dialog>
  <el-dialog v-model="successConfirm" title="注册信息" :before-close="handleSuccess">
    <div>注册成功！</div>
    <div>用户ID：{{ resUserId }}</div>
    <template #footer>
      <div class="dialog-footer">
        <el-button type="primary" @click="handleSuccess">确认</el-button>
      </div>
    </template>
  </el-dialog>
</template>
  
<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { userRegister } from '@/apis/requests';
import CryptoJS from 'crypto-js';

const registerConfirm = ref(false);
const successConfirm = ref(false);
const isRegistering = ref(false);
const resUserId = ref('');
const fullName = ref('');
const nickname = ref('');
const password = ref('');
const confirmPassword = ref('');
const phone = ref('');
const errMsg = ref('');
const agreePrivacy = ref(false); // 用于跟踪用户是否同意隐私协议
const router = useRouter();

const handleRegister = async () => {
  if (!validateInputs()) {
    return;
  }
  isRegistering.value = true;
  registerConfirm.value = false;
  const encryptedPassword = CryptoJS.SHA256(password.value).toString();

  const registerData = {
    UserName: nickname.value,
    Password: encryptedPassword,
    ContactNumber: phone.value,
    UserType: 'normal',
    RealName: fullName.value,
  };

  await userRegister(registerData, isRegistering, successConfirm, resUserId, errMsg)
};

const validateInputs = () => {
  errMsg.value = '';
  const requiredItems = [
    { item: fullName, name: "真实姓名"},
    { item: nickname, name: "用户名"},
    { item: password, name: "密码"},
    { item: confirmPassword, name: "确认密码"},
    { item: phone, name: "电话号码"}
  ];
  for(const requiredItem of requiredItems){
    if(!requiredItem.item.value){
      errMsg.value = requiredItem.name + '不能为空';
      return false;
    }
  }
  if (password.value !== confirmPassword.value) {
    errMsg.value = '两次输入的密码不匹配';
    return false;
  }
  return true;
};

const handleSuccess = () => {
  successConfirm.value = false;
  router.push('/login'); // 跳转到登录页面
}

</script>
  
<style scoped>

.registerOuterPage{
  display: flex;
  flex-direction: column;
  justify-content: center;
  height: 100vh;
}

.registerPage{
  display: flex;
  padding: 20px;
}

.registerLogoArea{
  padding: 1em;
  width: calc(100% - 400px);
  border: 1px solid black;
}

.registerBox {
  width: 400px;
  margin: auto;
  padding: 1em;
  border-radius: 5px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}

.registerTitle{
  display: flex;
  justify-content: center;
  font-size: 30px;
  font-weight: 700;
  margin-bottom: 5px;
}

div {
  margin-bottom: 5px;
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

.registerButton{
  width: 100%;
}

.registerButton:disabled {
  background-color: #CCCCCC !important; /* 设置禁用状态下的背景色为灰白色 */
  color: #ffffff !important; /* 禁用状态下的文字颜色 */
  cursor: not-allowed; /* 禁用状态下的鼠标样式 */
}

.errDisplay{
  color: red;
  height: 2em;
}

a, a:visited {
  color: #007BFF; 
  text-decoration: none; 
}

a:hover {
  color: #0056b3; /* 悬停时颜色稍微变深 */
  text-decoration: underline; /* 悬停时加下划线 */
}

</style>
