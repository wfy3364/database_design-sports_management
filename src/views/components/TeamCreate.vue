<template>
    <div class="team-management">
      <h1>创建/加入团体</h1>
      
      <!-- 创建团体 -->
      <div class="create-team">
        <h2>创建团体</h2>
        <input v-model="newTeam.name" placeholder="团体名称" />
        <textarea v-model="newTeam.description" placeholder="团队描述"></textarea>
        <button @click="createTeam">创建团体</button>
      </div>
  
      <!-- 加入团体 -->
      <div class="join-team">
        <h2>加入团体</h2>
        <input v-model="searchTerm" placeholder="团体ID或名称" />
        <button @click="searchTeam">搜索团体</button>
        
        <div v-if="foundTeam">
          <h3>{{ foundTeam.name }}</h3>
          <p>{{ foundTeam.description }}</p>
          <textarea v-model="joinRequest.note" placeholder="申请备注"></textarea>
          <button @click="joinTeam">申请加入</button>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import { ref, reactive } from 'vue'
  import axios from 'axios'
  
  export default {
    setup() {
      const newTeam = reactive({
        name: '',
        description: ''
      })
  
      const searchTerm = ref('')
      const foundTeam = ref(null)
      const joinRequest = reactive({
        teamId: '',
        note: ''
      })
  
      const createTeam = async () => {
        try {
          const response = await axios.post('/api/teams', newTeam)
          alert('团体创建成功！')
          newTeam.name = ''
          newTeam.description = ''
        } catch (error) {
          alert('创建失败: ' + error.message)
        }
      }
  
      const searchTeam = async () => {
        try {
          const response = await axios.get(`/api/teams/search?term=${searchTerm.value}`)
          foundTeam.value = response.data
        } catch (error) {
          alert('搜索失败: ' + error.message)
        }
      }
  
      const joinTeam = async () => {
        try {
          const response = await axios.post('/api/teams/join', {
            teamId: foundTeam.value.id,
            note: joinRequest.note
          })
          alert('申请已提交，等待管理员审核')
          joinRequest.note = ''
          foundTeam.value = null
        } catch (error) {
          alert('申请失败: ' + error.message)
        }
      }
  
      return {
        newTeam,
        createTeam,
        searchTerm,
        searchTeam,
        foundTeam,
        joinRequest,
        joinTeam
      }
    }
  }
  </script>
  
  <style scoped>
  .team-management {
    max-width: 600px;
    margin: 0 auto;
    padding: 20px;
    line-height: 1.6; /* 增加整体行间距 */
  }
  
  h1, h2, h3 {
    margin-bottom: 20px; /* 增加标题下方的间距 */
  }
  
  input, textarea {
    width: 100%;
    margin-bottom: 20px; /* 增加输入框之间的间距 */
    padding: 10px; /* 增加输入框内部的间距 */
    font-size: 16px; /* 增加字体大小 */
  }
  
  textarea {
    min-height: 100px; /* 设置文本区域的最小高度 */
  }
  
  button {
    padding: 10px 20px; /* 增加按钮的内部间距 */
    margin-bottom: 20px; /* 增加按钮下方的间距 */
    font-size: 16px; /* 增加按钮文字大小 */
  }
  
  .create-team, .join-team {
    margin-bottom: 40px; /* 增加主要区块之间的间距 */
  }
  
  p {
    margin-bottom: 15px; /* 增加段落之间的间距 */
  }
  </style>