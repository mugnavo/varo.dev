/**
 * Taken from {@link https://stackoverflow.com/a/78552259/13499426 Stack Overflow Answer}
 * @param {string} string
 * @return {ArrayBuffer}
 */
export default (string: string) => {
    const str = string.includes(",") ? string.split(",")[1] : string;
    return Uint8Array.from(atob(str!), (c) => c.charCodeAt(0));
};
