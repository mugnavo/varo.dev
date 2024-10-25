export default (blob: Blob) => {
    return new Promise<HTMLImageElement>((resolve) => {
        const url = URL.createObjectURL(blob);
        let img = new Image();
        img.onload = () => {
            URL.revokeObjectURL(url);
            resolve(img);
        };
        img.src = url;
    });
};
