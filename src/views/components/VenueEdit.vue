<script setup>

import { ref, computed, onMounted } from 'vue';
import { dayjs, ElMessage, ElStep } from 'element-plus';
import { convertTime } from '@/apis/utils';
import Uploadphotos from '../Uploadphotos.vue';
import { useUserStore } from '@/stores/userStore';
import { storeToRefs } from 'pinia';
import { createVenue, getVenueOpenTime, addVenueOpenTime, editVenueInfo, editVenueOpenTime, 
  deleteVenueOpenTime, updateVenueAdmin, getAllAdmin
} from '@/apis/requests';
import { useSportsStore } from '@/stores/sportsStore';

const detailDialog = ref(true);
const editingRecord = ref(null);
const exitConfirmDialog = ref(false);
const errDialog = ref(false);
const successDialog = ref(false);
const resVenueId = ref('');
const errMsg = ref('');
const props = defineProps({
  dialogMode: String,
  curRecord: {
    id: String,
    img: String,
    name: String,
    type: String,
    capacity: Number,
    address: String,
    description: String,
    admin: Array,
  },
});

const emit = defineEmits(['closeModal']);

const userStore = useUserStore();
const { userId, userName, adminType, adminPermission } = storeToRefs(userStore);

// 检查管理员编辑权限
// const EditCheck = computed(() => {
//   return adminType.value === 'system' ||
//         (adminType.value === 'venue' || adminType.value === 'venue-device') &&
//         adminPermission.value.venue.includes(curRecord.id);
// });

const openDate = ref(dayjs().format("YYYY-MM-DD"));
const editingDateIndex = ref(0);
const openTime = ref([{
  id: '1',
  start_time: new Date("2024-09-01T13:00:00"),
  end_time: new Date("2024-09-01T14:00:00"),
  remain: 10,
  price: 19.99,
},{
  id: '2',
  start_time: new Date("2024-09-01T09:00:00"),
  end_time: new Date("2024-09-01T10:00:00"),
  remain: 5,
  price: 9.99,
}]);

const editingTime = ref([]);
const deletedTimeId = ref([]);

const dialogTitle = {
  'edit': '编辑场地信息',
  'create': '添加新场地',
}

const sportsStore = useSportsStore();
const { sports } = storeToRefs(sportsStore);

// const sports = ref(['足球', '篮球', '网球', '羽毛球', '其它']);
const customType = ref('');

const adminOptions = ref([{
  id: '100001',
  name: ''
}, {
  id: '100002',
  name: 'abc',
}])
const venueAdmins = ref([]);

async function getCurOpenTime(){
  await getVenueOpenTime(props.curRecord.id, openDate.value, getOpenTimeSuccess, getOpenTimeErr)
}

function getOpenTimeSuccess(res){
  openTime.value = res.map((item) => {
    return {
      id: item.availabilityId,
      start_time: item.startTime,
      end_time: item.endTime,
      price: item.price,
      remain: item.remainingCapacity,
    }
  });
  // console.log(openTime.value);
  editingTime.value.push({
    date: openDate.value,
    time: openTime.value.map(item => {
      return {
        id: item.id,
        period: [item.start_time, item.end_time],
        remain: item.remain,
        price: item.price,
      }
    }),
  });
  editingDateIndex.value = editingTime.value.length - 1;
}

function getOpenTimeErr(msg){
  ElMessage.error('获取场地开放时间失败：' + msg);
}

function processAdminData(res){
  adminOptions.value = res.map(item => {
    return {
      id: item.adminId,
      name: item.realName,
    }
  });
}

function getAdminErr(msg){
  ElMessage.error('获取管理员信息失败：' + msg);
}

onMounted(async () => {
  if(props.dialogMode === 'edit'){
    editingRecord.value = {
      name: props.curRecord.name,
      type: props.curRecord.type,
      capacity: props.curRecord.capacity,
      address: props.curRecord.address,
      description: props.curRecord.description,
      img: props.curRecord.img,
    };
    venueAdmins.value = props.curRecord.admin.map(item => item.id);
    await getCurOpenTime();
  }
  else if(props.dialogMode === 'create'){
    editingRecord.value = {
      id: null,
      name: '',
      type: '',
      capacity: 10,
      address: '',
      description: '',
      img: '',
      admin: [userId.value],
    };
    editingTime.value = [{
      date: openDate.value,
      time: [],
    }];
  }
  getAllAdmin(processAdminData, getAdminErr);
});

function setDate(val){
  openDate.value = dayjs(openDate.value).add(val, "day").format("YYYY-MM-DD");
  handleDateChange();
}

async function handleDateChange(){
  for(let i = 0; i < editingTime.value.length; i++){
    if(editingTime.value[i].date === openDate.value){
      editingDateIndex.value = i;
      return;
    }
  }
  if(props.dialogMode === 'create'){
    editingTime.value.push({
      date: openDate.value,
      time: [],
    });
    editingDateIndex.value = editingTime.value.length - 1;
  }
  else{
    await getCurOpenTime();
  }
}

function dialogExitConfirm(){
  // if(props.dialogMode === 'view'){
  //   // detailDialog.value = false;
  //   emit('closeModal');
  //   return;
  // }
  exitConfirmDialog.value = true;
}

function addOpenTimeRow(){
  editingTime.value[editingDateIndex.value].time.push({
    id: null,
    period: [],
    remain: editingRecord.value.capacity,
    price: 10,
  });
}

function deleteTime(item){
  if(item.row.id){
    deletedTimeId.value.push(item.row.id);
  }
  editingTime.value[editingDateIndex.value].time.splice(item.$index, 1);
}

function validateEdit(){
  if(!editingRecord.value.name){
    errMsg.value = '场地名称不能为空';
    errDialog.value = true;
    return false;
  }
  if(!editingRecord.value.type || editingRecord.value.type === '其它' && !customType.value){
    errMsg.value = '运动类型不能为空';
    errDialog.value = true;
    return false;
  }
  if(!editingRecord.value.capacity){
    errMsg.value = '场地容量不能为空';
    errDialog.value = true;
    return false;
  }
  if(!editingRecord.value.address){
    errMsg.value = '场地地址不能为空';
    errDialog.value = true;
    return false;
  }
  if(venueAdmins.value.length == 0){
    errMsg.value = '至少选择一个场地管理员';
    errDialog.value = true;
    return false;
  }
  return true;
}

function convertTimeSlots(){
  let resArr = [];
  const offset = dayjs().utcOffset();
  console.log(offset);
  for(const item of editingTime.value){
    resArr = [...resArr, ...item.time.map(timeSlot => {
      const data = {
        startTime: dayjs(item.date).set('hour', dayjs(timeSlot.period[0]).get('hour'))
        .set('minute', dayjs(timeSlot.period[0]).get('minute')).add(offset, 'minute'),
        endTime: dayjs(item.date).set('hour', dayjs(timeSlot.period[1]).get('hour'))
        .set('minute', dayjs(timeSlot.period[1]).get('minute')).add(offset, 'minute'),
        price: timeSlot.price,
        remainingCapacity: timeSlot.remain,
      }
      if(timeSlot.id){
        data.availabilityId = timeSlot.id;
      }
      return data;
    })];
  }
  return resArr;
}

async function handleEdit(){
  if(!validateEdit()){
    return;
  }
  const venueData = {
    name: editingRecord.value.name,
    type: editingRecord.value.type === '其它' ? customType.value : editingRecord.value.type,
    capacity: editingRecord.value.capacity,
    status: 'any',
    maintenanceCount: 0,
    lastInspectionTime: new Date(),
    venueImageUrl: editingRecord.value.img,
    venueLocation: editingRecord.value.address,
    venueDescription: editingRecord.value.description,
  };
  const editTimeSlot = async () => {
    const timeSlotArr = convertTimeSlots();
    console.log(timeSlotArr);
    console.log(deletedTimeId);
    let addIndex = 0;
    let deleteIndex = 0;
    const addStep = async () => {
      addIndex++;
      if(addIndex === timeSlotArr.length){
        if(deletedTimeId.value.length > 0){
          await deleteVenueOpenTime(deletedTimeId.value[deleteIndex], deleteStep, handleEditErr);
        }
        else{
          await addVenueAdmin();
        }
        return;
      }
      if(timeSlotArr[addIndex].availabilityId){
        await editVenueOpenTime(timeSlotArr[addIndex], addStep, handleEditErr);
      }
      else{
        await addVenueOpenTime({ venueId: props.curRecord.id, ...timeSlotArr[addIndex]}, 
        addStep, handleEditErr);
      }
    }
    const deleteStep = async () => {
      deleteIndex++;
      if(deleteIndex === deletedTimeId.value.length){
        await addVenueAdmin();
        return;
      }
      await deleteVenueOpenTime(deletedTimeId.value[deleteIndex], deleteStep, handleEditErr);
    }

    if(timeSlotArr.length > 0){
      if(timeSlotArr[addIndex].availabilityId){
        await editVenueOpenTime(timeSlotArr[addIndex], addStep, handleEditErr);
      }
      else{
        await addVenueOpenTime({ venueId: props.curRecord.id, ...timeSlotArr[addIndex]}, 
        addStep, handleEditErr);
      }
    }
    else if(deletedTimeId.value.length > 0){
      await deleteVenueOpenTime(deletedTimeId.value[deleteIndex], deleteStep, handleEditErr);
    }
    else{
      await addVenueAdmin();
    }
  }
  const addVenueAdmin = async () => {
    const updateData = {
      venueId: props.curRecord.id,
      venueAdmins: venueAdmins.value,
    }
    // console.log(venueAdmins.value);
    // console.log(updateData);
    await updateVenueAdmin(updateData, handleEditSuccess, handleEditErr);
  }
  const handleEditSuccess = () => {
    successDialog.value = true;
  }
  const handleEditErr = (msg) => {
    ElMessage.error('创建场地失败：' + msg);
  }
  await editVenueInfo(props.curRecord.id, venueData, editTimeSlot, handleEditErr);
}

async function handleCreate(){
  if(!validateEdit()){
    return;
  }
  const venueData = {
    name: editingRecord.value.name,
    type: editingRecord.value.type === '其它' ? customType.value : editingRecord.value.type,
    capacity: editingRecord.value.capacity,
    status: '',
    maintenanceCount: 0,
    lastInspectionTime: new Date(),
    venueImageUrl: editingRecord.value.img,
    venueLocation: editingRecord.value.address,
    venueDescription: editingRecord.value.description,
  };
  // console.log(venueData);
  const addOpenTimeSlot = async (res) => {
    ElMessage.success('创建场地成功');
    resVenueId.value = res;
    const timeSlotArr = convertTimeSlots();
    console.log(timeSlotArr);
    let curIndex = 0;
    const step = async () => {
      curIndex++;
      if(curIndex === timeSlotArr.length){
        await addVenueAdmin();
        return;
      }
      // console.log({ venueId: resVenueId.value, ...timeSlotArr[curIndex]});
      await addVenueOpenTime({ venueId: resVenueId.value, ...timeSlotArr[curIndex]}, 
      step, handleCreateErr);
    }
    if(timeSlotArr.length > 0){
      await addVenueOpenTime({ venueId: resVenueId.value, ...timeSlotArr[curIndex]}, 
      step, handleCreateErr);
    }
    else{
      await addVenueAdmin();
    }
  }
  const addVenueAdmin = async () => {
    const updateData = {
      venueId: resVenueId.value,
      venueAdmins: venueAdmins.value,
    }
    await updateVenueAdmin(updateData, handleEditSuccess, handleCreateErr);
  }
  const handleEditSuccess = () => {
    successDialog.value = true;
  }
  const handleCreateErr = (msg) => {
    ElMessage.error('创建场地失败：' + msg);
  }
  await createVenue(venueData, addOpenTimeSlot, handleCreateErr)
}

function handleImgUpload(url){
  // console.log(url);
  editingRecord.value.img = url;
}

</script>

<template>
  <!-- 详细信息对话框 -->
  <el-dialog v-model="detailDialog" :title="dialogTitle[dialogMode]" align-center :before-close="dialogExitConfirm">
    <div class="dialogContent">
      <div class="detailTitle">场地图片</div>
      <div>
        <img :src="editingRecord.img" alt="未选择图片">
      </div class="uploadItem">
      <div class="uploadItem">
        <uploadphotos @upload="handleImgUpload"></uploadphotos>
      </div>
      <div class="detailTitle">基本信息</div>
      <div v-if="dialogMode === 'edit'">
        <div class="detailLine">
          <div class="detailLabel">场地编号：</div>
          <div> {{ curRecord.id }} </div>
        </div>
      </div>
      <div class="detailLine">
        <div class="detailLabel">场地名称：</div>
        <el-input v-model="editingRecord.name" placeholder="输入场地名称"></el-input>
      </div>
      <div class="detailLine">
        <div class="detailLabel">运动类型：</div>
        <el-select v-model="editingRecord.type">
          <el-option v-for="sport in sports" :value="sport" :label="sport"></el-option>
        </el-select>
      </div>
      <div class="detailLine" v-if="editingRecord.type === '其它'">
        <div class="detailLabel"></div>
        <el-input placeholder="输入运动类型" v-model="customType"></el-input>
      </div>
      <div class="detailLine">
        <div class="detailLabel">场地容量：</div>
        <el-input-number class="numberInput" v-model="editingRecord.capacity" :min="1" :max="10000" :step="10"></el-input-number>
      </div>
      <div class="detailLine">
        <div class="detailLabel">场地地址</div>
        <el-input placeholder="输入场地地址" v-model="editingRecord.address"></el-input>
      </div>
      <div class="detailTitle">场地简介</div>
      <el-input type="textarea" v-model="editingRecord.description" placeholder="输入场地简介"></el-input>
      <div class="detailTitle">开放时间</div>
      <div class="openDateSelection">
        <el-button size="small" @click="setDate(-1)">&lt;</el-button>
        <el-date-picker v-model="openDate" size="small" 
        @change="handleDateChange()"></el-date-picker>
        <el-button size="small" @click="setDate(1)">&gt;</el-button>
        <el-button size="small" type="primary" class="addTimeButton" @click="addOpenTimeRow">添加时间</el-button>
      </div>
      <el-table :data="editingTime[editingDateIndex]?.time">
        <el-table-column label="时间">
          <template #default="item">
            <el-time-picker size="small" class="timeSelect" is-range 
            v-model="item.row.period" style="width: 100%;"></el-time-picker>
          </template>
        </el-table-column>
        <el-table-column label="剩余容量" width="120">
          <template #default="item">
            <el-input-number size="small" v-model="item.row.remain" :min="0" :max="editingRecord.capacity" 
            style="width: 100%"></el-input-number>
          </template>
        </el-table-column>
        <el-table-column label="价格" width="100">
          <template #default="item">
            <el-input size="small" v-model="item.row.price"></el-input>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="80">
          <template #default="item">
            <el-button type="danger" size="small" @click="deleteTime(item)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="detailTitle">场地管理员</div>
      <el-select multiple filterable reserve-keyword placeholder="管理员ID或名称" 
        v-model="venueAdmins">
          <el-option v-for="admin in adminOptions" :label="admin.id + ' ' + admin.name"
          :value="admin.id"></el-option>
      </el-select>
    </div>
    <template #footer>
      <el-button v-if="dialogMode === 'edit'" type="primary" @click="handleEdit">确定</el-button>
      <el-button v-else-if="dialogMode === 'create'" type="primary" @click="handleCreate">确定</el-button>
      <el-button @click="exitConfirmDialog = true">取消</el-button>
    </template>
  </el-dialog>
  <!-- 确认提示 -->
  <el-dialog v-model="exitConfirmDialog" title="退出确认">
    <div>确定退出编辑模式吗？未保存的更改将丢失！</div>
    <template #footer>
      <el-button type="danger" @click="exitConfirmDialog = false; emit('closeModal')">确认</el-button>
      <el-button @click="exitConfirmDialog = false">取消</el-button>
    </template>
  </el-dialog>
  <!-- 错误提示 -->
  <el-dialog v-model="errDialog" title="编辑失败">
    <div>{{ errMsg }}</div>
    <div v-if="dialogMode === 'create' && resVenueId">
      <div>场地ID：{{ resVenueId }}</div>
    </div>
    <template #footer>
      <el-button type="primary" @click="errDialog = false">确定</el-button>
    </template>
  </el-dialog>
  <el-dialog v-model="successDialog" title="编辑成功">
    <div v-if="dialogMode === 'create'">
      <div>成功创建场地</div>
      <div>场地ID：{{ resVenueId }}</div>
    </div>
    <div v-else>
      <div>成功编辑场地</div>
    </div>
    <template #footer>
      <el-button type="primary" @click="successDialog = false; emit('closeModal')">确定</el-button>
    </template>
  </el-dialog>
</template>

<style scoped>
.detailTitle{
  font-size: 18px;
  font-weight: 700;
  padding-top: 5px;
  padding-bottom: 5px;
  margin-top: 10px;
  margin-bottom: 10px;
  border-bottom: 1px solid black;
}

.detailLine{
  display: flex;
  line-height: 3em;
  align-items: center;
}

.detailLabel{
  width: 100px;
  font-weight: 700;
}

.dialogContent{
  height: 75vh;
  overflow: auto;
}

.numberInput{
  margin-left: 0;
}

.openDateSelection{
  display: flex;
  justify-content: center;
}

.timeSelect{
  width: 300px;
}

.addTimeButton{
  margin-left: auto;
}

:deep(.el-picker-width100pr .el-input__wrapper){
  width: 100%;
}

.uploadItem{
  display: flex;
  justify-content: center;
}

</style>