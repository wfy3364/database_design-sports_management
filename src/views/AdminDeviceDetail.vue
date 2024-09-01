<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router'; // 导入 useRouter
import { convertTime, judgeState } from '@/apis/utils';

const router = useRouter(); // 初始化路由器

const deviceInfo = {
  id: 1,
  name: "设备01",
  venue: "场地1",
  state: 0,
  introTime: "2024-08-20 13:00"
};

const overviewDisplay = {
  "设备ID：": deviceInfo.id,
  "设备名称：": deviceInfo.name,
  "设备引入时间：": deviceInfo.introTime, 
};

// 计算维修记录状态
const repairRecord = [{
  id: 1,
  deviceId: 1,
  deviceName: '设备1',
  venueId: 1,
  venueName: '场地1',
  start_time: new Date("August 20, 2024 13:00:00"),
  end_time: new Date("August 20, 2024 14:00:00"),
  description: '设备正常维修',
},
{
  id: 2,
  deviceId: 1,
  deviceName: '设备1',
  venueId: 1,
  venueName: '场地1',
  start_time: new Date("August 19, 2024 13:00:00"),
  end_time: new Date("August 19, 2024 14:00:00"),
  description: "维修描述过长时，多余内容隐藏，当鼠标移动到对应位置时以提示框的方式显示",
},
{
  id: 3,
  deviceId: 1,
  deviceName: '设备1',
  venueId: 1,
  venueName: '场地1',
  start_time: new Date("August 19, 2024 19:00:00"),
  end_time: new Date("August 19, 2024 20:00:00"),
  description: "这里是维修描述文字",
},
{
  id: 4,
  deviceId: 1,
  deviceName: '设备1',
  venueId: 1,
  venueName: '场地1',
  start_time: new Date("September 19, 2024 13:00:00"),
  end_time: new Date("September 19, 2024 14:00:00"),
  description: "这里是维修描述文字",
}];

repairRecord.map((record) => {
  record.start_str = convertTime(record.start_time);
  record.state = judgeState(record.start_time, record.end_time);
  return record;
})


// 跳转到设备列表页面
function goToDeviceList() {
  router.push('/AdminDevice'); // 设备列表页面的路由地址
}
</script>

<template>
  <div class="AdminDeviceDetail">
    <div class="AdminDeviceHeader">
      <el-button class="BackButton" @click="goToDeviceList">&lt;&nbsp;&nbsp;设备总览</el-button>
      <div class="AdminDeviceTitle">{{ deviceInfo.name }}</div>
      <el-button class="EditButton">编辑</el-button>
    </div>
    <div class="DeviceOverview">
      <img class="DeviceImg" alt="设备图片"/>
      <div class="OverviewText">
        <div class="OverviewLine" v-for="(val, k) in overviewDisplay" :key="k">
          <div class="OverviewDescription">{{ k }}</div>
          <div>{{ val }}</div>
        </div>
        <div class="OverviewLine">
          <div class="OverviewDescription">设备所在场地：</div>
          <el-button size="small">{{ deviceInfo.venue }}</el-button>
        </div>
        <div class="OverviewLine">
          <div class="OverviewDescription">状态：</div>
          <span v-if="deviceInfo.state === 0" style="color: green">使用中</span>
          <span v-if="deviceInfo.state === 1" style="color: red">维修中</span>
          <span v-if="deviceInfo.state === 2" style="color: orange">待维修</span>
          <span v-if="deviceInfo.state === 3" style="color: gray">未使用</span>
        </div>
      </div>
    </div>
    <div class="DetailArea">
      <div class="MaintainenceArea">
        <div class="MaintainenceTitle">维修记录</div>
        <el-table :data="repairRecord" border>
          <el-table-column prop="id" label="编号" width="55"></el-table-column>
          <el-table-column prop="start_str" label="时间" width="140"></el-table-column>
          <el-table-column prop="description" label="描述" :show-overflow-tooltip="{ effect: 'light'}"></el-table-column>
          <el-table-column label="状态" width="80">
            <template #default="item">
              <div v-if="item.row.state === 0" style="color: green">已维修</div>
              <div v-if="item.row.state === 1" style="color: red">维修中</div>
              <div v-if="item.row.state === 2" style="color: orange">待维修</div>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="100">
            <template #default="item">
              <el-button @click="showDetails(item.row)">详情</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
  </div>
</template>

<style scoped>

.AdminDeviceDetail{
  display: flex;
  flex-direction: column;
  width: calc(100% - 20px);
  padding-bottom: 10px;
  margin: 10px;
  border-radius: 5px;
  background-color: white;
  border: 1px solid lightgray;
}

.AdminDeviceHeader{
  display: flex;
  padding: 10px;
  border-bottom: 1px solid black;
}

.BackButton{
  margin-left: 0px;
  margin-right: auto;
}

.EditButton{
  margin-right: 0px;
  margin-left: auto;
}

.AdminDeviceTitle{
  align-self: center;
  font-size: 18px;
  font-weight: 700;
}

.DeviceOverview{
  display: flex;
  height: 320px;
  padding: 10px;
  justify-content: center;
  align-items: center;
  margin-top: 20px;
}

.DeviceImg{
  width: 300px;
  height: 300px;
  margin-right: 50px;
}

.OverviewText{
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
}

.OverviewLine{
  display: flex;
  margin-bottom: 5%; /* 修改条目间距 */
}

.OverviewDescription{
  width: 150px;
  font-weight: 700;
}

.DetailArea{
  display: flex;
  justify-content: space-evenly;
}

.MaintainenceArea{
  display: flex;
  flex-direction: column;
  width: 80%;
}

.MaintainenceTitle{
  display: flex;
  justify-content: center;
  font-weight: 700;
  padding: 5px;
  border: 1px solid lightgray;
}

</style>