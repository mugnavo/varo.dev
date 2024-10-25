import type { DeveloperListItem } from "~/components/Tool/DeveloperList/index.vue";
import type { User } from "~~/server/schemas";

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
			const otherUsers = users.map((u) =>
				getOther(currentId, {
					user1_id: u.user1_id,
					user2_id: u.user2_id,
					user1: { ...u.user1 } as unknown as User,
					user2: { ...u.user2 } as unknown as User,
				}),
			);

			const suggestions = otherUsers.map((u) => {
				return {
					embedding_content: "suggestion",
					embedding_similarity: 1,
					user_id: u.id,
					user_name: u.name,
					user_avatar: u.avatar_url,
					user_location: u.location,
					user_bio: u.bio,
					user_username: u.username,
					user_skills: u.skills,
					user_tech_stack: u.tech_stack,
					user_interests: u.interests,
					user_availability: u.availability,
					user_experience: u.experience_level,
					user_match_user: u.match_user,
					user_match_project: u.match_project,
				} as DeveloperListItem;
			});

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
