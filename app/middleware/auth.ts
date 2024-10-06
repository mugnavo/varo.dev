import { useUser } from "~/composables/user";

export default defineNuxtRouteMiddleware(async (to) => {
  const user = useUser();
  if (!user.value && to.path !== "/signin" && to.path !== "/") {
    return navigateTo("/signin");
  }
});
