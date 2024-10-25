//@ts-ignore
import pixelWidth from "string-pixel-width";

export default (txt: string, height = 12) => {
    return {
        height,
        width: pixelWidth(txt, { font: "arial", size: height }) as number,
    };
};
