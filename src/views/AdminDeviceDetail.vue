<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router'; // 导入 useRoute
import { convertTime, judgeState } from '@/apis/utils';
import RepairDetail from './components/RepairDetail.vue';
import { useUserStore } from '@/stores/userStore';
import { storeToRefs } from 'pinia';
import { ElMessage } from 'element-plus';
import { getDeviceInfo } from '@/apis/requests';

const route = useRoute(); // 初始化路由器
const router = useRouter();
const id = ref();
const curRecord = ref(null);
const detailDialog = ref(false);
const dialogMode = ref('view');
const userStore = useUserStore();
const { adminType, adminPermission } = storeToRefs(userStore);
const deviceEdit = ref(false);
const recordDetails = ref('');

function showRepairDetail(record, mode){
  curRecord.value = record;
  dialogMode.value = mode;
  detailDialog.value = true;
}

const EditCheck = computed(() => { //检查管理员权限
  return adminType.value === 'system' ||
        (adminType.value === 'device' || adminType.value === 'venue-device') &&
        record.deviceId in adminPermission.value.device
});

const deviceInfo = ref({});

// const tempDeviceInfo = ref({
//   name: deviceInfo.value.name,
//   venue: deviceInfo.value.venue,
// })

// const overviewDisplay = ref({
//   "设备ID：": deviceInfo.value.id,
//   "设备名称：": deviceInfo.value.name,
//   "设备引入时间：": deviceInfo.value.introTime, 
// });


const devices = [
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
];

// 计算维修记录状态
const repairRecord = ref([
  {
  id: 1,
  deviceId: 1,
  deviceName: '设备1',
  venueId: 1,
  venueName: '场地1',
  start_time: new Date("August 20, 2024 13:00:00"),
  end_time: new Date("August 20, 2024 14:00:00"),
  description: '设备正常维修',
},
{
  id: 2,
  deviceId: 1,
  deviceName: '设备1',
  venueId: 1,
  venueName: '场地1',
  start_time: new Date("August 19, 2024 13:00:00"),
  end_time: new Date("August 19, 2024 14:00:00"),
  description: "维修描述过长时，多余内容隐藏，当鼠标移动到对应位置时以提示框的方式显示",
},
{
  id: 3,
  deviceId: 1,
  deviceName: '设备1',
  venueId: 1,
  venueName: '场地1',
  start_time: new Date("August 19, 2024 19:00:00"),
  end_time: new Date("August 19, 2024 20:00:00"),
  description: "这里是维修描述文字",
},
{
  id: 4,
  deviceId: 2,
  deviceName: '设备2',
  venueId: 1,
  venueName: '场地1',
  start_time: new Date("September 19, 2024 13:00:00"),
  end_time: new Date("September 19, 2024 14:00:00"),
  description: "这里是维修描述文字",
},
{
  id: 5,
  deviceId: 2,
  deviceName: '设备2',
  venueId: 1,
  venueName: '场地1',
  start_time: new Date("August 19, 2024 13:00:00"),
  end_time: new Date("August 19, 2024 14:00:00"),
  description: "维修描述过长时，多余内容隐藏，当鼠标移动到对应位置时以提示框的方式显示",
},
{
  id: 6,
  deviceId: 4,
  deviceName: '设备5',
  venueId: 1,
  venueName: '场地1',
  start_time: new Date("August 19, 2024 13:00:00"),
  end_time: new Date("August 19, 2024 14:00:00"),
  description: "维修描述过长时，多余内容隐藏，当鼠标移动到对应位置时以提示框的方式显示",
},
{
  id: 7,
  deviceId: 4,
  deviceName: '设备5',
  venueId: 1,
  venueName: '场地1',
  start_time: new Date("August 19, 2024 13:00:00"),
  end_time: new Date("August 19, 2024 14:00:00"),
  description: "维修描述过长时，多余内容隐藏，当鼠标移动到对应位置时以提示框的方式显示",
},
{
  id: 8,
  deviceId: 1,
  deviceName: '设备1',
  venueId: 1,
  venueName: '场地1',
  start_time: new Date("August 19, 2024 13:00:00"),
  end_time: new Date("August 19, 2024 14:00:00"),
  description: "维修描述过长时，多余内容隐藏，当鼠标移动到对应位置时以提示框的方式显示",
},
]);


function showDeviceEdit() {
  deviceEdit.value = true;
}

function closeDeviceEdit() {
  deviceEdit.value = false;
}

function saveDeviceEdit() {
  deviceInfo.value.name=tempDeviceInfo.value.name;
  deviceInfo.value.venue=tempDeviceInfo.value.venue;
  ElMessage({
    message: '信息修改成功',
    type: 'success',
  })
  deviceEdit.value = false;
}

// 跳转到设备列表页面
function goToDeviceList() {
  router.push('/AdminDevice'); // 设备列表页面的路由地址
}

// id: 1,
//     name: '设备1',
//     state: 0,
//     introTime: '2024-08-12',
//     venueid: 1,
//     venuename: '篮球场',

const processDeviceInfo = (res) => {
  deviceInfo.value.id = res.equipmentId;
  deviceInfo.value.name = res.equipmentName;
  deviceInfo.value.introTime = res.equipmentIntroTime;
  deviceInfo.value.venueid =  res.venueId;
  deviceInfo.value.venuename = res.venueName;
  recordDetails.value = res.repairRecords;
}

const getDeviceInfoErr = (msg) => {
  ElMessage.error('未找到设备信息：' + msg);
}

const viewVenueDetail = () => {
  console.log(deviceInfo.venueid);
  router.push({
    path: '/AdminVenueDetail',
    query: {
      venueId: deviceInfo.value.venueid,
    }
  })
}

const getDeviceState = () => {
  for(const record of recordDetails){
    
  }
}

const value = ref('')

const options = [
  {
    value: '场地1',
    label: '场地1',
  },
  {
    value: '场地2',
    label: '场地2',
  },
  {
    value: '场地3',
    label: '场地3',
  },
  {
    value: '场地4',
    label: '场地4',
  },
  {
    value: '场地5',
    label: '场地5',
  },
]

onMounted(async () => {
  const { deviceId } = route.query;
  if(!deviceId){
    getDeviceInfoErr('未传入设备ID');
  }
  else{
    await getDeviceInfo(deviceId, processDeviceInfo, getDeviceInfoErr)
  }
  // id.value = deviceId;
  // deviceInfo.value = devices.find(item => item.id == deviceId);
  // console.log(deviceInfo);
  // recordDetails.value = repairRecord.filter(item => item.deviceId == deviceId);
})

</script>

<template>
  <div class="AdminDeviceDetail">
    <div class="AdminDeviceHeader">
      <el-button class="BackButton" @click="goToDeviceList">&lt;&nbsp;&nbsp;设备总览</el-button>
      <div class="AdminDeviceTitle">{{ deviceInfo?.name }}</div>
      <el-button class="EditButton" @click="showDeviceEdit">编辑</el-button>
    </div>
    <div class="DeviceOverview">
      <img class="DeviceImg" alt="设备图片"/>
      <div class="OverviewText">
        <!-- <div class="OverviewLine" v-for="(val, k) in overviewDisplay" :key="k">
          <div class="OverviewDescription">{{ k }}</div>
          <div>{{ val }}</div>
        </div> -->
        <div class="OverviewLine">
          <div class="OverviewDescription">设备ID：</div>
          <div>{{ deviceInfo?.id }}</div>
        </div>
        <div class="OverviewLine">
          <div class="OverviewDescription">设备名称：</div>
          <div>{{ deviceInfo?.name }}</div>
        </div>
        <div class="OverviewLine">
          <div class="OverviewDescription">设备引入时间：</div>
          <div>{{ convertTime(deviceInfo?.introTime) }}</div>
        </div>
        <div class="OverviewLine">
          <div class="OverviewDescription">设备所在场地：</div>
          <el-button size="small" @click="viewVenueDetail">{{ deviceInfo?.venuename }}</el-button>
        </div>
        <div class="OverviewLine">
          <div class="OverviewDescription">状态：</div>
          <span v-if="deviceInfo?.state === 0" style="color: green">使用中</span>
          <span v-if="deviceInfo?.state === 1" style="color: red">维修中</span>
          <span v-if="deviceInfo?.state === 2" style="color: orange">待维修</span>
          <span v-if="deviceInfo?.state === 3" style="color: gray">未使用</span>
        </div>
      </div>
    </div>
    <div class="DetailArea">
      <div class="MaintainenceArea">
        <div class="MaintainenceTitle">维修记录</div>
        <el-table :data="recordDetails" border>
          <el-table-column prop="id" label="编号" width="55"></el-table-column>
          <el-table-column prop="start_str" label="时间" width="140"></el-table-column>
          <el-table-column prop="description" label="描述" :show-overflow-tooltip="{ effect: 'light'}"></el-table-column>
          <el-table-column label="状态" width="80">
            <template #default="item">
              <div v-if="item.row.state === 0" style="color: green">已维修</div>
              <div v-if="item.row.state === 1" style="color: red">维修中</div>
              <div v-if="item.row.state === 2" style="color: orange">待维修</div>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="150">
            <template #default="item">
              <el-button size="small" type="primary" @click="showRepairDetail(item.row, 'view')">详情</el-button>
              <el-button size="small" v-if="EditCheck" @click="showRepairDetail(item.row, 'edit')">编辑</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
  </div>
  <RepairDetail v-if="detailDialog" :dialogMode="dialogMode" :curRecord="curRecord" 
  @closeModal="detailDialog = false" @editModal="showRepairDetail(curRecord, 'edit')"></RepairDetail>
    <el-dialog v-model="deviceEdit" title="编辑信息" align-center>
      <div class="modalBody">
        <el-form :model="tempDeviceInfo" label-width="120px">
          <div class="form-row">
            <span>设备名称</span>
            <el-form-item prop="name">
              <el-input v-model="tempDeviceInfo.name" placeholder="" style="width: 240px"></el-input>
            </el-form-item>
          </div>
          <div class="form-row">
            <span>场地选择</span>
            <el-form-item prop="venue">
              <el-select v-model="tempDeviceInfo.venue" style="width: 240px">
                <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"/>
              </el-select>
            </el-form-item>
            
          </div>
        </el-form>
      </div>
      <template #footer>
        <div class="smallButtonContainer"> 
          <el-button class="smallButton" @click="closeDeviceEdit">取消</el-button>
          <el-button class="smallButton" type="primary" @click="saveDeviceEdit">保存</el-button>
        </div>
      </template>
    </el-dialog>
</template>

<style scoped>

.AdminDeviceDetail{
  display: flex;
  flex-direction: column;
  width: calc(100% - 20px);
  padding-bottom: 10px;
  margin: 10px;
  border-radius: 5px;
  background-color: white;
  border: 1px solid lightgray;
}

.AdminDeviceHeader{
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

.AdminDeviceTitle{
  align-self: center;
  font-size: 18px;
  font-weight: 700;
}

.DeviceOverview{
  display: flex;
  height: 320px;
  padding: 10px;
  justify-content: center;
  align-items: center;
  margin-top: 20px;
}

.DeviceImg{
  width: 300px;
  height: 300px;
  margin-right: 50px;
}

.OverviewText{
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
}

.OverviewLine{
  display: flex;
  margin-bottom: 5%; /* 修改条目间距 */
}

.OverviewDescription{
  width: 150px;
  font-weight: 700;
}

.DetailArea{
  display: flex;
  justify-content: space-evenly;
}

.MaintainenceArea{
  display: flex;
  flex-direction: column;
  width: 80%;
}

.MaintainenceTitle{
  display: flex;
  justify-content: center;
  font-weight: 700;
  padding: 5px;
  border: 1px solid lightgray;
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
</style>