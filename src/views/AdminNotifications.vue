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
          <el-button type="primary" @click="showMore('team')">更多</el-button>
        </div>
        <!-- 限制显示前10条通知 -->
        <el-table :data="filteredAdminNotifications.slice(0, 10)" style="width: 100%" 
        :show-overflow-tooltip="{effect: 'light'}">
          <el-table-column prop="notificationId" label="通知编号" width="105" sortable></el-table-column>
          <el-table-column prop="title" label="标题" sortable></el-table-column>
          <el-table-column label="时间" width="140" sortable>
            <template #default="scope">
              {{ convertTime(scope.row.notificationTime) }}
            </template>
          </el-table-column>
          <el-table-column label="操作" width="150">
            <template #default="scope">
              <el-button @click="viewAnnouncement(scope.row)" size="small">查看</el-button>
              <el-button :disabled="scope.row.notificationType === 'team/adminCheck' ||
              scope.row.notificationType === 'team/userCheck'" @click="deleteAnnouncement(scope.row)"
              size="small" type="danger">删除</el-button>
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
        <div v-if="isConfirmationType(selectedAnnouncement)" class="dialog-footer">
          <el-button @click="handleDecision('accept')" type="primary">同意</el-button>
          <el-button @click="handleDecision('reject')" type="danger">拒绝</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import NotificationDetail from './components/NotificationDetail.vue';
import { convertTime, timeSort } from '@/apis/utils';
import { getUserNotice, deleteUserNotice } from '@/apis/requests';
import { useUserStore } from '@/stores/userStore';
import { storeToRefs } from 'pinia';
import { ElCard, ElDialog, ElTable, ElTableColumn, ElButton, ElMessage } from 'element-plus';

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

const filteredAdminNotifications = computed(() =>
  notifications.value.filter(notification => notification.notificationtype.startsWith('admin'))
);


const selectedAnnouncement = ref(null);
const selectedNotifications = ref([]);
const isModalVisible = ref(false);
const isDetailModalVisible = ref(false);
const isLoading = ref(false); // 用于处理加载状态
const modalTitle = ref('');

// 检查是否是需要确认的通知类型
const isConfirmationType = (announcement) => {
  return announcement && (announcement.type === 'team/userCheck' || announcement.type === 'team/adminCheck');
};

const viewAnnouncement = (announcement) => {
  selectedAnnouncement.value = announcement;
  isDetailModalVisible.value = true;
};

const showMore = () => {
  selectedNotifications.value = filteredGroupNotifications.value;
  modalTitle.value = '申请通知';
  isModalVisible.value = true;
};

const closeModal = () => {
  isModalVisible.value = false;
};

const closeDetailModal = () => {
  isDetailModalVisible.value = false;
};

const handleDecision = async (decision) => {
  const action = decision === 'accept' ? '同意' : '拒绝';
  isLoading.value = true; // 开始加载
  try {
    const response = await fetch('/api/update-group-status', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        notificationId: selectedAnnouncement.value.id,
        decision: decision,
      }),
    });

    const result = await response.json();
    if (result.success) {
      ElMessage.success(`${action}操作成功`);
      isDetailModalVisible.value = false;
    } else {
      ElMessage.error(`${action}操作失败`);
    }
  } catch (error) {
    console.error(error);
    ElMessage.error(`${action}操作出现错误`);
  } finally {
    isLoading.value = false; // 请求结束，停止加载
  }
};
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
