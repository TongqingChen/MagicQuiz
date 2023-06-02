<template>
    <span v-if="data.blinkFlag">{{ data.text }}</span>
</template>

<script lang="ts" setup>
import { onBeforeUnmount, reactive, watch } from 'vue'
import { ATime } from '@/utils/date'

const data = reactive({
    timer: 0,
    durationSecs: 60,
    text: '',
    blinkFlag: true,
    color: {},
    is_stoped: false,
    now: 0,
})
const time = new ATime()

const props = withDefaults(defineProps<{
    start_text: string,
    duration_secs: number,
    blink: boolean,
    start_flag: boolean,
    count_down: boolean
}>(), { start_text: '【剩余时间】', duration_secs: 60, blink: false, start_flag: false, count_down: true })

const emit = defineEmits(['end_event'])

const tickToc = () => {
    data.timer = window.setTimeout(() => {
        if (props.blink) {
            data.blinkFlag = !data.blinkFlag
        }
        if (!props.blink || data.blinkFlag) {
            var diff_sec = Math.floor((Date.now() - data.now) / 1000)
            data.durationSecs = props.count_down ? (props.duration_secs - diff_sec) : diff_sec
            time.setSeconds(data.durationSecs)
            data.text = props.start_text + time.toString()
            if ((props.count_down && data.durationSecs <= 0) ||
                (!props.count_down && data.durationSecs >= props.duration_secs)) {
                stopTickToc()
                emit("end_event")
                return
            }
        }
        tickToc()
    }, props.blink ? 500 : 1000)
}
const stopTickToc = () => {
    // 清除掉定时器
    if (!data.is_stoped) {
        data.is_stoped = true
        time.setSeconds(props.count_down ? (props.duration_secs - data.durationSecs) : data.durationSecs)
        data.text = '【用时】' + time.toStringWithUnit()
        clearTimeout(data.timer)
        data.blinkFlag = true
    }
}

watch(
    () => props.start_flag,
    (new_v, old_v) => {
        if (new_v) {
            data.is_stoped = false
            data.durationSecs = props.count_down ? props.duration_secs : 0
            // 清除掉定时器
            data.timer && clearTimeout(data.timer)
            // 开启定时器
            data.now = Date.now()
            tickToc()
        } else {
            stopTickToc()
        }
    })

onBeforeUnmount(() => {
    clearTimeout(data.timer)
})
</script>