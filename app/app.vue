<template>
	<NuxtRouteAnnouncer />
	<van-config-provider theme="dark">
		<NuxtLayout>
			<NuxtPage />
		</NuxtLayout>
	</van-config-provider>
</template>

<style lang="postcss">
body {
	@apply bg-zinc-950 text-zinc-300;
}

* {
	@apply border-zinc-800;
}
</style>
