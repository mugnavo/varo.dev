<script setup lang="ts">
import { ref } from "@vue/reactivity";
import { set, syncRef, useBase64, useDropZone, useFileDialog } from "@vueuse/core";
import { toRefs, watch } from "vue";

// Should output the base64 string
const model = defineModel<string>();
const prop = withDefaults(
    defineProps<{
        accept?: string;
        directory?: boolean;
        multiple?: boolean;
        base64?: boolean;
    }>(),
    {
        accept: "image/*",
    }
);
const { accept } = toRefs(prop);

const {
    files: _files,
    onChange,
    open,
    reset,
} = useFileDialog({
    accept: prop.accept,
    multiple: prop.multiple,
    directory: prop.directory,
});

const files = ref<FileList | null>(null);
syncRef(files, _files, { direction: "rtl" });

// Saving as base64s
const base64s = ref<string[]>([]);
onChange(async (files) => {
    console.log(files);
    if (files?.length) {
        set(
            base64s,
            await Promise.all(
                Array.from(files).map(async (f) => {
                    const { promise } = useBase64(f);
                    return await promise.value;
                })
            )
        );
    } else {
        set(base64s, []);
    }
});

watch([base64s], ([b64s]) => {
    // TODO: Implement multiple acquisition
    if (prop.base64) {
        const [first] = b64s;
        if (first) set(model, first);
    } else if (files.value) {
        files.value[0]?.text().then((value) => {
            set(model, value);
        });
    }
});

// Deleting of an item
const remove = (index: number) => {
    if (!files.value) return;
    const dt = new DataTransfer();
    const arr = Array.from(files.value);
    arr.splice(index, 1);
    arr.forEach((f) => dt.items.add(f));
    reset();
    set(files, dt.files);
    // also change model value
    // TODO: Add multiple file support
    set(model, undefined);
};

// Drag and Drop
const container = ref<InstanceType<typeof HTMLDivElement>>();
const isFileAccepted = (types: readonly string[]) => {
    const [category, format] = accept.value.split("/");
    if (format === "*") return types.every((type) => type.startsWith(category!));
    return types.every((type) => type === accept.value);
};
const { isOverDropZone } = useDropZone(container, {
    onDrop: (fs: File[] | null) => {
        if (!fs) return;
        reset();
        const [file] = fs;
        const dt = new DataTransfer();
        (prop.multiple ? fs : [file]).forEach((f) => dt.items.add(f!));
        set(files, dt.files);
    },
    dataTypes: isFileAccepted,
});
</script>

<template>
    <div
        ref="container"
        @click.self="() => open()"
        class="flex min-h-10 cursor-pointer select-none items-center justify-center rounded border border-dashed text-sm bg-surface-950"
        :class="{
            'py-3': files?.length,
            'border-surface-700 text-surface-400 hover:bg-surface-700 active:bg-surface-600/50':
                !isOverDropZone,
            'border-primary-600 text-primary-400 hover:bg-primary-700 active:bg-primary-600/50':
                isOverDropZone,
        }"
    >
        <span v-if="isOverDropZone"> Release to apply here </span>
        <span v-else-if="files === null || files.length === 0" @click.self="() => open()">
            Accepting
            <span class="text-primary-500" @click.self="() => open()">[{{ accept }}]</span>
        </span>
        <div v-else-if="!isOverDropZone">
            <div
                v-for="(file, i) in files"
                :key="file.name"
                class="flex max-w-60 items-center justify-between gap-2 rounded bg-surface-700 px-2 py-1 text-surface-200 hover:bg-surface-600"
            >
                <span class="truncate"> {{ file.name }}</span>
                <i class="pi pi-times text-xs" @click="() => remove(i)" />
            </div>
        </div>
    </div>
</template>

<style lang="scss" scoped></style>
