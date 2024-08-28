<template>
  <div class="reservation-page">
    <div class="reservationTitle">场地预约</div>

    <!-- 检查用户是否登录 -->
    <div v-if="!isLoggedIn">
      <p>您尚未登录，请先登录。</p>
      <router-link to="/login">前往登录页面</router-link>
    </div>

    <!-- 用户已登录且有预约权限时显示预约表单 -->
    <div v-else>
      <div v-if="!hasPermission">
        <p>您没有预约权限。</p>
      </div>
      <div v-else>
        <form @submit.prevent="handleReservation">
          
          <!-- 选择预约类型 -->
          <div class="infoSection">
            <div class="infoTitle">预约信息</div>
            <div class="infoLine">
              <label class="infoLabel">预约类型：</label>
              <el-radio-group v-model="reservationType" @change="handleReservationTypeChange">
                <el-radio-button size="small" value="individual">个人</el-radio-button>
                <el-radio-button size="small" :disabled="userGroups.length == 0" value="group">团体</el-radio-button>
              </el-radio-group>
            </div>

            <!-- 显示团体列表（仅当选择团体时） -->
            <div v-if="reservationType === 'group'">
              <div class="infoLine">
                <label class="infoLabel">预约团体：</label>
                <div class="infoContent">
                  <div v-if="!selectedGroup" class="noSelectInfo">未选择团体</div>
                  <div v-else>{{ selectedGroup.name }}</div>
                </div>
                <el-button size="small" class="infoOption" @click="showGroupModal = true">选择团体</el-button>
              </div>
              <div class="infoLine">
                <label class="infoLabel">团体人数：</label>
                <el-input v-model="groupSize" size="small"></el-input>
              </div>
            </div>

            <!-- 个人预约信息 -->
            <div v-if="reservationType === 'individual'">
              <div class="infoLine">
                <div class="infoLabel">用户ID：</div>
                <div>{{ user.id }}</div>
              </div>
              <div class="infoLine">
                <div class="infoLabel">用户名：</div>
                <div>{{ user.name }}</div>
              </div>
              <div class="infoLine">
                <div class="infoLabel">联系电话：</div>
                <el-input v-model="user.phone" size="small"></el-input>
              </div>
            </div>
          </div>

          <!-- 场地信息 -->
          <div class="infoSection">
            <div class="infoTitle">场地信息</div>
            <div class="infoLine">
              <div class="infoLabel">场地：</div>
              <div class="infoContent">
                <div v-if="venueName === ''" class="noSelectInfo">未选择场地</div>
                <div v-else>{{ venueName }}</div>
              </div>
              <el-button size="small" class="infoOption" @click="showVenueModal = true">选择场地</el-button>
            </div>
            <div class="infoLine">
              <div class="infoLabel">时间段：</div>
              <div class="infoContent">
                <div v-if="selectedTimeslot === ''" class="noSelectInfo">未选择时间段</div>
                <div v-else>{{ selectedTimeslot }}</div>
              </div>
              <el-button size="small" class="infoOption" @click="showTimeslotModal = true" :disabled="venueName === ''">选择时间</el-button>
            </div>
            <div class="infoLine">
              <div class="infoLabel">剩余容量：</div>
              <div>{{ remainingCapacity }}</div>
            </div>
          </div>

          <!-- 违约处理办法 -->
          <div class="field">
            <label>
              <input type="checkbox" v-model="agreedToTerms" />
              我已阅读并同意 <a href="/terms" target="_blank">违约处理办法</a>
            </label>
          </div>

          <!-- 预约和取消按钮 -->
          <div class="buttons">
            <el-button type="primary" @click="handleReservation" :disabled="!agreedToTerms">预约</el-button>
            <el-button type="button" @click="cancelReservation">取消</el-button>
          </div>

        </form>

        <!-- 选择团体模态框 -->
        <el-dialog v-model="showGroupModal" title="选择团体">
          <el-input v-model="groupSearch" placeholder="搜索团体" size="small" class="mb-2">
            <template v-slot:append>
              <el-button @click="searchGroups">搜索</el-button>
            </template>
          </el-input>
          <el-table :data="filteredGroups" @row-click="selectGroup">
            <el-table-column prop="name" label="团体名称"></el-table-column>
            <el-table-column prop="id" label="团体ID"></el-table-column>
          </el-table>
          <template v-slot:footer>
            <el-button @click="showGroupModal = false">取消</el-button>
          </template>
        </el-dialog>

        <!-- 选择场地模态框 -->
        <el-dialog v-model="showVenueModal" title="选择场地">
          <el-input v-model="venueSearch" placeholder="搜索场地" size="small" class="mb-2">
            <template v-slot:append>
              <el-button @click="searchVenues">搜索</el-button>
            </template>
          </el-input>
          <el-table :data="filteredVenues" @row-click="selectVenue">
            <el-table-column prop="name" label="场地名称"></el-table-column>
            <el-table-column prop="id" label="场地ID"></el-table-column>
          </el-table>
          <template v-slot:footer>
            <el-button @click="showVenueModal = false">取消</el-button>
          </template>
        </el-dialog>

        <!-- 选择时间段模态框 -->
        <el-dialog v-model="showTimeslotModal" title="选择时间段">
          <el-input v-model="timeslotSearch" placeholder="搜索时间段" size="small" class="mb-2">
            <template v-slot:append>
              <el-button @click="searchTimeslots">搜索</el-button>
            </template>
          </el-input>
          <el-table :data="filteredTimeslots" @row-click="selectTimeslot">
            <el-table-column prop="name" label="时间段"></el-table-column>
            <el-table-column prop="id" label="时间段ID"></el-table-column>
          </el-table>
          <template v-slot:footer>
            <el-button @click="showTimeslotModal = false">取消</el-button>
          </template>
        </el-dialog>

      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
//import { getVenueDetails, getTimeslotDetails, fetchAllVenues, fetchAllTimeslots } from '@/api'; // 引入API接口

const user = ref({
  id: 1,
  name: '张三',
  phone: '', // 新增联系电话字段
  hasPermission: true,
});

const userGroups = ref([
  { id: 1, name: '足球俱乐部' },
  { id: 2, name: '篮球俱乐部' },
]);

const isLoggedIn = ref(true);
const hasPermission = ref(user.value.hasPermission);
const reservationType = ref('individual');
const selectedGroup = ref(null);
const selectedTimeslot = ref('');
const venueName = ref('');
const remainingCapacity = ref(0); // 新增剩余容量
const agreedToTerms = ref(false);

const groupSize = ref(0); // 团体人数
const groupSearch = ref(''); // 团体搜索关键字
const venueSearch = ref(''); // 场地搜索关键字
const timeslotSearch = ref(''); // 时间段搜索关键字

const showGroupModal = ref(false);
const showVenueModal = ref(false);
const showTimeslotModal = ref(false);

const allVenues = ref([]); // 存储所有场地数据
const allTimeslots = ref([]); // 存储所有时间段数据
const filteredGroups = ref([...userGroups.value]); // 初始化为所有团体
const filteredVenues = ref([]); // 初始化为所有场地
const filteredTimeslots = ref([]); // 初始化为所有时间段

const router = useRouter();
const route = useRoute();

onMounted(async () => {
  const { venueId, timeslotId } = route.query;
  if (venueId && timeslotId) {
    //这部分需要引入实际后端接口
    //const venueData = await getVenueDetails(venueId);
    //const timeslotData = await getTimeslotDetails(timeslotId);
    //venueName.value = venueData.name;
   // selectedTimeslot.value = timeslotData.name;
    //remainingCapacity.value = venueData.remainingCapacity;
  } else {
    venueName.value = '';
    selectedTimeslot.value = '';
  }

  // 获取所有场地和时间段数据
  //allVenues.value = await fetchAllVenues(); // 伪代码，替换为实际 API 调用
  //allTimeslots.value = await fetchAllTimeslots(); // 伪代码，替换为实际 API 调用

  // 初始化显示的列表
  filteredVenues.value = [...allVenues.value];
  filteredTimeslots.value = [...allTimeslots.value];
});

const handleReservationTypeChange = () => {
  if (reservationType.value === 'individual') {
    selectedGroup.value = null;
  } else if (userGroups.value.length > 0) {
    selectedGroup.value = userGroups.value[0];
  }
};

const handleReservation = () => {
  if (!agreedToTerms.value) {
    alert('请先阅读并同意违约处理办法');
    return;
  }
  alert('预约成功！');
};

const cancelReservation = () => {
  router.push('/VenueBrowser');
};

// 模态框功能

// 搜索团体逻辑
const searchGroups = () => {
  if (groupSearch.value.trim() === '') {
    // 如果搜索框为空，则显示所有团体
    filteredGroups.value = [...userGroups.value];
  } else {
    // 根据搜索关键字进行过滤
    filteredGroups.value = userGroups.value.filter(group =>
      group.name.includes(groupSearch.value.trim())
    );
  }
};

// 搜索场地逻辑
const searchVenues = () => {
  if (venueSearch.value.trim() === '') {
    // 如果搜索框为空，则显示所有场地
    filteredVenues.value = [...allVenues.value];
  } else {
    // 根据搜索关键字进行过滤
    filteredVenues.value = allVenues.value.filter(venue =>
      venue.name.includes(venueSearch.value.trim())
    );
  }
};

// 搜索时间段逻辑
const searchTimeslots = () => {
  if (timeslotSearch.value.trim() === '') {
    // 如果搜索框为空，则显示所有时间段
    filteredTimeslots.value = [...allTimeslots.value];
  } else {
    // 根据搜索关键字进行过滤
    filteredTimeslots.value = allTimeslots.value.filter(timeslot =>
      timeslot.name.includes(timeslotSearch.value.trim())
    );
  }
};

const selectGroup = (row) => {
  selectedGroup.value = row;
  showGroupModal.value = false;
};

const selectVenue = (row) => {
  venueName.value = row.name;
  showVenueModal.value = false;
};

const selectTimeslot = (row) => {
  selectedTimeslot.value = row.name;
  showTimeslotModal.value = false;
};
</script>

<style scoped>
.reservation-page {
  max-width: 800px;
  margin: 20px auto;
  padding: 20px;
  background-color: #f9f9f9;
  border-radius: 10px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.reservationTitle {
  font-size: 24px;
  font-weight: bold;
  text-align: center;
  color: #333;
  margin-bottom: 20px;
}

.infoSection {
  margin-bottom: 20px;
  padding: 15px;
  border: 1px solid #ddd;
  border-radius: 8px;
  background-color: #fff;
}

.infoTitle {
  font-size: 18px;
  font-weight: bold;
  color: #444;
  margin-bottom: 10px;
  border-bottom: 1px solid #ddd;
  padding-bottom: 5px;
}

.infoLine {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
}

.infoLabel {
  flex: 0 0 100px;
  font-size: 14px;
  color: #555;
  font-weight: bold;
}

.infoContent {
  flex: 1;
  padding-left: 10px;
}

.noSelectInfo {
  color: #999;
  font-style: italic;
}

.infoOption {
  margin-left: 10px;
}

.field {
  margin-top: 20px;
  padding: 10px;
  background-color: #f0f0f0;
  border-radius: 5px;
  font-size: 14px;
}

.field label {
  display: flex;
  align-items: center;
}

.field input[type="checkbox"] {
  margin-right: 10px;
}

.field a {
  color: #409eff;
  text-decoration: none;
}

.field a:hover {
  text-decoration: underline;
}

.buttons {
  display: flex;
  justify-content: flex-end;
  margin-top: 20px;
}

.buttons .el-button {
  margin-left: 10px;
}

.dialog-footer {
  text-align: right;
  padding: 10px 0;
}

.mb-2 {
  margin-bottom: 10px;
}
</style>
