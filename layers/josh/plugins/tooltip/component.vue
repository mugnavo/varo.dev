<script setup lang="ts">
import { isDefined, useElementSize, useMouse, useMousePressed, useWindowSize } from "@vueuse/core";
import { computed, ref, watch } from "vue";
import type { TooltipValue } from "../tooltip";

/**Acts as minimum amount of pixels the tooltip should be away from the edge of the screen */
const PADDING = 25;
const { x: mX, y: mY } = useMouse();
const { pressed: isMousePressed } = useMousePressed();
const forceRefresh = ref<number>(0);
const elementsAtMouse = computed(() => {
    // Just to emit reactivity when pressing the mouse
    forceRefresh.value;
    return document.elementsFromPoint(mX.value, mY.value);
});

watch(isMousePressed, (v) => {
    if (v) return;
    setTimeout(() => {
        forceRefresh.value++;
    }, 50);
});

//#region Dataset Handling
const data = computed<Exclude<TooltipValue, string> | undefined>(() => {
    const { value: els } = elementsAtMouse;
    let data: TooltipValue | undefined = undefined;
    let element: (typeof els)[number] | undefined = undefined;
    let elementindex = -1;
    for (let i = 0; i < els.length; i++) {
        const el = els[i];
        const { __TOOLTIP__ } = (el as HTMLElement).dataset;
        if (__TOOLTIP__) {
            data = JSON.parse(__TOOLTIP__) as TooltipValue;
            element = el;
            elementindex = i;
            break;
        }
    }
    if (!data) return undefined;

    // Check first if element is visible, if not then don't continue
    const [first] = els;
    if (element && !element.contains(first!) && elementindex > 0) return undefined;

    if (typeof data === "string") {
        if (data === "") return undefined;
        return { text: data };
    }
    if (data.text === "") return undefined;
    return data;
});

//#region Values to be shown
const text = computed(() => data.value?.text);
const hotkey = computed(() => {
    const { hotkey } = data.value || {};
    if (!hotkey) return undefined;
    if (typeof hotkey === "string") return { Hotkey: hotkey };
    return hotkey;
});
const offset = computed(() => (data.value?.offset || [16, 21]) as [number, number]);

//#region Computed Positioning
const container = ref<InstanceType<typeof HTMLDivElement>>();
const { height: maxY, width: maxX } = useWindowSize();
const { height, width } = useElementSize(container);

const isYOverlap = computed(
    () => mY.value + offset.value[1]! + height.value > maxY.value - PADDING
);
const isXOverlap = computed(() => mX.value + offset.value[0]! + width.value > maxX.value - PADDING);

/**Computed X */
const x = computed(() => {
    const isLeft =
        (data.value?.quadrant && data.value.quadrant.includes("left")) || isXOverlap.value;
    const comp_offset = isLeft ? width.value + offset.value[0]! * 2 : 0;
    return mX.value - comp_offset;
});
/**Computed Y */
const y = computed(() => {
    const isTop = (data.value?.quadrant && data.value.quadrant.includes("top")) || isYOverlap.value;
    const comp_offset = isTop ? height.value + offset.value[1] * 2 : 0;
    return mY.value - comp_offset;
});

//#region Tooltip Visibility
const lbl = ref<InstanceType<typeof HTMLDivElement>>();
const active = computed(() => {
    const hasData = isDefined(data);
    const label = lbl.value;
    if (!label) return hasData;
    return hasData && label.textContent?.trim();
});
</script>

<template>
    <div class="absolute bg-inherit bg top-0 left-0" style="z-index: 99999" v-if="active">
        <div class="position container absolute shadow-lg" ref="container">
            <div class="label" v-html="text"></div>
            <div v-if="!!hotkey">
                <div
                    class="hotkey-list"
                    v-for="[label, value] in Object.entries(hotkey)"
                    :key="label"
                >
                    <span class="hotkey-label">{{ label }}</span>
                    <span class="hotkey-value">{{ value }}</span>
                </div>
            </div>
        </div>
    </div>
    <div class="!hidden" ref="lbl" v-html="text"></div>
</template>

<style lang="scss" scoped>
.position {
    top: v-bind("y + `px`");
    left: v-bind("x + `px`");
}

.container {
    @apply bg-inherit border border-surface-700;

    background: inherit;
    padding: 0.5rem 0.75rem;
    width: max-content;
    max-width: 500px;
    border-radius: 4px;
    margin-top: v-bind("offset[1] + `px`");
    margin-left: v-bind("offset[0] + `px`");
}

.label {
    @apply text-surface-300;
    font-size: 0.8em;
}

.hotkey-list {
    font-size: 0.75em;
    display: flex;
    gap: 0.5rem;

    .hotkey-label {
        @apply text-primary-500;
        font-weight: 600;
    }

    .hotkey-value {
        @apply border border-surface-500;
        font-size: 0.9em;
        padding: 0px 5px;
        border-radius: 3px;
    }
}
</style>
