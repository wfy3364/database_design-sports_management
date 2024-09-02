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
      <div v-if="!hasPermission" class="no-permission-message">
        <!-- 没有预约权限的界面样式 -->
        <div>您没有预约权限。</div>
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
                <label class="infoLabel">预约成员：</label>
                <div class="infoContent">
                  <div v-if="selectedMembers.length === 0" class="noSelectInfo">未选择任何人</div>
                  <div v-else>已选择 {{ selectedMembers.length }} 人</div>
                </div>
                <el-button size="small" class="infoOption" @click="showMemberModal = true" :disabled="!selectedGroup">选择成员</el-button>
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
                <div>{{ user.phone }}</div>
              </div>
              <!-- 新增预约人数输入框 -->
              <div class="infoLine">
                <div class="infoLabel">预约人数：</div>
                <el-input-number v-model="reservationCount" :min="1" :max="remainingCapacity" size="small"></el-input-number>
              </div>
            </div>
          </div>

          <!-- 场地信息 -->
          <div class="infoSection">
            <div class="infoTitle">场地信息</div>
            <div class="infoLine">
              <div class="infoLabel">场地：</div>
              <div class="infoContent">
                <div v-if="!selectedVenue" class="noSelectInfo">未选择场地</div>
                <div v-else>{{ selectedVenue.name }}</div>
              </div>
              <el-button size="small" class="infoOption" @click="showVenueModal = true">选择场地</el-button>
            </div>
            <div class="infoLine">
              <div class="infoLabel">时间段：</div>
              <div class="infoContent">
                <div v-if="!selectedTimeslot" class="noSelectInfo">未选择时间段</div>
                <div v-else>{{ selectedTimeslot.name }}</div>
              </div>
              <el-button size="small" class="infoOption" @click="showTimeslotModal = true" :disabled="!selectedVenue">选择时间</el-button>
            </div>
            <div class="infoLine">
              <div class="infoLabel">剩余容量：</div>
              <div>{{ remainingCapacity }}</div>
            </div>
          </div>

          <!-- 违约处理办法和违约次数显示 -->
          <div class="field">
            <el-checkbox v-model="agreedToTerms">我已阅读并同意<a href="/terms" target="_blank">违约处理办法</a></el-checkbox>
            <div class="penalty-info">本月违约次数：{{ penaltyCount }}</div>
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
          <el-table
            :data="filteredGroups"
            highlight-current-row
            @row-click="selectGroup"
            :current-row-key="selectedGroup ? selectedGroup.id : ''"
          >
            <el-table-column prop="name" label="团体名称"></el-table-column>
            <el-table-column prop="id" label="团体ID"></el-table-column>
          </el-table>
          <template v-slot:footer>
            <el-button :disabled="!selectedGroup" type="primary" @click="confirmGroupSelection">确认</el-button>
          </template>
        </el-dialog>

        <!-- 选择场地模态框 -->
        <el-dialog v-model="showVenueModal" title="选择场地">
          <el-input v-model="venueSearch" placeholder="搜索场地" size="small" class="mb-2">
            <template v-slot:append>
              <el-button @click="searchVenues">搜索</el-button>
            </template>
          </el-input>
          <el-table
            :data="filteredVenues"
            highlight-current-row
            @row-click="selectVenue"
            :current-row-key="selectedVenue ? selectedVenue.id : ''"
          >
            <el-table-column prop="name" label="场地名称"></el-table-column>
            <el-table-column prop="id" label="场地ID"></el-table-column>
          </el-table>
          <template v-slot:footer>
            <el-button :disabled="!selectedVenue" type="primary" @click="confirmVenueSelection">确认</el-button>
          </template>
        </el-dialog>

        <!-- 选择时间段模态框 -->
        <el-dialog v-model="showTimeslotModal" title="选择时间段">
          <el-input v-model="timeslotSearch" placeholder="搜索时间段" size="small" class="mb-2">
            <template v-slot:append>
              <el-button @click="searchTimeslots">搜索</el-button>
            </template>
          </el-input>
          <el-table
            :data="filteredTimeslots"
            highlight-current-row
            @row-click="selectTimeslot"
            :current-row-key="selectedTimeslot ? selectedTimeslot.id : ''"
          >
            <el-table-column prop="name" label="时间段"></el-table-column>
            <el-table-column prop="id" label="时间段ID"></el-table-column>
          </el-table>
          <template v-slot:footer>
            <el-button :disabled="!selectedTimeslot" type="primary" @click="confirmTimeslotSelection">确认</el-button>
          </template>
        </el-dialog>

        <!-- 选择成员模态框 -->
        <el-dialog v-model="showMemberModal" title="选择成员">
          <div class="mb-2">全选：</div>
          <el-table
            :data="filteredMembers"
            @selection-change="handleMemberSelection"
            :default-selection="[]"
          >
            <el-table-column type="selection" width="55"></el-table-column>
            <el-table-column prop="id" label="用户ID"></el-table-column>
            <el-table-column prop="nickname" label="用户昵称"></el-table-column>
          </el-table>
          <template v-slot:footer>
            <el-button :disabled="selectedMembers.length === 0" type="primary" @click="confirmMemberSelection">确认</el-button>
          </template>
        </el-dialog>

      </div>
    </div>
  </div>
</template>


<script setup>
import { ref, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
// import { getVenueDetails, getTimeslotDetails, fetchAllVenues, fetchAllTimeslots } from '@/api'; // 引入API接口

const user = ref({
  id: 1,
  name: '张三',
  phone: '13800000000', // 模拟联系电话字段
  hasPermission: true,
});

const userGroups = ref([
  { id: 1, name: '足球俱乐部' },
  { id: 2, name: '篮球俱乐部' },
]);

const isLoggedIn = ref(true);
const hasPermission = ref(user.value.hasPermission);
const reservationType = ref('individual');
const reservationCount = ref(1); // 用于存储预约人数
const selectedGroup = ref(null);
const selectedVenue = ref(null);
const selectedTimeslot = ref(null); // 初始化为 null 表示未选择时间段
const venueName = ref('');
const remainingCapacity = ref(5); // 模拟剩余容量
const agreedToTerms = ref(false);
const penaltyCount = ref(0); // 用于存储违约次数
const selectedMembers = ref([]); // 初始状态未选择任何成员
const showGroupModal = ref(false);
const showVenueModal = ref(false);
const showTimeslotModal = ref(false);
const showMemberModal = ref(false);

const allVenues = ref([]); // 存储所有场地数据
const allTimeslots = ref([]); // 存储所有时间段数据
const filteredGroups = ref([...userGroups.value]); // 初始化为所有团体
const filteredVenues = ref([]); // 初始化为所有场地
const filteredTimeslots = ref([]); // 初始化为所有时间段
const allMembers = ref([]); // 存储所有团体成员数据
const filteredMembers = ref([]); // 过滤后的成员列表

const router = useRouter();
const route = useRoute();

onMounted(async () => {
  const { venueId, timeslotId } = route.query;

  // 模拟数据
  const mockVenueData = {
    name: '羽毛球馆',
    remainingCapacity: 10
  };
  const mockTimeslotData = {
    name: '9:00-11:00'
  };

  if (venueId && timeslotId) {
    // 这部分需要引入实际后端接口
    // const venueData = await getVenueDetails(venueId);
    // const timeslotData = await getTimeslotDetails(timeslotId);
    
    // 使用模拟数据进行前端测试
    venueName.value = mockVenueData.name;
    selectedTimeslot.value = mockTimeslotData;
    remainingCapacity.value = mockVenueData.remainingCapacity;
  } else {
    venueName.value = '默认场地'; // 模拟默认场地名
    selectedTimeslot.value = null; // 初始化为 null 表示未选择时间段
    remainingCapacity.value = 5; // 模拟默认剩余容量
  }

  // 模拟后端获取的所有场地和时间段数据
  const mockVenues = [
    { id: 1, name: '篮球馆' },
    { id: 2, name: '足球场' },
    { id: 3, name: '网球场' }
  ];
  const mockTimeslots = [
    { id: 1, name: '8:00-10:00' },
    { id: 2, name: '10:00-12:00' },
    { id: 3, name: '13:00-15:00' }
  ];

  // 模拟后端获取的成员数据
  const mockMembers = [
    { id: 1, nickname: '张三', status: '正常' },
    { id: 2, nickname: '李四', status: '正常' },
    { id: 3, nickname: '王五', status: '待审核' },
    { id: 4, nickname: '赵六', status: '正常' }
  ];

  // 获取所有场地和时间段数据
  // allVenues.value = await fetchAllVenues(); // 伪代码，替换为实际 API 调用
  // allTimeslots.value = await fetchAllTimeslots(); // 伪代码，替换为实际 API 调用
  // allMembers.value = await fetchAllMembers(); // 伪代码，替换为实际 API 调用

  // 使用模拟数据进行前端测试
  allVenues.value = mockVenues;
  allTimeslots.value = mockTimeslots;
  allMembers.value = mockMembers;
  filteredMembers.value = allMembers.value.filter(member => member.status === '正常');

  // 初始化显示的列表
  filteredVenues.value = [...allVenues.value];
  filteredTimeslots.value = [...allTimeslots.value];

  // 确保 remainingCapacity 合理
  if (remainingCapacity.value < 1) {
    remainingCapacity.value = 1;
  }

  // 模拟获取违约次数
  penaltyCount.value = 2; // 设定一个违约次数，用于测试
});

const handleReservationTypeChange = () => {
  if (reservationType.value === 'individual') {
    selectedGroup.value = null;
    reservationCount.value = 1; // 初始化预约人数
  } else {
    selectedGroup.value = null; // 未选择前显示为未选择
    selectedMembers.value = []; // 初始化未选择任何成员
  }
};

const handleReservation = () => {
  // 检查场地是否已选择
  if (!selectedVenue.value) {
    alert('请先选择场地！');
    return;
  }

  // 检查时间段是否已选择
  if (!selectedTimeslot.value) {
    alert('请先选择时间段！');
    return;
  }

  // 如果预约类型为团体，检查团体选择和成员选择
  if (reservationType.value === 'group') {
    if (!selectedGroup.value) {
      alert('请先选择团体！');
      return;
    }

    // 检查是否选择了至少一个成员
    if (selectedMembers.value.length === 0) {
      alert('请先选择预约成员！');
      return;
    }
  }

  // 检查用户是否同意条款
  if (!agreedToTerms.value) {
    alert('请先阅读并同意违约处理办法');
    return;
  }

  // 如果所有检查通过，显示成功信息
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
  // 选择某一行时更新 selectedGroup
  selectedGroup.value = row;
};

const confirmGroupSelection = () => {
  // 点击确认按钮后关闭模态框并保存选择
  showGroupModal.value = false;
  filteredMembers.value = allMembers.value.filter(member => member.status === '正常'); // 筛选正常成员
  selectedMembers.value = []; // 重置选择成员
};

const selectVenue = (row) => {
  selectedVenue.value = row;
};

const confirmVenueSelection = () => {
  // 点击确认按钮后关闭模态框并保存选择
  showVenueModal.value = false;
};

const selectTimeslot = (row) => {
  selectedTimeslot.value = row;
};

const confirmTimeslotSelection = () => {
  // 点击确认按钮后关闭模态框并保存选择
  showTimeslotModal.value = false;
};

const handleMemberSelection = (selection) => {
  selectedMembers.value = selection;
};

const confirmMemberSelection = () => {
  // 点击确认按钮后关闭模态框并保存选择
  showMemberModal.value = false;
};
</script>



<style scoped>
.reservation-page {
  max-width: 800px;
  margin: 20px auto;
  padding: 20px;
  background-color: #f9f9f9; /* 背景颜色为淡灰色，保持清新感 */
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
  background-color: #fff; /* 信息卡片背景颜色为纯白色 */
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
  background-color: #fff; /* 使背景为白色 */
  border-radius: 5px;
  font-size: 14px;
  text-align: center; /* 文本居中 */
  border: 1px solid #ddd; /* 添加边框，使其与 infoSection 保持一致 */
}

.field label {
  display: flex;
  align-items: center;
  justify-content: center; /* 复选框和文字居中 */
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

.penalty-info {
  margin-top: 10px;
  color: #666;
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

.no-permission-message {
  display: flex;
  justify-content: center;
  font-size: 18px;
  color: #aaa;
  width: 100%;
  margin-top: auto;
  margin-bottom: auto;
}
</style>
