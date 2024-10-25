<script setup lang="ts">
import ColorPicker from "primevue/colorpicker";
import InputNumber from "primevue/inputnumber";
import InputSwitch from "primevue/inputswitch";
import SelectButton from "primevue/selectbutton";
import InputText from "primevue/inputtext";
import Slider from "primevue/slider";
import Textarea from "primevue/textarea";
import { type QueryField } from "./types.js";

const props = defineProps<{
    field: QueryField;
    joinLabel?: boolean;
}>();

const errors = inject<Ref<Record<string, string>>>(`query-errors`, ref({}));
const error = computed(() =>
    props.field.key in errors.value ? errors.value[props.field.key] : ""
);
</script>

<template>
    <tr>
        <td class="label mt-1 py-2 pb-0 pr-3" v-if="!joinLabel">{{ field.label }}</td>
        <td class="mt-1 flex flex-col py-2 pt-0.5">
            <span v-if="joinLabel" class="label mt-1.5 py-0.5">{{ field.label }}</span>
            <InputNumber v-if="field.type === 'number'" v-model="field.value" />
            <Textarea v-else-if="field.type === 'textarea'" v-model="field.value" />
            <ColorPicker v-else-if="field.type === 'color'" v-model="field.value" />
            <Select
                v-else-if="field.type === 'select'"
                v-model="field.value"
                :multiple="!!field.multiple"
                :options="field.options"
                :option-label="field.optionLabel"
                :option-value="field.optionValue"
            />
            <SelectButton
                v-else-if="field.type === 'select-btn'"
                class="pb-1"
                v-model="field.value"
                :multiple="!!field.multiple"
                :options="field.options"
            />
            <!-- <TimePicker v-else-if="field.type === 'time'" v-model="field.value" /> -->

            <div v-else-if="field.type === 'range'" class="flex items-center gap-4 pr-3">
                <InputNumber class="!w-16" v-model="field.value" />
                <Slider
                    v-model="field.value"
                    :min="field.min"
                    :max="field.max"
                    :step="field.step"
                    class="flex-grow"
                />
            </div>
            <InputSwitch v-else-if="field.type === 'checkbox'" v-model="field.value" />
            <DynamicFormChips
                v-else-if="field.type === 'chips'"
                v-model="field.value"
                :options="field.options"
                :empty-string="field.empty"
            />
            <DynamicFormFile
                v-else-if="field.type === 'file'"
                v-model="field.value"
                :accept="field.accept!"
                :multiple="field.multiple"
                :base64="field.base64"
            />
            <DynamicFormFile v-else-if="field.type === 'directory'" :directory="true" />
            <DynamicFormCustom
                v-else-if="field.type === 'component'"
                v-model="field.value"
                :mount="field.mount"
            />
            <Password
                v-else-if="field.type === 'password'"
                class="w-full"
                input-class="w-full"
                v-model="field.value"
                toggle-mask
                :feedback="false"
            />
            <InputText v-else v-model="field.value" :placeholder="field.default" />
            <span v-if="error?.length" class="h-0 text-xs text-red-400">{{ error }}</span>
        </td>
    </tr>
</template>

<style lang="scss" scoped>
.label {
    @apply text-sm text-surface-300;
}
</style>
