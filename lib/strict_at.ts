const nullableStrictAt = <T>(array: T[], index: number) => {
  if (index < -array.length || index >= array.length) {
    throw RangeError('`index` is out of range');
  }

  const v = array.at(index);
  return v;
};

export const strictAt = <T extends {}>(array: T[], index: number) => {
  const v = nullableStrictAt(array, index);

  if (v == null) {
    throw TypeError('value is nullable');
  }

  return v;
};
