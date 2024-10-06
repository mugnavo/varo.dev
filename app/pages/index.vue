<script setup lang="ts">
const user = useUser();
</script>
<template>
    <div class="flex flex-col gap-4 p-6">
        <h1 class="text-4xl font-bold">TanStarter</h1>
        <div class="flex items-center gap-2">
            This is an unprotected page:
            <pre class="rounded-md border bg-slate-50 p-1">routes/index.tsx</pre>
        </div>

        <div
            v-if="user"
            class="flex flex-col gap-2"
        >
            <p>Welcome back, {{ user.name || user.firstName }}!</p>
            <NuxtLink
                class="py-2 px-4 bg-slate-950 transition-colors text-white w-fit hover:bg-slate-800 rounded-md"
                to="/dashboard"
            >Go to Dashboard</NuxtLink>
            <div>
                More data:
                <pre>{{ JSON.stringify(user, null, 2) }}</pre>
            </div>

            <form
                method="POST"
                action="/api/auth/logout"
            >
                <button
                    type="submit"
                    class="py-2 px-4 bg-red-700 transition-colors text-white w-fit hover:bg-red-600 rounded-md"
                >
                    Sign out
                </button>
            </form>
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