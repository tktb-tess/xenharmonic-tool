export const strictAt = <T extends {}>(array: T[], index: number) => {
  const v = array[index];

  if (v == null) {
    throw TypeError('value is undefined');
  }

  return v;
};
