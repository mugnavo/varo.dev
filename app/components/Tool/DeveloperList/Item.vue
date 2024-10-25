<script setup lang="ts">
import { set } from "@vueuse/core";
import type { DeveloperListItem } from "./index.vue";

const props = defineProps<{
	item: DeveloperListItem;
}>();

const isAccepting = ref(false);
const {
	isLoading,
	state: result,
	execute: respond,
} = useAsyncState(
	async (connect: boolean) => {
		set(isAccepting, connect);

		const result = await $fetch("/api/user/match", {
			method: "POST",
			body: JSON.stringify({
				user_id: props.item.user_id,
				status: connect ? "accepted" : "rejected",
			}),
		});

		if (!result) return;
		const { user1_status, user2_status } = result || {};

		if (user1_status === "accepted" && user2_status === "accepted") {
			// Add user to connections
		}
	},
	undefined,
	{ immediate: false, resetOnExecute: true },
);
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
		<ButtonGroup class="flex rounded-none text-surface-900">
			<Button
				label="Connect"
				class="flex-grow !rounded-none"
				:rounded="false"
				:loading="isLoading && isAccepting"
				:disabled="isLoading && !isAccepting"
				@click="respond(0, true)"
			/>
			<Button
				icon="pi pi-ban"
				class="!rounded-none"
				severity="danger"
				v-tip="'Avoid this dev'"
				:loading="isLoading && !isAccepting"
				:disabled="isLoading && isAccepting"
				@click="respond(0, false)"
			/>
		</ButtonGroup>
	</div>
</template>

<style lang="scss" scoped>
.bg {
	@apply h-10;
}
</style>
