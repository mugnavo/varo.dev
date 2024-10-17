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
	@apply bg-stone-950 text-stone-300;
}

* {
	@apply border-stone-800;
}
</style>
