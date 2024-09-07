<script setup>

import { ref, computed } from 'vue';
import { Search } from '@element-plus/icons-vue'
import { useRoute} from 'vue-router'; // 导入 useRoute
import { convertTime, judgeState } from '@/apis/utils';
import MaintenanceDetail from './components/MaintenanceDetail.vue';
import { useUserStore } from '@/stores/userStore';
import { storeToRefs } from 'pinia';
import { getMaintenanceList, getAllVenues } from '@/apis/requests';
import { onMounted } from 'vue';

const route = useRoute(); // 初始化路由器
const searchType = ref('0');
const searchContent = ref('');
const searchPlaceholder = ['保养记录ID', '场地名称或ID'];
const stateOption = ref('3');
const isSearching = ref(false);
const maintenanceEdit = ref(false);

const curRecord = ref(null);
const detailDialog = ref(false);
const dialogMode = ref('view');
const userStore = useUserStore();
const { adminType, adminPermission } = storeToRefs(userStore);

const maintenanceData = ref([
//   {
//   venueMaintenanceId: 1,
//   venueId: 1,
//   venueName: '场地1',
//   start_time: '2024-08-20 13:00',
//   end_time: '2024-08-20 14:00',
//   description: '场地正常保养',
// },
// {
//   venueMaintenanceId: 2,
//   venueId: 2,
//   venueName: '场地名称过长时的展示',
//   start_time: '2024-08-20 13:00',
//   end_time: '2024-08-20 14:00',
//   description: '保养描述过长时以提示框的方式显示保养描述过长时以提示框的方式显示保养描述过长时以提示框的方式显示',
// },
// {
//   venueMaintenanceId: 3,
//   venueId: 3,
//   venueName: '场地2',
//   start_time: '2024-08-21 13:00',
//   end_time: '2024-09-21 14:00',
//   description: '场地正常保养',
// },
// {
//   venueMaintenanceId: 4,
//   venueId: 2,
//   venueName: '场地名称过长时的展示',
//   start_time: '2024-09-20 15:00',
//   end_time: '2024-09-20 16:00',
//   description: '场地正常保养',
// }
]);

const allVenues = ref([
//   {
//   id: '1',
//   name: '场地1',
//   state: '正常',
//   introTime: '2024-09-01T12:00:00',
// },
// {
//   id: '2',
//   name: '场地2',
//   state: '正常',
//   introTime: '2024-09-01T12:00:00',
// },
// {
//   id: '3',
//   name: '场地3',
//   state: '正常',
//   introTime: '2024-09-01T12:00:00',
// }
]);

const tempMaintenanceData = ref([...maintenanceData.value]);  //临时存储的场地数据

const shortcuts = [
  {
    text: '最近一周',
    value: () => {
      const end = new Date()
      const start = new Date()
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
      return [start, end]
    },
  },
  {
    text: '最近一个月',
    value: () => {
      const end = new Date()
      const start = new Date()
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
      return [start, end]
    },
  },
  {
    text: '最近三个月',
    value: () => {
      const end = new Date()
      const start = new Date()
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
      return [start, end]
    },
  },
]

const dateRange = ref([]);

const filteredData = ref([]);

function handleSearch(){
  console.log(maintenanceData.value)
  filteredData.value = maintenanceData.value;
  if (stateOption.value !== '3') {
    filteredData.value = filteredData.value.filter(item => item.state === +stateOption.value);
  }
  
  if (searchContent.value) {
    filteredData.value = filteredData.value.filter(item => {
      const searchTerm = searchContent.value.toLowerCase();
      return (searchType.value === '0' && (item.venueMaintenanceId == searchTerm)) ||
             (searchType.value === '1' && (item.venueId == searchTerm || item.venueName.toLowerCase().includes(searchTerm)));
    });
  }

  if(dateRange.value.length > 0){
    const startTime = dateRange.value[0].getTime() || 0;
    const endTime = dateRange.value[1].getTime() + 3600 * 1000 * 24 || Infinity;
    filteredData.value = filteredData.value.filter(item => {
      const start_date = new Date(item.convertedStartDate);
      const end_date = new Date(item.convertedEndDate);
      return start_date.getTime() >= startTime && end_date.getTime() < endTime;
    });
  }
}

function FilterReset(){
  searchType.value = '0';
  searchContent.value = '';
  stateOption.value = '3';
  filteredData.value = maintenanceData.value;
  dateRange.value = [];
}

// function showDeviceEdit(){
//   maintenanceEdit.value = true;
// }

// function closeMaintenanceEdit(){
//   maintenanceEdit.value = false;
// }

// function saveMaintenanceEdit(){
//   ElMessage({
//     message: '保养信息修改成功',
//     type: 'success',
//   })
//   maintenanceEdit.value = false;
// }

function showMaintenanceDetail(record, mode){
  console.log(record);
  curRecord.value = record;
  dialogMode.value = mode;
  detailDialog.value = true;
}

const EditCheck = computed(() => { //检查管理员权限
  return adminType.value === 'system' ||
        (adminType.value === 'device' || adminType.value === 'venue-device') &&
        record.deviceId in adminPermission.value.device
});

// function getMaintenance(){
//   getMaintenanceList(getMaintenanceSuccess, getMaintenanceFailed);
// }
maintenanceData.value = maintenanceData.value.map(item => {
  return {...item, state: judgeState(item.start_time, item.end_time)}
});

function getMaintenanceSuccess(res){
  console.log('getMaintenanceSuccess');
  console.log(res);
  maintenanceData.value = res.data;
  maintenanceData.value = maintenanceData.value.map(item => ({
    ...item,
    convertedStartDate: convertTime(item.maintenanceStartDate),
    convertedEndDate: convertTime(item.maintenanceEndDate),
    venueName: findVenueName(String(item.venueId)),
    state: judgeState(item.maintenanceStartDate, item.maintenanceEndDate)
  }));
  filteredData.value = maintenanceData.value;
  console.log(filteredData.value);
}



const venueTimeFormat = (start, end) => {
  const startStr = convertTime(start);
  const endStr = convertTime(end);
  return startStr.slice(startStr.length - 5, startStr.length)
  + '-' + endStr.slice(endStr.length - 5, endStr.length);
}

const findVenueName = (id) => {
  const venue = allVenues.value.find(venue => venue.venueId === id);
  return venue ? venue.name : 'Venue not found';
};

function getMaintenanceFailed(img){
  ElMessage.error(img);
}


onMounted(async () => {
  await getAllVenues(getVenuesSuccess, getVenuesFailed);
  await getMaintenanceList(getMaintenanceSuccess, getMaintenanceFailed);
  const { maintenanceId, mode } = route.query;
  if(maintenanceId){
    filteredData.value = maintenanceData.value;
    console.log(filteredData.value);
    filteredData.value = filteredData.value.filter(item => {
      return (item.venueMaintenanceId == maintenanceId);
    });
    console.log(filteredData.value[0]);
    showMaintenanceDetail(filteredData.value[0], mode);
  }
});

function getVenuesSuccess(res){
  // console.log(res);
  allVenues.value = res;
  // console.log(allVenues.value);
}

function getVenuesFailed(){
  ElMessage.error("获取场地信息失败");
}
</script>

<template>
  <div class="AdminVenueMaintenance">
    <div class="VenueMaintenanceHeader">
      <div class="MaintenanceHeader">保养记录</div>
      <el-button class="EditButton" @click="showMaintenanceDetail(null, 'create')">添加</el-button>
    </div>
    <div class="FilterArea">
      <div class="SearchArea">
        <el-radio-group v-model="searchType">
          <el-radio value="0">保养搜索</el-radio>
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
        <div class="FilterText">状态</div>
        <el-radio-group v-model="stateOption">
          <el-radio-button value="3">全部</el-radio-button>
          <el-radio-button value="2">待保养</el-radio-button>
          <el-radio-button value="1">保养中</el-radio-button>
          <el-radio-button value="0">已保养</el-radio-button>
        </el-radio-group>
      </div>
      <div class="FilterOption">
        <div class="FilterText">时间</div>
        <div>
          <el-date-picker v-model="dateRange" type="daterange" unlink-panels
          range-separator="到" start-placeholder="开始日期"
          end-placeholder="结束日期" :shortcuts="shortcuts"/>
        </div>
      </div>
      <div class="FilterControl">
        <el-button @click="handleSearch">确认筛选</el-button>
        <el-button @click="FilterReset">重置条件</el-button>
      </div>
    </div>
    <el-table :data="filteredData" :show-overflow-tooltip="{ effect: 'light'}">
      <el-table-column prop="venueMaintenanceId" label="记录编号" width="105" sortable></el-table-column>
      <el-table-column prop="venueId" label="场地编号" width="105" sortable></el-table-column>
      <el-table-column prop="venueName" label="场地名称" width="105" sortable></el-table-column>
      <el-table-column prop="convertedStartDate" label="保养开始时间" width="135" sortable></el-table-column>
      <el-table-column prop="description" label="描述"></el-table-column>
      <el-table-column label="状态" width="80">
        <template #default="item">
          <div v-if="item.row.state === 0" style="color: green">已保养</div>
          <div v-if="item.row.state === 1" style="color: orange">保养中</div>
          <div v-if="item.row.state === 2" style="color: red">待保养</div>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="150">
        <template #default="item">
          <el-button size="small" type="primary" @click="showMaintenanceDetail(item.row, 'view')">详情</el-button>
          <el-button size="small" v-if="EditCheck" @click="showMaintenanceDetail(item.row, 'edit')">编辑</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
  <MaintenanceDetail v-if="detailDialog" :dialogMode="dialogMode" :curRecord="curRecord" 
  @closeModal="detailDialog = false" @editModal="showRepairDetail(curRecord, 'edit')"></MaintenanceDetail>
</template>

<style scoped>
.AdminVenueMaintenance{
  display: flex;
  flex-direction: column;
  width: calc(100% - 20px);
  padding-bottom: 10px;
  margin: 10px;
  border-radius: 5px;
  background-color: white;
  border: 1px solid lightgray;
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

.modalBody {
  margin-top: 20px;
}

.smallButtonContainer {
  display: flex;
  justify-content: flex-end;
  /* margin-right: auto; */
}

.smallButton {
  /* margin-right: auto; */
  margin-top: 10px;
}

.form-row {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
}

.VenueMaintenanceHeader{
  display: flex;
  justify-content: center;
  padding: 10px;
  border-bottom: 1px solid black;
  align-items: center;
}

.MaintenanceHeader{
  display: flex;
  justify-content: center;
  width: 50%;
  left: 25%;
  position: relative;
  padding: 10px;
  /* border-bottom: 1px solid black; */
  font-size: 18px;
  font-weight: 700;
}

.EditButton{
  margin-left: auto;
}
</style>
