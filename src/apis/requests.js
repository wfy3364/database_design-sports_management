import httpInstance from "@/utils/http";
import router from "@/router/index"
import { useUserStore } from "@/stores/userStore";
import { storeToRefs } from "pinia";
import { ElMessage, ElStep } from "element-plus";

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

// 团体操作接口
async function createTeam(teamData, successHandler, errHandler) {
  await httpInstance.post('/api/Group/create', teamData).then((res) => {
    console.log(res);
    if (res.state) {
      successHandler(res.groupId);
    }
    else {
      errHandler(res.info || '未知错误');
    }
  }).catch((err) => {
    errHandler(err.response?.data?.message || '未知错误');
  })
}

async function fetchTeam(successHandler, errHandler) {
  const userStore = useUserStore();
  const { userId } = storeToRefs(userStore);
  await httpInstance.get(`/api/Group/userallGroup/${userId.value}`).then((res) => {
    console.log(res);
    if (res.status) {
      successHandler(res.userGroups);
    }
    else {
      errHandler(res.message || '未知错误');
    }
  }).catch((err) => {
    errHandler(err.response?.data?.message || '未知错误');
  });
}

async function getAllTeams(successHandler, errHandler) {
  await httpInstance.get('/api/Group/selectGroups').then((res) => {
    successHandler(res);
  }).catch((err) => {
    errHandler(err.response?.data?.message || '未知错误');
  });
}

async function getTeamName(teamId, successHandler, errHandler) {
  await httpInstance.get(`api/Group/${teamId}`).then((res) => {
    // console.log(res);
    successHandler({ groupId: res.groupId, groupName: res.groupName });
  }).catch((err) => {
    errHandler(err.response?.data || '未知错误');
  })
}

async function getTeamDetail(teamId, successHandler, errHandler) {
  await httpInstance.get(`api/Group/details/${teamId}`).then((res) => {
    console.log(res);
    if (res.status) {
      successHandler(res.data);
    }
    else {
      errHandler(res.message);
    }
  }).catch((err) => {
    console.log(err);
    errHandler(err.response?.data?.message || '未知错误')
  })
}

async function addTeamUser(groupId, joinData, successHandler, errHandler) {
  await httpInstance.post(`/api/Group/${groupId}/adduser`, joinData).then((res) => {
    console.log(res);
    if (res.state) {
      successHandler();
    }
    else {
      errHandler(res.info);
    }

  }).catch((err) => {
    console.log(err);
    errHandler(err.response?.data || '未知错误');
  })
}

async function removeTeamUser(groupId, removeData, successHandler, errHandler) {
  await httpInstance.post(`api/Group/${groupId}/removeuser`, removeData).then((res) => {
    if (res.state) {
      successHandler();
    }
    else {
      errHandler(res.info || '未知错误');
    }
  }).catch((err) => {
    console.log(err);
    errHandler(err.response?.data || '未知错误');
  })
}

async function updateUserRole(updateData, successHandler, errHandler) {
  await httpInstance.post('/api/Group/updateUserRole', updateData).then((res) => {
    if (res.state) {
      successHandler();
    }
    else {
      errHandler(res.info || '未知错误');
    }
  }).catch((err) => {
    console.log(err);
    errHandler(err.response?.data.info || '未知错误');
  })
}

// 通知类接口
async function getUserNotice(userId, successHandler, errHandler) {
  await httpInstance.get(`api/User/${userId}/notifications`).then((res) => {
    successHandler(res);
  }).catch((err) => {
    errHandler(err.response?.data || '未知错误');
  })
}

async function deleteUserNotice(noticeId, successHandler, errHandler) {
  await httpInstance.delete(`api/User/deleteNotice/${noticeId}`).then((res) => {
    if (res.state) {
      successHandler();
    }
    else {
      errHandler(res.info);
    }
  }).catch((err) => {
    errHandler(err.response?.data?.info);
  })
}


async function getRepairData(successHandler, errHandler) {
  await httpInstance.get('api/Venue/GetAllRepairRecords').then((res) => {
    console.log(res);
    if (res.state) {
      successHandler(res.data);
    }
    else {
      errHandler(res.info);
    }
  }).catch((err) => {
    errHandler(err.response?.data?.info || '未知错误');
  })
}

// 主界面接口
async function getAllPublicNotice(successHandler, errHandler) {
  await httpInstance.get('api/Announcement/publicNoticeData').then((res) => {
    if (res.status) {
      successHandler(res.data)
    }
    else {
      errHandler(res.info || '未知错误');
    }
  }).catch((err) => {
    console.log(err);
    errHandler(err.response?.data?.message || '未知错误');
  })
}

async function getPublicNoticeDetail(noticeId, successHandler, errHandler) {
  await httpInstance.get(`/api/Announcement/getAnnouncementDetails/${noticeId}`).then((res) => {
    if (res.status) {
      successHandler(res.data);
    }
    else {
      errHandler(res.info);
    }
  }).catch((err) => {
    errHandler(err.response?.data?.info || '未知错误');
  });
}

async function addPublicNotice(noticeData, successHandler, errHandler) {
  await httpInstance.post('/api/Announcement/addAnnouncement', noticeData).then((res) => {
    if (res.status) {
      successHandler(res.announcementId);
    }
    else {
      errHandler(err.info || '未知错误');
    }
  }).catch((err) => {
    console.log(err);
    errHandler(err.response?.data?.info || '未知错误');
  })
}

async function modifyPublicNotice(noticeData, successHandler, errHandler) {
  await httpInstance.put('/api/Announcement/updateAnnouncement', noticeData).then((res) => {
    if (res.status) {
      successHandler();
    }
    else {
      errHandler(res.info || '未知错误');
    }
  }).catch((err) => {
    errHandler(err.response?.data?.info || '未知错误');
  })
}

export {
  userLogin, userRegister, getUserInfo, fetchTeam, createTeam, getAllTeams, getTeamName,
  getTeamDetail, addTeamUser, updateUserRole, removeTeamUser, getUserNotice, deleteUserNotice,
  getRepairData, getAllPublicNotice, getPublicNoticeDetail, addPublicNotice, modifyPublicNotice
};
