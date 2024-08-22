<template>
    <div>
      <header>
        <!-- <nav>
          <button v-if="!isLoggedIn" @click="goToLogin">登录</button>
        </nav> -->
      </header>
  
      <main>
        <div class="search-bar">
          <input v-model="searchId" placeholder="根据预约ID搜索" />
          <input v-model="startDate" type="date" />
          <input v-model="endDate" type="date" />
          <button @click="searchAppointments">搜索</button>
        </div>
  
        <table>
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
        </table>
      </main>
      
      <div v-if="showDetailModal" class="modal0">
        <div class="modal0-content">
          <h2>预约详情</h2>
          <p>场地名称: {{ selectedAppointment.venueName }}</p>
          <p>预约时间: {{ formatDateTime(selectedAppointment.startTime) }} - {{ formatDateTime(selectedAppointment.endTime) }}</p>
          <p>支付价格: {{ selectedAppointment.price }}</p>
          <button @click="showDetailModal = false">关闭</button>
        </div>
      </div>
  
      <div v-if="showCancelModal" class="modal">
        <div class="modal-content">
          <h2>取消预约</h2>
          <textarea v-model="cancelReason" placeholder="请输入取消原因"></textarea><br>
          <button @click="confirmCancel">确认取消</button>
          <button @click="showCancelModal = false">取消</button>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import { ref, computed } from 'vue';
  import axios from 'axios';
  
  export default {
    setup() {
      const isLoggedIn = ref(false);
      const searchId = ref('');
      const startDate = ref('');
      const endDate = ref('');
      const appointments = ref([]);
      const showCancelModal = ref(false);
      const showDetailModal = ref(false);
      const cancelReason = ref('');
      const cancellingAppointment = ref(null);
      const selectedAppointment = ref(null);
  
      const filteredAppointments = computed(() => {
        return appointments.value.filter(appointment => {
          const appointmentDate = new Date(appointment.startTime);
          const startDateObj = startDate.value ? new Date(startDate.value) : null;
          const endDateObj = endDate.value ? new Date(endDate.value) : null;
  
          return (
            (!searchId.value || appointment.id.includes(searchId.value)) &&
            (!startDateObj || appointmentDate >= startDateObj) &&
            (!endDateObj || appointmentDate <= endDateObj)
          );
        });
      });
      
      // begin test
    //   const appointments = ref([
    //   {
    //     id: '12345',
    //     venueName: '体育场',
    //     startTime: '2023-08-21T10:00:00',
    //     endTime: '2023-08-21T12:00:00',
    //     price: 100
    //   },
    //   {
    //     id: '67890',
    //     venueName: '游泳馆',
    //     startTime: '2023-08-22T14:00:00',
    //     endTime: '2023-08-22T16:00:00',
    //     price: 80
    //   },
    //   {
    //     id: '11111',
    //     venueName: '篮球场',
    //     startTime: '2023-08-23T09:00:00',
    //     endTime: '2023-08-23T11:00:00',
    //     price: 90
    //   }
    //   ]);
      // end test


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
  
      return {
        isLoggedIn,
        searchId,
        startDate,
        endDate,
        filteredAppointments,
        formatDateTime,
        goToLogin,
        searchAppointments,
        showAppointmentDetails,
        cancelAppointment,
        showCancelModal,
        showDetailModal,
        cancelReason,
        confirmCancel,
        selectedAppointment
      };
    }
  };
  </script>
  
  <style scoped>
  /* 添加一些基本的样式 */
  .modal {
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
  }

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

  .modal-content {
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