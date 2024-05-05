var moment = require('moment');

function dateFormatter(date) {
  const today = moment().startOf("day");
  const yesterday = moment().subtract(1, "days").startOf("day");
  const isToday = moment(date).isSame(today, "day");
  const isYesterday = moment(date).isSame(yesterday, "day");

  let formatedTime;
  if (isToday || isYesterday) {
    formatedTime = moment(date).calendar();
  } else {
    formatedTime = moment(date).format("MMMM Do YYYY, h:mm a");
  }
  return formatedTime;
}

module.exports = dateFormatter;