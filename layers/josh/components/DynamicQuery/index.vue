<script setup lang="ts" generic="Schema extends yup.AnyObject">
import { get, set, useDraggable, whenever } from "@vueuse/core";
import { nextTick, onMounted, reactive, ref } from "vue";
import * as yup from "yup";
import type { QueryInfer, QueryState } from "@/components/DynamicForm/types";

const show = ref(false);
const state = reactive<Partial<QueryState>>({});
const schema = ref<yup.ObjectSchema<Schema>>();

const { __load__ } = useQuery();
const { height, width } = useWindowSize();

onMounted(() => {
    __load__({
        show(s) {
            // Add data
            state.title = s.title;
            state.description = s.description;
            state.approve = s.approve;
            state.reject = s.reject;
            state.confirm = s.confirm;
            state.approveText = s.approveText;
            state.rejectText = s.rejectText;
            state.backdropClosing = s.backdropClosing === undefined ? true : s.backdropClosing;
            state.then = s.then;
            state.joinLabels = s.joinLabels;
            set(schema, s.schema as yup.ObjectSchema<Schema>);
            set(show, true);

            if (!import.meta.client) return;

            // Change positions after 1 tick
            setTimeout(() => {
                x.value = window.innerWidth / 2 - (content.value?.clientWidth || 0) / 2;
                y.value = window.innerHeight / 2 - (content.value?.clientHeight || 0) / 2;
            }, 10);
        },
    });
});

//#region Animations
const hidden = ref(true);
whenever(show, () => {
    nextTick().then(() => set(hidden, false));
});

const close = (after?: () => void) => {
    hidden.value = true;
    setTimeout(() => {
        set(show, false);
        if (after) after();
    }, 150);
};

const onCancel = () => {
    if (get(isSubmitting)) return;
    close(() => state.reject && state.reject());
};

//#region Submitting
const isSubmitting = ref<boolean>(false);
const onSubmit = async (value?: QueryInfer<Schema>) => {
    if (state.then) {
        set(isSubmitting, true);
        if (state.approve && !!value) await state.then(value);
        else if (state.confirm) await state.then({});
        set(isSubmitting, false);
    }

    if (state.approve && !!value) state.approve(value);
    else if (state.confirm) state.confirm();
    close();
};

//#region Dragging
const content = ref<InstanceType<typeof HTMLDivElement>>();
const handle = ref<InstanceType<typeof HTMLDivElement>>();
const { style, x, y, isDragging } = useDraggable(content, {
    handle: handle,
    initialValue: {
        x: width.value / 2,
        y: height.value / 2,
    },
});
</script>

<template>
    <Teleport to="body">
        <Screen v-if="show" @click.self="onCancel" class="absolute z-50 top-0 left-0">
            <Transition name="fade">
                <div
                    v-if="!hidden"
                    class="backdrop absolute h-screen w-screen bg-surface-800/70 backdrop-blur-sm"
                    ref="backdrop"
                    @click="
                        () => {
                            if (state.backdropClosing) onCancel();
                        }
                    "
                ></div>
            </Transition>
            <Transition name="expand">
                <div
                    :style="style"
                    v-if="!hidden"
                    ref="content"
                    class="content absolute bottom-0 left-0 right-0 top-0 h-fit w-fit min-w-[400px] rounded-md border border-surface-800 bg-surface-900 shadow-xl"
                    :class="{
                        'cursor-grabbing': isDragging,
                    }"
                >
                    <!--Title-->
                    <div
                        ref="handle"
                        class="flex items-center justify-between bg-surface-950 rounded-t-md p-6 pb-2 pt-4 text-base font-semibold"
                    >
                        <span>{{ state.title }}</span>
                        <Button
                            severity="secondary"
                            text
                            rounded
                            @click="onCancel"
                            icon="pi pi-times"
                            v-tip="{
                                text: 'Close',
                                hotkey: 'escape',
                            }"
                        />
                        <Hotkey @press="onCancel" hidden hotkey="escape" />
                    </div>
                    <!-- Description -->
                    <div
                        v-if="state.description"
                        v-html="state.description"
                        class="px-6 pt-3 text-sm font-light"
                    ></div>
                    <!-- Fields -->
                    <div v-if="!!schema" class="px-6 pb-3">
                        <DynamicForm
                            :schema="schema"
                            @submit="onSubmit"
                            :confirm-text="state.approveText"
                            :isSubmitting="isSubmitting"
                            :join-labels="state.joinLabels"
                        />
                    </div>
                    <div v-else class="flex justify-end gap-2 px-6 pb-3 pt-2">
                        <Button
                            @click="() => onSubmit()"
                            severity="success"
                            type="submit"
                            :loading="isSubmitting"
                            :label="state.approveText || 'Confirm'"
                        />
                    </div>
                </div>
            </Transition>
        </Screen>
    </Teleport>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}

.expand-enter-active {
    animation: expand 0.15s;
}
.expand-leave-active {
    animation: expand 0.15s reverse;
}
@keyframes expand {
    0% {
        transform: scale(0);
    }
    100% {
        transform: scale(1);
    }
}
</style>
