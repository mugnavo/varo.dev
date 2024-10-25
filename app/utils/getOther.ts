import type { User } from "~~/server/schemas";

// Will decide on which user1_id or user2_id is the other id aside from the user
export default (
	currentId: number,
	obj: { user1_id: number; user2_id: number; user1: User; user2: User },
) => {
	return currentId === obj.user1_id ? obj.user2 : obj.user1;
};
