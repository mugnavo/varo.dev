<script setup lang="ts">
import { set } from "@vueuse/core";
import type { DeveloperListItem } from "./index.vue";
import Chip from "primevue/chip";

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

				<div>{{ item.user_bio }}</div>
			</div>
			<div class="mt-2 flex flex-col gap-4 text-wrap px-4">
				<div class="flex flex-col gap-2">
					<div class="flex items-center gap-1">
						<svg
							width="25px"
							height="25px"
							viewBox="0 0 24 24"
							fill="white"
							xmlns="http://www.w3.org/2000/svg"
						>
							<path
								d="M12 21C15.5 17.4 19 14.1764 19 10.2C19 6.22355 15.866 3 12 3C8.13401 3 5 6.22355 5 10.2C5 14.1764 8.5 17.4 12 21Z"
								stroke="#000000"
								stroke-width="2"
								stroke-linecap="round"
								stroke-linejoin="round"
							/>
							<path
								d="M12 13C13.6569 13 15 11.6569 15 10C15 8.34315 13.6569 7 12 7C10.3431 7 9 8.34315 9 10C9 11.6569 10.3431 13 12 13Z"
								stroke="#000000"
								stroke-width="2"
								stroke-linecap="round"
								stroke-linejoin="round"
							/>
						</svg>
						<h4 class="text-lg font-medium">
							{{ item.user_location }}
						</h4>
					</div>
					<p class="text-base text-gray-400">{{ item.user_bio }}</p>
				</div>
				<div class="flex flex-col gap-2">
					<div class="flex items-center gap-1 text-wrap">
						<svg
							width="25px"
							height="25px"
							viewBox="0 0 24 24"
							fill="white"
							xmlns="http://www.w3.org/2000/svg"
						>
							<path
								d="M6.12 20.75C5.36 20.75 4.64 20.45 4.09 19.91C2.97 18.79 2.97 16.98 4.09 15.86L9.6 10.35C9.1 8.40997 9.64 6.31997 11.06 4.89997C12.49 3.46997 14.59 2.90997 16.54 3.43997C16.8 3.50997 17 3.70997 17.07 3.96997C17.14 4.22997 17.07 4.49997 16.88 4.68997L14.43 7.13997L14.95 9.04997L16.86 9.56997L19.31 7.11997C19.5 6.92997 19.78 6.85997 20.03 6.92997C20.29 6.99997 20.49 7.19997 20.56 7.45997C21.09 9.40997 20.54 11.51 19.1 12.94C17.68 14.36 15.59 14.9 13.65 14.4L8.14 19.91C7.6 20.45 6.88 20.75 6.12 20.75ZM14.68 4.76997C13.72 4.84997 12.81 5.26997 12.11 5.96997C10.97 7.10997 10.6 8.77997 11.15 10.32C11.25 10.59 11.18 10.9 10.97 11.1L5.14 16.93C4.61 17.46 4.61 18.33 5.14 18.86C5.4 19.12 5.74 19.26 6.11 19.26C6.47 19.26 6.82 19.12 7.07 18.86L12.9 13.03C13.11 12.82 13.41 12.76 13.68 12.85C15.22 13.39 16.89 13.03 18.03 11.89C18.73 11.19 19.14 10.28 19.23 9.31997L17.6 10.95C17.41 11.14 17.13 11.21 16.87 11.14L14.13 10.39C13.87 10.32 13.67 10.12 13.6 9.85997L12.85 7.11997C12.78 6.85997 12.85 6.57997 13.04 6.38997L14.67 4.75997L14.68 4.76997Z"
								fill="#FFFFFF"
							/>
						</svg>
						<h4 class="text-wrap text-lg font-medium">Skills</h4>
					</div>
					<div
						class="flex flex-row flex-wrap gap-1"
						v-for="(skill, index) in item.user_skills"
						:key="index"
					>
						<Chip label="{{" skill }} />
					</div>
				</div>
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
		<Button label="Connect" :rounded="false" class="!text-surface-900" />
	</div>
</template>

<style lang="scss" scoped>
.bg {
	@apply h-10;
}
</style>
