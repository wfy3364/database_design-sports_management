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
        <el-table :data="filteredTeam">
          <el-table-column label="团体编号" prop="id" width="100"></el-table-column>
          <el-table-column label="团体名称" prop="name"></el-table-column>
          <el-table-column label="权限" width="100"></el-table-column>
          <el-table-column label="操作" width="200">
            <template #default="item">
              <el-button size="small" @click="showTeamDetails(item.row.id)">团体详情</el-button>
              <el-button size="small" @click="confirmLeaveTeam(item.row.id)" type="danger">退出团体</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="teamOptions">
        <el-button size="large" class="teamButton">加入团体</el-button>
        <el-button type="primary" size="large" class="teamButton">创建团体</el-button>
      </div>
    </div>
    <div v-if="showDetails" class="member-list">
      <h3>成员列表</h3>
      <ul>
        <li v-for="member in teamMembers" :key="member.id">
          ID: {{ member.id }} | 昵称: {{ member.nickname }} | 权限: {{ member.permission }}
        </li>
      </ul>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue'
  import axios from 'axios'

  const team = ref([{
    id: 1,
    name: '羽毛球队',
  }])
  const filteredTeam = ref([{
    id: 1,
    name: '羽毛球队',
  }]);
  const teamMembers = ref([])
  const showDetails = ref(false)
  const isLoading = ref(false)

  const fetchTeamInfo = async () => {
    try {
        isLoading.value = true
        const response = await axios.get('/api/team-info')
        team.value = response.data
        filteredTeam.value = team.value;
      } catch (error) {
        console.error('获取团体信息失败:', error)
      } finally {
        isLoading.value = false
      }
  }

  const showTeamDetails = async (treamid) => {
    try {
      const response = await axios.get('/api/team-members')
      teamMembers.value = response.data
      showDetails.value = true
    } catch (error) {
      console.error('获取团体成员失败:', error)
    }
  }

  const confirmLeaveTeam = (treamid) => {
    if (confirm('您确定要退出该团体吗?')) {
      leaveTeam()
    }
  }

  const leaveTeam = async () => {
    try {
      await axios.post('/api/leave-team')
      team.value = null
      showDetails.value = false
    } catch (error) {
      console.error('退出团体失败:', error)
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
  </style>