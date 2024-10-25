<script setup lang="ts">
import type { SearchDevelopersReturnType } from "~~/server/utils/tools";

const props = defineProps<{
	data: SearchDevelopersReturnType;
}>();

const { user } = useUserSession();
const devs = computed(
	() =>
		props.data.developers
			?.filter((u) => u.user_id !== user.value?.id)
			.sort((a, b) => b.embedding_similarity - a.embedding_similarity) || [],
);
export type DeveloperListItem = Exclude<typeof props.data.developers, null>[number];

const onRespond = (item: DeveloperListItem) => {
	const index =
		props.data.developers?.findIndex((d) => d.user_id === item.user_id) || -1;
	if (index === -1) return;
	props.data.developers?.splice(index, 1); // illegal
};
</script>

<template>
	<ToolDeveloperListItem @done="onRespond" v-if="devs?.length === 1" :item="devs[0]!" />
	<Carousel v-else-if="!!devs?.length" :value="devs || []" :num-visible="1" circular>
		<template #item="{ data }: { data: DeveloperListItem }">
			<ToolDeveloperListItem :item="data" />
		</template>
	</Carousel>
	<div v-else></div>
</template>

<style lang="scss" scoped></style>
