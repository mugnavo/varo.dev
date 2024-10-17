<template>
	<NuxtRouteAnnouncer />
	<van-config-provider theme="dark">
		<NuxtLayout>
			<NuxtPage />
		</NuxtLayout>
	</van-config-provider>
</template>

<script>
import { Locale } from "vant";
import enUS from "vant/es/locale/lang/en-US";

Locale.use("en-US", enUS);
</script>

<style lang="postcss">
body {
	@apply bg-stone-950 text-stone-300;
}

* {
	@apply border-stone-800;
}
</style>
