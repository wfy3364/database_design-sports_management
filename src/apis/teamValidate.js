import { updateUserRole, removeTeamUser, deleteUserNotice } from "./requests";
import { useUserStore } from "@/stores/userStore";
import { ElMessage } from "element-plus";
import { storeToRefs } from "pinia";

const teamValidateAction = async (decision, user, group, notice, isAdmin, successHandler, errHandler) => {
  const userStore = useUserStore();
  const { userId } = storeToRefs(userStore);
  const noticeDeleteSuccess = () => {
    if (decision === 'accept') {
      ElMessage.success('成功将用户加入团体');
    }
    else {
      ElMessage.info('已拒绝用户加入团体');
    }
    successHandler();
  }
  const handleNoticeDelete = async () => {
    await deleteUserNotice(notice, noticeDeleteSuccess, errHandler)
  }
  if (decision === 'accept') {
    const updateData = {
      userId: user,
      groupId: group,
      userRole: isAdmin ? 'Admin' : 'Member',
      notificationType: 'join',
    }
    await updateUserRole(updateData, handleNoticeDelete, errHandler);
  }
  else if (decision === 'reject') {
    const removeData = {
      userId: user,
      adminId: userId.value,
    }
    await removeTeamUser(group, removeData, handleNoticeDelete, errHandler);
  }
};

export { teamValidateAction }