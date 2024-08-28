<template>
    <div class="team-info-container">
      <div class="teamInfoTitle">团体信息</div>
      <div v-if="isLoading" class="loading-message">
        加载中...
      </div>
      <div v-else-if="!team || team.length == 0" class="no-team-message">
        您还没有加入任何团体
      </div>
      <div v-else class="team-info">
        <!-- <h2>团体信息</h2> -->
        <!-- <div class="team-info-row">
          <div class="team-details">
            <span>ID: {{ team.id }} | 名称: {{ team.name }}</span>
          </div>
          <div class="team-actions">
            <button @click="showTeamDetails">团体详情</button>
            <button @click="confirmLeaveTeam">退出团体</button>
          </div>
        </div> -->
        <el-table 
          :data="filteredTeam" 
          height="750" 
          :header-cell-style="{ background: '#f5f7fa' }"
        >
        <el-table-column label="团体编号" prop="id" width="100" fixed></el-table-column>
        <el-table-column label="团体名称" prop="name" fixed></el-table-column>
        <el-table-column label="角色" width="120" fixed>
          <template #default="scope">
            <el-tag :type="getRoleTagType(scope.row.role)">
              {{ scope.row.role }}
            </el-tag>
          </template>
        </el-table-column>
          <el-table-column label="操作" width="200">
            <template #default="item">
              <el-button size="small" @click="showTeamDetails(item.row.id)">团体详情</el-button>
              <el-button size="small" @click="showLeaveTeamDialog(item.row.id)" type="danger">退出团体</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="teamOptions">
        <el-button size="large" class="teamButton" @click="showJoinModal">加入团体</el-button>
        <el-button type="primary" size="large" class="teamButton" @click="showCreateModal">创建团体</el-button>
      </div>
    </div>

    <!-- 团体详情模态框 -->
    <el-dialog
      v-model="teamDetailsVisible"
      title="团体详情"
      width="70%"
      :before-close="handleCloseTeamDetails"
    >
      <!-- 需将teamDetailsData修改为正式数据currentTeam -->
      <!-- <div v-if="currentTeam"> -->
      <div v-if="teamDetailsData">
        <h3>团体信息</h3>
        <p>团体ID: {{ teamDetailsData.id }}</p>
        <p>团体名称: {{ teamDetailsData.name }}</p>
        <p>团体描述: {{ teamDetailsData.description }}</p>
        <!-- 可以添加更多团体信息 -->

        <!-- 可以把isAdminOrCreator,isCurrentUserOrCreator(row)改成1进行测试 -->
        <h3>成员列表</h3>
        <!-- <el-table :data="currentTeam.members" style="width: 100%"> -->
        <el-table :data="teamDetailsData.members" style="width: 100%">
          <el-table-column prop="id" label="成员ID" width="120"></el-table-column>
          <el-table-column prop="nickname" label="成员昵称"></el-table-column>
          <el-table-column prop="role" label="权限" width="120">
            <template #default="{ row }">
              <el-tag :type="getRoleTagType(row.role)">{{ row.role }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column v-if="isAdminOrCreator" label="操作" width="240">
            <template #default="{ row }">
              <el-button 
                size="small" 
                type="danger" 
                @click="kickMember(row.id)"
                :disabled="isCurrentUserOrCreator(row)"
              >
                踢出
              </el-button>
              <el-button 
                size="small" 
                type="warning" 
                @click="toggleAdminRole(row)"
                :disabled="isCurrentUserOrCreator(row)"
              >
                {{ row.role === '管理员' ? '撤销管理员' : '授予管理员' }}
              </el-button>
            </template>
          </el-table-column>
        </el-table>

      <!-- <div v-if="isAdminOrCreator" class="add-member-section">可以改成0，1试 -->
      <div v-if=1 class="add-member-section">
        <h3>添加成员</h3>
        <el-input
          v-model="searchMember"
          placeholder="搜索用户ID或昵称"
          class="search-input"
        >
        </el-input>
        <el-button type="primary" @click="searchUser">搜索</el-button>
        <!-- 这里可以添加搜索结果的显示和添加成员的逻辑 -->
        <!-- 搜索结果显示 -->
        <!-- <div v-if="searchResults.length > 0" class="search-results"> -->
        <div v-if= 1 class="search-results">
          <h3>搜索结果</h3>
          <el-table :data="searchResults" style="width: 100%">
            <el-table-column prop="id" label="用户ID" width="100"></el-table-column>
            <el-table-column prop="nickname" label="昵称"></el-table-column>
            <el-table-column label="操作" width="120">
              <!-- <template #default="{ row }">
                <el-button 
                  size="small" 
                  type="primary" 
                  @click="addMemberToTeam(row)"
                  :disabled="isMemberAlreadyInTeam(row.id)"
                >
                  {{ isMemberAlreadyInTeam(row.id) ? '已在团队中' : '添加' }}
                </el-button>
              </template> -->
            </el-table-column>
          </el-table>
        </div>
      </div>

      </div>
    </el-dialog>

    <!-- 退出团体确认模态框 -->
    <el-dialog
      v-model="leaveTeamDialogVisible"
      title="确认退出团体"
      width="30%"
      :before-close="handleCloseLeaveTeamDialog"
    >
      <div v-if="teamToLeave">
        <p>您确定要退出以下团体吗？</p>
        <p class="warning-text">注意：退出后将无法访问该团体的相关信息和资源。</p>
      </div>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="handleCloseLeaveTeamDialog">取消</el-button>
          <el-button type="danger" @click="confirmLeaveTeam">确认退出</el-button>
        </span>
      </template>
    </el-dialog>
  
    <!-- 加入团体模态框 -->
    <el-dialog
      title="加入团体"
      v-model="joinTeamDialogVisible"
      width="30%"
      :before-close="handleCloseJoinTeamDialog"
    >
      <div class="search-container">
        <el-input
          v-model="searchQuery"
          placeholder="搜索团体"
          class="search-input"
        ></el-input>
        <el-button type="primary" @click="searchTeams">搜索</el-button>
      </div>

      <el-table :data="teamDataTest" style="width: 100%">
        <el-table-column prop="id" label="团体ID" width="180"></el-table-column>
        <el-table-column prop="name" label="名称" width="180"></el-table-column>
        <el-table-column prop="description" label="描述"></el-table-column>
        <el-table-column label="操作" width="120">
          <template #default="scope">
            <el-button type="primary" size="small" @click="joinTeam(scope.row)">加入</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>

    <!-- 创建团体模态框 -->
    <el-dialog
      v-model="createTeamDialogVisible"
      title="创建团体"
      width="30%"
      :before-close="handleCloseCreateTeamDialog"
    >
      <div class = "team-info">
        <h3>团体名称</h3>
        <el-input
          v-model="teamName"
          type="textarea"
          placeholder="请输入团体名称"
        ></el-input>
        <h3>团体描述</h3>
        <el-input
          v-model="teamDescription"
          type="textarea"
          placeholder="请输入团体描述"
        ></el-input>
      </div>

      <!-- <div v-if="isAdminOrCreator" class="add-member-section">可以改成0，1试 -->
      <div v-if=1 class="add-member-section">
        <h3>添加成员</h3>
        <el-input
          v-model="searchMember"
          placeholder="搜索用户ID或昵称"
          class="search-input"
        >
        </el-input>
        <el-button type="primary" @click="searchUser">搜索</el-button>
        <!-- 这里可以添加搜索结果的显示和添加成员的逻辑 -->
        <!-- 搜索结果显示 -->
        <!-- <div v-if="searchResults.length > 0" class="search-results"> -->
        <div v-if= 1 class="search-results">
          <h3>搜索结果</h3>
          <el-table :data="searchResults" style="width: 100%">
            <el-table-column prop="id" label="用户ID" width="100"></el-table-column>
            <el-table-column prop="nickname" label="昵称"></el-table-column>
            <el-table-column label="操作" width="120">
              <!-- <template #default="{ row }">
                <el-button 
                  size="small" 
                  type="primary" 
                  @click="addMemberToTeam(row)"
                  :disabled="isMemberAlreadyInTeam(row.id)"
                >
                  {{ isMemberAlreadyInTeam(row.id) ? '已在团队中' : '添加' }}
                </el-button>
              </template> -->
            </el-table-column>
          </el-table>
        </div>
      </div>

      <template #footer>
        <span class="dialog-footer">
          <el-button type="primary" @click="submitForm">确定</el-button>
        </span>
      </template>
    </el-dialog> 

  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue'
  import axios from 'axios'

//------------------------测试数据----------------------------

  const team = ref([
    { id: 1, name: '团体A', role: '创建者' },
    { id: 2, name: '团体B', role: '管理员' },
    { id: 3, name: '团体C', role: '普通成员' },
    // 可以添加更多测试数据
  ]);

  const filteredTeam = ref([
    { id: 1, name: '团体A', role: '创建者' },
    { id: 2, name: '团体B', role: '管理员' },
    { id: 3, name: '团体C', role: '普通成员' },
    // 可以添加更多测试数据
  ]);

  const teamDetailsData = {
    id: 1,
    name: "技术创新小组",
    description: "致力于探索和实现前沿技术的应用",
    createdAt: "2023-01-15",
    members: [
      { id: 101, nickname: "张三", role: "创建者" },
      { id: 102, nickname: "李四", role: "管理员" },
      { id: 103, nickname: "王五", role: "普通成员" },
      { id: 104, nickname: "赵六", role: "普通成员" },
      { id: 105, nickname: "钱七", role: "管理员" },
      { id: 106, nickname: "孙八", role: "普通成员" },
      { id: 107, nickname: "周九", role: "普通成员" },
      { id: 108, nickname: "吴十", role: "普通成员" },
    ]
  };

  const teamDataTest = ref([
    { id: 1, name: '团体A', description: '创建者' },
    { id: 2, name: '团体B', description: '管理员' },
    { id: 3, name: '团体C', description: '普通成员' },
    // 可以添加更多测试数据
  ]);

//------------------------测试数据----------------------------

  const teamMembers = ref([])
  const showDetails = ref(false)
  const teams = ref([])
  const teamDetailsVisible = ref(false)
  const leaveTeamDialogVisible = ref(false)
  const joinTeamDialogVisible = ref(false)
  const currentTeam = ref(null)
  const searchMember = ref('')
  const searchQuery = ref('')
  const teamToLeave = ref(null)
  const searchResults = ref([])
  const hasSearched = ref(false)
  const teamData = ref([])
  const createTeamDialogVisible = ref(false)
  const formRef = ref(null)

  // 从后端获取团队数据
  const fetchTeams = async () => {
    try {
      isLoading.value = true
      const response = await axios.get('/api/teams') // 替换为实际的API端点
      teams.value = response.data
    } catch (error) {
      console.error('获取团队数据失败:', error)
      ElMessage.error('获取团队数据失败，请稍后重试')
    } finally {
      isLoading.value = false
    }
  }

  // 在组件挂载时获取数据
  onMounted(fetchTeams)

  //tag color
  const getRoleTagType = (role) => {
    switch (role) {
      case '创建者':
        return 'danger'
      case '管理员':
        return 'warning'
      case '普通成员':
        return 'info'
      default:
        return ''
    }
  }

  //打开团体详情模态框
  const showTeamDetails = async (id) => {
    try {
      const response = await axios.get(`/api/teams/${id}`) // 替换为实际的API端点
      currentTeam.value = response.data
      teamDetailsVisible.value = true
    } catch (error) {
      console.error('获取团体详情失败:', error)
      ElMessage.error('获取团体详情失败，请稍后重试')
    }
  }

  //关闭团体详情模态框
  const handleCloseTeamDetails = () => {
    teamDetailsVisible.value = false
    currentTeam.value = null
    searchResults.value = null
  }

  // //判断是否管理员/创始人
  // const isAdminOrCreator = computed(() => {
  //   if (!currentTeam.value) return false
  //   const currentUserRole = currentTeam.value.members.find(m => m.id === currentUserId.value)?.role
  //   return ['创建者', '管理员'].includes(currentUserRole)
  // })

  // //判断该用户是否是创始人
  // const isCurrentUserOrCreator = (member) => {
  //   return member.id === currentUserId.value || member.role === '创建者'
  // }

  // //踢出成员
  // const kickMember = async (memberId) => {
  //   try {
  //     await axios.post(`/api/teams/${currentTeam.value.id}/kick/${memberId}`)
  //     ElMessage.success('成员已被踢出')
  //     // 更新成员列表
  //     currentTeam.value.members = currentTeam.value.members.filter(m => m.id !== memberId)
  //   } catch (error) {
  //     console.error('踢出成员失败:', error)
  //     ElMessage.error('踢出成员失败，请稍后重试')
  //   }
  // }

  // //更新管理员状态
  // const toggleAdminRole = async (member) => {
  //   const newRole = member.role === '管理员' ? '普通成员' : '管理员'
  //   try {
  //     await axios.post(`/api/teams/${currentTeam.value.id}/updateRole`, {
  //       memberId: member.id,
  //       newRole: newRole
  //     })
  //     member.role = newRole
  //     ElMessage.success(`已${newRole === '管理员' ? '授予' : '撤销'}管理员权限`)
  //   } catch (error) {
  //     console.error('更新权限失败:', error)
  //     ElMessage.error('更新权限失败，请稍后重试')
  //   }
  // }

  //搜索逻辑
  const searchUser = async () => {
    hasSearched.value = true;
    try {
      // 这里应该是实际的API调用
      // const response = await axios.get(`/api/users/search?query=${searchMember.value}`);
      // searchResults.value = response.data;
      
      // 模拟API调用
      await new Promise(resolve => setTimeout(resolve, 500));
      searchResults.value = [
        { id: 201, nickname: "刘一", email: "liuyi@example.com" },
        { id: 202, nickname: "陈二", email: "chener@example.com" },
        { id: 203, nickname: "张三丰", email: "zhangsanfeng@example.com" },
      ].filter(user => 
        user.nickname.includes(searchMember.value) || 
        user.id.toString().includes(searchMember.value)
      );

      ElMessage.success(`搜索完成，找到 ${searchResults.value.length} 个结果`);
    } catch (error) {
      console.error('搜索用户失败:', error);
      ElMessage.error('搜索用户失败，请稍后重试');
    }
  };

  const isMemberAlreadyInTeam = (userId) => {
    return currentTeam.value.members.some(member => member.id === userId);
  };

  const addMemberToTeam = async (user) => {
    try {
      // 这里应该是实际的API调用
      // await axios.post(`/api/teams/${currentTeam.value.id}/members`, { userId: user.id });
      
      // 模拟API调用
      await new Promise(resolve => setTimeout(resolve, 500));
      
      currentTeam.value.members.push({
        id: user.id,
        nickname: user.nickname,
        role: '普通成员'
      });
      ElMessage.success(`已将 ${user.nickname} 添加到团队`);
    } catch (error) {
      console.error('添加成员失败:', error);
      ElMessage.error('添加成员失败，请稍后重试');
    }
  };

  //打开退出团体模态框
  const showLeaveTeamDialog = (id) => {
    teamToLeave.value = id
    leaveTeamDialogVisible.value = true
  }

  //关闭退出团体模态框
  const handleCloseLeaveTeamDialog = () => {
    leaveTeamDialogVisible.value = false
    teamToLeave.value = null
  }

  //退出团体后端交互
  const confirmLeaveTeam = async () => {
    if (!teamToLeave.value) return

    try {
      await leaveTeam(teamToLeave.value.id)
      ElMessage.success('已成功退出团体')
      leaveTeamDialogVisible.value = false
      teamToLeave.value = null
      await fetchTeams()  // 重新获取团队列表
    } catch (error) {
      console.error('退出团体失败:', error)
      ElMessage.error('退出团体失败，请稍后重试')
    }
  }

  const leaveTeam = async (id) => {
    // 实际的退出团体API调用
    await axios.post(`/api/teams/${id}/leave`)
  }

  //打开加入团体模态框
  const showJoinModal = () => {
    joinTeamDialogVisible.value = true
    console.log('open sucessfully')
  }

  //关闭加入团体模态框
  const handleCloseJoinTeamDialog = () => {
    joinTeamDialogVisible.value = false
    searchQuery.value = ''
    teamData.value = []
    console.log('close sucessfully')
  }

  //加入团体逻辑
  const searchTeams = async () => {
    try {
      const response = await axios.get('/api/teams', { params: { query: searchQuery.value } }) // 替换为实际的API端点
      teamData.value = response.data
    } catch (error) {
      console.error('搜索团体失败:', error)
      ElMessage.error('搜索团体失败，请稍后重试')
    }
  }

  const joinTeam = async (team) => {
    try {
      await axios.post(`/api/teams/${team.id}/join`) // 替换为实际的API端点
      ElMessage.success(`成功加入团体: ${team.name}`)
      handleClose(() => {})
    } catch (error) {
      console.error('加入团体失败:', error)
      ElMessage.error('加入团体失败，请稍后重试')
    }
  }

  //打开创建团体模态框
  const showCreateModal = () => {
    createTeamDialogVisible.value = true
    console.log('open sucessfully')
  }

  //关闭创建团体模态框
  const handleCloseCreateTeamDialog = () => {
    createTeamDialogVisible.value = false
    formRef.value = null
    searchResults.value = null
  }

  //提交表单
  const submitForm = async () => {
    if (!formRef.value) return

    try {
      await formRef.value.validate()
      loading.value = true

      // 发送POST请求到后端API
      const response = await axios.post('/api/teams', form)
      
      console.log('Team created:', response.data)
      ElMessage.success('团体创建成功')
      createTeamDialogVisible.value = false
      
      // 重置表单
      formRef.value.resetFields()
      
    } catch (error) {
      if (error.name === 'ValidationError') {
        console.log('Form validation failed')
        createTeamDialogVisible.value = false
        searchResults.value = null
      } else {
        console.error('Error creating team:', error)
        ElMessage.error('创建团体失败，请稍后重试')
        createTeamDialogVisible.value = false
        searchResults.value = null
      }
    } finally {
      loading.value = false
    }
  }

  // onMounted(fetchTeamInfo)

  </script>
  
  <style scoped>
  .team-info-container {
    display: flex;
    flex-direction: column;
    /* justify-content: center; */
    /* width: 100%; */
    height: calc(100vh - 50px - 20px);
    margin: 10px;
    border-radius: 5px;
    background-color: white;
  }

  .teamInfoTitle{
    display: flex;
    justify-content: center;
    padding: 10px;
    font-size: 20px;
    font-weight: 700;
    border-bottom: 1px solid black;
  }
  
  .no-team-message {
    display: flex;
    justify-content: center;
    font-size: 18px;
    color: #aaa;
    width: 100%;
    /* height: 75vh; */
    margin-top: auto;
    margin-bottom: auto;
  }

  .team-info{
    margin-bottom: auto;
  }

  .teamOptions{
    display: flex;
    margin-bottom: 0;
    margin-top: 0;
  }

  .teamButton{
    width: 50%;
  }

  /* .team-info{
    width: 100%;
    max-width: 800px;
  } */
  
  /* .team-info h2 {
    text-align: center;
    margin-bottom: 20px;
  } */
  
  /* .team-info-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
  }
  
  .team-details {
    text-align: left;
  }
  
  .team-actions {
    display: flex;
    gap: 10px;
  }
  
  button {
    padding: 5px 10px;
  } */
  
  .member-list {
    text-align: left;
  }
  
  ul {
    list-style-type: none;
    padding: 0;
  }
  
  li {
    margin-bottom: 10px;
  }

  .loading-message {
    text-align: center;
    padding: 20px;
  }

  .add-member-section {
    margin-top: 20px;
  }

  .search-input {
    width: 300px;
  }
  </style>