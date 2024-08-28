<template>
  <div class="announcement-notification">
    <el-card shadow="hover" class="notificationTitle">
      通知与公告
    </el-card>

    <div class="sections">
      <!-- 用户加入团体成功的通知部分 -->
      <el-card shadow="hover" class="card" v-for="(notificationList, type) in notificationTypes" :key="type">
        <div class="card-header">
          <h2>{{ notificationList.title }}</h2>
          <el-button type="primary" @click="showMore(type)">更多</el-button>
        </div>
        <ul>
          <li v-for="notification in notificationList.notifications.slice(0, 2)" :key="notification.id">
            <span>{{ notification.id }}</span> - 
            <a @click="viewAnnouncement(notification)">{{ notification.title }}</a>
            ({{ notification.date }})
          </li>
        </ul>
      </el-card>
    </div>

    <!-- 模态框显示所有通知 -->
    <el-dialog v-model="isModalVisible" width="600px">
      <template #title>
        <div class="modal-title">
          <span>{{ modalTitle }}</span>
          <el-button type="text" @click="closeModal">关闭</el-button>
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
          <el-button type="text" @click="closeDetailModal">关闭</el-button>
        </div>
      </template>
      <div class="modal-content">
        <p>{{ selectedAnnouncement.content }}</p>
      </div>
    </el-dialog>
  </div>
</template>


<script setup>
import { ref } from 'vue';
import { ElCard, ElDialog, ElTable, ElTableColumn, ElButton } from 'element-plus';

const groupNotifications = ref([
  { id: 1, title: '加入团体A成功', date: '2024-08-14', content: '您已成功加入团体A。' },
  { id: 2, title: '加入团体B成功', date: '2024-08-13', content: '您已成功加入团体B。' },
]);

const bookingNotifications = ref([
  { id: 3, title: '预约成功确认', date: '2024-08-14', content: '您的预约已成功确认。' },
  { id: 4, title: '预约已取消', date: '2024-08-13', content: '您的预约已取消。' },
]);

const homepageNotifications = ref([
  { id: 5, title: '系统维护通知', date: '2024-08-12', content: '系统将在明天维护。' },
  { id: 6, title: '新功能上线', date: '2024-08-10', content: '我们即将推出新功能，敬请期待！' },
]);

const venueNotifications = ref([
  { id: 7, title: '场馆开放时间调整', date: '2024-08-11', content: '场馆开放时间将进行调整。' },
  { id: 8, title: '新场馆开放', date: '2024-08-09', content: '新场馆将于下周正式开放。' },
]);

const notificationTypes = ref({
  group: { title: '团体加入通知', notifications: groupNotifications.value },
  booking: { title: '预约通知', notifications: bookingNotifications.value },
  homepage: { title: '主页通知', notifications: homepageNotifications.value },
  venue: { title: '场馆动态', notifications: venueNotifications.value },
});

const selectedAnnouncement = ref(null);
const selectedNotifications = ref([]);
const isModalVisible = ref(false);
const isDetailModalVisible = ref(false);
const modalTitle = ref('');

const viewAnnouncement = (announcement) => {
  selectedAnnouncement.value = announcement;
  isDetailModalVisible.value = true;
};

const showMore = (type) => {
  selectedNotifications.value = notificationTypes.value[type].notifications;
  modalTitle.value = notificationTypes.value[type].title;
  isModalVisible.value = true;
};

const closeModal = () => {
  isModalVisible.value = false;
};

const closeDetailModal = () => {
  isDetailModalVisible.value = false;
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
  grid-template-columns: repeat(2, 1fr);
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

ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

li {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 0;
  border-bottom: 1px solid #e0e0e0;
}

a {
  color: #007BFF;
  text-decoration: none;
  cursor: pointer;
}

a:hover {
  text-decoration: underline;
}

.modal-title {
  display: flex;
  justify-content: space-between;
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
</style>
