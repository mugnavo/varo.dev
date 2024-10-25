import { unrefElement } from "@vueuse/core";
import { isRef, MaybeRef } from "vue";

export default (element: MaybeRef<HTMLElement | undefined>, onUndefine: boolean = false) => {
    if (isRef(element)) {
        const e = unrefElement(element);
        if (!e) return onUndefine;
        else element = e;
    }
    if (!element) return onUndefine;
    return element.scrollHeight > element.clientHeight;
};
