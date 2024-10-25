<script lang="ts" setup>
import { set } from "@vueuse/core";
const props = defineProps<{
    text?: string;
}>();

const copied = refAutoReset(false, 1000);

const copy = async () => {
    if (import.meta.server) return; // Do not run on server
    const [err] = await safeAwait(navigator.clipboard.writeText(props.text || ""));
    if (err) alert(err);
    set(copied, true);
};
</script>

<template>
    <div class="relative min-h-[32px] bg-surface-900 rounded p-3 root">
        <div class="absolute top-3 right-3 h-min w-min">
            <Button :icon="copied ? 'pi pi-check' : 'pi pi-clipboard'" @click="copy" />
        </div>
        <div class="overflow-auto h-full">
            <slot> {{ text }} </slot>
        </div>
    </div>
</template>

<style lang="scss" scoped>
.root {
    @apply shadow-sm ring-1 ring-inset ring-surface-300 dark:ring-surface-700 text-surface-700 dark:text-surface-200 bg-surface-50 dark:bg-surface-800/60 focus-visible:ring-2 focus-visible:ring-primary-500 dark:focus-visible:ring-primary-400 rounded-md p-2;
}
</style>
