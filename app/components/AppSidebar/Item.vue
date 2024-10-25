<script setup lang="ts">
import type { SidebarItem } from "./index.vue";

const { item } = defineProps<{
	item: SidebarItem;
}>();

// Current user
const avatar = computed(() => item.avatar);
const initials = computed(() => toInitials(avatar.value || ""));
</script>

<template>
	<a class="root" :class="{ active: item.active }" :href="item.route">
		<Avatar :image="item.avatar" shape="circle" />
		<h6>{{ item.title }}</h6>
	</a>
</template>

<style lang="scss" scoped>
.root {
	@apply mx-4 flex cursor-pointer items-center gap-2 rounded p-2 text-surface-300 hover:bg-surface-800;

	&.active {
		@apply bg-surface-700/80;
	}
}
</style>
