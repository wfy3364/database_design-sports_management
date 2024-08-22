<template>
    <div class="team-info-container">
      <div v-if="isLoading" class="loading-message">
        加载中...
      </div>
      <div v-else-if="!team" class="no-team-message">
        您还没有加入任何团体
      </div>
      <div v-else class="team-info">
        <h2>团体信息</h2>
        <div class="team-info-row">
          <div class="team-details">
            <span>ID: {{ team.id }} | 名称: {{ team.name }}</span>
          </div>
          <div class="team-actions">
            <button @click="showTeamDetails">团体详情</button>
            <button @click="confirmLeaveTeam">退出团体</button>
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
      </div>
    </div>
  </template>
  
  <script>
  import { ref, onMounted } from 'vue'
  import axios from 'axios'
  
  export default {
    setup() {
        const team = ref(null)
        const teamMembers = ref([])
        const showDetails = ref(false)
        const isLoading = ref(true)

      const fetchTeamInfo = async () => {
        try {
            isLoading.value = true
            const response = await axios.get('/api/team-info')
            team.value = response.data
          } catch (error) {
            console.error('获取团体信息失败:', error)
          } finally {
            isLoading.value = false
          }
      }
  
      const showTeamDetails = async () => {
        try {
          const response = await axios.get('/api/team-members')
          teamMembers.value = response.data
          showDetails.value = true
        } catch (error) {
          console.error('获取团体成员失败:', error)
        }
      }
  
      const confirmLeaveTeam = () => {
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
  
      onMounted(fetchTeamInfo)
  
      return {
        team,
        teamMembers,
        showDetails,
        isLoading,
        showTeamDetails,
        confirmLeaveTeam
      }
    }
  }
  </script>
  
  <style scoped>
  .team-info-container {
    display: flex;
    justify-content: center;
    width: 100%;
    padding-top: 20px; /* 添加上方间距 */
  }
  
  .no-team-message, .team-info {
    width: 100%;
    max-width: 800px;
  }
  
  .team-info h2 {
    text-align: center;
    margin-bottom: 20px;
  }
  
  .team-info-row {
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
  }
  
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