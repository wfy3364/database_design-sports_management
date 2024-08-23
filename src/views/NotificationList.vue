<template>
    <div class="announcement-notification">
      <div class="notificationTitle">通知与公告</div>
  
      <div class="sections">
        <!-- 用户加入团体成功的通知部分 -->
        <div class="section">
          <h2>团体加入通知</h2>
          <ul>
            <li v-for="notification in groupNotifications" :key="notification.id">
              <span>{{ notification.id }}</span> - 
              <span>{{ notification.title }}</span> 
              ({{ notification.date }})
              <button @click="viewAnnouncement(notification)">查看</button>
            </li>
          </ul>
        </div>
  
        <!-- 用户预约通知部分 -->
        <div class="section">
          <h2>预约通知</h2>
          <ul>
            <li v-for="notification in bookingNotifications" :key="notification.id">
              <span>{{ notification.id }}</span> - 
              <span>{{ notification.title }}</span> 
              ({{ notification.date }})
              <button @click="viewAnnouncement(notification)">查看</button>
            </li>
          </ul>
        </div>
  
        <!-- 主页显示若干条通知部分 -->
        <div class="section">
          <h2>主页通知</h2>
          <ul>
            <li v-for="notification in homepageNotifications" :key="notification.id">
              <span>{{ notification.id }}</span> - 
              <span>{{ notification.title }}</span> 
              ({{ notification.date }})
              <button @click="viewAnnouncement(notification)">查看</button>
            </li>
          </ul>
        </div>
  
        <!-- 场馆动态通知部分 -->
        <div class="section">
          <h2>场馆动态</h2>
          <ul>
            <li v-for="notification in venueNotifications" :key="notification.id">
              <span>{{ notification.id }}</span> - 
              <span>{{ notification.title }}</span> 
              ({{ notification.date }})
              <button @click="viewAnnouncement(notification)">查看</button>
            </li>
          </ul>
        </div>
      </div>
  
      <!-- 弹出公告详情模态框 -->
      <div v-if="selectedAnnouncement" class="modal" @click="closeModal">
        <div class="modal-content" @click.stop>
          <h2>{{ selectedAnnouncement.title }}</h2>
          <p>{{ selectedAnnouncement.content }}</p>
          <button @click="closeModal">关闭</button>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue';
  
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
  
  const selectedAnnouncement = ref(null);
  
  const viewAnnouncement = (announcement) => {
    selectedAnnouncement.value = announcement;
  };
  
  const closeModal = () => {
    selectedAnnouncement.value = null;
  };
  </script>
  
  <style scoped>
  .announcement-notification {
    display: flex;
    flex-direction: column;
    border-radius: 5px;
    background-color: white;
    border: 1px solid lightgray;
    margin: 10px;
    max-width: 1200px;
  }
  
  .notificationTitle{
    display: flex;
    justify-content: center;
    font-size: 20px;
    font-weight: 700;
    padding: 10px;
    border-bottom: 1px solid black;
  }

  .sections {
    display: grid;
    grid-template-columns: 1fr 1fr; /* 两列布局 */
    gap: 1em;
  }
  
  .section {
    background-color: #f9f9f9;
    padding: 1em;
    border-radius: 8px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  }
  
  .section h2 {
    margin-bottom: 1em;
    color: #5a5a5a;
  }
  
  ul {
    list-style: none;
    padding: 0;
  }
  
  li {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px 0;
    border-bottom: 1px solid #ccc;
  }
  
  button {
    margin-left: 1em;
    padding: 5px 10px;
    background-color: #007BFF;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
  }
  
  button:hover {
    background-color: #0056b3;
  }
  
  .modal {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
  }
  
  .modal-content {
    background-color: white;
    padding: 20px;
    border-radius: 8px;
    max-width: 500px;
    width: 90%;
  }
  </style>
  