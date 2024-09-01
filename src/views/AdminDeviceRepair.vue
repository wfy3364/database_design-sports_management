<script setup>

import { ref, computed } from 'vue';
import { Search } from '@element-plus/icons-vue'
import { convertTime, judgeState } from '@/apis/utils';
import RepairDetail from './components/RepairDetail.vue';
import { useUserStore } from '@/stores/userStore';
import { storeToRefs } from 'pinia';

const searchType = ref('0');
const searchContent = ref('');
const searchPlaceholder = ['设备名称或ID', '场地名称或ID'];
const stateOption = ref('3');
const curRecord = ref(null);
const detailDialog = ref(false);
const dialogMode = ref('view');
const userStore = useUserStore();
const { adminType, adminPermission } = storeToRefs(userStore);

function showRepairDetail(record, mode){
  curRecord.value = record;
  dialogMode.value = mode;
  detailDialog.value = true;
}

// start_time和end_time需要全部处理成Date类型
const repairData = ref([{
  id: '1',
  deviceId: '1',
  deviceName: '设备1',
  venueId: '1',
  venueName: '场地1',
  start_time: new Date("August 20, 2024 13:00:00"),
  end_time: new Date("August 20, 2024 14:00:00"),
  description: '设备正常维修',
},
{
  id: '2',
  deviceId: '2',
  deviceName: '设备名称过长时的展示',
  venueId: '2',
  venueName: '场地名称过长时的展示',
  start_time: new Date("August 20, 2024 14:00:00"),
  end_time: new Date("August 20, 2024 14:00:00"),
  description: '维修描述过长时以提示框的方式显示',
},
{
  id: '3',
  deviceId: '3',
  deviceName: '设备2',
  venueId: '3',
  venueName: '场地2',
  start_time: new Date("August 21, 2024 13:00:00"),
  end_time: new Date("August 21, 2024 14:00:00"),
  description: '设备正常维修',
},
{
  id: '4',
  deviceId: '4',
  deviceName: '设备1',
  venueId: '2',
  venueName: '场地名称过长时的展示',
  start_time: new Date("August 21, 2024 14:00:00"),
  end_time: new Date("August 21, 2024 15:00:00"),
  description: '设备描述测试：设备描述的内容可以很长，设备描述的内容可以很长，设备描述的内容可以很长，设备描述的内容可以很长，设备描述的内容可以很长，设备描述的内容可以很长，设备描述的内容可以很长，设备描述的内容可以很长，设备描述的内容可以很长，设备描述的内容可以很长，设备描述的内容可以很长，设备描述的内容可以很长，设备描述的内容可以很长，设备描述的内容可以很长，设备描述的内容可以很长，设备描述的内容可以很长，设备描述的内容可以很长，设备描述的内容可以很长，设备描述的内容可以很长，设备描述的内容可以很长，设备描述的内容可以很长，设备描述的内容可以很长，设备描述的内容可以很长，设备描述的内容可以很长，设备描述的内容可以很长，设备描述的内容可以很长，设备描述的内容可以很长，设备描述的内容可以很长，设备描述的内容可以很长，设备描述的内容可以很长，设备描述的内容可以很长，设备描述的内容可以很长，设备描述的内容可以很长，设备描述的内容可以很长，设备描述的内容可以很长，设备描述的内容可以很长，设备描述的内容可以很长，设备描述的内容可以很长，设备描述的内容可以很长，设备描述的内容可以很长，设备描述的内容可以很长，设备描述的内容可以很长，设备描述的内容可以很长，设备描述的内容可以很长，设备描述的内容可以很长，设备描述的内容可以很长，设备描述的内容可以很长，设备描述的内容可以很长，设备描述的内容可以很长，设备描述的内容可以很长，设备描述的内容可以很长，设备描述的内容可以很长，设备描述的内容可以很长，设备描述的内容可以很长，设备描述的内容可以很长，设备描述的内容可以很长，设备描述的内容可以很长，设备描述的内容可以很长，设备描述的内容可以很长，设备描述的内容可以很长，设备描述的内容可以很长，设备描述的内容可以很长，设备描述的内容可以很长，设备描述的内容可以很长，设备描述的内容可以很长，设备描述的内容可以很长，设备描述的内容可以很长，设备描述的内容可以很长，设备描述的内容可以很长，设备描述的内容可以很长，设备描述的内容可以很长，设备描述的内容可以很长，设备描述的内容可以很长，',
}]);

repairData.value = repairData.value.map(item => {
  return {...item, state: judgeState(item.start_time, item.end_time)}
});

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

// 检查管理员编辑权限
const EditCheck = computed(() => {
  return adminType.value === 'system' ||
        (adminType.value === 'device' || adminType.value === 'venue-device') &&
        record.deviceId in adminPermission.value.device
});
// const EditCheck = ref(true);

const dateRange = ref([]);
const filteredData = ref(repairData);

// 计算属性: 根据状态和搜索内容筛选数据
// const filteredData = computed(() => {
//   let data = repairData;

//   if (stateOption.value !== '3') {
//     data = data.filter(item => item.state === +stateOption.value);
//   }
  
//   if (isSearching.value && searchContent.value) {
//     data = data.filter(item => {
//       const searchTerm = searchContent.value.toLowerCase();
//       return (searchType.value === '0' && (item.deviceId == searchTerm || item.deviceName.toLowerCase().includes(searchTerm))) ||
//              (searchType.value === '1' && (item.venueId == searchTerm || item.venueName.toLowerCase().includes(searchTerm)));
//     });
//     // isSearching.value = false;
//   }
  
//   return data;
// });

// function handleSearch() {
//   isSearching.value = true;
// }

function handleSearch(){
  filteredData.value = repairData;
  if (stateOption.value !== '3') {
    filteredData.value = filteredData.value.filter(item => item.state === +stateOption.value);
  }
  
  if (searchContent.value) {
    filteredData.value = filteredData.value.filter(item => {
      const searchTerm = searchContent.value.toLowerCase();
      return (searchType.value === '0' && (item.deviceId == searchTerm || item.deviceName.toLowerCase().includes(searchTerm))) ||
             (searchType.value === '1' && (item.venueId == searchTerm || item.venueName.toLowerCase().includes(searchTerm)));
    });
  }

  if(dateRange.value.length > 0){
    const startTime = dateRange.value[0].getTime() || 0;
    const endTime = dateRange.value[1].getTime() + 3600 * 1000 * 24 || Infinity;
    filteredData.value = filteredData.value.filter(item => {
      return item.start_time.getTime() >= startTime && item.start_time.getTime() < endTime;
    });
  }
}

function FilterReset(){
  searchType.value = '0';
  searchContent.value = '';
  stateOption.value = '3';
  filteredData.value = repairData;
  dateRange.value = [];
}

</script>

<template>
  <div class="AdminDeviceRepair">
    <div class="RepairHeader">维修记录</div>
    <div class="FilterArea">
      <div class="SearchArea">
        <el-radio-group v-model="searchType">
          <el-radio value="0">设备搜索</el-radio>
          <el-radio value="1">场地搜索</el-radio>
        </el-radio-group>
        <el-input v-model="searchContent" class="SearchBox" 
          :placeholder="searchPlaceholder[+searchType]">
          <template #prefix>
            <el-icon><search /></el-icon>
          </template>
        </el-input>
        <!-- <el-button @click="handleSearch">搜索</el-button> -->
      </div>
      <div class="FilterOption">
        <div class="FilterText">状态</div>
        <el-radio-group v-model="stateOption">
          <el-radio-button value="3">全部</el-radio-button>
          <el-radio-button value="2">待维修</el-radio-button>
          <el-radio-button value="1">维修中</el-radio-button>
          <el-radio-button value="0">已维修</el-radio-button>
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
        <el-button v-if="EditCheck" @click="showRepairDetail(null, 'create')"
        type="primary" class="createButton">添加记录</el-button>
      </div>
    </div>
    <el-table :data="filteredData" :show-overflow-tooltip="{ effect: 'light'}">
      <el-table-column prop="id" label="记录编号" width="105" sortable></el-table-column>
      <el-table-column prop="deviceId" label="设备编号" width="105" sortable></el-table-column>
      <el-table-column prop="deviceName" label="设备名称" width="105" sortable></el-table-column>
      <el-table-column prop="venueId" label="场地编号" width="105" sortable></el-table-column>
      <el-table-column prop="venueName" label="场地名称" width="105" sortable></el-table-column>
      <el-table-column prop="start_time" label="时间" width="135" sortable>
        <template #default="item">
          {{ convertTime(item.row.start_time) }}
        </template>
      </el-table-column>
      <!-- <el-table-column prop="description" label="描述"></el-table-column> -->
      <el-table-column label="状态" width="80">
        <template #default="item">
          <div v-if="item.row.state === 0" style="color: green">已维修</div>
          <div v-if="item.row.state === 1" style="color: orange">维修中</div>
          <div v-if="item.row.state === 2" style="color: red">待维修</div>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="140">
        <template #default="item">
          <el-button size="small" type="primary" @click="showRepairDetail(item.row, 'view')">详情</el-button>
          <el-button size="small" v-if="EditCheck" @click="showRepairDetail(item.row, 'edit')">编辑</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
  <RepairDetail v-if="detailDialog" :dialogMode="dialogMode" :curRecord="curRecord" 
  @closeModal="detailDialog = false" @editModal="showRepairDetail(curRecord, 'edit')"></RepairDetail>
</template>

<style scoped>
.AdminDeviceRepair{
  display: flex;
  flex-direction: column;
  width: calc(100% - 20px);
  padding-bottom: 10px;
  margin: 10px;
  border-radius: 5px;
  background-color: white;
  border: 1px solid lightgray;
}

.RepairHeader{
  display: flex;
  justify-content: center;
  padding: 10px;
  /* border-bottom: 1px solid black; */
  font-size: 18px;
  font-weight: 700;
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

.createButton{
  margin-left: auto;
}

</style>
