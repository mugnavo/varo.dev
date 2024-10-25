export default defineNuxtRouteMiddleware((to, from) => {
	const { user } = useUserSession();

	return; //
	if (!user.value?.finished_setup) {
		navigateTo("/setup");
	}
});
