<script setup lang="ts">
definePageMeta({
	middleware: "auth",
});

const { user } = useUserSession();

if (!user.value?.finished_setup) {
	navigateTo("/setup");
}
</script>
<template>
	<div class="flex flex-col gap-4 p-4">
		<h1 class="text-4xl font-bold">App Layout</h1>

		<van-button class="w-fit" to="/"> Back to Home </van-button>

		<NuxtPage />
	</div>
</template>
