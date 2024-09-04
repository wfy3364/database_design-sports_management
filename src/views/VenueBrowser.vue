<template>
  <div class="venue-browser">
    <div class="venueBrowserTitle">场地信息浏览</div>

    <!-- 筛选区域 -->
    <div class="FilterArea">
      <div class="FilterOption">
        <div class="FilterLabel">场地搜索：</div>
        <el-input v-model="searchQuery" class="SearchBox" placeholder="场地ID或名称">
          <template #prefix>
            <el-icon><search /></el-icon>
          </template>
        </el-input>
      </div>
      <div class="FilterOption">
        <div class="FilterLabel">运动类型：</div>
        <el-radio-group v-model="selectedSport">
          <el-radio-button value="">全部</el-radio-button>
          <el-radio-button v-for="sport in sports" :value="sport" :key="sport">{{ sport }}</el-radio-button>
        </el-radio-group>
      </div>
      <div class="FilterOption">
        <el-checkbox v-model="enableDateFilter">开放日期筛选</el-checkbox>
        <el-date-picker v-if="enableDateFilter" v-model="filterDate" placeholder="选择日期"></el-date-picker>
      </div>
      <div class="FilterControl">
        <el-button type="primary" @click="filterVenues">确认筛选</el-button>
        <el-button @click="filterReset">重置条件</el-button>
      </div>
    </div>

    <!-- 场地列表展示 -->
    <div class="venue-list">
      <div 
        v-for="venue in filteredVenues" 
        :key="venue.id" 
        class="venue-item"
        @click="viewVenueDetails(venue)" 
        role="button"
      >
        <img class="venueImg" :src="venue.image" alt="场地图片" />
        <div class="venue-details">
          <h3>{{ venue.name }}</h3>
          <p>ID: {{ venue.id }}</p>
          <p>类型: {{ venue.sport }}</p>
          <p>总容量: {{ venue.totalCapacity }}</p>
        </div>
      </div>
    </div>

    <!-- 场地详情模态框 -->
    <!-- <div v-if="selectedVenue" class="modal" @click="closeModal">
      <div class="modal-content" @click.stop>
        <div class="modalHeader">
          <div class="modalTitle">{{ selectedVenue.name }}</div>
          <el-button class="closeButton" type="danger" @click="closeModal">关闭</el-button>
        </div> -->
    <el-dialog v-model="showVenueDetail" align-center :title="selectedVenue?.name">
      <div class="detailContent">
        <img class="venueImg" :src="selectedVenue.image" alt="场地图片" />
        <div class="venue-timeslots">
          <el-table :data="selectedVenue.timeslots" border :default-sort="{ prop: 'time' }">
            <el-table-column prop="time" label="时间" sortable></el-table-column>
            <el-table-column prop="capacity" label="剩余容量" width="105" sortable></el-table-column>
            <el-table-column prop="price" label="价格" width="80" sortable></el-table-column>
            <el-table-column label="操作" width="80">
              <template #default="item">
                <el-button type="primary" size="small" @click="bookVenue(selectedVenue, item.row)">预约</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
        
        <!-- 删除场地简介和场地公告部分 -->
        
        <div class="modalSubtitle">其他信息</div>
        <div class="modalItemContent">
          <div class="otherInfoLine">
            <div class="otherInfoLabel">场地编号：</div>
            <div>{{ selectedVenue.id }}</div>
          </div>
          <div class="otherInfoLine">
            <div class="otherInfoLabel">运动类型：</div>
            <div>{{ selectedVenue.sport }}</div>
          </div>
          <div class="otherInfoLine">
            <div class="otherInfoLabel">管理员：</div>
            <div>{{ selectedVenue.manager }}</div>
          </div>
          <div class="otherInfoLine">
            <div class="otherInfoLabel">场地位置：</div>
            <div>{{ selectedVenue.address }}</div>
          </div>
        </div>
      </div>
      <template #footer>
        <el-button type="primary" @click="showVenueDetail = false">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { Search } from '@element-plus/icons-vue';
import dayjs from 'dayjs';

// 场地数据示例，包括ID、名称、运动类型、图片、时间段、管理员信息和地址
const venues = ref([
  {
    id: 1,
    name: '体育场A',
    sport: '足球',
    totalCapacity: 100,
    image: '',
    timeslots: [
      { id: 1, time: '2024-08-24 08:00-10:00', capacity: 10, price: 100 },
      { id: 2, time: '2024-08-24 10:00-12:00', capacity: 8, price: 120 },
    ],
    manager: '张三',
    address: '北京市朝阳区体育场路1号',
    phone: '010-12345678',
  },
  {
    id: 2,
    name: '羽毛球馆C',
    sport: '羽毛球',
    totalCapacity: 30,
    image: '',
    timeslots: [
      { id: 1, time: '2024-08-24 08:00-09:30', capacity: 3, price: 50 },
      { id: 2, time: '2024-08-24 09:30-11:00', capacity: 4, price: 60 },
    ],
    manager: '王五',
    address: '北京市东城区羽毛球馆路3号',
    phone: '010-13579135',
  },
  {
    id: 3,
    name: '篮球馆B',
    sport: '篮球',
    totalCapacity: 50,
    image: '',
    timeslots: [
      { id: 1, time: '2024-08-24 09:00-11:00', capacity: 5, price: 80 },
      { id: 2, time: '2024-08-24 11:00-13:00', capacity: 5, price: 90 },
    ],
    manager: '李四',
    address: '北京市海淀区篮球馆路2号',
    phone: '010-87654321',
  },
  {
    id: 4,
    name: '游泳馆D',
    sport: '网球',
    totalCapacity: 70,
    image: '',
    timeslots: [
      { id: 1, time: '2024-08-24 07:00-09:00', capacity: 10, price: 100 },
      { id: 2, time: '2024-08-24 09:00-11:00', capacity: 12, price: 120 },
    ],
    manager: '赵六',
    address: '北京市丰台区游泳馆路4号',
    phone: '010-11223344',
  },
  // 更多场馆数据...
]);

// 运动类型选项
const sports = ref(['足球', '篮球', '网球', '羽毛球']);

// 定义搜索和筛选相关的状态
const searchQuery = ref('');
const selectedSport = ref('');
const selectedVenue = ref(null);
const showVenueDetail = ref(false);
const venueDate = ref(dayjs().format("YYYY-MM-DD"));
const filterDate = ref(dayjs().format("YYYY-MM-DD"));
const enableDateFilter = ref(false);
const router = useRouter();

const filteredVenues = ref([]);

// 初始化场地列表
const initializeVenues = () => {
  filteredVenues.value = venues.value.sort((a, b) => a.name.localeCompare(b.name));
};

// 处理筛选操作的函数
const filterVenues = () => {
  filteredVenues.value = venues.value.filter(venue => {
    const matchesSearchQuery = searchQuery.value
      ? (isNaN(+searchQuery.value)
        ? venue.name.includes(searchQuery.value)
        : venue.id.toString() === searchQuery.value)
      : true;
    const matchesSport = selectedSport.value ? venue.sport === selectedSport.value : true;
    const matchesDate = enableDateFilter.value
      ? venue.timeslots.some(slot => slot.time.includes(filterDate.value))
      : true;
    return matchesSearchQuery && matchesSport && matchesDate;
  }).sort((a, b) => a.name.localeCompare(b.name));
};

const filterReset = () => {
  searchQuery.value = '';
  selectedSport.value = '';
  enableDateFilter.value = false;
  filterDate.value = dayjs().format("YYYY-MM-DD");
  initializeVenues();
};

// 显示场地详情的函数
const viewVenueDetails = (venue) => {
  selectedVenue.value = venue;
  showVenueDetail.value = true;
};

const showAnnouncementDetails = (announcement) => {
  alert(`公告详情:\n标题: ${announcement.title}\n时间: ${announcement.time}`);
};

// 关闭模态框的函数
const closeModal = () => {
  selectedVenue.value = null; 
};

// 处理场地预约的函数
const bookVenue = (venue, slot) => {
  router.push({
    path: '/VenueReservation',
    query: {
      venue: venue.id,
      timeslot: slot.id,
    },
  });
};

const setDate = (val) => {
  venueDate.value = dayjs(venueDate.value).add(val, "day").format("YYYY-MM-DD");
};

const handleDateChange = () => {
  // 处理日期变更逻辑
};

// 初始化
initializeVenues();

</script>

<style scoped>

.venue-browser {
  display: flex;
  flex-direction: column;
  width: calc(100% - 20px);
  padding-bottom: 10px;
  margin: 10px;
  border-radius: 5px;
  background-color: white; /* 设为纯白色背景 */
  border: 1px solid lightgray;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.venueBrowserTitle {
  font-size: 24px;
  font-weight: bold;
  text-align: center;
  color: #333;
  margin: 20px 0; /* 调整标题的外边距 */
}

.FilterArea {
  display: flex;
  flex-direction: column;
  align-items: center; /* 水平居中对齐 */
  justify-content: center; /* 垂直居中对齐 */
  gap: 20px;
  padding: 20px;
  background-color: #fff;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  margin-bottom: 20px;
}

.FilterLabel{
  width: 100px;
  font-weight: 700;
}

.FilterOption {
  display: flex;
  align-items: center;
  /* justify-content: center; */
  gap: 10px;
  width: 100%; /* 占据全宽以便居中 */
  max-width: 500px; /* 设置一个最大宽度 */
}

.FilterControl {
  display: flex;
  justify-content: center;
  gap: 10px;
  margin-top: 10px;
}

.venue-list {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  width: 100%;
  padding: 20px;
  box-sizing: border-box;
}

.venue-item {
  flex: 1 1 30%; /* 每个场地项固定宽度为30% */
  max-width: 30%;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  padding: 15px;
  background-color: #fff;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  margin-bottom: 20px;
  box-sizing: border-box;
  cursor: pointer;
  transition: box-shadow 0.3s ease, transform 0.3s ease;
}

.venue-item:hover {
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  transform: translateY(-5px);
}

.modalHeader {
  display: flex;
  justify-content: center; /* 标题居中对齐 */
  align-items: center;
  position: relative;
  margin-bottom: 20px;
}

.modalTitle {
  font-size: 22px;
  font-weight: bold;
  text-align: center;
  flex: 1;
}

.closeButton {
  position: absolute;
  right: 10px;
  top: 10px;
}

.modalSubtitle {
  font-size: 18px;
  margin-top: 20px;
  text-align: center;
  margin-bottom: 10px;
  font-weight: bold;
}

.modalItemContent {
  margin-bottom: 20px;
  /* text-align: center; */
}

.otherInfoLine {
  display: flex;
  /* justify-content: space-between; */
  padding: 5px 0;
}

.otherInfoLabel {
  font-weight: bold;
  width: 100px;
  color: #333;
}

.venue-timeslots {
  margin-bottom: 20px;
}

.venueImg {
  width: 100%;
  height: auto;
  border-radius: 4px;
  margin-bottom: 20px;
}

.venue-details {
  width: 100%;
  padding: 10px;
  background-color: #fafafa;
  border-radius: 4px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  text-align: center;
}

.venue-details h3 {
  margin: 0 0 10px 0;
  font-size: 18px;
  color: #2c3e50;
  font-weight: bold;
}

.venue-details p {
  margin: 5px 0;
  font-size: 14px;
  color: #606266;
  line-height: 1.5;
}

.modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.6);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  width: 25%; 
  max-width: 800px;
  background-color: #fff;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  position: relative;
}

.timeslotHeader {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px;
  margin: 20px 0;
}

.detailContent{
  overflow: auto;
  max-height: 75vh;
}


</style>

