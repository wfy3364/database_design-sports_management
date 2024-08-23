<template>
    <div>
      <header>
        <!-- <nav>
          <button v-if="!isLoggedIn" @click="goToLogin">登录</button>
        </nav> -->
      </header>
  
      <main>
        <div class="ReservationList">
          <div class="ReservationTitle">预约记录</div>
            <!-- <div class="search-bar">
              <input v-model="searchId" placeholder="根据预约ID搜索" />
              <input v-model="startDate" type="date" />
              <input v-model="endDate" type="date" />
              <button @click="searchAppointments">搜索</button>
            </div> -->
          <div class="FilterArea">
            <div class="SearchArea">
              <el-radio-group v-model="searchType">
                <el-radio value="0">预约搜索</el-radio>
                <el-radio value="1">场地搜索</el-radio>
              </el-radio-group>
              <el-input v-model="searchContent" class="SearchBox" 
                :placeholder="searchPlaceholder[+searchType]">
                <template #prefix>
                  <el-icon><search /></el-icon>
                </template>
              </el-input>
            </div>
            <div class="FilterOption">
              <div class="FilterText">预约类型</div>
              <el-radio-group v-model="reservationType">
                <el-radio-button value="0">个人</el-radio-button>
                <el-radio-button value="1">团体</el-radio-button>
              </el-radio-group>
            </div>
            <div class="FilterOption">
              <div class="FilterText">预约日期</div>
              <div>
                <el-date-picker v-model="dateRange" type="daterange" unlink-panels
                range-separator="到" start-placeholder="开始日期"
                end-placeholder="结束日期"/>
              </div>
            </div>
            <!-- 还需要添加的筛选选项：状态、类型 -->
            <div class="FilterControl">
              <el-button @click="handleSearch" type="primary">确认筛选</el-button>
              <el-button @click="FilterReset">重置条件</el-button>
            </div>
          </div>

          <!-- <table>
            <thead>
              <tr>
                <th>场地名称</th>
                <th>预约时间</th>
                <th>支付价格</th>
                <th>操作</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="appointment in filteredAppointments" :key="appointment.id">
                <td>{{ appointment.venueName }}</td>
                <td>{{ formatDateTime(appointment.startTime) }} - {{ formatDateTime(appointment.endTime) }}</td>
                <td>{{ appointment.price }}</td>
                <td>
                  <button @click="showAppointmentDetails(appointment)">查看详细</button>
                  <button @click="cancelAppointment(appointment)">取消预约</button>
                </td>
              </tr>
            </tbody>
          </table> -->
          <el-table :data="filteredAppointments" :key="filteredAppointments.id" :show-overflow-tooltip="{ effect: 'light'}">
            <el-table-column label="记录号" prop="id" width="100" sortable></el-table-column>
            <el-table-column label="场地名称" prop="venueName" width="110" sortable></el-table-column>
            <el-table-column label="操作时间" sortable>
              <!-- 预约记录的操作时间 -->
            </el-table-column>
            <el-table-column label="预约时间段" sortable>
              <template #default="item">
                <!-- 此处改成：日期+开始时间+结束时间，格式如下 -->
                2024-08-23 09:00-10:00
                <!-- {{ formatDateTime(item.row.startTime) }} - {{ formatDateTime(item.row.endTime) }} -->
              </template>
            </el-table-column>
            <el-table-column prop="price" label="支付价格" width="110" sortable></el-table-column>
            <el-table-column label="状态" width="100" sortable>
              <!-- 状态类型：已预约、已取消、已完成、违约 -->
            </el-table-column>
            <el-table-column label="操作" width="190">
              <template #default="item">
                <el-button size="small" type="primary" @click="showAppointmentDetails(item.row)">查看详细</el-button>
                <el-button size="small" @click="cancelAppointment(item.row)">取消预约</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </main>
      
      <!-- <div v-if="showDetailModal" class="modal0">
        <div class="modal0-content">
          <h2>预约详情</h2>
          <p>场地名称: {{ selectedAppointment.venueName }}</p>
          <p>预约时间: {{ formatDateTime(selectedAppointment.startTime) }} - {{ formatDateTime(selectedAppointment.endTime) }}</p>
          <p>支付价格: {{ selectedAppointment.price }}</p>
          <button @click="showDetailModal = false">关闭</button>
        </div>
      </div> -->

      <div v-if="showDetailModal" class="modal">
        <div class="modal-content">
          <div class="modalHeader">
            <div class="modalTitle">预约详情</div>
            <el-button class="closeButton" type="danger" @click="showDetailModal = false">关闭</el-button>
          </div>
          <div class="detailLine">
            <div class="detailLabel">预约编号：</div>
            <div class="detailContent">{{ selectedAppointment.id }}</div>
          </div>
          <div class="detailLine">
            <div class="detailLabel">场地名称：</div>
            <div class="detailContent">{{ selectedAppointment.venueName }}</div>
          </div>
        </div>
      </div>
  
      <div v-if="showCancelModal" class="modal">
        <div class="modal-content">
          <!-- <h2>取消预约</h2> -->
          <div class="modalHeader">
            <div class="modalTitle">取消预约</div>
            <el-button class="closeButton" type="danger" @click="showCancelModal = false">关闭</el-button>
          </div>
          <div class="detailLine">
            <div class="detailLabel">预约编号：</div>
            <div class="detailContent">{{ cancellingAppointment.id }}</div>
          </div>
          <div class="detailLine">
            <div class="detailLabel">场地名称：</div>
            <div class="detailContent">{{ cancellingAppointment.venueName }}</div>
          </div>
          <el-input type="textarea" v-model="cancelReason" class="cancelInput" placeholder="请输入取消原因"></el-input>
          <el-button type="primary" @click="confirmCancel">确认</el-button>
          <el-button @click="showCancelModal = false">取消</el-button>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, computed } from 'vue';
  import axios from 'axios';
  import { Search } from '@element-plus/icons-vue'
  
  const isLoggedIn = ref(false);
  // const searchId = ref('');
  // const startDate = ref('');
  // const endDate = ref('');
  const dateRange = ref([]);
  const appointments = ref([]);
  const showCancelModal = ref(false);
  const showDetailModal = ref(false);
  const cancelReason = ref('');
  const cancellingAppointment = ref(null);
  const selectedAppointment = ref(null);
  const searchType = ref('0');
  const searchContent = ref('');
  const searchPlaceholder = ref(['预约记录ID', '场地名称或ID'])
  const reservationType = ref('0');

    // begin test
  appointments.value = [
  {
    id: '12345',
    venueId: 1,
    venueName: '体育场',
    startTime: '2023-08-21T10:00:00',
    endTime: '2023-08-21T12:00:00',
    price: 100
  },
  {
    id: '67890',
    venueId: 2,
    venueName: '游泳馆',
    startTime: '2023-08-22T14:00:00',
    endTime: '2023-08-22T16:00:00',
    price: 80
  },
  {
    id: '11111',
    venueId: 3,
    venueName: '篮球场',
    startTime: '2023-08-23T09:00:00',
    endTime: '2023-08-23T11:00:00',
    price: 90
  }
  ];
  // end test

  const filteredAppointments = ref(appointments.value);
  // const filteredAppointments = computed(() => {
    // return appointments.value.filter(appointment => {
      // const appointmentDate = new Date(appointment.startTime);
      // const startDateObj = startDate.value ? new Date(startDate.value) : null;
      // const endDateObj = endDate.value ? new Date(endDate.value) : null;

      // return (
      //   (!searchId.value || appointment.id.includes(searchId.value)) &&
      //   (!startDateObj || appointmentDate >= startDateObj) &&
      //   (!endDateObj || appointmentDate <= endDateObj)
      // );
      // return true;
    // });
  // });

  const handleSearch = () => {
    filteredAppointments = appointments.value;

    if(searchContent.value){
      filteredAppointments.value = filteredAppointments.filter(appointment => {
        return (
          (searchType.value == 0 && appointment.id == searchContent.value) ||
          (searchType.value == 1 && (appointment.venueId == searchContent.value || appointment.venueName == searchContent.value))
        );
      })
    }

    if(dateRange.value.length > 0){
      // 时间存储方式未确定，之后可能还要修改
      const startDateObj = dateRange.value[0].getTime();
      const endDateObj = dateRange.value[1].getTime() + 3600 * 1000 * 24;
      appointments.value.filter(appointment => {
        const appointmentDate = new Date(appointment.startTime);
        return (
          appointmentDate.getTime() >= startDateObj &&
          appointmentDate.getTime() <= endDateObj
        );
      });
    }
  }

  const FilterReset = () => {
    searchType.value = '0';
    searchContent.value = '';
    filteredAppointments.value = appointments.value;
  }

  // add time 
  const formatDateTime = (dateTime) => {
    const date = new Date(dateTime);
    return `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')} ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
  };

  const goToLogin = () => {
    // 跳转到登录界面
  };

  const searchAppointments = () => {
      // 模拟从后端获取预约记录
    // if (searchId.value) {
    //   appointments.value = appointments.value.filter(appointment => appointment.id.includes(searchId.value));
    // } else {
    //   appointments.value = [...appointments.value];
    // }
    // 从后端获取预约记录
      axios.get('/api/appointments', {
        params: {
          id: searchId.value,
          startDate: startDate.value,
          endDate: endDate.value
        }
      })
      .then(response => {
        appointments.value = response.data;
      })
      .catch(error => {
        console.error('Error fetching appointments:', error);
      });
  };

  const showAppointmentDetails = (appointment) => {
    selectedAppointment.value = appointment;
    showDetailModal.value = true;
    //console.log(selectedAppointment.value);
  };

  const cancelAppointment = (appointment) => {
    cancellingAppointment.value = appointment;
    showCancelModal.value = true;
  };

    const confirmCancel = () => {
      // 将取消原因插入预约记录
      axios.post('/api/appointments/cancel', {
        id: cancellingAppointment.value.id,
        reason: cancelReason.value
      })
      .then(response => {
        showCancelModal.value = false;
        cancelReason.value = '';
        cancellingAppointment.value = null;
        // 刷新预约列表
        searchAppointments();
      })
      .catch(error => {
        console.error('Error canceling appointment:', error);
      });
    };

  //test cancel begin
//   const confirmCancel = () => {
//     // 模拟将取消原因插入预约记录
//     const cancelledAppointment = {
//       ...cancellingAppointment.value,
//       cancelled: true,
//       cancelReason: cancelReason.value
//     };
//     appointments.value = appointments.value.map(appointment => {
//       if (appointment.id === cancelledAppointment.id) {
//         return cancelledAppointment;
//       }
//       return appointment;
//     });
//     showCancelModal.value = false;
//     cancelReason.value = '';
//     cancellingAppointment.value = null;
//   };
  //test cancel end
  
  </script>
  
  <style scoped>
  /* 添加一些基本的样式 */

  .ReservationList{
    display: flex;
    flex-direction: column;
    width: calc(100% - 20px);
    padding-bottom: 10px;
    margin: 10px;
    border-radius: 5px;
    background-color: white;
    border: 1px solid lightgray;
  }

  .ReservationTitle{
    display: flex;
    justify-content: center;
    padding: 10px;
    font-size: 20px;
    font-weight: 700;
    border-bottom: 1px solid black;
  }

  /* 筛选区域样式 */
  .FilterArea{
    display: flex;
    flex-direction: column;
    padding: 10px;
    border-top: 1px solid lightgray;
    border-bottom: 1px solid lightgray;
  }

  .SearchArea{
    display: flex;
    /* justify-content: space-between; */
    padding-left: 10px;
    margin-bottom: 10px;
  }

  .SearchBox{
    flex: 1;
    margin-left: 50px;
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

  .modal {
    display: flex;
    align-items: center;
    justify-content: center;
    position: fixed;
    z-index: 1;
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
    max-height: 100vh;
    overflow: auto;
  }

  .cancelInput{
    margin-top: 10px;
    margin-bottom: 10px;
  }

  /* .modal {
    position: fixed;
    z-index: 1;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    overflow: auto;
    background-color: rgba(0, 0, 0, 0.4);
  }
  
  .modal0 {
    position: fixed;
    z-index: 1;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    overflow: auto;
    background-color: rgba(0, 0, 0, 0.4);
  } */

  .modal0-content {
    background-color: #fefefe;
    margin: 10% auto; /* 调整垂直居中的位置 */
    padding: 20px;
    border: 1px solid #888;
    width: 50%; /* 增加宽度 */
    max-width: 800px; /* 设置最大宽度,防止过大 */
    height: 60%; /* 增加高度 */
    max-height: 25vh; /* 设置最大高度,防止过大 */
    overflow-y: auto; /* 添加垂直滚动条 */
    line-height: 2.5;
  }

  /*
  .modal-content {
    background-color: #fefefe;
    margin: 10% auto; 
    padding: 20px;
    border: 1px solid #888;
    width: 50%;
    max-width: 800px; 
    height: 60%;
    max-height: 25vh;
    overflow-y: auto;
    line-height: 2.5;
  }
  */

  .detailLine{
    display: flex;
    line-height: 2em;
  }

  .detailLabel{
    font-weight: 700;
    width: 120px;
  }
  
  .search-bar {
    display: flex;
    justify-content: center;
    align-items: flex-start;
    padding-top: 20px; /* 添加一些顶部间距 */
  }

  table {
    width: 100%;
    border-collapse: collapse;
  }

  th, td {
    padding: 10px;
    text-align: center; /* 将文本居中 */
    border-bottom: 1px solid #ddd;
  }

  .modal-content0 h2 {
    margin-bottom: 20px; /* 增加标题与内容的间距 */
  }

  .modal-content h2 {
    margin-bottom: 20px; /* 增加标题与内容的间距 */
  }

  
</style>