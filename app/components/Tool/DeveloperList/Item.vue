<script setup lang="ts">
import type { DeveloperListItem } from "./index.vue";

const props = defineProps<{
	item: DeveloperListItem;
}>();
</script>

<template>
	<div
		class="root m-2 mx-auto flex max-w-xs flex-col gap-2 rounded border border-surface-700"
	>
		<div class="bg"></div>
		<div class="flex gap-4 px-2">
			<Avatar
				class="-translate-y-8"
				:image="item.user_avatar || undefined"
				shape="circle"
				size="large"
			/>
			<div class="flex flex-col">
				<h4 class="text-xl font-semibold">{{ item.user_name }}</h4>
				<h6 class="text-surface-400">{{ item.user_username }}</h6>

				<div>{{ item.user_bio }}</div>
			</div>
		</div>
		<Button label="Connect" :rounded="false" class="!text-surface-900" />
	</div>
</template>

<style lang="scss" scoped>
.bg {
	@apply h-10;
}
</style>
