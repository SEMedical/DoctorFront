// 封装所有和用户相关的接口函数，只被/store/user.js调用
import request from '@/util/http'

export const adminRegisterAPI = async (inviteCode, name, contact, password) => {//仅用于管理员注册
	try {
		const response = await request({
			url: `/oa/register?inviteCode=${encodeURIComponent(inviteCode)}&name=${encodeURIComponent(name)}&contact=${encodeURIComponent(contact)}&password=${encodeURIComponent(password)}`,
			//url: '/oa/register',
			method: 'POST',
			//data: userInfo,
		});
		console.log('adminRegisterAPI', response);
		return response;
	} catch (error) {
		console.error('验证失败:', error);
		throw error;
	}
};

export default adminRegisterAPI;