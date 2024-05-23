<template>
    <div>
        <el-row class="BL_title">
            <div class="viewTitle tracking-in-expand" style="padding-top: 3px">血糖数据图</div>
        </el-row>

        <div class="filter-drug-box">
            <el-card class="box-card">
                <el-row>
                    <el-col :span="2" class="text item">范围：</el-col>
                    <el-col :span="22" class="text select-item">
                        <el-radio-group v-model="category">
                            <el-radio :label="0" class="option-box" @click="selectDate">日</el-radio>
                            <el-radio :label="1" class="option-box" @click="selectDate">周</el-radio>
                            <el-radio :label="2" class="option-box" @click="selectDate">月</el-radio>
                        </el-radio-group>
                    </el-col>
                </el-row>
            </el-card>
        </div>
        <!-- 弹窗内容 -->
        <el-dialog title="选择查看日期" v-model="dialogVisible" width="45%">
            <el-form-item label="开始日期" required>
                <el-col>
                    <el-form-item prop="startDate" style="margin-bottom: 0">
                        <el-date-picker type="date" format="YYYY/MM/DD" value-format="YYYY/MM/DD" placeholder="选择日期"
                                        v-model="startDate" style="width: 100%">
                        </el-date-picker>
                    </el-form-item>
                </el-col>
            </el-form-item>

            <el-form-item>
                <el-button @click="dialogVisible=false">取消</el-button>
                <el-button type="primary" @click="submitDate">提交</el-button>
            </el-form-item>

        </el-dialog>

    </div>
</template>

<script>
export default {
    name: "glycemia.vue",
    data(){
        return{
            category: 0,
            dialogVisible: false,
            dialogMessage: '',
            startDate:'',

        }
    },
    methods:{
        selectDate(){
            this.dialogVisible=true;
        },
        submitDate(){
            this.dialogVisible=false;
            console.log(this.startDate)
        }
    }
}
</script>

<style scoped>
.BL_title{
    font-size: 20px;
    color: #000000;
    margin-left: 5%;
    padding-top: 20px;
    margin-bottom: 70px;
}
.viewTitle {
    background-image: linear-gradient(96.14deg,
    rgba(0, 191, 168, 1) 0%,
    #0093bf 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    text-align: left;
    font: 600 32px "Poppins", sans-serif;
}
.tracking-in-expand {
    -webkit-animation: tracking-in-expand 1s cubic-bezier(0.215, 0.610, 0.355, 1.000) both;
    animation: tracking-in-expand 1s cubic-bezier(0.215, 0.610, 0.355, 1.000) both;
}
.text {
    font-size: 16px;
    text-align: justify;
    text-justify: distribute-all-lines;
    /*ie6-8*/
    text-align-last: justify;
    /* ie9*/
    -moz-text-align-last: justify;
    /*ff*/
    -webkit-text-align-last: justify;
    /*chrome 20+*/
}

.item {
    padding-top: 5px;
    padding-bottom: 10px;
}

.select-item {
    padding-top: 0px;
}

.box-card {
    width: 90%;
    margin-left: 5%;
    margin-right: 5%;
    margin-top: 1.5%;
}

.option-box {
    font-size: 16px;
    margin-right: 40px;
    margin-left: 10px;
}

.result_title {
    margin-left: 7%;
    margin-top: 1%;
}

.result_box {
    width: 90%;
    margin-left: 5%;
    margin-right: 5%;
}

.search-box {
    margin-top: 10px;
    margin-bottom: 10px;
    width: 50%;
}

.container input {
    position: absolute;
    opacity: 0;
    cursor: pointer;
    height: 0;
    width: 0;
}
</style>