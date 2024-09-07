<template>
  <div class="venue-browser">
    <div class="venueBrowserTitle">设备浏览</div>

    <!-- 筛选区域 -->
    <div class="FilterArea">
      <div class="FilterOption">
        <div class="FilterLabel">设备搜索：</div>
        <el-input v-model="searchQuery" class="SearchBox" placeholder="设备ID或名称">
          <template #prefix>
            <el-icon><search /></el-icon>
          </template>
        </el-input>
      </div>
      <!-- <div class="FilterOption">
        <el-checkbox v-model="enableDateFilter">开放日期筛选</el-checkbox>
        <el-date-picker v-if="enableDateFilter" v-model="filterDate" placeholder="选择日期"></el-date-picker>
      </div> -->
      <div class="FilterControl">
        <el-button type="primary" @click="filterDevices">确认筛选</el-button>
        <el-button @click="filterReset">重置条件</el-button>
        <el-button v-if="createCheck" @click="showCreateDevice">添加设备</el-button>
      </div>
    </div>

    <!-- 场地列表展示 -->
    <div class="device-list">
      <div 
        v-for="device in filteredDevices" 
        :key="device.id" 
        class="device-item"
        @click="viewDeviceDetails(device)" 
        role="button"
      >
        <div class="device-details">
          <h3>{{ device.name }}</h3>
          <p>ID: {{ device.id }}</p>
          <p v-if="device.state === 0" style="color: green">使用中</p>
          <p v-if="device.state === 1" style="color: red">维修中</p>
          <p v-if="device.state === 2" style="color: orange">待维修</p>
          <p v-if="device.state === 3" style="color: gray">未使用</p>
        </div>
      </div>
    </div>

    <!-- <el-dialog v-model="showDeviceDetail" align-center :title="selectedDevice?.name">
      <div class="detailContent">
        <div>ID: {{ selectedDevice.id }}</div>
        <div v-if="selectedDevice.state === 0" style="color: green">使用中</div>
        <div v-if="selectedDevice.state === 1" style="color: red">维修中</div>
        <div v-if="selectedDevice.state === 2" style="color: orange">待维修</div>
        <div v-if="selectedDevice.state === 3" style="color: gray">未使用</div>
        <div>引入时间： {{ selectedDevice.introTime }} </div>
        <div>所在场地id： {{ selectedDevice.venueid }} </div>
        <div>所在场地名称： {{ selectedDevice.venuename }} </div>
        <div>维修记录：  
          <el-button class="Button" @click="goToDeviceRecords(selectedDevice.id)"> 查看维修记录</el-button>
        </div>
      </div>
      <template #footer>
        <el-button type="primary" @click="showDeviceDetail = false">确定</el-button>
      </template>
    </el-dialog> -->
    <DeviceEdit v-if="showEditModal" :dialogMode="dialogMode" :curRecord="selectedDevice" 
    @closeModal="handleEditClose"></DeviceEdit>
  </div>
</template>

<script setup>
import { ref, reactive, computed } from 'vue';
import { useRouter } from 'vue-router';
import { Search } from '@element-plus/icons-vue';
import dayjs from 'dayjs';
import DeviceEdit from './components/DeviceEdit.vue';

import { useUserStore } from '@/stores/userStore';
import { storeToRefs } from 'pinia';

import { addRepairRecord, getAllDevice } from '@/apis/requests';
import { onMounted } from 'vue';
import { ElMain, ElMessage } from 'element-plus';

const userStore = useUserStore();
const { adminType, adminPermission } = storeToRefs(userStore);

const createCheck = computed(() => {
  return adminType.value === 'system' || adminType.value === 'device' || adminType.value === 'venue-device';
});

const showEditModal = ref(false);
const dialogMode = ref('create');

const devices = ref([
  {
    id: 1,
    name: '设备1',
    state: 0,
    introTime: '2024-08-12',
    venueid: 1,
    venuename: '篮球场',
  },
  {
    id: 2,
    name: '设备3',
    state: 1,
    introTime: '2024-08-15',
    venueid: 1,
    venuename: '篮球场',
  },
  {
    id: 3,
    name: '设备5',
    state: 2,
    introTime: '2024-08-16',
    venueid: 2,
    venuename: '羽毛球场',
  },
  {
    id: 4,
    name: '设备13',
    state: 3,
    introTime: '2024-08-18',
    venueid: 3,
    venuename: '健身房',
  },
  {
    id: 5,
    name: '设备11',
    state: 2,
    introTime: '2024-08-18',
    venueid: 3,
    venuename: '健身房',
  },
  {
    id: 6,
    name: '设备18',
    state: 3,
    introTime: '2024-08-14',
    venueid: 5,
    venuename: '田径场',
  },
  // 更多设备数据...
]);

// 运动类型选项
// const sports = ref(['足球', '篮球', '网球', '羽毛球']);

// 定义搜索和筛选相关的状态
const searchQuery = ref('');
const selectedSport = ref('');
const selectedDevice = ref(null);
const showDeviceDetail = ref(false);
const DeviceDate = ref(dayjs().format("YYYY-MM-DD"));
const filterDate = ref(dayjs().format("YYYY-MM-DD"));
const enableDateFilter = ref(false);
const router = useRouter();

const filteredDevices = ref([]);

onMounted(async () => {
  await getAllDevice(initializeDevices, getDeviceErr)
})

const getDeviceErr = (msg) => {
  ElMessage.error('获取设备信息失败：' + msg);
}

// 初始化场地列表
const initializeDevices = (res) => {
  devices.value = res.map(item => {
    return {
      id: item.equipmentId,
      name: item.equipmentName,
      introTime: item.equipmentIntroTime,
      venueid: item.venueId,
      venuename: item.venueName,
      repairRecords: item.repairRecords,
    }
  });
  filteredDevices.value = devices.value.sort((a, b) => a.name.localeCompare(b.name));
};

// 处理筛选操作的函数
const filterDevices = () => {
  filteredDevices.value = devices.value.filter(device => {
    const matchesSearchQuery = searchQuery.value
      ? (isNaN(+searchQuery.value)
        ? device.name.includes(searchQuery.value)
        : device.id.toString() === searchQuery.value)
      : true;
    const matchesDate = enableDateFilter.value
      ? device.introTime.some(slot => slot.time.includes(filterDate.value))
      : true;
    return matchesSearchQuery && matchesDate;
  }).sort((a, b) => a.name.localeCompare(b.name));
};

const filterReset = () => {
  searchQuery.value = '';
  selectedSport.value = '';
  initializeDevices();
};

// 显示场地详情的函数
const viewDeviceDetails = (device) => {
  // selectedDevice.value = device;
  // showDeviceDetail.value = true;
  router.push({
    path: '/AdmindeviceDetail',
    query: {
      deviceId: device.id,
    }
  });
};

const goToDeviceRecords = async (id) => {
  console.log(id);
  router.push({
    path: '/AdminDeviceDetail',
    query: {
      deviceId: id,
    }
  });

  // selectedVenue.value = venue;
  // showVenueDetail.value = true;
};
// const showAnnouncementDetails = (announcement) => {
//   alert(`公告详情:\n标题: ${announcement.title}\n时间: ${announcement.time}`);
// };

// // 关闭模态框的函数
// const closeModal = () => {
//   selectedDevice.value = null; 
// };

const showCreateDevice = () => {
  showEditModal.value = true;
}

const handleEditClose = (update) => {
  showEditModal.value = false;
}

// // 处理场地预约的函数
// const bookVenue = (venue, slot) => {
//   router.push({
//     path: '/VenueReservation',
//     query: {
//       venue: venue.id,
//       timeslot: slot.id,
//     },
//   });
// };

// const setDate = (val) => {
//   venueDate.value = dayjs(venueDate.value).add(val, "day").format("YYYY-MM-DD");
// };

// const handleDateChange = () => {
//   // 处理日期变更逻辑
// };

</script>

<style scoped>

.device-browser {
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

.deviceBrowserTitle {
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

.device-list {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  width: 100%;
  padding: 20px;
  box-sizing: border-box;
}

.device-item {
  flex: 1 1 30%; /* 每个场地项固定宽度为30% */
  max-width: 300px;
  margin: 10px;
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

.device-item:hover {
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

.device-details {
  width: 100%;
  padding: 10px;
  background-color: #fafafa;
  border-radius: 4px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  text-align: center;
}

.device-details h3 {
  margin: 0 0 10px 0;
  font-size: 18px;
  color: #2c3e50;
  font-weight: bold;
}

.device-details p {
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



</style>

