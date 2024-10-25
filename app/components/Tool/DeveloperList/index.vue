<script setup lang="ts">
import type { SearchDevelopersReturnType } from "~~/server/utils/tools";

const props = defineProps<{
	data: SearchDevelopersReturnType;
}>();
const devs = computed(
	() =>
		props.data.developers?.toSorted(
			(a, b) => b.embedding_similarity - a.embedding_similarity,
		) || [],
);
export type DeveloperListItem = Exclude<typeof props.data.developers, null>[number];
</script>

<template>
	<ToolDeveloperListItem v-if="devs?.length === 1" :item="devs[0]!" />
	<Carousel v-else-if="!!devs?.length" :value="devs || []" :num-visible="1" circular>
		<template #item="{ data }: { data: DeveloperListItem }">
			<ToolDeveloperListItem :item="data" />
		</template>
	</Carousel>
	<div v-else></div>
</template>

<style lang="scss" scoped></style>
