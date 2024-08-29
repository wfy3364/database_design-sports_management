function convertTime(time) {
  const targetDate = new Date(time);
  return targetDate.getFullYear() + '-'
    + (targetDate.getMonth() + 1).toString().padStart(2, '0') + '-'
    + targetDate.getDate().toString().padStart(2, '0') + ' '
    + targetDate.getHours().toString().padStart(2, '0') + ':'
    + targetDate.getMinutes().toString().padStart(2, '0')
}

export default convertTime