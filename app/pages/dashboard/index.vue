<script setup lang="ts">
import { useChat } from '@ai-sdk/vue';

const { messages, input, handleSubmit } = useChat({ api: "/api/chat" });
</script>

<template>
    <div class=" flex-col flex w-full max-w-lg py-24 mx-auto stretch">
        <div
            v-for="m in messages"
            :key="m.id"
            class="whitespace-pre-wrap"
        >
            {{ m.role === 'user' ? 'User: ' : 'AI: ' }}
            {{ m.content }}
        </div>
        <form @submit="handleSubmit">
            <input
                v-model="input"
                :class="messages.length === 0 ? 'mb-[44vh]' : 'mb-16'"
                class="w-full fixed bottom-0 max-w-lg p-2.5 transition-all border border-gray-300 rounded-2xl shadow-xl"
                placeholder="Say something..."
            >
        </form>
    </div>
</template>