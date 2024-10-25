<script setup lang="ts">
export type SidebarItem = {
	title: string;
	subtitle?: string;
	avatar?: string;
	active?: boolean;
	onClick?: Function;
};

const open = defineModel<boolean>({ default: false });
const { items } = defineProps<{
	items: SidebarItem[];
	title?: string;
}>();
</script>

<template>
	<Drawer v-model:visible="open" :header="title">
		<p>This is sidebar</p>
	</Drawer>
</template>

<style lang="scss" scoped></style>
