<script lang="ts" setup>
import { get } from "@vueuse/core";
import { computed, toRefs } from "vue";

// Types
export type LoadingProcessState = {
	label: string;
	status: boolean;
};

export type LoadingProcessGroup = {
	label: string;
	processes: (LoadingProcessState | LoadingProcessGroup)[];
};

type LoadingData = string | LoadingProcessState | LoadingProcessGroup;

// Props
const props = withDefaults(
	defineProps<{
		noSpinner?: boolean;
		noEllipsis?: boolean;
		data?: LoadingData;
		noText?: boolean;
	}>(),
	{
		data: "Loading",
		noText: false,
	},
);

const { data: model } = toRefs(props);

const isProcessesDone = (group: LoadingProcessGroup): boolean => {
	return group.processes.every((p) =>
		"processes" in p ? isProcessesDone(p) : p.status,
	);
};

const isDone = computed(() => {
	const v = get(model);
	if (typeof v === "string") return true;
	if ("status" in v) return v.status;
	return isProcessesDone(v);
});

const state_version = computed<LoadingProcessState>(() => {
	const v = get(model);
	if (typeof v === "string") return { label: v, status: true };
	if ("status" in v) return v;
	return { label: v.label, status: isDone.value };
});
</script>

<template>
	<template v-if="typeof model === 'string'">
		<div class="DMSans flex items-center gap-2">
			<i class="pi pi-spinner animate-spin" />
			<span v-if="!noText" :class="`${!noEllipsis && 'loading-ellipsis'}`">{{
				model
			}}</span>
		</div>
	</template>
	<template v-else-if="'status' in model">
		<div class="DMSans flex items-center gap-2">
			<i
				:class="`${
					!isDone
						? 'pi pi-spinner animate-spin'
						: 'pi pi-check-circle text-green-500'
				} text-xl`"
			/>
			<span :class="`${!isDone && !noEllipsis && 'loading-ellipsis'}`">{{
				model.label
			}}</span>
		</div>
	</template>
	<template v-else>
		<div class="DMSans flex flex-col gap-2">
			<Loading
				:data="state_version"
				:no-ellipsis="noEllipsis"
				:no-spinner="noSpinner"
			/>
			<div class="pl-4" :key="p.label" v-for="p in model.processes">
				<Loading :data="p" :no-ellipsis="noEllipsis" :no-spinner="noSpinner" />
			</div>
		</div>
	</template>
</template>

<style lang="scss" scoped>
div {
	@apply text-surface-400;
}
</style>
