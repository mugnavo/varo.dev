<script setup lang="ts">
definePageMeta({
	middleware: ["auth", "finished-setup"],
	layout: "app",
});
</script>
<template>
	<NuxtPage />
</template>
