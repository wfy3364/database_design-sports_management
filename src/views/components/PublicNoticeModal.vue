<script setup>
import { ref, onMounted } from 'vue'
import { convertTime } from '@/apis/utils';

import { useUserStore } from '@/stores/userStore';
import { storeToRefs } from 'pinia';
import { ElMessage } from 'element-plus';

const props = defineProps({
  mode: String,
  notice: {
    announcementId: Number,
    title: String,
    content: String,
    venues: Array,
    time: Date,
    adminId: String,
    adminName: String,
  },
});

const emit = defineEmits(['closeModal', 'editModal']);

const dialogTitle = {
  'create': '发布新公告',
  'edit': '编辑公告',
  'view': props.notice?.title,
}

const showDialog = ref(true);
// const viewModal = ref(null);
const userStore = useUserStore();
// const { userId, adminType } = storeToRefs(userStore);
const userId = '1';
const adminType = 'system';
const confirmDialog = ref(false);
const dialogContent = ref('');
const confirmAction = ref('');
const modifiedNotice = ref(null);
const titleEmptyErr = ref('');
const contentEmptyErr = ref('');
const venueFilter = ref([]);
// console.log(venueFilter.value);
const venueOptions = [
  { id: 1, name: '场地1'},
  { id: 2, name: '场地2'},
];
const isLoading = ref(false);

function handleClose(){
  emit('closeModal');
}

function handleDelete(){

}

function dialogConfirm(){
  confirmDialog.value = false;
  if(confirmAction.value === 'delete'){
    handleDelete(); 
  }
  handleClose();
}

function confirmDialogClose(){
  confirmDialog.value = false;
  if(props.mode === 'delete'){
    emit('closeModal');
  }
}

function closeConfirm(){
  confirmDialog.value = true;
  dialogContent.value = '确认退出编辑吗？对公告的更改将会丢失！';
  confirmAction.value = 'exit';
}

function deleteConfirm(){
  confirmDialog.value = true;
  dialogContent.value = '确认删除该公告吗？';
  confirmAction.value = 'delete';
}

function switchEdit(){
  emit('editModal');
}

function errDisplay(msg, val){
  ElMessage.error('发布失败');
  msg.value = val;
}

function submitEdit(){
  if(!validateEdit()){
    return;
  }
}

function submitCreate(){
  if(!validateEdit()){
    return;
  }
}

function validateEdit(){
  titleEmptyErr.value = '';
  contentEmptyErr.value = '';
  if(!modifiedNotice.value.title){
    errDisplay(titleEmptyErr, '公告标题不能为空');
    return false;
  }
  if(!modifiedNotice.value.content){
    errDisplay(contentEmptyErr, '公告内容不能为空');
    return false;
  }
  return true;
}

onMounted(() => {
  // showDialog.value = true;
  if(props.mode === 'delete'){
    deleteConfirm();
  }
  else if(props.mode === 'edit'){
    modifiedNotice.value = props.notice;
    venueFilter.value = props.notice.venues.map(obj => obj.id);
  }
  else if(props.mode === 'create'){
    modifiedNotice.value = {
      title: '',
      content: '',
      venues: [],
    }
  }
});

</script>

<template>
  <el-dialog v-if="mode !== 'delete'" :title="dialogTitle[mode]" v-model="showDialog" 
  align-center :before-close="handleClose" v-loading="isLoading">
    <div class="modalContent" v-if="mode === 'view'" ref="viewModal">
      <div class="noticeContent">
        <div class="contentArea">{{ notice.content }}</div>
        <div class="infoLine">
          <div class="noticeInfo">公告ID：</div>
          {{ notice.announcementId }}
        </div>
        <div class="infoLine">
          <div class="noticeInfo">发布时间：</div>
          {{ convertTime(notice.time) }}
        </div>
        <div class="infoLine">
          <div class="noticeInfo">涉及场地：</div>
          <el-tag v-for="venue in notice.venues">{{ venue.name }}</el-tag>
        </div>
        <div class="infoLine">
          <div class="noticeInfo">公告管理员：</div>
          {{ notice.adminName }}
        </div>
      </div>
    </div>
    <div v-else-if="mode === 'edit' || mode === 'create'" class="modalContent">
      <div class="infoLine" v-if="mode === 'edit'">
        <div class="noticeInfo">公告ID：</div>
        {{ notice.announcementId }}
      </div>
      <div class="editLine">
        <div class="noticeInfo">公告标题</div>
        <el-input v-model="modifiedNotice.title" placeholder="输入公告标题"></el-input>
      </div>
      <div class="errMsg">{{ titleEmptyErr }}</div>
      <div class="editLine">
        <div class="noticeInfo">公告内容</div>
        <el-input type="textarea" placeholder="输入公告内容" :rows="10" v-model="modifiedNotice.content"></el-input>
      </div>
      <div class="errMsg">{{ contentEmptyErr }}</div>
      <div class="editLine">
        <div class="noticeInfo">涉及场地</div>
        <el-select multiple filterable reserve-keyword placeholder="场地ID或名称" 
        v-model="venueFilter">
          <el-option v-for="venue in venueOptions" :label="venue.id + ' ' + venue.name"
          :value="venue.id"></el-option>
        </el-select>
      </div>
    </div>
    <template #footer>
      <div class="noticeControl" v-if="mode === 'view' && adminType !== 'normal' 
      && notice.adminId === userId">
        <el-button size="large" @click="switchEdit">编辑公告</el-button>
        <el-button size="large" type="danger" @click="deleteConfirm">删除公告</el-button>
      </div>
      <div class="noticeControl" v-else-if="mode === 'edit'">
        <el-button size="large" type="primary" @click="submitEdit">发布更改</el-button>
        <el-button size="large" @click="closeConfirm">取消更改</el-button>
        <el-button size="large" type="danger" @click="deleteConfirm">删除公告</el-button>
      </div>
      <div class="noticeControl" v-else-if="mode === 'create'">
        <el-button size="large" type="primary" @click="submitCreate">发布公告</el-button>
        <el-button size="large" @click="closeConfirm">取消发布</el-button>
      </div>
    </template>
  </el-dialog>
  <!-- 确认弹窗 -->
  <el-dialog title="确认提示" v-model="confirmDialog" :before-close="confirmDialogClose">
    <div class="confirmContent">{{ dialogContent }}</div>
    <div v-if="confirmAction === 'delete'">
      <div class="infoLine">
        <div class="noticeInfo">公告ID：</div>
        {{ notice.announcementId }}
      </div>
      <div class="infoLine">
        <div class="noticeInfo">公告原标题：</div>
        {{ notice.title }}
      </div>
    </div>
    <template #footer>
      <div>
        <el-button @click="confirmDialogClose">取消</el-button>
        <el-button type="primary" @click="dialogConfirm">确定</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<style scoped>

.modalContent {
  display: flex;
  flex-direction: column;
  background-color: white;
  padding: 20px;
  border-radius: 8px;
  max-width: 500px;
  width: 90%;
  /* height: 100vh; */
  height: 75vh;
  overflow: auto;
}

.editLine{
  display: flex;
  line-height: 2em;
  margin-top: 10px;
  margin-bottom: 10px;
}

.infoLine{
  display: flex;
  align-items: center;
  line-height: 2.2em;
}

.noticeInfo{
  width: 100px;
  font-weight: 700;
}

.noticeContent{
  margin-top: 10px;
  margin-bottom: 10px;
  /* text-indent: 2em; */
  height: calc(100vh - 92px - var(--el-component-size-large));
  overflow: auto;
}

.noticeControl{
  display: flex;
  justify-content: space-between;
  margin-top: auto;
  margin-bottom: 10px;
}

.contentArea{
  margin-top: 10px;
  margin-bottom: 20px;
}

.confirmContent{
  margin-bottom: 10px;
}

.errMsg{
  color: red;
  font-size: 12px;
  line-height: 1em;
  margin-left: 80px;
}

</style>