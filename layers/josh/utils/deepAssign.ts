import { toRaw } from "vue";

/**
 * Recursively copies each field from src to dest, avoiding the loss of
 * reactivity. Used to copy values from an ordinary object to a reactive object.
 */
export function deepAssign<T extends object>(destObj: T, srcObj: T): void {
	const dest = destObj;
	const src = toRaw(srcObj);
	if (src instanceof Date) {
		throw new Error("[deepAssign] Dates must be copied manually.");
	} else if (Array.isArray(src)) {
		for (let i = 0; i < src.length; ++i) {
			if (src[i] === null) {
				(dest as any)[i] = null;
			} else if (src[i] instanceof Date) {
				(dest as any)[i] = new Date(src[i].getTime());
			} else if (Array.isArray(src[i]) || typeof src[i] === "object") {
				deepAssign((dest as any)[i], src[i]);
			} else {
				(dest as any)[i] = toRaw(src[i]);
			}
		}
	} else if (typeof src === "object") {
		for (const k in src) {
			if (src[k] === null) {
				(dest as any)[k] = null;
			} else if (src[k] instanceof Date) {
				(dest[k] as any) = new Date((src[k] as any).getTime());
			} else if (Array.isArray(src[k]) || typeof src[k] === "object") {
				deepAssign(dest[k] as any, src[k] as any);
			} else {
				(dest[k] as any) = toRaw(src[k]);
			}
		}
	} else {
		throw new Error("[deepAssign] Unknown type: " + typeof src);
	}
}
