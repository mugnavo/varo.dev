<script setup lang="ts">
definePageMeta({
	middleware: "auth",
});
</script>
<template>
	<div class="flex flex-col gap-4 p-4">
		<h1 class="text-4xl font-bold">Dashboard Layout</h1>

		<NuxtLink
			class="w-fit rounded-md bg-slate-950 px-4 py-2 text-white transition-colors hover:bg-slate-800"
			to="/"
		>
			Back to Home
		</NuxtLink>

		<NuxtPage />
	</div>
</template>
