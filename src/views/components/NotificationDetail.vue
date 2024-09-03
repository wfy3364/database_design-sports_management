<script setup>

import { ref, onMounted } from 'vue'

const props = defineProps({
  selectedAnnouncement: {
    id: String,
    type: String,
    title: String,
    date: Date,
    content: String,
  }
});

const emit = defineEmits(['closeModal']);

const notificationDetailVisible = ref(true);

const isConfirmationType = (announcement) => {
  return announcement && (announcement.type === 'team/userCheck' || announcement.type === 'team/adminCheck');
};

const handleClose = () => {
  emit('closeModal');
}

const handleDecision = async (decision) => {
  const action = decision === 'accept' ? '同意' : '拒绝';
  isLoading.value = true; // 开始加载
  try {
    const response = await fetch('/api/update-group-status', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        notificationId: selectedAnnouncement.value.id,
        decision: decision,
      }),
    });

    const result = await response.json();
    if (result.success) {
      ElMessage.success(`${action}操作成功`);
      isDetailModalVisible.value = false;
    } else {
      ElMessage.error(`${action}操作失败`);
    }
  } catch (error) {
    console.error(error);
    ElMessage.error(`${action}操作出现错误`);
  } finally {
    isLoading.value = false; // 请求结束，停止加载
  }
};

// onMounted(() => {
//   notificationDetailVisible.value = true;
// })

</script>

<template>
  <!-- 查看通知内容的模态框 -->
  <el-dialog v-model="notificationDetailVisible" :title="selectedAnnouncement.title" 
  :before-close="handleClose">
    <div class="modal-content">
      <p>{{ selectedAnnouncement.content }}</p>
    </div>
    <!-- 对于 team/userCheck 和 team/adminCheck 类型的通知，显示“同意”和“拒绝”按钮 -->
    <template #footer>
      <div v-if="isConfirmationType(selectedAnnouncement)" class="dialog-footer">
        <el-button @click="handleDecision('accept')" type="primary">同意</el-button>
        <el-button @click="handleDecision('reject')" type="danger">拒绝</el-button>
      </div>
      <div v-else>
        <el-button @click="emit('closeModal')" type="primary">确定</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<style scoped>
.modal-content {
  padding: 20px;
  line-height: 1.5;
}

</style>