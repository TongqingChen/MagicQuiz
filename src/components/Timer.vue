<template>
    <span v-if="data.blinkFlag">{{ data.text }}</span>
</template>

<script lang="ts" setup>
import { onBeforeUnmount, reactive, watch } from 'vue'

const data = reactive({
    timer: 0,
    durationSecs: 60,
    text: '',
    blinkFlag: true,
    color: {},
    is_stoped: false
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
    data.is_stoped = false
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
                emit("end_event")
            }
        }
    }, props.blink ? 500 : 1000)
}
const stopTickToc = () => {
    // 清除掉定时器
    if (!data.is_stoped) {
        data.is_stoped = true
        var secs = props.count_down ? (props.duration_secs - data.durationSecs) : data.durationSecs
        data.text = '【用时】'
        var t = Math.floor(secs / 3600)
        if (t > 0) {
            data.text += `${t}时`
        }
        secs = secs % (3600)
        t = Math.floor(secs / 60)
        if (t > 0) {
            data.text += `${t}分`
        }
        t = secs % 60
        data.text += `${t}秒`
        clearInterval(data.timer)
        data.blinkFlag = true
    }
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

onBeforeUnmount(() => {
    clearInterval(data.timer)
})
</script>