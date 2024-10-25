export default defineNuxtRouteMiddleware(async (to, from) => {
	// skip on server
	if (import.meta.server) return;

	const other = Number(to.params.user);
	if (isNaN(other)) navigateTo("/app");

	const { connected } = await $fetch(`/api/user/connections/user/${other}`, {
		method: "GET",
	});

	if (!connected) return navigateTo("/app/");
});
