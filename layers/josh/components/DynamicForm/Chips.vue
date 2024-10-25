<script setup lang="ts">
import { onClickOutside, set, useArrayFilter } from "@vueuse/core";
import Chips from "primevue/chips";
import Listbox from "primevue/listbox";
import { computed, ref } from "vue";

const model = defineModel<string[]>({ default: [] });
const props = defineProps<{
    options: string[];
    emptyString?: string;
}>();

const show_options = ref(false);
const show = (v: boolean) => set(show_options, v);
const root = ref<InstanceType<typeof HTMLDivElement>>();
const text = ref<string>("");

const setText = (str: string) => set(text, str.trim());
const filteredOptions = useArrayFilter(
    () => props.options,
    (txt) => (!text.value || txt.includes(text.value)) && !model.value.includes(txt)
);

onClickOutside(root, () => show(false));
const additem = (str?: string) => model.value.push(str || text.value);
const listmodel = computed<string | undefined>({
    get: () => undefined,
    set: (v) => !!v && onClickItem(v),
});
const onClickItem = (str: string) => {
    additem(str);
    setTimeout(() => show(true), 100);
};

//#region Handle Focusing Out the component
const onFocusOut = (e: FocusEvent) => {
    if (!root.value) return;
    if (!root.value.contains(e.relatedTarget as Node)) show(false);
};
</script>

<template>
    <div ref="root" class="relative" @click="show_options = true" @focusout="onFocusOut">
        <Chips
            class="w-full"
            v-model="model"
            :allow-duplicate="false"
            @add="() => setText('')"
            @focus="() => show(true)"
            :pt="{
                input(options: any) {
                    options.instance.onInput = (e: InputEvent) => {
                        const target = e.target;
                        if (!target) return;
                        setText((target as HTMLInputElement).value);
                    };

                    options.instance.onChange = (e: InputEvent) => e.preventDefault();
                },
            }"
        />
        <Listbox
            @click.stop
            v-if="show_options"
            class="panel max-h-[200px] overflow-y-auto"
            :options="filteredOptions"
            v-model="listmodel"
            :pt="{
                item: () => ({
                    class: 'hover:bg-surface-700 rounded px-2 py-1 ',
                }),
            }"
            :empty-message="props.emptyString"
        />
    </div>
</template>

<style lang="scss" scoped>
.panel {
    @apply absolute z-50 w-full border border-surface-600 bg-surface-800 px-2 py-1;
}
</style>
