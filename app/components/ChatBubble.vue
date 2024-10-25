<script setup lang="ts">
const { author, content } = defineProps<{
	author: {
		id: number;
		name: string;
		avatar_url?: string;
	} | null;
	content: string;
	reverse?: boolean;
}>();
</script>

<template>
	<div class="flex gap-2" :class="reverse ? '' : 'flex-row-reverse'">
		<img
			:src="
				author?.avatar_url ||
				'https://utfs.io/f/w9lPaB25Y3OzmCTA1ULmuwpHghKWZsGjrqvEX4O7L8clzxfP'
			"
			alt="avatar"
			class="h-8 w-8 rounded-full"
		/>
		<div class="flex flex-col gap-0.5">
			<span class="text-xs text-zinc-400" :class="reverse ? '' : 'self-end'">{{
				author?.name || "Bot"
			}}</span>
			<div class="rounded-md bg-zinc-900 p-2">
				{{ content }}
			</div>
		</div>
	</div>
</template>
