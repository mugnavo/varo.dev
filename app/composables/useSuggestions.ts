import type { DeveloperListItem } from "~/components/Tool/DeveloperList/index.vue";

export const useSuggestions = () => {
	const { user } = useUserSession();
	const default_value = {
		component: "DeveloperList",
		developers: [],
	} as SearchDevelopersReturnType;

	const state = useAsyncState(
		async () => {
			if (!user.value) return default_value;
			const currentId = user.value.id;

			const { users } = await $fetch("/api/user/suggestions");
			const userIds = users.map((u) => getOther(currentId, u));

			const suggestions = await Promise.all(
				userIds.map(async (id) => {
					const { user } = await $fetch(`/api/user/${id}`, {
						method: "GET",
					});
					return {
						embedding_content: "suggestion",
						embedding_similarity: 1,
						user_id: user.id,
						user_name: user.name,
						user_avatar: user.avatar_url,
						user_location: user.location,
						user_bio: user.bio,
						user_username: user.username,
						user_skills: user.skills,
						user_tech_stack: user.tech_stack,
						user_interests: user.interests,
						user_availability: user.availability,
						user_experience: user.experience_level,
						user_match_user: user.match_user,
						user_match_project: user.match_project,
					} as DeveloperListItem;
				}),
			);

			return {
				component: "DeveloperList",
				developers: suggestions || null,
			} as SearchDevelopersReturnType;
		},
		default_value,
		{ shallow: false },
	);

	return state;
};
