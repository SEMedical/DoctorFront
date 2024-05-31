<template>
    <div class="wrapper">
        <!--展示信息的分栏，分栏1：患者基本信息与发送消息按钮-->
        <div>
            <el-card class="cardStyle">
                <el-descriptions class="margin-top" title="基本信息" :column="3" :size="size" border>

                </el-descriptions>
            </el-card>
        </div>
        <!--展示信息的分栏，分栏2：血糖情况-->
        <div>
            <el-card class="cardStyle">
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

                <div>
                    <div id="main" style="width: 600px; height: 400px"></div>
                </div>
            </el-card>
        </div>
        <!--展示信息的分栏，分栏3：运动情况-->

    </div>
</template>

<script>
import * as echarts from 'echarts';
import ECharts from 'vue-echarts';
import {ref} from "vue";
import axios from "axios";

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
            option:null,
            highStatistic:ref([]),        // 存储高血糖概率值
            normalStatistic: ref([]),   //存储正常血糖概率值
            lowStatistic: ref([]),    //存储低血糖概率值
            //存储当周的血糖数据
            weeklyBloodSugar:[],
            dayBloodSugar:[],
            monthBloodSugar:[],
        }
    },
    mounted(){
        this.option = this.setOptions();
        //this.$nextTick(() => {
          //  this.$refs.chart.init();
        //});
        //this.getTodayBloodSugarData();  // 默认显示当天的血糖曲线
        this.drawChart()
    },
    methods:{
        drawChart() {
            console.log("echarts")
            // 基于准备好的dom，初始化echarts实例  这个和上面的main对应
            let myChart = echarts.init(document.getElementById("main"));
            // 指定图表的配置项和数据
            let option = {
                title: {
                    text: "ECharts 入门示例",
                },
                tooltip: {},
                legend: {
                    data: ["销量"],
                },
                xAxis: {
                    data: ["衬衫", "羊毛衫", "雪纺衫", "裤子", "高跟鞋", "袜子"],
                },
                yAxis: {},
                series: [
                    {
                        name: "销量",
                        type: "bar",
                        data: [5, 20, 36, 10, 10, 20],
                    },
                ],
            };
            // 使用刚指定的配置项和数据显示图表。
            myChart.setOption(option);
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
                            date:this.startDate
                        }
                    }).then(response => {
                        let responseObj = response.json
                        this.highStatistic = response.response.highSta.toFixed(2);
                        this.normalStatistic = response.response.normalSta.toFixed(2);
                        this.lowStatistic =response.response.lowSta.toFixed(2);
                        this.dayBloodSugar =[];
                        response.response.entry.forEach(item => {
                            const time = Object.keys(item)[0];
                            const value = item [time];
                            this.dayBloodSugar.push({ time: time, value: value });
                        });
                        // 获取数据完毕，接下来进行绘图
                        this.printLineChart();
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
                            startDate:this.startDate
                        }
                    }).then(response => {
                        let responseObj = response.json
                        this.highStatistic =response.response.hyperglycemiaPercentage.toFixed(2);
                        this.lowStatistic = response.response.hypoglycemiaPercentage.toFixed(2);
                        this.normalStatistic = response.response.euGlycemiaPercentage.toFixed(2);
                        this.weeklyBloodSugar=[];
                        response.response.data.forEach(item=>{
                                const time=Object.keys(item)[0];
                                const value=item[time];

                                console.log("Time"+time);
                                const entry = {
                                    min_val: value.minValue,
                                    max_val: value.maxValue,
                                    time: value.time
                                };
                                this.weeklyBloodSugar.push(entry);
                            }
                        );
                        // 获取数据完毕，接下来进行绘图
                        this.printLineChart();
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
                            startDate:this.startDate
                        }
                    }).then(response =>{
                        let responseObj = response.json
                        this.highStatistic =response.response.hyperglycemiaPercentage.toFixed(2);
                        this.normalStatistic = response.response.euGlycemiaPercentage.toFixed(2);
                        this.lowStatistic = response.response.hypoglycemiaPercentage.toFixed(2);
                        this.monthBloodSugar = [];
                        response.response.data.forEach(item=>{
                                const time=Object.keys(item)[0];
                                const value=item[time];

                                console.log("Time"+time);
                                const entry = {
                                    min_val: value.minValue,
                                    max_val: value.maxValue,
                                    time: value.time
                                };
                                this.monthBloodSugar.push(entry);
                            }
                        );
                        this.monthBloodSugar.forEach(item=>{
                            console.log(Object.keys(item)[0]);
                        })
                        // 获取数据完毕，接下来进行绘图
                        this.printLineChart();
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
        setOptions(){
            // 配置echarts折线图
            let base = +new Date(1968, 9, 3);
            let oneDay = 24 * 3600 * 1000;
            let date = [];
            let data = [Math.random() * 300];
            for (let i = 1; i < 20000; i++) {
                var now = new Date((base += oneDay));
                date.push([now.getFullYear(), now.getMonth() + 1, now.getDate()].join('/'));
                data.push(Math.round((Math.random() - 0.5) * 20 + data[i - 1]));
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
                    text: 'Large Area Chart'
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
                    data: date
                },
                yAxis: {
                    type: 'value',
                    boundaryGap: [0, '100%']
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
                        name: 'Fake Data',
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
                        data: data
                    }
                ]
            };
            return option;
        },
        getTodayBloodSugarData(){
            // 获取血糖数据
            axios.get("/api/glycemia/chart",{
                params:{
                    type:'realtime',
                    date:this.startDate
                }
            }).then(response =>{
                let responseObj = response.json
                this.dayBloodSugar.value =response.response;
                response.response.forEach(item=>{
                        const time=Object.keys(item)[0];
                        const value=item[time];
                        this.dayBloodSugar.push({ time: time, value: value });
                    }
                );
                const val=item[time];
                console.log("Response****"+this.dayBloodSugar);
                // 获取数据完毕，接下来进行绘图
                this.printLineChart();
            }).catch(error => {
                console.error('获取本日血糖数据时出错：' + error);
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
        printLineChart() {
            // 基于准备好的dom，初始化echarts实例
            var myChart = this.$echarts.init(document.getElementById('main'));

            // 指定图表的配置项和数据
            var option = {
                title: {
                    text: 'ECharts 入门示例'
                },
                tooltip: {},
                legend: {
                    data:['销量']
                },
                xAxis: {
                    data: ["衬衫","羊毛衫","雪纺衫","裤子","高跟鞋","袜子"]
                },
                yAxis: {},
                series: [{
                    name: '销量',
                    type: 'bar',
                    data: [5, 20, 36, 10, 10, 20]
                }]
            };

            // 使用刚指定的配置项和数据显示图表。
            myChart.setOption(option);
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
</style>