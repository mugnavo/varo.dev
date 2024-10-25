export const safeAwait = async <T, E = Error>(
    promise: Promise<T> | (() => Promise<T>)
): Promise<[null, T] | [E, null]> => {
    try {
        const result = await (typeof promise === "function" ? promise() : promise);
        return [null, result];
    } catch (error) {
        return [error as E, null];
    }
};

export const safeTry = <T, E = Error>(cb: () => T): [null, T] | [E, null] => {
    try {
        const result = cb();
        return [null, result];
    } catch (error) {
        return [error as E, null];
    }
};
