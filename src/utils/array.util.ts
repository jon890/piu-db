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

function maxBy<T>(items: T[], func: (item: T) => number | null) {
  let max_item: T | null = null;
  let max_value: number | null = null;

  for (const item of items) {
    const value = func(item);
    if (value === null) continue;

    if (max_value === null) {
      max_value = value;
      max_item = item;
    }

    if (value > max_value) {
      max_value = value;
      max_item = item;
    }
  }

  return max_item;
}

function minBy<T>(items: T[], func: (item: T) => number | null) {
  let min_item: T | null = null;
  let min_value: number | null = null;

  for (const item of items) {
    const value = func(item);
    if (value === null) continue;

    if (min_value === null) {
      min_value = value;
      min_item = item;
    }

    if (value < min_value) {
      min_value = value;
      min_item = item;
    }
  }

  return min_item;
}

const ArrayUtil = {
  notEmpty,
  associatedBy,
  associatedByList,
  maxBy,
  minBy,
};

export default ArrayUtil;
