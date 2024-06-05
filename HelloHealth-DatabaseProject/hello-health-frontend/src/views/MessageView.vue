<template>
    <div>
        <el-row>
            <el-col :span="16">
                <!-- 显示已发送的消息 -->
                <div v-for="(message, index) in sentMessages" :key="index">
                    {{ message }}
                </div>
            </el-col>
            <el-col :span="8">
                <!-- 输入框 -->
                <el-input v-model="newMessage"></el-input>
                <!-- 发送按钮 -->
                <el-button type="primary" @click="sendMessage">发送</el-button>
            </el-col>
        </el-row>
    </div>
</template>

<script>
export default {
    data() {
        return {
            newMessage: "",
            sentMessages: [  // 已发送的信息
                "这是第一条已发送的消息",
                "这是第二条已发送的消息"
            ]
        };
    },
    methods: {
        sendMessage() {
            this.sentMessages.push(this.newMessage);
            // 在此处添加发送消息到后端的逻辑
            // 可以使用axios或fetch来实现发送消息到服务器
            // 示例代码：axios.post('/sendMessage', { message: this.newMessage });
            this.newMessage = ""; // 清空输入框
        }
    }
};
</script>
