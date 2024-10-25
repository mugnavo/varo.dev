<script setup lang="ts">
const openSidebar = ref(false);
</script>

<template>
	<Screen>
		<Button icon="pi pi-bars" text @click="openSidebar = true" class="ml-4 mt-4" />
		<TheSidebar v-model="openSidebar" :items="[]" />
		<slot />
	</Screen>
</template>

<style lang="scss" scoped></style>
