<script setup>
import { ref, computed, onMounted } from 'vue';
import { dayjs } from 'element-plus';
// import router from '@/router/index'
import { judgeState } from '@/apis/utils';
import { useUserStore } from '@/stores/userStore';
import { storeToRefs } from 'pinia';
import VenueEdit from './components/VenueEdit.vue';
import { useRoute } from 'vue-router';

const editDialog = ref(false);
const dialogMode = ref('edit');

const userStore = useUserStore();
const { adminType, adminPermission } = storeToRefs(userStore);

const router = useRoute();

onMounted(() => {
  const { venueId } = router.query;
})

const venueInfo = {
  id: '1',
  name: "场地01",
  type: "羽毛球",
  capacity: 100,
  address: "曹安公路4800号",
  description: "这里是场地简介，这里是场地简介，这里是场地简介，这里是场地简介，这里是场地简介，这里是场地简介，这里是场地简介，这里是场地简介，这里是场地简介，这里是场地简介",
};

const EditCheck = computed(() => {
  return adminType.value === 'system' ||
        (adminType.value === 'venue' || adminType.value === 'venue-device') &&
        adminPermission.value.venue.includes(venueInfo.id);
});
// const EditCheck = ref(true);

const openTime = [{
  period: "13:00-14:00",
  start_time: new Date("2024-09-01T13:00:00"),
  end_time: new Date("2024-09-01T14:00:00"),
  remain: 10,
  price: 19.99,
},{
  period: "09:00-10:00",
  start_time: new Date("2024-09-01T09:00:00"),
  end_time: new Date("2024-09-01T10:00:00"),
  remain: 5,
  price: 9.99,
}];

const venueDevices = [{
  id: 1,
  name: "设备1",
}, {
  id: 2,
  name: "设备2",
}];

const overviewDisplay = {
  "场地ID：": venueInfo.id,
  "场地名称：": venueInfo.name,
  "运动类型：": venueInfo.type,
  "场地容量：": venueInfo.capacity,
  "场地地址：": venueInfo.address,
}

const openDate = ref(dayjs().format("YYYY-MM-DD"));

const maintainenceRecord = [{
  id: 1,
  start_time: "2024-08-19 19:00",
  end_time: "2024-08-19 20:00",
  description: "这里是保养描述文字",
  state: 0,
},{
  id: 2,
  start_time: "2024-08-19 20:00",
  end_time: "2024-08-19 21:00",
  description: "保养描述过长时，多余内容隐藏，当鼠标移动到对应位置时以提示框的方式显示",
  state: 1,
}];

function setDate(val){
  openDate.value = dayjs(openDate.value).add(val, "day").format("YYYY-MM-DD");
}

function handleDateChange(){
  
}

function deviceLink(deviceId){
  router.push({
    path: '/AdminDeviceDetail',
    query: {
      deviceId: deviceId,
    }
  })
}

// 计算场地当前状态
function getVenueState(){
  for(const item in openTime){
    const curState = judgeState(item.start_time, item.end_time);
    if(curState === 1){
      return 1;
    }
    else if(curState === 3){
      return 2;
    }
  }
  return 0;
}

function showEditDialog(){
  editDialog.value = true;
}

</script>

<template>
  <div class="AdminVenueDetail">
    <div class="AdminVenueHeader">
      <el-button class="BackButton">&lt;&nbsp;&nbsp;场地总览</el-button>
      <div class="AdminVenueTitle">{{ venueInfo.name }}</div>
      <el-button class="EditButton" :disabled="!EditCheck" @click="showEditDialog()">编辑</el-button>
    </div>
    <div class="VenueOverview">
      <img class="VenueImg" alt="场馆图片"/>
      <div class="OverviewText">
        <div class="OverviewLine" v-for="val, k in overviewDisplay">
          <div class="OverviewDescription">{{ k }}</div>
          <div>{{ val }}</div>
        </div>
        <div class="OverviewLine">
          <div class="OverviewDescription">设备：</div>
          <el-button v-for="vdevice in venueDevices" size="small" 
          @click="deviceLink(vdevice.id)">{{ vdevice.name }}</el-button>
        </div>
        <div class="OverviewLine">
          <div class="OverviewDescription">当前状态：</div>
          <span v-if="venueInfo.state === 0" style="color: green">开放</span>
          <span v-if="venueInfo.state === 1" style="color: red">关闭</span>
          <span v-if="venueInfo.state === 2" style="color: gray">未确定</span>
        </div>
      </div>
    </div>
    <div class="descriptionArea">
      <div class="descriptionTitle">场地简介</div>
      <div class="descriptionContent">
        {{ venueInfo.description }}
      </div>
    </div>
    <div class="DetailArea">
      <div class="OpenTimeArea">
        <div class="OpenTimeHeader">
          <div class="OpenTimeTitle">开放时间表</div>
          <el-button size="small" @click="setDate(-1)">&lt;</el-button>
          <el-date-picker v-model="openDate" size="small" 
          @change="handleDateChange()"></el-date-picker>
          <el-button size="small" @click="setDate(1)">&gt;</el-button>
        </div>
        <el-table :data="openTime" class="infoTable" border :default-sort="{ prop: 'period'}">
          <el-table-column prop="period" label="时间" sortable :resizable="false"></el-table-column>
          <el-table-column prop="remain" label="剩余容量" width="105" sortable :resizable="false"></el-table-column>
          <el-table-column prop="price" label="价格" width="80" sortable :resizable="false"></el-table-column>
        </el-table>
      </div>
      <div class="MaintainenceArea">
        <div class="MaintainenceTitle">保养记录</div>
        <el-table :data="maintainenceRecord" class="infoTable" border>
          <el-table-column prop="id" label="编号" width="55" :resizable="false"></el-table-column>
          <el-table-column prop="start_time" label="时间" width="140" :resizable="false"></el-table-column>
          <el-table-column prop="description" label="描述" :resizable="false"
          :show-overflow-tooltip="{ effect: 'light'}"></el-table-column>
          <el-table-column label="状态" width="80" :resizable="false">
            <template #default="item">
              <div v-if="item.row.state === 0" style="color: green">完成</div>
              <div v-if="item.row.state === 1" style="color: orange">保养中</div>
              <div v-if="item.row.state === 2" style="color: red">待保养</div>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="140">
            <template #default="item">
              <el-button size="small" type="primary">详情</el-button>
              <el-button size="small" v-if="EditCheck">编辑</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
  </div>
  <VenueEdit v-if="editDialog" :dialogMode="dialogMode" :curRecord="venueInfo" 
  @closeModal="editDialog = false"></VenueEdit>
</template>
<style scoped>

.AdminVenueDetail{
  display: flex;
  flex-direction: column;
  width: calc(100% - 20px);
  padding-bottom: 10px;
  margin: 10px;
  border-radius: 5px;
  background-color: white;
  border: 1px solid lightgray;
}

.AdminVenueHeader{
  display: flex;
  padding: 10px;
  border-bottom: 1px solid black;
}

.BackButton{
  margin-left: 0px;
  margin-right: auto;
}

.EditButton{
  margin-right: 0px;
  margin-left: auto;
}

.AdminVenueTitle{
  font-size: 18px;
  font-weight: 700;
}

.VenueOverview{
  display: flex;
  justify-content: center;
  align-items: center;
  height: 320px;
  padding: 10px;
}

.VenueImg{
  width: 300px;
  height: 300px;
}

.OverviewText{
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  max-width: 800px;
}

.OverviewLine{
  display: flex;
  line-height: 2.5em;
  align-items: center;
}

.OverviewDescription{
  width: 100px;
  font-weight: 700;
}

.DetailArea{
  display: flex;
  justify-content: space-evenly;
}

.OpenTimeArea{
  display: flex;
  flex-direction: column;
  width: 40%;
}

.MaintainenceArea{
  display: flex;
  flex-direction: column;
  width: 55%;
}

.OpenTimeHeader{
  display: flex;
  justify-content: center;
  padding: 5px;
  border: 1px solid lightgray;
}

.OpenTimeTitle{
  margin-left: 5px;
  margin-right: auto;
  font-weight: 700;
  width: 120px;
}


.MaintainenceTitle{
  display: flex;
  justify-content: center;
  font-weight: 700;
  padding: 5px;
  border: 1px solid lightgray;
}

.descriptionArea{
  margin-left: 10px;
  margin-right: 10px;
  margin-bottom: 10px;
  border: 1px solid lightgray;
}

.descriptionTitle{
  display: flex;
  justify-content: center;
  font-weight: 700;
  padding: 5px;
  border-bottom: 1px solid lightgray;
}

.descriptionContent{
  padding: 10px;
  line-height: 1.5em;
}

.infoTable{
  max-height: 300px;
}

</style>