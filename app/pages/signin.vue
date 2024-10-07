<script setup lang="ts">
definePageMeta({
    middleware: ['guest-only']
})

const { signIn } = useAuth();
</script>

<template>
    <div class="flex min-h-screen items-center justify-center">
        <div class="flex flex-col items-center gap-8 rounded-xl border bg-muted p-10">
            Logo here
            <div class="flex flex-col gap-2">
                <button
                    @click="signIn('github')"
                    class="py-2 px-4 bg-slate-950 transition-colors text-white w-fit hover:bg-slate-800 rounded-md"
                >
                    Sign in with GitHub
                </button>
                <button
                    @click="signIn('google')"
                    class="py-2 px-4 bg-slate-950 transition-colors text-white w-fit hover:bg-slate-800 rounded-md"
                >
                    Sign in with Google
                </button>
                TODO: email/magic links?
            </div>
        </div>
    </div>
</template>