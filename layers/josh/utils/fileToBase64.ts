type Options = {
    timeout: number;
};

export default async (file: File, options?: Partial<Options>) => {
    const { timeout } = options || {};

    return new Promise<string>(async (resolve, reject) => {
        file.arrayBuffer()
            .then((buffer) =>
                btoa(String.fromCharCode(...new Uint8Array(buffer))),
            )
            .then((base64) => resolve(base64));
        if (timeout && timeout > 0) {
            setTimeout(() => reject(), timeout);
        }
    });
};
