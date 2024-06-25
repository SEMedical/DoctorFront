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

export const logout = async () => {
	try {
		console.log("尝试登出")
		const response = await request ({
			url:`/login/logout`,
			method:'DELETE',
		})
		console.log("已登出" + response.response)
	} catch(error) {
		console.log("登出失败" + error)
	}
}
export default loginAPI;