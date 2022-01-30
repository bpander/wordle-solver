
export const replaceIndex = <T extends unknown[]>(array: T, index: number, replacement: T[number]): T => {
  const clone = [...array] as T;
  clone[index] = replacement;
  return clone;
};
