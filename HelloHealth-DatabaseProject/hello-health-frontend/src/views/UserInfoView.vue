<template>
    <!--整个页面是可以上下滚动的-->
    <div class="wrapper">
        <!--展示信息的分栏，分栏1：基本信息-->
        <div>
            <el-card class="cardStyle">
                <el-descriptions class="margin-top" title="基本信息" :column="1" :size="size" border>
                    <!-- 点“编辑”按钮可以对用户信息进行编辑
                    <el-button type="primary" v-if="!isEdit" @click="edit">编辑</el-button>
                    <el-button type="primary" v-if="isEdit" @click="save">保存</el-button> -->
                    <template>
                        <el-descriptions-item>
                            <template #label>
                                <div class="cell-item">
                                    用户ID:
                                </div>
                            </template>
                            <!--从数据库获取用户ID，用户ID不可修改-->
                            <div class="input-container">
                                <span>{{ userInfo.user_id }}</span>
                                <div class="highlight"></div>
                            </div>
                        </el-descriptions-item>

                        <el-descriptions-item>
                            <template #label>
                                <div class="cell-item">
                                    用户名：
                                </div>
                            </template>
                            <!--从数据库获取用户名，用户名不可修改-->
                            <div class="input-container">
                                <img :src="userInfo.avatar_url" alt="Patient Avatar"
                                     style="width: 30px; height: 30px; border-radius: 50%;">
                                <span>{{ userInfo.user_name }}</span>
                                <div class="highlight"></div>
                            </div>
                        </el-descriptions-item>

                        <el-descriptions-item>
                            <template #label>
                                <div class="cell-item">
                                    用户类型:
                                </div>
                            </template>
                            <!--从数据库获取用户类型，用户类型不可修改-->
                            <div class="input-container">
                                <span>{{ userInfo.user_group }}</span>
                                <div class="highlight"></div>
                            </div>
                        </el-descriptions-item>

                        <el-descriptions-item>
                            <template #label>
                                <div class="cell-item">
                                    联系电话：
                                </div>
                            </template>
                            <!--从数据库获取联系电话，联系电话不可修改-->
                            <div class="input-container">
                                <span>{{ userInfo.user_phone }}</span>
                                <div class="highlight"></div>
                            </div>
                        </el-descriptions-item>

                        <el-descriptions-item>
                            <template #label>
                                <div class="cell-item">
                                    所属医院：
                                </div>
                            </template>
                            <div class="input-container">
                                <span> {{ userInfo.hospital_name }}</span>
                                <div class="highlight"></div>
                            </div>
                        </el-descriptions-item>

                        <el-descriptions-item>
                            <template #label>
                                <div class="cell-item">
                                    所属部门：
                                </div>
                            </template>
                            <div class="input-container">
                                <span> {{ userInfo.department }}</span>
                                <div class="highlight"></div>
                            </div>
                        </el-descriptions-item>

                        <el-descriptions-item>
                            <template #label>
                                <div class="cell-item">
                                    头衔：
                                </div>
                            </template>
                            <div class="input-container">
                                <span> {{ userInfo.title }}</span>
                                <div class="highlight"></div>
                            </div>
                        </el-descriptions-item>

                    </template>
                </el-descriptions>
            </el-card>
        </div>
    </div>
</template>

<script>
import NewsBlockList from "@/components/NewsBlockList.vue";
import UserInfoCard from "@/components/UserInfoCard.vue";
import PostCard from "@/components/postBoardView/PostCard.vue";
import GoToPostLink from "@/components/postView/GoToPostLink.vue";
import globalData from "@/global/global";

export default {
    name: "UserInfoPage",
    components: { UserInfoCard, NewsBlockList, PostCard, GoToPostLink },
    data() {
        return {
            userInfo: globalData.userInfo,
            size: 'large',
        }
    },

    watch: {
        $route: {
            handler: function (route) {
                console.log("watch")
                let userIdNum = parseInt(this.$route.params.userId ? this.$route.params.userId : 0);

                if (!userIdNum && !globalData.login) {

                    this.$router.push("/login");
                    return;
                }
            },
            immediate: true
        }
    },
    methods: {

    },
}

</script>

<style scoped>
/*边框样式设置*/
.cardStyle {
    border-color: white;
    border-width: 2px;
    margin-bottom: 10px;
    margin-top: 10px;
}

/*头像部分的容器设置*/
.avatar-container {
    position: relative;
    display: inline-block;
}

/*头像编辑按钮的样式设置*/
.pic-edit-button {
    position: absolute;
    bottom: 20px;
    right: 0;
    transform: translate(-50%, 50%);
    border-radius: 50%;
    width: 25px;
    height: 25px;
    background-color: transparent;
    border-color: transparent;
    color: white;
}

/*鼠标悬浮在编辑按钮时的样式*/
.pic-edit-button:hover {
    background-color: #8f9fac;
    border-color: #8faca1;
    color: #ffffff;
}

/*最上方的大的用户名字样*/
.userName {
    font-size: 30px;
    /*font-family: 宋体;*/
    font-weight: bold;
    color: black;
    margin-top: 10px
}

/*杏仁币“更多详情”样式*/
.coinButton {
    margin-left: 2%;
    font-size: 16px;
    color: #409EFF;
}

.coin-left {
    width: auto;
}

.coin-right {
    margin-left: 2%;
}

/*”请登录“按钮样式*/
.login-button {
    background-color: white;
    color: red;
    border-color: white;
    font-size: 30px;
}

/*”去认证“按钮样式*/
.certificated-button {
    background-color: white;
    border-color: rgb(238, 137, 4);
    color: #c45656;
    margin-left: 10px;
}

/*弹出的医师认证框的按钮设置*/
.dialog-footer {
    text-align: right;
}

.dialog-footer button:first-child {
    margin-right: 20px;
}

.wrapper {
    position: relative;
    width: 85%;
    margin: 0 auto;
}

.input-container {
    position: relative;
}

.input {
    font-size: 1em;
    width: 88%;
    padding: 0.6em 1em;
    border: none;
    border-radius: 6px;
    background-color: #f8f8f8;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    transition: background-color 0.3s ease, box-shadow 0.3s ease;
    max-width: 600px;
    color: #333;
}

.input:hover {
    background-color: #f2f2f2;
}

.input:focus {
    outline: none;
    background-color: #fff;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.input::placeholder {
    color: #999;
}

.highlight {
    position: absolute;
    bottom: 0;
    left: 0;
    width: 0;
    height: 2px;
    background-color: #6cb16a;
    transition: width 0.3s ease;
}

.input:focus+.highlight {
    width: 75%;
}

.user-info {
    display: flex;
    align-items: center;
}

/*“我的关注”按钮的样式*/
.attention-list {
    margin-left: 80px;
    border-color: white;
    color: #00bfa8;
}

.user-cards {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
}

.user-card {
    margin: 10px;
}

.user-info {
    display: flex;
    justify-content: space-between;
}

/*用户状态封禁样式*/
.state-locked {
    color: red;
    margin-left: 15px;
    font-weight: bold;
    margin-top: 10px;
    font-size: medium;
}

/*用户状态正常样式*/
.state-normal {
    color: #00bfa8;
    margin-left: 30px;
    font-weight: revert;
    margin-top: 10px;
    font-size: small;
}

.tips {
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
    /* 在主轴上居中对齐 */
    text-align: center;
    /* 也可以在文本上进行居中对齐 */
    margin-top: 10px;
}

.sadTip {
    background-image: linear-gradient(96.14deg,
    #8DBEF8 0%,
    #377EB6 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;

    text-align: left;
    font: 600 18px "Poppins", sans-serif;

    margin-top: 5px;
}

.jello-horizontal {
    animation: jello-horizontal 0.9s both;
}

@keyframes jello-horizontal {
    0% {
        transform: scale3d(1, 1, 1);
    }

    30% {
        transform: scale3d(1.25, 0.75, 1);
    }

    40% {
        transform: scale3d(0.75, 1.25, 1);
    }

    50% {
        transform: scale3d(1.15, 0.85, 1);
    }

    65% {
        transform: scale3d(0.95, 1.05, 1);
    }

    75% {
        transform: scale3d(1.05, 0.95, 1);
    }

    100% {
        transform: scale3d(1, 1, 1);
    }
}
</style>