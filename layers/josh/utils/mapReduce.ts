export default <K, V, T = any>(
  array: T[],
  callback: (map: Map<K, V>, curr: T, index: number) => any,
) => {
  const map = new Map<K, V>();
  array.forEach((curr, i) => callback(map, curr, i));
  return Array.from(map);
};
