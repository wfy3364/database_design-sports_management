<template>
    <div class="venue-browser">
      <div class="venueBrowserTitle">场地信息浏览</div>
  
      <!-- 查找框 -->
      <!-- <div class="search-box">
        <input v-model="searchQuery" @input="handleSearch" placeholder="输入场地ID或名称" />
      </div> -->
      <div class="FilterArea">
        <div class="SearchArea">
          <el-input v-model="searchQuery" class="SearchBox" placeholder="场地ID或名称">
            <template #prefix>
              <el-icon><search /></el-icon>
            </template>
          </el-input>
        </div>
        <div class="FilterOption">
          <div class="FilterText">运动类型</div>
          <el-radio-group v-model="selectedSport">
            <el-radio-button value="">全部</el-radio-button>
            <el-radio-button v-for="sport in sports" :value="sport" :key="sport">{{ sport }}</el-radio-button>
          </el-radio-group>
        </div>
        <div class="FilterControl">
          <el-button type="primary" @click="filterVenues">确认筛选</el-button>
          <el-button @click="filterReset">重置条件</el-button>
        </div>
      </div>
      <!-- 筛选条件 -->
      <!-- <div class="filters">
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
        <el-button @click="filterVenues">筛选</el-button>
      </div> -->
  
      <!-- 列表展示 -->
      <div class="venue-list">
        <div v-for="venue in filteredVenues" :key="venue.id" class="venue-item"  @click="viewVenueDetails(venue)">
          <img class="venueImg" :src="venue.image" alt="场地图片" />
          <div class="venue-details">
            <h3>{{ venue.name }}</h3>
            <p>ID: {{ venue.id }}</p>
            <p>类型: {{ venue.sport }}</p>
            <!-- <button @click="viewVenueDetails(venue)">查看详情</button> -->
          </div>
        </div>
      </div>
  
      <!-- 场地详情模态框 -->
      <div v-if="selectedVenue" class="modal" @click="closeModal">
        <div class="modal-content" @click.stop>
          <div class="modalHeader">
            <div class="modalTitle">{{ selectedVenue.name }}</div>
            <el-button class="closeButton" type="danger" @click="closeModal">关闭</el-button>
          </div>
          <img class="venueImg" :src="selectedVenue.image" alt="场地图片" />
          <div class="modalSubtitle">开放时间段</div>
          <div class="venue-timeslots">
            <!-- <div v-for="slot in selectedVenue.timeslots" :key="slot.time" class="timeslot">
              <p>{{ slot.time }} - 剩余容量: {{ slot.capacity }} - 价格: {{ slot.price }}元</p>
              <button @click="bookVenue(selectedVenue, slot)">预约</button>
            </div> -->
            <div class="timeslotHeader">
              <el-button size="small" @click="setDate(-1)">&lt;</el-button>
              <el-date-picker v-model="venueDate" size="small"
                @change="handleDateChange()"></el-date-picker>
              <el-button size="small" @click="setDate(1)">&gt;</el-button>
            </div>
            <el-table :data="selectedVenue.timeslots" :key="selectedVenue.timeslots.time" 
              border :default-sort="{ prop: 'time'} ">
              <el-table-column prop="time" label="时间" sortable :resizable="false"></el-table-column>
              <el-table-column prop="capacity" label="剩余容量" width="105" sortable :resizable="false"></el-table-column>
              <el-table-column prop="price" label="价格" width="80" sortable :resizable="false"></el-table-column>
              <el-table-column label="操作" width="80">
                <template #default="item">
                  <el-button type="primary" size="small" 
                  @click="bookVenue(selectedVenue, item.row)">预约</el-button>
                </template>
              </el-table-column>
            </el-table>
          </div>
          <div class="modalSubtitle">场地简介</div>
          <div class="modalItemContent">{{ selectedVenue.description }}</div>
          <div class="modalSubtitle">场地公告</div>
            <el-table :data="selectedVenue.announcements" :key="selectedVenue.announcements.id"
            :show-header="false">
              <el-table-column prop="title"></el-table-column>
              <el-table-column prop="time" width="150"></el-table-column>
              <el-table-column width="80">
                <template #default="item">
                  <el-button size="small">详情</el-button>
                </template>
              </el-table-column>
            </el-table>
          <!-- <ul>
            <li v-for="announcement in selectedVenue.announcements" :key="announcement.id">{{ announcement.title }}</li>
          </ul> -->
          <!-- <h3>场地管理员</h3> -->
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
          </div>
          <!-- <p>{{ selectedVenue.manager }}</p> -->
          <!-- <button @click="closeModal">关闭</button> -->
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, computed } from 'vue';
  import { useRouter } from 'vue-router';
  import { Search } from '@element-plus/icons-vue';
  import { dayjs } from 'element-plus'
  
  // 场地数据示例，包括ID、名称、运动类型、图片、时间段、描述、公告和管理员信息
  const venues = ref([
    {
      id: 1,
      name: '体育场A',
      sport: '足球',
      image: '',
      timeslots: [
        { id: 1, time: '08:00-10:00', capacity: 10, price: 100 },
        { id: 2, time: '10:00-12:00', capacity: 8, price: 120 },
      ],
      description: '这是体育场A的详细描述。',
      announcements: [{ id: 1, time: '2024-08-22 13:00', title: '体育场A关闭通知' }],
      manager: '张三',
    },
    {
      id: 2,
      name: '体育场B',
      sport: '篮球',
      image: '',
      timeslots: [
        { id: 3, time: '08:00-10:00', capacity: 5, price: 80 },
        { id: 4, time: '10:00-12:00', capacity: 2, price: 90 },
      ],
      description: '这是体育场B的详细描述。',
      announcements: [{ id: 2, time: '2024-08-22 12:00',title: '体育场B维修通知' }],
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
  const venueDate = ref(dayjs().format("YYYY-MM-DD"));
  const router = useRouter();
  
  // 处理搜索操作的函数
  const handleSearch = () => {
    console.log('搜索:', searchQuery.value); 
  };
  
  const filteredVenues = ref(venues.value.sort((a, b) => a.name.localeCompare(b.name)));
  // 处理筛选操作的函数
  const filterVenues = () => {
    // console.log('筛选条件:', startDate.value, endDate.value, selectedSport.value);
    filteredVenues.value = venues.value;
    
    // 匹配关键字
    filteredVenues.value = filteredVenues.value.filter(venue => {
      // 匹配搜索关键词：如果是数字，则匹配ID；如果是字符串，则匹配名称
      const matchesSearchQuery = searchQuery.value 
        ? (isNaN(+searchQuery.value) 
          ? venue.name.includes(searchQuery.value) 
          : venue.id.toString() === searchQuery.value)
        : true;
      // 匹配运动类型：如果选择了运动类型，则只显示匹配的场地
      const matchesSport = selectedSport.value ? venue.sport === selectedSport.value : true;
  
      // 返回符合条件的场地
      return matchesSearchQuery && matchesSport;
    });
    filteredVenues.value.sort((a, b) => a.name.localeCompare(b.name)); // 根据场地名称排序
    console.log(filteredVenues.value);
  };

  const filterReset = () => {
    searchQuery.value = '';
    selectedSport.value = '';
    filteredVenues.value = venues.value.sort((a, b) => a.name.localeCompare(b.name));
  } 
  
  // 计算属性，用于筛选和排序场地列表
  // const filteredVenues = computed(() => {
  //   return venues.value.filter(venue => {
  //     // 匹配搜索关键词：如果是数字，则匹配ID；如果是字符串，则匹配名称
  //     const matchesSearchQuery = searchQuery.value 
  //       ? (isNaN(+searchQuery.value) 
  //         ? venue.name.includes(searchQuery.value) 
  //         : venue.id.toString() === searchQuery.value)
  //       : true;
  
  //     // 匹配运动类型：如果选择了运动类型，则只显示匹配的场地
  //     const matchesSport = selectedSport.value ? venue.sport === selectedSport.value : true;
  
  //     // 返回符合条件的场地
  //     return matchesSearchQuery && matchesSport;
  //   }).sort((a, b) => a.name.localeCompare(b.name)); // 根据场地名称排序
  // });
  
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
      path: '/VenueReservation', // 跳转到场地预约页面
      query: {
        venue: venue.id,       // 将场地名称和时间段作为查询参数传递
        timeslot: slot.id,
      },
    });
  };

  const setDate = (val) => {
    venueDate.value = dayjs(venueDate.value).add(val, "day").format("YYYY-MM-DD");
  }

  const handleDateChange = () => {

  }

  </script>
  
  <style scoped>

  .venueBrowserTitle{
    display: flex;
    justify-content: center;
    width: 100%;
    font-size: 25px;
    font-weight: 700;
    padding: 10px;
    border-bottom: 1px solid black;
  }

  .venue-browser {
    /* max-width: 1200px */
    display: flex;
    flex-direction: column;
    background-color: white;
    border: 1px solid lightgray;
    border-radius: 5px;
    margin: 10px;
  }
  
  .FilterArea{
    display: flex;
    flex-direction: column;
    padding: 10px;
    border-top: 1px solid lightgray;
    border-bottom: 1px solid lightgray;
  }

  .SearchArea{
    display: flex;
    margin-bottom: 10px;
    padding-left: 10px;
  }

  .SearchBox{
    flex: 1;
    margin-right: 10px;
  }

  .FilterOption{
    display: flex;
    padding-left: 10px;
    margin-top: 10px;
    margin-bottom: 10px;
  }

  .FilterText{
    line-height: var(--el-component-size);
    margin-right: 20px;
  }

  .FilterControl{
    display: flex;
    justify-content: center;
    margin-top: 10px;
  }

  /* .search-box {
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
  } */
  
  .venue-list {
    display: flex;
    flex-wrap: wrap;
    /* gap: 1em; */
    /* justify-content: center; */
    width: 100%;
  }
  
  .venue-item {
    background-color: white;
    /* padding: 1em; */
    border-radius: 8px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    display: flex;
    flex-direction: column;
    /* align-items: center; */
    /* width: 100%; */
    width: 300px; /* 控制每个卡片的最大宽度 */
    margin: 10px;
    padding: 10px;
    border: 1px solid lightgray;
    border-radius: 3px;
  }

  .venue-item:hover{
    background-color: #f4f4f4;
    cursor: pointer;
  }
  
  .venueImg {
    width: 100%;
    height: 200px;
    border-radius: 8px;
  }
  
  /* .venue-details {
    text-align: center;
  } */
  
  /* button {
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
  } */
  
  .modal {
    display: flex;
    align-items: center;
    justify-content: center;
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100vh;
    background-color: rgba(0, 0, 0, 0.5);
  }

  .modalHeader{
    display: flex;
    justify-content: center;
  }

  .closeButton{
    margin-left: auto;
  }

  .modalTitle{
    display: flex;
    justify-content: center;
    position: relative;
    width: 50%;
    left: 25%;
    font-size: 20px;
    font-weight: 700;
    margin-bottom: 10px;
  }
  
  .modal-content {
    background-color: white;
    padding: 20px;
    border-radius: 8px;
    max-width: 500px;
    width: 90%;
    height: 100vh;
    overflow: auto;
  }

  .modal-content img{
    width: 100%;
    height: 300px;
  }

  .venue-timeslots{
    margin-top: 10px;
    margin-bottom: 10px;
  }
  
  /* .venue-timeslots .timeslot {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 5px 0;
    border-bottom: 1px solid #ccc;
  } */

  .timeslotHeader{
    display: flex;
    justify-content: center;
    width: 100%;
  }

  .modalSubtitle{
    font-size: 18px;
    font-weight: 700;
    padding-top: 5px;
    padding-bottom: 5px;
    border-bottom: 1px solid black;
  }

  .modalItemContent{
    margin-top: 10px;
    margin-bottom: 10px;
  }

  .otherInfoLine{
    display: flex;
  }

  .otherInfoLabel{
    width: 100px;
    font-weight: 700;
  }

  </style>
  