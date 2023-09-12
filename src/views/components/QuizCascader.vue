<template>
    <div>
        <div class="subject" v-for="(t, k) in titles">
            <span>{{ t.label }}：</span>
            <el-radio-group
                v-model="idxs[k]"
                @change="onItemSelected(k)"
                size="small"
            >
                <el-radio-button v-for="(v, i) in t.items" :label="i">
                    {{ v.name }}</el-radio-button
                >
            </el-radio-group>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { reactive, ref, watch } from 'vue';
import {
    IBaseInfo,
    IQuizCascaderTitle,
    ISubjectInfo,
} from '@/types/quiz_cascader';

const props = defineProps<{
    options: ISubjectInfo[];
}>();
const emits = defineEmits(['clicked']);

let expand = ref(true);

let titles: IQuizCascaderTitle[] = reactive([
    { label: '科目', items: [] },
    { label: '年级', items: [] },
    { label: '分册', items: [] },
]);
let idxs = ref([0, 0, 0]);

const onItemSelected = (k: number) => {
    if (k < 1) {
        titles[1].items = [];
        props.options[idxs.value[0]].children.forEach((s) => {
            titles[1].items.push(s.v);
        });
        idxs.value[1] = 0;
    }
    if (k < 2) {
        titles[2].items = [];
        props.options[idxs.value[0]].children[idxs.value[1]].children.forEach(
            (g) => {
                titles[2].items.push(g);
            }
        );
        idxs.value[2] = 0;
    }
    var ids: IBaseInfo[] = [];
    for (var i = 0; i < 3; i++) {
        ids.push(titles[i].items[idxs.value[i]]);
    }
    emits('clicked', ids[0], ids[1], ids[2]);
};

watch(props.options, (new_v, _old_v) => {
    if (new_v.length > 0) {
        titles[0].items = titles[0].items.slice();
        props.options.forEach((opt) => {
            titles[0].items.push(opt.v);
        });
        titles.length > 0 && (idxs.value[0] = 0);
        onItemSelected(0);
    }
});
</script>

<style lang="scss" scoped>
.subject {
    display: flex;
    align-items: center;
    margin-bottom: 10px;
    font-weight: bold;
    width: 100%;
    font-size: 14px;
}
</style>
