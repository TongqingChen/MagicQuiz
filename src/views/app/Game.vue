<template>
    <el-container>
        <el-aside width="200px">
            <el-menu @select="selectGame" :default-active="currGame">
                <el-menu-item v-for="g in games" :index="g.url"><el-icon>
                        <Document />
                    </el-icon>{{ g.name }}</el-menu-item>
            </el-menu>
        </el-aside>
        <el-main>
            <iframe :src="currGame" class="frame" scrolling="no" sandbox="allow-forms allow-scripts allow-same-origin allow-top-navigation"></iframe>
        </el-main>
    </el-container>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue';
import { onMounted } from 'vue';
const games = reactive([
    { url: 'https://saolei.games/saolei.html', name: '扫雷' },
    { url: 'https://sudoku-cn.com/', name: '数独' },
    { url: 'https://2048game.com/', name: '2048' },
    { url: 'https://saolei.games/h.html', name: '汉诺塔' },
])
const currGame = ref(games[0].url)
const selectGame = (key: string, keypath: string) => {
    currGame.value = key
}
onMounted(()=>{

})
</script>

<style scoped lang="scss">
.el-container {
    width: 100%;
    max-width: 100%;
    height: 100%;
}

.el-main {
    padding: 0;
    height: 100%;
    .frame{
        width:100%;
        height: calc(100% - 10px);
        border: none;
    }
}
</style>