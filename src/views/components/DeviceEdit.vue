<script setup>

import { ref, computed, onMounted } from 'vue';
import { dayjs, ElMessage } from 'element-plus';
import { convertTime } from '@/apis/utils';
import { useUserStore } from '@/stores/userStore';
import { storeToRefs } from 'pinia';
import { 
  getAllVenues, createDevice,
  editDeviceInfo
} from '@/apis/requests';

const editingRecord = ref(null);
const exitConfirmDialog = ref(false);
const errDialog = ref(false);
const successDialog = ref(false);
const resDeviceId = ref('');
const errMsg = ref('');
const props = defineProps({
  dialogMode: String,
  curRecord: {
    id: String,
    name: String,
    state: String,
    introTime: Date,
    venueid: String,
    venuename: String, 
  },
});

const emit = defineEmits(['closeModal']);

const userStore = useUserStore();
const { userId } = storeToRefs(userStore);
const detailDialog = ref(true);

const dialogTitle = {
  'edit': '编辑设备信息',
  'create': '添加新设备',
}
const allVenue = ref([]);

onMounted(async () => {
  if(props.dialogMode === 'edit'){
    editingRecord.value = {
      id: props.curRecord.id,
      name: props.curRecord.name,
      venueid: props.curRecord.venueid,
    };
  }
  else if(props.dialogMode === 'create'){
    editingRecord.value = {
      name: '',
      venueid: '',
    };
  }
  getAllVenues(handleVenueData, handleGetVenueErr);
});

const handleVenueData = (res) => {
  allVenue.value = res.map(item => {
    return {
      id: item.venueId,
      name: item.name,
    }
  });
  console.log(allVenue.value);
}

const handleGetVenueErr = (msg) => {
  ElMessage.error('获取场地信息失败：' + msg);
}


function dialogExitConfirm(){
  // if(props.dialogMode === 'view'){
  //   // detailDialog.value = false;
  //   emit('closeModal');
  //   return;
  // }
  exitConfirmDialog.value = true;
}

function validateEdit(){
  if(!editingRecord.value.name){
    errMsg.value = '设备名称不能为空';
    errDialog.value = true;
    return false;
  }
  return true;
}

async function handleEdit(){
  if(!validateEdit()){
    return;
  }
  const deviceData = {
    equipmentId: editingRecord.value.id,
    equipmentName: editingRecord.value.name,
    venueId: editingRecord.value.venueid,
  }
  await editDeviceInfo(deviceData, createDeviceSuccess, createDeviceErr)
}

async function handleCreate(){
  if(!validateEdit()){
    return;
  }
  const deviceData = {
    adminId: userId.value,
    equipmentName: editingRecord.value.name,
    installationTime: new Date(),
    venueId: editingRecord.value.venueid,
  }
  await createDevice(deviceData, createDeviceSuccess, createDeviceErr)
}

function createDeviceSuccess(res){
  resDeviceId.value = res;
  successDialog.value = true;
}

function createDeviceErr(msg){
  errMsg.value = msg;
  errDialog.value = true;
}

</script>

<template>
  <!-- 详细信息对话框 -->
  <el-dialog v-model="detailDialog" :title="dialogTitle[dialogMode]" align-center :before-close="dialogExitConfirm">
    <div class="dialogContent">
      <div v-if="dialogMode === 'edit'">
        <div class="detailLine">
          <div class="detailLabel">设备编号：</div>
          <div> {{ curRecord.id }} </div>
        </div>
      </div>
      <div class="detailLine">
        <div class="detailLabel">设备名称：</div>
        <el-input v-model="editingRecord.name" placeholder="输入设备名称"></el-input>
      </div>
      <div class="detailLine">
        <div class="detailLabel">设备场地</div>
        <el-select filterable reserve-keyword placeholder="场地ID或名称" 
          v-model="editingRecord.venueid">
            <el-option v-for="venue in allVenue" :label="venue.id + ' ' + venue.name"
            :value="venue.id"></el-option>
        </el-select>
      </div>
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
      <div>成功创建设备</div>
      <div>设备ID：{{ resDeviceId }}</div>
    </div>
    <div v-else>
      <div>成功编辑设备</div>
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
  max-height: 75vh;
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