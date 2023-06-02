<template>
    <div class="common-layout">
        <el-container>
            <el-aside width="200px">
                <el-menu @select="onArticleSelected" :default-active="currActive">
                    <el-sub-menu v-for="m in meta" :index="m.category">
                        <template #title>
                            <el-icon><Folder /></el-icon>
                            {{ m.category }}</template>
                        <el-menu-item v-for="a in m.articles" :index="String(a.id)">{{ a.title }}</el-menu-item>
                    </el-sub-menu>
                </el-menu>
            </el-aside>

            <el-main>
                <h1 v-if="currArticle.id > 0" align="center" style="margin:10px;font-size:larger">{{ currArticle.title }}
                </h1>
                <p v-if="currArticle.id > 0" class='article-info'>
                    <el-avatar size="small" :src="currArticle.user_avatar" />
                    <el-text>作者: {{ currArticle.user }}</el-text>
                    <el-divider direction="vertical" />
                    <el-text>创建: {{ currArticle.create_time }}</el-text>
                    <el-divider direction="vertical" />
                    <el-text>更新: {{ currArticle.update_time }}</el-text>
                </p>
                <v-md-preview :text="currArticle.content"></v-md-preview>
                <div v-if="currArticle.attachment && currArticle.attachment.length > 0">
                    <VueOfficeDocx v-if="currArticle.attach_type == 0" :src="currArticle.attachment"/>
                    <VueOfficePdf v-if="currArticle.attach_type == 1" :src="currArticle.attachment"/>
                    <el-link v-if="currArticle.attach_type < 0" :href="currArticle.attachment" type="primary">下载</el-link>
                </div>
            </el-main>
        </el-container>
    </div>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue';
import { Api } from '@/request'
import { Folder } from '@element-plus/icons-vue';
import { IArticles, Article } from '@/types/wiki'
import VueOfficePdf from '@vue-office/pdf';
import VueOfficeDocx from '@vue-office/docx';

let currActive = ref('-1')
let currArticle = reactive(new Article())
const meta: IArticles[] = reactive([])

onMounted(() => {
    meta.splice(0, meta.length)
    Api.getArticles().then(res => {
        res.data.results.forEach((e: any) => {
            var cid = meta.findIndex(a => { return a.category == e.category })
            if (cid < 0) {
                meta.push({ category: e.category, articles: [] })
                cid = meta.length - 1
            }
            meta[cid].articles.push(e)
        });
        if (res.data.results.length > 0) {
            currActive.value = String(res.data.results[0].id)
            onArticleSelected(currActive.value, '')
        }
    })
})

const onArticleSelected = (key: string, path: string) => {
    var m = meta.forEach(c => {
        var t = c.articles.find(a => { return String(a.id) == key })
        if (t) {
            currArticle.copyFrom(t)
            currActive.value = String(t.id)
            console.log('crur', currArticle)

            return key
        }
    })
    return key
}
</script>

<style lang="scss" scoped>
.el-aside {
    height: calc(100vh - 58px);
}

.el-menu-item {
    height: 32px;
    background-color: #f8f8f8;
}

.el-sub-menu__title {
    height: 32px !important;
}

.el-menu {
    background-color: #f8f8f8;
}

.el-aside {
    background-color: #f8f8f8;
}

.el-main {
    padding: 0;
    background-color: white;
    height: calc(100vh - 58px);
}

.article-info {
    margin: 0px;
    font-size: small;
    display: flex;
    justify-content: center;
}
</style>