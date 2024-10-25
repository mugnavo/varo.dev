<script setup lang="ts">
import type { SidebarItem } from "~/components/AppSidebar/index.vue";

const openSidebar = ref(false);

const { user } = useUserSession();

// Connections
const {
	state: connections,
	isLoading,
	error,
} = useAsyncState(
	async () => {
		const currentUser = user.value;
		if (!currentUser) return { users: [], projects: [] };

		const { projects, users } =
			(await $fetch("/api/user/connections", { method: "GET" })) || {};
		const userConns = users.map((u) =>
			u.user1_id === currentUser.id ? u.user2_id : u.user1_id,
		);

		const usersData = await Promise.all(
			userConns.map(async (id) => {
				const { user } = await $fetch(`/api/user/:id`, {
					method: "GET",
					params: { id },
				});
				return user;
			}),
		);

		const projectsData = (
			await Promise.all(
				userConns.map(async (id) => {
					const project = await $fetch("/api/project/:id", {
						method: "GET",
						params: { id },
					});
					return project;
				}),
			)
		).filter((p) => !!p);

		return { users: usersData, projects: projectsData };
	},
	undefined,
	{ shallow: false },
);

const usersConnections = computed(
	() =>
		connections.value?.users.map(
			(u) =>
				({
					title: `${u.first_name} ${u.last_name}`,
					subtitle: u.email,
					avatar: u.avatar_url,
				}) as SidebarItem,
		) || [],
);
</script>

<template>
	<Screen>
		<Button icon="pi pi-bars" text @click="openSidebar = true" class="ml-4 mt-4" />
		<AppSidebar
			v-model="openSidebar"
			:items="usersConnections"
			:loading="isLoading"
		/>
		<slot />
	</Screen>
</template>

<style lang="scss" scoped></style>
