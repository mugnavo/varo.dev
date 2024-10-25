<script setup lang="ts">
import { useChat } from "@ai-sdk/vue";
import type { ToolInvocation } from "ai";
import { ToolDeveloperList } from "#components";

const { messages, input, handleSubmit } = useChat({
	api: "/api/chat",
});

watch(messages, (newMessages) => {
	console.log("updated");
	console.log(newMessages);
});

// Dynamic Tool Component
const components = { ToolDeveloperList };
const getComponent = (invoc: ToolInvocation & { state: "result" }) => {
	const name = invoc.result.component;
	if (`Tool${capitalize(name)}` in components) {
		//@ts-expect-error will always ts error since compnents is a const
		return components[`Tool${capitalize(name)}`];
	}
};
</script>

<template>
	<Fill flex-col class="hide mx-auto flex w-full max-w-sm sm:max-w-md lg:max-w-lg">
		<Fill flex-col class="scrollbar-hidden">
			<div v-for="m in messages" :key="m.id" class="whitespace-pre-wrap">
				<template v-if="m.content.trim()">
					{{ m.role === "user" ? "User: " : "AI: " }}
					{{ m.content }}
				</template>

				<!-- we can use tool invocation results to render components -->
				<template
					v-for="toolInvoc in m.toolInvocations"
					:key="toolInvoc.toolCallId"
				>
					<template v-if="toolInvoc.state === 'result'">
						<component
							:is="getComponent(toolInvoc)"
							:data="toolInvoc.result"
						/>
						{{ toolInvoc.result }}
					</template>
				</template>
			</div>
		</Fill>

		<form @submit="handleSubmit">
			<input
				v-model="input"
				:class="messages.length === 0 ? 'mb-[44vh]' : 'mb-16'"
				class="w-full max-w-sm rounded-2xl border border-zinc-300 p-2.5 shadow-xl transition-all sm:max-w-md lg:max-w-lg"
				placeholder="Say something..."
			/>
		</form>
	</Fill>
</template>
