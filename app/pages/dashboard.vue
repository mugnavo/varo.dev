<script setup lang="ts">
definePageMeta({
    middleware: "auth"
})
</script>
<template>
    <div class="flex flex-col gap-4 p-4">
        <h1 class="text-4xl font-bold">Dashboard Layout</h1>

        <NuxtLink
            class="py-2 px-4 bg-slate-950 transition-colors text-white w-fit hover:bg-slate-800 rounded-md"
            to="/"
        >
            Back to Home
        </NuxtLink>

        <NuxtPage />
    </div>
</template>
