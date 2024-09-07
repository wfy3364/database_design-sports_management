<template>
  <div class="container">
    <div class="userInfoTitle" v-if="adminType == 'normal' ">
      <div class="title">用户账号信息</div>
      <!-- [修改位置] 添加编辑按钮 -->
      <el-button type="primary" @click="showEditDialog" class = "edit-button">编辑</el-button>
    </div>
    <div class="userInfoTitle" v-if="adminType != 'normal'">
      <div class="title">管理员账号信息</div>
      <!-- [修改位置] 添加编辑按钮 -->
      <el-button type="primary" @click="showEditDialog" class = "edit-button">编辑</el-button>
    </div>
    <el-descriptions :column="2" border v-if="adminType == 'normal'">
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
          <div class="itemLabel">注册时间</div>
        </template>
        {{ convertTime(userData.registrationDate) }}
      </el-descriptions-item>
      <el-descriptions-item width="">
        <template #label>
          <div class="itemLabel">预约权限与违约情况</div>
        </template>
        <div v-if="userData.violationCount <= 5">正常 (总违约次数:{{ userData.violationCount }})</div>
        <div v-else>封禁中 (总违约次数:{{ userData.violationCount }})</div>
      </el-descriptions-item>
    </el-descriptions>
    <el-descriptions :column="2" border v-if="adminType != 'normal'">
      <el-descriptions-item min-width="">
        <template #label>
          <div class="itemLabel">管理员ID</div>
        </template>
        {{ userData.userId }}
      </el-descriptions-item>
      <el-descriptions-item width="">
        <template #label>
          <div class="itemLabel">管理员姓名</div>
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
          <div class="itemLabel">管理权限</div>
        </template>
        {{ adminTypeName[adminType] }}
      </el-descriptions-item>
      <el-descriptions-item width="">
        <template #label>
          <div class="itemLabel">管理场地</div>
        </template>
        <!-- {{ adminPermission.venue }} -->
        <el-tag v-for="venue in adminPermission.venue">{{ venue.name }}</el-tag>
      </el-descriptions-item>
    </el-descriptions>
    <div class="StatisticsContent" v-if="adminType == 'normal'">
      <div class="subTitleHeader">
        <div class="subTitleText">个人预约统计</div>
        <div class="controls">
            <el-radio-group v-model="revenueType">
              <el-radio-button value="daily">前一周</el-radio-button>
              <el-radio-button value="monthly">前一月</el-radio-button>
              <el-radio-button value="yearly">前一年</el-radio-button>
            </el-radio-group>
        </div>
      </div>
      <div class="chart-container" v-if="showStatistics()">
        <Line :data="revenueData" :options="revenueChart" class="line-chart" />
      </div>
    </div>
    <div class="SettingButton">
      <div class="button-container">
          <el-button class="button" @click="showPasswordDialog">修改密码</el-button>
          <el-button class="button" @click="showPrivacyAgreement">查看隐私协议</el-button>
          <el-button class="button" @click="showQuitDialog" type="danger">退出登录</el-button>
      </div>
    </div>
  </div>

  <div v-if="editInformation && adminType == 'normal'" class="modal" @click="closeEditDialog">
    <div class="modal-content" @click.stop>
      <div class="modalHeader">
        <div class="modalTitle">编辑信息</div>
        <el-button class="smallButton" type="danger" @click="closeEditDialog">关闭</el-button>
      </div>
      <div class="modalBody">
        <el-form :model="tempUserData" ref="form" label-width="120px">
          <el-form-item label="昵称" prop="username">
            <el-input v-model="tempUserData.username" placeholder="请输入昵称"></el-input>
          </el-form-item>
          <el-form-item label="姓名" prop="realname">
            <el-input v-model="tempUserData.realName" placeholder="请输入姓名"></el-input>
          </el-form-item>
          <el-form-item label="联系电话" prop="phone">
            <el-input v-model="tempUserData.contactNumber" placeholder="请输入联系电话"></el-input>
          </el-form-item>
            <div class="smallButtonContainer"> 
              <el-button class="smallButton" @click="closeEditDialog">取消</el-button>
              <el-button class="smallButton" type="primary" @click="updateUserInfo">保存</el-button>
            </div>
        </el-form>
      </div>
    </div>
  </div>

  <div v-if="editInformation && adminType != 'normal'" class="modal" @click="closeEditDialog">
    <div class="modal-content" @click.stop>
      <div class="modalHeader">
        <div class="modalTitle">编辑信息</div>
        <el-button class="smallButton" type="danger" @click="closeEditDialog">关闭</el-button>
      </div>
      <div class="modalBody">
        <el-form :model="tempUserData" ref="form" label-width="120px">
          <el-form-item label="姓名" prop="realname">
            <el-input v-model="tempUserData.realName" placeholder="请输入姓名"></el-input>
          </el-form-item>
          <el-form-item label="联系电话" prop="phone">
            <el-input v-model="tempUserData.contactNumber" placeholder="请输入联系电话"></el-input>
          </el-form-item>
            <div class="smallButtonContainer"> 
              <el-button class="smallButton" @click="closeEditDialog">取消</el-button>
              <el-button class="smallButton" type="primary" @click="updateUserInfo">保存</el-button>
            </div>
        </el-form>
      </div>
    </div>
  </div>

  <div v-if="changePassword && adminType == 'normal'" class="modal">
    <div class="modal-content2" @click.stop>
      <form @submit.prevent="handleLogin">
        <div class="modalHeader">
          <div class="modalTitle">修改密码</div>
        </div>
        <div>
          <label for="oldPassword">原密码:</label>
          <el-input v-model="oldPassword" id="oldPassword" type="password" />
        </div>
        <div>
          <label for="password">密码:</label>
          <el-input v-model="password" id="password" type="password" show-password />
        </div>
        <div>
          <label for="confirmPassword">确认密码:</label>
          <el-input v-model="confirmPassword" id="confirmPassword" type="password" show-password />
        </div>
        <div class="errDisplay">{{ errMsg }}</div>
      </form>
      <div class="smallButtonContainer"> 
        <el-button class="smallButton" @click="closePasswordDialog">关闭</el-button>
        <el-button class="smallButton" type="primary" @click="handleRegister">确认</el-button>
      </div>
    </div>
  </div>

  <div v-if="quitConfirm" class="modal" @click="closeQuitDialog">
    <div class="modal-content2" @click.stop>
      <div class="modalHeader">
        <div class="modalTitle">退出登录？</div>
      </div>
      <div class="smallButtonContainer"> 
        <el-button class="smallButton" type="danger" @click="logout">确认</el-button>
        <el-button class="smallButton" @click="closeQuitDialog">取消</el-button>
      </div>
    </div>
  </div>
</template>
  
  <script setup>
  import { ref, onMounted, computed } from 'vue';
  import { getUserInfo, getAdminInfo, getAdminManagedItems } from '@/apis/requests'
  import { convertTime } from '@/apis/utils'
  import { Line } from 'vue-chartjs';
  import { Chart as ChartJS, LineElement, PointElement, CategoryScale, LinearScale, Filler, Title } from 'chart.js';
  import CryptoJS from 'crypto-js';
  import { useRouter } from 'vue-router';
  import { userModifiedInfo, userModifiedPassword, getStatistics } from '@/apis/requests';
  import { useUserStore } from '@/stores/userStore';
  import { storeToRefs } from 'pinia';

  ChartJS.register(LineElement, PointElement, CategoryScale, LinearScale, Filler, Title);

  const userStore = useUserStore();
  const { isAuthenticated, token, userId, userName, adminType, adminPermission } = storeToRefs(userStore);

  // const registerConfirm = ref(false);
  const successConfirm = ref(false);
  // const isRegistering = ref(false);
  const resUserId = ref('');  //待填
  const fullName = ref('');    //待填
  const nickname = ref('');    //待填
  const oldPassword = ref('');
  const password = ref('');
  const confirmPassword = ref('');
  const phone = ref('');    //待填
  const errMsg = ref('');
  const router = useRouter();

  const editInformation = ref(null); //编辑信息界面
  const changePassword = ref(null); //修改密码界面
  const quitConfirm = ref(null); //登出确认界面

  const adminTypeName = {
    'system': '系统管理员',
    'venue': '场地管理员',
    'venue-device': '场地设备管理员'
  }


  // onMounted ( () => {
  //   console.log(adminType.value);
  // })
  const showEditDialog = () => {
    editInformation.value = 1;
  }
  const closeEditDialog = () => {
    editInformation.value = null;
  }
  // 保存用户信息
  const updateUserInfo = () => {
    if(adminType.value == 'normal'){
      userData.value.username = tempUserData.value.username;
      userData.value.realName = tempUserData.value.realName;
      userData.value.contactNumber = tempUserData.value.contactNumber;
      editInformation.value = null;
      const userInfo = {
        username: userData.value.username,
        contactNumber: userData.value.contactNumber,
        realName: userData.value.realName
      };
      userModifiedInfo(userInfo, successHandler2, errHandler);
    }
    else{
      userData.value.realName = tempUserData.value.realName;
      userData.value.contactNumber = tempUserData.value.contactNumber;
    }
  };

  const showPasswordDialog = () => { //打开修改密码界面
    errMsg.value = '';
    changePassword.value = 1;
  }
  const closePasswordDialog = () => { //关闭修改密码界面
    changePassword.value = null;
  }
  const changePasswordSuccess = () => { //修改密码成功
    changePassword.value = null;
  }

  const showQuitDialog = () => {
    quitConfirm.value = 1;
  }
  const closeQuitDialog = () => {
    quitConfirm.value = null;
  }
  const logout = () => {
    isAuthenticated.value = false;
    userId.value = '';
    userName.value = '';
    adminType.value = '';
    adminPermission.value = {
      venue: [],
      device: [],
    };
    router.push('/Login');
  };

  const showPrivacyAgreement = () => {
    router.push('/Privacypolicy');
  }

  const handleRegister = async () => {
    if (!validateInputs()) {
      return;
    }
    // isRegistering.value = true;
    // registerConfirm.value = false;
    const encryptedOldPassword = CryptoJS.SHA256(oldPassword.value).toString();
    const encryptedPassword = { NewPassword: CryptoJS.SHA256(password.value).toString() };

    // await userRegister(registerData, isRegistering, successConfirm, errMsg)
    userModifiedPassword(encryptedOldPassword, encryptedPassword, successHandler3, errHandler);
    changePassword.value = null;
  };
  
  const validateInputs = () => {
    // 检查所有字段是否已填写
    errMsg.value = '';
    const requiredItems = [
      { item: oldPassword, name: "原密码"},
      { item: password, name: "密码"},
      { item: confirmPassword, name: "确认密码"}
    ];
    for(const requiredItem of requiredItems){
      if(!requiredItem.item.value){
        errMsg.value = requiredItem.name + '不能为空';
        return false;
      }
    }
    // 检查密码和确认密码是否匹配
    if (password.value !== confirmPassword.value) {
      errMsg.value = '两次输入的密码不匹配';
      return false;
    }
    return true;
  };

  
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
    violationCount: 1,
  });

  const tempUserData = ref({
    userId: userData.value.userId,
    username: userData.value.username,
    realName: userData.value.realName,
    contactNumber: userData.value.contactNumber,
    isVip: userData.value.isVip,
    reservationPermission: userData.value.reservationPermission,
    registrationDate: userData.value.registrationDate,
    violationCount: userData.value.violationCount,
  });

  // tempUserData.map((record) => {
  //   record.userId = userData.userId;
  //   record.username = userData.username;
  //   record.realName = userData.realName;
  //   record.contactNumber = userData.contactNumber;
  //   record.isVip = userData.isVip;
  //   record.reservationPermission = userData.reservationPermission;
  //   record.registrationDate = userData.registrationDate;
  //   record.violationCount = userData.violationCount;
  //   return record;
  // })

  const revenueType = ref('daily');
  const getMaxValue = (data) => Math.max(...data);

  const revenueDataList = ref({
    daily: {
      labels: ['08-01', '08-02', '08-03', '08-04', '08-05', '08-06', '08-07'],
      data: [100, 200, 150, 100, 200, 150, 100, 200, 150],
    },
    monthly: {
      labels: ['07-27', '07-28', '07-29', '07-30', '07-31', '08-01', '08-02', '08-03', '08-04', '08-05', '08-06', '08-07', '08-08', '08-09', '08-10', '08-11', '08-12', '08-13', '08-14', '08-15', '08-16', '08-17', '08-18', '08-19', '08-20', '08-21', '08-22', '08-23', '08-24', '08-25'],
      data: [3000, 2800, 3200, 3000, 2800, 3200, 3000, 2800, 3200, 3000, 2800, 3200, 3000, 2800, 3200, 3000, 2800, 3200, 3000, 2800, 3200, 3000, 2800, 3200, 3000, 2800, 3200, 3000, 2800, 3200],
    },
    yearly: {
      labels: ['2023-09', '2023-10', '2023-11', '2023-12', '2024-01', '2024-02', '2024-03', '2024-04', '2024-05', '2024-06', '2024-07', '2024-08'],
      data: [36000, 34000, 33000, 36000, 34000, 33000, 36000, 34000, 33000, 36000, 34000, 33000],
    }
  });
  const revenueData = computed(() => ({
    labels: revenueDataList.value[revenueType.value].labels,
    datasets: [
      {
        label: '营收量',
        data: revenueDataList.value[revenueType.value].data,
        borderColor: '#5733FF',
        backgroundColor: 'rgba(87, 51, 255, 0.2)',
        borderWidth: 3,
        fill: true,
      },
    ],
  }));

  const revenueChart = computed(() => ({
    responsive: true,
    plugins: {
      legend: { position: 'top' },
      title: {
        display: true,
        text: '近期预约记录',
        font: { size: 15, weight: 'bold' },
        padding: { bottom: 20 }
      },
      tooltip: {
        callbacks: { label: (tooltipItem) => `营收: ${tooltipItem.raw}` },
      },
    },
    scales: {
      y: {
        min: 0,
        max: getMaxValue(revenueData.value.datasets[0].data) * 1.2, //上限改变
        ticks: { stepSize: Math.max(100, getMaxValue(revenueData.value.datasets[0].data) / 5) },
        title: { display: true, text: '营收量' }
      },
      x: {
        title: { display: true, text: '时间' }
      }
    },
    elements: {
      line: { tension: 0.1 },
      point: {
        radius: 5,
        backgroundColor: '#FF5733',
        borderColor: '#FFFFFF',
        borderWidth: 2,
      },
    },
  }));
  function successHandler(res){
    userData.value = res;
  }

  function successHandler2(res){
    ElMessage.success("用户信息修改成功");
  }

  function successHandler3(res){
    ElMessage.success("用户密码修改成功");
  }

  function getAdminInfoSuccess(res){
    console.log(res.data);
    userData.value = res.data;
    userData.value.userId = userId.value;
  }

  function getAdminItemsSuccess(res){
    console.log("success");
    console.log(res);
    adminPermission.value.device = res.data.managedEquipment;
    adminPermission.value.venue = res.data.managedVenues;
    console.log(adminPermission.value);
  }

  function errHandler(msg){
    ElMessage.error(msg);
  }

  onMounted(async () => {
    if(adminType.value == 'normal'){
      await getUserInfo(successHandler, errHandler);
    }
    else{
      await getAdminInfo(getAdminInfoSuccess, errHandler);
      await getAdminManagedItems(getAdminItemsSuccess, errHandler)
    }
  });

  function showStatistics(){
    getStatistics("羽毛球", getStatisticsSuccess, getStatisticsFailed);
    return true;
  }

  function getStatisticsSuccess(res){
    // revenueDataList.value = res.reserveDescription;
  }

  function getStatisticsFailed(img){
    ElMessage.error(img);
  }

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

  .StatisticsContent{
    padding: 10px;
  }

  .subTitleHeader{
    display: flex;
    justify-content: center;
    line-height: var(--el-component-size);
    border-bottom: 1px solid black;
  }

  .subTitleText{
    /* justify-content: center; */
    margin-right: auto;
    padding: 10px;
    font-size: 18px;
    font-weight: 700;
  }

  .controls {
    display: flex;
    margin-left: auto;
    gap: 10px;
    width: 300px;
  }

  .chart-container {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 80%;
    margin-left: auto;
    margin-right: auto;
    margin-top: 30px;
    margin-bottom: 30px;
    padding: 10px;
  }


  .line-chart {
    width: 100%;
    height: 1000px;
    margin: 0;
    padding: 0;
  }

  .title{
    display: flex;
    justify-content: center;
    position: relative;
    width: 50%;
    left: 25%;
    font-size: 20px;
    font-weight: 700;
    margin-bottom: 10px;
  }

  .edit-button {
    margin-left: auto;
  }

  .button-container {
    display: flex;
    flex-direction: column;
    justify-content: center; /* 横向居中 */
    align-items: center; /* 垂直居中 */
    /* height: 100px; */
    gap: 20px;
  }

  .button {
    /* flex: 0.7; */
    /* padding: 10px; */
    font-size: 18px;
    height: 40px;
    width: 90%;
    margin: 0px;
  }

  .modal {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.6); /* 半透明背景 */
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
  }

  .modal-content {
    width: 80%;
    max-width: 800px;
    background-color: #fff;
    padding: 20px;
    border-radius: 8px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
    position: relative;
  }

  .modal-content2 {
    width: 60%;
    max-width: 600px;
    background-color: #fff;
    padding: 20px;
    border-radius: 8px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
    position: relative;
  }

  .modalHeader {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
  }

  .modalTitle {
    font-size: 22px;
    font-weight: bold;
  }

  .smallButtonContainer {
    display: flex;
    justify-content: flex-end;
    /* margin-right: auto; */
  }

  .smallButton {
    /* margin-right: auto; */
    margin-top: 10px;
  }

  /* .quitButton {
    font-size: 18px;
    height: 40px;
    width: 100px;
    margin: 30px;
  } */

  .errDisplay{
    color: red;
    height: 2em;
  }

  .modalBody {
    margin-top: 20px;
  }

  .SettingButton {
    margin-top: 5%;
    padding: 10px;
  }

  </style>