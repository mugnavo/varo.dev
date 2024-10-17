<script setup lang="ts">
definePageMeta({
	middleware: ["guest-only"],
});
</script>

<template>
	<div class="flex min-h-screen items-center justify-center">
		<div class="flex flex-col items-center gap-8 rounded-xl border bg-stone-900 p-10">
			Login to varo.dev (WIP!!!!)
			<form method="GET" class="flex flex-col gap-2">
				<button
					type="submit"
					formaction="/api/auth/github"
					class="w-fit rounded-md bg-stone-50 px-4 py-2 text-stone-900 transition-colors hover:bg-stone-300"
				>
					Sign in with GitHub
				</button>
			</form>
		</div>
	</div>
</template>
