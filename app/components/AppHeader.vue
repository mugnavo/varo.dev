<script setup lang="ts">
const { loggedIn } = useUserSession();
</script>

<template>
	<header>
		<strong>Varo.Dev</strong>
		<form class="text-surface-950" method="GET">
			<Button
				v-if="loggedIn"
				label="Goto App"
				icon="pi pi-arrow-right"
				icon-pos="right"
				href="/app"
				as="a"
			/>
			<Button
				v-else
				icon="pi pi-github"
				label="Sign in by Github"
				type="submit"
				formaction="/api/auth/github"
			/>
		</form>
	</header>
</template>

<style lang="scss" scoped>
header {
	@apply fixed left-0 right-0 top-0 mx-auto flex w-screen max-w-screen-xl justify-between p-4;
}
</style>
