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
	<div class="root">
		<Avatar :image="item.avatar" shape="circle" />
		<h6>{{ item.title }}</h6>
	</div>
</template>

<style lang="scss" scoped>
.root {
	@apply bg-surface-800 text-surface-300 mx-4 flex items-center gap-2 rounded p-2;
}
</style>
