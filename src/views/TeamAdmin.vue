<template>
  <div v-if="!isCreator" class="message-container">
    <p class="non-creator-message">您并非创建者</p>
  </div>
  <div v-else>
    <h2>{{ teamInfo.name }}</h2>
    <button @click="showAddMemberModal = true">添加成员</button>
    
    <ul>
      <li v-for="member in teamMembers" :key="member.id">
        {{ member.id }} - {{ member.nickname }}
        <button @click="showManageModal(member)">管理</button>
      </li>
    </ul>

    <!-- 添加成员模态框 -->
    <modal v-if="showAddMemberModal" @close="showAddMemberModal = false">
      <h3>添加成员</h3>
      <input v-model="searchQuery" placeholder="输入用户ID或昵称">
      <button @click="searchUser">搜索</button>
      <ul>
        <li v-for="user in searchResults" :key="user.id">
          {{ user.id }} - {{ user.nickname }}
          <button @click="addMember(user)">添加</button>
        </li>
      </ul>
    </modal>

    <!-- 管理成员模态框 -->
    <modal v-if="showAdminModal" @close="showAdminModal = false">
      <h3>管理成员: {{ selectedMember.nickname }}</h3>
      <button @click="toggleAdmin">{{ selectedMember.isAdmin ? '移除管理员权限' : '添加管理员权限' }}</button>
      <button @click="kickMember">踢出团队</button>
    </modal>

    <!-- 确认模态框 -->
    <modal v-if="showConfirmModal" @close="showConfirmModal = false">
      <h3>确认操作</h3>
      <p>{{ confirmMessage }}</p>
      <button @click="confirmAction">确认</button>
      <button @click="showConfirmModal = false">取消</button>
    </modal>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';

const isCreator = ref(true);
const teamInfo = ref({});
const teamMembers = ref([]);
const showAddMemberModal = ref(false);
const showAdminModal = ref(false);
const showConfirmModal = ref(false);
const searchQuery = ref('');
const searchResults = ref([]);
const selectedMember = ref(null);
const confirmMessage = ref('');
const confirmCallback = ref(null);

onMounted(async () => {
  // await fetchTeamInfo();
});

const fetchTeamInfo = async () => {
  try {
    const response = await axios.get('/api/team-info');
    isCreator.value = response.data.isCreator;
    teamInfo.value = response.data.teamInfo;
    teamMembers.value = response.data.teamMembers;
  } catch (error) {
    console.error('获取团队信息失败:', error);
  }
};

const searchUser = async () => {
  try {
    const response = await axios.get(`/api/search-users?query=${searchQuery.value}`);
    searchResults.value = response.data;
  } catch (error) {
    console.error('搜索用户失败:', error);
  }
};

const addMember = async (user) => {
  try {
    await axios.post('/api/add-member', { userId: user.id });
    await fetchTeamInfo();
    showAddMemberModal.value = false;
  } catch (error) {
    console.error('添加成员失败:', error);
  }
};

const showManageModal = (member) => {
  selectedMember.value = member;
  showAdminModal.value = true;
};

const toggleAdmin = () => {
  confirmMessage.value = `确定要${selectedMember.value.isAdmin ? '移除' : '添加'}管理员权限吗？`;
  confirmCallback.value = async () => {
    try {
      await axios.post('/api/toggle-admin', { userId: selectedMember.value.id });
      await fetchTeamInfo();
      showManageModal.value = false;
      showConfirmModal.value = false;
    } catch (error) {
      console.error('更改管理员权限失败:', error);
    }
  };
  showConfirmModal.value = true;
};

const kickMember = () => {
  confirmMessage.value = '确定要将该成员踢出团队吗？';
  confirmCallback.value = async () => {
    try {
      await axios.post('/api/kick-member', { userId: selectedMember.value.id });
      await fetchTeamInfo();
      showManageModal.value = false;
      showConfirmModal.value = false;
    } catch (error) {
      console.error('踢出成员失败:', error);
    }
  };
  showConfirmModal.value = true;
};

const confirmAction = () => {
  if (confirmCallback.value) {
    confirmCallback.value();
  }
};
</script>

<style scoped>
.team-management {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
}

.message-container {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100vh;
}

.non-creator-message {
  font-size: 1.2em;
  color: #333;
}

.content {
  max-width: 600px;
  width: 100%;
  margin: 0 auto;
  text-align: center;
}
    
.add-button {
  margin-bottom: 20px;
}
    
.member-list {
  list-style-type: none;
  padding: 0;
}

.member-list li {
  margin-bottom: 10px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.manage-button {
  margin-left: 10px;
}
    
</style>