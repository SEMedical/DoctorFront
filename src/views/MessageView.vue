<template>
    <div class="wrapper">
        <div class="BorderTop">
            <div style="float: right;padding: 5px;">
                <i class="el-icon-close" style="font-size: 10px;"></i>
            </div>
            <div class="chatName" @click="returnClicked(patientId)">{{ patientName }}</div>
        </div>
        <div class="BorderMid">
            <div v-for="message in MessageData" :key="message.messageId">
                <div style="margin-left: 30px;margin-top: 15px;">
                    <div align="center" style="padding: 15px 0;">
                        <el-tag type="info" size="mini">{{ message.time }}</el-tag>
                    </div>
                    <el-row>
                        <el-col :span="21">
                            <div class="chatPop">
                                <span style="line-height: 23px;">{{ message.messageContent }}</span>
                            </div>
                        </el-col>
                        <el-col :span="2">
                            <el-avatar shape="square" :src="doctorAvatar" style="width: 35px;height: 35px;"></el-avatar>
                        </el-col>
                    </el-row>
                </div>
            </div>
        </div>
        <div class="BorderBottom">
            <div class="textArea">
                <el-input type="textarea" :autosize="{ minRows: 3, maxRows: 3 }" placeholder="" v-model="textarea"
                    resize="none" autofocus maxlength="500">
                </el-input>
            </div>
            <div class="sendButton">
                <el-button @click="send">发送</el-button>
            </div>
        </div>
    </div>
</template>

<script>
import { getMessage, sendMessage } from '@/api/doctor';
import router from "@/router";
import { ref } from "vue";

export default {
    data() {
        return {
            patientId: null,
            // 存储获取的消息数据
            MessageData: ref([]),
            patientName: '',
            doctorAvatar: '',
            textarea: '',
        };
    },
    mounted() {
        this.getParams()
        this.fetchMessageData(this.patientId);
    },
    methods: {
        getParams() {
            this.patientId = this.$route.params.patientId;
        },
        returnClicked(patientId) {
            router.push(`/Patient/${patientId}`);
        },
        async fetchMessageData(patientId) {
            try {
                const response = await getMessage(patientId);
                if (response.response) {
                    this.MessageData = response.response.messageList;
                    this.patientName = response.response.patientName;
                    this.doctorAvatar = response.response.doctorAvatar;
                }
            }
            catch (error) {
                console.error('Error fetching MessageData', error);
            }
        },
        async send() {
            try {
                const response = await sendMessage(this.patientId, this.textarea);
                if (response) {
                    console.log("消息发送成功！");
                    this.textarea = ''; // 清空对话框的内容
                    this.fetchMessageData(this.patientId); // 重新加载对话内容
                }
            }
            catch (error) {
                console.error("发送消息时出错：", error);
            }
        }
    }
};
</script>

<style>
.chatPop :hover {
    background-color: #2683f5;
}

.chatPop span {
    background-color: #2683f5;
    padding: 5px 8px;
    display: inline-block;
    border-radius: 10px;
    margin: 0px 15px 10px 10px;
    position: relative;
    border: 1px solid #E3E3E3;
    max-width: 290px;
    float: right;
    color: #fff;
}

.chatPop span::after {
    content: '';
    border: 8px solid #ffffff00;
    border-right: 8px solid #2683f5;
    position: absolute;
    top: 8px;
    right: -16px;
    transform: rotateY(180deg)
}

.chatName {
    color: #000000;
    font-size: 20px;
    float: left;
    padding-left: 30px;
    padding-top: 20px;
}

.chatName:hover {
    color: #2683f5;
    cursor: pointer;
}

.wrapper {
    width: 800px;
    height: 640px;
    margin-left: auto;
    margin-right: auto;
    margin-bottom: 10px;
    margin-top: 10px;
}

.BorderTop {
    width: 100%;
    height: 50px;
    background-color: #f5f5f5;
    border: 1px solid #e7e7e7;
    display: block;
    float: right;
}

.BorderMid {
    width: 100%;
    height: 450px;
    background-color: #f5f5f5;
    border: 1px solid #e7e7e7;
    display: block;
    float: right;
    overflow: auto;
}

.BorderBottom {
    width: 100%;
    height: 140px;
    background-color: #fff;
    border: 1px solid #eee;
    display: block;
    float: right;
}

.textArea {
    margin-left: 20px;
    margin-right: 20px;
    margin-top: 10px;
}

.sendButton {
    float: right;
    margin-top: 10px;
    margin-right: 20px;
}
</style>