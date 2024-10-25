<script setup lang="ts">
definePageMeta({
	layout: "landing",
});

const { user, clear } = useUserSession();
</script>
<template>
	<div class="flex flex-col gap-4 p-6">
		<h1 class="text-4xl font-bold">varo.dev</h1>

		<div v-if="user" class="flex flex-col gap-2">
			<p>Welcome back, {{ user.name }}!</p>
			<van-button type="success" class="w-fit" to="/app">Go to App</van-button>
			<div>
				More data:
				<pre>{{ JSON.stringify(user, null, 2) }}</pre>
			</div>

			<van-button type="danger" class="w-fit" @click="clear"> Sign out </van-button>
		</div>
		<div v-else class="flex flex-col gap-2">
			<p>You are not signed in.</p>
			<van-button type="primary" class="w-fit" to="/signin">Sign in</van-button>
		</div>
	</div>
</template>
