<script setup lang="ts" generic="T">
import { onMounted, ref } from "vue";
import { type QuerySchemaMeta } from "./types";
import { set, whenever } from "@vueuse/core";

const model = defineModel<T>({ required: true });

const props = defineProps<{
    mount: Extract<QuerySchemaMeta, { type: "component" }>["mount"];
}>();
const container = ref<InstanceType<typeof HTMLDivElement>>();

whenever(container, (c) => {
    props.mount(c, model.value, (v) => set(model, v));
});
</script>

<template>
    <div ref="container"></div>
</template>

<style lang="scss" scoped></style>
