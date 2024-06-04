<script setup>

import { changeTheme } from "@/assets/changeTheme";
import LinkButtonWithIcon from "@/components/LinkButtonWithIcon.vue";
import UserInfoCard from "@/components/UserInfoCard.vue";
import globalData from "@/global/global";
import router from "@/router";
import axios from "axios";
import { ElMenuItem } from "element-plus";
import { onMounted, reactive, ref } from "vue";

changeTheme("#00bfa8")
function loginButtonClicked() {
    router.push("/login")
}

const exitButtonClicked = async () => {
    await axios.get("/api/Login/Logout")
    window.location.href = "/";
}

const avatarClicked = () => {
    if (isLogin.value) {
        router.push("/user")
    }
    else {
        router.push("/login")
    }
}

let userInfo = reactive({
    data: {
        user_phone: "",
        user_name: "未登录",
        user_id: 123456,
        user_group: "none",
        avatar_url: "/static/defaultAvatar.png",
        title: "",
        department: "",
        hospital_name: "",
    }

});

let menuImgSrc = "/static/menu_main.png"; // 默认图片路径
const isLogin = ref(false);
const gotUserInfo = ref(false);
const patientList = ref([]);
const applicationList = ref([]);
const menu = ref();
const helpVisible = ref(false);

const fetchDoctorInfo = () => {
    axios.get("/api/interaction/DoctorInfo")
        .then(response => {
            let responseObj = response.data;
            console.log("responseObj:", responseObj);
            console.log("login:", responseObj.response.login);
            isLogin.value = responseObj.response.login;
            gotUserInfo.value = true;
            if (!responseObj.response.login) return;
            globalData.login = true;
            globalData.locked = responseObj.locked;
            globalData.userInfo = userInfo.data;
            userInfo.data = responseObj.response;
        })
        .catch(error => {
            if (error.network) return;
            error.defaultHandler();
        });
};


const fetchPatientList = () => {
    axios.get('/api/interaction/getPatientList')
        .then(response => {
            patientList.value = response.data.response.patientList;
        })
        .catch(error => {
            console.error('Error fetching patient list', error);
        });
};

const fetchApplicationList = () => {
    axios.get('/api/interaction/getApplicationList')
        .then(response => {
            applicationList.value = response.data.response.msglist;
        })
        .catch(error => {
            console.error('Error fetching application list', error);
        });
};

const handleAccept = (row) => {
    axios.post('/api/interaction/confirmPatient', { messageId: row.messageId })
        .then(response => {
            console.log('同意操作成功');
        })
        .catch(error => {
            console.error('同意操作出错', error);
        });
};

onMounted(() => {
    fetchDoctorInfo();
    fetchPatientList();
    fetchApplicationList();
})


</script>

<template>
    <div class="pageWrapper">
        <div class="headerHolder">
            <div class="leftTitle">
                <img alt="" src="/static/logo.png">
                <!--                <SearchBox @searchStart="searchStart"></SearchBox>-->
            </div>
            <div class="rightTitle" v-if="!isLogin">
                <img alt="" src="/static/titleImg1.png">
                <LinkButtonWithIcon font-color="#fff" text="登录/注册" icon="" @click="loginButtonClicked">
                </LinkButtonWithIcon>
            </div>
            <div class="rightTitle" v-if="isLogin">
                <img alt="" src="/static/titleImg1.png">
                <LinkButtonWithIcon font-color="#fff" text="查看好友申请列表" icon="" @click="helpVisible = true">
                </LinkButtonWithIcon>
                <LinkButtonWithIcon font-color="#fff" text="退出" icon="" @click="exitButtonClicked">
                </LinkButtonWithIcon>
            </div>

            <el-dialog v-model="helpVisible" title="好友申请列表" width="50%" draggable>
                <el-table :data="applicationList" style="width: 100%">
                    <el-table-column prop="patientName" label="患者姓名" width="300" />
                    <el-table-column prop="patientAvatar" label="患者头像" width="150">
                        <template #default="{ row }">
                            <img :src="row.patientAvatar" alt="Patient Avatar"
                                style="width: 30px; height: 30px; border-radius: 50%;">
                        </template>
                    </el-table-column>
                    <el-table-column fixed="right" label="操作" width="200">
                        <template #default="{ row }">
                            <el-button link type="primary" size="small" @click="handleAccept(row)">同意</el-button>
                            <!-- <el-button link type="danger" size="small" @click="handleReject(row)">拒绝</el-button> -->
                        </template>
                    </el-table-column>
                </el-table>

                <template #footer>
                    <span class="dialog-footer">
                        <el-button @click="helpVisible = false">确认
                            <meta name="description" content="">
                        </el-button>
                    </span>
                </template>
            </el-dialog>
        </div>

        <div class="contentHolder">
            <div class="sideBar">
                <div class="userInfoWrapper">
                    <UserInfoCard :user-info="userInfo.data" showAvatarBorder @click="avatarClicked"></UserInfoCard>
                </div>

                <el-menu v-if="isLogin" class="sideBarMenu" ref="menu">
                    <component v-for="patient in patientList" :is="ElMenuItem" :index="patient.patientId">
                        <template #title>
                            <img :src="patient.patientAvatar" alt="Patient Avatar">
                            <span>{{ patient.patientName }}</span>
                        </template>
                    </component>
                </el-menu>

                <img class="menuImg" alt="" :src="menuImgSrc" />
            </div>

            <div class="content">
                <RouterView v-if="gotUserInfo"></RouterView>
            </div>

            <div class="area">
                <ul class="circles">
                    <li></li>
                    <li></li>
                    <li></li>
                    <li></li>
                    <li></li>
                    <li></li>
                    <li></li>
                    <li></li>
                    <li></li>
                    <li></li>
                </ul>
            </div>
        </div>
    </div>
</template>


<style scoped>
.headerHolder {
    width: 100%;
    height: 60px;
    box-sizing: border-box;
    background-color: var(--el-color-primary);
    display: flex;
    justify-content: space-between;
    max-height: 60px;
    flex: 1;
}

.headerHolder>div {
    display: flex;
    align-items: center;
    margin: 0 20px;
}

.pageWrapper {
    height: 100vh;
    width: 100%;
    min-width: 1200px;
    max-height: 100vh;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
}

.leftTitle img {
    max-height: 50px;
    margin-right: 20px;
}

.rightTitle img {
    height: 60px;
}

.rightTitle>* {
    margin: 0 10px;
}

.line {
    border-left: #fff 1px solid;
    height: 1em;
    width: 1px;
    margin: 0 5px;
}

.contentHolder {
    display: flex;
    justify-items: stretch;
    flex: 3;
    overflow: hidden;

}


.content {
    overflow-y: auto;
    flex: 1;
}

.bg-pan-bottom {
    animation: bg-pan-bottom 2s infinite alternate both;
    background: linear-gradient(to bottom, var(--el-color-primary-light-9), #ddf4ff);
    /* 设置渐变色 */
}

@keyframes bg-pan-bottom {
    0% {
        background-position: 50% 0%;
    }

    100% {
        background-position: 50% 100%;
    }
}

.sideBar {
    width: 230px;
    min-width: 230px;
    max-width: 230px;
    background-color: #fff;
    flex: 3;
    position: relative;
}

.sideBar .sideBarMenu {
    border-right: none;
}

.sideBar .sideBarMenu i {
    margin-right: 10px;
    font-size: 1.1em;
}

.userInfoWrapper {
    padding: 10px 20px;
    border-bottom: 1px #eee solid;
}

.menuImg {
    position: absolute;
    width: 80%;
    bottom: 30px;
    margin-left: 10%;
}

.beian {
    width: 100%;
    text-align: center;
    position: absolute;
    bottom: 10px;
}

.beian .el-link {
    color: #ccc;
    font-size: 10px;
}

/* background setting */
.area {
    background: linear-gradient(to bottom, var(--el-color-primary-light-9), #ddf4ff);
    /*background: var(--el-color-primary-light-9);
    background: -webkit-linear-gradient(to left, #8f94fb, #4e54c8);  */
    width: 100%;
    height: 100vh;
    position: absolute;
    z-index: -1;
    /* 确保背景位于最底层 */
}

.circles {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    overflow: hidden;
}

.circles li {
    position: absolute;
    display: block;
    list-style: none;
    width: 20px;
    height: 20px;
    background: rgba(12, 133, 119, 0.5);
    animation: animate 25s linear infinite;
    bottom: -150px;

}

.circles li:nth-child(1) {
    left: 25%;
    width: 80px;
    height: 80px;
    animation-delay: 0s;
}


.circles li:nth-child(2) {
    left: 10%;
    width: 20px;
    height: 20px;
    animation-delay: 2s;
    animation-duration: 12s;
}

.circles li:nth-child(3) {
    left: 70%;
    width: 20px;
    height: 20px;
    animation-delay: 4s;
}

.circles li:nth-child(4) {
    left: 40%;
    width: 60px;
    height: 60px;
    animation-delay: 0s;
    animation-duration: 18s;
}

.circles li:nth-child(5) {
    left: 65%;
    width: 20px;
    height: 20px;
    animation-delay: 0s;
}

.circles li:nth-child(6) {
    left: 75%;
    width: 110px;
    height: 110px;
    animation-delay: 3s;
}

.circles li:nth-child(7) {
    left: 35%;
    width: 150px;
    height: 150px;
    animation-delay: 7s;
}

.circles li:nth-child(8) {
    left: 50%;
    width: 25px;
    height: 25px;
    animation-delay: 15s;
    animation-duration: 45s;
}

.circles li:nth-child(9) {
    left: 20%;
    width: 15px;
    height: 15px;
    animation-delay: 2s;
    animation-duration: 35s;
}

.circles li:nth-child(10) {
    left: 85%;
    width: 150px;
    height: 150px;
    animation-delay: 0s;
    animation-duration: 11s;
}



@keyframes animate {

    0% {
        transform: translateY(0) rotate(0deg);
        opacity: 1;
        border-radius: 0;
    }

    100% {
        transform: translateY(-1000px) rotate(720deg);
        opacity: 0;
        border-radius: 50%;
    }

}

.document_p {
    line-height: 1.5;
}

.document_h2 {
    margin-top: 20px;
    color: #006264;
}
</style>
