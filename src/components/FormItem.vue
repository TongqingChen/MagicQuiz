<template>
    <el-form-item :label="label">
        <el-row :gutter="10">
            <el-col :xs="24" :sm="16" :md="12" :lg="10" :xl="8">
                <el-input :disabled="disabled" :type="type" v-model="inputVal" />
            </el-col>
        </el-row>
    </el-form-item>
</template>
<script setup lang="ts">
import { onMounted, ref, watch } from 'vue';

const props = defineProps(["modelValue", "label", "type", "disabled"])
const inputVal = ref('')
const emits = defineEmits(["update:modelValue"])
watch(inputVal, async (newV, oldV) => { emits("update:modelValue", newV) })
onMounted(() => inputVal.value = props.modelValue)
</script>

<style lang="scss" scoped>
.el-row {
    width: 100%;
}
</style>