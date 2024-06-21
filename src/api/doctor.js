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
            url:'/api/sports/doctor/sportRecord?patientId=${encodeURIComponent(patientId)}',
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
        console.log("尝试获取血糖数据啦，鲨了我吧")
        console.log("日期是：",date)
        console.log("患者ID是：",patientId)
        const response = await request({
            url:`/api/glycemia/doctor/dailyHistory?&date=${encodeURIComponent(date)}patient_id=${encodeURIComponent(patientId)}}`,
            method:'POST',
        })
        console.log("日血糖数据为：",response)
        return response;
    } catch (error) {
        console.error('获取血糖数据失败:', error);
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