<script setup lang="ts">
import { set } from "@vueuse/core";
import * as yup from "yup";
import type { QuerySchemaMeta } from "~~/layers/josh/components/DynamicForm/types";

const route = useRoute("app-user");
const other = computed(() => Number(route.params.user));

export type SidebarItem = {
	title: string;
	subtitle?: string;
	avatar?: string;
	active?: boolean;
	onClick?: Function;
	route?: string;
};

const open = defineModel<boolean>({ default: false });
const { items } = defineProps<{
	items: SidebarItem[];
	title?: string;
	loading?: boolean;
}>();

const bot = {
	title: "Varobot",
	avatar: "https://utfs.io/f/w9lPaB25Y3OzmCTA1ULmuwpHghKWZsGjrqvEX4O7L8clzxfP",
	active: isNaN(other.value),
	route: "/app",
};

// Current user
const { user, clear } = useUserSession();
const avatar = computed(() => user.value?.avatar_url);
const initials = computed(() => toInitials(user.value?.name || ""));

const isLoggingOut = ref(false);

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
				<AppSidebarItem :item="bot" />
				<strong class="my-2 ml-2 text-sm text-surface-500">Connections</strong>
				<Loader :finished="!loading">
					<AppSidebarItem v-for="item in items" :item :key="item.title" />
					<Empty
						v-if="items.length == 0"
						text="No connections yet"
						icon="pi pi-users"
					/>
				</Loader>
			</Fill>

			<Divider />

			<footer class="flex">
				<Button
					icon="pi pi-user"
					@click="askforsomething"
					link
					v-tip="'Profile'"
				/>
				<Button icon="pi pi-cog" link v-tip="'Settings'" />
				<Button
					icon="pi pi-sign-out"
					severity="danger"
					link
					v-tip="'Sign out'"
					class="ml-auto"
					:loading="isLoggingOut"
					@click="
						async () => {
							isLoggingOut = true;
							await clear();
							navigateTo('/');
						}
					"
				/>
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
			@apply text-sm text-surface-400;
		}
	}
}

footer {
	@apply gap-2 p-4 pt-1;
}
</style>
