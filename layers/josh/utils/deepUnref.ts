import { isRef, type MaybeRef, toRaw, unref } from "vue";

const deepUnref = <T>(obj: MaybeRef<T>): T => {
    if (isRef(obj)) return deepUnref(unref(obj)) as T;

    if (Array.isArray(obj)) return obj.map((item) => deepUnref(item)) as T;
    if (typeof obj === "object" && obj !== null && !(obj instanceof Blob)) {
        const raw = toRaw(obj);
        return Object.keys(raw).reduce((acc, key) => {
            // @ts-expect-error Typescript thing
            acc[key] = deepUnref(raw[key]);
            return acc;
        }, {} as Record<string, any>) as T;
    }

    return obj;
};

export default deepUnref;
