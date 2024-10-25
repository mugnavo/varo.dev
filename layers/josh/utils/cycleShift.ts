export default (n: number, length: number, addend: number) => {
    if (length === 0) return n;
    const res = (n + addend) % length;
    return res < 0 ? length + res : res;
};
