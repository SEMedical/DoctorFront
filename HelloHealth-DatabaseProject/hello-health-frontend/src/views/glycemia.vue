<template>
    <div class="wrapper">
        <!--展示信息的分栏，分栏1：患者基本信息与发送消息按钮-->
        <div>
            <el-card class="cardStyle">
                <el-row class="BL_title">
                    <div class="viewTitle tracking-in-expand" style="padding-top: 3px">基本信息</div>
                    <div style="color: #9eb4cb; " class="functionDesc">
                        您可以在这里查看患者的基本信息和给该患者发信息。
                    </div>
                </el-row>
                <el-descriptions class="margin-top" :column="2" :size="size" style="margin-top: 10px;width: 80%;margin-left: 50px" border>
                    <template>
                        <el-descriptions-item>
                            <template #label>
                                <div class="cell-item">
                                    姓名：
                                </div>
                            </template>
                            {{this.patientMsg.name}}
                        </el-descriptions-item>
                        <el-descriptions-item>
                            <template #label>
                                <div class="cell-item">
                                    性别：
                                </div>
                            </template>
                            {{this.patientMsg.gender}}
                        </el-descriptions-item>
                        <el-descriptions-item>
                            <template #label>
                                <div class="cell-item">
                                    年龄：
                                </div>
                            </template>
                            {{this.patientMsg.age}}
                        </el-descriptions-item>
                        <el-descriptions-item>
                            <template #label>
                                <div class="cell-item">
                                    联系方式：
                                </div>
                            </template>
                            {{this.patientMsg.phone_number}}
                        </el-descriptions-item>
                        <el-descriptions-item>
                            <template #label>
                                <div class="cell-item">
                                    身高：
                                </div>
                            </template>
                            {{this.patientMsg.height}}
                        </el-descriptions-item>
                        <el-descriptions-item>
                            <template #label>
                                <div class="cell-item">
                                    体重：
                                </div>
                            </template>
                            {{this.patientMsg.weight}}
                        </el-descriptions-item>
                        <el-descriptions-item>
                            <template #label>
                                <div class="cell-item">
                                    糖尿病类型：
                                </div>
                            </template>
                            {{this.patientMsg.diabetesType}}
                        </el-descriptions-item>
                        <el-descriptions-item>
                            <template #label>
                                <div class="cell-item">
                                    确诊年份：
                                </div>
                            </template>
                            {{this.patientMsg.diagnosisYear}}
                        </el-descriptions-item>
                        <el-descriptions-item>
                            <template #label>
                                <div class="cell-item">
                                    并发症：
                                </div>
                            </template>
                            {{this.patientMsg.complications}}
                        </el-descriptions-item>
                        <el-descriptions-item>
                            <template #label>
                                <div class="cell-item">
                                    家族病史：
                                </div>
                            </template>
                            {{this.patientMsg.familyHistory}}
                        </el-descriptions-item>
                    </template>
                </el-descriptions>
                <el-button plain @click="messageClicked(this.patientId)" class="sendMessage">
                    发消息
                </el-button>
            </el-card>
        </div>
        <!--展示信息的分栏，分栏2：血糖情况-->
        <div>
            <el-card class="cardStyle">
                <el-row class="BL_title">
                    <div class="viewTitle tracking-in-expand" style="padding-top: 3px">血糖数据图</div>
                    <div style="color: #9eb4cb; " class="functionDesc">
                        您可以在这里查看患者在特定时间段的的血糖数据。
                    </div>
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
                                                v-model="startDate" style="width: 100%" :disabled-date="disabledDate">
                                </el-date-picker>
                            </el-form-item>
                        </el-col>
                    </el-form-item>

                    <el-form-item>
                        <el-button @click="dialogVisible=false">取消</el-button>
                        <el-button type="primary" @click="submitDate">提交</el-button>
                    </el-form-item>

                </el-dialog>

                <div class="BDGraphic">
                    <div id="main" style="width: 100%; height: 500px"></div>
                    <div class="statistic">高血糖占比：{{this.highStatistic}}%，正常血糖占比：{{this.normalStatistic}}%，低血糖占比：{{this.lowStatistic}}%</div>
                </div>
            </el-card>
        </div>
        <!--展示信息的分栏，分栏3：运动情况-->
        <div>
            <el-card class="cardStyle" style="height: 600px">
                <el-row class="BL_title">
                    <div class="viewTitle tracking-in-expand" style="padding-top: 3px">运动周报图</div>
                    <div style="color: #9eb4cb; " class="functionDesc">
                        您可以在这里查看该患者在一周内每日的运动分钟数。
                    </div>
                </el-row>

                <div class="BDGraphic">
                    <div id="sports" style="width: 100%;height: 800px;"></div>
                </div>
            </el-card>
        </div>
    </div>
</template>

<script>
import * as echarts from 'echarts';
import ECharts from 'vue-echarts';
import {ref} from "vue";
import axios from "axios";
import router from "../router";

export default {
    name: "glycemia.vue",
    components:{
        ECharts
    },
    data(){
        return{
            category: 0,
            dialogVisible: false,
            dialogMessage: '',
            startDate:this.getCurrentDate(),   // 默认为当天日期
            highStatistic:ref([]),        // 存储高血糖概率值
            normalStatistic: ref([]),   //存储正常血糖概率值
            lowStatistic: ref([]),    //存储低血糖概率值
            bloodSugar:[],
            seriesName:"Blood Sugar",
            sportsData:[],
            patientId:null,
            patientMsg:{
                name:'',    // 患者姓名
                gender:'',   // 患者性别
                phone_number:'', // 患者联系方式
                age:0,     // 患者年龄
                height:'',   // 患者身高
                weight:'',   // 患者体重
                diabetesType:'',   // 患者糖尿病类型
                diagnosisYear:0,   // 患者糖尿病确诊年份
                complications:'',  // 患者所患糖尿病综合症
                familyHistory:'' ,  // 患者家族患病史
            }
        }
    },
    mounted(){
        this.getTodayBloodSugarData()
        this.getSportsData()
        this.getParams()
        this.getPatientMsg()
    },
    methods:{
        getParams() {   // 从router里获取患者ID
            this.patientId = this.$route.params.patientId;
            console.log("访问的患者的ID为：",this.patientId)
        },
        messageClicked(patientId) {
            console.log("发送信息患者ID：",this.patientId)
            router.push(`/Message/${patientId}`);
        },
        selectDate(){
            this.dialogVisible=true;
        },
        submitDate(){
            this.dialogVisible=false;
            console.log(this.startDate)
            switch(this.category){
                case 0:{
                    // 代表选择了“日”
                    axios.get("/api/glycemia/dailyHistory",{
                        params:{
                            date:this.startDate,
                            patient_id:this.patientId
                        }
                    }).then(response => {
                        let responseObj = response.json
                        this.highStatistic = responseObj.response.highSta.toFixed(2);
                        this.normalStatistic = responseObj.response.normalSta.toFixed(2);
                        this.lowStatistic =responseObj.response.lowSta.toFixed(2);
                        this.bloodSugar =[];
                        responseObj.response.entry.forEach(item => {
                            console.log("daytime:",item.time)
                            console.log("dayvalue:",item.value)
                            const time = item.time; // 直接访问 item 对象的 time 属性
                            const value = item.value; // 直接访问 item 对象的 value 属性
                            this.bloodSugar.push({ time: time, value: value });
                        });
                        // 获取数据完毕，接下来进行绘图
                        this.drawBDChart();
                    }).catch(error => {
                        console.error('获取日血糖数据时出错：' + error);
                        if (error.network) return
                        error.defaultHandler();
                    })
                    break;
                }
                case 1:{
                    // 代表选择了“周”
                    axios.get("/api/glycemia/weeklyOrMonthlyRecord",{
                        params:{
                            span:'week',
                            startDate:this.startDate,
                            patient_id:this.patientId
                        }
                    }).then(response => {
                        console.log("week glycemia")
                        let responseObj = response.json
                        console.log("responseObj.response:",responseObj.response)
                        console.log("responseObj.response.hyperPercentage:",responseObj.response.hyper_percent)
                        this.highStatistic =responseObj.response.hyper_percent.toFixed(2);
                        this.lowStatistic = responseObj.response.hypo_percent.toFixed(2);
                        this.normalStatistic = responseObj.response.eu_percent.toFixed(2);
                        this.bloodSugar=[];
                        responseObj.response.entry.forEach(item=>{
                            console.log("weektime:",item.time)
                            console.log("min value:",item.min_val)
                            console.log("max value:",item.max_val)
                            const time = item.time; // 直接访问 item 对象的 time 属性
                            const min_val = item.min_val; // 直接访问 item 对象的 value 属性
                            const max_val = item.max_val;
                            this.bloodSugar.push({ time: time, min_val: min_val,max_val:max_val });
                            }
                        );
                        // 获取数据完毕，接下来进行绘图
                        this.drawBDChart();
                    }).catch(error => {
                        console.error('获取周血糖数据时出错：' + error);
                        if (error.network) return
                        error.defaultHandler();
                    })
                    break;
                }
                case 2:{
                    // 代表选择了“月”
                    axios.get("/api/glycemia/weeklyOrMonthlyRecord",{
                        params:{
                            span:'month',
                            startDate:this.startDate,
                            patient_id:this.patientId
                        }
                    }).then(response =>{
                        let responseObj = response.json
                        this.highStatistic =responseObj.response.hyper_percent.toFixed(2);
                        this.lowStatistic = responseObj.response.hypo_percent.toFixed(2);
                        this.normalStatistic = responseObj.response.eu_percent.toFixed(2);
                        this.bloodSugar = [];
                        responseObj.response.entry.forEach(item=>{
                            console.log("month time:",item.time)
                            console.log("min value:",item.min_val)
                            console.log("max value:",item.max_val)
                            const time = item.time; // 直接访问 item 对象的 time 属性
                            const min_val = item.min_val; // 直接访问 item 对象的 value 属性
                            const max_val = item.max_val;
                            this.bloodSugar.push({ time: time, min_val: min_val,max_val:max_val });
                            }
                        );
                        // 获取数据完毕，接下来进行绘图
                        this.drawBDChart();
                    }).catch(error => {
                        console.error('获取月血糖数据时出错：' + error);
                        if (error.network) return
                        error.defaultHandler();
                    })
                    break;
                }
                default: {
                    alert("请重新选择日期！")
                }
            }
        },
        getTodayBloodSugarData(){
            // 获取血糖数据
            axios.get("/api/glycemia/dailyHistory",{
                params:{
                    date:this.startDate,
                    payient_id:this.patientId
                }
            }).then(response => {
                let responseObj = response.json
                this.highStatistic = responseObj.response.highSta.toFixed(2);
                this.normalStatistic = responseObj.response.normalSta.toFixed(2);
                this.lowStatistic =responseObj.response.lowSta.toFixed(2);
                this.bloodSugar =[];
                responseObj.response.entry.forEach(item => {
                    console.log("daytime:",item.time)
                    console.log("dayvalue:",item.value)
                    const time = item.time; // 直接访问 item 对象的 time 属性
                    const value = item.value; // 直接访问 item 对象的 value 属性
                    this.bloodSugar.push({ time: time, value: value });
                });
                // 获取数据完毕，接下来进行绘图
                this.drawBDChart();
            }).catch(error => {
                console.error('获取日血糖数据时出错：' + error);
                if (error.network) return
                error.defaultHandler();
            })
        },
        getCurrentDate(){
            // 获取当前日期并格式化为 YYYY-MM-DD
            const currentDate = new Date();
            const year = currentDate.getFullYear();
            const month = (currentDate.getMonth() + 1).toString().padStart(2, '0');
            const day = currentDate.getDate().toString().padStart(2, '0');
            return `${year}-${month}-${day}`;
        },
        drawBDChart() {
            console.log("echarts")

            // 基于准备好的dom，初始化echarts实例  这个和上面的main对应
            let myChart = echarts.init(document.getElementById("main"));
            // 指定图表的配置项和数据
            let option =this.setOptions()
            // 使用刚指定的配置项和数据显示图表。
            myChart.setOption(option);
        },
        setOptions(){
            // 配置echarts折线图
            let timeArray =[]   // 存储横坐标：时间
            let valueArray=[]   // 存储纵坐标：血糖值；在周/月情况下，存储最高血糖值
            let minValue = []   // 存储周/月情况下最低血糖值

            switch(this.category){
                case 0:{
                    // 日记录
                    console.log("Graphic:dayBloodSugar")
                    timeArray = this.bloodSugar.map(entry => {    // 只保留时和分
                        let date = new Date(entry.time); // 解析时间字符串
                        return date.toLocaleTimeString('en-CA', { hour12: false, hour: '2-digit', minute: '2-digit' });
                    });
                    console.log("timeArray:",timeArray)
                    valueArray = this.bloodSugar.map(entry => entry.value)
                    console.log("valueArray",valueArray)
                    this.seriesName="Blood Sugar"
                    break;
                }
                case 1:{
                    // 周记录
                    console.log("Graphic:weekBloodSugar")
                    // 使用 map 方法从 this.bloodSugar 数组中提取年月日
                    timeArray = this.bloodSugar.map(entry => {
                        // 解析时间字符串
                        let date = new Date(entry.time);
                        // 获取年月日，格式化为 'YYYY-MM-DD' 格式
                        let year = date.getFullYear();
                        let month = (date.getMonth() + 1).toString().padStart(2, '0'); // getMonth() 返回的月份是从 0 开始的
                        let day = date.getDate().toString().padStart(2, '0');
                        return `${year}-${month}-${day}`;
                    });
                    console.log("timeArray:",timeArray)
                    valueArray = this.bloodSugar.map(entry => entry.max_val)
                    console.log("max valueArray",valueArray)
                    minValue = this.bloodSugar.map(entry => entry.min_val)
                    console.log("min valueArray",minValue)
                    this.seriesName="Maximum Blood Sugar"
                    break;
                }
                case 2:{
                    // 月记录
                    console.log("Graphic:monthBloodSugar")
                    // 使用 map 方法从 this.bloodSugar 数组中提取年月日
                    timeArray = this.bloodSugar.map(entry => {
                        // 解析时间字符串
                        let date = new Date(entry.time);
                        // 获取年月日，格式化为 'YYYY-MM-DD' 格式
                        let year = date.getFullYear();
                        let month = (date.getMonth() + 1).toString().padStart(2, '0'); // getMonth() 返回的月份是从 0 开始的
                        let day = date.getDate().toString().padStart(2, '0');
                        return `${year}-${month}-${day}`;
                    });
                    console.log("timeArray:",timeArray)
                    valueArray = this.bloodSugar.map(entry => entry.max_val)
                    console.log("max valueArray",valueArray)
                    minValue = this.bloodSugar.map(entry => entry.min_val)
                    console.log("min valueArray",minValue)
                    this.seriesName="Maximum Blood Sugar"
                    break;
                }
                default:{
                    alert("加载图表出错，请重新尝试！")
                    break;
                }
            }
            let option = {
                tooltip: {
                    trigger: 'axis',
                    position: function (pt) {
                        return [pt[0], '10%'];
                    }
                },
                title: {
                    left: 'center',
                    text: 'Blood Sugar Graphic'
                },
                toolbox: {
                    feature: {
                        dataZoom: {
                            yAxisIndex: 'none'
                        },
                        restore: {},
                        saveAsImage: {}
                    }
                },
                xAxis: {
                    type: 'category',
                    boundaryGap: false,
                    data: timeArray
                },
                yAxis: {
                    type: 'value',
                    boundaryGap: [0, '100%'],
                },
                dataZoom: [
                    {
                        type: 'inside',
                        start: 0,
                        end: 10
                    },
                    {
                        start: 0,
                        end: 10
                    }
                ],
                series: [
                    {
                        name: this.seriesName,
                        type: 'line',
                        symbol: 'none',
                        sampling: 'lttb',
                        itemStyle: {
                            color: 'rgb(255, 70, 131)'
                        },
                        areaStyle: {
                            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                                {
                                    offset: 0,
                                    color: 'rgb(255, 158, 68)'
                                },
                                {
                                    offset: 1,
                                    color: 'rgb(255, 70, 131)'
                                }
                            ])
                        },
                        data: valueArray
                    },
                    {
                        name: 'Minimum Blood sugar',
                        type: 'line',
                        symbol: 'none',
                        sampling: 'lttb',
                        itemStyle: {
                            color: 'rgb(127,255,170)'
                        },
                        areaStyle: {
                            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                                {
                                    offset: 0,
                                    color: 'rgb(64,224,208)'
                                },
                                {
                                    offset: 1,
                                    color: 'rgb(127,255,170)'
                                }
                            ])
                        },
                        data: minValue
                    }
                ]
            };
            return option;
        },
        disabledDate(date){
            // 设置不可选的日期
            console.log("disabled")
            switch(this.category){
                case 0:{
                    // 选择日
                    // 获取当前日期
                    const today = new Date();
                    today.setHours(0, 0, 0, 0); // 重置时间为00:00:00，确保是当天的开始
                    // 获取当前日期减去15天的日期
                    const fifteenDaysAgo = new Date(today);
                    fifteenDaysAgo.setDate(fifteenDaysAgo.getDate() - 15);
                    // 禁用当前时间之后的日期和十五天前的日期
                    return date.getTime() > today.getTime() || date.getTime() <= fifteenDaysAgo.getTime();
                    break;
                }
                case 1:{
                    // 选择周
                    // 获取当前日期
                    const today = new Date();
                    today.setHours(0, 0, 0, 0); // 设置时间为当天的开始
                    // 获取当前日期前30天的日期
                    const thirtyDaysAgo = new Date(today);
                    thirtyDaysAgo.setDate(today.getDate() - 30);
                    // 禁用逻辑：如果日期晚于当前日期或早于当前日期前30天
                    return date.getTime() > today.getTime() || date.getTime() < thirtyDaysAgo.getTime();
                    break;
                }
                case 2:{
                    // 选择月
                    // 获取当前日期
                    const today = new Date();
                    today.setHours(0, 0, 0, 0); // 设置时间为当天的开始
                    // 获取当前日期前一年的日期
                    const oneYearAgo = new Date(today.getFullYear() - 1, today.getMonth(), today.getDate());
                    // 禁用逻辑：如果日期晚于当前日期或早于当前日期前一年
                    return date.getTime() > today.getTime() || date.getTime() < oneYearAgo.getTime();
                    break;
                }
                default:{
                    console.log("出现了一些错误，请重新尝试！")
                }
            }
        },
        getSportsData(){
            // 获取运动数据
            console.log("get sports data")
            // 获取数据
            axios.get("/api/sports/sportRecord",{
                params:{
                    patient_id:this.patientId
                }
            }).then(response => {
                let responseObj = response.json
                console.log("sports data111:",responseObj)
                this.sportsData = responseObj.response.minute_record;
                console.log("一周内运动的分钟数：",this.sportsData);
                // 数据获取完毕，画图
                this.drawSportsChart()
            }).catch(error => {
                console.error('获取运动数据时出错：' + error);
                if (error.network) return
                error.defaultHandler();
            })
        },
        drawSportsChart(){
            // 画运动周报图
            console.log("print sports graphic")
            // 获取一周内的日期
            const startDate = new Date(); // 当前日期
            const endDate = new Date(startDate);
            endDate.setDate(startDate.getDate() - 6); // 一周前的日期
            // 构建日期数组，只包含月和日
            const dateArray = [];
            while (endDate <= startDate) {
                const month = (endDate.getMonth() + 1).toString().padStart(2, '0');
                const day = endDate.getDate().toString().padStart(2, '0');
                dateArray.push(`${month}-${day}`);
                endDate.setDate(endDate.getDate() + 1); // 增加日期
            }
            console.log("运动横坐标：",dateArray);

            let myChart = echarts.init(document.getElementById("sports"));
            let option ={
                // Make gradient line here
                visualMap: [
                    {
                        show: false,
                        type: 'continuous',
                        seriesIndex: 0,
                        min: 0,
                        max: 400
                    }
                ],
                title: [
                    {
                        left: 'center',
                        text: '运动周报图'
                    }
                ],
                tooltip: {
                    trigger: 'axis'
                },
                xAxis: [
                    {
                        data: dateArray
                    }
                ],
                yAxis: [
                    {},
                ],
                grid: [
                    {
                        bottom: '60%'
                    }
                ],
                series: [
                    {
                        name:"运动分钟数",
                        type: 'line',
                        showSymbol: false,
                        data: this.sportsData,
                        lineStyle:{
                            color: '#00ff00' // 改变线条颜色
                        },
                        itemStyle: {
                            color: 'rgb(127,255,170)'
                        },
                    }
                ]
            }
            myChart.setOption(option);
        },
        getPatientMsg(){
            // 获取患者基本信息
            axios.get("/api/health/health-record",{
                params:{
                    patient_id:this.patientId
                }
            }).then(response => {
                let responseObj =response.json
                console.log("患者基本信息responseObj为：",responseObj)
                this.patientMsg.name = responseObj.result.name
                this.patientMsg.age = responseObj.result.age
                this.patientMsg.gender = responseObj.result.gender
                this.patientMsg.phone_number = responseObj.result.phone_number
                this.patientMsg.height =responseObj.result.height
                this.patientMsg.weight = responseObj.result.weight
                this.patientMsg.diabetesType = responseObj.result.diabetesType
                this.patientMsg.diagnosisYear = responseObj.result.diagnosisYear
                this.patientMsg.complications = responseObj.result.complications
                this.patientMsg.familyHistory = responseObj.result.familyHistory
                console.log(this.patientMsg.phone_number,this.patientMsg.age, this.patientMsg.gender,this.patientMsg.name)
            }).catch(error => {
                console.error('获取患者基本信息时出错：' + error);
                if (error.network) return
                error.defaultHandler();
            })
        }
    },
}
</script>

<style>
.BL_title{
    font-size: 20px;
    color: #000000;
    margin-left: 5%;
    padding-top: 20px;
    margin-bottom: 20px;
}
.functionDesc{
    margin-top: 0px;
    margin-left: 50%;
    font-size: 20px;
}
.statistic{
    margin-left: 120px;
    margin-top: 30px;
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
.BDGraphic{
    margin-top: 20px;
    margin-left: 80px;
}
.sendMessage{
    margin-top: 10px;
    margin-left: 90%;
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

.container-input {
    position: absolute;
    opacity: 0;
    cursor: pointer;
    height: 0;
    width: 0;
}
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