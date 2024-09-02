<script setup>
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router'; // 导入 useRouter
import { convertTime, judgeState } from '@/apis/utils';
import RepairDetail from './components/RepairDetail.vue';
import { useUserStore } from '@/stores/userStore';
import { storeToRefs } from 'pinia';

const router = useRouter(); // 初始化路由器
const curRecord = ref(null);
const detailDialog = ref(false);
const dialogMode = ref('view');
const userStore = useUserStore();
const { adminType, adminPermission } = storeToRefs(userStore);
const deviceEdit = ref(false);

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

const deviceInfo = ref({
  id: 1,
  name: "设备01",
  venue: "场地1",
  state: 0,
  introTime: "2024-08-20 13:00"
});

const tempDeviceInfo = ref({
  name: deviceInfo.value.name,
  venue: deviceInfo.value.venue,
})

// const overviewDisplay = ref({
//   "设备ID：": deviceInfo.value.id,
//   "设备名称：": deviceInfo.value.name,
//   "设备引入时间：": deviceInfo.value.introTime, 
// });

// 计算维修记录状态
const repairRecord = [{
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
  deviceId: 1,
  deviceName: '设备1',
  venueId: 1,
  venueName: '场地1',
  start_time: new Date("September 19, 2024 13:00:00"),
  end_time: new Date("September 19, 2024 14:00:00"),
  description: "这里是维修描述文字",
}];

repairRecord.map((record) => {
  record.start_str = convertTime(record.start_time);
  record.state = judgeState(record.start_time, record.end_time);
  return record;
})

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
</script>

<template>
  <div class="AdminDeviceDetail">
    <div class="AdminDeviceHeader">
      <el-button class="BackButton" @click="goToDeviceList">&lt;&nbsp;&nbsp;设备总览</el-button>
      <div class="AdminDeviceTitle">{{ deviceInfo.name }}</div>
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
          <div>{{ deviceInfo.id }}</div>
        </div>
        <div class="OverviewLine">
          <div class="OverviewDescription">设备名称：</div>
          <div>{{ deviceInfo.name }}</div>
        </div>
        <div class="OverviewLine">
          <div class="OverviewDescription">设备引入时间：</div>
          <div>{{ deviceInfo.introTime }}</div>
        </div>
        <div class="OverviewLine">
          <div class="OverviewDescription">设备所在场地：</div>
          <el-button size="small">{{ deviceInfo.venue }}</el-button>
        </div>
        <div class="OverviewLine">
          <div class="OverviewDescription">状态：</div>
          <span v-if="deviceInfo.state === 0" style="color: green">使用中</span>
          <span v-if="deviceInfo.state === 1" style="color: red">维修中</span>
          <span v-if="deviceInfo.state === 2" style="color: orange">待维修</span>
          <span v-if="deviceInfo.state === 3" style="color: gray">未使用</span>
        </div>
      </div>
    </div>
    <div class="DetailArea">
      <div class="MaintainenceArea">
        <div class="MaintainenceTitle">维修记录</div>
        <el-table :data="repairRecord" border>
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
  <!-- <div v-if="deviceEdit" class="modal" @click="closeDeviceEdit">
    <div class="modal-content2" @click.stop>
      <div class="modalHeader">
        <div class="modalTitle">设备信息修改</div>
      </div>
      <div class="smallButtonContainer"> 
        <el-button class="smallButton" type="primary" @click="saveDeviceEdit">保存</el-button>
        <el-button class="smallButton" @click="closeDeviceEdit">取消</el-button>
      </div>
    </div>
  </div> -->
  <!-- <div v-if="deviceEdit" class="modal" @click="closeDeviceEdit">
    <div class="modal-content" @click.stop>
      <div class="modalHeader">
        <div class="modalTitle">编辑信息</div>
        <el-button class="smallButton" type="danger" @click="closeDeviceEdit">关闭</el-button>
      </div> -->
    <el-dialog v-model="deviceEdit" title="编辑信息" align-center>
      <div class="modalBody">
        <el-form :model="tempDeviceInfo" label-width="120px">
          <div class="form-row">
            <span>设备名称</span>
            <el-form-item prop="name">
              <el-input v-model="tempDeviceInfo.name" placeholder="" style="width: 240px"></el-input>
            </el-form-item>
          </div>
          <!-- <div class="form-row">
            <el-form-item class="form-item" label="场地" prop="venue">
              <el-input v-model="tempDeviceInfo.venue" placeholder=""></el-input>
            </el-form-item>
          </div> -->
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

.modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.6); /* 半透明背景 */
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  width: 60%;
  max-width: 600px;
  background-color: #fff;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  position: relative;
}

.modalHeader {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.modalTitle {
  font-size: 22px;
  font-weight: bold;
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