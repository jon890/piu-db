import dayjs, { Dayjs } from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

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

const TimeUtil = {
  convertUTC,
  format,
};

export default TimeUtil;
