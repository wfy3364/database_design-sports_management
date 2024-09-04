<script setup>

import { ref, onMounted } from 'vue';
import { deleteUserNotice, removeTeamUser, updateUserRole } from '@/apis/requests';
import { ElMessage, notificationTypes } from 'element-plus';
import { teamValidateAction } from '@/apis/teamValidate';

const props = defineProps({
  selectedAnnouncement: {
    notificationId: String,
    notificationType: String,
    title: String,
    notificationTime: Date,
    content: String,
    targetUser: String,
    targetTeam: String, 
  }
});

const emit = defineEmits(['closeModal', 'noticeUpdate']);

const notificationDetailVisible = ref(true);

const isConfirmationType = (announcement) => {
  console.log(announcement);
  return announcement && (announcement.notificationType === 'team/userCheck' || 
  announcement.notificationType === 'team/adminCheck');
};

const handleClose = () => {
  emit('closeModal');
}

const handleDecision = async (decision) => {
  teamValidateAction(decision, props.selectedAnnouncement.targetUser, props.selectedAnnouncement.targetTeam,
    () => { emit('noticeUpdate') }, decisionErr);
}

// const handleDecision = async (decision) => {
//   if(decision === 'accept'){
//     const updateData = {
//       userId: props.selectedAnnouncement.targetUser,
//       groupId: props.selectedAnnouncement.targetTeam,
//       userRole: 'member',
//       notificationType: 'join',
//     }
//     await updateUserRole(updateData, handleNoticeDelete, decisionErr);
//   }
//   else if(decision === 'reject'){
//     const removeData = {
//       userId: props.selectedAnnouncement.targetUser,
//       adminId: userId.value,
//     }
//     await removeTeamUser(props.selectedAnnouncement.targetTeam, removeData, handleNoticeDelete, decisionErr);
//   }
// };

// const handleNoticeDelete = async () => {
//   await deleteUserNotice(props.selectedAnnouncement.notificationId, noticeDeleteSuccess, decisionErr)
// }

// const noticeDeleteSuccess = () => {
//   ElMessage.success('操作成功');
//   emit('noticeUpdate');
// }

const decisionErr = (msg) => {
  ElMessage.error('操作失败：' + msg);
}


// onMounted(() => {
//   notificationDetailVisible.value = true;
// })

</script>

<template>
  <!-- 查看通知内容的模态框 -->
  <el-dialog v-model="notificationDetailVisible" :title="selectedAnnouncement.title" 
  :before-close="handleClose">
    <div class="modal-content">
      <p>{{ selectedAnnouncement.content }}</p>
    </div>
    <!-- 对于 team/userCheck 和 team/adminCheck 类型的通知，显示“同意”和“拒绝”按钮 -->
    <template #footer>
      <div v-if="isConfirmationType(selectedAnnouncement)" class="dialog-footer">
        <el-button @click="handleDecision('accept')" type="primary">同意</el-button>
        <el-button @click="handleDecision('reject')" type="danger">拒绝</el-button>
      </div>
      <div v-else>
        <el-button @click="emit('closeModal')" type="primary">确定</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<style scoped>
.modal-content {
  padding: 20px;
  line-height: 1.5;
}

</style>