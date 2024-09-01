<script setup>
import { ref, onMounted } from 'vue'
import { convertTime } from '@/apis/utils';

const props = defineProps({
  mode: String,
  notice: {
    id: Number,
    title: String,
    content: String,
    venues: Array,
    time: Date,
    adminName: String,
  },
});

const emit = defineEmits(['closeModal', 'editModal']);

const viewModal = ref(null);
const adminType = ref('system');
const confirmDialog = ref(false);
const dialogContent = ref('');
const confirmAction = ref('');
const modifiedNotice = ref(props.notice);
const venueFilter = ref(props.notice.venues.map(obj => obj.id));
console.log(venueFilter.value);
const venueOptions = [
  { id: 1, name: '场地1'},
  { id: 2, name: '场地2'},
];

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

onMounted(() => {
  if(!adminType.value){
    viewModal.value.style.height = 'calc(100vh - 10px - var(--el-component-size-large))';
  }
})

</script>

<template>
  <div class="PublicNoticeModal">
    <div class="modal">
      <div class="modalContent" v-if="mode === 'view'" ref="viewModal">
        <div class="modalHeader">
          <div class="modalTitle">{{ notice.title }}</div>
          <el-button class="closeButton" type="danger" @click="handleClose">关闭</el-button>
        </div>
        <div class="noticeContent">
          <div>{{ notice.content }}</div>
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
        <div class="noticeControl" v-if="adminType != ''">
          <el-button size="large" @click="switchEdit">编辑公告</el-button>
          <el-button size="large" type="danger" @click="deleteConfirm">删除公告</el-button>
        </div>
      </div>
      <div v-else-if="mode === 'edit'" class="modalContent">
        <div class="modalHeader">
          <div class="modalTitle">编辑公告</div>
          <el-button class="closeButton" type="danger" @click="closeConfirm">关闭</el-button>
        </div>
        <div>
          <div class="editLine">
            <div class="noticeInfo">公告标题</div>
            <el-input v-model="modifiedNotice.title"></el-input>
          </div>
          <div class="editLine">
            <div class="noticeInfo">公告内容</div>
            <el-input type="textarea" :rows="10" v-model="modifiedNotice.content"></el-input>
          </div>
          <div class="editLine">
            <div class="noticeInfo">涉及场地</div>
            <el-select multiple filterable reserve-keyword placeholder="场地ID或名称" 
            v-model="venueFilter">
              <el-option v-for="venue in venueOptions" :label="venue.id + ' ' + venue.name"
              :value="venue.id"></el-option>
            </el-select>
          </div>
        </div>
        <div class="noticeControl">
          <el-button size="large" type="primary">发布更改</el-button>
          <el-button size="large" @click="closeConfirm">取消更改</el-button>
          <el-button size="large" type="danger" @click="deleteConfirm">删除公告</el-button>
        </div>
      </div>
      <el-dialog v-model="confirmDialog">
        <span>{{ dialogContent }}</span>
        <template #footer>
          <div class="dialog-footer">
            <el-button @click="confirmDialog = false">取消</el-button>
            <el-button type="primary" @click="dialogConfirm">确定</el-button>
          </div>
        </template>
      </el-dialog>
    </div>
  </div>

</template>

<style scoped>

.modal {
  display: flex;
  align-items: center;
  justify-content: center;
  position: fixed;
  z-index: 10;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.5);
}

.modalContent {
  display: flex;
  flex-direction: column;
  background-color: white;
  padding: 20px;
  border-radius: 8px;
  max-width: 500px;
  width: 90%;
  height: 100vh;
}

.modalTitle{
  display: flex;
  justify-content: center;
  position: relative;
  width: 50%;
  left: 25%;
  font-size: 20px;
  font-weight: 700;
  margin-bottom: 10px;
}

.modalHeader{
  display: flex;
  justify-content: center;
}

.closeButton{
  margin-left: auto;
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

</style>