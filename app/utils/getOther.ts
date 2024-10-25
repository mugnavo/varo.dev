// Will decide on which user1_id or user2_id is the other id aside from the user
export default (currentId: number, obj: { user1_id: number; user2_id: number }) => {
	return currentId === obj.user1_id ? obj.user2_id : obj.user1_id;
};
