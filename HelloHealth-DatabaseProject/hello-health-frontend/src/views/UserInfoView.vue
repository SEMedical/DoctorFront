<template>
    <!--整个页面是可以上下滚动的-->
    <div class="wrapper">
        <!--展示信息的分栏，分栏1：用户头像-->
        <div>
            <el-card class="cardStyle">
                <div class="common-layout">
                    <el-container>
                        <el-aside width="200px">
                            <div class="avatar-container">
                                <el-avatar :size="100" style="margin-left:30px;margin-top:20px;" fit="contain"
                                    :src="isLogin ? userInfo.avatarUrl : require('/static/defaultAvatar.png')"></el-avatar>
                            </div>
                            <p v-if="isLocked" class="state-locked">用户状态：已被封禁！</p>
                        </el-aside>
                    </el-container>
                </div>
            </el-card>
        </div>
        <!--展示信息的分栏，分栏2：基本信息-->
        <div v-if="isLogin">
            <el-card class="cardStyle">
                <el-descriptions class="margin-top" title="基本信息" :column="3" :size="size" border>
                    <template #extra v-if="isCurrentUser">
                        <!--点“编辑”按钮可以对用户信息进行编辑-->
                        <el-button type="primary" v-if="!isEdit" @click="edit">编辑</el-button>
                        <el-button type="primary" v-if="isEdit" @click="save">保存</el-button>
                    </template>
                    <template>
                        <el-descriptions-item>
                            <template #label>
                                <div class="cell-item">
                                    用户名：
                                </div>
                            </template>
                            <!--从数据库获取用户名，用户名不可修改-->
                            <div class="input-container">

                                <span>{{ userInfo.username }}</span>
                                <div class="highlight"></div>
                            </div>
                        </el-descriptions-item>
                        <el-descriptions-item>
                            <template #label>
                                <div class="cell-item">
                                    性别：
                                </div>
                            </template>
                            <!--从数据库获取性别-->
                            <template v-if="!isEdit">
                                <!-- 在"编辑"状态下，性别显示框是一个标签组件 -->
                                <el-tag class="input">{{ userInfo.gender }}</el-tag>
                            </template>
                            <template v-if="isEdit">
                                <!-- 在"保存"状态下，性别显示框是一个下拉框组件 -->
                                <el-select v-model="userInfo.gender">
                                    <el-option label="男" value="男"></el-option>
                                    <el-option label="女" value="女"></el-option>
                                </el-select>
                            </template>
                        </el-descriptions-item>
                        <el-descriptions-item>
                            <template #label>
                                <div class="cell-item">
                                    生日：
                                </div>
                            </template>
                            <!--从数据库获取出生日期-->

                            <template v-if="!isEdit">
                                <!-- 在"编辑"状态下，生日显示框是从数据框获取到的用户的生日信息 -->
                                <el-tag class="input">{{ userInfo.birthday }}</el-tag>
                                <!--<el-input class="birthdayStyle" v-model="userInfo.birthday" :disabled="!isEdit"></el-input>-->
                            </template>
                            <template v-if="isEdit">
                                <!-- 在"保存"状态下，生日显示框是一个时间选择框 -->
                                <el-date-picker v-model="userInfo.birthday" type="date" formate="YYYY/MM/DD"
                                    value-format="YYYY-MM-DD" placeholder="选择日期"></el-date-picker>
                            </template>
                        </el-descriptions-item>
                        <el-descriptions-item v-if="isCurrentUser">
                            <template #label>
                                <div class="cell-item">
                                    联系电话：
                                </div>
                            </template>
                            <!--从数据库获取联系电话，联系电话不可修改-->
                            <div class="input-container">
                                <!--<input type="text" name="text" class="input" placeholder="请输入联系电话"
                                       v-model="userInfo.telephone" :disabled="!isEdit">-->
                                <span>{{ userInfo.telephone }}</span>
                                <div class="highlight"></div>
                            </div>
                        </el-descriptions-item>
                        <el-descriptions-item>
                            <template #label>
                                <div class="cell-item">
                                    邮箱地址：
                                </div>
                            </template>
                            <!--从数据库获取邮箱地址-->
                            <div class="input-container">
                                <div>
                                    <input type="text" name="text" class="input" placeholder="请输入邮箱地址"
                                        v-model="userInfo.email" :disabled="!isEdit">
                                    <div class="highlight"></div>
                                </div>

                            </div>
                        </el-descriptions-item>
                        <el-descriptions-item>
                            <template #label>
                                <div class="cell-item">
                                    个人简介：
                                </div>
                            </template>
                            <!--从数据库获取个人简介-->
                            <div class="input-container">
                                <input type="text" name="text" class="input" placeholder="请输入简介"
                                    v-model="userInfo.description" :disabled="!isEdit">
                                <div class="highlight"></div>
                            </div>
                        </el-descriptions-item>
                    </template>
                </el-descriptions>
            </el-card>
        </div>
        <!--展示信息的分栏，分栏4：如果用户是医师的话，展示医师信息，否则无-->
        <div v-if="userInfo.isCertified && isLogin">
            <el-card class="cardStyle">
                <el-descriptions class="margin-top" title="医师信息" :column="3" :size="size" border>
                    <template #extra v-if="isCurrentUser">
                        <!--点“编辑”按钮弹出医师认证框-->
                        <el-button type="primary" @click="dialogVisible = true">编辑</el-button>
                        <el-dialog v-model="dialogVisible" title="医师认证" width="50%">
                            <div style="text-align: center;">
                                <p>请上传您的医师资格证照片和执业证照片</p>
                                <br><br>
                                <el-upload class="upload-demo" action="https://jsonplaceholder.typicode.com/posts/"
                                    :auto-upload="false" :on-change="handleChangeDoctor" :multiple="false"
                                    :file-list="fileList" accept="image/jpg,image/jpeg,image/png,image/gif">
                                    <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
                                    <div slot="tip" class="el-upload__tip">上传文件格式为.jpg、.jpeg、.png、.gif，且不超过
                                        2MB
                                    </div>
                                    <br><br>
                                </el-upload>
                                <el-upload class="upload-demo" action="https://jsonplaceholder.typicode.com/posts/"
                                    :auto-upload="false" :on-change="handleChangeBusiness" :multiple="false"
                                    :file-list="fileList" accept="image/jpg,image/jpeg,image/png,image/gif">
                                    <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
                                    <div slot="tip" class="el-upload__tip">上传文件格式为.jpg、.jpeg、.png、.gif，且不超过
                                        2MB
                                    </div>
                                </el-upload>
                            </div>
                            <div slot="footer" class="dialog-footer">
                                <el-button @click="dialogVisible = false">取 消</el-button>
                                <el-button type="primary" @click="submitCertification">确 定</el-button>
                            </div>
                        </el-dialog>

                    </template>
                    <el-descriptions-item>
                        <template #label>
                            <div class="cell-item">
                                职称：
                            </div>
                        </template>
                        <!--从数据库获取职称-->
                        {{ certification.professionTitle }}
                    </el-descriptions-item>
                    <el-descriptions-item>
                        <template #label>
                            <div class="cell-item">
                                科室：
                            </div>
                        </template>
                        <!--从数据库获取科室-->
                        {{ certification.department }}
                    </el-descriptions-item>
                    <el-descriptions-item>
                        <template #label>
                            <div class="cell-item">
                                医院等级：
                            </div>
                        </template>
                        <!--从数据库获取医院等级-->
                        {{ certification.hospital_rank }}
                    </el-descriptions-item>
                    <el-descriptions-item>
                        <template #label>
                            <div class="cell-item">
                                认证时间：
                            </div>
                        </template>
                        <!--从后端获取认证时间-->
                        {{ certification.date }}
                    </el-descriptions-item>
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
import axios from "axios";
import { ElMessage } from "element-plus";

export default {
    name: "UserInfoPage",
    components: { UserInfoCard, NewsBlockList, PostCard, GoToPostLink },
    data() {
        return {
            isSelf: true,

            isFollowed: false,
            followMap: new Map(), // 用来匹配关注列表的已关注和+关注
            myFollowVisible: false,
            followList: [],

            isFans: false,
            //fansMap: new Map(), // 用来匹配粉丝列表的已关注和+关注,用不到，直接用followMap不就行了
            myFansVisible: false,
            fansList: [],
            //从数据库获取的数据
            certification: {},   //认证信息
            userInfo: {},     //用户基本信息，包含numOfCoin,isCertified等信息
            userPosts: [],   // 用户上传的帖子
            isLogin: true,    //判断正在操控的用户是否处于登陆状态
            CoinRecordList: [],  //硬币记录
            CoinNum: 0,  //硬币数量
            isLocked: false,   //用户是否被封禁

            //本页面需要的一些变量，不用从数据库获取
            isEdit: false, //是否允许编辑信息
            dialogVisible: false,    //对话框是否可见
            size: 'large',

            //用户上传的，要传给数据库的一些数据
            file: null, //上传的文件对象
            doctorPic: null, // 医师资格证照片
            businessPic: null, // 执业证照片
            uploadedPhotos: 0,// 已上传的照片数量
            photoUpload: false,   //头像上传，初始为false

            fileList: [],

            isCurrentUser: true,


            // 举报信息的数据
            reportList: [],
            reportCols: [
                { prop: 'report_time', label: "举报时间" },
                { prop: 'respond_time', label: "处理时间" },
                { prop: "report_status", label: "举报状态" },
            ],
            statusMap: {
                0: "成功",
                1: "不通过",
                2: "审核中",
            },

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
                this.refresh()
            },
            immediate: true
        }
    },


    computed: {
        //判断输出文字
        authenInfo() {
            return this.isLogin ? '认证信息：' : '未登录';
        },
        //根据操控页面的用户的登陆状态来判断是显示要查看的用户信息还是“未登录”字样
        displayName() {
            if (this.isLogin) {
                return this.userInfo.username;
            } else {
                return '未登录';
            }
        },
    },
    methods: {

        refresh() {
            this.fetchReport()
            let userIdNum = parseInt(this.$route.params.userId ? this.$route.params.userId : 0);
            console.log(userIdNum);
            if (isNaN(userIdNum)) {
                this.$router.replace("/error");
                return;
            }
            axios.post('/api/UserInfo/Details', { user_id: userIdNum })
                .then(response => {
                    const responseData = response.data.data.userInfo;
                    this.userInfo = responseData
                    // 将gender的值更改为数组
                    //this.userInfo.gender = ["男", "女"]
                    // 将gender的默认值设置为从数据库获取到的性别值
                    if (this.userInfo.gender != '男' && this.userInfo.gender != '女') {
                        this.userInfo.gender = '男'
                    }
                    const responseData2 = response.data.data.certification;
                    this.certification = responseData2
                    console.log(this.certification)
                    //this.isLogin = globalData.isLogin; // 获取用户登录状态 change
                    this.followList = response.data.data.followList;
                    this.isFollowed = response.data.data.isFollowed;


                    console.log(this.isFollowed)

                    this.followList.forEach(user => {
                        this.followMap.set(user.user_id, true)
                    })

                    this.isLocked = response.data.data.isLocked;

                    this.fansList = response.data.data.fansList;


                    /* 获取用户发布的帖子 */
                    this.fetchUserPosts(this.userInfo.userID);
                    //判断是否是本人在查看信息页面，来判断该用户是否可对信息进行修改

                    //return !this.$route.params.userId;

                    let result = (userIdNum == 0) || (userIdNum == globalData.userInfo.user_id);

                    this.isCurrentUser = result;
                    if (result) {
                        axios.get("/api/HB/record")
                            .then(response => {
                                this.CoinRecordList = response.data.data.coinRecordList;
                                this.CoinNum = response.data.data.coinNum;
                            })

                        /* 举报信息 */
                        this.fetchReport()
                    }
                })
                .catch(error => {
                    if (error.network) return;
                    error.defaultHandler();
                });

        },

        goUserPage(userId) {
            this.$router.push("/user/" + userId)
        },
        onFollowBtnClick(userId) {
            if (!globalData.login) {
                ElMessage.error('请先登录!')
                this.$router.push("/login")
                return;
            }
            let isFollowed = this.followMap.get(userId)

            if (this.isFollowed || isFollowed) {
                this.unfollow(userId)
            } else {
                this.followUser(userId)
            }
        },
        unfollow(userId) {
            if (userId) {
                axios.post("/api/UserInfo/unfollowUser", { followUserID: userId })
                    .then(response => {
                        //如果后端返回的状态码是200，那么将isFollowed设置为false
                        this.followMap.set(userId, false)
                        this.refresh()
                    })
                    .catch(error => {
                        if (error.network) return;
                        error.defaultHandler();
                    });
            } else {
                axios.post("/api/UserInfo/unfollowUser", { followUserID: this.userInfo.userID })
                    .then(response => {
                        //如果后端返回的状态码是200，那么将isFollowed设置为false
                        this.isFollowed = false;
                        this.refresh()
                    })
                    .catch(error => {
                        if (error.network) return;
                        error.defaultHandler();
                    });
            }
        },
        //添加一个新的方法，用于处理关注按钮的点击事件
        followUser(userId) {

            if (userId) {
                axios.post("/api/UserInfo/followUser", { followUserID: userId })
                    .then(response => {
                        //如果后端返回的状态码是200，那么将isFollowed设置为true
                        this.followMap.set(userId, true);
                        this.refresh()
                    })
                    .catch(error => {
                        if (error.network) return;
                        error.defaultHandler();
                    });
            } else {
                axios.post("/api/UserInfo/followUser", { followUserID: this.userInfo.userID })
                    .then(response => {
                        //如果后端返回的状态码是200，那么将isFollowed设置为true
                        this.isFollowed = true;
                        this.refresh()
                    })
                    .catch(error => {
                        if (error.network) return;
                        error.defaultHandler();
                    });
            }
        },
        showPhotoUpload() {
            //显示上传头像框
            this.photoUpload = true;
        },
        /*跳转到登陆界面*/
        goToLoginPage() {
            this.$router.push('login')
        },
        /*跳转到杏仁币的流水页面函数*/
        goToCoinDetail() {
            this.$router.push('/coinDetail');
        },
        showCertificationDialog() {
            // 显示认证框
            this.dialogVisible = true;
        },
        edit() {
            this.isEdit = true;
        },
        save() {
            // 将修改后的用户信息保存到数据库
            axios.post('/api/UserInfo/modifyUserInfo', {
                gender: this.userInfo.gender,
                email: this.userInfo.email,
                birthday: this.userInfo.birthday,
                description: this.userInfo.description,
                username: this.userInfo.username,
                telephone: this.userInfo.telephone,
            })
                .then(response => {
                    // 将下拉框选中的值保存到userInfo.gender中
                    //this.userInfo.gender = this.userInfo.gender;
                    // 将下拉框选中的值保存到userInfo.birthday中
                    //this.userInfo.birthday=this.userInfo.birthday;
                    if (response.data.data.status == true) {
                        ElMessage.success("上传成功！");//这个管理员就不审核了
                        // 保存成功后将isEdit变量设置为false，禁用编辑模式
                        this.isEdit = false;
                    } else {
                        ElMessage.error("上传失败！");
                    }
                })
                .catch((error) => {
                    this.isEdit = false;
                    console.error(error);
                    ElMessage.error("上传失败！");
                });
        },
        handleChangeDoctor(file, fileList) {
            console.log(file, fileList);
            console.log("医师资格证照片");
            if (fileList.length > 1) {
                fileList.splice(0, fileList.length - 1); // 只保留最后一个文件
            }
            this.doctorPic = file.raw;
        },
        handleChangeBusiness(file, fileList) {
            console.log(file, fileList);
            console.log("执业证照片");
            if (fileList.length > 1) {
                fileList.splice(0, fileList.length - 1); // 只保留最后一个文件
            }
            this.businessPic = file.raw;
        },
        //将用户上传的医师资格证照片传给后端数据库
        submitCertification() {
            // 创建一个 FormData 对象
            const formData = new FormData();
            // 添加医师资格证照片
            if (this.doctorPic) {
                console.log("que")
                formData.set('doctorPic', this.doctorPic);
            }
            // 添加执业证照片
            if (this.businessPic) {
                console.log("pra")
                formData.set('businessPic', this.businessPic);
            }
            console.log(formData);
            // 发起一个 POST 请求，将 formData 发送给后端服务器
            axios.post('/api/UserInfo/uploadDoctorApproval', formData)
                .then(response => {
                    console.log(response.data);
                    if (response.data.data.status == true) {
                        ElMessage.success("上传成功，请等待管理员审核！");
                        this.dialogVisible = false;
                    } else {
                        ElMessage.error("上传失败！");
                    }
                })
                .catch(error => {
                    console.error(error);
                    ElMessage.error("上传失败！");
                });
        },
        handleChange(file, fileList) {
            if (fileList.length > 1) {
                fileList.splice(0, fileList.length - 1); // 只保留最后一个文件
            }
            console.log(file, fileList);
            this.file = file.raw
        },
        /*将用户上传的头像传给后端数据库*/
        submitPhoto() {
            //创建一个FormData对象
            const formData = new FormData();
            formData.append('file', this.file);
            //发起一个POST请求，将formData发送给后端服务器
            axios.post("/api/UserInfo/uploadAvatar", formData)
                .then((response) => {
                    console.log(response.data);
                    if (response.data.data.status == true) {
                        ElMessage.success("更改成功！");
                        this.photoUpload = false;
                        this.userInfo.avatarUrl = response.data.data.url;
                        globalData.userInfo.avatar_url = response.data.data.url;
                    } else {
                        ElMessage.error("更改失败！");
                    }
                })
                .catch(error => {
                    console.log(error);
                    ElMessage.error("更改失败！");
                });
        },
        /* 求获取用户发布的帖子 */
        fetchUserPosts(userID) {
            axios.post("/api/UserInfo/fetchUserPosts", {

                user_id: userID

            }).then(res => {
                this.userPosts = res.data.data.post_list;
            })
        },
        fetchReport() {
            // 获取举报信息
            axios.get(`/api/UserInfo/Report?userid=${globalData.userInfo.userId}`)
                .then((res) => {
                    this.reportList = res.data.data.reportList;
                    console.log(this.reportList)
                })
        }
    }
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