<template>
  <div class="announcement-notification">
    <el-card shadow="hover" class="notificationTitle">
      通知与公告
    </el-card>

    <div class="sections">
      <!-- 申请通知部分 -->
      <el-card shadow="hover" class="card">
        <div class="card-header">
          <h2>管理员通知</h2>
          <!-- <el-button type="primary" @click="showMore('team')">更多</el-button> -->
        </div>
        <el-table :data="notifications" style="width: 100%" 
        :show-overflow-tooltip="{effect: 'light'}">
          <el-table-column prop="notificationId" label="通知编号" width="105" sortable></el-table-column>
          <el-table-column prop="title" label="标题" sortable></el-table-column>
          <el-table-column label="时间" width="140" sortable>
            <template #default="scope">
              {{ convertTime(scope.row.notificationTime) }}
            </template>
          </el-table-column>
          <el-table-column label="操作" width="80">
            <template #default="scope">
              <el-button @click="viewAnnouncement(scope.row)" size="small">查看</el-button>
              <!-- <el-button :disabled="scope.row.notificationType === 'team/adminCheck' ||
              scope.row.notificationType === 'team/userCheck'" @click="deleteAnnouncement(scope.row)"
              size="small" type="danger">删除</el-button> -->
            </template>
          </el-table-column>
        </el-table>
      </el-card>

    </div>

    <!-- 模态框显示所有通知 -->
    <el-dialog v-model="isModalVisible" width="600px">
      <template #title>
        <div class="modal-title">
          <span>{{ modalTitle }}</span>
        </div>
      </template>
      <el-table :data="selectedNotifications" style="width: 100%">
        <el-table-column prop="id" label="通知编号" width="100"></el-table-column>
        <el-table-column prop="title" label="标题"></el-table-column>
        <el-table-column prop="date" label="时间" width="150"></el-table-column>
        <el-table-column label="操作" width="100">
          <template #default="scope">
            <el-button @click="viewAnnouncement(scope.row)" size="small">查看</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>

    <!-- 查看通知内容的模态框 -->
    <el-dialog v-model="isDetailModalVisible" width="500px">
      <template #title>
        <div class="modal-title">
          <span>{{ selectedAnnouncement.title }}</span>
        </div>
      </template>
      <div class="modal-content">
        <p>{{ selectedAnnouncement.content }}</p>
      </div>
      <!-- 对于 team/userCheck 和 team/adminCheck 类型的通知，显示“同意”和“拒绝”按钮 -->
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="handleAccept" type="primary">同意</el-button>
          <el-button @click="handleReject" type="danger">拒绝</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import NotificationDetail from './components/NotificationDetail.vue';
import { convertTime, timeSort } from '@/apis/utils';
import { getUserNotice, deleteUserNotice, getAdminNotice, getAdminInfo, adminValidate } from '@/apis/requests';
import { useUserStore } from '@/stores/userStore';
import { storeToRefs } from 'pinia';
import { ElCard, ElDialog, ElTable, ElTableColumn, ElButton, ElMessage } from 'element-plus';
import { onMounted } from 'vue';

const userStore = useUserStore();
const { userId } = storeToRefs(userStore);

// 模拟通知数据
const notifications = ref([
  { notificationid: 1, notificationtype: 'adminRequest', title: 'A申请注册成为管理员', notificationtime: ('2024-08-14'), content: 'A申请注册成为管理员。' },
  { notificationid: 2, notificationtype: 'adminRequest', title: 'B申请注册成为管理员', notificationtime: ('2024-08-16'), content: 'B申请注册成为管理员。' },
  { notificationid: 3, notificationtype: 'adminCancel', title: 'V注销管理员账号', notificationtime: ('2024-08-16'), content: 'V注销管理员。' },
  { notificationid: 4, notificationtype: 'adminRequest', title: 'D申请注册成为管理员', notificationtime: ('2024-08-18'), content: 'F申请注册成为管理员。' },
  { notificationid: 5, notificationtype: 'adminRequest', title: 'A申请注册成为管理员', notificationtime: ('2024-08-14'), content: 'A申请注册成为管理员。' },
  { notificationid: 6, notificationtype: 'adminRequest', title: 'B申请注册成为管理员', notificationtime: ('2024-08-16'), content: 'B申请注册成为管理员。' },
  { notificationid: 7, notificationtype: 'adminCancel', title: 'V注销管理员账号', notificationtime: ('2024-08-16'), content: 'V注销管理员。' },
  { notificationid: 8, notificationtype: 'adminRequest', title: 'D申请注册成为管理员', notificationtime: ('2024-08-18'), content: 'F申请注册成为管理员。' },
  { notificationid: 9, notificationtype: 'adminRequest', title: 'A申请注册成为管理员', notificationtime: ('2024-08-14'), content: 'A申请注册成为管理员。' },
  { notificationid: 10, notificationtype: 'adminRequest', title: 'B申请注册成为管理员', notificationtime: ('2024-08-16'), content: 'B申请注册成为管理员。' },
  { notificationid: 11, notificationtype: 'adminCancel', title: 'V注销管理员账号', notificationtime: ('2024-08-16'), content: 'V注销管理员。' },
  { notificationid: 12 , notificationtype: 'adminRequest', title: 'D申请注册成为管理员', notificationtime: ('2024-08-18'), content: 'F申请注册成为管理员。' },
]);

// const filteredAdminNotifications = computed(() =>
//   notifications.value.filter(notification => notification.notificationtype.startsWith('admin'))
// );

onMounted(async () => {
  const adminData = {
    adminId: userId.value,
  }
  await getAdminNotice(adminData, processNotifications, getNotificationErr);
})

const processNotifications = (res) => {
  notifications.value = res;
}

const getNotificationErr = (msg) => {
  ElMessage.error('获取管理员通知失败：' + msg);
}

const selectedAnnouncement = ref(null);
const selectedNotifications = ref([]);
const isModalVisible = ref(false);
const isDetailModalVisible = ref(false);
const isLoading = ref(false); // 用于处理加载状态
const modalTitle = ref('');

const viewAnnouncement = (announcement) => {
  selectedAnnouncement.value = announcement;
  isDetailModalVisible.value = true;
};

const closeDetailModal = () => {
  isDetailModalVisible.value = false;
};

const handleAccept = async () => {
  await getAdminInfo(handleValidate, validateErr)
}

const handleValidate = async (res) => {
  const adminInfo = res;
  console.log(res);
  adminInfo.adminType = res.adminType.split('/')[1];
  adminValidate(handleValidate, deleteAnnouncement, validateErr)
}

const deleteAnnouncement = async () => {
  await deleteUserNotice(selectedAnnouncement.announcementId, validateSuccess, validateErr);
}

const validateSuccess = () => {
  ElMessage.info('操作成功');
}

const validateErr = (msg) => {
  ElMessage.error('审核管理员失败：' + msg);
}

const handleReject = () => {
  
}
</script>

<style scoped>
.announcement-notification {
  display: flex;
  flex-direction: column;
  border-radius: 5px;
  background-color: white;
  border: 1px solid lightgray;
  margin: 20px auto;
  max-width: 1200px;
}

.notificationTitle {
  display: flex;
  justify-content: center;
  font-size: 20px;
  font-weight: 700;
  padding: 10px;
  border-bottom: 1px solid black;
}

.sections {
  display: grid;
  grid-template-columns: repeat(1, 1fr);
  gap: 20px;
  padding: 20px;
}

.card {
  margin: 10px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.modal-title {
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 18px;
  font-weight: bold;
  padding: 10px;
  border-bottom: 1px solid #e0e0e0;
}

.modal-content {
  padding: 20px;
  line-height: 1.5;
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  padding: 10px;
}
</style>
