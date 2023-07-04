<template>
    <el-form ref="ruleFormRef" :model="ruleFormData" status-icon :rules="ruleFormData.rules" label-width="100px">
        <el-form-item label="旧密码" prop="old_pwd">
            <el-input v-model="ruleFormData.old_pwd" type="password" autocomplete="off" :prefix-icon="Lock" show-password />
        </el-form-item>
        <el-form-item label="新密码" prop="new_pwd">
            <el-input v-model="ruleFormData.new_pwd" type="password" autocomplete="off" :prefix-icon="Lock" show-password />
        </el-form-item>
        <el-form-item label="确认密码" prop="cfm_pwd">
            <el-input v-model="ruleFormData.cfm_pwd" type="password" autocomplete="off" :prefix-icon="Lock" show-password />
        </el-form-item>
        <el-form-item>
            <el-button type="primary" @click="submitForm(ruleFormRef)">确认修改</el-button>
            <el-button @click="clearForm">清空输入</el-button>
        </el-form-item>
    </el-form>
</template>
<script setup lang="ts">
import { reactive, ref } from 'vue';
import { ElMessage, FormInstance } from 'element-plus'
import { Api } from '@/request';
import { Lock } from '@element-plus/icons-vue'
import { useRouter } from 'vue-router';

const ruleFormRef = ref<FormInstance>()
const router = useRouter()

const ruleFormData = reactive({
    old_pwd: '',
    new_pwd: '',
    cfm_pwd: '',
    rules: {
        old_pwd: [
            { required: true, message: '请输入旧密码', trigger: 'blur' }, // 触发时机: 当失去焦点时（光标不显示的时候），触发此提示
        ],
        new_pwd: [
            { required: true, message: '请输入新密码', trigger: 'blur' },
            { min: 8, max: 20, message: '长度在 8 到 20 个字符', trigger: 'blur' },
            { validator: () => { return ruleFormData.new_pwd != ruleFormData.old_pwd }, message: '新旧密码不能相同', trigger: 'blur' },
        ],
        cfm_pwd: [
            { required: true, message: '请再次输入新密码', trigger: 'blur' },
            { validator: () => { return ruleFormData.new_pwd == ruleFormData.cfm_pwd }, message: '两次新密码不一致', trigger: 'blur' }
        ],
    }
})
const clearForm = () => {
    ruleFormData.old_pwd = ''
    ruleFormData.new_pwd = ''
    ruleFormData.cfm_pwd = ''
}
const submitForm = async (formEl: FormInstance | undefined) => {
    console.log(formEl)
    if (!formEl) return
    await formEl.validate((valid) => {
        if (!valid) {
            ElMessage.error('输入密码不符合规则')
            return false
        }
        console.log(ruleFormData.old_pwd, ruleFormData.new_pwd)
        Api.changePwd(ruleFormData.old_pwd, ruleFormData.new_pwd).then(res => {
            ElMessage.success('密码修改成功')
            Api.clearUserInfo()
            router.push('/login')
        }).catch(err => {
            ElMessage.error(`${err.response.data.msg}`)
        })
    }).catch(err => { })
}
</script>
