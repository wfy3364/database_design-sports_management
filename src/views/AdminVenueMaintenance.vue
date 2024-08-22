<script setup>

import { ref } from 'vue';
import { Search } from '@element-plus/icons-vue'

const searchType = ref('0');
const searchContent = ref('');
const searchPlaceholder = ['保养记录ID', '场地名称或ID'];
const stateOption = ref('3');
const isSearching = ref(false);

const maintenanceData = [{
  id: 1,
  venueId: 1,
  venueName: '场地1',
  time: '2024-08-20 13:00',
  description: '设备正常维修',
  state: 0,
},
{
  id: 2,
  venueId: 2,
  venueName: '场地名称过长时的展示',
  time: '2024-08-20 13:00',
  description: '维修描述过长时以提示框的方式显示维修描述过长时以提示框的方式显示',
  state: 1,
},
{
  id: 3,
  venueId: 3,
  venueName: '场地2',
  time: '2024-08-21 13:00',
  description: '设备正常维修',
  state: 2,
},
{
  id: 4,
  venueId: 2,
  venueName: '场地名称过长时的展示',
  time: '2024-08-20 15:00',
  description: '设备正常维修',
  state: 2,
}];

// 计算属性: 根据状态和搜索内容筛选数据
// const filteredData = computed(() => {
//   let data = maintenanceData;

//   if (stateOption.value !== '3') {
//     data = data.filter(item => item.state === +stateOption.value);
//   }
  
//   if (isSearching.value && searchContent.value) {
//     data = data.filter(item => {
//       const searchTerm = searchContent.value.toLowerCase();
//       return item.venueId == searchTerm || item.venueName.toLowerCase().includes(searchTerm);
//     });
//     //isSearching.value = false;
//   }
  
//   return data;
// });

const filteredData = ref(maintenanceData);

function handleSearch(){
  filteredData.value = maintenanceData;
  if (stateOption.value !== '3') {
    filteredData.value = filteredData.value.filter(item => item.state === +stateOption.value);
  }
  
  if (searchContent.value) {
    filteredData.value = filteredData.value.filter(item => {
      const searchTerm = searchContent.value.toLowerCase();
      return (searchType.value === '0' && (item.id == searchTerm)) ||
             (searchType.value === '1' && (item.venueId == searchTerm || item.venueName.toLowerCase().includes(searchTerm)));
    });
  }

  if(dateRange.value.length > 0){
    const startTime = dateRange.value[0].getTime() || 0;
    const endTime = dateRange.value[1].getTime() + 3600 * 1000 * 24 || Infinity;
    filteredData.value = filteredData.value.filter(item => {
      return item.time.getTime() >= startTime && item.time.getTime() < endTime;
    });
  }
}

function FilterReset(){
  searchType.value = '0';
  searchContent.value = '';
  stateOption.value = '3';
  filteredData.value = maintenanceData;
  dateRange.value = [];
}

</script>

<template>
  <div class="AdminVenueMaintenance">
    <div class="MaintenanceHeader">保养记录</div>
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
      <el-table-column prop="id" label="记录编号" width="105" sortable></el-table-column>
      <el-table-column prop="venueId" label="场地编号" width="105" sortable></el-table-column>
      <el-table-column prop="venueName" label="场地名称" width="105" sortable></el-table-column>
      <el-table-column prop="time" label="保养时间" width="135" sortable></el-table-column>
      <el-table-column prop="description" label="描述"></el-table-column>
      <el-table-column label="状态" width="80">
        <template #default="item">
          <div v-if="item.row.state === 0" style="color: green">已保养</div>
          <div v-if="item.row.state === 1" style="color: orange">保养中</div>
          <div v-if="item.row.state === 2" style="color: red">待保养</div>
        </template>
      </el-table-column>
    </el-table>
  </div>
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

.MaintenanceHeader{
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

</style>
