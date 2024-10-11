<script setup lang="ts">
const { user, clear } = useUserSession();
</script>
<template>
	<div class="flex flex-col gap-4 p-6">
		<h1 class="text-4xl font-bold">varo.dev</h1>

		<div v-if="user" class="flex flex-col gap-2">
			<p>Welcome back, {{ user.name }}!</p>
			<NuxtLink
				class="w-fit rounded-md bg-slate-950 px-4 py-2 text-white transition-colors hover:bg-slate-800"
				to="/dashboard"
				>Go to Dashboard</NuxtLink
			>
			<div>
				More data:
				<pre>{{ JSON.stringify(user, null, 2) }}</pre>
			</div>

			<button
				class="w-fit rounded-md bg-red-700 px-4 py-2 text-white transition-colors hover:bg-red-600"
				@click="clear"
			>
				Sign out
			</button>
		</div>
		<div v-else class="flex flex-col gap-2">
			<p>You are not signed in.</p>
			<NuxtLink
				to="/signin"
				class="w-fit rounded-md bg-slate-950 px-4 py-2 text-white transition-colors hover:bg-slate-800"
				>Sign in</NuxtLink
			>
		</div>
	</div>
</template>
