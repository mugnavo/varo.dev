<script setup lang="ts">
const { user, clear } = useUserSession();

</script>
<template>
    <div class="flex flex-col gap-4 p-6">
        <h1 class="text-4xl font-bold">varo.dev</h1>

        <div
            v-if="user"
            class="flex flex-col gap-2"
        >
            <p>Welcome back, {{ user.name }}!</p>
            <NuxtLink
                class="py-2 px-4 bg-slate-950 transition-colors text-white w-fit hover:bg-slate-800 rounded-md"
                to="/dashboard"
            >Go to Dashboard</NuxtLink>
            <div>
                More data:
                <pre>{{ JSON.stringify(user, null, 2) }}</pre>
            </div>

            <button
                class="py-2 px-4 bg-red-700 transition-colors text-white w-fit hover:bg-red-600 rounded-md"
                @click="clear"
            >
                Sign out
            </button>
        </div>
        <div
            v-else
            class="flex flex-col gap-2"
        >
            <p>You are not signed in.</p>
            <NuxtLink
                to="/signin"
                class="py-2 px-4 bg-slate-950 transition-colors text-white w-fit hover:bg-slate-800 rounded-md"
            >Sign in</NuxtLink>
        </div>
    </div>
</template>