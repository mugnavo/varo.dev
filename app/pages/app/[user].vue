<script setup lang="ts">
definePageMeta({
	middleware: ["connected-users"],
});

const { user } = useUserSession();
const route = useRoute();
const other = computed(() => Number(route.params.user));

const connectionStore = useConnectionsStore();
const { connections } = storeToRefs(connectionStore);

const otherUser = computed(
	() => connections.value?.users.find((c) => c.id === other.value)!,
);

// Messaging
type Message = {
	id: number;
	created_at: Date;
	sender_id: number;
	recipient_id: number;
	message: string | null;
};

//Retreiving Message
const { state: messages, execute: sync } = useAsyncState(
	async (offset?: number) => {
		const values = await $fetch(`/api/chat/user/${other.value}`, {
			method: "GET",
			params: { offset },
		});
		return values.reverse();
	},
	[],
	{ immediate: false, resetOnExecute: false },
);
const lastindex = computed(() =>
	messages.value.reduce((max, curr) => Math.max(max, curr.id), 0),
);

useIntervalFn(() => {
	sync(lastindex.value);
}, 1000);

// Sending Message
const input = ref("");
const { isLoading, execute: handleSubmit } = useAsyncState(
	async () => {
		const message = input.value;
		const new_message =
			(await $fetch(`/api/chat/user/${other.value}`, {
				method: "POST",
				body: JSON.stringify({ message }),
			})) || {};
		input.value = "";
		return new_message;
	},
	undefined,
	{ immediate: false },
);

// Transforming Messages
const mappedMessages = useArrayMap(messages, (m) => {
	const fromCurrent = m.sender_id === user.value?.id;
	const sender = fromCurrent ? user.value : otherUser.value;

	if (!sender) return undefined;

	return {
		id: m.id,
		author: {
			id: m.sender_id,
			name: sender.name || "",
			avatar_url: sender.avatar_url || undefined,
		},
		content: m.message || "",
		reverse: !fromCurrent,
	};
});
</script>

<template>
	<Fill flex-col class="hide mx-auto flex w-full max-w-sm sm:max-w-md lg:max-w-lg">
		<Fill flex-col class="scrollbar-hidden gap-2">
			<h2 class="text-2xl font-semibold">{{ otherUser?.name }}</h2>
			<template v-for="m in mappedMessages">
				<ChatBubble
					v-if="m"
					:key="m.id"
					:author="m.author"
					:content="m.content"
					:reverse="m.reverse"
				/>
			</template>
		</Fill>

		<form @submit.prevent="() => handleSubmit()">
			<input
				:disabled="isLoading"
				v-model="input"
				:class="messages.length === 0 ? 'mb-[44vh]' : 'mb-16'"
				class="w-full max-w-sm rounded-2xl border border-zinc-300 p-2.5 shadow-xl sm:max-w-md lg:max-w-lg"
				placeholder="Say something..."
			/>
		</form>
	</Fill>
</template>

<style lang="scss" scoped></style>
