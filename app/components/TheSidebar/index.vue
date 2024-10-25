<script setup lang="ts">
import { set } from "@vueuse/core";
import * as yup from "yup";
import type { QuerySchemaMeta } from "~~/layers/josh/components/DynamicForm/types";

export type SidebarItem = {
	title: string;
	subtitle?: string;
	avatar?: string;
	active?: boolean;
	onClick?: Function;
};

const open = defineModel<boolean>({ default: false });
const { items } = defineProps<{
	items: SidebarItem[];
	title?: string;
	loading?: boolean;
}>();

// Current user
const { user } = useUserSession();
const avatar = computed(() => user.value?.avatar_url);
const initials = computed(() => toInitials(user.value?.name || ""));

// test
const { ask } = useQuery();
const askforsomething = async () => {
	set(open, false);
	const data = await ask({
		title: "You wanna ask something?",
		description: "what is it you ask?",
		schema: yup.object({
			name: yup.string().required("Please put your name").label("username"),
			skils: yup.array(yup.string()).meta({ type: "chips" } as QuerySchemaMeta),
			description: yup
				.string()
				.required("Please input a description")
				.min(12, "Please input a minimum of 12 characters")
				.meta({ type: "textarea" } as QuerySchemaMeta),
		}),
		joinLabels: true,
	});
};
</script>

<template>
	<Drawer v-model:visible="open" :header="title">
		<template #container>
			<header>
				<Avatar
					shape="circle"
					:image="avatar"
					:label="avatar ? undefined : initials || undefined"
					size="large"
				/>
				<div class="profile">
					<h5>{{ user?.name }}</h5>
					<span>{{ user?.email }}</span>
				</div>
			</header>

			<Divider />

			<Fill flex-col>
				<TheSidebarItem :item="{ title: 'Marion', avatar: '/marion.png' }" />
				<strong class="text-surface-500 my-2 ml-2 text-sm">Connections</strong>
				<Loader :finished="!loading">
					<TheSidebarItem v-for="item in items" :item :key="item.title" />
					<Empty
						v-if="items.length == 0"
						text="No connections yet"
						icon="pi pi-users"
					/>
				</Loader>
			</Fill>

			<Divider />

			<footer>
				<Button
					icon="pi pi-user"
					@click="askforsomething"
					link
					v-tip="'Profile'"
				/>
				<Button icon="pi pi-cog" link v-tip="'Settings'" />
			</footer>
		</template>
	</Drawer>
</template>

<style lang="scss" scoped>
header {
	@apply mb-2 flex gap-6 p-4 pb-1;

	.profile {
		@apply flex flex-col;

		h5 {
			@apply whitespace-nowrap break-keep text-lg;
		}

		span {
			@apply text-surface-400 text-sm;
		}
	}
}

footer {
	@apply space-x-2 p-4 pt-1;
}
</style>
