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

export const getPatientList = async () => {
    try {
        const response = await request({
            url: '/interaction/getPatientList',
            method: 'GET',
        });
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
        return response;
    } catch (error) {
        console.error('确认申请失败:', error);
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

export default {
    getDoctorInfo,
    getPatientList,
    getApplicationList,
    confirmPatient,
    getMessage,
    sendMessage,
};