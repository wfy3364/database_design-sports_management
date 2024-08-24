<script setup>
import { ref, computed } from 'vue';
import { Line } from 'vue-chartjs';
import { Chart as ChartJS, LineElement, PointElement, CategoryScale, LinearScale, Filler, Title } from 'chart.js';

ChartJS.register(LineElement, PointElement, CategoryScale, LinearScale, Filler, Title);

const sportsOption = ref('0');
const venueOption = ref('0');
const revenueTypeOption = ref('2');
const reserveTypeOption = ref('2');
const revenueType = ref('daily');
const reserveType = ref('daily');

const reserveDescription = {
  sum: {
    title: '总预约人次',
    value: 123.456
  },
  max: {
    title: '最高预约人次',
    value: 23.456
  },
  avg: {
    title: '平均预约人次',
    value: 3.456
  },
}

const revenueDescription = {
  sum: {
    title: '总营收',
    date: ['2024-08-01', '2024-08-02'],
    value: [123.456, 234.567],
  },
  max: {
    title: '最高营收',
    date: ['2024-08-01', '2024-08-02'],
    value: [23.456, 34.567],
  },
  avg: {
    title: '平均营收',
    date: ['2024-08-01', '2024-08-02'],
    value: [3.456, 4.567],
  },
}

const changeRevenueType = (newView) => {
  revenueType.value = newView;
};

const changeReserveType = (newView) => {
  reserveType.value = newView;
};

const reserveDataList = {
  daily: {
    labels: ['2024-08-01', '2024-08-02', '2024-08-03', '2024-08-04', '2024-08-05', '2024-08-06', '2024-08-07', '2024-08-08', '2024-08-09'],
    data: [100, 200, 150, 100, 200, 150, 100, 200, 150],
  },
  monthly: {
    labels: ['2024-08', '2024-07', '2024-06'],
    data: [3000, 2800, 3200],
  },
  yearly: {
    labels: ['2024', '2023', '2022'],
    data: [36000, 34000, 33000],
  },
};

const revenueDataList = {
  daily: {
    labels: ['2024-08-01', '2024-08-02', '2024-08-03', '2024-08-04', '2024-08-05', '2024-08-06', '2024-08-07', '2024-08-08', '2024-08-09'],
    data: [100, 200, 150, 100, 200, 150, 100, 200, 150],
  },
  monthly: {
    labels: ['2024-08', '2024-07', '2024-06'],
    data: [3000, 2800, 3200],
  },
  yearly: {
    labels: ['2024', '2023', '2022'],
    data: [36000, 34000, 33000],
  },
};

const reserveData = computed(() => ({
  labels: reserveDataList[reserveType.value].labels,
  datasets: [
    {
      label: '预约量',
      data: reserveDataList[reserveType.value].data,
      borderColor: '#FF5733',
      backgroundColor: 'rgba(255, 87, 51, 0.2)',
      borderWidth: 3,
      fill: true,
    },
  ],
}));

const revenueData = computed(() => ({
  labels: revenueDataList[revenueType.value].labels,
  datasets: [
    {
      label: '营收量',
      data: revenueDataList[revenueType.value].data,
      borderColor: '#FF5733',
      backgroundColor: 'rgba(255, 87, 51, 0.2)',
      borderWidth: 3,
      fill: true,
    },
  ],
}));

const reserveChart = {
  responsive: true,
  plugins: {
    legend: { position: 'top' },
    title: {
      display: true,
      text: '用户预约数据图',
      font: { size: 15, weight: 'bold' },
      padding: { bottom: 20 }
    },
    tooltip: {
      callbacks: { label: (tooltipItem) => `预约量: ${tooltipItem.raw}` },
    },
  },
  scales: {
    y: {
      min: 0,
      max: 500,
      ticks: { stepSize: 100 },
      title: { display: true, text: '预约量' }
    },
    x: {
      title: { display: true, text: '时间' }
    }
  },
  elements: {
    line: { tension: 0.1 },
    point: {
      radius: 5,
      backgroundColor: '#FF5733',
      borderColor: '#FFFFFF',
      borderWidth: 2,
    },
  },
};

const revenueChart = {
  responsive: true,
  plugins: {
    legend: { position: 'top' },
    title: {
      display: true,
      text: '营收量折线图',
      font: { size: 15, weight: 'bold' },
      padding: { bottom: 20 }
    },
    tooltip: {
      callbacks: { label: (tooltipItem) => `营收: ${tooltipItem.raw}` },
    },
  },
  scales: {
    y: {
      min: 0,
      max: 500,
      ticks: { stepSize: 100 },
      title: { display: true, text: '营收量' }
    },
    x: {
      title: { display: true, text: '时间' }
    }
  },
  elements: {
    line: { tension: 0.1 },
    point: {
      radius: 5,
      backgroundColor: '#FF5733',
      borderColor: '#FFFFFF',
      borderWidth: 2,
    },
  },
};
</script>


<template>
  <div class="Statistics">
    <div class="titleText">统计数据</div>
    
    <div class="FilterArea">
      <div class="FilterOption">
        <div class="FilterText">运动类型</div>
        <el-radio-group v-model="sportsOption">
          <el-radio-button value="0">全部</el-radio-button>
          <el-radio-button value="1">羽毛球</el-radio-button>
          <el-radio-button value="2">乒乓球</el-radio-button>
          <el-radio-button value="3">网球</el-radio-button>
          <el-radio-button value="4">健身</el-radio-button>
          <el-radio-button value="5">田径</el-radio-button>
          <el-radio-button value="6">足球</el-radio-button>
          <el-radio-button value="7">篮球</el-radio-button>
          <el-radio-button value="8">排球</el-radio-button>
        </el-radio-group>
      
        <div v-if="sportsOption === '0'">
          <div class="FilterText">场地</div>
          <el-radio-group v-model="venueOption">
            <el-radio-button value="0">场地1</el-radio-button>
            <el-radio-button value="1">场地2</el-radio-button>
            <el-radio-button value="2">场地3</el-radio-button>
            <el-radio-button value="3">场地4</el-radio-button>
          </el-radio-group>
        </div>
      </div>

      <div>
        <div class="subTitleText">用户预约数据</div>
        <div class="stats-container">
          <div class="stat-item">{{reserveDescription.sum.title}}: {{reserveDescription.sum.value}}</div>
          <div class="stat-item">{{reserveDescription.max.title}}: {{reserveDescription.max.value}}</div>
          <div class="stat-item">{{reserveDescription.avg.title}}: {{reserveDescription.avg.value}}</div>
        </div>
        <div class="chart-container">
          <div class="controls">
            <el-radio-group v-model="reserveTypeOption">
              <el-radio-button value="2" @click="changeReserveType('daily')">按日</el-radio-button>
              <el-radio-button value="1" @click="changeReserveType('monthly')">按月</el-radio-button>
              <el-radio-button value="0" @click="changeReserveType('yearly')">按年</el-radio-button>
            </el-radio-group>
          </div>
          <Line :data="reserveData" :options="reserveChart" class="line-chart" />
        </div>
      </div>

      <div>
        <div class="subTitleText">用户预约数据</div>
        <div class="stats-container">
          <div class="stat-item">{{revenueDescription.sum.title}}: {{revenueDescription.sum.value}}</div>
          <div class="stat-item">{{revenueDescription.max.title}}: {{revenueDescription.max.value}}</div>
          <div class="stat-item">{{revenueDescription.avg.title}}: {{revenueDescription.avg.value}}</div>
        </div>
        <div class="chart-container">
          <div class="controls">
            <el-radio-group v-model="revenueTypeOption">
              <el-radio-button value="2" @click="changeRevenueType('daily')">按日</el-radio-button>
              <el-radio-button value="1" @click="changeRevenueType('monthly')">按月</el-radio-button>
              <el-radio-button value="0" @click="changeRevenueType('yearly')">按年</el-radio-button>
            </el-radio-group>
          </div>
          <Line :data="revenueData" :options="revenueChart" class="line-chart" />
        </div>
      </div>
    </div>
  </div>
</template>


<style scoped>
.Statistics {
  display: flex;
  flex-direction: column;
  width: calc(100% - 20px);
  padding-bottom: 10px;
  margin: 10px;
  border-radius: 5px;
  background-color: white;
  border: 1px solid lightgray;
}

.titleText{
  display: flex;
  justify-content: center;
  padding: 10px;
  /* border-bottom: 1px solid black; */
  font-size: 30px;
  font-weight: 700;
}

.subTitleText{
  display: flex;
  justify-content: center;
  padding: 10px;
  /* border-bottom: 1px solid black; */
  font-size: 25px;
  font-weight: 700;
}

.chart-container {
  width: 90%;
  margin: auto; /* 确保容器居中 */
  padding: 20px;
  height: 600px;
  /* border-top: 1px solid lightgray;
  border-bottom: 1px solid lightgray;
  border-left: 1px solid lightgray;
  border-right: 1px solid lightgray; */
  display: flex; /* 使用 Flexbox 布局 */
  justify-content: center; /* 横向居中 */
  align-items: center; /* 垂直居中 */
}


.line-chart {
  width: 100%; /* 调整为100%以适应父容器 */
  height: 500px; /* 调整图表的高度 */
  margin: 0;
  padding: 0;
}

.controls {
  position: absolute; /* 绝对定位 */
  top: 10px; /* 距离容器顶部的距离 */
  left: 80%; /* 水平居中 */
  transform: translateX(-50%); /* 居中对齐 */
  z-index: 10; /* 确保按钮在图表上方 */
  display: flex;
  gap: 10px; /* 按钮之间的间距 */
  width: 200px;
}

.FilterOption{
  margin-bottom: 50px;
  border-top: 1px solid lightgray;
  border-bottom: 1px solid lightgray;
  padding: 20px;
  padding-left: 10%;
}

.FilterArea{
  display: flex;
  flex-direction: column;
  padding: 10px;
}

.stats-container {
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px; /* 间距调整 */
  margin-top: 10px; /* 间距调整 */
  width: 70%;
  /* border-top: 1px solid lightgray;
  border-bottom: 1px solid lightgray;
  border-left: 1px solid lightgray;
  border-right: 1px solid lightgray; */
  margin-left: 15%;
}

.stat-item {
  font-size: 25px;
  /* font-weight: bold; */
}

</style>
