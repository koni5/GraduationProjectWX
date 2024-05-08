import { http } from "@/utils/http"
//小程序登录
export const postLoginAPI = (data) => {
    return http({
      method: 'POST',
      url: '/user/user/login',
      data
    })
  }