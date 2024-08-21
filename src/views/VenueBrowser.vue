<template>
    <div class="venue-browser">
      <h1>场地信息浏览</h1>
  
      <!-- 查找框 -->
      <div class="search-box">
        <input v-model="searchQuery" @input="handleSearch" placeholder="输入场地ID或名称" />
      </div>
  
      <!-- 筛选条件 -->
      <div class="filters">
        <label>
          时间段：
          <input type="date" v-model="startDate" /> - 
          <input type="date" v-model="endDate" />
        </label>
        <label>
          运动类型：
          <select v-model="selectedSport">
            <option value="">全部</option>
            <option v-for="sport in sports" :key="sport">{{ sport }}</option>
          </select>
        </label>
        <button @click="filterVenues">筛选</button>
      </div>
  
      <!-- 列表展示 -->
      <div class="venue-list">
        <div v-for="venue in filteredVenues" :key="venue.id" class="venue-item">
          <img :src="venue.image" alt="场地图片" />
          <div class="venue-details">
            <h3>{{ venue.name }}</h3>
            <p>ID: {{ venue.id }}</p>
            <p>类型: {{ venue.sport }}</p>
            <button @click="viewVenueDetails(venue)">查看详情</button>
          </div>
        </div>
      </div>
  
      <!-- 场地详情模态框 -->
      <div v-if="selectedVenue" class="modal" @click="closeModal">
        <div class="modal-content" @click.stop>
          <h2>{{ selectedVenue.name }}</h2>
          <img :src="selectedVenue.image" alt="场地图片" />
          <div class="venue-timeslots">
            <div v-for="slot in selectedVenue.timeslots" :key="slot.time" class="timeslot">
              <p>{{ slot.time }} - 剩余容量: {{ slot.capacity }} - 价格: {{ slot.price }}元</p>
              <button @click="bookVenue(selectedVenue, slot)">预约</button>
            </div>
          </div>
          <p>{{ selectedVenue.description }}</p>
          <h3>相关公告</h3>
          <ul>
            <li v-for="announcement in selectedVenue.announcements" :key="announcement.id">{{ announcement.title }}</li>
          </ul>
          <h3>场地管理员</h3>
          <p>{{ selectedVenue.manager }}</p>
          <button @click="closeModal">关闭</button>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, computed } from 'vue';
  import { useRouter } from 'vue-router';
  
  // 场地数据示例，包括ID、名称、运动类型、图片、时间段、描述、公告和管理员信息
  const venues = ref([
    {
      id: 1,
      name: '体育场A',
      sport: '足球',
      image: '',
      timeslots: [
        { time: '08:00-10:00', capacity: 10, price: 100 },
        { time: '10:00-12:00', capacity: 8, price: 120 },
      ],
      description: '这是体育场A的详细描述。',
      announcements: [{ id: 1, title: '体育场A关闭通知' }],
      manager: '张三',
    },
    {
      id: 2,
      name: '体育场B',
      sport: '篮球',
      image: '',
      timeslots: [
        { time: '08:00-10:00', capacity: 5, price: 80 },
        { time: '10:00-12:00', capacity: 2, price: 90 },
      ],
      description: '这是体育场B的详细描述。',
      announcements: [{ id: 2, title: '体育场B维修通知' }],
      manager: '李四',
    },
    // 更多场馆数据
  ]);
  
  // 运动类型选项
  const sports = ref(['足球', '篮球', '网球', '羽毛球']);
  
  // 定义搜索和筛选相关的状态
  const searchQuery = ref('');  
  const startDate = ref('');    
  const endDate = ref('');     
  const selectedSport = ref(''); 
  const selectedVenue = ref(null); 
  const router = useRouter();
  
  // 处理搜索操作的函数
  const handleSearch = () => {
    console.log('搜索:', searchQuery.value); 
  };
  
  // 处理筛选操作的函数
  const filterVenues = () => {
    console.log('筛选条件:', startDate.value, endDate.value, selectedSport.value); 
  };
  
  // 计算属性，用于筛选和排序场地列表
  const filteredVenues = computed(() => {
    return venues.value.filter(venue => {
      // 匹配搜索关键词：如果是数字，则匹配ID；如果是字符串，则匹配名称
      const matchesSearchQuery = searchQuery.value 
        ? (isNaN(searchQuery.value) 
          ? venue.name.includes(searchQuery.value) 
          : venue.id.toString() === searchQuery.value)
        : true;
  
      // 匹配运动类型：如果选择了运动类型，则只显示匹配的场地
      const matchesSport = selectedSport.value ? venue.sport === selectedSport.value : true;
  
      // 返回符合条件的场地
      return matchesSearchQuery && matchesSport;
    }).sort((a, b) => a.name.localeCompare(b.name)); // 根据场地名称排序
  });
  
  // 显示场地详情的函数
  const viewVenueDetails = (venue) => {
    selectedVenue.value = venue; // 设置当前选中的场地，显示模态框
  };
  
  // 关闭模态框的函数
  const closeModal = () => {
    selectedVenue.value = null; // 清空选中的场地，关闭模态框
  };
  
  // 处理场地预约的函数
  const bookVenue = (venue, slot) => {
    router.push({
      name: 'VenueReservation', // 跳转到场地预约页面
      query: {
        venue: venue.name,       // 将场地名称和时间段作为查询参数传递
        timeslot: slot.time,
      },
    });
  };
  </script>
  
  <style scoped>
  .venue-browser {
    max-width: 1200px;
    margin: auto;
    padding: 1em;
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  
  .search-box {
    margin-bottom: 1em;
    width: 100%;
    max-width: 500px;
  }
  
  .filters {
    margin-bottom: 2em;
    display: flex;
    gap: 1em;
    justify-content: center;
    width: 100%;
  }
  
  .venue-list {
    display: flex;
    flex-wrap: wrap;
    gap: 1em;
    justify-content: center; /* 使内容居中 */
    width: 100%;
  }
  
  .venue-item {
    background-color: #f9f9f9;
    padding: 1em;
    border-radius: 8px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
    max-width: 300px; /* 控制每个卡片的最大宽度 */
  }
  
  .venue-item img {
    width: 100%;
    border-radius: 8px;
  }
  
  .venue-details {
    text-align: center;
  }
  
  button {
    margin-top: 10px;
    padding: 10px 20px;
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
  
  .venue-timeslots .timeslot {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 5px 0;
    border-bottom: 1px solid #ccc;
  }
  </style>
  