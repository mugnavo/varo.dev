<script setup lang="ts">
definePageMeta({
	layout: "landing",
});

const { user, clear } = useUserSession();
</script>
<template>
	<div class="h-full w-full">
		<div class="flex h-full flex-col items-center justify-center gap-4">
			<p class="text-5xl font-bold">Varo</p>
			<p class="text-xl">
				An experimental matchmaking platform for developers, open-source projects,
				and indie founders.
			</p>
		</div>
	</div>
</template>
