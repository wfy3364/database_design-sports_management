<script setup>

import { ref, computed } from 'vue';
import { Search } from '@element-plus/icons-vue'

const searchType = ref('1');
const searchContent = ref('');
const searchPlaceholder = ['设备名称或ID', '场地名称或ID'];
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
const filteredData = computed(() => {
  let data = maintenanceData;

  if (stateOption.value !== '3') {
    data = data.filter(item => item.state === +stateOption.value);
  }
  
  if (isSearching.value && searchContent.value) {
    data = data.filter(item => {
      const searchTerm = searchContent.value.toLowerCase();
      return item.venueName.toLowerCase().includes(searchTerm);
    });
    //isSearching.value = false;
  }
  
  return data;
});

function handleSearch() {
  isSearching.value = true;
}

</script>

<template>
  <div class="AdminVenueMaintenance">
    <div class="MaintenanceHeader">维修记录</div>
    <div class="FilterArea">
      <div class="SearchArea">
        <el-input v-model="searchContent" class="SearchBox" 
          :placeholder="searchPlaceholder[+searchType]">
          <template #prefix>
            <el-icon><search /></el-icon>
          </template>
        </el-input>
        <el-button @click="handleSearch">搜索</el-button> <!-- 5. 搜索按钮点击事件 -->
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
  padding-right: 10px;
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
}

.FilterText{
  line-height: var(--el-component-size);
  margin-right: 20px;
}

</style>
