<template>
    <span v-if="data.blinkFlag">{{ data.text }}</span>
</template>

<script lang="ts" setup>
import { onMounted, onUnmounted, reactive } from 'vue'

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
    end_text: string,
    blink: boolean
}>(), { start_text: '【剩余时间】', duration_secs: 60, end_text: '计时结束', blink: false })

const emit = defineEmits(['end_event'])

onMounted(() => {
    data.durationSecs = props.duration_secs
    // 清除掉定时器
    data.timer && clearInterval(data.timer)
    // 开启定时器
    data.timer = setInterval(() => {
        if (props.blink) {
            data.blinkFlag = !data.blinkFlag
        }
        if (!props.blink || data.blinkFlag) {
            let tmp = --data.durationSecs
            const sec_min_hour_str = ['', '', '']
            for (var i = 0; i < 3; i++) {
                var digital = tmp % 60
                tmp = Math.floor(tmp / 60)
                sec_min_hour_str[i] = `00${digital}`.slice(-2)
            }
            data.text = `${props.start_text}${sec_min_hour_str[2]}:${sec_min_hour_str[1]}:${sec_min_hour_str[0]}`
            if (data.durationSecs <= 0) {
                // 清除掉定时器
                clearInterval(data.timer)
                data.text = props.end_text
                data.blinkFlag = true
                emit("end_event")
            }
        }
    }, props.blink ? 500 : 1000)
})

onUnmounted(() => {
    clearInterval(data.timer)
    console.log('计时结束...')
})
</script>