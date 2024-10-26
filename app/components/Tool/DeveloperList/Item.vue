<script setup lang="ts">
import { set } from "@vueuse/core";
import Chip from "primevue/chip";
import type { DeveloperListItem } from "./index.vue";

const props = defineProps<{
	item: DeveloperListItem;
}>();

const emits = defineEmits<{
	(e: "done", item: DeveloperListItem): void;
}>();

const { ask } = useQuery();
const onConnect = ({ name, connected }: { name: string; connected?: boolean }) => {
	const pending = `You have been matched with ${name}, you'll have to wait for them to match with you too`;
	const accepted = `You are now connected with ${name}! Congrats.`;

	ask({
		title: `${connected ? "Connected" : "Matched"} with ${name}!`,
		description: connected ? accepted : pending,
		approveText: "Ok",
	});
};

const onAvoid = ({ name }: { name: string }) => {
	const description = `You have ignored the match suggestion for ${name}.`;

	ask({
		title: `Ignored ${name}`,
		description,
		approveText: "Ok",
	});
};
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

		const name = props.item.user_name || "";

		if (user1_status === "accepted" && user2_status === "accepted") {
			// Add user to connections
			onConnect({ name, connected: true });
		} else if (connect) {
			onConnect({ name });
		} else {
			onAvoid({ name });
		}

		emits("done", props.item);
	},
	undefined,
	{ immediate: false, resetOnExecute: true },
);
</script>

<template>
	<div
		class="root m-2 mx-auto flex max-w-sm flex-col gap-2 rounded border border-surface-700"
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
				<p class="text-base text-gray-200">{{ item.user_bio }}</p>

				<div class="mt-2 flex flex-col gap-4 text-wrap px-4">
					<div class="flex flex-col gap-2">
						<div class="flex items-center gap-1">
							<i class="pi pi-map-marker" />
							<h4 class="font-medium">
								{{ item.user_location }}
							</h4>
						</div>
					</div>
					<div class="flex flex-col gap-2">
						<div class="flex items-center gap-1 text-wrap text-surface-400">
							<i class="pi pi-wrench" />
							<h4 class="text-wrap text-sm font-semibold">Skills</h4>
						</div>
						<div
							class="flex flex-row flex-wrap gap-1"
							v-for="(skill, index) in item.user_skills"
							:key="index"
						>
							<Chip :label="skill" class="text-xs" />
						</div>
					</div>
				</div>
			</div>
		</div>
		<ButtonGroup class="flex overflow-hidden rounded-b-lg text-surface-900">
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
				v-tip="'Ignore'"
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
