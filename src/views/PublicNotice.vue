<script setup>
import { Search } from '@element-plus/icons-vue';
import { ref, onMounted } from 'vue';
import PublicNoticeModal from './components/PublicNoticeModal.vue';
import { convertTime }  from '@/apis/utils'
import { useUserStore } from '@/stores/userStore';
import { storeToRefs } from 'pinia';
import { getAllPublicNotice, getPublicNoticeDetail } from '@/apis/requests';
import { ElMessage } from 'element-plus';

const MAXCONTENTLEN = 50;
const searchQuery = ref('');
const dateRange = ref([]);
const tableLoading = ref(false);

const userStore = useUserStore();
// const { userId, adminType } = storeToRefs(userStore)

const adminType = ref('system');
const userId = '2';

const venueFilter = ref('');
const venueOptions = [
  { id: 1, name: '场地1'},
  { id: 2, name: '场地2'},
];

const publicNoticeData = ref([
  {
    id: 1,
    title: '公告1',
    content: '这里是公告内容',
    venues: [{ id: 1, name: '场地1'}],
    time: new Date('25 August, 2024 12:00:00'),
    adminId: '2',
    adminName: '张三'
  },
  {
    id: 1,
    title: '公告2',
    content: '公告内容溢出测试：超过100字符；公告内容溢出测试：超过100字符；公告内容溢出测试：超过100字符；公告内容溢出测试：超过100字符；公告内容溢出测试：超过100字符；公告内容溢出测试：超过100字符；公告内容溢出测试：超过100字符；公告内容溢出测试：超过100字符；公告内容溢出测试：超过100字符；公告内容溢出测试：超过100字符；公告内容溢出测试：超过100字符；公告内容溢出测试：超过100字符；公告内容溢出测试：超过100字符；公告内容溢出测试：超过100字符；公告内容溢出测试：超过100字符；公告内容溢出测试：超过100字符；公告内容溢出测试：超过100字符；公告内容溢出测试：超过100字符；公告内容溢出测试：超过100字符；公告内容溢出测试：超过100字符；公告内容溢出测试：超过100字符；公告内容溢出测试：超过100字符；公告内容溢出测试：超过100字符；公告内容溢出测试：超过100字符；公告内容溢出测试：超过100字符；公告内容溢出测试：超过100字符；公告内容溢出测试：超过100字符；公告内容溢出测试：超过100字符；公告内容溢出测试：超过100字符；公告内容溢出测试：超过100字符；公告内容溢出测试：超过100字符；公告内容溢出测试：超过100字符；公告内容溢出测试：超过100字符；公告内容溢出测试：超过100字符；公告内容溢出测试：超过100字符；公告内容溢出测试：超过100字符；公告内容溢出测试：超过100字符；公告内容溢出测试：超过100字符；公告内容溢出测试：超过100字符；公告内容溢出测试：超过100字符；',
    venues: [{ id: 1, name: '场地1'}],
    time: new Date('25 August, 2024 12:00:00'),
    adminId: '1',
    adminName: '张三'
  },
  {
    id: 3,
    title: '公告3',
    content: '这里是公告内容，公告内容小于50字符测试',
    venues: [{ id: 1, name: '场地1'}],
    time: new Date('25 August, 2024 12:00:00'),
    adminId: '2',
    adminName: '张三'
  },
]);
const filteredNotice = ref(publicNoticeData.value);

async function getAllNotice(){
  tableLoading.value = true;
  await getAllPublicNotice(getFurtherInfo, getNoticeErr);
}

async function getFurtherInfo(res){
  if(res.length === 0){
    getNoticeSuccess([]);
    return;
  }
  const noticeIdList = res.map(item => item.id);
  const noticeAdmin = res.map(item => item.adminId);
  const resData = [];
  let curIndex = 0;
  const step = async (res) => {
    resData.push({...res, adminId: noticeAdmin[curIndex]});
    curIndex++;
    if(curIndex === noticeIdList.length){
      getNoticeSuccess(resData);
    }
    else{
      await getPublicNoticeDetail(noticeIdList[curIndex], step, getNoticeErr);
    }
  }
  await getPublicNoticeDetail(noticeIdList[0], step, getNoticeErr);
}

function getNoticeSuccess(res){
  publicNoticeData.value = res;
  filteredNotice.value = publicNoticeData.value;
  tableLoading.value = false;
}

function getNoticeErr(msg){
  ElMessage.error('获取公告失败');
  tableLoading.value = false;
}

onMounted(getAllNotice)

const showPublicNotice = ref(false);
const PublicNoticeMode = ref('');
const SelectedPublicNotice = ref(null);

function viewPublicNoticeDetail(notice, mode){
  PublicNoticeMode.value = mode;
  SelectedPublicNotice.value = notice;
  showPublicNotice.value = true;
}

function closePublicNoticeDetail(){
  showPublicNotice.value = false;
}

function switchEditMode(){
  PublicNoticeMode.value = 'edit';
}

function handleSearch(){
  filteredNotice.value = publicNoticeData.value;
  
  if (searchQuery.value) {
    filteredNotice.value = filteredNotice.value.filter(item => {
      const searchTerm = searchQuery.value.toLowerCase();
      return (item.id == searchTerm || item.title.toLowerCase().includes(searchTerm));
    });
  }

  if(dateRange.value.length > 0){
    const startTime = dateRange.value[0].getTime();
    const endTime = dateRange.value[1].getTime() + 3600 * 1000 * 24;
    filteredNotice.value = filteredNotice.value.filter(item => {
      return item.time.getTime() >= startTime && item.time.getTime() < endTime;
    });
  }

  if(venueFilter.value){
    filteredNotice.value = filteredNotice.value.filter(item => {
      return item.venues.map(venue => venue.id).includes(venueFilter.value);
    })
  }
}

function FilterReset(){
  filteredNotice.value = publicNoticeData.value;
  searchQuery.value = [];
  dateRange.value = [];
  venueFilter.value = '';
}

</script>


<template>
  <div class="PublicNotice">
    <div class="PublicNoticeTitle">公告列表</div>
    <div class="FilterArea">
      <div class="SearchArea">
        <el-input v-model="searchQuery" class="SearchBox" placeholder="公告ID或标题">
          <template #prefix>
            <el-icon><search /></el-icon>
          </template>
        </el-input>
      </div>
      <div class="FilterOption">
        <div class="FilterText">时间</div>
        <div>
          <el-date-picker v-model="dateRange" type="daterange" unlink-panels
          range-separator="到" start-placeholder="开始日期"
          end-placeholder="结束日期"/>
        </div>
      </div>
      <div class="FilterOption">
        <div class="FilterText">涉及场地</div>
        <div>
          <el-select class="venueSelect" v-model="venueFilter" filterable placeholder="场地ID或名称">
            <el-option v-for="venue in venueOptions" :value="venue.id" :label="venue.id + ' ' + venue.name">
            </el-option>
          </el-select>
        </div>
      </div>
      <div class="FilterControl">
        <el-button @click="handleSearch">确认筛选</el-button>
        <el-button @click="FilterReset">重置条件</el-button>
        <el-button class="newNoticeButton" v-if="adminType === 'system' || adminType === 'venue'"
        type="primary" @click="viewPublicNoticeDetail(null, 'create')">
          发布新公告
        </el-button>
      </div>
    </div>
    <el-table :data="filteredNotice" :show-overflow-tooltip="{ effect: 'light'}" v-loading="tableLoading">
      <el-table-column label="编号" prop="id" width="80" sortable></el-table-column>
      <el-table-column label="标题" prop="title" width="110" sortable></el-table-column>
      <el-table-column label="内容">
        <template #default="item">
          <div class="noticeContent" v-if="item.row.content.length > MAXCONTENTLEN">{{ item.row.content.substr(0, MAXCONTENTLEN) + '...' }}</div>
          <div class="noticeContent" v-else>{{ item.row.content }}</div>
        </template>
      </el-table-column>
      <el-table-column label="修改时间" width="140" sortable>
        <template #default="item">
          {{ convertTime(item.row.time) }}
        </template>
      </el-table-column>
      <el-table-column label="涉及场地" width="150">
        <template #default="item">
          <el-tag v-for="venue in item.row.venues">{{ venue.name }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="200">
        <template #default="item">
          <el-button size="small" @click="viewPublicNoticeDetail(item.row, 'view')">查看</el-button>
          <el-button size="small" v-if="adminType !== 'normal'" :disabled="userId !== item.row.adminId"
          @click="viewPublicNoticeDetail(item.row, 'edit')">编辑</el-button>
          <el-button size="small" v-if="adminType !== 'normal'" :disabled="userId !== item.row.adminId" 
          @click="viewPublicNoticeDetail(item.row, 'delete')" type="danger">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
  <PublicNoticeModal v-if="showPublicNotice" :mode="PublicNoticeMode"
    :notice="SelectedPublicNotice" @closeModal="closePublicNoticeDetail"
    @editModal="switchEditMode"></PublicNoticeModal>
</template>

<style scoped>
.PublicNotice{
  display: flex;
  flex-direction: column;
  border-radius: 5px;
  background-color: white;
  border: 1px solid lightgray;
  margin: 10px;
  /* max-width: 1200px; */
}

.PublicNoticeTitle{
  display: flex;
  justify-content: center;
  font-size: 20px;
  font-weight: 700;
  padding: 10px;
  border-bottom: 1px solid black;
}

.FilterArea{
  display: flex;
  flex-direction: column;
  padding: 10px;
  border-top: 1px solid lightgray;
  border-bottom: 1px solid lightgray;
}

.SearchArea{
  display: flex;
  margin-bottom: 10px;
  padding-left: 10px;
}

.FilterOption{
  display: flex;
  padding-left: 10px;
  margin-top: 10px;
  margin-bottom: 10px;
}

.FilterText{
  line-height: var(--el-component-size);
  margin-right: 20px;
}

.venueSelect{
  width: 320px;
  margin-right: 10px;
}

.FilterControl{
  display: flex;
  justify-content: center;
  margin-top: 10px;
}

.newNoticeButton{
  margin-left: auto;
}

.noticeContent{
  overflow: hidden;
  text-wrap: nowrap;
  text-overflow: ellipsis;
}

</style>