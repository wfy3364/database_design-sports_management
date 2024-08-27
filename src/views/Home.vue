<script setup>
import convertTime from '@/apis/utils';
import { useRouter } from 'vue-router';
import { ref } from 'vue'
import { storeToRefs } from 'pinia';
import PublicNoticeModal from './components/PublicNoticeModal.vue';
import { useUserStore } from '@/stores/userStore';

const router = useRouter();
const userStore = useUserStore();
const { userId, userName, adminType, adminPermission } = storeToRefs(userStore);
console.log(userId.value);
console.log(userName.value);
console.log(adminType.value);
console.log(adminPermission.value);

// 此处用常量数组暂时模拟从后端获取到的数据
const publicNoticeData = [{
  id: 1,
  title: "公告标题1",
  content: "这里是公告内容",
  time: new Date('18 August, 2024 18:00'),
  venues: [{ id: 1, name: '场地1'}],
  adminName: "张三",
},{
  id: 2,
  title: "长标题测试，这个公告的标题很长",
  content: "标题很长，但是公告内容不知道该写什么",
  time: new Date('18 August, 2024 19:00'),
  venues: [{ id: 2, name: '场地2'}],
  adminName: "张三",
}];

const userNoticeData = [{
  id: 1,
  title: "通知标题1",
  time: "2024-08-18",
}];

const venueData = [{
  id: 1,
  name: "场地1",
  img: "", // 此处放场地图片的url
  type: "羽毛球",
  capacity: 100,
  state: 0,
}, {
  id: 2,
  name: "场地2",
  img: "",
  type: "篮球",
  capacity: 50,
  state: 1,
}, {
  id: 3,
  name: "场地3",
  img: "",
  type: "乒乓球",
  capacity: 100,
  state: 2,
}, {
  id: 4,
  name: "场地4",
  img: "",
  type: "abc",
  capacity: 100,
  state: 0,
}];

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

function viewVenueDetail(venue){
  router.push("AdminVenueDetail");
  console.log(venue);
}

function changeRoute(path){
  router.push(path);
}


</script>

<template>
  <div class="AdminHome">
    <div class="LargeCard">
      <div class="CardHeader">
        <div class="CardTitle">公告管理</div>
        <el-button class="CardButton" size="small" 
          @click="changeRoute('/PublicNotice')">更多</el-button>
      </div>
      <div class="NoticeContent" v-for="publicNotice in publicNoticeData" >
        <div class="NoticeItem">
          <el-tooltip effect="light" placement="bottom" :content="publicNotice.title">
            <div class="NoticeTitle" @click="viewPublicNoticeDetail(publicNotice, 'view')">
              {{ publicNotice.title }}</div>
          </el-tooltip>
          <div class="NoticeTime">{{ convertTime(publicNotice.time) }}</div>
          <div class="NoticeEdit" @click="viewPublicNoticeDetail(publicNotice, 'edit')">编辑</div>
          <div class="NoticeDelete">删除</div>
        </div>
      </div>
    </div>
    <div class="LargeCard">
      <div class="CardHeader">
        <div class="CardTitle">个人通知</div>
        <el-button class="CardButton" size="small"
          @click="changeRoute('/AdminNotice')">更多</el-button>
      </div>
      <div class="NoticeContent" v-for="userNotice in userNoticeData">
        <div class="NoticeItem">
          <div class="NoticeTitle">{{ userNotice.title }}</div>
        </div>
      </div>
    </div>
    <div class="VenueCard">
      <div class="CardHeader">
        <div class="CardTitle">场地总览</div>
        <el-button class="CardButton" size="small"
          @click="changeRoute('/AdminVenue')">更多</el-button>
      </div>
      <div class="VenueContent">
        <div class="VenueItem" v-for="venue in venueData" @click="viewVenueDetail(venue)">
          <img class="VenueImg" :src="venue.img" :alt="venue.name">
          <div class="VenueText">名称：{{ venue.name }}</div>
          <div class="VenueText">类型：{{ venue.type }}</div>
          <div class="VenueText">容量：{{ venue.capacity }}</div>
          <div class="VenueText">
            <span>状态：</span>
            <span v-if="venue.state === 0" style="color: green">开放</span>
            <span v-if="venue.state === 1" style="color: red">关闭</span>
            <span v-if="venue.state === 2" style="color: orange">保养</span>
          </div>
        </div>
      </div>
    </div>
  </div>
  <PublicNoticeModal v-if="showPublicNotice" :mode="PublicNoticeMode"
    :notice="SelectedPublicNotice" @closeModal="closePublicNoticeDetail"
    @editModal="switchEditMode"></PublicNoticeModal>
</template>

<style>

.AdminHome{
  display: flex;
  justify-content: space-evenly;
  flex-wrap: wrap;
}

.LargeCard{
  display: flex;
  flex-direction: column;
  margin-top: 10px;
  margin-bottom: 10px;
  padding: 10px;
  width: 45%;
  height: 250px;
  border-radius: 5px;
  background-color: white;
}

.CardHeader{
  display: flex;
  justify-content: center;
  padding-bottom: 10px;
  border-bottom: 1px solid;
}

.CardTitle{
  margin-left: 5px;
  margin-right: auto;
  font-size: 18px;
  font-weight: 700;
}

.CardButton{
  margin-right: 5px;
  margin-left: auto;
  margin-top: 5px;
  margin-bottom: 5px;
  height: 20px;
}

.NoticeContent{
  display: flex;
  flex-direction: column;
  line-height: 30px;
}

.NoticeItem{
  display: flex;
  border-bottom: 1px solid lightgray;
  padding-left: 5px;
}

.NoticeTitle{
  flex: 5;
  margin-right: 5px;
  overflow: hidden;
  text-wrap: nowrap;
  text-overflow: ellipsis;
}

.NoticeTitle:hover{
  color: blue;
  text-decoration: underline;
  cursor: pointer;
}

.NoticeTime{
  flex: 4;
  margin-right: 5px;
  overflow: hidden;
  text-wrap: nowrap;
  text-overflow: ellipsis;
}

.NoticeEdit{
  color: skyblue;
  margin-left: 5px;
  margin-right: 5px;
  width: 30px;
}

.NoticeEdit:hover{
  text-decoration: underline;
  cursor: pointer;
}

.NoticeDelete{
  color: red;
  width: 30px;
  margin-left: 5px;
  margin-right: 5px;
}

.NoticeDelete:hover{
  text-decoration: underline;
  cursor: pointer;
}

.VenueCard{
  display: flex;
  flex-direction: column;
  border-radius: 5px;
  width: 93.3%;
  min-height: 200px;
  background-color: white;
  margin-top: 10px;
  margin-bottom: 10px;
  padding: 10px;
}

.VenueContent{
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  padding-top: 10px;
  padding-bottom: 10px;
}

.VenueItem{
  display: flex;
  flex-direction: column;
  margin: 10px;
  padding: 10px;
  border: 1px solid lightgray;
  border-radius: 3px;
}

.VenueItem:hover{
  background-color: #f6f6f6;
  cursor: pointer;
}

.VenueImg{
  width: 200px;
  height: 200px;
}

.VenueText{
  width: 200px;
  line-height: 25px;
}


</style>