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
                <el-descriptions class="margin-top" :column="2" :size="size"
                    style="margin-top: 10px;width: 80%;margin-left: 50px" border>
                    <template>
                        <el-descriptions-item>
                            <template #label>
                                <div class="cell-item">
                                    姓名：
                                </div>
                            </template>
                            {{ this.patientMsg.name }}
                        </el-descriptions-item>
                        <el-descriptions-item>
                            <template #label>
                                <div class="cell-item">
                                    性别：
                                </div>
                            </template>
                            {{ this.patientMsg.gender }}
                        </el-descriptions-item>
                        <el-descriptions-item>
                            <template #label>
                                <div class="cell-item">
                                    年龄：
                                </div>
                            </template>
                            {{ this.patientMsg.age }}
                        </el-descriptions-item>
                        <el-descriptions-item>
                            <template #label>
                                <div class="cell-item">
                                    联系方式：
                                </div>
                            </template>
                            {{ this.patientMsg.phone_number }}
                        </el-descriptions-item>
                        <el-descriptions-item>
                            <template #label>
                                <div class="cell-item">
                                    身高：
                                </div>
                            </template>
                            {{ this.patientMsg.height }}
                        </el-descriptions-item>
                        <el-descriptions-item>
                            <template #label>
                                <div class="cell-item">
                                    体重：
                                </div>
                            </template>
                            {{ this.patientMsg.weight }}
                        </el-descriptions-item>
                        <el-descriptions-item>
                            <template #label>
                                <div class="cell-item">
                                    糖尿病类型：
                                </div>
                            </template>
                            {{ this.patientMsg.diabetesType }}
                        </el-descriptions-item>
                        <el-descriptions-item>
                            <template #label>
                                <div class="cell-item">
                                    确诊年份：
                                </div>
                            </template>
                            {{ this.patientMsg.diagnosisYear }}
                        </el-descriptions-item>
                        <el-descriptions-item>
                            <template #label>
                                <div class="cell-item">
                                    并发症：
                                </div>
                            </template>
                            {{ this.patientMsg.complications }}
                        </el-descriptions-item>
                        <el-descriptions-item>
                            <template #label>
                                <div class="cell-item">
                                    家族病史：
                                </div>
                            </template>
                            {{ this.patientMsg.familyHistory }}
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
                                <el-date-picker type="date" format="YYYY/MM/DD" value-format="YYYY/MM/DD"
                                    placeholder="选择日期" v-model="startDate" style="width: 100%"
                                    :disabled-date="disabledDate">
                                </el-date-picker>
                            </el-form-item>
                        </el-col>
                    </el-form-item>

                    <el-form-item>
                        <el-button @click="dialogVisible = false">取消</el-button>
                        <el-button type="primary" @click="submitDate">提交</el-button>
                    </el-form-item>

                </el-dialog>

                <div class="BDGraphic">
                    <div id="main" style="width: 100%; height: 500px"></div>
                    <div class="statistic">
                        高血糖占比：{{ this.highStatistic }}%，正常血糖占比：{{ this.normalStatistic }}%，低血糖占比：{{ this.lowStatistic
                        }}%
                    </div>
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
import { getPatientInfo,getDayBloodSugarData,getWeekOrMonthBloodSugarData } from '@/api/doctor';
//import axios from "axios";
import { ref } from "vue";
import ECharts from 'vue-echarts';
import router from "../router";
import axios from "axios";
import * as echarts from "echarts";

export default {
    name: "glycemia.vue",
    components: {
        ECharts
    },
    data() {
        return {
            category: 0,
            dialogVisible: false,
            dialogMessage: '',
            startDate: this.getCurrentDate(),   // 默认为当天日期
            highStatistic: ref([]),        // 存储高血糖概率值
            normalStatistic: ref([]),   //存储正常血糖概率值
            lowStatistic: ref([]),    //存储低血糖概率值
            bloodSugar: [],
            seriesName: "Blood Sugar",
            sportsData: [],
            patientId: ref([]),
            patientMsg: {
                name: '',    // 患者姓名
                gender: '',   // 患者性别
                phone_number: '', // 患者联系方式
                age: 0,     // 患者年龄
                height: '',   // 患者身高
                weight: '',   // 患者体重
                diabetesType: '',   // 患者糖尿病类型
                diagnosisYear: 0,   // 患者糖尿病确诊年份
                complications: '',  // 患者所患糖尿病综合症
                familyHistory: '',  // 患者家族患病史
            },
        }
    },
    mounted() {
        this.getParams()
        this.getPatientMsg()
        this.getTodayBloodSugarData()
        //this.getSportsData()
    },
    watch: {
        '$route'(to, from) {
            //这里to和from代表新旧路由对象
            this.getParams();
        }
    },
    methods: {
        getParams() {   // 从router里获取患者ID
            this.patientId = this.$route.params.patientId;
            console.log("访问的患者的ID为：", this.patientId)
            this.getTodayBloodSugarData()
            this.getSportsData()
            this.getPatientMsg()
        },
        messageClicked(patientId) {
            console.log("发送信息患者ID：", this.patientId)
            router.push(`/Message/${patientId}`);
        },
        selectDate() {
            this.dialogVisible = true;
        },
        async submitDate() {
            this.dialogVisible = false;
            console.log(this.startDate)
            switch (this.category) {
                case 0: {
                    // 代表选择了“日”
                    try {
                        const response = await getDayBloodSugarData(this.startDate,this.patientId)
                        let responseObj = response;
                        console.log("患者某日血糖 responseObj 为：", responseObj);
                        this.highStatistic = responseObj.response.highSta;
                        console.log("524643",this.highStatistic)
                        this.normalStatistic = responseObj.response.normalSta;
                        this.lowStatistic = responseObj.response.lowSta;
                        this.bloodSugar = [];
                        responseObj.response.entry.forEach(item => {
                            console.log("daytime:", item.time)
                            console.log("dayvalue:", item.value)
                            const time = item.time; // 直接访问 item 对象的 time 属性
                            const value = item.value; // 直接访问 item 对象的 value 属性
                            this.bloodSugar.push({ time: time, value: value });
                        });
                        // 获取数据完毕，接下来进行绘图
                        this.drawBDChart();
                    } catch (error) {
                        console.error('获取患者日血糖信息时出错：', error);
                        if (error.network) return;
                        error.defaultHandler();
                    }
                    break;
                }
                case 1: {
                    // 代表选择了“周”
                    try {
                        const response = await getWeekOrMonthBloodSugarData('week',this.startDate,this.patientId)
                        let responseObj = response;
                        console.log("responseObj.response:", responseObj)
                        console.log("responseObj.response.hyperPercentage:", responseObj.response.hyper_percent)
                        this.highStatistic = responseObj.response.hyper_percent.toFixed(2);
                        this.lowStatistic = responseObj.response.hypo_percent.toFixed(2);
                        this.normalStatistic = responseObj.response.eu_percent.toFixed(2);
                        this.bloodSugar = [];
                        responseObj.response.entry.forEach(item => {
                            console.log("weektime:", item.time)
                            console.log("min value:", item.min_val)
                            console.log("max value:", item.max_val)
                            const time = item.time; // 直接访问 item 对象的 time 属性
                            const min_val = item.min_val; // 直接访问 item 对象的 value 属性
                            const max_val = item.max_val;
                            this.bloodSugar.push({ time: time, min_val: min_val, max_val: max_val });
                        });
                        // 获取数据完毕，接下来进行绘图
                        this.drawBDChart();
                    } catch (error) {
                        console.error('获取患者周血糖信息时出错：', error);
                        if (error.network) return;
                        error.defaultHandler();
                    }
                    break;
                }
                case 2: {
                    // 代表选择了“月”
                    try {
                        const response = await getWeekOrMonthBloodSugarData('month',this.startDate,this.patientId)
                        let responseObj = response;
                        this.highStatistic = responseObj.response.hyper_percent.toFixed(2);
                        this.lowStatistic = responseObj.response.hypo_percent.toFixed(2);
                        this.normalStatistic = responseObj.response.eu_percent.toFixed(2);
                        this.bloodSugar = [];
                        responseObj.response.entry.forEach(item => {
                            console.log("month time:", item.time)
                            console.log("min value:", item.min_val)
                            console.log("max value:", item.max_val)
                            const time = item.time; // 直接访问 item 对象的 time 属性
                            const min_val = item.min_val; // 直接访问 item 对象的 value 属性
                            const max_val = item.max_val;
                            this.bloodSugar.push({ time: time, min_val: min_val, max_val: max_val });
                        });
                        // 获取数据完毕，接下来进行绘图
                        this.drawBDChart();
                    } catch (error) {
                        console.error('获取患者月血糖信息时出错：', error);
                        if (error.network) return;
                        error.defaultHandler();
                    }
                    break;
                }
                default: {
                    alert("请重新选择日期！")
                }
            }
        },
        async getTodayBloodSugarData() {
            try {
                const response = await getDayBloodSugarData(this.startDate,this.patientId)
                let responseObj = response;
                console.log("患者今日血糖 responseObj 为：", responseObj.response.highSta);
                this.highStatistic = responseObj.response.highSta.toFixed(2);
                this.normalStatistic = responseObj.response.normalSta.toFixed(2);
                this.lowStatistic = responseObj.response.lowSta.toFixed(2);
                this.bloodSugar = [];
                responseObj.response.entry.forEach(item => {
                    console.log("daytime:", item.time)
                    console.log("dayvalue:", item.value)
                    const time = item.time; // 直接访问 item 对象的 time 属性
                    const value = item.value; // 直接访问 item 对象的 value 属性
                    this.bloodSugar.push({ time: time, value: value });
                });
                // 获取数据完毕，接下来进行绘图
                this.drawBDChart();
            } catch (error) {
                //console.error('获取患者日血糖信息时出错：', error);
                if (error.network) return;
                error.defaultHandler();
            }
        },
        getCurrentDate() {
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
            let option = this.setOptions()
            // 使用刚指定的配置项和数据显示图表。
            myChart.setOption(option);
        },
        setOptions() {
            // 配置echarts折线图
            let timeArray = []   // 存储横坐标：时间
            let valueArray = []   // 存储纵坐标：血糖值；在周/月情况下，存储最高血糖值
            let minValue = []   // 存储周/月情况下最低血糖值

            switch (this.category) {
                case 0: {
                    // 日记录
                    console.log("Graphic:dayBloodSugar")
                    timeArray = this.bloodSugar.map(entry => {    // 只保留时和分
                        let date = new Date(entry.time); // 解析时间字符串
                        return date.toLocaleTimeString('en-CA', { hour12: false, hour: '2-digit', minute: '2-digit' });
                    });
                    console.log("timeArray:", timeArray)
                    valueArray = this.bloodSugar.map(entry => entry.value)
                    console.log("valueArray", valueArray)
                    this.seriesName = "Blood Sugar"
                    break;
                }
                case 1: {
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
                    console.log("timeArray:", timeArray)
                    valueArray = this.bloodSugar.map(entry => entry.max_val)
                    console.log("max valueArray", valueArray)
                    minValue = this.bloodSugar.map(entry => entry.min_val)
                    console.log("min valueArray", minValue)
                    this.seriesName = "Maximum Blood Sugar"
                    break;
                }
                case 2: {
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
                    console.log("timeArray:", timeArray)
                    valueArray = this.bloodSugar.map(entry => entry.max_val)
                    console.log("max valueArray", valueArray)
                    minValue = this.bloodSugar.map(entry => entry.min_val)
                    console.log("min valueArray", minValue)
                    this.seriesName = "Maximum Blood Sugar"
                    break;
                }
                default: {
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
        disabledDate(date) {
            // 设置不可选的日期
            console.log("disabled")
            switch (this.category) {
                case 0: {
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
                case 1: {
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
                case 2: {
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
                default: {
                    console.log("出现了一些错误，请重新尝试！")
                }
            }
        },
        getSportsData() {
            // 获取运动数据
            console.log("get sports data")
            // 获取数据
            axios.get("/api/sports/doctor/sportRecord", {
                params: {
                    patient_id: this.patientId
                }
            }).then(response => {
                let responseObj = response.json
                console.log("sports data111:", responseObj)
                this.sportsData = responseObj.response.minute_record;
                console.log("一周内运动的分钟数：", this.sportsData);
                // 数据获取完毕，画图
                this.drawSportsChart()
            }).catch(error => {
                console.error('获取运动数据时出错：' + error);
                if (error.network) return
                error.defaultHandler();
            })
        },
        drawSportsChart() {
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
            console.log("运动横坐标：", dateArray);

            let myChart = echarts.init(document.getElementById("sports"));
            let option = {
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
                        name: "运动分钟数",
                        type: 'line',
                        showSymbol: false,
                        data: this.sportsData,
                        lineStyle: {
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
        async getPatientMsg() {
            try {
                const response = await getPatientInfo(this.patientId)
                let responseObj = response.response; // 修正为 response.data 而不是 response.json
                console.log("患者基本信息 responseObj 为：", responseObj);

                this.patientMsg.name = responseObj.name;
                this.patientMsg.age = responseObj.age;
                this.patientMsg.gender = responseObj.gender;
                this.patientMsg.phone_number = responseObj.phone_number;
                this.patientMsg.height = responseObj.height;
                this.patientMsg.weight = responseObj.weight;
                this.patientMsg.diabetesType = responseObj.diabetesType;
                this.patientMsg.diagnosisYear = responseObj.diagnosisYear;
                this.patientMsg.complications = responseObj.complications;
                this.patientMsg.familyHistory = responseObj.familyHistory;

                console.log(this.patientMsg.phone_number, this.patientMsg.age, this.patientMsg.gender, this.patientMsg.name);
            } catch (error) {
                console.error('获取患者基本信息时出错：', error);
                if (error.network) return;
                error.defaultHandler();
            }
        }
    },
}
</script>

<style>
.BL_title {
    font-size: 20px;
    color: #000000;
    margin-left: 5%;
    padding-top: 20px;
    margin-bottom: 20px;
}

.functionDesc {
    margin-top: 0px;
    margin-left: 50%;
    font-size: 20px;
}

.statistic {
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

.BDGraphic {
    margin-top: 20px;
    margin-left: 80px;
}

.sendMessage {
    margin-top: 10px;
    margin-left: 90%;
}

/*边框样式设置*/
.cardStyle {
    border-color: white;
    border-width: 2px;
    margin-bottom: 10px;
    margin-top: 10px;
}

.dialog-footer button:first-child {
    margin-right: 20px;
}

.wrapper {
    position: relative;
    width: 85%;
    margin: 0 auto;
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