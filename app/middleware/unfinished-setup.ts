export default defineNuxtRouteMiddleware((to, from) => {
	const { user } = useUserSession();

	if (user.value?.finished_setup) {
		return navigateTo("/app");
	}
});
