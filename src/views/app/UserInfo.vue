<template>
    <el-form v-if="dataLoaded" :model="user" label-position="right" label-width="80px">
        <el-form-item>
            <el-upload class="avatar-uploader" :show-file-list="false" :auto-upload="false" accept=".png,.jepg,.jpg"
                :on-change="onUploadAvatar" tip="dddd">
                <el-image v-if="user.avatar && user.avatar != ''" :src="user.avatar" class="avatar" />
                <div class="upload_avatar_box" v-else>
                    <el-text class="align-center" type="primary" size="large">上传头像</el-text>
                </div>
            </el-upload>
            <el-alert type="info" size="small" show-icon style="width: 300px;">点击头像修改; 支持jpg/jpeg/png; ≤2M;</el-alert>
        </el-form-item>
        <!-- <FormItem label="用户名" type="text" v-modelv-model="user.username"/> -->
        <FormItem label="用户名" type="text" :disabled="true" v-model="user.username" />
        <el-form-item label="姓名">
            <el-row :gutter="10">
                <el-col :xs="12" :sm="8" :md="6" :lg="5" :xl="4">
                    <el-input v-model="user.last_name" :disabled="!editEnabled" placeholder="姓" />
                </el-col>
                <el-col :xs="12" :sm="8" :md="6" :lg="5" :xl="4">
                    <el-input v-model="user.first_name" :disabled="!editEnabled" placeholder="名" />
                </el-col>
            </el-row>
        </el-form-item>
        <el-form-item label="性别">
            <el-radio-group v-model="gender" :disabled="!editEnabled">
                <el-radio :label="1">男</el-radio>
                <el-radio :label="2">女</el-radio>
            </el-radio-group>
        </el-form-item>
        <FormItem label="生日" type="date" :disabled="!editEnabled" v-model="user.birthday" />
        <FormItem label="邮箱" type="email" :disabled="!editEnabled" v-model="user.email" />
        <FormItem label="手机" type="tel" :disabled="!editEnabled" v-model="user.mobile" />
        <FormItem label="学校" type="text" :disabled="!editEnabled" v-model="user.school" />
        <FormItem label="住址" type="text" :disabled="!editEnabled" v-model="user.address" />
        <FormItem label="身份证号" type="text" :disabled="!editEnabled" v-model="user.card_id" />
        <FormItem label="注册时间" type="text" :disabled="true" v-model="user.date_joined" />
        <FormItem label="失效时间" type="text" :disabled="true" v-model="user.failure_time" />
        <el-form-item>
            <el-row :gutter="10">
                <el-col :xs="12" :sm="8" :md="6" :lg="5" :xl="4">
                    <el-switch v-model="editEnabled" inline-prompt active-text="已解锁" inactive-text="已锁定" />
                </el-col>
                <el-col :xs="12" :sm="8" :md="6" :lg="5" :xl="4">
                    <el-button v-if="editEnabled" type="primary" @click="onSubmit">修改资料(不含头像)</el-button>
                </el-col>
            </el-row>
        </el-form-item>
    </el-form>
</template>

<script lang="ts" setup>
import { onMounted, reactive, ref } from 'vue'
import { UserInfo } from '@/types/http'
import FormItem from '@/components/FormItem.vue'
import { ElLoading, ElMessage } from 'element-plus';
import { Api } from '@/request';
import { HttpStatusCode } from 'axios';

const editEnabled = ref(false)
const dataLoaded = ref(false)
let user = reactive(new UserInfo())

const gender = ref(1)

onMounted(() => {
    Api.getUserInfo().then((res) => {
        user = res.data
        gender.value = user.gender
        dataLoaded.value = true
        ElMessage.success('页面加载成功')
    }).catch((err) => ElMessage.error(`页面加载失败(${err.code})`))
})

const onUploadAvatar = (file: any, fileList: any) => {
    let rawFile = file.raw;
    if (["image/jpg", "image/jpeg", "image/png"].indexOf(rawFile.type) < 0) {
        ElMessage.error("仅支持格式为jpg, jpeg, png的图片");
        return false;
    }
    if (rawFile.size / 1024 / 1024 > 2) {
        ElMessage.error("图片文件大小不能超过2MB!");
        return false;
    }
    let formData = new FormData();
    formData.append("id", "2")
    formData.append("avatar", rawFile);
    const loading = ElLoading.service({
        lock: true,
        text: 'Uploading...',
        background: 'rgba(0, 0, 0, 0.7)',
    })
    //请求接口上传图片到服务器
    Api.uploadUserAvatar(formData).then(async (res: any) => {
        if (res.status == HttpStatusCode.Ok) {
            user.avatar = res.data['avatar'];
            ElMessage.success(`头像上传成功`);
        } else {
            ElMessage.error(`头像上传失败(${res.status})`);
        }
    }).catch((err) => {
        ElMessage.error(`头像上传失败(${err.code})`);
    });
    loading.close();
    return true;
};

const onSubmit = () => {
    var d = {
        last_name: user.last_name,
        first_name: user.first_name,
        birthday: user.birthday,
        gender: gender.value,
        email: user.email,
        mobile: user.mobile,
        school: user.school,
        address: user.address,
        card_id: user.card_id
    }
    Api.updateUserInfo(d)
        .then(res => ElMessage.success('信息修改成功'))
        .catch(err => ElMessage.error("信息修改失败"))
}
</script>

<style lang="scss" scoped>
.el-row {
    width: 100%;
}

:deep().avatar-uploader {
    .avatar {
        width: 200px;
        height: 200px;
        border-radius: 50%;
    }

    .el-upload {
        border: 1px dashed #dcdfe6;
        border-radius: 50%;
        cursor: pointer;
        position: relative;
        overflow: hidden;
        transition: 0.2s;
        background: rgba(0, 0, 0, 0.04) !important;
    }

    .el-upload:hover {
        border-color: #14b194;
    }
}

.upload_avatar_box {
    width: 200px;
    height: 200px;
    display: flex;
    align-items: center;
    justify-content: center;
}
</style>