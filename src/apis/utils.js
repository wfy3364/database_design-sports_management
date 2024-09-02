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

export { convertTime, judgeState }