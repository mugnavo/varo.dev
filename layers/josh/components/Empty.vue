<script lang="ts" setup>
const {
	iconClass = "text-6xl",
	noIcon = false,
	selectable = false,
	text = "Empty",
	icon = "pi pi-database",
} = defineProps<{
	iconClass?: string;
	text?: string;
	noIcon?: boolean;
	selectable?: boolean;
	icon?: string;
}>();
</script>

<template>
	<Fill
		flex-col
		class="text-secondary-emph dmsans text-surface-500 flex flex-col items-center justify-center gap-2 text-sm"
		:class="!selectable && 'select-none'"
	>
		<i :class="`${icon} ${iconClass} text-4xl`" v-if="!noIcon" />
		<slot>
			<span>{{ text }}</span>
		</slot>
	</Fill>
</template>

<style lang="scss" scoped></style>
