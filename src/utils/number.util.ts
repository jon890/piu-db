import Decimal from "decimal.js";

function formatScore(num: number | Decimal) {
  let str = "";
  if (num instanceof Decimal) {
    str = num.toFixed(0);
  } else {
    str = num.toString();
  }

  let integerParts = str;
  let decimalParts = "";
  const hasDecimalParts = str.indexOf(".") > -1;
  if (hasDecimalParts) {
    const [a, b] = str.split(".");
    integerParts = a;
    decimalParts = "." + b;
  }

  // 3 자리마다 끊어서 , 표시
  let ret = "";
  let count = 1;
  for (let i = integerParts.length - 1; i >= 0; i--) {
    ret = integerParts[i] + ret;
    if (integerParts[i - 1] && count % 3 == 0) {
      ret = "," + ret;
    }

    count++;
  }

  return ret + decimalParts;
}

const NumberUtil = {
  formatScore,
};

export default NumberUtil;
