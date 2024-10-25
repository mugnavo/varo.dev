import { defineStore, acceptHMRUpdate } from "pinia";

export const useConnectionsStore = defineStore("connections", () => {
	const { user } = useUserSession();

	// Connections
	const {
		state: connections,
		isLoading,
		error,
		execute: sync,
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
					const { user } = await $fetch(`/api/user/${id}`, {
						method: "GET",
					});
					return user;
				}),
			);

			const projectsData = (
				await Promise.all(
					userConns.map(async (id) => {
						const project = await $fetch(`/api/project/${id}`, {
							method: "GET",
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

	return {
		connections,
		isLoading,
		error,
		sync,
	};
});
