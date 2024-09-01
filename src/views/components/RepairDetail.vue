<script setup>

import { ref, computed, onMounted } from 'vue';
import { convertTime, judgeState } from '@/apis/utils';
import { useUserStore } from '@/stores/userStore';
import { storeToRefs } from 'pinia';

const detailDialog = ref(true);
const editingRecord = ref(null);
const exitConfirmDialog = ref(false);
const errDialog = ref(false);
const errMsg = ref('');
const props = defineProps({
  dialogMode: String,
  curRecord: {
    id: String,
    deviceId: String,
    deviceName: String,
    venueId: String,
    venueName: String,
    start_time: Date,
    end_time: Date,
    description: String,
    state: Number,
  }
});

const emit = defineEmits(['closeModal', 'editModal']);

const userStore = useUserStore();
const { adminType, adminPermission } = storeToRefs(userStore);

const dialogTitle = {
  'view': '维修详情',
  'edit': '编辑维修记录',
  'create': '添加维修记录',
}

const allDevices = [{
  id: '1',
  name: '设备1',
  state: '正常',
  introTime: '2024-09-01T12:00:00',
  venueId: '1',
  venueName: '场地1',
}];

const recordDevice = ref({
  venueId: '未选择设备',
  venueName: '未选择设备'
});

// 检查管理员编辑权限
const EditCheck = computed(() => {
  return adminType.value === 'system' ||
        (adminType.value === 'device' || adminType.value === 'venue-device') &&
        record.deviceId in adminPermission.value.device
});
// const EditCheck = ref(true);

onMounted(() => {
  if(props.dialogMode === 'edit'){
    editingRecord.value = {
      deviceId: props.curRecord.deviceId,
      start_time: props.curRecord.start_time,
      end_time: props.curRecord.end_time,
      description: props.curRecord.description,
      state: computed(() => judgeState(editingRecord.value.start_time, editingRecord.value.end_time)),
    };
  }
  else if(props.dialogMode === 'create'){
    editingRecord.value = {
      deviceId: '',
      start_time: new Date(),
      end_time: new Date(),
      description: '',
      state: computed(() => judgeState(editingRecord.value.start_time, editingRecord.value.end_time)),
    }
  }
});

function selectDevice(deviceId){
  recordDevice.value = allDevices.filter((device) => {
    return device.id === deviceId;
  })[0] || {
    venueId: '未选择设备',
    venueName: '未选择设备'
  };
}

function dialogExitConfirm(){
  if(props.dialogMode === 'view'){
    // detailDialog.value = false;
    emit('closeModal');
    return;
  }
  exitConfirmDialog.value = true;
}

function validateEdit(){
  if(!editingRecord.value.deviceId){
    errMsg.value = '请选择维修设备';
    errDialog.value = true;
    return false;
  }
  if(editingRecord.value.start_time.getTime() >= editingRecord.value.end_time.getTime()){
    errMsg.value = '维修结束时间不能早于维修开始时间';
    errDialog.value = true;
    return false;
  }
  return true;
}

function handleEdit(){
  if(!validateEdit()){
    return;
  }
}

function handleCreate(){
  if(!validateEdit()){
    return;
  }
}


</script>

<template>
  <!-- 详细信息对话框 -->
  <el-dialog v-model="detailDialog" :title="dialogTitle[dialogMode]" align-center :before-close="dialogExitConfirm">
    <div class="dialogContent">
      <div class="detailTitle">基本信息</div>
      <div v-if="dialogMode === 'view' || dialogMode === 'edit'">
        <div class="detailLine">
          <div class="detailLabel">记录编号：</div>
          <div> {{ curRecord.id }} </div>
        </div>
        <div class="detailLine">
          <div class="detailLabel">设备编号：</div>
          <div> {{ curRecord.deviceId }} </div>
        </div>
        <div class="detailLine">
          <div class="detailLabel">设备名称：</div>
          <div> {{ curRecord.deviceName }} </div>
        </div>
        <div class="detailLine">
          <div class="detailLabel">场地编号：</div>
          <div> {{ curRecord.venueId }} </div>
        </div>
        <div class="detailLine">
          <div class="detailLabel">场地名称：</div>
          <div> {{ curRecord.venueName }} </div>
        </div>
      </div>
      <div v-else-if="dialogMode === 'create'">
        <div class="detailLine">
          <div class="detailLabel">维修设备：</div>
          <el-select filterable v-model="editingRecord.deviceId" size="small" width="1000" @change="selectDevice(editingRecord.deviceId)">
            <el-option v-for="device in allDevices" size="small" :value="device.id"
            :label="device.id + ' ' + device.name"></el-option>
          </el-select>
        </div>
        <div class="detailLine">
          <div class="detailLabel">场地编号：</div>
          <div> {{ recordDevice.venueId }} </div>
        </div>
        <div class="detailLine">
          <div class="detailLabel">场地名称：</div>
          <div> {{ recordDevice.venueName }} </div>
        </div>
      </div>
      <div v-if="dialogMode === 'view'" class="detailLine">
        <div class="detailLabel">维修状态：</div>
        <div v-if="curRecord.state === 0" style="color: green">已维修</div>
        <div v-if="curRecord.state === 1" style="color: orange">维修中</div>
        <div v-if="curRecord.state === 2" style="color: red">待维修</div>
        <div v-if="curRecord.state === 3" style="color: gray">未确定</div>
      </div>
      <div v-else-if="dialogMode === 'edit' || dialogMode === 'create'" class="detailLine">
        <div class="detailLabel">维修状态：</div>
        <div v-if="editingRecord.state === 0" style="color: green">已维修</div>
        <div v-if="editingRecord.state === 1" style="color: orange">维修中</div>
        <div v-if="editingRecord.state === 2" style="color: red">待维修</div>
        <div v-if="editingRecord.state === 3" style="color: gray">未确定</div>
      </div>
      <div class="detailTitle">时间信息</div>
      <div class="detailLine">
        <div class="detailLabel">开始时间：</div>
        <div v-if="dialogMode === 'view'"> {{ convertTime(curRecord.start_time) }} </div>
        <el-date-picker v-else-if="dialogMode === 'edit' || dialogMode === 'create'"
        type="datetime" size="small" v-model="editingRecord.start_time"></el-date-picker>
      </div>
      <div class="detailLine">
        <div class="detailLabel">结束时间：</div>
        <div v-if="dialogMode === 'view'"> {{ convertTime(curRecord.end_time) }} </div>
        <el-date-picker v-else-if="dialogMode === 'edit' || dialogMode === 'create'"
        type="datetime" size="small" v-model="editingRecord.end_time"></el-date-picker>
      </div>
      <div class="detailTitle">维修描述</div>
      <div v-if="dialogMode === 'view'"> {{ curRecord.description }}</div>
      <el-input v-else-if="dialogMode === 'edit' || dialogMode === 'create'"
      type="textarea" v-model="editingRecord.description" placeholder="请输入维修描述"></el-input>
    </div>
    <template #footer>
      <div v-if="dialogMode === 'view'">
        <el-button type="primary" @click="emit('closeModal')">确定</el-button>
        <el-button v-if="EditCheck" @click="emit('editModal')">编辑</el-button>
      </div>
      <div v-else-if="dialogMode === 'edit' || dialogMode === 'create'">
        <el-button v-if="dialogMode === 'edit'" type="primary" @click="handleEdit">确定</el-button>
        <el-button v-else-if="dialogMode === 'create'" type="primary" @click="handleCreate">确定</el-button>
        <el-button v-if="EditCheck" @click="exitConfirmDialog = true">取消</el-button>
      </div>
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
    {{ errMsg }}
    <template #footer>
      <el-button type="primary" @click="errDialog = false">确定</el-button>
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
  line-height: 2em;
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

</style>