export default defineNuxtRouteMiddleware(() => {
	const { loggedIn, user } = useUserSession();

	if (!loggedIn.value || !user.value) {
		return navigateTo("/signin");
	}
});
