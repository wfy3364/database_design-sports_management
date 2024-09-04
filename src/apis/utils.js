import dayjs from "dayjs";

function convertTime(time) {
  if (!time) {
    return '';
  }
  const targetDate = new Date(time);
  return targetDate.getFullYear() + '-'
    + (targetDate.getMonth() + 1).toString().padStart(2, '0') + '-'
    + targetDate.getDate().toString().padStart(2, '0') + ' '
    + targetDate.getHours().toString().padStart(2, '0') + ':'
    + targetDate.getMinutes().toString().padStart(2, '0')
}

function judgeState(start_time, end_time) {
  if (!start_time || !end_time) {
    return 3; //未确定
  }
  const now = new Date();
  const start = new Date(start_time);
  const end = new Date(end_time);

  if (now >= start && now <= end) {
    return 1; // 维修中
  }
  else if (now < start) {
    return 2; // 待维修
  }
  else {
    return 0; // 已维修
  }
}

function timeSort(arr, timeProp, slicePos) {
  const res = arr;
  res.sort((item1, item2) => {
    return dayjs(item1[timeProp]).isAfter(dayjs(item2[timeProp]), 'second') ? -1 : 0;
  });
  console.log(res);
  return slicePos > 0 ? res.slice(0, slicePos) : res;
}

export { convertTime, judgeState, timeSort }