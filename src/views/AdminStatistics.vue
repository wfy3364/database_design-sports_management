<script setup>
import { ref, computed } from 'vue';
import { Line } from 'vue-chartjs';
import { Chart as ChartJS, LineElement, PointElement, CategoryScale, LinearScale, Filler, Title } from 'chart.js';

ChartJS.register(LineElement, PointElement, CategoryScale, LinearScale, Filler, Title);

const sportsOption = ref('0');
const venueOption = ref('0');
const revenueType = ref('daily');
const reserveType = ref('daily');


const value = ref([])  //new! 已选列表
const venueOptions = [  //new! 可选场地列表
  {
    value: '场地1',
    label: '场地1',
  },
  {
    value: '场地2',
    label: '场地2',
  },
  {
    value: '场地3',
    label: '场地3',
  },
  {
    value: '场地4',
    label: '场地4',
  },
  {
    value: '场地5',
    label: '场地5',
  },
]

const sportsOptions = [ //新增运动类型选择
  { value: '0', label: '全部' },
  { value: '1', label: '羽毛球' },
  { value: '2', label: '乒乓球' },
  { value: '3', label: '网球' },
  { value: '4', label: '健身' },
  { value: '5', label: '田径' },
  { value: '6', label: '足球' },
  { value: '7', label: '篮球' },
  { value: '8', label: '排球' },
];

// const venueOptions = [ //新增场地选择
//   { value: '0', label: '场地1' },
//   { value: '1', label: '场地2' },
//   { value: '2', label: '场地3' },
//   { value: '3', label: '场地4' },
// ];

const reserveDescription = {
  sum: {
    title: '总预约人次',
    value: {
      daily: 123.456,
      monthly: 456.789,
      yearly: 1111.11,
    }  
  },
  max: {
    title: '最高预约人次',
    value: {
      daily: 23.456,
      monthly: 234.56,
      yearly: 2345.56,
    }
  },
  avg: {
    title: '平均预约人次',
    value: {
      daily: 3.456,
      monthly: 23.45,
      yearly: 234.56,
    }
  },
}

const revenueDescription = {
  sum: {
    title: '总营收',
    value: {
      daily: 123.456,
      monthly: 456.789,
      yearly: 1111.11,
    }  
  },
  max: {
    title: '最高营收',
    value: {
      daily: 23.456,
      monthly: 234.56,
      yearly: 2345.56,
    }
  },
  avg: {
    title: '平均营收',
    value: {
      daily: 3.456,
      monthly: 23.45,
      yearly: 234.56,
    }
  },
}


const reserveDataList = {
  daily: {
    labels: ['08-01', '08-02', '08-03', '08-04', '08-05', '08-06', '08-07'],
    data: [100, 200, 150, 100, 200, 150, 100, 200, 150],
  },
  monthly: {
    labels: ['07-27', '07-28', '07-29', '07-30', '07-31', '08-01', '08-02', '08-03', '08-04', '08-05', '08-06', '08-07', '08-08', '08-09', '08-10', '08-11', '08-12', '08-13', '08-14', '08-15', '08-16', '08-17', '08-18', '08-19', '08-20', '08-21', '08-22', '08-23', '08-24', '08-25'],
    data: [3000, 2800, 3200, 3000, 2800, 3200, 3000, 2800, 3200, 3000, 2800, 3200, 3000, 2800, 3200, 3000, 2800, 3200, 3000, 2800, 3200, 3000, 2800, 3200, 3000, 2800, 3200, 3000, 2800, 3200],
  },
  yearly: {
    labels: ['2023-09', '2023-10', '2023-11', '2023-12', '2024-01', '2024-02', '2024-03', '2024-04', '2024-05', '2024-06', '2024-07', '2024-08'],
    data: [36000, 34000, 33000, 36000, 34000, 33000, 36000, 34000, 33000, 36000, 34000, 33000],
  }
};

const revenueDataList = {
  daily: {
    labels: ['08-01', '08-02', '08-03', '08-04', '08-05', '08-06', '08-07'],
    data: [100, 200, 150, 100, 200, 150, 100, 200, 150],
  },
  monthly: {
    labels: ['07-27', '07-28', '07-29', '07-30', '07-31', '08-01', '08-02', '08-03', '08-04', '08-05', '08-06', '08-07', '08-08', '08-09', '08-10', '08-11', '08-12', '08-13', '08-14', '08-15', '08-16', '08-17', '08-18', '08-19', '08-20', '08-21', '08-22', '08-23', '08-24', '08-25'],
    data: [3000, 2800, 3200, 3000, 2800, 3200, 3000, 2800, 3200, 3000, 2800, 3200, 3000, 2800, 3200, 3000, 2800, 3200, 3000, 2800, 3200, 3000, 2800, 3200, 3000, 2800, 3200, 3000, 2800, 3200],
  },
  yearly: {
    labels: ['2023-09', '2023-10', '2023-11', '2023-12', '2024-01', '2024-02', '2024-03', '2024-04', '2024-05', '2024-06', '2024-07', '2024-08'],
    data: [36000, 34000, 33000, 36000, 34000, 33000, 36000, 34000, 33000, 36000, 34000, 33000],
  }
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

const getMaxValue = (data) => Math.max(...data); //

const reserveChart = computed(() => ({
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
      max: getMaxValue(reserveData.value.datasets[0].data) * 1.2, //上限改变
      ticks: { stepSize: Math.max(100, getMaxValue(reserveData.value.datasets[0].data) / 5) },
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
}));

const revenueChart = computed(() => ({
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
      max: getMaxValue(revenueData.value.datasets[0].data) * 1.2, //上限改变
      ticks: { stepSize: Math.max(100, getMaxValue(revenueData.value.datasets[0].data) / 5) },
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
}));
</script>


<template>
  <div class="Statistics">
    <div class="titleText">统计数据</div>
    
    <div class="FilterArea">
      <div class="FilterOption">
        <div class="FilterText">运动类型</div>
        <el-radio-group v-model="sportsOption">
          <el-radio-button v-for="option in sportsOptions" :key="option.value" :value="option.value">
            {{ option.label }}
          </el-radio-button>
        </el-radio-group>
      </div>
      <div class="FilterOption" v-if="sportsOption !== '0'">
        <div class="FilterText">场地</div>
        <el-select
          v-model="value"
          filterable
          multiple
          placeholder="Select"
          style="width: 400px"
          collapse-tags
          collapse-tags-tooltip
          :max-collapse-tags="5" 
        >
          <el-option
            v-for="item in venueOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </div>
    </div>
    <div class="StatisticsContent">
      <div class="subTitleHeader">
        <div class="subTitleText">用户预约数据</div>
        <div class="controls">
            <el-radio-group v-model="reserveType">
              <el-radio-button value="daily">前一周</el-radio-button>
              <el-radio-button value="monthly">前一月</el-radio-button>
              <el-radio-button value="yearly">前一年</el-radio-button>
            </el-radio-group>
        </div>
      </div>
      <div class="stats-container">
        <el-descriptions direction="vertical" :column="3" size="large" border>
          <el-descriptions-item :label="reserveDescription.sum.title">
            {{ reserveDescription.sum.value[reserveType] }}
          </el-descriptions-item>
          <el-descriptions-item :label="reserveDescription.max.title">
            {{ reserveDescription.max.value[reserveType] }}
          </el-descriptions-item>
          <el-descriptions-item :label="reserveDescription.avg.title">
            {{ reserveDescription.avg.value[reserveType] }}
          </el-descriptions-item>
        </el-descriptions>
      </div>
      <div class="chart-container">
        <Line :data="reserveData" :options="reserveChart" class="line-chart" />
      </div>
    </div>

    <div class="StatisticsContent">
      <div class="subTitleHeader">
        <div class="subTitleText">营收数据</div>
        <div class="controls">
            <el-radio-group v-model="revenueType">
              <el-radio-button value="daily">前一周</el-radio-button>
              <el-radio-button value="monthly">前一月</el-radio-button>
              <el-radio-button value="yearly">前一年</el-radio-button>
            </el-radio-group>
        </div>
      </div>
      <div class="stats-container">
        <el-descriptions direction="vertical" :column="3" size="large" border>
          <el-descriptions-item :label="revenueDescription.sum.title">
            {{ revenueDescription.sum.value[revenueType] }}
          </el-descriptions-item>
          <el-descriptions-item :label="revenueDescription.max.title">
            {{ revenueDescription.max.value[revenueType] }}
          </el-descriptions-item>
          <el-descriptions-item :label="revenueDescription.avg.title">
            {{ revenueDescription.avg.value[revenueType] }}
          </el-descriptions-item>
        </el-descriptions>
      </div>
      <div class="chart-container">
        <Line :data="revenueData" :options="revenueChart" class="line-chart" />
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
  font-size: 20px;
  font-weight: 700;
}

.subTitleHeader{
  display: flex;
  justify-content: center;
  line-height: var(--el-component-size);
  border-bottom: 1px solid black;
}

.subTitleText{
  /* justify-content: center; */
  margin-right: auto;
  padding: 10px;
  font-size: 18px;
  font-weight: 700;
}

.chart-container {
  display: flex; /* 使用 Flexbox 布局 */
  justify-content: center; /* 横向居中 */
  align-items: center; /* 垂直居中 */
  width: 90%;
  margin-left: auto; /* 确保容器居中 */
  margin-right: auto;
  margin-top: 30px;
  margin-bottom: 30px;
  padding: 10px;
  /* height: 600px; */
  /* border-top: 1px solid lightgray;
  border-bottom: 1px solid lightgray;
  border-left: 1px solid lightgray;
  border-right: 1px solid lightgray; */
}


.line-chart {
  width: 100%; /* 调整为100%以适应父容器 */
  height: 500px; /* 调整图表的高度 */
  margin: 0;
  padding: 0;
}

.controls {
  /* position: absolute; */
  /* top: 10px; */
  /* left: 80%; */
  /* transform: translateX(-50%); */
  /* z-index: 10; */
  display: flex;
  margin-left: auto;
  gap: 10px; /* 按钮之间的间距 */
  width: 300px;
}

.FilterArea{
  display: flex;
  flex-direction: column;
  border-top: 1px solid lightgray;
  border-bottom: 1px solid lightgray;
  padding: 10px;
}

.FilterOption{
  display: flex;
  line-height: var(--el-component-size);
  padding: 10px;
  padding-left: 10%;
}

.FilterText{
  width: 100px;
}

.StatisticsContent{
  padding: 10px;
}

.stats-container {
  /* display: flex; */
  /* justify-content: space-between; */
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
