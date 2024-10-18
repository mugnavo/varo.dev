<script setup lang="ts">
import { useChat } from "@ai-sdk/vue";

const { messages, input, handleSubmit } = useChat({
	api: "/api/chat",
});

watch(messages, (newMessages) => {
	console.log("updated");
	console.log(newMessages);
});
</script>

<template>
	<div
		class="stretch mx-auto flex w-full max-w-sm flex-col py-24 sm:max-w-md lg:max-w-lg"
	>
		<div v-for="m in messages" :key="m.id" class="whitespace-pre-wrap">
			<template v-if="m.content.trim()">
				{{ m.role === "user" ? "User: " : "AI: " }}
				{{ m.content }}
			</template>

			<!-- we can use tool invocation results to render components -->
			<template v-for="toolInvoc in m.toolInvocations" :key="toolInvoc.toolCallId">
				<template v-if="toolInvoc.state === 'result'">{{
					toolInvoc.result
				}}</template>
			</template>
		</div>
		<form @submit="handleSubmit">
			<input
				v-model="input"
				:class="messages.length === 0 ? 'mb-[44vh]' : 'mb-16'"
				class="fixed bottom-0 w-full max-w-sm rounded-2xl border border-zinc-300 p-2.5 shadow-xl transition-all sm:max-w-md lg:max-w-lg"
				placeholder="Say something..."
			/>
		</form>
	</div>
</template>
