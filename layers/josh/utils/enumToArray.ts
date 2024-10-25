export default <T extends Record<string, string | number>>(enumObj: T): ReadonlyArray<keyof T> => {
    return Object.keys(enumObj).filter((key) => isNaN(Number(key))) as unknown as ReadonlyArray<keyof T>;
};
