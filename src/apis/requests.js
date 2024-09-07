import httpInstance from "@/utils/http";
import router from "@/router/index"
import { useUserStore } from "@/stores/userStore";
import { storeToRefs } from "pinia";

// const userStore = useUserStore();
// const { userId, userName, adminType, adminPermission } = storeToRefs(userStore);

// 用户接口操作
async function userLogin(LoginData, successHandler, errHandler, isLogging, errMsg) {
  await httpInstance.post('/api/User/Login', LoginData).then((res) => {
    if (res.status) {
      successHandler(res.loginResult);
    } else {
      console.log(res);
      errHandler(res.message || '未知错误');
    }
  }).catch((err) => {
    errHandler(err.response?.data?.message || '登录请求异常');
  });
}

//修改用户信息
async function userModifiedInfo(userInfo, successHandler, errHandler) {
  const userStore = useUserStore();
  const { isAuthenticated, userId, userName, adminType } = storeToRefs(userStore);
  await httpInstance.put(`/api/User/${userId.value}/updateInfo`, userInfo).then((res) => {

    console.log(res);
    if (res.state) {
      successHandler();
    } else {
      console.log(res);
      // errHandler();
      errHandler(res.info);
    }
  }).catch((err) => {
    console.log(err);
    errHandler("未知错误")
  });
}

//修改用户密码
async function userModifiedPassword(oldPassword, newPassword, successHandler, errHandler) {
  const userStore = useUserStore();
  const { isAuthenticated, userId, userName, adminType } = storeToRefs(userStore);
  await httpInstance.put(`/api/User/${userId.value}/updatePassword`, newPassword).then((res) => {
    if (res.state) {
      successHandler(res);
      console.log(res.originalPassword);
      console.log(oldPassword);
    } else {
      console.log(res);
      errHandler();
    }
  }).catch((err) => {
    console.log(err);
    errHandler();
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

async function adminRegister(RegisterData, contactAdminId, isRegistering, registerSuccess, resId, errMsg) {
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
// 获取用户个人信息
async function getUserInfo(successHandler, errHandler) {
  const userStore = useUserStore();
  const { userId } = storeToRefs(userStore);
  await httpInstance.get(`/api/User/${userId.value}/info`).then((res) => {
    console.log(res);
    if (res.userId) {
      successHandler(res);
    }
    else {
      errHandler('获取用户ID失败');
    }
  }).catch((err) => {
    errHandler('获取用户信息失败：' + err.response?.data?.message || '未知错误');
  })
}

async function getAllUsers(successHandler, errHandler) {
  await httpInstance.get('api/UserPersonalInfo/all-users').then((res) => {
    successHandler(res);
  }).catch((err) => {
    errHandler(err.response?.message);
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

async function getUserReservationGroup(successHandler, errHandler) {
  const userStore = useUserStore();
  const { userId } = storeToRefs(userStore);
  await httpInstance.get(`api/UserGroupInfo/${userId.value}`).then((res) => {
    successHandler(res);
  }).catch((err) => {
    errHandler(err.response?.data?.message || '未知错误');
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

async function addRepairRecord(repairData, successHandler, errHandler) {
  await httpInstance.post('/api/Venue/AddRepair', repairData).then((res) => {
    if (res.state) {
      successHandler(res.repairId);
    }
    else {
      errHandler(res.info || '未知错误');
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


// 场地相关接口
async function createVenue(venueData, successHandler, errHandler) {
  await httpInstance.post('/api/Venue/AddVenue', venueData).then((res) => {
    if (res.state) {
      successHandler(res.venueId);
    }
    else {
      errHandler(res.info || '未知错误');
    }
  }).catch((err) => {
    errHandler(err.response?.data?.info || '未知错误');
  })
}

async function getAllVenues(successHandler, errHandler) {
  await httpInstance.get('api/Venue/GetAllVenueInfos').then((res) => {
    if (res.state) {
      successHandler(res.data);
    }
    else {
      errHandler(res.info || '未知错误');
    }
  }).catch((err) => {
    errHandler(err.response?.data?.info || '未知错误');
  })
}

async function getVenueDetail(venueId, successHandler, errHandler) {
  await httpInstance.get('api/Venue/GetVenueAdminAndAnnouncements', {
    params: {
      venueId: venueId,
    }
  }).then((res) => {
    if (res.state) {
      successHandler(res.data);
    }
    else {
      errHandler(res.info || '未知错误');
    }
  }).catch((err) => {
    errHandler(err.response?.data?.info || '未知错误');
  })
}

async function getAdminVenueDetail(venueId, successHandler, errHandler) {
  await httpInstance.get('api/Venue/GetVenueDetails', {
    params: {
      venueId: venueId,
    }
  }).then((res) => {
    console.log(res);
    if (res.state) {
      successHandler(res.data);
    }
    else {
      errHandler(res.info || '未知错误');
    }
  }).catch((err) => {
    console.log(err);
    errHandler(err.response?.data?.info || '未知错误');
  })
}

async function getVenueOpenTime(venueId, date, successHandler, errHandler) {
  await httpInstance.get('/api/Venue/GetVenueAvailabilityByDate', {
    params: {
      venueId: venueId,
      date: date,
    }
  }).then((res) => {
    console.log(res);
    if (res.state) {
      successHandler(res.data);
    }
    else if (res.info === '未找到该日期的场地开放时间段') {
      successHandler([]);
    }
    else {
      errHandler(res.info || '未知错误')
    }
  }).catch((err) => {
    console.log(err);
    errHandler(err.response?.data?.info || '未知错误');
  })
}

async function addVenueOpenTime(openTimeData, successHandler, errHandler) {
  console.log(openTimeData)
  await httpInstance.post('/api/Venue/AddAvailability', openTimeData).then((res) => {
    console.log(res);
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

// 管理员接口
async function getAdminPermission(successHandler, errHandler) {
  const userStore = useUserStore();
  const { adminPermission } = storeToRefs(userStore);
  await httpInstance.get().then((res) => {
    if (res.state) {
      adminPermission.value = {
        venue: res.data.managedVenues,
        device: res.data.managedEquipment
      };
      successHandler();
      console.log(adminPermission.value);
    }
    else {
      errHandler('获取管理员权限失败：' + res.info || '未知错误');
    }
  }).catch((err) => {
    errHandler('获取管理员权限失败：' + err.response?.data?.info || '未知错误');
  })
}

// 预约接口
async function inidividualReservation(reservationData, successHandler, errHandler) {
  const userStore = useUserStore();
  const { userId } = storeToRefs(userStore);
  await httpInstance.post('/api/Reservation/createUserReservation', reservationData, {
    params: {
      userId: userId.value,
    }
  }).then((res) => {
    console.log(res);
    if (res.state) {
      successHandler(res.reservationId);
    }
    else {
      errHandler(res.info || '未知错误');
    }
  }).catch((err) => {
    console.log(err);
    errHandler(err.response?.data?.info || '未知错误');
  })
}

async function groupReservation(reservationData, successHandler, errHandler) {
  await httpInstance.post('/api/Reservation/createGroupReservation', reservationData).then((res) => {
    console.log(res);
    if (res.state) {
      successHandler(res.reservationId);
    }
    else {
      errHandler(res.info || '未知错误');
    }
  }).catch((err) => {
    errHandler(err.response?.data?.info || '未知错误');
  })
}


//获取统计数据
async function getStatistics(venueTypes, successHandler, errHandler) {
  await httpInstance.get('/api/Venue/AnalyzeVenueData', { params: { venueType: venueTypes } }).then((res) => {
    console.log(res);
    if (res.state) {
      console.log(res.data)
      successHandler(res.data);
    }
    else {
      errHandler(res.info || '未知错误2');
    }
  }).catch((err) => {
    errHandler(err.response?.data?.info || '未知错误');
    console.log(err);
  })
}

//获取特定场地统计数据
async function getVenueStatistics(venueIds, successHandler, errHandler) {
  await httpInstance.get('/api/Venue/AnalyzeVenueData', { params: { venueId: venueIds } }).then((res) => {
    console.log(res);
    if (res.state) {
      console.log(res.data)
      successHandler(res.data);
    }
    else {
      errHandler(res.info || '未知错误2');
    }
  }).catch((err) => {
    errHandler(err.response?.data?.info || '未知错误');
    console.log(err);
  })
}


async function getAllUserReservation(successHandler, errHandler) {
  const userStore = useUserStore();
  const { userId } = storeToRefs(userStore);
  await httpInstance.get('api/Reservation/GetReservationsByUserId', {
    params: {
      userId: userId.value,
    }
  }).then((res) => {
    successHandler(res);
  }).catch((err) => {
    console.log(err);
    if (err.response?.data === '未找到该用户的预约记录。') {
      successHandler([]);
    }
    else {
      errHandler(err.response?.data || '未知错误');
    }
  })
}

//获取所有保养记录
async function getMaintenanceList(successHandler, errHandler) {
  await httpInstance.get('api/Venue/GetAllVenueMaintenances').then((res) => {
    console.log(res);
    successHandler(res);
  }).catch((err) => {
    errHandler(err.response?.data?.info || '未知错误');
    console.log(err);
  })
}

// //获取某个场地的保养记录
// async function getVenueMaintenanceList(successHandler, errHandler) {
//   await httpInstance.get('/VenueMaintenance/AddMaintenance').then((res) => {
//     console.log(res);
//     successHandler(res);
//   }).catch((err) => {
//     errHandler(err.response?.data?.info || '未知错误');
//     console.log(err);
//   })
// }

//添加保养记录
async function addMaintenance(maintenanceInfo, successHandler, errHandler) {
  await httpInstance.post('api/Venue/AddMaintenance', maintenanceInfo).then((res) => {
    console.log(res);
    if (res.state) {
      successHandler(res);
    }
    else {
      errHandler(err.response?.data?.info || '未知错误');
    }
  }).catch((err) => {
    errHandler(err.response?.data?.info || '未知错误');
    console.log(err);
  })
}

//修改保养记录
async function modifyMaintenance(maintenanceInfo, successHandler, errHandler) {
  await httpInstance.put('api/Venue/UpdateVenueMaintenance', maintenanceInfo).then((res) => {
    console.log(res);
    if (res.state) {
      successHandler(res);
    }
    else {
      errHandler(err.response?.data?.info || '未知错误');
    }
  }).catch((err) => {
    errHandler(err.response?.data?.info || '未知错误');
    console.log(err);
  })
}

async function getAllReservation(successHandler, errHandler) {
  await httpInstance.get('api/Reservation/getReservationList').then((res) => {
    console.log(res);
    successHandler(res);
  }).catch((err) => {
    console.log(err);
    errHandler(err?.response?.data || '未知错误');
  })
}

async function getReservationMember(reservationId, successHandler, errHandler) {
  await httpInstance.get('/api/Reservation/GetGroupReservationMembers', {
    params: {
      reservationId: reservationId,
    }
  }).then((res) => {
    console.log(res);
    // if (res.state) {
    //   successHandler(res.data);
    // }
    // else {
    //   errHandler(res.info || '未知错误');
    // }
    successHandler(res);
  }).catch((err) => {
    console.log(err);
    errHandler(err?.response?.data || '未知错误');
  })
}

async function updateReservation(updateData, successHandler, errHandler) {
  await httpInstance.post('api/Reservation/UpdateReservationStatus', updateData).then((res) => {
    successHandler();
  }).catch((err) => {
    errHandler(err.response?.data || '未知错误');
  })
}

async function editVenueInfo(venueId, venueData, successHandler, errHandler) {
  await httpInstance.put('/api/Venue/EditVenue', venueData, {
    params: {
      venueId: venueId,
    }
  }).then((res) => {
    console.log(res);
    if (res.state) {
      successHandler()
    }
    else {
      errHandler(res.info || '未知错误');
    }
  }).catch((err) => {
    errHandler(err.response?.data?.info);
  })
}

async function editVenueOpenTime(editData, successHandler, errHandler) {
  await httpInstance.put('/api/Venue/EditAvailability', editData).then((res) => {
    console.log(res);
    if (res.state) {
      successHandler();
    }
    else {
      errHandler(res.info || '未知错误');
    }
  }).catch((err) => {
    console.log(err);
    errHandler(err.response?.data?.info || '未知错误');
  })
}

async function deleteVenueOpenTime(timeslotId, successHandler, errHandler) {
  await httpInstance.post('/api/Venue/DeleteAvailability', {
    availabilityId: timeslotId,
  }).then((res) => {
    if (res.state) {
      successHandler();
    }
    else {
      errHandler(res.info || '未知错误');
    }
  }).catch((err) => {
    errHandler(err.response?.data?.info || '未知错误');
  })
}

async function deletePublicNotice(noticeId, successHandler, errHandler) {
  await httpInstance.post('/api/Announcement/deleteAnnouncement', { announcementId: noticeId }).then((res) => {
    // console.log(res);
    if (res.status) {
      successHandler();
    }
    else {
      errHandler(res.info || '未知错误');
    }
  }).catch((err) => {
    errHandler(err.response?.data?.info, '未知错误');
  })
}

async function getVenueAdmin(venueId, successHandler, errHandler) {
  await httpInstance.get('api/Venue/GetVenueDetailsAnnouncement', {
    params: {
      venueId: venueId,
    }
  }).then((res) => {
    console.log(res);
    if (res.state) {
      successHandler(res.data);
    }
    else {
      errHandler(res.info || '未知错误');
    }
  }).catch((err) => {
    console.log(err);
    errHandler(err.response?.data?.info || '未知错误');
  })
}

async function getAllDevice(successHandler, errHandler) {
  await httpInstance.get('api/Venue/GetAllEquipment').then(res => {
    console.log(res);
    if (res.state) {
      successHandler(res.data);
    }
    else {
      errHandler(res.info || '未知错误');
    }
  }).catch((err) => {
    errHandler(err.response?.data?.info || '未知错误');
  })
}

async function updateVenueAdmin(updateData, successHandler, errHandler) {
  await httpInstance.post('api/Venue/UpdateVenueAdmin', updateData).then((res) => {
    console.log(res);
    if (res.state) {
      successHandler();
    }
    else {
      errHandler(res.info || '未知错误');
    }
  }).catch((err) => {
    console.log(err);
    errHandler(err.response?.data?.info || '未知错误');
  })
}

async function getAllAdmin(successHandler, errHandler) {
  await httpInstance.get('api/Admin/allAdmins/').then((res) => {
    console.log(res);
    if (res.state) {
      successHandler(res.data);
    }
    else {
      errHandler(res.info || '未知错误');
    }
  }).catch((err) => {
    errHandler(err.response?.data?.info || '未知错误');
  })
}

async function filterVenueByDate(date, successHandler, errHandler) {
  await httpInstance.get('api/VenueAvailability/GetVenueAvailability', {
    params: {
      dateReq: date
    }
  }).then((res) => {
    successHandler(res);
  }).catch((err) => {
    console.log(err);
    if (err.response?.data === '未找到符合要求的场地') {
      successHandler([]);
    }
    else {
      errHandler(err.response?.data || '未知错误');
    }
  })
}

export {
  userLogin, userRegister, adminRegister, getUserInfo, getAllUsers, fetchTeam, createTeam, getAllTeams,
  getTeamName, getTeamDetail, addTeamUser, updateUserRole, removeTeamUser,
  getUserReservationGroup, getUserNotice, deleteUserNotice, getRepairData, addRepairRecord,
  getAllPublicNotice, getPublicNoticeDetail, addPublicNotice, modifyPublicNotice, getAllVenues,
  getVenueDetail, getAdminVenueDetail, addVenueOpenTime, editVenueInfo, editVenueOpenTime,
  deleteVenueOpenTime, deletePublicNotice, getVenueAdmin, getAllDevice, updateVenueAdmin, getAllAdmin,
  filterVenueByDate, createVenue, getVenueOpenTime, getAdminPermission, inidividualReservation,
  getAllUserReservation, getAllReservation, userModifiedInfo, getReservationMember,
  userModifiedPassword, getStatistics, getVenueStatistics, getMaintenanceList, addMaintenance,
  modifyMaintenance, updateReservation, groupReservation
};