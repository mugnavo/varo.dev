<script setup lang="ts">
const { tooltip } = defineProps<{
    tooltip?: string;
}>();
</script>

<template>
    <i class="pi pi-question-circle text-surface-500 cursor-pointer" v-tip="tooltip" />
</template>

<style lang="scss" scoped></style>
