<template>
    <div class="login">
        <div class="form-cls">
            <el-form ref="ruleFormRef" :model="loginData.user" status-icon :rules="loginData.rules">
                <div class="title"><el-icon :size="32" color='darkcyan'>
                        <ChromeFilled />
                    </el-icon>学海</div>
                <el-text style="display: flex; justify-content : center;" type="success">书山有路勤为径，学海无涯苦作舟</el-text>
                <el-form-item prop="username">
                    <el-input v-model="loginData.user.username" type="text" autocomplete="off" :prefix-icon="User"
                        placeholder="用户名/邮箱/手机号码" />
                </el-form-item>
                <el-form-item prop="password">
                    <el-input v-model="loginData.user.password" type="password" autocomplete="off" :prefix-icon="Lock"
                        placeholder="密码" show-password />
                </el-form-item>
                <el-form-item>
                    <el-button class="login-btn" type="primary" @click="submitForm(ruleFormRef)"
                        @keydown.enter="keyDown">登录</el-button>
                    <!-- <el-button class="login-btn" @click="resetForm(ruleFormRef)">重置</el-button> -->
                    <el-button class="login-btn" @click="resetForm">清空</el-button>
                </el-form-item>
                <el-form-item style="display: flex; align-content: space-between;">
                    <el-link class="login-btn" type="primary" href="http://localhost:8000/admin">管理员后台</el-link>
                    <el-link class="login-btn" type="primary">忘记密码</el-link>
                </el-form-item>
                <el-text size="small" style="display: flex; flex-direction: row-reverse;">{{ info.version }}</el-text>
            </el-form>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { ElMessage, FormInstance } from "element-plus";
import { onMounted, onUnmounted, reactive, ref } from "vue";
import { useRouter } from "vue-router";
import { User, Lock } from '@element-plus/icons-vue'
import { Api } from '@/request/index'
import { Info } from "@/info";

const router = useRouter()
const info = new Info()

const loginData = reactive({
    user: { username: '', password: '' },
    rules: {
        username: [
            { required: true, message: '请输入用户名', trigger: 'blur' }, // 触发时机: 当失去焦点时（光标不显示的时候），触发此提示
            { min: 3, max: 20, message: '长度在 3 到 20 个字符', trigger: 'blur' }
        ],
        password: [
            { required: true, message: '请输入密码', trigger: 'blur' },
            { min: 6, max: 20, message: '长度在 6 到 10 个字符', trigger: 'blur' }
        ],
    }
})
// 登录
const ruleFormRef = ref<FormInstance>()
const submitForm = (formEl: FormInstance | undefined) => {
    // 对表单内容进行验证
    if (!formEl) return
    formEl.validate((valid) => {
        if (!valid) {
            ElMessage.error('用户名或密码不符合规则')
            return false
        }
        Api.login(loginData.user).then(res => {
            Api.storeUserInfo(res.data)
            // 跳转页面
            router.push('/')
        }).catch(err => {
        })

    })
}
// 重置
const resetForm = () => {
    loginData.user.username = ""
    loginData.user.password = ""
}
const keyDown = (e: any) => {
    if (e.keyCode == 13 || e.keyCode == 100) {
        submitForm(ruleFormRef.value)
    }
}
onMounted(() => window.addEventListener('keydown', keyDown))
onUnmounted(() => window.removeEventListener('keydown', keyDown, false))
</script>


<style lang="scss" scoped>
.login {
    // width: 100%;
    height: 100%;
    background-image: url("@/assets/background.jpg");
    background-size: 100% auto;

    .form-cls {
        background-color: #152959;
        width: 240px;
        height: 306px;
        border-radius: 15px;
        padding: 0 30px;
        position: relative;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);

        .el-form-item {
            margin-bottom: 2px;
            margin-top: 16px;
        }

        .title {
            font-size: 24px;
            font-weight: bold;
            display: flex;
            align-items: center;
            justify-content: center;
            line-height: 72px;
            color: chartreuse;
        }
    }
}

.login-btn {
    width: 47%;
}
</style>