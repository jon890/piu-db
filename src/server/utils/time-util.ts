import dayjs from "dayjs";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.tz.setDefault("Asia/seoul");

function convertUTC(daystr: string) {
  // example "2024-03-05 21:46:37 (GMT+9)"
  let date = dayjs(daystr);

  if (daystr.includes("GMT")) {
    const gmt = daystr.substring(daystr.indexOf("(") + 1, daystr.indexOf(")"));
    const tz = Number(gmt.charAt(3) + gmt.charAt(4));
    date = date.subtract(tz, "hour");
  }

  return date;
}

function format(serverDate: Date, formatStr: string) {
  return dayjs.utc(serverDate).tz().format(formatStr);
}

function formatUTC(serverDate: Date, formatStr: string) {
  return dayjs.utc(serverDate).format(formatStr);
}

function now() {
  return dayjs.utc().toDate();
}

function setMaxTime(date: Date) {
  return dayjs(date)
    .set("hour", 23)
    .set("minute", 59)
    .set("second", 59)
    .toDate();
}

function isBetween(startDate: Date, endDate: Date) {
  const now = dayjs.utc();
  return now.isAfter(startDate) && now.isBefore(endDate);
}

const TimeUtil = {
  convertUTC,
  format,
  formatUTC,
  now,
  setMaxTime,
  isBetween,
};

export default TimeUtil;
