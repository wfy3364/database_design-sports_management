import { updateUserRole, removeTeamUser } from "./requests";

import { useUserStore } from "@/stores/userStore";
import { ElMessage } from "element-plus";
import { storeToRefs } from "pinia";

const teamValidateAction = async (decision, user, group, successHandler, errHandler) => {
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
    await deleteUserNotice(props.selectedAnnouncement.notificationId, noticeDeleteSuccess, errHandler)
  }
  if (decision === 'accept') {
    const updateData = {
      userId: user,
      groupId: group,
      userRole: 'member',
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