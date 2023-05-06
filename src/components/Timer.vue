<template>
    <span v-if="data.blinkFlag">{{ data.text }}</span>
</template>

<script lang="ts" setup>
import { onUnmounted, reactive, watch } from 'vue'

const data = reactive({
    timer: 0,
    durationSecs: 60,
    text: '',
    blinkFlag: true,
    color: {}
})

const props = withDefaults(defineProps<{
    start_text: string,
    duration_secs: number,
    blink: boolean,
    start_flag: boolean,
    count_down: boolean
}>(), { start_text: '【剩余时间】', duration_secs: 60, blink: false, start_flag: false, count_down: true })

const emit = defineEmits(['end_event'])

const startTickToc = () => {
    data.durationSecs = props.count_down ? props.duration_secs : 0
    // 清除掉定时器
    clearInterval(data.timer)
    // 开启定时器
    data.timer = window.setInterval(() => {
        if (props.blink) {
            data.blinkFlag = !data.blinkFlag
        }
        if (!props.blink || data.blinkFlag) {
            let tmp = props.count_down ? (--data.durationSecs) : (++data.durationSecs)
            const sec_min_hour_str = ['', '', '']
            for (var i = 0; i < 3; i++) {
                var digital = tmp % 60
                tmp = Math.floor(tmp / 60)
                sec_min_hour_str[i] = `00${digital}`.slice(-2)
            }
            data.text = `${props.start_text}${sec_min_hour_str[2]}:${sec_min_hour_str[1]}:${sec_min_hour_str[0]}`
            if ((props.count_down && data.durationSecs <= 0) ||
                (!props.count_down && data.durationSecs >= props.duration_secs)) {
                stopTickToc()
            }
        }
    }, props.blink ? 500 : 1000)
}
const stopTickToc = () => {
    // 清除掉定时器
    var mins = Math.round((props.count_down ? (props.duration_secs - data.durationSecs) : data.durationSecs) / 60)
    clearInterval(data.timer)
    data.text = `【用时】${mins}分钟`
    data.blinkFlag = true
    emit("end_event")
}

watch(
    () => props.start_flag,
    (new_v, old_v) => {
        if (new_v) {
            startTickToc()
        } else {
            stopTickToc()
        }
    })

onUnmounted(() => {
    clearInterval(data.timer)
})
</script>