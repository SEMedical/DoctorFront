import request from '@/util/http';

export const getDoctorInfo = async () => {
    try {
        const response = await request({
            url: '/interaction/DoctorInfo',
            method: 'GET',
        });
        console.log("医生信息", response);
        return response;
    } catch (error) {
        console.error('获取医生信息失败:', error);
        throw error;
    }
};

export const getPatientInfo = async (patientId) => {
    try {
        const response = await request({
            url: `/health/doctor/health-record?patient_id=${encodeURIComponent(patientId)}`,
            method: 'GET',
        });
        console.log("患者信息", response);
        return response;
    } catch (error) {
        console.error('获取患者信息失败:', error);
        throw error;
    }
};

export const getPatientList = async () => {
    try {
        const response = await request({
            url: '/interaction/getFollowerList',
            method: 'GET',
        });
        console.log("患者列表", response);
        return response;
    } catch (error) {
        console.error('获取患者列表失败:', error);
        throw error;
    }
};

export const getApplicationList = async () => {
    try {
        const response = await request({
            url: '/interaction/getApplicationList',
            method: 'GET',
        });
        console.log("申请列表", response);
        return response;
    } catch (error) {
        console.error('获取申请列表失败:', error);
        throw error;
    }
};

export const confirmPatient = async (messageId) => {
    try {
        const response = await request({
            url: `/interaction/confirmPatient?messageId=${encodeURIComponent(messageId)}`,
            method: 'POST',
        });
        console.error('同意申请成功:', response);
        return response;
    } catch (error) {
        console.error('同意申请失败:', error);
        throw error;
    }
};

export const discardPatient = async (messageId) => {
    try {
        const response = await request({
            url: `/interaction/discardPatient?messageId=${encodeURIComponent(messageId)}`,
            method: 'POST',
        });
        console.error('拒绝申请成功:', response);
        return response;
    } catch (error) {
        console.error('拒绝申请失败:', error);
        throw error;
    }
};

export const getMessage = async (patientId) => {
    try {
        const response = await request({
            url: `/interaction/GetMessage?patientId=${encodeURIComponent(patientId)}`,
            method: 'GET',
        });
        console.log(response);
        return response;
    } catch (error) {
        console.error('获取消息失败:', error);
        throw error;
    }
};

export const sendMessage = async (messageId, messageContent) => {
    try {
        const response = await request({
            url: `/interaction/SendMessage?messageId=${encodeURIComponent(messageId)}&messageContent=${encodeURIComponent(messageContent)}`,
            method: 'POST',
        });
        return response;
    } catch (error) {
        console.error('发送消息失败:', error);
        throw error;
    }
};

export const getSportsData = async (patientId) => {
    try {
        const response = await request({
            url:`/sports/doctor/sportRecord?patient_id=${encodeURIComponent(patientId)}`,
            method:'GET',
        })
        console.log("运动数据为：",response)
        return response;
    } catch (error) {
        console.error('获取运动数据失败:', error);
        throw error;
    }
}

export const getDayBloodSugarData = async (date,patientId) => {
    try {
        const response = await request({
            url:`/glycemia/doctor/dailyHistory?date=${encodeURIComponent(date)}&patient_id=${encodeURIComponent(patientId)}`,
            method:'GET',
        })
        console.log("日期为：",date)
        console.log("日血糖数据为：",response)
        return response;
    } catch (error) {
        console.error("获取日血糖数据失败：",error)
        throw error;
    }
}

export const getWeekOrMonthBloodSugarData = async (span,startDate,patientId) => {
    try {
        const response = await request({
            url:`/glycemia/doctor/weeklyOrMonthlyRecord?span=${encodeURIComponent(span)}&startDate=${encodeURIComponent(startDate)}&patient_id=${encodeURIComponent(patientId)}`,
            method:'GET',
        })
        console.log("跨度为：",span)
        console.log("起始时间为：",startDate)
        console.log("周/月血糖数据为：",response)
        return response;
    } catch (error) {
        console.error("获取周/月血糖数据失败：",error)
        throw error;
    }
}

export default {
    getDoctorInfo,
    getPatientInfo,
    getPatientList,
    getApplicationList,
    confirmPatient,
    discardPatient,
    getMessage,
    sendMessage,
    getDayBloodSugarData,
};