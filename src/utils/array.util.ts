function notEmpty<TValue>(value: TValue | null | undefined): value is TValue {
  if (value === null || value === undefined) return false;
  const testDummy: TValue = value;
  return true;
}

function associatedBy<KEY extends number | string, ITEM>(
  items: ITEM[],
  func: (item: ITEM) => KEY
): Map<KEY, ITEM> {
  const map = new Map<KEY, ITEM>();

  for (const item of items) {
    const key = func(item);
    map.set(key, item);
  }

  return map;
}

function associatedByList<KEY extends number | string, ITEM>(
  items: ITEM[],
  func: (item: ITEM) => KEY
): Map<KEY | string, ITEM[]> {
  const map = new Map<KEY, ITEM[]>();

  for (const item of items) {
    const key = func(item);

    if (map.has(key)) {
      map.get(key)?.push(item);
    } else {
      map.set(key, [item]);
    }
  }

  return map;
}

const ArrayUtil = {
  notEmpty,
  associatedBy,
  associatedByList,
};

export default ArrayUtil;
