// 管理用户数据

import { defineStore } from "pinia"
import { ref } from "vue"
import { loginAPI } from "@/api/login"


export const useUserStore = defineStore('user',() => {
    const userInfo = ref({})
    // 获取用户信息并存储
    const getUserInfo = async({id,password}) => {
        const response = await loginAPI({contact: id, password})
		console.log('response:', response);
		const token = response.response.token;
		localStorage.setItem('jwt_token', token);
		userInfo.value = response;
		console.log(userInfo.value);
    }

    // 退出时清除用户信息
    const clearUserInfo = ()=> {
        userInfo.value={}
    }

    return {
        userInfo,
        getUserInfo,
        clearUserInfo
    }
},{
    persist:true,
})