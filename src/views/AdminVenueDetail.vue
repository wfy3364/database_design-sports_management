<script setup>
import { ref, computed, onMounted } from 'vue';
import { dayjs, ElMessage } from 'element-plus';
// import router from '@/router/index'
import { getAdminVenueDetail, getVenueAdmin, getVenueOpenTime } from '@/apis/requests';
import { convertTime, judgeState } from '@/apis/utils';
import { useUserStore } from '@/stores/userStore';
import { storeToRefs } from 'pinia';
import VenueEdit from './components/VenueEdit.vue';
import { useRoute, useRouter } from 'vue-router';

const editDialog = ref(false);
const dialogMode = ref('edit');

const userStore = useUserStore();
const { adminType, adminPermission } = storeToRefs(userStore);

const route = useRoute();
const router = useRouter();

const venueInfo = ref([]);

const EditCheck = computed(() => {
  return adminType.value === 'system' ||
        (adminType.value === 'venue' || adminType.value === 'venue-device') &&
        adminPermission.value.venue.includes(venueInfo.id);
});

const openTime = ref([]);
const venueDevices = ref([]);

// const overviewDisplay = {
//   "场地ID：": venueInfo.value.id,
//   "场地名称：": venueInfo.value.name,
//   "运动类型：": venueInfo.value.type,
//   "场地容量：": venueInfo.value.capacity,
//   "场地地址：": venueInfo.value.address,
// }

const openDate = ref(dayjs().format("YYYY-MM-DD"));

const maintainenceRecord = ref([{
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
}]);

const openDateIndex = ref(0);

onMounted(async () => {
  const { venueId } = route.query;
  if(venueId){
    await getAdminVenueDetail(venueId, processVenueDetail, getVenueDetailErr)
    .then(getCurOpenTime).then(() => {
      getVenueAdmin(venueInfo.value.id, getVenueAdminSuccess, getVenueAdminErr);
    }).then(() => {
      venueInfo.value.state = getVenueState();
      console.log(venueInfo.value);
    });
  }
})

function processVenueDetail(res){
  venueInfo.value = {
    id: res.venueId,
    name: res.name,
    type: res.type,
    capacity: res.capacity,
    address: res.venueLocation,
    img: res.venueImageUrl,
    description: res.venueDescription,
  };
  venueDevices.value = res.venueDevices.map(item => {
    return { id: item.equipmentId, name: item.equipmentName }
  });
  maintainenceRecord.value = res.maintenanceRecords.map(item => {
    return {
      id: item.venueMaintenanceId,
      start_time: item.maintenanceStartDate,
      end_time: item.maintenanceEndDate,
      description: item.description,
      state: judgeState(item.maintenanceStartDate, item.maintenanceEndDate)
    }
  });
}

async function getCurOpenTime(){
  await getVenueOpenTime(venueInfo.value.id, openDate.value, getOpenTimeSuccess, getOpenTimeErr)
}

function getOpenTimeSuccess(res){
  openTime.value.push({
    date: openDate.value, 
    time: res.map((item) => {
      return {
        id: item.availabilityId,
        start_time: item.startTime,
        end_time: item.endTime,
        price: item.price,
        remain: item.remainingCapacity,
      }
    }
  )});
  openDateIndex.value = openTime.value.length - 1;
}

function getOpenTimeErr(msg){
  ElMessage.error('获取场地开放时间失败：' + msg);
}

function getVenueDetailErr(msg){
  ElMessage.error('获取场地详细信息失败：' + msg);
}

function setDate(val){
  openDate.value = dayjs(openDate.value).add(val, "day").format("YYYY-MM-DD");
  handleDateChange();
}

async function handleDateChange(){
  for(let i = 0; i < openTime.value.length; i++){
    if(openTime.value[i].date === openDate.value){
      openDateIndex.value = i;
      return;
    }
  }
  await getCurOpenTime();
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
  for(const item in openTime.time){
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

function getVenueAdminSuccess(res){
  console.log(res);
  if(res.venueAdminDto){
    venueInfo.value.admin = res.venueAdminDto.map(item => {
    return {
      id: item.adminId,
      name: item.realName,
    };
  });
  }
  else{
    venueInfo.value.admin = [];
  }
}

function getVenueAdminErr(msg){
  ElMessage.error('获取场地管理员失败：' + msg);
}

function viewMaintenanceDetail(id, mode){
  router.push({
    path: '/AdminVenueMaintenance',
    query: {
      maintenanceId: id,
      mode: mode,
    }
  })
}

function backVenueBrowser(){
  router.push('/VenueBrowser');
}

const venueTimeFormat = (start, end) => {
  const startStr = convertTime(start);
  const endStr = convertTime(end);
  return startStr.slice(startStr.length - 5, startStr.length)
  + '-' + endStr.slice(endStr.length - 5, endStr.length);
}

async function handleEditClose(){
  editDialog.value = false;
  const { venueId } = route.query;
  openTime.value = [];
  await getAdminVenueDetail(venueId, processVenueDetail, getVenueDetailErr)
    .then(getCurOpenTime).then(() => {
      venueInfo.value.state = getVenueState()
    });
}

</script>

<template>
  <div class="AdminVenueDetail">
    <div class="AdminVenueHeader">
      <el-button class="BackButton" @click="backVenueBrowser">&lt;&nbsp;&nbsp;场地总览</el-button>
      <div class="AdminVenueTitle">{{ venueInfo.name }}</div>
      <el-button class="EditButton" :disabled="!EditCheck" @click="showEditDialog()">编辑</el-button>
    </div>
    <div class="VenueOverview">
      <img class="VenueImg" :src="venueInfo.img" alt="场馆图片"/>
      <div class="OverviewText">
        <div class="OverviewLine">
          <div class="OverviewDescription">场地ID：</div>
          <div>{{ venueInfo?.id }}</div>
        </div>
        <div class="OverviewLine">
          <div class="OverviewDescription">场地名称：</div>
          <div>{{ venueInfo?.name }}</div>
        </div>
        <div class="OverviewLine">
          <div class="OverviewDescription">运动类型：</div>
          <div>{{ venueInfo?.type }}</div>
        </div>
        <div class="OverviewLine">
          <div class="OverviewDescription">场地容量：</div>
          <div>{{ venueInfo?.capacity }}</div>
        </div>
        <div class="OverviewLine">
          <div class="OverviewDescription">场地地址：</div>
          <div>{{ venueInfo?.address}}</div>
        </div>
        <div class="OverviewLine">
          <div class="OverviewDescription">设备：</div>
          <div class="OverviewContent">
            <el-button v-for="vdevice in venueDevices" size="small" 
            @click="deviceLink(vdevice.id)">{{ vdevice.name }}</el-button>
          </div>
        </div>
        <div class="OverviewLine">
          <div class="OverviewDescription">当前状态：</div>
          <span v-if="venueInfo.state === 0" style="color: green">开放</span>
          <span v-if="venueInfo.state === 1" style="color: red">关闭</span>
          <span v-if="venueInfo.state === 2" style="color: gray">未确定</span>
        </div>
        <div class="OverviewLine">
          <div class="OverviewDescription">管理员：</div>
          <div class="OverviewContent">
            <el-tag v-for="admin in venueInfo.admin">{{ admin.name }}</el-tag>
          </div>
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
        <el-table :data="openTime[openDateIndex]?.time" class="infoTable" border :default-sort="{ prop: 'period'}">
          <el-table-column label="时间" sortable :resizable="false">
            <template #default="item">
              {{ venueTimeFormat(item.row.start_time, item.row.end_time) }}
            </template>
          </el-table-column>
          <el-table-column prop="remain" label="剩余容量" width="105" sortable :resizable="false"></el-table-column>
          <el-table-column prop="price" label="价格" width="80" sortable :resizable="false"></el-table-column>
        </el-table>
      </div>
      <div class="MaintainenceArea">
        <div class="MaintainenceTitle">保养记录</div>
        <el-table :data="maintainenceRecord" class="infoTable" border>
          <el-table-column prop="id" label="编号" width="55" :resizable="false"></el-table-column>
          <el-table-column label="开始时间" width="140" :resizable="false">
            <template #default="item">
              {{ convertTime(item.row.start_time) }}
            </template>
          </el-table-column>
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
              <el-button size="small" type="primary" @click="viewMaintenanceDetail(item.row.id, 'view')">详情</el-button>
              <el-button size="small" v-if="EditCheck" @click="viewMaintenanceDetail(item.row.id, 'edit')">编辑</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
  </div>
  <VenueEdit v-if="editDialog" :dialogMode="dialogMode" :curRecord="venueInfo" 
  @closeModal="handleEditClose"></VenueEdit>
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
  margin-right: 20px;
}

.OverviewText{
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  width: calc(90% - 300px);
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