function notEmpty<TValue>(value: TValue | null | undefined): value is TValue {
  if (value === null || value === undefined) return false;
  const testDummy: TValue = value;
  return true;
}

function associatedBy<K>(
  items: K[],
  func: (item: K) => number
): Map<number, K> {
  const map = new Map<number, K>();

  for (const item of items) {
    const key = func(item);
    map.set(key, item);
  }

  return map;
}

function associatedByList<K>(
  items: K[],
  func: (item: K) => number
): Map<number, K[]> {
  const map = new Map<number, K[]>();

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
