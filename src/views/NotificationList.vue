<template>
  <div class="announcement-notification">
    <el-card shadow="hover" class="notificationTitle">
      通知与公告
    </el-card>

    <div class="sections" v-loading="isLoading">
      <!-- 团体通知部分 -->
      <el-card shadow="hover" class="card">
        <div class="card-header">
          <h2>团体通知</h2>
          <el-button type="primary" @click="showMore('team')">更多</el-button>
        </div>
        <!-- 限制显示前10条通知 -->
        <el-table :data="filteredGroupNotifications.slice(0, 10)" style="width: 100%" 
        :show-overflow-tooltip="{effect: 'light'}">
          <el-table-column prop="notificationId" label="通知编号" width="105" sortable></el-table-column>
          <el-table-column prop="title" label="标题" width="120" sortable></el-table-column>
          <el-table-column label="时间" width="140" sortable>
            <template #default="scope">
              {{ convertTime(scope.row.notificationTime) }}
            </template>
          </el-table-column>
          <el-table-column label="操作" width="150" fixed="right">
            <template #default="scope">
              <el-button @click="viewAnnouncement(scope.row)" size="small">查看</el-button>
              <el-button :disabled="scope.row.notificationType === 'team/adminCheck' ||
              scope.row.notificationType.startsWith('team/userCheck')" @click="deleteAnnouncement(scope.row)"
              size="small" type="danger">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-card>

      <!-- 预约通知部分 -->
      <el-card shadow="hover" class="card">
        <div class="card-header">
          <h2>预约通知</h2>
          <el-button type="primary" @click="showMore('reservation')">更多</el-button>
        </div>
        <!-- 限制显示前10条通知 -->
        <el-table :data="filteredBookingNotifications.slice(0, 10)" style="width: 100%"
        :show-overflow-tooltip="{effect: 'light'}" >
          <el-table-column prop="notificationId" label="通知编号" width="105" sortable></el-table-column>
          <el-table-column prop="title" label="标题" sortable width="120"></el-table-column>
          <el-table-column label="时间" width="140" sortable>
            <template #default="scope">
              {{ convertTime(scope.row.notificationTime) }}
            </template>
          </el-table-column>
          <el-table-column label="操作" width="150" fixed="right">
            <template #default="scope">
              <el-button @click="viewAnnouncement(scope.row)" size="small">查看</el-button>
              <el-button @click="deleteAnnouncement(scope.row)" size="small" type="danger">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-card>
    </div>

    <!-- 模态框显示所有通知 -->
    <el-dialog v-model="isModalVisible" width="600px" :header="modalTitle">
      <!-- <template #title>
        <div class="modal-title">
          <span>{{ modalTitle }}</span>
        </div>
      </template> -->
      <el-table :data="selectedNotifications" style="width: 100%" :show-overflow-tooltip="{effect: 'light'}">
        <el-table-column prop="notificationId" label="通知编号" width="105" sortable></el-table-column>
        <el-table-column prop="title" label="标题" sortable></el-table-column>
        <el-table-column label="时间" width="150" sortable>
          <template #default="scope">
            {{ convertTime(scope.row.notificationTime) }}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="150">
          <template #default="scope">
            <el-button @click="viewAnnouncement(scope.row)" size="small">查看</el-button>
            <el-button @click="deleteAnnouncement(scope.row)" size="small" type="danger">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>
    <notification-detail v-if="isDetailModalVisible" :selected-announcement="selectedAnnouncement" 
    @close-modal="closeDetailModal" @noticeUpdate="closeDetailUpdate"></notification-detail>
    <!-- 查看通知内容的模态框 -->
    <!-- <el-dialog v-model="isDetailModalVisible" width="500px">
      <template #title>
        <div class="modal-title">
          <span>{{ selectedAnnouncement.title }}</span>
        </div>
      </template>
      <div class="modal-content">
        <p>{{ selectedAnnouncement.content }}</p>
      </div> -->
      <!-- 对于 team/userCheck 和 team/adminCheck 类型的通知，显示“同意”和“拒绝”按钮 -->
      <!-- <template #footer>
        <div v-if="isConfirmationType(selectedAnnouncement)" class="dialog-footer">
          <el-button @click="handleDecision('accept')" type="primary">同意</el-button>
          <el-button @click="handleDecision('reject')" type="danger">拒绝</el-button>
        </div>
      </template>
    </el-dialog> -->
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import NotificationDetail from './components/NotificationDetail.vue';
import { ElCard, ElDialog, ElTable, ElTableColumn, ElButton, ElMessage } from 'element-plus';
import { convertTime, timeSort } from '@/apis/utils';
import { getUserNotice, deleteUserNotice } from '@/apis/requests';
import { useUserStore } from '@/stores/userStore';
import { storeToRefs } from 'pinia';

const userStore = useUserStore();
const { userId } = storeToRefs(userStore);

// 模拟通知数据
// const notifications = ref([
//   { id: '1', type: 'teamJoin', title: '加入团体A成功', date: new Date('2024-08-14'), content: '您已成功加入团体A。' },
//   { id: '2', type: 'team/userCheck', title: '团体B加入请求', date: new Date('2024-08-13'), content: '请确认是否加入团体B。' },
//   { id: '3', type: 'reservationConfirm', title: '预约成功确认', date: new Date('2024-08-14'), content: '您的预约已成功确认。' },
//   { id: '4', type: 'reservationCancel', title: '预约已取消', date: new Date('2024-08-13'), content: '您的预约已取消。' },
//   { id: '5', type: 'team/adminCheck', title: '用户申请加入团体C', date: new Date('2024-08-12'), content: '请确认是否接受用户加入团体C的申请。' },
// ]);
const notifications = ref([]);

const filteredGroupNotifications = computed(() =>
  notifications.value.filter(notification => notification.notificationType.startsWith('team'))
  // notifications.value
);

const filteredBookingNotifications = computed(() =>
  notifications.value.filter(notification => notification.notificationType.startsWith('reservation'))
  // notifications.value
);

const selectedAnnouncement = ref(null);
const selectedNotifications = ref([]);
const isModalVisible = ref(false);
const isDetailModalVisible = ref(false);
const isLoading = ref(false); // 用于处理加载状态
const modalTitle = ref('');

const getAnnouncements = async () => {
  isLoading.value = true;
  await getUserNotice(userId.value, getAnnouncementSuccess, getAnnouncementErr);
}

const getAnnouncementSuccess = (res) => {
  notifications.value = timeSort(res, 'notificationTime', -1);
  // notifications.value = res;
  isLoading.value = false;
  console.log(notifications.value);
} 

const getAnnouncementErr = (msg) => {
  notifications.value = [];
  isLoading.value = false;
  ElMessage.error(msg);
}

onMounted(getAnnouncements);

const viewAnnouncement = (announcement) => {
  selectedAnnouncement.value = announcement;
  isDetailModalVisible.value = true;
};

const showMore = (type) => {
  if (type.split('/')[0] === 'team') {
    selectedNotifications.value = filteredGroupNotifications.value;
    modalTitle.value = '团体通知';
  } else if (type === 'reservation') {
    selectedNotifications.value = filteredBookingNotifications.value;
    modalTitle.value = '预约通知';
  }
  isModalVisible.value = true;
};

const closeModal = () => {
  isModalVisible.value = false;
};

const closeDetailModal = () => {
  isDetailModalVisible.value = false;
};

const closeDetailUpdate = () => {
  isDetailModalVisible.value = false;
  getAnnouncements();
}

const deleteAnnouncement = async (announcement) => {
  await deleteUserNotice(announcement.notificationId, deleteSuccess, deleteErr)
}

const deleteSuccess = () => {
  ElMessage.info('已删除通知');
  getAnnouncements();
}

const deleteErr = (msg) => {
  ElMessage.error('删除失败：' + msg);
}

</script>

<style scoped>
.announcement-notification {
  display: flex;
  flex-direction: column;
  border-radius: 5px;
  background-color: white;
  border: 1px solid lightgray;
  /* margin: 20px auto; */
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
  /* display: grid; */
  /* grid-template-columns: repeat(2, 1fr); */
  /* gap: 20px; */
  display: flex;
  justify-content: space-between;
  padding: 10px;
}

.card {
  margin: 10px;
  max-width: 48%;
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
