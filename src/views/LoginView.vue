<template>
    <el-form :label-position="'top'" label-width="60px" :model="valiFormData" class="loginForm">
        <div class="titleWrapper">
            <div class="loginTitle">医生登录</div>
            <div class="loginSubTitle">登录以继续</div>
        </div>

        <el-form-item label="手机号" v-bind:class="{ error: isError }">
            <el-input v-model="valiFormData.id" @click="clearErrorBorder" type="number" step="1" min="0" />
        </el-form-item>
        <el-form-item label="密码" v-bind:class="{ error: isError }">
            <el-input v-model="valiFormData.password" type="password" @click="clearErrorBorder" show-password />
        </el-form-item>
        <div class="errorText">{{ errorMsg }}</div>
        <div class="textButtonHolder">
            <router-link to="/login/forgot">
                <el-button type="primary" link>忘记密码?</el-button>
            </router-link>
        </div>
        <div class="loginButtonHolder">
            <el-button type="primary" @click="login">登录</el-button>
        </div>
    </el-form>
</template>

<script setup>
import { changeTheme } from "@/assets/changeTheme";
import router from "@/router";
import { useUserStore } from '@/store/user';
import { reactive, ref } from 'vue';

changeTheme("#02AFCC");

const errorMsg = ref('');
const isError = ref(false);

const userStore = useUserStore();
const valiFormData = reactive({
    contact: '',       // 账号
    password: ''  // 密码
});

// 登录方法
const login = async () => {
    console.log(valiFormData.id);
    console.log(valiFormData.password);
    console.log(valiFormData);
    if (valiFormData.id == '') {
        errorMsg.value = "手机号不能为空";
        isError.value = true;
    }
    else if (valiFormData.password == '') {
        errorMsg.value = "密码不能为空";
        isError.value = true;
    }
    else {
        try {
            // 调用验证 API
            await userStore.getUserInfo({
                id: valiFormData.id, // 使用id字段
                password: valiFormData.password
            });
            // 处理响应
            if (userStore.userInfo.success) { // success字段表示成功
                setTimeout(() => {
                    router.push("/")
                }, 1000);
                // 可以在这里进行页面跳转或其他逻辑
            } else {
                console.error('账号密码错误');
                errorMsg.value = "账号密码错误";
                isError.value = true;
            }
        } catch (err) {
            console.error('登录失败:', err);
            errorMsg.value = "登录失败";
            isError.value = true;
        }
    }
};

const clearErrorBorder = () => {
    isError.value = false;
}
</script>

<style scoped>
.demo-form-inline .el-input {
    --el-input-width: 220px;
}


.titleWrapper {
    text-align: center;
    margin-bottom: 30px;
    position: relative;
}

.loginTitle {
    font-size: 30px;
    color: var(--el-color-primary);
    font-weight: bold;
    margin-bottom: 5px;
}

.loginSubTitle {
    color: var(--el-color-primary);
}

.loginForm {
    width: 40%;
    height: 80%;
}

.textButtonHolder {
    text-align: right;
    margin-bottom: 20px;
}

.loginButtonHolder {
    width: 100%;
    text-align: center;
}

.loginButtonHolder>button {
    height: 40px;
    width: 60%;
}

.errorText {
    font-size: 10px;
    height: 0;
    width: 100%;
    color: var(--el-color-error);
    transform: translateY(-15px);
}

.error .el-input {
    --el-input-border-color: var(--el-color-error)
}
</style>