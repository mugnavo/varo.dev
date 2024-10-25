<script setup lang="ts">
import type { SidebarItem } from "~/components/AppSidebar/index.vue";

const openSidebar = ref(false);

const { user } = useUserSession();

// Connections
const connectionStore = useConnectionsStore();
const { connections, isLoading } = storeToRefs(connectionStore);

// Sidebar items
const route = useRoute();
const other = computed(() => Number(route.params.user));
const usersConnections = computed(
	() =>
		connections.value?.users.map(
			(u) =>
				({
					title: u.name,
					subtitle: u.email,
					avatar: u.avatar_url,
					active: other.value === u.id,
					route: `/app/${u.id}`,
				}) as SidebarItem,
		) || [],
);
</script>

<template>
	<Screen>
		<Button icon="pi pi-bars" text @click="openSidebar = true" class="ml-4 mt-4" />
		<AppSidebar
			v-model="openSidebar"
			:items="usersConnections"
			:loading="isLoading"
		/>
		<slot />
	</Screen>
</template>

<style lang="scss" scoped></style>
