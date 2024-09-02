<script setup>

import { ref, computed, onMounted } from 'vue';
import { dayjs } from 'element-plus';
import { convertTime } from '@/apis/utils';
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
    name: String,
    type: String,
    capacity: Number,
    address: String,
    description: String,
  },
});

const emit = defineEmits(['closeModal']);

const userStore = useUserStore();
const { adminType, adminPermission } = storeToRefs(userStore);

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

const sports = ref(['足球', '篮球', '网球', '羽毛球', '其它']);
const customType = ref('');

onMounted(() => {
  if(props.dialogMode === 'edit'){
    editingRecord.value = {
      name: props.curRecord.name,
      type: props.curRecord.type,
      capacity: props.curRecord.capacity,
      address: props.curRecord.address,
      description: props.curRecord.description,
    };
    editingTime.value = [{
      date: openDate.value,
      time: openTime.value.map(item => {
      return {
        id: item.id,
        period: [item.start_time, item.end_time],
        remain: item.remain,
        price: item.price,
      }})
    }];
  }
  else if(props.dialogMode === 'create'){
    editingRecord.value = {
      id: '',
      name: '',
      type: '',
      capacity: 10,
      address: '',
      description: '',
    }
  }
});

function setDate(val){
  openDate.value = dayjs(openDate.value).add(val, "day").format("YYYY-MM-DD");
  handleDateChange();
}

function handleDateChange(){
  for(let i = 0; i < editingTime.value.length; i++){
    if(editingTime.value[i].date === openDate.value){
      editingDateIndex.value = i;
      return;
    }
  }
  // 此处需要获取后端数据
  editingTime.value.push({
    date: openDate.value,
    time: [{
      id: '3',
      period: [],
      remain: 0,
      price: 10,
    }]
  });
  editingDateIndex.value = editingTime.value.length - 1;
}

function dialogExitConfirm(){
  if(props.dialogMode === 'view'){
    // detailDialog.value = false;
    emit('closeModal');
    return;
  }
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
      <el-table :data="editingTime[editingDateIndex].time">
        <el-table-column label="时间">
          <template #default="item">
            <el-time-picker size="small" class="timeSelect" arrow-control is-range 
            v-model="item.row.period" style="width: 100%;"></el-time-picker>
          </template>
        </el-table-column>
        <el-table-column label="剩余容量" width="120">
          <template #default="item">
            <el-input-number size="small" v-model="item.row.remain" :min="0" :max="curRecord.capacity" 
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
    </div>
    <template #footer>
      <el-button v-if="dialogMode === 'edit'" type="primary" @click="handleEdit">确定</el-button>
      <el-button v-else-if="dialogMode === 'create'" type="primary" @click="handleCreate">确定</el-button>
      <el-button v-if="EditCheck" @click="exitConfirmDialog = true">取消</el-button>
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


</style>