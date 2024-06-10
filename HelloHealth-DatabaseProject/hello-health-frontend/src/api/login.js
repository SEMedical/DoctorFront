// 封装所有和用户相关的接口函数，只被/store/user.js调用
import request from '@/util/http'

export const loginAPI = async (userInfo) => {
	try {
		console.log('userInfo', userInfo);
		const response = await request({
			url: '/login/pass',
			method: 'POST',
			data: userInfo,
		});
		console.log('loginAPI', response);
		return response;
	} catch (error) {
		console.error('验证失败:', error);
		throw error;
	}
};

export default loginAPI;