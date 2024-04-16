function notEmpty<TValue>(value: TValue | null | undefined): value is TValue {
  if (value === null || value === undefined) return false;
  const testDummy: TValue = value;
  return true;
}

const ArrayUtil = {
  notEmpty,
};

export default ArrayUtil;
