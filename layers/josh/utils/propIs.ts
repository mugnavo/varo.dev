export default (
    obj: Record<string, any>,
    prop: string,
    value: any,
    comp = (a: any, b: any) => a === b
) => {
    // check first if obj has the prop
    if (!(prop in obj)) return false;
    return comp(value, obj[prop]);
};
