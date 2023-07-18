<template>
    <div style="margin: 20px; display: flex; justify-content: center; align-items: center;">
        <el-tag effect="dark" round type="success">等级</el-tag>
        <el-radio-group v-model="gameInfo.level" size="small">
            <el-radio-button :label="0">2阶</el-radio-button>
            <el-radio-button :label="1">3阶</el-radio-button>
            <el-radio-button :label="2">4阶</el-radio-button>
        </el-radio-group>
        <el-divider direction="vertical"></el-divider>
        <el-tag effect="dark" round type="success">难度</el-tag>
        <el-radio-group v-model="gameInfo.difficulty" size="small">
            <el-radio-button label="0">简单</el-radio-button>
            <el-radio-button label="1">正常</el-radio-button>
            <el-radio-button label="2">困难</el-radio-button>
        </el-radio-group>
        <el-divider direction="vertical"></el-divider>
        <el-button>开始游戏</el-button>
    </div>
    <el-row v-for="(vs, i) in values" :gutter="0" style="padding: 2px; margin: 0; justify-content: center;">
        <el-divider v-if="i > 0 && i % gameInfo.N == 0" class="hori-divider" border-style="dotted" />
        <div v-for="(v, j) in vs" style="padding: 2px; margin: 0;">
            <el-divider v-if="j > 0 && j % gameInfo.N == 0" direction="vertical" class="vert-divider"
                border-style="dotted" />
            <el-button :type="puzzle[i][j] == 0 ? '' : (v == active.number ? 'primary' : 'info')"
                :style="'color: ' + (puzzle[i][j] > 0 ? '' : 'blue')" circle class="button" size="large"
                :plain="v != active.number" @click="onNumberBtnClicked(i, j, v)">{{ v > 0 ? v : '' }}</el-button>
        </div>
    </el-row>
    <div style="margin-top: 20px; display: flex; justify-content: center;">
        <el-button v-for="i in (gameInfo.N * gameInfo.N)" type="primary" style="margin: 2px;"
            :plain="!isNumberAvailable(i)" :disabled="!isNumberAvailable(i)" circle size="large"
            @click="() => { values[active.row][active.col] = i; active.number = i }">{{ i
            }}</el-button>
        <el-button style="margin: 2px;" type="danger" :icon="Delete" circle size="large"
            :disabled="active.row < 0 || puzzle[active.row][active.col] > 0"
            @click="() => { values[active.row][active.col] = 0; active.number = 0; }" />
    </div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue';
import { Delete } from '@element-plus/icons-vue';
import { Api } from '@/request';

const puzzle: any = ref([[6, 4, 5, 0, 0, 0, 0, 0, 8], [8, 0, 0, 9, 0, 0, 1, 2, 0], [2, 0, 0, 0, 0, 8, 0, 6, 0], [4, 0, 0, 7, 0, 2, 6, 0, 9], [5, 9, 6, 0, 1, 4, 0, 7, 0], [0, 0, 2, 0, 0, 5, 3, 4, 0], [0, 2, 0, 4, 0, 9, 5, 0, 0], [0, 5, 4, 1, 2, 7, 0, 8, 0], [0, 6, 7, 0, 5, 3, 0, 1, 0]])
const values = ref([[6, 4, 5, 0, 0, 0, 0, 0, 8], [8, 0, 0, 9, 0, 0, 1, 2, 0], [2, 0, 0, 0, 0, 8, 0, 6, 0], [4, 0, 0, 7, 0, 2, 6, 0, 9], [5, 9, 6, 0, 1, 4, 0, 7, 0], [0, 0, 2, 0, 0, 5, 3, 4, 0], [0, 2, 0, 4, 0, 9, 5, 0, 0], [0, 5, 4, 1, 2, 7, 0, 8, 0], [0, 6, 7, 0, 5, 3, 0, 1, 0]])
const active = reactive({ number: -1, row: -1, col: -1 })
const gameInfo = reactive({ id: 0, level: 1, N: 3, difficulty: 1 })

const isNumberAvailable = (v: number) => {
    const i = active.row
    const j = active.col
    if (i < 0 || j < 0 || puzzle.value[i][j] > 0) {
        return false
    }
    const K = gameInfo.N
    for (var m = 0; m < K * K; m++) {
        if (v == values.value[i][m]) {
            return false
        }
    }
    for (var m = 0; m < K * K; m++) {
        if (v == values.value[m][j]) {
            return false
        }
    }
    for (var m = 0; m < K; m++) {
        for (var n = 0; n < K; n++) {
            if (v == values.value[Math.floor(i / K) * K + m][Math.floor(j / K) * K + n]) {
                return false
            }
        }
    }
    return true
}
const onNumberBtnClicked = (i: number, j: number, v: number) => {
    active.number = v
    active.row = i
    active.col = j
}
const getBestRecord = () => {
    // Api.getGameRecord()
}
</script>

<style lang='scss' scoped>
.button {
    // width: 40px;
    // height: 40px;
    // color: blue;
    font-size: 20px;
}

.hori-divider {
    margin: 0px;
    width: 100%;
    border-width: 2px;
    border-color: darkblue;
}

.vert-divider {
    margin: 0px;
    height: 100%;
    border-width: 2px;
    border-color: darkblue;
}
</style>