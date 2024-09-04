<template>
    <div>
      <header>
        <!-- <nav>
          <button v-if="!isLoggedIn" @click="goToLogin">登录</button>
        </nav> -->
      </header>
  
      <main>
        <div class="ReservationList">
          <div class="ReservationTitle">预约记录</div>
            <!-- <div class="search-bar">
              <input v-model="searchId" placeholder="根据预约ID搜索" />
              <input v-model="startDate" type="date" />
              <input v-model="endDate" type="date" />
              <button @click="searchAppointments">搜索</button>
            </div> -->
          <div v-if="!userCheck && !adminCheck" class="accessDeny">
            <div class="denyText">您没有权限查看预约记录</div>
          </div>
          <div v-else>
          <div class="FilterArea">
            
            <div class="FilterOption">
              <div class="FilterText">预约类型</div>
              <el-radio-group v-model="reservationTypeFilter" @change="reservationTypeChange">
                <el-radio-button value="2">全部</el-radio-button>
                <el-radio-button value="0">个人</el-radio-button>
                <el-radio-button value="1">团体</el-radio-button>
              </el-radio-group>
            </div>

            <div class="SearchArea">
              <el-radio-group v-model="searchType">
                <el-radio value="0">预约搜索</el-radio>
                <el-radio value="1">场地搜索</el-radio>
                <!-- <div v-if="isTeamSearch"> -->
                <el-radio value="2" :disabled="disableTeamSearch">团体搜索</el-radio>
                <!-- </div> -->
              </el-radio-group>
              <el-input v-model="searchContent" class="SearchBox" 
                :placeholder="searchPlaceholder[+searchType]">
                <template #prefix>
                  <el-icon><search /></el-icon>
                </template>
              </el-input>
            </div>

            <div class="FilterOption">
              <div class="FilterText">预约日期</div>
              <div>
                <el-date-picker v-model="dateRange" type="daterange" unlink-panels
                range-separator="到" start-placeholder="开始日期"
                end-placeholder="结束日期"/>
              </div>
            </div>

            <!-- 还需要添加的筛选选项：状态、类型 -->
            <!-- <div class="FilterOption">
              <div class="FilterText">操作时间</div>
              <div>
                <el-date-picker v-model="operationDateRangeFilter" type="daterange" unlink-panels
                range-separator="到" start-placeholder="开始日期"
                end-placeholder="结束日期"/>
              </div>
            </div> -->

            <div class="FilterOption">
              <div class="FilterText">预约状态</div>
              <el-radio-group v-model="statusFilter">
                <el-radio-button value="0">全部</el-radio-button>
                <el-radio-button value="1">已预约</el-radio-button>
                <el-radio-button value="2">已取消</el-radio-button>
                <el-radio-button value="3">已完成</el-radio-button>
                <el-radio-button value="4">违约</el-radio-button>
              </el-radio-group>
            </div>

            <div class="FilterControl">
              <el-button @click="handleSearch" type="primary">确认筛选</el-button>
              <el-button @click="FilterReset">重置条件</el-button>
            </div>
          </div>

          
          <el-table :data="filteredAppointments" :key="filteredAppointments.id" :show-overflow-tooltip="{ effect: 'light'}">
            <el-table-column label="记录号" prop="id" width="100" sortable></el-table-column>
            <el-table-column label="场地名称" prop="venueName" width="110" sortable></el-table-column>
            <!-- <el-table-column label="操作时间" sortable>
              <template #default="{ row }">
                {{formatDateTime(row.operationTime)}}
              </template>
            </el-table-column> -->
            <el-table-column label="预约时间段" sortable>
              <template #default="{ row }">
                <!-- 此处改成：日期+开始时间+结束时间，格式如下 -->
                {{formatAppointmentTime(row.startTime,row.endTime)}}
                <!-- {{ formatDateTime(item.row.startTime) }} - {{ formatDateTime(item.row.endTime) }} -->
              </template>
            </el-table-column>
            <el-table-column v-if="adminCheck && reservationTypeFilter === '0'" label="用户ID" prop="userID" width="110" sortable></el-table-column>
            <el-table-column v-if="adminCheck && reservationTypeFilter === '0'" label="用户姓名" prop="userRealName" width="110" sortable></el-table-column>
            <el-table-column v-if="userCheck || reservationTypeFilter !== '0'" label="团体号" prop="teamID" width="110" sortable></el-table-column>
            <el-table-column v-if="userCheck || reservationTypeFilter !== '0'" label="团体名称" prop="teamName" width="110" sortable></el-table-column>
            <el-table-column prop="price" label="支付价格" width="110" sortable></el-table-column>
            <el-table-column label="状态" width="100" sortable>
              <!-- 状态类型：已预约、已取消、已完成、违约 -->
              <template #default="{ row }">
                {{ getStatusName(row.statusCode) }}
              </template>
            </el-table-column>
            <el-table-column label="操作" width="190">
              <template #default="item">
                <el-button size="small" type="primary" @click="showAppointmentDetails(item.row)">详情</el-button>
                <el-button v-if="userCheck" size="small" :disabled="!canCancel" @click="cancelAppointment(item.row)">取消预约</el-button>
                <el-button v-if="item.row.statusCode === 1 && adminCheck"
                size="small" @click="signConfirm(item.row)">签到</el-button>
              </template>
            </el-table-column>
          </el-table>
          </div>
        </div>
      </main>
      
      <!-- 查看详细模态框 -->
      <el-dialog
        v-model="showDetailModal"
        title="预约详情"
        width="50%"
        :before-close="handleCloseDetails"
        align-center
      >
        <!-- 个人预约 -->
        <div v-if="isPerson" class = "detailContent">
          <p>预约编号：{{ selectedAppointment.id }}</p>
          <p>场地名称：{{ selectedAppointment.venueName }}</p>
          <p>预约时间：{{ formatAppointmentTime(selectedAppointment.startTime, selectedAppointment.endTime) }}</p>
          <p>支付价格：{{ selectedAppointment.price }}</p>
          <p>状态：{{ getStatusName(selectedAppointment.statusCode) }}</p>
          <div v-if="isFinished">
            <p>签到时间：{{ convertTime(selectedAppointment.signTime) }}</p>
          </div>
          <p>操作时间：{{ convertTime(selectedAppointment.operationTime) }}</p>
        </div>

        <!-- 团体预约 -->
        <div v-if="isTeam" class = "detailContent">
          <p>预约编号：{{ selectedAppointment.id }}</p>
          <p>场地名称：{{ selectedAppointment.venueName }}</p>
          <p>预约时间：{{ formatAppointmentTime(selectedAppointment.startTime, selectedAppointment.endTime) }}</p>
          <p>支付价格：{{ selectedAppointment.price }}</p>
          <p>团体号：{{ selectedAppointment.teamID }}</p>
          <p>团体名称：{{ selectedAppointment.teamName }}</p>
          <div v-if="teamDetailsData">
            <el-table :data="teamDetailsData.members" style="width: 100%; max-height: 70%; overflow-y: auto;">
              <el-table-column prop="id" label="成员ID" width="100"></el-table-column>
              <el-table-column prop="nickname" label="成员昵称"></el-table-column>
              <el-table-column prop="isSigned" label="状态" width="100">
                <template #default="{ row }">
                  <el-tag :type="getIsSignedTags(row.isSigned)">{{ row.isSigned }}</el-tag>
                </template>  
              </el-table-column>
              <el-table-column prop="signTimeTeam" label="签到时间">
                <template #default="{ row }">
                  <div v-if="isSignedTeam(row.isSigned)">
                    {{ convertTime(row.signTimeTeam) }}
                  </div>
                </template>
              </el-table-column> 
            </el-table>
          </div>
        </div>
      </el-dialog>

      <!-- 查看详细模态框(弃用) -->
      <!-- <div v-if="showDetailModal" class="modal0">
        <div class="modal0-content">
          <h2>预约详情</h2>
          <p>场地名称: {{ selectedAppointment.venueName }}</p>
          <p>预约时间: {{ formatDateTime(selectedAppointment.startTime) }} - {{ formatDateTime(selectedAppointment.endTime) }}</p>
          <p>支付价格: {{ selectedAppointment.price }}</p>
          <button @click="showDetailModal = false">关闭</button>
        </div>
      </div> -->
      <!-- <div v-if="showDetailModal" class="modal">
        <div v-if="isPerson" class="modal-content">
          <div class="modalHeader">
            <div class="modalTitle">预约详情</div>
            <el-button class="closeButton" type="danger" @click="showDetailModal = false">关闭</el-button>
          </div>
          <div class="detailLine">
            <div class="detailLabel">预约编号：</div>
            <div class="detailContent">{{ selectedAppointment.id }}</div>
          </div>
          <div class="detailLine">
            <div class="detailLabel">场地名称：</div>
            <div class="detailContent">{{ selectedAppointment.venueName }}</div>
          </div>
          <div class="detailLine">
            <div class="detailLabel">预约时间：</div>
            <div class="detailContent">{{ formatAppointmentTime(selectedAppointment.startTime, selectedAppointment.endTime) }}</div>
          </div>
          <div class="detailLine">
            <div class="detailLabel">支付价格：</div>
            <div class="detailContent">{{ selectedAppointment.price }}</div>
          </div>
          <div class="detailLine">
            <div class="detailLabel">状态：</div>
            <div class="detailContent">{{ getStatusName(selectedAppointment.statusCode) }}</div>
          </div>
          <div v-if="isFinished" class="detailLine">
            <div class="detailLabel">签到时间：</div>
            <div class="detailContent">{{ formatDateTime(selectedAppointment.signTime) }}</div>
          </div>
          <div class="detailLine">
            <div class="detailLabel">操作时间：</div>
            <div class="detailContent">{{ formatDateTime(selectedAppointment.operationTime) }}</div>
          </div>
        </div>

        <div v-if="isTeam" class="modal-content">
          <div class="modalHeader">
            <div class="modalTitle">预约详情</div>
            <el-button class="closeButton" type="danger" @click="showDetailModal = false">关闭</el-button>
          </div>
          <div class="detailLine">
            <div class="detailLabel">预约编号：</div>
            <div class="detailContent">{{ selectedAppointment.id }}</div>
          </div>
          <div class="detailLine">
            <div class="detailLabel">场地名称：</div>
            <div class="detailContent">{{ selectedAppointment.venueName }}</div>
          </div>
          <div class="detailLine">
            <div class="detailLabel">预约时间：</div>
            <div class="detailContent">{{ formatAppointmentTime(selectedAppointment.startTime, selectedAppointment.endTime) }}</div>
          </div>
          <div class="detailLine">
            <div class="detailLabel">支付价格：</div>
            <div class="detailContent">{{ selectedAppointment.price }}</div>
          </div>
          <div v-if="isFinished" class="detailLine">
            <div class="detailLabel">签到时间：</div>
            <div class="detailContent">{{ formatDateTime(selectedAppointment.signTime) }}</div>
          </div>
          <div class="detailLine">
            <div class="detailLabel">操作时间：</div>
            <div class="detailContent">{{ formatDateTime(selectedAppointment.operationTime) }}</div>
          </div>
        </div>
      </div> -->

      <!-- 取消预约模态框 -->
      <el-dialog
        v-model="showCancelModal"
        title="取消预约"
        width="50%"
        :before-close="handleCloseCancel"
      >
        <p>预约编号：{{ cancellingAppointment.id }}</p>
        <p>场地名称：{{ cancellingAppointment.venueName }}</p>
        <p>预约时间：{{ formatAppointmentTime(cancellingAppointment.startTime, cancellingAppointment.endTime) }}</p>
        <p>支付价格：{{ cancellingAppointment.price }}</p><br>
        <el-alert
          title="注意: 在预约开始时间1小时前无法取消预约"
          type="warning"
          :closable="false"
          show-icon
          style="margin-bottom: 15px;"
        />
        <el-button
          type="primary"
          @click="confirmCancel"
          :disabled="!canCancel"
        >
          确认取消
        </el-button>
        <el-button @click="handleCloseCancel">取消</el-button>
      </el-dialog>
      <!-- 信息提示框 -->
      <el-dialog v-model="infoDialog" :title="infoDialogTitle">
        <div>{{ infoDialogContent }}</div>
        <template #footer>
          <el-button @click="infoDialog = false" type="primary">确定</el-button>
        </template>
      </el-dialog>
      <!-- 确认签到提示框 -->
      <el-dialog v-model="signConfirmDialog" title="签到确认">
        <div>请确认签到信息：</div>
        <p>预约编号：{{ signingAppointment.id }}</p>
        <p>场地名称：{{ signingAppointment.venueName }}</p>
        <p>预约时间：{{ formatAppointmentTime(signingAppointment.startTime, signingAppointment.endTime) }}</p>
        <div v-if="signingAppointment.reservationType === 'group'">
          <p>团体ID：{{ signingAppointment.teamID }}</p>
          <p>团体名称：{{ signingAppointment.teamName }}</p>
        </div>
        <p>用户ID：{{ signingAppointment.userID }}</p>
        <p>用户姓名：{{ signingAppointment.userRealName }}</p>
        <template #footer>
          <el-button type="primary" @click="handleSign">确定</el-button>
          <el-button @click="signConfirmDialog = false">取消</el-button>
        </template>
      </el-dialog>

      <!-- 团体签到对话框 -->
      <el-dialog title="团体签到" v-model="teamSignDialog" align-center>
        <p>预约编号：{{ signingAppointment.id }}</p>
        <p>场地名称：{{ signingAppointment.venueName }}</p>
        <p>预约时间：{{ formatAppointmentTime(signingAppointment.startTime, signingAppointment.endTime) }}</p>
        <p>团体号：{{ signingAppointment.teamID }}</p>
        <p>团体名称：{{ signingAppointment.teamName }}</p>
        <el-table :data="teamDetailsData.members" :show-overflow-tooltip="{ effect: 'light'}" 
        style="width: 100%; max-height: 70%; overflow-y: auto;">
        <el-table-column prop="id" label="成员ID" width="100"></el-table-column>
        <el-table-column prop="nickname" label="成员昵称"></el-table-column>
        <el-table-column prop="isSigned" label="状态" width="100">
          <template #default="{ row }">
            <el-tag :type="getIsSignedTags(row.isSigned)">{{ row.isSigned }}</el-tag>
          </template>  
        </el-table-column>
        <el-table-column prop="signTimeTeam" label="签到时间">
          <template #default="{ row }">
            <div v-if="isSignedTeam(row.isSigned)">
              {{ convertTime(row.signTimeTeam) }}
            </div>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="80">
          <template #default="{ row }">
            <el-button size="small" v-if="row.isSigned === '未签到'" @click="teamSignConfirm(row)">签到</el-button>
          </template>
        </el-table-column>
      </el-table>
        <template #footer>
          <el-button type="primary" @click="teamSignDialog = false">完成</el-button>
        </template>
      </el-dialog>

      <!-- 取消预约模态框(弃用) -->
      <!-- <div v-if="showCancelModal" class="modal">
        <div class="modal-content">
          <h2>取消预约</h2>
          <div class="modalHeader">
            <div class="modalTitle">取消预约</div>
            <el-button class="closeButton" type="danger" @click="showCancelModal = false">关闭</el-button>
          </div>
          <div class="detailLine">
            <div class="detailLabel">预约编号：</div>
            <div class="detailContent">{{ cancellingAppointment.id }}</div>
          </div>
          <div class="detailLine">
            <div class="detailLabel">场地名称：</div>
            <div class="detailContent">{{ cancellingAppointment.venueName }}</div>
          </div>
          <div class="detailLine">
            <div class="detailLabel">预约时间：</div>
            <div class="detailContent">{{ formatAppointmentTime(selectedAppointment.startTime, selectedAppointment.endTime) }}</div>
          </div>
          <div class="detailLine">
            <div class="detailLabel">支付价格：</div>
            <div class="detailContent">{{ selectedAppointment.price }}</div>
          </div>
          <div class="detailLine">
            <div class="detailLabel">状态：</div>
            <div class="detailContent">{{ getStatusName(selectedAppointment.statusCode) }}</div>
          </div>
          <div class="detailLine">
            <div class="detailLabel">操作时间：</div>
            <div class="detailContent">{{ formatDateTime(selectedAppointment.operationTime) }}</div>
          </div>
          <el-input type="textarea" v-model="cancelReason" class="cancelInput" placeholder="请输入取消原因"></el-input>
          <el-button type="primary" @click="confirmCancel">确认</el-button>
          <el-button @click="showCancelModal = false">取消</el-button>
        </div>
      </div> -->
    </div>
  </template>
  
  <script setup>
  import { ref, computed } from 'vue';
  import axios from 'axios';
  import { Search } from '@element-plus/icons-vue'
  import { convertTime } from '@/apis/utils';
  import { useUserStore } from '@/stores/userStore';
  import { storeToRefs } from 'pinia';
  
  const isLoggedIn = ref(false);
  const isFinished = ref(false); // 判断是否签到
  const isPerson = ref(false); // 判断是否是个人预约
  const isTeam = ref(false); // 判断是否是团体预约
  // const searchId = ref('');
  // const startDate = ref('');
  // const endDate = ref('');
  const dateRange = ref([]);
  const appointments = ref([]);
  const showCancelModal = ref(false);
  const showDetailModal = ref(false);
  // const cancelReason = ref('');
  const cancellingAppointment = ref(null);
  const selectedAppointment = ref(null);
  const searchType = ref('0');
  const searchContent = ref('');
  //const searchPlaceholder = ref(['预约记录ID', '场地名称或ID'])
  const reservationType = ref('0');
  const reservationTypeFilter = ref('2');
  const statusCode = ref('0');
  const statusFilter = ref('0');
  const operationDateRange = ref([]);
  const operationDateRangeFilter = ref([]);
  const filteredRecords = ref([]);
  const disableTeamSearch = ref(false);
  const infoDialog = ref(false);
  const infoDialogTitle = ref('');
  const infoDialogContent = ref('');
  const signConfirmDialog = ref(false);
  const signingAppointment = ref(null);
  const teamSignDialog = ref(false);
  const userStore = useUserStore();
  const { adminType, adminPermission } = storeToRefs(userStore);
  // const adminType = ref('system');
  // const adminPermission = ref({
  //   venue: [],
  //   device: [],
  // });
  // const isTeamSearch = ref(false);

//----------------------------测试数据-----------------------------------

  appointments.value = [
  {
    id: '12345',
    venueId: '1',
    venueName: '体育场',
    startTime: new Date('2023-08-21T10:00:00'),
    endTime: new Date('2023-08-21T12:00:00'),
    price: 100,
    statusCode: 1, // 1: 已预约, 2: 已取消, 3: 已完成, 4: 违约
    operationTime: new Date('2024-08-20T14:30:00'),
    reservationType: 'individual',
    signTime: null,
    userID: '12345',
    userRealName: '测试',
    teamID: null,
    teamName: null,
  },
  {
    id: '67890',
    venueId: '2',
    venueName: '游泳馆',
    startTime: new Date('2024-09-03T00:00:00'),
    endTime: new Date('2024-09-03T23:30:00'),
    price: 80,
    statusCode: 1, // 1: 已预约, 2: 已取消, 3: 已完成, 4: 违约
    operationTime: new Date('2024-09-01T22:30:00'),
    reservationType: 'group',
    signTime: null,
    userID: '23456',
    userRealName: '测试',
    teamID: '123',
    teamName: '团体01',
  },
  {
    id: '11111',
    venueId: '3',
    venueName: '篮球场',
    startTime: new Date('2023-08-23T09:00:00'),
    endTime: new Date('2023-08-23T11:00:00'),
    price: 90,
    statusCode: 3, // 1: 已预约, 2: 已取消, 3: 已完成, 4: 违约
    operationTime: new Date('2024-08-20T14:30:00'),
    reservationType: 'group',
    signTime: new Date('2023-08-23T10:00:00'),
    teamID: '无',
    teamName: '无'
  }
  ];

  const teamDetailsData = {
    id: 1,
    name: "技术创新小组",
    description: "致力于探索和实现前沿技术的应用",
    createdAt: "2023-01-15",
    members: [
      { id: 101, nickname: "张三", isSigned: "已签到", signTimeTeam: "2023-08-23T11:00:00" },
      { id: 102, nickname: "李四", isSigned: "未签到", signTimeTeam: null },
      { id: 103, nickname: "王五", isSigned: "已签到", signTimeTeam: "2023-08-23T11:00:00" },
      { id: 104, nickname: "赵六", isSigned: "未签到", signTimeTeam: null },
      { id: 105, nickname: "钱七", isSigned: "已签到", signTimeTeam: "2023-08-23T11:00:00" },
      { id: 106, nickname: "孙八", isSigned: "未签到", signTimeTeam: null },
      { id: 107, nickname: "周九", isSigned: "已签到", signTimeTeam: "2023-08-23T11:00:00" },
      { id: 108, nickname: "吴十", isSigned: "未签到", signTimeTeam: null },
    ]
  };

//------------------------ 测试数据--------------------------------

  //从数据库获取数据，currentUser为当前用户
  // const fetchUserData = async () => {
  //   try {
  //     loading.value = true;
  //     const response = await axios.get('/api/user-data', {
  //       params: { userId: props.currentUser.id }
  //     });
  //     userData.value = response.data;
  //     //此处还需要获取用户所在团队数据
  //   } catch (err) {
  //     error.value = err.message;
  //   } finally {
  //     loading.value = false;
  //   }
  // };

  // onMounted(() => {
  //   fetchUserData();
  // });

  const filteredAppointments = ref(appointments.value);

  //placeholder内容
  const searchPlaceholder = ref([
    '预约记录ID', 
    '场地名称或ID', 
    '团体名称或ID',
  ]);

  const userCheck = computed(() => adminType.value === 'normal');
  const adminCheck = computed(() => adminType.value === 'system' || adminType.value === 'venue'
  || adminType.value === 'venue-device');

  const getStatusName = (statusCode) => {
    const statusMap = {
      1: '已预约',
      2: '已取消',
      3: '已签到',
      4: '违约'
    };
    const result = statusMap[statusCode] || '未知状态';
    //console.log('Result:', statusCode);
    return result;
  };

  const getIsSignedTags = (isSigned) => {
    const isSignedTags = {
      '未签到': 'warning',
      '已签到': 'success',
      '已取消': 'info'
    };
    return isSignedTags[isSigned] || 'info';
  }

  const reservationTypeChange = () => {
    if(reservationTypeFilter.value === '0'){
      if(searchType.value === '2'){
        searchType.value = '0';
      }
      disableTeamSearch.value = true;
    }
    else{
      disableTeamSearch.value = false;
    }
    reservationTypeSearch();
  }

  const isSignedTeam = (isSigned) => {
    return isSigned == "已签到";
  }

  // const filteredAppointments = computed(() => {
    // return appointments.value.filter(appointment => {
      // const appointmentDate = new Date(appointment.startTime);
      // const startDateObj = startDate.value ? new Date(startDate.value) : null;
      // const endDateObj = endDate.value ? new Date(endDate.value) : null;

      // return (
      //   (!searchId.value || appointment.id.includes(searchId.value)) &&
      //   (!startDateObj || appointmentDate >= startDateObj) &&
      //   (!endDateObj || appointmentDate <= endDateObj)
      // );
      // return true;
    // });
  // });

  const reservationTypeSearch = () => {
    filteredAppointments.value = appointments.value;
    filteredAppointments.value = filteredAppointments.value.filter(item => {
      if (reservationTypeFilter.value === '2') return true;
      //console.log("比较:", item.reservationType, parseInt(reservationTypeFilter.value));
      return item.reservationType === 'individual' && reservationTypeFilter.value === '0' ||
      item.reservationType === 'group' && reservationTypeFilter.value === '1';
    });
  }

  //筛选
  const handleSearch = () => {

    // 新增的预约类型筛选
    reservationTypeSearch();

    //输入框筛选
    if(searchContent.value){

      filteredAppointments.value = filteredAppointments.value.filter(appointment => {
        console.log(searchContent.value, appointment.teamName);
        return (
          (searchType.value == 0 && appointment.id == searchContent.value) ||
          (searchType.value == 1 && (appointment.venueId == searchContent.value || appointment.venueName == searchContent.value)) ||
          (searchType.value == 2 && (appointment.teamID == searchContent.value || appointment.teamName == searchContent.value))
        );
      })
    }

    //预约时间筛选
    if (dateRange.value && dateRange.value.length === 2) {
      const [startDate, endDate] = dateRange.value;
      filteredAppointments.value = filteredAppointments.value.filter(appointment => {
        const recordDate = new Date(appointment.startTime);
        return recordDate >= startDate && recordDate <= endDate;
      });
    }
    // } else {
      // filteredAppointments.value = filteredAppointments.value;
    // }

    // 新增的状态筛选
    if (statusFilter.value!='0') {
      filteredAppointments.value = filteredAppointments.value.filter(item => {
        console.log("比较:", item.statusCode, parseInt(statusFilter.value));
        return item.statusCode === parseInt(statusFilter.value);
      });
    }

    // 新增的操作时间筛选
    // if (operationDateRange.value.length > 0) {
    //   const opStartDate = operationDateRangeFilter.value[0].getTime();
    //   const opEndDate = operationDateRangeFilter.value[1].getTime() + 3600 * 1000 * 24;
    //   filteredAppointments.value = filteredAppointments.value.filter(item => {
    //     const opDate = new Date(item.operationTime).getTime();
    //     return opDate >= opStartDate && opDate <= opEndDate;
    //   });
    // }

  }

  //重置筛选
  const FilterReset = () => {
    dateRange.value = [];
    searchType.value = '0';
    statusFilter.value = '0';
    searchContent.value = '';
    reservationType.value = '';
    operationDateRange.value = [];
    filteredAppointments.value = appointments.value;
    operationDateRangeFilter.value = [];
    reservationTypeFilter.value = '0';
  }

  // 获取时间 
  // const formatDateTime = (operationTime) => {
  //   const date = new Date(operationTime);
  //   return `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')} ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
  // };

  //获取时间段
  const formatAppointmentTime = (startTime, endTime) => {
    // const start = new Date(startTime);
    // const end = new Date(endTime);
    // return `${start.getFullYear()}-${(start.getMonth() + 1).toString().padStart(2, '0')}-${start.getDate().toString().padStart(2, '0')} ${start.getHours().toString().padStart(2, '0')}:${start.getMinutes().toString().padStart(2, '0')}-${end.getHours().toString().padStart(2, '0')}:${end.getMinutes().toString().padStart(2, '0')}`;
    const endTimeStr = convertTime(endTime);
    return convertTime(startTime) + '-' + endTimeStr.slice(endTimeStr.length - 5, endTimeStr.length);
  };

  const goToLogin = () => {
    // 跳转到登录界面
  };

  //更新列表
  const searchAppointments = () => {
    // 模拟从后端获取预约记录
    // if (searchId.value) {
    //   appointments.value = appointments.value.filter(appointment => appointment.id.includes(searchId.value));
    // } else {
    //   appointments.value = [...appointments.value];
    // }
    // 从后端获取预约记录
    axios.get('/api/appointments', {
      params: {
        id: searchId.value,
        startDate: startDate.value,
        endDate: endDate.value
      }
    })
    .then(response => {
      appointments.value = response.data;
    })
    .catch(error => {
      console.error('Error fetching appointments:', error);
    });
  };

  //打开预约详情模态框
  const showAppointmentDetails = (appointment) => {
    selectedAppointment.value = appointment;
    isFinished.value = (appointment.statusCode == '3');
    isPerson.value = (appointment.reservationType == 'individual')
    isTeam.value = (appointment.reservationType == 'group')
    showDetailModal.value = true;
    //console.log(selectedAppointment.value);
  };

  //打开取消预约模态框
  const cancelAppointment = (appointment) => {
    cancellingAppointment.value = appointment;
    showCancelModal.value = true;
  };

  //确认删除
  const confirmCancel = () => {
    // 将取消原因插入预约记录
    axios.post('/api/appointments/cancel', {
      id: cancellingAppointment.value.id,
      //reason: cancelReason.value
    })
    .then(response => {
      showCancelModal.value = false;
      // cancelReason.value = '';
      cancellingAppointment.value = null;
      // 刷新预约列表
      searchAppointments();
    })
    .catch(error => {
      console.error('Error canceling appointment:', error);
      showCancelModal.value = false;
    });
  };

  //判断是否禁用
  const canCancel = computed(() => {
    const now = new Date()
    const startTime = new Date(cancellingAppointment.startTime)
    const oneHourBefore = new Date(startTime.getTime() - 60 * 60 * 1000)
    return now < oneHourBefore
  })

  //关闭查看详细模态框
  const handleCloseDetails = () => {
    showDetailModal.value = false
  }

  //关闭取消预约模态框
  const handleCloseCancel = () => {
    showCancelModal.value = false
  }

  //test cancel begin
  //   const confirmCancel = () => {
  //     // 模拟将取消原因插入预约记录
  //     const cancelledAppointment = {
  //       ...cancellingAppointment.value,
  //       cancelled: true,
  //       cancelReason: cancelReason.value
  //     };
  //     appointments.value = appointments.value.map(appointment => {
  //       if (appointment.id === cancelledAppointment.id) {
  //         return cancelledAppointment;
  //       }
  //       return appointment;
  //     });
  //     showCancelModal.value = false;
  //     cancelReason.value = '';
  //     cancellingAppointment.value = null;
  //   };
  //test cancel end

  const signCheck = (record) => {
    const curTime = Date.now();
    if(curTime < record.startTime.getTime() - 1000 * 60 * 30 || curTime > record.endTime.getTime()){
      infoDialogTitle.value = '签到失败';
      infoDialogContent.value = '当前不在可签到时间段内';
      infoDialog.value = true;
      return false;
    }
    return true;
  }

  const signConfirm = (record) => {
    signingAppointment.value = record;
    if(record.reservationType === 'individual' && signCheck(record)){
      signConfirmDialog.value = true;
    }
    else if(record.reservationType === 'group'){
      teamSignDialog.value = true;
    }
  }

  const teamSignConfirm = (user) => {
    if(!signCheck(signingAppointment.value)){
      return;
    }
    signingAppointment.value.userID = user.id;
    signingAppointment.value.userRealName = user.nickname;
    signConfirmDialog.value = true;
  }

  const handleSign = () => {
    if(!signCheck(signingAppointment.value)){
      return;
    }
  }

  </script>
  
  <style scoped>
  /* 添加一些基本的样式 */

  .ReservationList{
    display: flex;
    flex-direction: column;
    width: calc(100% - 20px);
    padding-bottom: 10px;
    margin: 10px;
    border-radius: 5px;
    background-color: white;
    border: 1px solid lightgray;
  }

  .ReservationTitle{
    display: flex;
    justify-content: center;
    padding: 10px;
    font-size: 20px;
    font-weight: 700;
    border-bottom: 1px solid black;
  }

  /* 筛选区域样式 */
  .FilterArea{
    display: flex;
    flex-direction: column;
    padding: 10px;
    border-top: 1px solid lightgray;
    border-bottom: 1px solid lightgray;
  }

  .SearchArea{
    display: flex;
    /* justify-content: space-between; */
    padding-left: 10px;
    margin-bottom: 10px;
  }

  .SearchBox{
    flex: 1;
    margin-left: 50px;
    margin-right: 10px;
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

  .FilterControl{
    display: flex;
    justify-content: center;
    margin-top: 10px;
  }

  .modal {
    display: flex;
    align-items: center;
    justify-content: center;
    position: fixed;
    z-index: 1;
    top: 0;
    left: 0;
    width: 100%;
    height: 100vh;
    background-color: rgba(0, 0, 0, 0.5);
  }

  .modalHeader{
    display: flex;
    justify-content: center;
  }

  .closeButton{
    margin-left: auto;
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
  
  .modal-content {
    background-color: white;
    padding: 20px;
    border-radius: 8px;
    max-width: 500px;
    width: 90%;
    max-height: 100vh;
    overflow: auto;
  }

  .cancelInput{
    margin-top: 10px;
    margin-bottom: 10px;
  }

  /* .modal {
    position: fixed;
    z-index: 1;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    overflow: auto;
    background-color: rgba(0, 0, 0, 0.4);
  }
  
  .modal0 {
    position: fixed;
    z-index: 1;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    overflow: auto;
    background-color: rgba(0, 0, 0, 0.4);
  } */

  .modal0-content {
    background-color: #fefefe;
    margin: 10% auto; /* 调整垂直居中的位置 */
    padding: 20px;
    border: 1px solid #888;
    width: 50%; /* 增加宽度 */
    max-width: 800px; /* 设置最大宽度,防止过大 */
    height: 60%; /* 增加高度 */
    max-height: 25vh; /* 设置最大高度,防止过大 */
    overflow-y: auto; /* 添加垂直滚动条 */
    line-height: 2.5;
  }

  /*
  .modal-content {
    background-color: #fefefe;
    margin: 10% auto; 
    padding: 20px;
    border: 1px solid #888;
    width: 50%;
    max-width: 800px; 
    height: 60%;
    max-height: 25vh;
    overflow-y: auto;
    line-height: 2.5;
  }
  */

  .detailLine{
    display: flex;
    line-height: 2em;
  }

  .detailLabel{
    font-weight: 700;
    width: 120px;
  }
  
  .search-bar {
    display: flex;
    justify-content: center;
    align-items: flex-start;
    padding-top: 20px; /* 添加一些顶部间距 */
  }

  table {
    width: 100%;
    border-collapse: collapse;
  }

  th, td {
    padding: 10px;
    text-align: center; /* 将文本居中 */
    border-bottom: 1px solid #ddd;
  }

  .modal-content0 h2 {
    margin-bottom: 20px; /* 增加标题与内容的间距 */
  }

  .modal-content h2 {
    margin-bottom: 20px; /* 增加标题与内容的间距 */
  }

  .accessDeny{
    display: flex;
    justify-content: center;
    height: 75vh;
    color: darkgray;
    font-size: 20px;
  }

  .denyText{
    margin-top: auto;
    margin-bottom: auto;
  }
  
  </style>