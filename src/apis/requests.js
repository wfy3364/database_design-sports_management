import httpInstance from "@/utils/http";
import router from "@/router/index"
import { useUserStore } from "@/stores/userStore";
import { storeToRefs } from "pinia";
import { ElMessage } from "element-plus";

// const userStore = useUserStore();
// const { userId, userName, adminType, adminPermission } = storeToRefs(userStore);

async function userLogin(LoginData, isLogging, errMsg) {
  const userStore = useUserStore();
  const { isAuthenticated, userId, userName, adminType } = storeToRefs(userStore);
  await httpInstance.post('/api/User/Login', LoginData).then((res) => {
    if (res.status) {
      isAuthenticated.value = true;
      userId.value = res.loginResult.userId;
      userName.value = res.loginResult.userName;
      adminType.value = res.loginResult.userType;
      userStore.token = res.token;
      isLogging.value = false;
      // 跳转到home页面
      router.push('/');
      ElMessage.success('登录成功');
    } else {
      console.log(res);
      errMsg.value = '登录失败：' + (res.message || '未知错误');
      isLogging.value = false;
    }
  }).catch((err) => {
    console.log(err);
    errMsg.value = '登录失败：' + (err.response?.data?.message || '登录请求异常');
    isLogging.value = false;
  });
}

async function userRegister(RegisterData, isRegistering, registerSuccess, resId, errMsg) {
  await httpInstance.post('/api/User/Register', RegisterData).then((res) => {
    if (res.state) {
      resId.value = res.userId;
      isRegistering.value = false;
      registerSuccess.value = true;
    }
    else {
      console.log(res);
      errMsg.value = '注册失败：' + (res.info || '未知错误');
      isRegistering.value = false;
    }
  }).catch((err) => {
    console.log(err);
    errMsg.value = '注册失败：' + (err.response?.data?.info || '登录请求异常');
    isRegistering.value = false;
  })
}

async function getUserInfo(userData) {
  const userStore = useUserStore();
  const { userId } = storeToRefs(userStore);
  await httpInstance.get(`/api/User/${userId.value}/info`).then((res) => {
    console.log(res);
    userData.value = res;
  }).catch((err) => {
    console.log(err);
    ElMessage.error('获取用户信息失败：' + (err.response?.data?.message || '未知错误'));
  })
}

async function createTeam(teamData, successDialog, resId, createDialog, isCreating, errMsg) {
  await httpInstance.post('/api/Group/create', teamData).then((res) => {
    console.log(res);
    if (res.state) {
      resId.value = res.groupId;
      createDialog.value = false;
      isCreating.value = false;
      successDialog.value = true;
    }
    else {
      isCreating.value = false;
      errMsg.value = '创建团体失败：' + (res.info || '未知错误');
    }
  }).catch((err) => {
    isCreating.value = false;
    errMsg.value = '创建团体失败：' + (err.response?.data?.message || '未知错误');
  })
}

async function fetchTeam(teamData, filteredTeam, isLoading) {
  const userStore = useUserStore();
  const { userId } = storeToRefs(userStore);
  await httpInstance.get(`/api/Group/userallGroup/${userId}`).then((res) => {
    console.log(res);
    if (res.status) {
      teamData.value = res.userGroups;
      filteredTeam.value = teamData.value;
      isLoading.value = false;
    }
    else {
      ElMessage.error('获取团队数据失败：' + (res.message || '未知错误'))
      isLoading.value = false;
    }
  }).catch((err) => {
    console.log(err);
    ElMessage.error('获取团队数据失败：' + (err.response?.data?.message || '未知错误'))
    isLoading.value = false;
  });
}

async function getAllTeams(teamData, isSearching) {
  await httpInstance.get('/api/Group/selectGroups').then((res) => {
    console.log(res);
    teamData.value = res;
    isSearching.value = false;
  }).catch((err) => {
    ElMessage.error('获取团队数据失败：' + (err.response?.data?.message || '未知错误'));
    isSearching.value = false;
  });
}


export { userLogin, userRegister, getUserInfo, fetchTeam, createTeam, getAllTeams };
