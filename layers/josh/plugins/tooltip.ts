import { VueElement, type Directive } from "vue";
import TooltipVue from "./tooltip/component.vue";

export type PluginOptions = {
    componentName: string;
};

export type TooltipValue =
    | {
          text: string;
          hotkey?:
              | string
              | {
                    [key: string]: string;
                };
          delay?: number;
          offset?: [number, number];
          quadrant?: "top-left" | "top-right" | "bot-left" | "bot-right";
      }
    | string;

export default defineNuxtPlugin((nuxtApp) => {
    const app = nuxtApp.vueApp;

    const Tooltip: Directive<HTMLElement, TooltipValue> = (el, { value }) => {
        if (!value) return;
        // Just add the data as dataobject
        el.dataset.__TOOLTIP__ = JSON.stringify(value);
    };

    app.directive("tip", Tooltip);
    app.component("Tooltip", TooltipVue);
    // new VueElement({ render: () => h(TooltipVue) }).append("body");
});
