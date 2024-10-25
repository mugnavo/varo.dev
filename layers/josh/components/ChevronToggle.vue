<script setup lang="ts">
type Direction = "up" | "down" | "left" | "right";

const model = defineModel({ default: false });
const { directionOff = "right", directionOn = "down" } = defineProps<{
    directionOff?: Direction;
    directionOn?: Direction;
}>();

//#region Direction Classes
const rotation: Record<Direction, string> = {
    up: "-rotate-90",
    down: "rotate-90",
    right: "rotate-0",
    left: "rotate-180",
};
</script>

<template>
    <i
        class="transition-transform pi pi-chevron-right text-surface-400 cursor-pointer p-2.5 hover:bg-surface-800 rounded-full"
        :class="[rotation[model ? directionOn : directionOff]]"
        @click="model = !model"
    />
</template>

<style lang="scss" scoped></style>
