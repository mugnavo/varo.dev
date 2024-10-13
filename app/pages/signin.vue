<script setup lang="ts">
definePageMeta({
	middleware: ["guest-only"],
});
</script>

<template>
	<div class="flex min-h-screen items-center justify-center">
		<div class="bg-muted flex flex-col items-center gap-8 rounded-xl border p-10">
			Logo here
			<form method="GET" class="flex flex-col gap-2">
				<button
					formaction="/api/auth/github"
					class="w-fit rounded-md bg-slate-950 px-4 py-2 text-white transition-colors hover:bg-slate-800"
				>
					Sign in with GitHub
				</button>
			</form>
		</div>
	</div>
</template>
