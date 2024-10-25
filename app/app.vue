<template>
	<NuxtRouteAnnouncer />
	<Toast position="bottom-right" />
	<DynamicQuery />
	<van-config-provider theme="dark">
		<NuxtLayout>
			<NuxtPage />
		</NuxtLayout>
	</van-config-provider>
	<ClientOnly>
		<Tooltip />
	</ClientOnly>
</template>

<style lang="scss">
body {
	@apply bg-zinc-950 text-zinc-300;
}

* {
	@apply border-zinc-800;
}
</style>
