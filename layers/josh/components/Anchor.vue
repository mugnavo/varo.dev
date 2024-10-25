<script setup lang="ts" generic="T extends RoutesNamesList, P extends string">
import type { RoutesNamesList, NuxtRoute } from "@typed-router";

const { to } = defineProps<{
    to: NuxtRoute<T, P>;
}>();
</script>

<template>
    <NuxtLink :to="to" class="hover:underline">
        <span>
            <slot></slot>
        </span>
    </NuxtLink>
</template>

<style lang="scss" scoped></style>
